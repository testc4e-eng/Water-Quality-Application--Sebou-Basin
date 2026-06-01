from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db
from app.services.regulatory_quality import classify_measurement, load_regulatory_context


router = APIRouter(prefix="/pollution", tags=["Pollution IDP DEV"])

P0_PARAMETERS = ("DBO5", "DCO", "NH4", "NO3", "MES")
P0_PARAMETER_CODES_DB = ("DBO5", "DCO", "NH4", "NO3-", "MES")


def _db_parameter_code(parameter_code: str | None) -> str | None:
    if parameter_code == "NO3":
        return "NO3-"
    return parameter_code


def _enrich_latest_results(db: Session, rows: list[dict[str, Any]]) -> None:
    regulatory_context = load_regulatory_context(db)
    for row in rows:
        latest_results = row.get("latest_results") or []
        enriched_results: list[dict[str, Any]] = []
        for result in latest_results:
            result_dict = dict(result)
            classification = classify_measurement(
                regulatory_context,
                parameter_code=result_dict.get("parameter_code"),
                value_numeric=result_dict.get("value_numeric"),
                unit=result_dict.get("unit"),
            )
            status = classification.get("status")
            result_dict.update(
                {
                    "regulatory_status": status,
                    "class_code": classification.get("class_code"),
                    "class_label": classification.get("class_label"),
                    "color": classification.get("color"),
                    "severity_order": classification.get("severity_order"),
                    "threshold": classification.get("threshold"),
                    "non_classifiable_reason": None if status == "CLASSIFIED" else classification.get("message"),
                }
            )
            enriched_results.append(result_dict)
        row["latest_results"] = enriched_results


def _feature(row: dict[str, Any]) -> dict[str, Any]:
    geometry = row.pop("geometry", None)
    return {
        "type": "Feature",
        "id": str(row.get("site_id")),
        "geometry": geometry,
        "properties": row,
    }


@router.get("/sites.geojson")
def get_pollution_sites_geojson(
    parameter_code: str | None = Query(None, description="Optional P0 parameter filter"),
    source_type_code: str | None = Query(None),
    commune: str | None = Query(None),
    limit: int = Query(5000, ge=1, le=10000),
    db: Session = Depends(get_climate_db),
) -> dict[str, Any]:
    """Read-only DEV GeoJSON layer for MapLibre pollution sites."""

    where = ["s.geometry IS NOT NULL"]
    params: dict[str, Any] = {"limit": limit}

    if source_type_code:
        where.append("s.source_type_code = :source_type_code")
        params["source_type_code"] = source_type_code
    if commune:
        where.append("s.commune = :commune")
        params["commune"] = commune
    db_parameter_code = _db_parameter_code(parameter_code)
    if db_parameter_code:
        where.append(
            """
            EXISTS (
                SELECT 1
                FROM api.v_pollution_latest_results r
                WHERE r.site_id = s.site_id
                  AND r.parameter_code = :parameter_code
            )
            """
        )
        params["parameter_code"] = db_parameter_code

    sql = text(
        f"""
        SELECT
            s.site_id::text AS site_id,
            s.site_code,
            s.site_name,
            s.commune,
            s.province,
            s.bassin,
            s.source_origin,
            s.validation_status,
            s.source_type_code,
            s.source_type_label,
            s.pollution_category_code,
            s.pollution_category_label,
            s.longitude,
            s.latitude,
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'parameter_code', r.parameter_code,
                        'parameter_label', r.parameter_label,
                        'value_numeric', r.value_numeric,
                        'value_text', r.value_text,
                        'unit', r.unit,
                        'sample_date', r.sample_date,
                        'quality_flag', r.quality_flag
                    )
                    ORDER BY r.parameter_code
                )
                FROM api.v_pollution_latest_results r
                WHERE r.site_id = s.site_id
                  AND r.parameter_code = ANY(:p0_parameters)
            ) AS latest_results,
            s.geometry
        FROM api.v_pollution_sites s
        WHERE {" AND ".join(where)}
        ORDER BY s.validation_status, s.source_type_code, s.site_name NULLS LAST
        LIMIT :limit
        """
    )
    params["p0_parameters"] = list(P0_PARAMETER_CODES_DB)

    rows = [dict(row) for row in db.execute(sql, params).mappings().all()]
    _enrich_latest_results(db, rows)
    features = [_feature(row) for row in rows]
    return jsonable_encoder(
        {
            "type": "FeatureCollection",
            "features": features,
            "metadata": {
                "source_view": "api.v_pollution_sites",
                "latest_results_view": "api.v_pollution_latest_results",
                "p0_parameters": P0_PARAMETERS,
                "regulatory_classification": "metadata.qualite_*_reglementaire DEV",
                "count": len(features),
            },
        }
    )


@router.get("/latest-results")
def get_pollution_latest_results(
    parameter_code: str | None = Query(None),
    commune: str | None = Query(None),
    limit: int = Query(1000, ge=1, le=5000),
    db: Session = Depends(get_climate_db),
) -> dict[str, Any]:
    where = ["geometry IS NOT NULL"]
    params: dict[str, Any] = {"limit": limit}

    db_parameter_code = _db_parameter_code(parameter_code)
    if db_parameter_code:
        where.append("parameter_code = :parameter_code")
        params["parameter_code"] = db_parameter_code
    if commune:
        where.append("commune = :commune")
        params["commune"] = commune

    sql = text(
        f"""
        SELECT
            site_id::text,
            site_code,
            site_name,
            commune,
            campagne_code,
            parameter_code,
            parameter_label,
            sample_date,
            value_numeric,
            value_text,
            unit,
            quality_flag,
            geometry
        FROM api.v_pollution_latest_results
        WHERE {" AND ".join(where)}
        ORDER BY sample_date DESC NULLS LAST, site_name, parameter_code
        LIMIT :limit
        """
    )
    rows = [dict(row) for row in db.execute(sql, params).mappings().all()]
    return jsonable_encoder(
        {
            "status": "success",
            "count": len(rows),
            "filters": {
                "parameter_code": parameter_code,
                "commune": commune,
                "limit": limit,
            },
            "data": rows,
            "metadata": {
                "source_view": "api.v_pollution_latest_results",
                "p0_parameters": P0_PARAMETERS,
            },
        }
    )
