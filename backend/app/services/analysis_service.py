import hashlib
from typing import List, Optional
from datetime import datetime, date
import logging

import numpy as np
import pandas as pd
from scipy import stats as scipy_stats

from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.analysis_models import (
    BatchSeriesRequest,
    BatchSeriesResponse,
    AnalyticalSeries,
    BatchStatus,
    BatchMeta,
    BatchWarning,
    SeriesValue,
    SeriesSource,
    CorrelationRequest,
    CorrelationResponse,
    CorrelationMatrixRequest,
    CorrelationMatrixResponse,
    CorrelationMatrixItem,
)
from app.services.business_map_service import get_series, series_registry, _resolve_temporality

logger = logging.getLogger(__name__)

def generate_series_id(support_type: str, object_id: str, domain: str, parameter_code: str, aggregation: str, date_from: str, date_to: str) -> str:
    # Use sha1 for stable hashing
    raw_str = f"{support_type}|{object_id}|{domain}|{parameter_code}|{aggregation}|{date_from}|{date_to}"
    return hashlib.sha1(raw_str.encode('utf-8')).hexdigest()

def get_downsampled_aggregation(date_from: date, date_to: date, requested_agg: str) -> str:
    days = (date_to - date_from).days
    if days <= 90:
        return requested_agg
    if 90 < days <= 730 and requested_agg == "raw":
        return "daily"
    if 730 < days <= 3650 and requested_agg in ["raw", "daily"]:
        return "monthly"
    if days > 3650 and requested_agg in ["raw", "daily", "monthly"]:
        return "annual"
    return requested_agg

def process_batch_series(db: Session, request: BatchSeriesRequest) -> BatchSeriesResponse:
    if len(request.series) > 20:
        raise HTTPException(status_code=422, detail="Too many series requested. Max allowed: 20.")

    requested_count = len(request.series)
    returned_count = 0
    empty_count = 0
    failed_count = 0
    
    series_results: List[AnalyticalSeries] = []
    warnings: List[BatchWarning] = []

    try:
        d_from = datetime.strptime(request.date_from, "%Y-%m-%d").date()
        d_to = datetime.strptime(request.date_to, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Expected YYYY-MM-DD")

    global_aggregation = get_downsampled_aggregation(d_from, d_to, request.aggregation)

    if global_aggregation != request.aggregation:
        warnings.append(BatchWarning(
            type="aggregation_changed",
            series_ref="global",
            message=f"Aggregation changed from {request.aggregation} to {global_aggregation} due to long date range."
        ))

    for item in request.series:
        ref_str = f"{item.support_type}|{item.object_id}|{item.parameter_code}"
        try:
            # Détection métier : pollution IDP = données ponctuelles
            is_point_measure = _resolve_temporality(item.support_type) == "POINT_MEASURE"
            request_aggregation = "raw" if is_point_measure else global_aggregation

            # We call the existing get_series logic (which internally might adjust aggregation again, but we pass our global_aggregation)
            result = get_series(
                db=db,
                support_type=item.support_type,
                object_id=item.object_id,
                parameter_code=item.parameter_code,
                date_from=d_from,
                date_to=d_to,
                aggregation=request_aggregation
            )
            
            # Map legacy AnalyticalSeries back to our new pydantic models or dictionary output
            # business_map_service.get_series returns an AnalyticalSeries schema defined in schemas/business_map.py
            # we need to transform it to our new analysis_models.AnalyticalSeries
            
            val_list = [
                SeriesValue(
                    date=v.date if isinstance(v.date, str) else v.date.isoformat(),
                    value=v.value,
                    quality_flag=None
                )
                for v in result.values
            ]

            if len(val_list) == 0:
                empty_count += 1
                warnings.append(BatchWarning(
                    type="empty_series",
                    series_ref=ref_str,
                    message="No values found for selected period."
                ))
            else:
                returned_count += 1

            if is_point_measure:
                warnings.append(BatchWarning(
                    type="point_measure",
                    series_ref=ref_str,
                    message="Pollution IDP data is point-measure only; returned as values table, not time series."
                ))

            if len(val_list) > 5000:
                warnings.append(BatchWarning(
                    type="too_many_points",
                    series_ref=ref_str,
                    message="Series exceeds 5000 points. Consider using a larger aggregation."
                ))

            # Resolve source table mapping
            # This requires inspecting the provider if possible, but we can hardcode fallback mapping based on support_type
            source_table = None
            if item.support_type == "STATION_HYDRO":
                source_table = "hydro.mesure_debit"
            elif item.support_type == "BARRAGE":
                source_table = "hydro.mesure_barrage_param"
            elif item.support_type == "STATION_METEO":
                if item.parameter_code == "PREC":
                    source_table = "meteo.mesure_precipitation"
                elif item.parameter_code == "TEMP":
                    source_table = "meteo.mesure_temperature"
                else:
                    source_table = "meteo.mesure_evaporation"
            elif item.support_type == "STATION_QUALITE":
                source_table = "qualite.mesure_qualite_riviere"
            elif item.support_type == "STATION_SENTINELLE":
                source_table = "qualite.mesure_qualite_sebou"
            elif item.support_type == "POINT_PRELEVEMENT_POLLUTION":
                source_table = "qualite.source_pollution_mesure_param"
            elif item.support_type == "SOURCE_POLLUTION":
                source_table = "api.v_pollution_sites"

            stable_id = generate_series_id(
                item.support_type, item.object_id, item.domain, item.parameter_code, 
                global_aggregation, request.date_from, request.date_to
            )

            # Build the new AnalyticalSeries
            series_obj = AnalyticalSeries(
                id=stable_id,
                support_type=item.support_type,
                object_id=item.object_id,
                object_name=result.support_name if result.support_name else "Inconnu",
                domain=item.domain,
                subdomain=result.subdomain,
                parameter_code=item.parameter_code,
                parameter_label=result.parameter_label if result.parameter_label else item.parameter_code,
                unit=result.unit,
                aggregation=result.aggregation if is_point_measure else global_aggregation,
                series_type=result.series_type if result.series_type else ("POINT_MEASURE" if is_point_measure else "TIME_SERIES"),
                data_family=result.data_family,
                measurement_context=result.measurement_context,
                date_from=request.date_from,
                date_to=request.date_to,
                values=val_list,
                source=SeriesSource(
                    endpoint="/api/v1/analysis/series/batch",
                    table=source_table,
                    refreshed_at=None
                )
            )

            series_results.append(series_obj)

        except Exception as e:
            logger.error(f"Failed to fetch series {ref_str}: {e}")
            failed_count += 1
            warnings.append(BatchWarning(
                type="unsupported_series" if "Unsupported" in str(e) else "internal_error",
                series_ref=ref_str,
                message=str(e)
            ))

    status = BatchStatus(
        requested=requested_count,
        returned=returned_count,
        empty=empty_count,
        failed=failed_count
    )

    meta = BatchMeta(
        requested=requested_count,
        returned=returned_count,
        aggregation=global_aggregation
    )

    return BatchSeriesResponse(
        series=series_results,
        warnings=warnings,
        meta=meta,
        status=status
    )


# ============================================================
# CORRELATION HELPERS
# ============================================================

def _series_to_dataframe(series: AnalyticalSeries) -> pd.DataFrame:
    """Convertit une AnalyticalSeries en DataFrame pandas (date -> value)."""
    rows = [{"date": v.date, "value": v.value} for v in series.values if v.value is not None]
    df = pd.DataFrame(rows)
    if df.empty:
        return df
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"])
    df = df.set_index("date").sort_index()
    return df


def _aggregation_to_freq(aggregation: Optional[str]) -> str:
    """Mappe une agrégation API en fréquence pandas pour l'alignement."""
    if aggregation == "annual":
        return "YS"  # year start
    if aggregation == "monthly":
        return "MS"  # month start
    if aggregation == "daily":
        return "D"
    # raw -> on aligne au jour pour tolérer des fréquences différentes
    return "D"


def _resample_to_common(series: AnalyticalSeries, aggregation: str) -> pd.Series:
    """Resample une série vers une fréquence commune (moyenne)."""
    df = _series_to_dataframe(series)
    if df.empty:
        return pd.Series(dtype=float)
    freq = _aggregation_to_freq(aggregation)
    return df["value"].resample(freq).mean().dropna()


def _match_series(
    series_results: List[AnalyticalSeries], request_item
) -> Optional[AnalyticalSeries]:
    """Retrouve la série correspondant à la requête initiale."""
    for s in series_results:
        if (
            s.support_type == request_item.support_type
            and s.object_id == request_item.object_id
            and s.parameter_code == request_item.parameter_code
        ):
            return s
    return None


def calculate_correlation(db: Session, request: CorrelationRequest) -> dict:
    """Calcule la corrélation entre les deux premières séries de la requête."""
    if len(request.series) < 2:
        return {"error": "INSUFFICIENT_SERIES", "message": "Au moins 2 séries sont requises pour calculer une corrélation."}

    batch_request = BatchSeriesRequest(
        date_from=request.date_from,
        date_to=request.date_to,
        aggregation=request.aggregation,
        series=request.series[:2],
    )

    batch_response = process_batch_series(db, batch_request)

    series_x_req = request.series[0]
    series_y_req = request.series[1]

    series_x = _match_series(batch_response.series, series_x_req)
    series_y = _match_series(batch_response.series, series_y_req)

    if series_x is None or series_y is None:
        return {
            "error": "SERIES_NOT_FOUND",
            "message": "Impossible de récupérer l'une des séries demandées.",
        }

    if series_x.series_type != "TIME_SERIES":
        return {
            "error": "NOT_TIME_SERIES",
            "message": f"La série X ({series_x_req.parameter_code}) est ponctuelle (POINT_MEASURE). La corrélation nécessite des séries temporelles.",
        }
    if series_y.series_type != "TIME_SERIES":
        return {
            "error": "NOT_TIME_SERIES",
            "message": f"La série Y ({series_y_req.parameter_code}) est ponctuelle (POINT_MEASURE). La corrélation nécessite des séries temporelles.",
        }

    # Alignement temporel : resample vers la fréquence demandée puis jointure interne
    effective_aggregation = series_x.aggregation or request.aggregation
    xs = _resample_to_common(series_x, effective_aggregation)
    ys = _resample_to_common(series_y, effective_aggregation)

    aligned = pd.concat([xs, ys], axis=1, join="inner").dropna()
    aligned.columns = ["x", "y"]

    if aligned.empty or len(aligned) < 2:
        return {
            "error": "NO_OVERLAP",
            "message": "Les deux séries n'ont pas de période commune. Impossible de calculer la corrélation.",
        }

    x_vals = aligned["x"].to_numpy(dtype=float)
    y_vals = aligned["y"].to_numpy(dtype=float)

    slope, intercept, r_value, p_value, _ = scipy_stats.linregress(x_vals, y_vals)

    if np.isnan(r_value) or np.isnan(slope):
        return {
            "error": "NO_CORRELATION",
            "message": "La corrélation n'est pas définie : une des séries est constante sur la période commune.",
        }

    r_squared = float(r_value) ** 2

    x_min, x_max = float(np.min(x_vals)), float(np.max(x_vals))
    regression_line = [
        {"x": x_min, "y": float(slope * x_min + intercept)},
        {"x": x_max, "y": float(slope * x_max + intercept)},
    ]

    return {
        "series_x": {
            "object_id": series_x.object_id,
            "parameter_code": series_x.parameter_code,
            "domain": series_x.domain,
            "support_type": series_x.support_type,
            "values": [{"date": d.isoformat(), "value": v} for d, v in xs.items()],
        },
        "series_y": {
            "object_id": series_y.object_id,
            "parameter_code": series_y.parameter_code,
            "domain": series_y.domain,
            "support_type": series_y.support_type,
            "values": [{"date": d.isoformat(), "value": v} for d, v in ys.items()],
        },
        "aligned_data": [
            {"date": d.isoformat(), "x": float(row["x"]), "y": float(row["y"])}
            for d, row in aligned.iterrows()
        ],
        "correlation": {
            "pearson_r": float(r_value),
            "r_squared": float(r_squared),
            "slope": float(slope),
            "intercept": float(intercept),
            "p_value": float(p_value),
            "n_points": len(aligned),
        },
        "regression_line": regression_line,
    }


def calculate_correlation_matrix(db: Session, request: CorrelationMatrixRequest) -> dict:
    """Calcule une matrice de corrélation Pearson entre 3 à 5 séries temporelles."""
    if len(request.series) < 3:
        return {
            "error": "INSUFFICIENT_SERIES",
            "message": "Au moins 3 séries sont requises pour calculer une matrice de corrélation.",
        }

    batch_request = BatchSeriesRequest(
        date_from=request.date_from,
        date_to=request.date_to,
        aggregation=request.aggregation,
        series=request.series,
    )

    batch_response = process_batch_series(db, batch_request)

    # Vérifier TIME_SERIES et aligner
    series_data = []
    for req_item in request.series:
        s = _match_series(batch_response.series, req_item)
        if s is None:
            return {
                "error": "SERIES_NOT_FOUND",
                "message": f"Impossible de récupérer la série {req_item.parameter_code}.",
            }
        if s.series_type != "TIME_SERIES":
            return {
                "error": "NOT_TIME_SERIES",
                "message": f"La série {req_item.parameter_code} est ponctuelle. La matrice nécessite des séries temporelles.",
            }
        effective_aggregation = s.aggregation or request.aggregation
        ts = _resample_to_common(s, effective_aggregation)
        series_data.append({"req": req_item, "series": s, "ts": ts})

    n = len(series_data)
    matrix: List[List[Optional[float]]] = [[None] * n for _ in range(n)]
    n_points: List[List[Optional[int]]] = [[None] * n for _ in range(n)]

    for i in range(n):
        for j in range(n):
            if i == j:
                matrix[i][j] = 1.0
                n_points[i][j] = len(series_data[i]["ts"])
                continue
            aligned = pd.concat([series_data[i]["ts"], series_data[j]["ts"]], axis=1, join="inner").dropna()
            if len(aligned) < 2:
                matrix[i][j] = None
                n_points[i][j] = 0
            else:
                r, _ = scipy_stats.pearsonr(
                    aligned.iloc[:, 0].to_numpy(dtype=float),
                    aligned.iloc[:, 1].to_numpy(dtype=float),
                )
                matrix[i][j] = float(r)
                n_points[i][j] = len(aligned)

    return {
        "series": [
            {
                "object_id": sd["series"].object_id,
                "parameter_code": sd["series"].parameter_code,
                "domain": sd["series"].domain,
                "support_type": sd["series"].support_type,
            }
            for sd in series_data
        ],
        "matrix": matrix,
        "n_points": n_points,
    }
