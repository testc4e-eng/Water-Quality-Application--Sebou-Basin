from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.regulatory_quality import classify_measurement, load_regulatory_context


P0_PARAMETERS = ("DBO5", "DCO", "NH4", "NO3", "NO3-", "O2_DISS", "pH", "Cond")


@dataclass(frozen=True)
class MapSupportConfig:
    support: str
    label: str
    source: str
    id_column: str
    name_column: str
    geom_column: str
    entity_type: str
    category: str
    extra_columns: tuple[str, ...] = ()
    geometry_is_geojson: bool = False
    longitude_column: str | None = None
    latitude_column: str | None = None
    source_backend: str = ""
    display_label: str = ""
    description: str = ""
    available_parameters: tuple[str, ...] = ()
    geometry_status: str = "AVAILABLE"
    data_status: str = "AVAILABLE"
    legacy_support: bool = False
    support_group: str | None = None
    support_type: str | None = None
    where_sql: str | None = None


SUPPORTS: dict[str, MapSupportConfig] = {
    "idp_pollution": MapSupportConfig(
        support="idp_pollution",
        label="IDP pollution",
        source="api.v_pollution_sites",
        id_column="site_id",
        name_column="site_name",
        geom_column="geometry",
        entity_type="pollution_site",
        category="pollution",
        extra_columns=("commune", "province", "bassin", "source_type_label", "validation_status"),
        geometry_is_geojson=True,
        longitude_column="longitude",
        latitude_column="latitude",
        source_backend="api.v_pollution_sites",
        display_label="IDP pollution",
        description="Support technique legacy conservé pour compatibilité.",
        available_parameters=("DBO5", "DCO", "NH4", "NO3", "MES"),
        legacy_support=True,
    ),
    "barrages": MapSupportConfig(
        support="barrages",
        label="Barrages",
        source="api.v_barrage_dimension",
        id_column="barrage_id",
        name_column="barrage_nom",
        geom_column="geom",
        entity_type="barrage",
        category="support_hydraulique",
        extra_columns=("nom_oued", "statut", "type_barrage"),
        source_backend="api.v_barrage_dimension",
        display_label="Barrages",
        description="Support technique legacy conservé pour compatibilité.",
        legacy_support=True,
    ),
    "stations_qualite": MapSupportConfig(
        support="stations_qualite",
        label="Stations qualite",
        source="infra.stations_mesure",
        id_column="id",
        name_column="nom",
        geom_column="geom",
        entity_type="station_qualite",
        category="qualite",
        extra_columns=("code_station", "type_station"),
        source_backend="infra.stations_mesure",
        display_label="Stations qualite",
        description="Support technique legacy conservé pour compatibilité.",
        available_parameters=("DBO5", "DCO", "NH4", "NO3", "O2_DISS", "pH", "Cond"),
        legacy_support=True,
    ),
    "step": MapSupportConfig(
        support="step",
        label="STEP",
        source="infra.step",
        id_column="id",
        name_column="code_step",
        geom_column="geom",
        entity_type="step",
        category="pollution_source",
        extra_columns=("code_step", "code_commune"),
        source_backend="infra.step",
        display_label="STEP",
        description="Support technique legacy conservé pour compatibilité.",
        legacy_support=True,
    ),
    "rejets_industriels": MapSupportConfig(
        support="rejets_industriels",
        label="Rejets industriels",
        source="infra.rejet_industriel",
        id_column="id",
        name_column="nom_rejet",
        geom_column="geom",
        entity_type="rejet_industriel",
        category="pollution_source",
        extra_columns=("code_rejet", "code_commune"),
        source_backend="infra.rejet_industriel",
        display_label="Rejets industriels",
        description="Support technique legacy conservé pour compatibilité.",
        legacy_support=True,
    ),
    "rejets_domestiques": MapSupportConfig(
        support="rejets_domestiques",
        label="Rejets domestiques",
        source="infra.rejet_domestique",
        id_column="id",
        name_column="code_rejet",
        geom_column="geom",
        entity_type="rejet_domestique",
        category="pollution_source",
        extra_columns=("code_commune",),
        source_backend="infra.rejet_domestique",
        display_label="Rejets domestiques",
        description="Support technique legacy conservé pour compatibilité.",
        legacy_support=True,
    ),
}


BUSINESS_SUPPORTS: dict[tuple[str, str], MapSupportConfig] = {
    ("stations", "forage"): MapSupportConfig(
        support="stations.forage",
        label="Forages",
        source="api.v_station_dimension",
        id_column="station_id",
        name_column="station_nom",
        geom_column="geom",
        entity_type="station_forage",
        category="stations",
        extra_columns=("code_station", "type_station", "actif", "sous_bassin_nom", "bassin_nom"),
        source_backend="api.v_station_dimension",
        display_label="Forages",
        description="Stations de type forage.",
        support_group="stations",
        support_type="forage",
        where_sql="lower(coalesce(t.type_station, '')) = 'forage'",
    ),
    ("stations", "puits"): MapSupportConfig(
        support="stations.puits",
        label="Puits",
        source="api.v_station_dimension",
        id_column="station_id",
        name_column="station_nom",
        geom_column="geom",
        entity_type="station_puits",
        category="stations",
        extra_columns=("code_station", "type_station", "actif", "sous_bassin_nom", "bassin_nom"),
        source_backend="api.v_station_dimension",
        display_label="Puits",
        description="Stations de type puits.",
        support_group="stations",
        support_type="puits",
        where_sql="lower(coalesce(t.type_station, '')) = 'puits'",
    ),
    ("stations", "point_prelevement"): MapSupportConfig(
        support="stations.point_prelevement",
        label="Points de prélèvement",
        source="api.v_source_pollution_prelevement",
        id_column="id",
        name_column="point_prelevement",
        geom_column="geom",
        entity_type="point_prelevement",
        category="stations",
        extra_columns=("commune", "province", "cercle", "nature", "source_system", "n_mesures_parametres"),
        source_backend="api.v_source_pollution_prelevement",
        display_label="Points de prélèvement",
        description="Points de prélèvement qualité/pollution déjà structurés.",
        available_parameters=("DBO5", "DCO", "NH4", "NO3", "O2_DISS", "pH", "Cond"),
        support_group="stations",
        support_type="point_prelevement",
    ),
    ("stations", "barrage"): MapSupportConfig(
        support="stations.barrage",
        label="Barrages",
        source="api.v_barrage_dimension",
        id_column="barrage_id",
        name_column="barrage_nom",
        geom_column="geom",
        entity_type="barrage",
        category="stations",
        extra_columns=("nom_oued", "statut", "type_barrage"),
        source_backend="api.v_barrage_dimension",
        display_label="Barrages",
        description="Barrages exposés comme supports de suivi.",
        support_group="stations",
        support_type="barrage",
    ),
    ("stations", "pluvio"): MapSupportConfig(
        support="stations.pluvio",
        label="Stations pluviométriques",
        source="api.v_station_dimension",
        id_column="station_id",
        name_column="station_nom",
        geom_column="geom",
        entity_type="station_pluvio",
        category="stations",
        extra_columns=("code_station", "type_station", "actif", "sous_bassin_nom", "bassin_nom"),
        source_backend="api.v_station_dimension",
        display_label="Stations pluviométriques",
        description="Stations de type pluviométrique.",
        support_group="stations",
        support_type="pluvio",
        where_sql="lower(coalesce(t.type_station, '')) in ('pluviometrique', 'pluvio')",
    ),
    ("stations", "source"): MapSupportConfig(
        support="stations.source",
        label="Sources",
        source="api.v_station_dimension",
        id_column="station_id",
        name_column="station_nom",
        geom_column="geom",
        entity_type="station_source",
        category="stations",
        extra_columns=("code_station", "type_station", "actif", "sous_bassin_nom", "bassin_nom"),
        source_backend="api.v_station_dimension",
        display_label="Sources",
        description="Stations de type source.",
        support_group="stations",
        support_type="source",
        where_sql="lower(coalesce(t.type_station, '')) = 'source'",
    ),
    ("stations", "hydro"): MapSupportConfig(
        support="stations.hydro",
        label="Stations hydrologiques",
        source="api.v_station_dimension",
        id_column="station_id",
        name_column="station_nom",
        geom_column="geom",
        entity_type="station_hydro",
        category="stations",
        extra_columns=("code_station", "type_station", "actif", "sous_bassin_nom", "bassin_nom"),
        source_backend="api.v_station_dimension",
        display_label="Stations hydrologiques",
        description="Stations de type hydrologique.",
        support_group="stations",
        support_type="hydro",
        where_sql="lower(coalesce(t.type_station, '')) = 'hydrologique'",
    ),
    ("inventaire_source_pollution", "point_mesures"): MapSupportConfig(
        support="inventaire_source_pollution.point_mesures",
        label="Points inventoriés",
        source="api.v_pollution_sites",
        id_column="site_id",
        name_column="site_name",
        geom_column="geometry",
        entity_type="inventaire_source_pollution",
        category="inventaire_source_pollution",
        extra_columns=("commune", "province", "bassin", "source_type_label", "validation_status", "source_origin"),
        geometry_is_geojson=True,
        longitude_column="longitude",
        latitude_column="latitude",
        source_backend="api.v_pollution_sites",
        display_label="Points inventoriés",
        description="Inventaire préalable des sources de pollution IDP.",
        support_group="inventaire_source_pollution",
        support_type="point_mesures",
        where_sql="t.source_origin in ('staging.raw_idp_src_pollution_globale', 'staging.raw_idp_src_pollution_marche_cadre')",
    ),
    ("inventaire_mesures_pollution", "point_prelevement"): MapSupportConfig(
        support="inventaire_mesures_pollution.point_prelevement",
        label="Points de prélèvement pollution",
        source="api.v_pollution_sites",
        id_column="site_id",
        name_column="site_name",
        geom_column="geometry",
        entity_type="inventaire_mesures_pollution",
        category="inventaire_mesures_pollution",
        extra_columns=("commune", "province", "bassin", "source_type_label", "validation_status", "source_origin"),
        geometry_is_geojson=True,
        longitude_column="longitude",
        latitude_column="latitude",
        source_backend="api.v_pollution_sites",
        display_label="Points de prélèvement pollution",
        description="Campagne de mesures pollution issue de l'inventaire IDP.",
        available_parameters=("DBO5", "DCO", "NH4", "NO3", "MES"),
        support_group="inventaire_mesures_pollution",
        support_type="point_prelevement",
        where_sql="t.source_origin in ('staging.raw_idp_mesures_qualite_globale_2024', 'staging.raw_idp_mesures_qualite_marche_cadre_2024')",
    ),
}


UNMAPPED_BUSINESS_SUPPORTS: dict[tuple[str, str], dict[str, Any]] = {}


def catalog() -> dict[str, Any]:
    def support_payload(group_code: str, support_code: str, label: str) -> dict[str, Any]:
        cfg = BUSINESS_SUPPORTS.get((group_code, support_code))
        missing = UNMAPPED_BUSINESS_SUPPORTS.get((group_code, support_code), {})
        return {
            "support_code": support_code,
            "label": label,
            "support_group": group_code,
            "support_type": support_code,
            "source_backend": cfg.source_backend if cfg else missing.get("source_backend"),
            "display_label": cfg.display_label if cfg else label,
            "description": cfg.description if cfg else missing.get("description", "Source technique à identifier."),
            "available_parameters": list(cfg.available_parameters) if cfg else [],
            "geometry_status": cfg.geometry_status if cfg else "NOT_YET_MAPPED",
            "data_status": cfg.data_status if cfg else "NOT_YET_MAPPED",
            "legacy_support": False,
        }

    return {
        "status": "success",
        "version": "P0_DEV",
        "groups": [
            {
                "group_code": "stations",
                "group_label": "Stations",
                "supports": [
                    support_payload("stations", "forage", "Forages"),
                    support_payload("stations", "puits", "Puits"),
                    support_payload("stations", "point_prelevement", "Points de prélèvement"),
                    support_payload("stations", "barrage", "Barrages"),
                    support_payload("stations", "pluvio", "Stations pluviométriques"),
                    support_payload("stations", "source", "Sources"),
                    support_payload("stations", "hydro", "Stations hydrologiques"),
                ],
            },
            {
                "group_code": "inventaire_source_pollution",
                "group_label": "Inventaire sources de pollution",
                "supports": [
                    support_payload("inventaire_source_pollution", "point_mesures", "Points inventoriés"),
                ],
            },
            {
                "group_code": "inventaire_mesures_pollution",
                "group_label": "Campagne de mesures pollution",
                "supports": [
                    support_payload("inventaire_mesures_pollution", "point_prelevement", "Points de prélèvement pollution"),
                ],
            },
        ],
        "legacy_supports": [
            {
                "support_code": cfg.support,
                "support": cfg.support,
                "label": cfg.label,
                "source_backend": cfg.source_backend or cfg.source,
                "display_label": cfg.display_label or cfg.label,
                "description": cfg.description,
                "entity_type": cfg.entity_type,
                "category": cfg.category,
                "available_parameters": list(cfg.available_parameters),
                "classification": cfg.support == "idp_pollution",
                "geometry_status": cfg.geometry_status,
                "data_status": cfg.data_status,
                "legacy_support": True,
            }
            for cfg in SUPPORTS.values()
        ],
        "display_modes": ["latest_values", "regulatory_classification", "metadata"],
    }


def _safe_config(support: str) -> MapSupportConfig:
    if support not in SUPPORTS:
        raise ValueError(f"Support non supporte: {support}")
    return SUPPORTS[support]


def _resolve_config(
    *,
    support: str | None = None,
    group_code: str | None = None,
    support_code: str | None = None,
) -> MapSupportConfig | dict[str, Any]:
    if group_code or support_code:
        if not group_code or not support_code:
            raise ValueError("group_code et support_code doivent être fournis ensemble.")
        key = (group_code, support_code)
        if key in BUSINESS_SUPPORTS:
            return BUSINESS_SUPPORTS[key]
        if key in UNMAPPED_BUSINESS_SUPPORTS:
            return UNMAPPED_BUSINESS_SUPPORTS[key]
        raise ValueError(f"Support métier non supporté: {group_code}.{support_code}")
    return _safe_config(support or "idp_pollution")


def _db_parameter_code(parameter_code: str | None) -> str | None:
    if parameter_code == "NO3":
        return "NO3-"
    return parameter_code


def _extra_json(cfg: MapSupportConfig) -> str:
    parts = []
    for col in cfg.extra_columns:
        parts.append(f"'{col}', t.{col}")
    return ", ".join(parts)


def entities_geojson(
    db: Session,
    *,
    support: str,
    group_code: str | None = None,
    support_code: str | None = None,
    parameter_code: str | None = None,
    commune: str | None = None,
    bbox: str | None = None,
    limit: int = 1000,
) -> dict[str, Any]:
    cfg_or_missing = _resolve_config(support=support, group_code=group_code, support_code=support_code)
    if isinstance(cfg_or_missing, dict):
        return {
            "type": "FeatureCollection",
            "features": [],
            "metadata": {
                "group_code": group_code,
                "support_code": support_code,
                "support": support,
                "count": 0,
                "limit": limit,
                "geometry_status": "NOT_YET_MAPPED",
                "data_status": "NOT_YET_MAPPED",
                "message": cfg_or_missing.get("description", "Source technique à identifier."),
            },
        }
    cfg = cfg_or_missing
    safe_limit = min(max(limit, 1), 5000)
    where = [f"t.{cfg.geom_column} IS NOT NULL"]
    if not cfg.geometry_is_geojson:
        where.append(f"ST_IsValid(t.{cfg.geom_column})")
    params: dict[str, Any] = {"limit": safe_limit}

    if commune and "commune" in cfg.extra_columns:
        where.append("t.commune = :commune")
        params["commune"] = commune

    if cfg.where_sql:
        where.append(f"({cfg.where_sql})")

    if bbox:
        try:
            minx, miny, maxx, maxy = [float(item) for item in bbox.split(",")]
        except ValueError as exc:
            raise ValueError("bbox doit etre minx,miny,maxx,maxy en EPSG:4326") from exc
        if cfg.geometry_is_geojson and cfg.longitude_column and cfg.latitude_column:
            where.append(
                f"t.{cfg.longitude_column} BETWEEN :minx AND :maxx AND t.{cfg.latitude_column} BETWEEN :miny AND :maxy"
            )
        else:
            where.append(
                f"ST_Intersects(ST_Transform(t.{cfg.geom_column}, 4326), ST_MakeEnvelope(:minx, :miny, :maxx, :maxy, 4326))"
            )
        params.update({"minx": minx, "miny": miny, "maxx": maxx, "maxy": maxy})

    db_param = _db_parameter_code(parameter_code)
    latest_sql = "NULL::jsonb"
    if cfg.source == "api.v_pollution_sites":
        if db_param:
            where.append(
                """
                EXISTS (
                    SELECT 1 FROM api.v_pollution_latest_results r
                    WHERE r.site_id = t.site_id
                      AND r.parameter_code = :parameter_code
                )
                """
            )
            params["parameter_code"] = db_param
        latest_sql = """
            (
                SELECT jsonb_agg(jsonb_build_object(
                    'parameter_code', r.parameter_code,
                    'parameter_label', r.parameter_label,
                    'value_numeric', r.value_numeric,
                    'value_text', r.value_text,
                    'unit', r.unit,
                    'sample_date', r.sample_date,
                    'quality_flag', r.quality_flag
                ) ORDER BY r.parameter_code)
                FROM api.v_pollution_latest_results r
                WHERE r.site_id = t.site_id
                  AND (:parameter_code_optional IS NULL OR r.parameter_code = :parameter_code_optional)
            )
        """
        params["parameter_code_optional"] = db_param

    extras = _extra_json(cfg)
    if extras:
        extras = "," + extras

    geometry_expr = (
        f"t.{cfg.geom_column}::jsonb"
        if cfg.geometry_is_geojson
        else f"ST_AsGeoJSON(ST_Transform(t.{cfg.geom_column}, 4326), 6)::jsonb"
    )

    sql = text(
        f"""
        SELECT
            t.{cfg.id_column}::text AS entity_id,
            t.{cfg.name_column}::text AS label,
            {latest_sql} AS latest_values,
            jsonb_build_object(
                'support', :support,
                'entity_type', :entity_type,
                'category', :category
                {extras}
            ) AS properties,
            {geometry_expr} AS geometry
        FROM {cfg.source} t
        WHERE {" AND ".join(where)}
        ORDER BY t.{cfg.name_column} NULLS LAST
        LIMIT :limit
        """
    )
    params.update({"support": cfg.support, "entity_type": cfg.entity_type, "category": cfg.category})

    rows = [dict(row) for row in db.execute(sql, params).mappings().all()]
    if cfg.source == "api.v_pollution_sites":
        _classify_latest_values(db, rows)

    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": row["entity_id"],
                "geometry": row["geometry"],
                "properties": {
                    "entity_id": row["entity_id"],
                    "label": row["label"],
                    **(row["properties"] or {}),
                    "support_group": cfg.support_group,
                    "support_type": cfg.support_type or cfg.support,
                    "source_backend": cfg.source_backend or cfg.source,
                    "display_label": cfg.display_label or cfg.label,
                    "data_status": cfg.data_status,
                    "geometry_status": cfg.geometry_status,
                    "legacy_support": cfg.legacy_support,
                    "latest_values": row["latest_values"] or [],
                },
            }
            for row in rows
        ],
        "metadata": {
            "support": cfg.support,
            "group_code": group_code,
            "support_code": support_code,
            "legacy_support": cfg.legacy_support,
            "source": cfg.source,
            "source_backend": cfg.source_backend or cfg.source,
            "count": len(rows),
            "limit": safe_limit,
            "parameter_code": parameter_code,
        },
    }


def _classify_latest_values(db: Session, rows: list[dict[str, Any]]) -> None:
    context = load_regulatory_context(db)
    for row in rows:
        enriched = []
        for value in row.get("latest_values") or []:
            result = dict(value)
            classification = classify_measurement(
                context,
                parameter_code=result.get("parameter_code"),
                value_numeric=result.get("value_numeric"),
                unit=result.get("unit"),
            )
            result["classification"] = classification
            enriched.append(result)
        row["latest_values"] = enriched


def entity_detail(db: Session, *, support: str, entity_id: str) -> dict[str, Any] | None:
    cfg = _safe_config(support)
    sql = text(
        f"""
        SELECT to_jsonb(t) - :geom_col AS properties,
               {"t." + cfg.geom_column + "::jsonb" if cfg.geometry_is_geojson else "ST_AsGeoJSON(ST_Transform(t." + cfg.geom_column + ", 4326), 6)::jsonb"} AS geometry
        FROM {cfg.source} t
        WHERE t.{cfg.id_column}::text = :entity_id
        LIMIT 1
        """
    )
    row = db.execute(sql, {"entity_id": entity_id, "geom_col": cfg.geom_column}).mappings().first()
    if not row:
        return None
    return {
        "type": "Feature",
        "id": entity_id,
        "geometry": row["geometry"],
        "properties": row["properties"],
        "metadata": {"support": cfg.support, "source": cfg.source},
    }


def entity_parameters(db: Session, *, support: str, entity_id: str) -> dict[str, Any]:
    if support == "idp_pollution":
        rows = db.execute(
            text(
                """
                SELECT parameter_code, parameter_label, unit, count(*)::int AS n_values,
                       min(sample_date) AS date_min, max(sample_date) AS date_max
                FROM api.v_pollution_latest_results
                WHERE site_id::text = :entity_id
                GROUP BY parameter_code, parameter_label, unit
                ORDER BY parameter_code
                """
            ),
            {"entity_id": entity_id},
        ).mappings().all()
        return {"status": "success", "support": support, "entity_id": entity_id, "parameters": [dict(r) for r in rows]}
    return {"status": "success", "support": support, "entity_id": entity_id, "parameters": []}


def latest_values(
    db: Session,
    *,
    support: str = "idp_pollution",
    parameter_code: str | None = None,
    limit: int = 1000,
) -> dict[str, Any]:
    if support != "idp_pollution":
        return {"status": "success", "support": support, "data": [], "metadata": {"message": "latest_values P0 disponible pour idp_pollution"}}
    db_param = _db_parameter_code(parameter_code)
    where = ["geometry IS NOT NULL"]
    params: dict[str, Any] = {"limit": min(max(limit, 1), 5000)}
    if db_param:
        where.append("parameter_code = :parameter_code")
        params["parameter_code"] = db_param
    rows = db.execute(
        text(
            f"""
            SELECT site_id::text AS entity_id, site_name AS label, commune, parameter_code,
                   parameter_label, sample_date, value_numeric, value_text, unit, quality_flag
            FROM api.v_pollution_latest_results
            WHERE {" AND ".join(where)}
            ORDER BY sample_date DESC NULLS LAST, site_name, parameter_code
            LIMIT :limit
            """
        ),
        params,
    ).mappings().all()
    return {"status": "success", "support": support, "count": len(rows), "data": [dict(r) for r in rows]}
