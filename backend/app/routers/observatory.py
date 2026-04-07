from fastapi import APIRouter, Depends, Query, Body, HTTPException, Request
from sqlalchemy import text
from sqlalchemy.orm import Session
import time
from typing import Any

from app.db.climate_database import get_climate_db
from app.util_dbmeta import table_exists
from app.services.ingestion_audit_service import AuditResultInfo, log_ingestion_action
from app.security.deps import get_current_user
from app.security.models import SecurityUser

router = APIRouter(prefix="/observatory", tags=["observatory"])


CACHE_TTL_SECONDS = 45
_OBS_CACHE: dict[str, tuple[float, Any]] = {}


def _pick_relation(preferred_mv: str, fallback_view: str) -> str:
    return preferred_mv if table_exists(preferred_mv) else fallback_view


def _cache_key(prefix: str, **kwargs: Any) -> str:
    parts = [prefix]
    for k in sorted(kwargs.keys()):
        parts.append(f"{k}={kwargs[k]}")
    return "|".join(parts)


def _cache_get(key: str):
    now = time.time()
    item = _OBS_CACHE.get(key)
    if not item:
        return None
    expires_at, value = item
    if expires_at < now:
        _OBS_CACHE.pop(key, None)
        return None
    return value


def _cache_set(key: str, value: Any):
    _OBS_CACHE[key] = (time.time() + CACHE_TTL_SECONDS, value)


@router.get("/popup-rules")
def popup_rules(db: Session = Depends(get_climate_db)):
    """
    Returns popup display rules.
    If metadata.popup_rules_config exists, it overrides defaults per layer_key.
    """
    defaults = {
        "bassin_sebou": {
            "title": "Bassin versant",
            "name_fields": ["nom", "bassin", "name", "label"],
            "class_fields": ["type_bassin", "classe"],
            "code_fields": ["code_bassin", "bassin_code", "id"],
        },
        "sous_bassin_sebou": {
            "title": "Sous-bassin ABH",
            "name_fields": ["nom_sous_bassin", "sous_bassin", "name", "label"],
            "class_fields": ["classe", "categorie"],
            "code_fields": ["code_sous_bassin", "id"],
        },
        "sous_bassins_swat": {
            "title": "Sous-bassin SWAT",
            "name_fields": ["name", "label", "subbasin_nom"],
            "class_fields": ["scenario", "bassin_nom"],
            "code_fields": ["subbasin_uid", "subbasin_id", "id"],
        },
        "reseau_hydro_abhs": {
            "title": "Segment hydrographique",
            "name_fields": ["nom_oued", "nom", "name", "label"],
            "type_fields": ["type", "categorie", "class_hydro"],
            "code_fields": ["reseau_id", "segment_local_id", "id_oued", "id"],
        },
        "nappes": {
            "title": "Nappe",
            "name_fields": ["nom_nappe", "name", "label"],
            "class_fields": ["type_nappe", "classe"],
            "code_fields": ["code_nappe", "code", "id"],
        },
        "sources": {
            "title": "Source d'eau",
            "name_fields": ["nom_source", "name", "label"],
            "type_fields": ["type_source", "source_type", "categorie"],
            "code_fields": ["code_source", "code", "source_id", "id"],
        },
        "stations_abhs": {
            "title": "Station",
            "name_fields": ["station_nom", "nom_station", "name", "label"],
            "type_fields": ["type_station", "station_type", "categorie"],
            "code_fields": ["code_station", "legacy_code_station", "station_id", "legacy_station_id", "id"],
        },
        "points_eau": {
            "title": "Point d'eau",
            "name_fields": ["nom_pt_eau", "name", "label"],
            "type_fields": ["type_point_eau", "type_source", "categorie"],
            "code_fields": ["code_pt_eau", "point_eau_id", "id"],
        },
        "barrages_abhs": {
            "title": "Barrage",
            "name_fields": ["nom_barrage", "name", "label"],
            "type_fields": ["type_barrage", "categorie"],
            "class_fields": ["statut"],
            "code_fields": ["ire", "barrage_id", "id"],
        },
        "adm_regions_abhs": {
            "title": "Région",
            "name_fields": ["region_fr", "name", "label"],
            "code_fields": ["code_region", "id"],
        },
        "adm_provinces_abhs": {
            "title": "Province / Préfecture",
            "name_fields": ["province_fr", "name", "label"],
            "code_fields": ["code_province", "id"],
        },
        "adm_cercles_abhs": {
            "title": "Cercle",
            "name_fields": ["cercle_fr", "name", "label"],
            "code_fields": ["code_cercle", "id"],
        },
        "adm_communes_abhs": {
            "title": "Commune",
            "name_fields": ["commune_fr", "name", "label"],
            "code_fields": ["code_commune", "id"],
        },
        "adm_villes_abhs": {
            "title": "Ville",
            "name_fields": ["ville_fr", "commune_fr", "name", "label"],
            "code_fields": ["code_ville", "code_commune", "id"],
        },
        "adm_douars_abhs": {
            "title": "Douar",
            "name_fields": ["douar_fr", "name", "label"],
            "code_fields": ["code_douar", "id"],
        },
    }

    if not table_exists("metadata.popup_rules_config"):
        return {"rules": defaults, "source": "defaults"}

    query = text(
        """
        select layer_key, title, name_fields, type_fields, class_fields, code_fields
        from metadata.popup_rules_config
        where actif is true
        """
    )
    rows = db.execute(query).mappings().all()
    merged = dict(defaults)
    for r in rows:
        key = str(r["layer_key"])
        merged[key] = {
            "title": r["title"] or defaults.get(key, {}).get("title"),
            "name_fields": r["name_fields"] or defaults.get(key, {}).get("name_fields", []),
            "type_fields": r["type_fields"] or defaults.get(key, {}).get("type_fields", []),
            "class_fields": r["class_fields"] or defaults.get(key, {}).get("class_fields", []),
            "code_fields": r["code_fields"] or defaults.get(key, {}).get("code_fields", []),
        }
    return {"rules": merged, "source": "metadata+defaults"}


@router.post("/popup-rules/upsert")
def popup_rules_upsert(
    payload: dict = Body(...),
    db: Session = Depends(get_climate_db),
):
    """
    Upserts one popup rule in metadata.popup_rules_config.
    Expected keys:
      layer_key (required), title, name_fields, type_fields, class_fields, code_fields, actif
    """
    if not table_exists("metadata.popup_rules_config"):
        raise HTTPException(status_code=404, detail="metadata.popup_rules_config not found")

    layer_key = str(payload.get("layer_key", "")).strip()
    if not layer_key:
        raise HTTPException(status_code=422, detail="layer_key is required")

    title = payload.get("title")
    name_fields = payload.get("name_fields") or []
    type_fields = payload.get("type_fields") or []
    class_fields = payload.get("class_fields") or []
    code_fields = payload.get("code_fields") or []
    actif = bool(payload.get("actif", True))

    query = text(
        """
        INSERT INTO metadata.popup_rules_config
            (layer_key, title, name_fields, type_fields, class_fields, code_fields, actif)
        VALUES
            (:layer_key, :title, :name_fields, :type_fields, :class_fields, :code_fields, :actif)
        ON CONFLICT (layer_key) DO UPDATE SET
            title = EXCLUDED.title,
            name_fields = EXCLUDED.name_fields,
            type_fields = EXCLUDED.type_fields,
            class_fields = EXCLUDED.class_fields,
            code_fields = EXCLUDED.code_fields,
            actif = EXCLUDED.actif,
            updated_at = now()
        """
    )
    db.execute(
        query,
        {
            "layer_key": layer_key,
            "title": title,
            "name_fields": name_fields,
            "type_fields": type_fields,
            "class_fields": class_fields,
            "code_fields": code_fields,
            "actif": actif,
        },
    )
    db.commit()
    # purge in-memory cache
    _OBS_CACHE.clear()
    return {"ok": True, "layer_key": layer_key}


@router.get("/popup-rules/list")
def popup_rules_list(db: Session = Depends(get_climate_db)):
    if not table_exists("metadata.popup_rules_config"):
        return {"rows": [], "count": 0}
    rows = db.execute(
        text(
            """
            select
              layer_key,
              title,
              name_fields,
              type_fields,
              class_fields,
              code_fields,
              actif,
              created_at,
              updated_at
            from metadata.popup_rules_config
            order by layer_key
            """
        )
    ).mappings().all()
    return {"rows": rows, "count": len(rows)}


@router.get("/popup-rules/{layer_key}")
def popup_rule_get(layer_key: str, db: Session = Depends(get_climate_db)):
    if not table_exists("metadata.popup_rules_config"):
        raise HTTPException(status_code=404, detail="metadata.popup_rules_config not found")
    row = db.execute(
        text(
            """
            select
              layer_key,
              title,
              name_fields,
              type_fields,
              class_fields,
              code_fields,
              actif,
              created_at,
              updated_at
            from metadata.popup_rules_config
            where layer_key = :layer_key
            """
        ),
        {"layer_key": layer_key},
    ).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail=f"popup rule not found: {layer_key}")
    return row


@router.delete("/popup-rules/{layer_key}")
def popup_rule_delete(layer_key: str, db: Session = Depends(get_climate_db)):
    if not table_exists("metadata.popup_rules_config"):
        raise HTTPException(status_code=404, detail="metadata.popup_rules_config not found")
    res = db.execute(
        text("delete from metadata.popup_rules_config where layer_key = :layer_key"),
        {"layer_key": layer_key},
    )
    db.commit()
    _OBS_CACHE.clear()
    if res.rowcount == 0:
        raise HTTPException(status_code=404, detail=f"popup rule not found: {layer_key}")
    return {"ok": True, "deleted": layer_key}


@router.get("/catalog/themes")
def catalog_themes(db: Session = Depends(get_climate_db)):
    cache_key = _cache_key("catalog_themes")
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached
    rel = _pick_relation("metadata.mv_obs_referentiel_parametre", "metadata.obs_referentiel_parametre")
    query = text(
        f"""
        select theme, count(*)::int as n_parameters
        from {rel}
        where actif is true
        group by theme
        order by theme
        """
    )
    rows = db.execute(query).mappings().all()
    _cache_set(cache_key, rows)
    return rows


@router.get("/catalog/parameters")
def catalog_parameters(theme: str, db: Session = Depends(get_climate_db)):
    cache_key = _cache_key("catalog_parameters", theme=theme)
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached
    rel = _pick_relation("metadata.mv_obs_referentiel_parametre", "metadata.obs_referentiel_parametre")
    query = text(
        f"""
        select
          p.parametre_code,
          p.libelle,
          p.unite,
          p.theme,
          p.sous_theme,
          p.aggregations_autorisees,
          p.description_courte
        from {rel} p
        where p.actif is true
          and p.theme = :theme
        order by p.sous_theme nulls last, p.libelle
        """
    )
    rows = db.execute(query, {"theme": theme}).mappings().all()
    _cache_set(cache_key, rows)
    return rows


@router.get("/catalog/entities")
def catalog_entities(parameter: str, db: Session = Depends(get_climate_db)):
    cache_key = _cache_key("catalog_entities", parameter=parameter)
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached
    rel_compat = _pick_relation("metadata.mv_obs_parametre_entite_compat", "metadata.obs_parametre_entite_compat")
    rel_cov = _pick_relation("metadata.mv_obs_parametre_coverage", "metadata.obs_parametre_coverage")
    query = text(
        f"""
        select
          c.entity_type,
          c.source_view,
          c.default_aggregation,
          c.default_time_step,
          coalesce(v.has_values, false) as has_values,
          coalesce(v.n_entities, 0) as n_entities,
          coalesce(v.n_values, 0) as n_values
        from {rel_compat} c
        left join {rel_cov} v
          on v.parametre_code = c.parametre_code
         and v.entity_type = c.entity_type
        where c.parametre_code = :parameter
          and c.actif is true
        order by c.entity_type
        """
    )
    rows = db.execute(query, {"parameter": parameter}).mappings().all()
    _cache_set(cache_key, rows)
    return rows


@router.get("/catalog/coverage")
def catalog_coverage(parameter: str, entity_type: str, db: Session = Depends(get_climate_db)):
    cache_key = _cache_key("catalog_coverage", parameter=parameter, entity_type=entity_type)
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached
    rel_cov = _pick_relation("metadata.mv_obs_parametre_coverage", "metadata.obs_parametre_coverage")
    query = text(
        f"""
        select
          parametre_code,
          entity_type,
          source_view,
          min_date,
          max_date,
          time_steps,
          n_entities,
          n_values,
          has_values,
          updated_at
        from {rel_cov}
        where parametre_code = :parameter
          and entity_type = :entity_type
        """
    )
    row = db.execute(query, {"parameter": parameter, "entity_type": entity_type}).mappings().first()
    res = row or {}
    _cache_set(cache_key, res)
    return res


@router.get("/hierarchy/themes")
def hierarchy_themes(db: Session = Depends(get_climate_db)):
    cache_key = _cache_key("hierarchy_themes")
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached
    rel = _pick_relation("api.mv_hierarchie_metier_listing", "api.v_hierarchie_metier_listing")
    query = text(
        f"""
        select theme, count(*)::int as n_items
        from {rel}
        group by theme
        order by theme
        """
    )
    rows = db.execute(query).mappings().all()
    _cache_set(cache_key, rows)
    return rows


@router.get("/hierarchy/submenus")
def hierarchy_submenus(theme: str, db: Session = Depends(get_climate_db)):
    cache_key = _cache_key("hierarchy_submenus", theme=theme)
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached
    rel = _pick_relation("api.mv_hierarchie_metier_listing", "api.v_hierarchie_metier_listing")
    query = text(
        f"""
        select sous_menu, count(*)::int as n_items
        from {rel}
        where lower(theme) = lower(:theme) or theme = :theme
        group by sous_menu
        order by sous_menu
        """
    )
    rows = db.execute(query, {"theme": theme}).mappings().all()
    _cache_set(cache_key, rows)
    return rows


@router.get("/hierarchy/parameters")
def hierarchy_parameters(
    theme: str,
    sous_menu: str,
    db: Session = Depends(get_climate_db),
):
    cache_key = _cache_key("hierarchy_parameters", theme=theme, sous_menu=sous_menu)
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached
    rel = _pick_relation("api.mv_hierarchie_metier_listing", "api.v_hierarchie_metier_listing")
    query = text(
        f"""
        select distinct
          param_code,
          param_label,
          unite,
          entity_type,
          source_schema,
          source_table,
          source_column,
          is_modeled
        from {rel}
        where (lower(theme) = lower(:theme) or theme = :theme)
          and sous_menu = :sous_menu
        order by param_label, source_table
        """
    )
    rows = db.execute(query, {"theme": theme, "sous_menu": sous_menu}).mappings().all()
    _cache_set(cache_key, rows)
    return rows


@router.get("/parameter/latest")
def parameter_latest(
    theme: str,
    sous_menu: str,
    param_code: str,
    source_table: str | None = Query(None),
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    time_step: str | None = Query(None),
    aggregation: str | None = Query("avg"),
    db: Session = Depends(get_climate_db),
):
    cache_key = _cache_key(
        "parameter_latest",
        theme=theme,
        sous_menu=sous_menu,
        param_code=param_code,
        source_table=source_table,
        date_start=date_start,
        date_end=date_end,
        time_step=time_step,
        aggregation=aggregation,
    )
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    # Resolve source row from hierarchy listing, optionally pinned by source_table.
    source_query = text(
        f"""
        select source_schema, source_table, source_column, entity_type, param_label, unite
        from {_pick_relation("api.mv_hierarchie_metier_listing", "api.v_hierarchie_metier_listing")}
        where (lower(theme) = lower(:theme) or theme = :theme)
          and sous_menu = :sous_menu
          and param_code = :param_code
          and (:source_table is null or source_table = :source_table)
        order by source_table
        limit 1
        """
    )
    src = db.execute(
        source_query,
        {
            "theme": theme,
            "sous_menu": sous_menu,
            "param_code": param_code,
            "source_table": source_table,
        },
    ).mappings().first()
    if not src:
        return []

    source_table_name = src["source_table"]
    source_schema = src["source_schema"]
    src_col = src["source_column"]

    agg = (aggregation or "avg").lower()
    agg_allowed = {"avg", "sum", "min", "max", "median"}
    if agg not in agg_allowed:
        agg = "avg"

    def agg_expr(col: str) -> str:
        if agg == "sum":
            return f"sum({col})::double precision"
        if agg == "min":
            return f"min({col})::double precision"
        if agg == "max":
            return f"max({col})::double precision"
        if agg == "median":
            return f"percentile_cont(0.5) within group (order by {col})::double precision"
        return f"avg({col})::double precision"

    # Fixed SQL paths by whitelisted tables only.
    sql = None
    params = {"date_start": date_start, "date_end": date_end, "time_step": time_step, "aggregation": agg}

    if source_schema == "meteo" and source_table_name == "mesure_temperature":
        metric_col = "val_moy"
        if param_code == "TEMP_MIN":
            metric_col = "val_min"
        elif param_code == "TEMP_MAX":
            metric_col = "val_max"
        sql = text(
            f"""
            select station_id::text as entity_id,
                   {agg_expr(metric_col)} as value,
                   min(temps)::date as dt_min,
                   max(temps)::date as dt_max,
                   count(*)::int as n_values
            from meteo.mesure_temperature
            where {metric_col} is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date) + interval '1 day')
            group by station_id
            """
        )
    elif source_schema == "meteo" and source_table_name == "mesure_precipitation":
        metric_col = src_col if src_col in ("val_observees", "val_power_nasa", "val_remplies") else "val_remplies"
        sql = text(
            f"""
            select station_id::text as entity_id,
                   {agg_expr(metric_col)} as value,
                   min(temps)::date as dt_min,
                   max(temps)::date as dt_max,
                   count(*)::int as n_values
            from meteo.mesure_precipitation
            where {metric_col} is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date) + interval '1 day')
            group by station_id
            """
        )
    elif source_schema == "meteo" and source_table_name == "mesure_evaporation":
        sql = text(
            f"""
            select station_id::text as entity_id,
                   {agg_expr("valeur")} as value,
                   min(temps)::date as dt_min,
                   max(temps)::date as dt_max,
                   count(*)::int as n_values
            from meteo.mesure_evaporation
            where valeur is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date) + interval '1 day')
            group by station_id
            """
        )
    elif source_schema == "hydro" and source_table_name == "mesure_debit":
        sql = text(
            f"""
            select station_id::text as entity_id,
                   {agg_expr("valeur")} as value,
                   min(temps)::date as dt_min,
                   max(temps)::date as dt_max,
                   count(*)::int as n_values
            from hydro.mesure_debit
            where valeur is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date) + interval '1 day')
            group by station_id
            """
        )
    elif source_schema == "hydro" and source_table_name == "mesure_debit_source":
        sql = text(
            f"""
            select source_id::text as entity_id,
                   {agg_expr("valeur_m3s")} as value,
                   min(temps)::date as dt_min,
                   max(temps)::date as dt_max,
                   count(*)::int as n_values
            from hydro.mesure_debit_source
            where valeur_m3s is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date) + interval '1 day')
            group by source_id
            """
        )
    elif source_schema == "hydro" and source_table_name == "mesure_debit_mensuel":
        sql = text(
            f"""
            select station_id::text as entity_id,
                   {agg_expr("valeur_moy_m3s")} as value,
                   min(bucket_month)::date as dt_min,
                   max(bucket_month)::date as dt_max,
                   count(*)::int as n_values
            from hydro.mesure_debit_mensuel
            where valeur_moy_m3s is not null
              and (:date_start is null or bucket_month >= CAST(:date_start AS date))
              and (:date_end is null or bucket_month <= CAST(:date_end AS date))
            group by station_id
            """
        )
    elif source_schema == "hydro" and source_table_name == "mesure_barrage":
        metric_col = "cote_m"
        if param_code == "VOLUME_BARRAGE":
            metric_col = "volume_mm3"
        elif param_code == "LACHER_BARRAGE":
            metric_col = "lacher_m3s"
        sql = text(
            f"""
            select barrage_id::text as entity_id,
                   {agg_expr(metric_col)} as value,
                   min(temps)::date as dt_min,
                   max(temps)::date as dt_max,
                   count(*)::int as n_values
            from hydro.mesure_barrage
            where {metric_col} is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date) + interval '1 day')
            group by barrage_id
            """
        )
    elif source_schema == "wasp_output" and source_table_name == "mesure_qualite_segment_ts":
        params["param_code"] = param_code
        sql = text(
            f"""
            select reseau_id::text as entity_id,
                   {agg_expr("valeur")} as value,
                   min(ts_utc)::date as dt_min,
                   max(ts_utc)::date as dt_max,
                   count(*)::int as n_values
            from wasp_output.mesure_qualite_segment_ts
            where code_parametre = :param_code
              and valeur is not null
              and (:date_start is null or ts_utc >= CAST(:date_start AS date))
              and (:date_end is null or ts_utc <= CAST(:date_end AS date) + interval '1 day')
            group by reseau_id
            """
        )
    elif source_schema == "swat_output" and source_table_name == "mesure_qualite_subbasin_ts":
        params["param_code"] = param_code
        sql = text(
            f"""
            select subbasin_uid::text as entity_id,
                   {agg_expr("valeur")} as value,
                   min(temps)::date as dt_min,
                   max(temps)::date as dt_max,
                   count(*)::int as n_values
            from swat_output.mesure_qualite_subbasin_ts
            where param_code = :param_code
              and valeur is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date))
            group by subbasin_uid
            """
        )
    elif source_schema == "qualite" and source_table_name in (
        "mesure_qualite_riviere",
        "mesure_qualite_barrage",
        "mesure_qualite_sebou",
        "mesure_qualite_nappe",
    ):
        # For quality measured tables, filter raw source parameter values via mapping table.
        value_query = text(
            """
            select distinct mps.source_value
            from metadata.mapping_parametre_source mps
            join metadata.referentiel_parametre rp on rp.id = mps.parametre_ref_id
            where upper(rp.code_canonique) = upper(:param_code)
              and mps.source_schema = 'qualite'
              and mps.source_table = :source_table
            """
        )
        source_values = [str(r["source_value"]).lower() for r in db.execute(value_query, {"param_code": param_code, "source_table": source_table_name}).mappings().all()]
        if not source_values:
            return []
        params["source_values"] = source_values
        sql = text(
            f"""
            select station_id::text as entity_id,
                   {agg_expr("valeur")} as value,
                   min(temps)::date as dt_min,
                   max(temps)::date as dt_max,
                   count(*)::int as n_values
            from qualite.{source_table_name}
            where valeur is not null
              and lower(parametre_qualite) = any(:source_values)
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date) + interval '1 day')
            group by station_id
            """
        )

    if sql is None:
        return []
    rows = db.execute(sql, params).mappings().all()
    _cache_set(cache_key, rows)
    return rows


@router.get("/hierarchy/entities-with-values")
def hierarchy_entities_with_values(
    theme: str,
    sous_menu: str,
    param_code: str,
    source_table: str | None = Query(None),
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    time_step: str | None = Query(None),
    aggregation: str | None = Query("avg"),
    db: Session = Depends(get_climate_db),
):
    cache_key = _cache_key(
        "entities_with_values",
        theme=theme,
        sous_menu=sous_menu,
        param_code=param_code,
        source_table=source_table,
        date_start=date_start,
        date_end=date_end,
        time_step=time_step,
        aggregation=aggregation,
    )
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    rows = parameter_latest(
        theme=theme,
        sous_menu=sous_menu,
        param_code=param_code,
        source_table=source_table,
        date_start=date_start,
        date_end=date_end,
        time_step=time_step,
        aggregation=aggregation,
        db=db,
    )
    entity_ids = [str(r.get("entity_id")) for r in rows if r.get("entity_id") is not None]
    payload = {
        "theme": theme,
        "sous_menu": sous_menu,
        "param_code": param_code,
        "source_table": source_table,
        "entity_count": len(entity_ids),
        "entity_ids": entity_ids,
    }
    _cache_set(cache_key, payload)
    return payload


@router.get("/hierarchy/kpi")
def hierarchy_kpi(
    theme: str,
    sous_menu: str,
    param_code: str,
    source_table: str | None = Query(None),
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    time_step: str | None = Query(None),
    aggregation: str | None = Query("avg"),
    db: Session = Depends(get_climate_db),
):
    cache_key = _cache_key(
        "hierarchy_kpi",
        theme=theme,
        sous_menu=sous_menu,
        param_code=param_code,
        source_table=source_table,
        date_start=date_start,
        date_end=date_end,
        time_step=time_step,
        aggregation=aggregation,
    )
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    rows = parameter_latest(
        theme=theme,
        sous_menu=sous_menu,
        param_code=param_code,
        source_table=source_table,
        date_start=date_start,
        date_end=date_end,
        time_step=time_step,
        aggregation=aggregation,
        db=db,
    )
    values = [float(r["value"]) for r in rows if r.get("value") is not None]
    if not values:
        payload = {"count": 0, "min": None, "max": None, "avg": None}
        _cache_set(cache_key, payload)
        return payload
    payload = {
        "count": len(values),
        "min": min(values),
        "max": max(values),
        "avg": (sum(values) / len(values)),
    }
    _cache_set(cache_key, payload)
    return payload


@router.get("/hierarchy/timeline")
def hierarchy_timeline(
    theme: str,
    sous_menu: str,
    param_code: str,
    source_table: str | None = Query(None),
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    limit: int = Query(5000, ge=1, le=20000),
    db: Session = Depends(get_climate_db),
):
    cache_key = _cache_key(
        "hierarchy_timeline",
        theme=theme,
        sous_menu=sous_menu,
        param_code=param_code,
        source_table=source_table,
        date_start=date_start,
        date_end=date_end,
        limit=limit,
    )
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    src_query = text(
        f"""
        select source_schema, source_table
        from {_pick_relation("api.mv_hierarchie_metier_listing", "api.v_hierarchie_metier_listing")}
        where theme = :theme
          and sous_menu = :sous_menu
          and param_code = :param_code
          and (:source_table is null or source_table = :source_table)
        order by source_table
        limit 1
        """
    )
    src = db.execute(
        src_query,
        {
            "theme": theme,
            "sous_menu": sous_menu,
            "param_code": param_code,
            "source_table": source_table,
        },
    ).mappings().first()
    if not src:
        payload = {"dates": [], "min_date": None, "max_date": None}
        _cache_set(cache_key, payload)
        return payload

    source_schema = src["source_schema"]
    source_table_name = src["source_table"]
    params = {
        "date_start": date_start,
        "date_end": date_end,
        "limit": limit,
    }
    sql = None

    if source_schema == "meteo" and source_table_name in ("mesure_temperature", "mesure_precipitation", "mesure_evaporation"):
        sql = text(
            f"""
            select distinct temps::date as d
            from meteo.{source_table_name}
            where (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date) + interval '1 day')
            order by d
            limit :limit
            """
        )
    elif source_schema == "hydro" and source_table_name in ("mesure_debit", "mesure_debit_source", "mesure_barrage"):
        sql = text(
            f"""
            select distinct temps::date as d
            from hydro.{source_table_name}
            where (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date) + interval '1 day')
            order by d
            limit :limit
            """
        )
    elif source_schema == "hydro" and source_table_name == "mesure_debit_mensuel":
        sql = text(
            """
            select distinct bucket_month::date as d
            from hydro.mesure_debit_mensuel
            where (:date_start is null or bucket_month >= CAST(:date_start AS date))
              and (:date_end is null or bucket_month <= CAST(:date_end AS date))
            order by d
            limit :limit
            """
        )
    elif source_schema == "wasp_output" and source_table_name == "mesure_qualite_segment_ts":
        params["param_code"] = param_code
        sql = text(
            """
            select distinct ts_utc::date as d
            from wasp_output.mesure_qualite_segment_ts
            where code_parametre = :param_code
              and (:date_start is null or ts_utc >= CAST(:date_start AS date))
              and (:date_end is null or ts_utc <= CAST(:date_end AS date) + interval '1 day')
            order by d
            limit :limit
            """
        )
    elif source_schema == "swat_output" and source_table_name == "mesure_qualite_subbasin_ts":
        params["param_code"] = param_code
        sql = text(
            """
            select distinct temps::date as d
            from swat_output.mesure_qualite_subbasin_ts
            where param_code = :param_code
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date))
            order by d
            limit :limit
            """
        )
    elif source_schema == "qualite" and source_table_name in (
        "mesure_qualite_riviere",
        "mesure_qualite_barrage",
        "mesure_qualite_sebou",
        "mesure_qualite_nappe",
    ):
        value_query = text(
            """
            select distinct mps.source_value
            from metadata.mapping_parametre_source mps
            join metadata.referentiel_parametre rp on rp.id = mps.parametre_ref_id
            where upper(rp.code_canonique) = upper(:param_code)
              and mps.source_schema = 'qualite'
              and mps.source_table = :source_table
            """
        )
        source_values = [
            str(r["source_value"]).lower()
            for r in db.execute(value_query, {"param_code": param_code, "source_table": source_table_name}).mappings().all()
        ]
        if not source_values:
            payload = {"dates": [], "min_date": None, "max_date": None}
            _cache_set(cache_key, payload)
            return payload
        params["source_values"] = source_values
        sql = text(
            f"""
            select distinct temps::date as d
            from qualite.{source_table_name}
            where lower(parametre_qualite) = any(:source_values)
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date) + interval '1 day')
            order by d
            limit :limit
            """
        )

    if sql is None:
        payload = {"dates": [], "min_date": None, "max_date": None}
        _cache_set(cache_key, payload)
        return payload

    rows = db.execute(sql, params).mappings().all()
    dates = [str(r["d"]) for r in rows if r.get("d") is not None]
    payload = {
        "dates": dates,
        "min_date": dates[0] if dates else None,
        "max_date": dates[-1] if dates else None,
        "count": len(dates),
    }
    _cache_set(cache_key, payload)
    return payload


@router.post("/cache/clear")
def clear_observatory_cache(
    request: Request,
    db: Session = Depends(get_climate_db),
    current_user: SecurityUser = Depends(get_current_user),
):
    size = len(_OBS_CACHE)
    _OBS_CACHE.clear()
    log_ingestion_action(
        db=db,
        action="VIDER_CACHE",
        request=request,
        user_identifier=current_user.email,
        scenario_id=None,
        file_info=None,
        result=AuditResultInfo(statut="OK", nb_erreurs=0, nb_lignes=size, duree_ms=0),
        message_lisible=f"Cache observatoire vide ({size} entrees supprimees).",
    )
    return {"ok": True, "cleared": size}


@router.get("/mviews/status")
def mviews_status(db: Session = Depends(get_climate_db)):
    if not table_exists("metadata.mv_refresh_status"):
        return {"rows": [], "count": 0}
    rows = db.execute(
        text(
            """
            select mv_name, refreshed_at, row_count, note
            from metadata.mv_refresh_status
            order by mv_name
            """
        )
    ).mappings().all()
    return {"rows": rows, "count": len(rows)}


@router.post("/mviews/refresh")
def mviews_refresh(
    note: str | None = Body(default=None, embed=True),
    db: Session = Depends(get_climate_db),
):
    if not table_exists("metadata.mv_refresh_status"):
        raise HTTPException(status_code=404, detail="metadata.mv_refresh_status not found. Run MV perf SQL pack first.")
    db.execute(text("select metadata.refresh_perf_mviews(:note)"), {"note": note})
    db.commit()
    size = len(_OBS_CACHE)
    _OBS_CACHE.clear()
    return {"ok": True, "cache_cleared": size}


@router.get("/parameter/timeseries")
def parameter_timeseries(
    theme: str,
    sous_menu: str,
    param_code: str,
    entity_id: str,
    source_table: str | None = Query(None),
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    # Resolve source row from hierarchy listing
    source_query = text(
        f"""
        select source_schema, source_table, source_column, entity_type, param_label, unite
        from {_pick_relation("api.mv_hierarchie_metier_listing", "api.v_hierarchie_metier_listing")}
        where theme = :theme
          and sous_menu = :sous_menu
          and param_code = :param_code
          and (:source_table is null or source_table = :source_table)
        order by source_table
        limit 1
        """
    )
    src = db.execute(
        source_query,
        {
            "theme": theme,
            "sous_menu": sous_menu,
            "param_code": param_code,
            "source_table": source_table,
        },
    ).mappings().first()
    if not src:
        return []

    source_table_name = src["source_table"]
    source_schema = src["source_schema"]
    src_col = src["source_column"]

    sql = None
    params = {"entity_id": entity_id, "date_start": date_start, "date_end": date_end}

    if source_schema == "meteo" and source_table_name == "mesure_temperature":
        metric_col = "val_moy"
        if param_code == "TEMP_MIN":
            metric_col = "val_min"
        elif param_code == "TEMP_MAX":
            metric_col = "val_max"
        sql = text(
            f"""
            select temps as datetime, {metric_col}::double precision as value
            from meteo.mesure_temperature
            where station_id::text = :entity_id
              and {metric_col} is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date))
            order by temps
            """
        )
    elif source_schema == "meteo" and source_table_name == "mesure_precipitation":
        metric_col = src_col if src_col in ("val_observees", "val_power_nasa", "val_remplies") else "val_remplies"
        sql = text(
            f"""
            select temps as datetime, {metric_col}::double precision as value
            from meteo.mesure_precipitation
            where station_id::text = :entity_id
              and {metric_col} is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date))
            order by temps
            """
        )
    elif source_schema == "meteo" and source_table_name == "mesure_evaporation":
        sql = text(
            """
            select temps as datetime, valeur::double precision as value
            from meteo.mesure_evaporation
            where station_id::text = :entity_id
              and valeur is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date))
            order by temps
            """
        )
    elif source_schema == "hydro" and source_table_name == "mesure_debit":
        sql = text(
            """
            select temps as datetime, valeur::double precision as value
            from hydro.mesure_debit
            where station_id::text = :entity_id
              and valeur is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date))
            order by temps
            """
        )
    elif source_schema == "hydro" and source_table_name == "mesure_barrage":
        metric_col = "cote_m"
        if param_code == "VOLUME_BARRAGE":
            metric_col = "volume_mm3"
        elif param_code == "LACHER_BARRAGE":
            metric_col = "lacher_m3s"
        sql = text(
            f"""
            select temps as datetime, {metric_col}::double precision as value
            from hydro.mesure_barrage
            where barrage_id::text = :entity_id
              and {metric_col} is not null
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date))
            order by temps
            """
        )
    elif source_schema == "wasp_output" and source_table_name == "mesure_qualite_segment_ts":
        params["param_code"] = param_code
        sql = text(
            """
            select ts_utc as datetime, valeur::double precision as value
            from wasp_output.mesure_qualite_segment_ts
            where reseau_id::text = :entity_id
              and code_parametre = :param_code
              and valeur is not null
              and (:date_start is null or ts_utc >= CAST(:date_start AS date))
              and (:date_end is null or ts_utc <= CAST(:date_end AS date))
            order by ts_utc
            """
        )
    elif source_schema == "qualite" and (source_table_name or "").startswith("mesure_qualite"):
        # We need the source_value from mapping
        value_query = text(
            """
            select distinct mps.source_value
            from metadata.mapping_parametre_source mps
            join metadata.referentiel_parametre rp on rp.id = mps.parametre_ref_id
            where upper(rp.code_canonique) = upper(:param_code)
              and mps.source_schema = 'qualite'
              and mps.source_table = :source_table
            """
        )
        source_values = [str(r["source_value"]).lower() for r in db.execute(value_query, {"param_code": param_code, "source_table": source_table_name}).mappings().all()]
        if not source_values:
            return []
        params["source_values"] = source_values
        sql = text(
            f"""
            select temps as datetime, valeur::double precision as value
            from qualite.{source_table_name}
            where station_id::text = :entity_id
              and valeur is not null
              and lower(parametre_qualite) = any(:source_values)
              and (:date_start is null or temps >= CAST(:date_start AS date))
              and (:date_end is null or temps <= CAST(:date_end AS date))
            order by temps
            """
        )

    if sql is None:
        return []

    return db.execute(sql, params).mappings().all()


@router.get("/parameter/entities")
def parameter_entities(
    theme: str,
    sous_menu: str,
    param_code: str,
    db: Session = Depends(get_climate_db),
):
    # Resolve source schema and table from hierarchy
    source_query = text(
        f"""
        select source_schema, source_table, source_column, entity_type
        from {_pick_relation("api.mv_hierarchie_metier_listing", "api.v_hierarchie_metier_listing")}
        where theme = :theme
          and sous_menu = :sous_menu
          and param_code = :param_code
        limit 1
        """
    )
    src = db.execute(source_query, {"theme": theme, "sous_menu": sous_menu, "param_code": param_code}).mappings().first()
    if not src:
        return []

    source_table_name = src["source_table"]
    source_schema = src["source_schema"]
    entity_type = src["entity_type"]

    # Map entity types to the corresponding dimension table
    entities_sql = None
    if entity_type == "station" or source_schema == "meteo":
        entities_sql = text(
            f"""
            select distinct
                d.station_id::text as id,
                coalesce(d.station_nom, d.code_station, d.station_id::text) as name
            from {source_schema}.{source_table_name} s
            join api.v_station_dimension d on d.station_id = s.station_id
            order by name
            """
        )
    elif entity_type == "barrage":
        entities_sql = text(
            f"""
            select distinct
                b.barrage_id::text as id,
                coalesce(b.barrage_nom, b.barrage_id::text) as name
            from {source_schema}.{source_table_name} s
            join api.v_barrage_dimension b on b.barrage_id = s.barrage_id
            order by name
            """
        )
    elif entity_type == "segment":
         entities_sql = text(
            f"""
            select distinct
                reseau_id::text as id,
                reseau_id::text as name
            from {source_schema}.{source_table_name}
            order by name
            """
        )
    elif entity_type == "subbasin":
         entities_sql = text(
            f"""
            select distinct
                subbasin_uid::text as id,
                subbasin_uid::text as name
            from {source_schema}.{source_table_name}
            order by name
            """
        )

    if not entities_sql:
        return []

    return db.execute(entities_sql).mappings().all()


@router.get("/temperature/stations")
def temperature_stations(db: Session = Depends(get_climate_db)):
    query = text(
        """
        select distinct
          t.station_id::text as station_id,
          coalesce(s.code_station, s.legacy_code_station) as station_code,
          coalesce(s.station_nom, s.code_station, t.station_id::text) as station_name
        from api.v_meteo_temperature_journalier t
        left join api.v_station_dimension s on s.station_id = t.station_id
        where t.station_id is not null
        order by station_name
        """
    )
    return db.execute(query).mappings().all()


@router.get("/temperature/timeseries")
def temperature_timeseries(
    station_id: str,
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    query = text(
        """
        select
          bucket_day as datetime,
          val_min,
          val_max,
          val_moy
        from api.v_meteo_temperature_journalier
        where station_id::text = :station_id
          and (:date_start is null or bucket_day >= CAST(:date_start AS date))
          and (:date_end is null or bucket_day <= CAST(:date_end AS date))
        order by bucket_day
        """
    )
    return db.execute(
        query, {"station_id": station_id, "date_start": date_start, "date_end": date_end}
    ).mappings().all()


@router.get("/temperature/latest")
def temperature_latest(
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    query = text(
        """
        select
          station_id::text as entity_id,
          avg(val_moy)::double precision as value,
          min(bucket_day)::date as dt_min,
          max(bucket_day)::date as dt_max
        from api.v_meteo_temperature_journalier
        where val_moy is not null
          and (:date_start is null or bucket_day >= CAST(:date_start AS date))
          and (:date_end is null or bucket_day <= CAST(:date_end AS date))
        group by station_id
        """
    )
    return db.execute(query, {"date_start": date_start, "date_end": date_end}).mappings().all()


@router.get("/barrage/stations")
def barrage_stations(db: Session = Depends(get_climate_db)):
    query = text(
        """
        select distinct
          b.barrage_id::text as barrage_id,
          coalesce(b.barrage_nom, b.nom_oued, b.barrage_id::text) as barrage_name
        from api.v_hydro_niveau_barrage_journalier b
        where b.barrage_id is not null
        order by barrage_name
        """
    )
    return db.execute(query).mappings().all()


@router.get("/barrage/timeseries")
def barrage_timeseries(
    barrage_id: str,
    metric: str = Query("cote_m", pattern="^(cote_m|volume_mm3|lacher_m3s)$"),
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    query = text(
        f"""
        select
          bucket_day as datetime,
          {metric}::double precision as value
        from api.v_hydro_niveau_barrage_journalier
        where barrage_id::text = :barrage_id
          and {metric} is not null
          and (:date_start is null or bucket_day >= CAST(:date_start AS date))
          and (:date_end is null or bucket_day <= CAST(:date_end AS date))
        order by bucket_day
        """
    )
    return db.execute(
        query, {"barrage_id": barrage_id, "date_start": date_start, "date_end": date_end}
    ).mappings().all()


@router.get("/barrage/latest")
def barrage_latest(
    metric: str = Query("cote_m", pattern="^(cote_m|volume_mm3|lacher_m3s)$"),
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    query = text(
        f"""
        select
          barrage_id::text as entity_id,
          avg({metric})::double precision as value,
          min(bucket_day)::date as dt_min,
          max(bucket_day)::date as dt_max
        from api.v_hydro_niveau_barrage_journalier
        where {metric} is not null
          and (:date_start is null or bucket_day >= CAST(:date_start AS date))
          and (:date_end is null or bucket_day <= CAST(:date_end AS date))
        group by barrage_id
        """
    )
    return db.execute(query, {"date_start": date_start, "date_end": date_end}).mappings().all()


@router.get("/precipitation/latest")
def precipitation_latest(
    metric: str = Query("val_remplies", pattern="^(val_observees|val_power_nasa|val_remplies|valeur)$"),
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    query = text(
        f"""
        select
          station_id::text as entity_id,
          avg({metric})::double precision as value,
          min(bucket_day)::date as dt_min,
          max(bucket_day)::date as dt_max
        from api.v_meteo_precipitation_journalier_qa
        where {metric} is not null
          and (:date_start is null or bucket_day >= CAST(:date_start AS date))
          and (:date_end is null or bucket_day <= CAST(:date_end AS date))
        group by station_id
        """
    )
    return db.execute(query, {"date_start": date_start, "date_end": date_end}).mappings().all()


@router.get("/evaporation/latest")
def evaporation_latest(
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    query = text(
        """
        select
          station_id::text as entity_id,
          avg(valeur)::double precision as value,
          min(bucket_day)::date as dt_min,
          max(bucket_day)::date as dt_max
        from api.v_meteo_evaporation_journalier_qa
        where valeur is not null
          and (:date_start is null or bucket_day >= CAST(:date_start AS date))
          and (:date_end is null or bucket_day <= CAST(:date_end AS date))
        group by station_id
        """
    )
    return db.execute(query, {"date_start": date_start, "date_end": date_end}).mappings().all()
