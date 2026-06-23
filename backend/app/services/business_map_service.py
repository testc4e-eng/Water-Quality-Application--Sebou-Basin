import json
from abc import ABC, abstractmethod
from datetime import date
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.business_map_models import (
    AnalyticalSeries,
    AnalyticalSeriesValue,
    BusinessMapAvailabilityItem,
    BusinessMapFeatureCollection,
    BusinessMapLayer,
    Feature,
    FeatureProperties,
)


class BaseSeriesProvider(ABC):
    @abstractmethod
    def build_query(self, object_id: str, parameter_code: str, date_from: date | None, date_to: date | None, aggregation: str) -> text:
        pass

    @abstractmethod
    def execute(self, db: Session, query: text, params: dict[str, Any]) -> list[dict[str, Any]]:
        pass

    @abstractmethod
    def format_response(self, rows: list[dict[str, Any]], support_type: str, object_id: str, parameter_code: str, aggregation: str) -> AnalyticalSeries:
        pass


class DefaultSeriesProvider(BaseSeriesProvider):
    def __init__(self, source_table: str, id_col: str, date_col: str, val_col: str, domain: str):
        self.source_table = source_table
        self.id_col = id_col
        self.date_col = date_col
        self.val_col = val_col
        self.domain = domain

    def _get_trunc_scale(self, aggregation: str) -> str:
        if aggregation == "annual":
            return "year"
        if aggregation == "monthly":
            return "month"
        if aggregation == "daily":
            return "day"
        return "day"

    def build_query(self, object_id: str, parameter_code: str, date_from: date | None, date_to: date | None, aggregation: str) -> text:
        where_clauses = [f"{self.id_col}::text = :object_id"]
        if parameter_code and self.domain != "HYDROLOGIE" and self.domain != "CLIMATOLOGIE":
            # Rough logic: only applies if there is a parameter_code column. For hydrologie (DEBIT), there is no parameter_col.
            pass
        
        if date_from:
            where_clauses.append(f"{self.date_col} >= :date_from")
        if date_to:
            where_clauses.append(f"{self.date_col} <= :date_to")
            
        where_str = " AND ".join(where_clauses)
        
        if aggregation == "raw":
            sql = f"""
                SELECT {self.date_col} AS sample_date, {self.val_col} AS val
                FROM {self.source_table}
                WHERE {where_str}
                ORDER BY {self.date_col} ASC
                LIMIT 5000
            """
        else:
            trunc = self._get_trunc_scale(aggregation)
            sql = f"""
                SELECT date_trunc(:trunc_scale, {self.date_col}) AS sample_date, avg({self.val_col}) AS val
                FROM {self.source_table}
                WHERE {where_str}
                GROUP BY 1
                ORDER BY 1 ASC
                LIMIT 5000
            """
        return text(sql)

    def execute(self, db: Session, query: text, params: dict[str, Any]) -> list[dict[str, Any]]:
        return [dict(r) for r in db.execute(query, params).mappings().all()]

    def format_response(self, rows: list[dict[str, Any]], support_type: str, object_id: str, parameter_code: str, aggregation: str) -> AnalyticalSeries:
        values = []
        for r in rows:
            dt = r["sample_date"]
            if dt:
                dt_str = dt.isoformat() if hasattr(dt, "isoformat") else str(dt)
            else:
                dt_str = ""
            values.append(AnalyticalSeriesValue(date=dt_str, value=r["val"]))
            
        return AnalyticalSeries(
            id=f"{support_type}_{object_id}_{parameter_code}",
            support_type=support_type,
            support_id=object_id,
            domain=self.domain,
            parameter_code=parameter_code,
            aggregation=aggregation,
            values=values
        )


class QualitySeriesProvider(DefaultSeriesProvider):
    def build_query(self, object_id: str, parameter_code: str, date_from: date | None, date_to: date | None, aggregation: str) -> text:
        where_clauses = [f"{self.id_col}::text = :object_id", "trim(parametre_qualite) = :parameter_code"]
        if date_from:
            where_clauses.append(f"{self.date_col} >= :date_from")
        if date_to:
            where_clauses.append(f"{self.date_col} <= :date_to")
            
        where_str = " AND ".join(where_clauses)
        
        if aggregation == "raw":
            sql = f"""
                SELECT {self.date_col} AS sample_date, {self.val_col} AS val
                FROM {self.source_table}
                WHERE {where_str}
                ORDER BY {self.date_col} ASC
                LIMIT 5000
            """
        else:
            trunc = self._get_trunc_scale(aggregation)
            sql = f"""
                SELECT date_trunc(:trunc_scale, {self.date_col}) AS sample_date, avg({self.val_col}) AS val
                FROM {self.source_table}
                WHERE {where_str}
                GROUP BY 1
                ORDER BY 1 ASC
                LIMIT 5000
            """
        return text(sql)

class BarrageSeriesProvider(DefaultSeriesProvider):
    def build_query(self, object_id: str, parameter_code: str, date_from: date | None, date_to: date | None, aggregation: str) -> text:
        where_clauses = [f"{self.id_col}::text = :object_id", "trim(parametre_code) = :parameter_code"]
        if date_from:
            where_clauses.append(f"{self.date_col} >= :date_from")
        if date_to:
            where_clauses.append(f"{self.date_col} <= :date_to")
            
        where_str = " AND ".join(where_clauses)
        
        if aggregation == "raw":
            sql = f"""
                SELECT {self.date_col} AS sample_date, {self.val_col} AS val
                FROM {self.source_table}
                WHERE {where_str}
                ORDER BY {self.date_col} ASC
                LIMIT 5000
            """
        else:
            trunc = self._get_trunc_scale(aggregation)
            sql = f"""
                SELECT date_trunc(:trunc_scale, {self.date_col}) AS sample_date, avg({self.val_col}) AS val
                FROM {self.source_table}
                WHERE {where_str}
                GROUP BY 1
                ORDER BY 1 ASC
                LIMIT 5000
            """
        return text(sql)

class PollutionSeriesProvider(DefaultSeriesProvider):
    def build_query(self, object_id: str, parameter_code: str, date_from: date | None, date_to: date | None, aggregation: str) -> text:
        # For pollution, prelevement_id -> site_id
        sql = f"""
            SELECT COALESCE(p.date_prelevement, p.date_reception) AS sample_date, m.valeur_num AS val
            FROM qualite.source_pollution_mesure_param m
            JOIN qualite.source_pollution_prelevement p ON p.id = m.prelevement_id
            WHERE p.id::text = :object_id
              AND trim(m.param_code_legacy) = :parameter_code
              {"AND COALESCE(p.date_prelevement, p.date_reception) >= :date_from" if date_from else ""}
              {"AND COALESCE(p.date_prelevement, p.date_reception) <= :date_to" if date_to else ""}
            ORDER BY COALESCE(p.date_prelevement, p.date_reception) ASC
            LIMIT 5000
        """
        return text(sql)


class SeriesProviderRegistry:
    def __init__(self):
        self._providers: dict[tuple[str, str], BaseSeriesProvider] = {}

    def register(self, support_type: str, parameter_code: str, provider: BaseSeriesProvider):
        self._providers[(support_type, parameter_code)] = provider

    def get_provider(self, support_type: str, parameter_code: str) -> BaseSeriesProvider:
        # Use a fallback by parameter if exact match fails, or by support type.
        if (support_type, parameter_code) in self._providers:
            return self._providers[(support_type, parameter_code)]
        # Fallback to a generic domain provider if registered with parameter_code='*'
        if (support_type, "*") in self._providers:
            return self._providers[(support_type, "*")]
        raise ValueError(f"Aucun provider trouvé pour le support {support_type} et le paramètre {parameter_code}")


# Singleton Registry Initialization
series_registry = SeriesProviderRegistry()
series_registry.register("STATION_HYDRO", "DEBIT", DefaultSeriesProvider("hydro.mesure_debit", "station_id", "temps", "valeur", "HYDROLOGIE"))
series_registry.register("BARRAGE", "*", BarrageSeriesProvider("hydro.mesure_barrage_param", "barrage_id", "temps", "valeur", "HYDROLOGIE"))
series_registry.register("STATION_METEO", "PREC", DefaultSeriesProvider("meteo.mesure_precipitation", "station_id", "temps", "val_observees", "CLIMATOLOGIE"))
series_registry.register("STATION_QUALITE", "*", QualitySeriesProvider("qualite.mesure_qualite_riviere", "station_id", "temps", "valeur", "QUALITE"))
series_registry.register("STATION_SENTINELLE", "*", QualitySeriesProvider("qualite.mesure_qualite_sebou", "station_id", "temps", "valeur", "QUALITE"))
series_registry.register("POINT_PRELEVEMENT_POLLUTION", "*", PollutionSeriesProvider("qualite.source_pollution_mesure_param", "prelevement_id", "temps", "valeur_num", "POLLUTION"))

def get_availability(
    db: Session,
    support_type: str | None = None,
    domain: str | None = None,
    subdomain: str | None = None,
    parameter_code: str | None = None,
    bassin_nom: str | None = None,
    recommended_v1: bool | None = None,
    data_temporality: str | None = None,
    data_family: str | None = None,
    measurement_context: str | None = None,
) -> dict[str, Any]:
    where = ["authorized_basin = 'Sebou'"] # V1 Constraint
    params: dict[str, Any] = {}

    if support_type:
        where.append("support_type = :support_type")
        params["support_type"] = support_type
    if domain:
        where.append("domain = :domain")
        params["domain"] = domain
    if subdomain:
        where.append("subdomain = :subdomain")
        params["subdomain"] = subdomain
    if parameter_code:
        where.append("parameter_code = :parameter_code")
        params["parameter_code"] = parameter_code
    if bassin_nom:
        where.append("authorized_basin = :bassin_nom")
        params["bassin_nom"] = bassin_nom
    if recommended_v1 is not None:
        where.append("recommended_v1 = :recommended_v1")
        params["recommended_v1"] = recommended_v1
    if data_temporality:
        where.append("data_temporality = :data_temporality")
        params["data_temporality"] = data_temporality
    if data_family:
        where.append("data_family = :data_family")
        params["data_family"] = data_family
    if measurement_context:
        where.append("measurement_context = :measurement_context")
        params["measurement_context"] = measurement_context

    sql = text(f"""
        SELECT * FROM api.mv_business_map_availability
        WHERE {" AND ".join(where)}
    """)
    rows = db.execute(sql, params).mappings().all()
    items = [BusinessMapAvailabilityItem(**row) for row in rows]

    available_options = {
        "supports": sorted({row["support_type"] for row in rows if row.get("measure_count", 0) > 0}),
        "domains": sorted({row["domain"] for row in rows if row.get("measure_count", 0) > 0}),
        "parameters": sorted({row["parameter_code"] for row in rows if row.get("measure_count", 0) > 0}),
    }

    return {
        "items": items,
        "total": len(items),
        "available_options": available_options,
    }


def get_features(
    db: Session,
    support_type: str | None = None,
    domain: str | None = None,
    subdomain: str | None = None,
    parameter_code: str | None = None,
    bassin_nom: str | None = None,
    bbox: str | None = None,
    limit: int = 1000,
    offset: int = 0,
    data_temporality: str | None = None,
    data_family: str | None = None,
    measurement_context: str | None = None,
) -> BusinessMapFeatureCollection:
    where = []
    params: dict[str, Any] = {"limit": limit, "offset": offset}

    if support_type:
        where.append("f.support_type = :support_type")
        params["support_type"] = support_type
    if bassin_nom:
        where.append("f.bassin_nom = :bassin_nom")
        params["bassin_nom"] = bassin_nom
    if data_temporality:
        where.append("f.attributes->>'data_temporality' = :data_temporality")
        params["data_temporality"] = data_temporality
    if data_family:
        where.append("f.attributes->>'data_family' = :data_family")
        params["data_family"] = data_family
    if measurement_context:
        where.append("f.attributes->>'measurement_context' = :measurement_context")
        params["measurement_context"] = measurement_context

    # Determine if we need to join other views
    needs_param_join = bool(parameter_code or domain or subdomain)
    
    if parameter_code:
        where.append("lv.parameter_code = :parameter_code")
        params["parameter_code"] = parameter_code
    if domain:
        where.append("a.domain = :domain")
        params["domain"] = domain
    if subdomain:
        where.append("a.subdomain = :subdomain")
        params["subdomain"] = subdomain

    if bbox:
        try:
            minx, miny, maxx, maxy = [float(item) for item in bbox.split(",")]
            where.append("f.geom && ST_MakeEnvelope(:minx, :miny, :maxx, :maxy, 4326)")
            where.append("ST_Intersects(f.geom, ST_MakeEnvelope(:minx, :miny, :maxx, :maxy, 4326))")
            params.update({"minx": minx, "miny": miny, "maxx": maxx, "maxy": maxy})
        except ValueError:
            pass
    elif support_type == "SOURCE_POLLUTION":
        raise ValueError("bbox est obligatoire pour le support SOURCE_POLLUTION")

    where_str = "WHERE " + " AND ".join(where) if where else ""

    join_str = ""
    if needs_param_join:
        join_str = """
            JOIN api.mv_business_map_last_values lv ON lv.object_id = f.object_id AND lv.support_type = f.support_type
            JOIN api.mv_business_map_availability a ON a.support_type = lv.support_type AND a.parameter_code = lv.parameter_code
        """

    sql = text(f"""
        SELECT DISTINCT
            f.object_id, f.object_name, f.object_code, f.support_type,
            f.bassin_nom, f.sous_bassin_nom, f.attributes, f.recommended_v1,
            f.geometry_geojson
            {', lv.parameter_code AS lv_parameter_code, lv.last_value AS lv_last_value' if needs_param_join else ''}
        FROM api.mv_business_map_features_v1 f
        {join_str}
        {where_str}
        LIMIT :limit OFFSET :offset
    """)

    rows = db.execute(sql, params).mappings().all()
    features = []
    for r in rows:
        latest_values: dict[str, Any] | None = None
        if needs_param_join and r.get("lv_parameter_code"):
            latest_values = {r["lv_parameter_code"]: r["lv_last_value"]}

        props = FeatureProperties(
            object_id=r["object_id"],
            object_name=r["object_name"],
            object_code=r["object_code"],
            support_type=r["support_type"],
            bassin_nom=r["bassin_nom"],
            sous_bassin_nom=r["sous_bassin_nom"],
            attributes=r["attributes"] or {},
            latest_values=latest_values,
            recommended_v1=r["recommended_v1"]
        )
        geom = r["geometry_geojson"]
        if isinstance(geom, str):
            try:
                geom = json.loads(geom)
            except Exception:
                geom = {}

        features.append(Feature(id=r["object_id"], geometry=geom, properties=props))

    return BusinessMapFeatureCollection(
        features=features,
        metadata={"count": len(features), "limit": limit, "offset": offset}
    )


def _resolve_temporality(support_type: str) -> str:
    """Règle métier : la pollution IDP est toujours ponctuelle, le reste est série temporelle par défaut."""
    if support_type in ("POINT_PRELEVEMENT_POLLUTION", "SOURCE_POLLUTION"):
        return "POINT_MEASURE"
    return "TIME_SERIES"


def _build_point_measure_response(
    support_type: str,
    object_id: str,
    parameter_code: str,
    rows: list[dict[str, Any]],
    provider: BaseSeriesProvider,
) -> AnalyticalSeries:
    values = []
    for r in rows:
        dt = r.get("sample_date")
        if dt:
            dt_str = dt.isoformat() if hasattr(dt, "isoformat") else str(dt)
        else:
            dt_str = ""
        values.append(AnalyticalSeriesValue(date=dt_str, value=r.get("val")))

    return AnalyticalSeries(
        id=f"{support_type}_{object_id}_{parameter_code}",
        support_type=support_type,
        support_id=object_id,
        domain=provider.domain,
        parameter_code=parameter_code,
        aggregation=None,
        series_type="POINT_MEASURE",
        data_family="POLLUTION_IDP" if support_type in ("POINT_PRELEVEMENT_POLLUTION", "SOURCE_POLLUTION") else None,
        measurement_context="campagne_pollution_idp" if support_type == "POINT_PRELEVEMENT_POLLUTION" else "inventaire_source_pollution" if support_type == "SOURCE_POLLUTION" else None,
        source_table=provider.source_table,
        values=values,
    )


def get_series(
    db: Session,
    support_type: str,
    object_id: str,
    parameter_code: str,
    date_from: date | None,
    date_to: date | None,
    aggregation: str,
) -> AnalyticalSeries:

    temporality = _resolve_temporality(support_type)

    # Données ponctuelles : on ignore l'agrégation et on retourne les valeurs brutes
    if temporality == "POINT_MEASURE":
        provider = series_registry.get_provider(support_type, parameter_code)
        query = provider.build_query(object_id, parameter_code, date_from, date_to, "raw")
        params = {
            "object_id": object_id,
            "parameter_code": parameter_code,
            "date_from": date_from,
            "date_to": date_to,
        }
        rows = provider.execute(db, query, params)
        return _build_point_measure_response(support_type, object_id, parameter_code, rows, provider)

    # Auto-aggregation logic based on date range (V1 rules)
    if date_from and date_to:
        days = (date_to - date_from).days
        if days > 90 and aggregation == "raw":
            aggregation = "daily"
        if days > 730 and aggregation in ["raw", "daily"]:
            aggregation = "monthly"
        if days > 3650 and aggregation in ["raw", "daily", "monthly"]:
            aggregation = "annual"

    provider = series_registry.get_provider(support_type, parameter_code)

    query = provider.build_query(object_id, parameter_code, date_from, date_to, aggregation)
    params = {
        "object_id": object_id,
        "parameter_code": parameter_code,
        "date_from": date_from,
        "date_to": date_to,
    }
    if aggregation != "raw":
        params["trunc_scale"] = provider._get_trunc_scale(aggregation) if hasattr(provider, "_get_trunc_scale") else "month"

    rows = provider.execute(db, query, params)
    series = provider.format_response(rows, support_type, object_id, parameter_code, aggregation)
    series.series_type = "TIME_SERIES"
    return series


def get_object(db: Session, support_type: str, object_id: str) -> dict[str, Any]:
    # Utilise mv_business_map_features_v1 pour obtenir les details geo/metadatas
    sql_feature = text("""
        SELECT *
        FROM api.mv_business_map_features_v1
        WHERE support_type = :support_type AND object_id = :object_id
        LIMIT 1
    """)
    feature_row = db.execute(sql_feature, {"support_type": support_type, "object_id": object_id}).mappings().first()
    
    if not feature_row:
        return {}
        
    sql_last_values = text("""
        SELECT parameter_code, last_date, last_value
        FROM api.mv_business_map_last_values
        WHERE support_type = :support_type AND object_id = :object_id
    """)
    values_rows = db.execute(sql_last_values, {"support_type": support_type, "object_id": object_id}).mappings().all()
    
    result = dict(feature_row)
    if isinstance(result.get("geometry_geojson"), str):
        try:
            result["geometry_geojson"] = json.loads(result["geometry_geojson"])
        except Exception:
            pass
    
    result["available_parameters"] = [dict(r) for r in values_rows]
    return result


def get_layers() -> list[BusinessMapLayer]:
    return [
        BusinessMapLayer(layer_id="stations_qualite", label="Stations Qualité", category="Qualité"),
        BusinessMapLayer(layer_id="stations_hydro", label="Stations Hydrométriques", category="Hydrologie"),
        BusinessMapLayer(layer_id="stations_meteo", label="Stations Météorologiques", category="Climatologie"),
        BusinessMapLayer(layer_id="barrages", label="Barrages", category="Hydrologie"),
        BusinessMapLayer(layer_id="pollutions", label="Sources de Pollution", category="Pollution"),
    ]
