from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db

router = APIRouter(tags=["hydro"])


def _station_match_clause(param_name: str = "station_token") -> str:
    return f"""
        (
            station_id::text = :{param_name}
            OR legacy_station_id::text = :{param_name}
        )
    """


@router.get("/stations")
def stations(db: Session = Depends(get_climate_db)):
    query = text(
        """
        select distinct
            sd.station_id::text as station_uuid,
            sd.legacy_station_id::int as station_id,
            coalesce(sd.code_station, sd.legacy_code_station) as station_code,
            sd.station_nom as station_name
        from api.v_station_dimension sd
        inner join api.v_hydro_debit_mensuel hm
            on hm.station_id = sd.station_id
        where sd.station_id is not null
          and hm.station_id is not null
          and lower(coalesce(sd.type_station, hm.type_station, '')) like '%hydrolog%'
        order by sd.station_nom
        """
    )
    return db.execute(query).mappings().all()


@router.get("/points-eau")
def points_eau(db: Session = Depends(get_climate_db)):
    query = text(
        """
        select distinct
            point_eau_id::text as point_id,
            coalesce(nullif(trim(nom_pt_eau), ''), nullif(trim(code_pt_eau), ''), 'Point d''eau sans nom') as point_name
        from api.v_points_eau
        order by point_name
        """
    )
    return db.execute(query).mappings().all()


@router.get("/points-eau/details")
def point_eau_details(point_id: str, db: Session = Depends(get_climate_db)):
    query = text(
        """
        with details as (
            select
                point_eau_id::text as point_id,
                coalesce(nullif(trim(nom_pt_eau), ''), nullif(trim(code_pt_eau), ''), 'Point d''eau sans nom') as point_name,
                coalesce(to_char(date_realisation, 'YYYY'), to_char(created_at, 'YYYY'), to_char(current_date, 'YYYY')) as period,
                'Volume prélevé'::text as parameter,
                vol_preleve_m3_an::double precision as value,
                'm3/an'::text as unit,
                coalesce(nullif(trim(nature), ''), nullif(trim(utilisation), ''), 'Point d''eau') as source_type
            from api.v_points_eau
            where point_eau_id::text = :point_id and vol_preleve_m3_an is not null

            union all

            select
                point_eau_id::text,
                coalesce(nullif(trim(nom_pt_eau), ''), nullif(trim(code_pt_eau), ''), 'Point d''eau sans nom'),
                coalesce(to_char(date_realisation, 'YYYY'), to_char(created_at, 'YYYY'), to_char(current_date, 'YYYY')),
                'Niveau piézométrique'::text,
                niv_piezometrique_m::double precision,
                'm'::text,
                coalesce(nullif(trim(nature), ''), nullif(trim(utilisation), ''), 'Point d''eau')
            from api.v_points_eau
            where point_eau_id::text = :point_id and niv_piezometrique_m is not null

            union all

            select
                point_eau_id::text,
                coalesce(nullif(trim(nom_pt_eau), ''), nullif(trim(code_pt_eau), ''), 'Point d''eau sans nom'),
                coalesce(to_char(date_realisation, 'YYYY'), to_char(created_at, 'YYYY'), to_char(current_date, 'YYYY')),
                'Profondeur totale'::text,
                profond_tot_m::double precision,
                'm'::text,
                coalesce(nullif(trim(nature), ''), nullif(trim(utilisation), ''), 'Point d''eau')
            from api.v_points_eau
            where point_eau_id::text = :point_id and profond_tot_m is not null

            union all

            select
                point_eau_id::text,
                coalesce(nullif(trim(nom_pt_eau), ''), nullif(trim(code_pt_eau), ''), 'Point d''eau sans nom'),
                coalesce(to_char(date_realisation, 'YYYY'), to_char(created_at, 'YYYY'), to_char(current_date, 'YYYY')),
                'Distance foyer pollution'::text,
                dist_pt_eau_foyer_pollut_m::double precision,
                'm'::text,
                coalesce(nullif(trim(nature), ''), nullif(trim(utilisation), ''), 'Point d''eau')
            from api.v_points_eau
            where point_eau_id::text = :point_id and dist_pt_eau_foyer_pollut_m is not null
        )
        select *
        from details
        order by parameter
        """
    )
    return db.execute(query, {"point_id": point_id}).mappings().all()


@router.get("/stats")
def station_stats(station_id: str, db: Session = Depends(get_climate_db)):
    query = text(
        f"""
        with base as (
            select
                station_id::text as station_uuid,
                max(legacy_station_id)::int as station_id,
                min(bucket_month)::date as dt_min,
                max(bucket_month)::date as dt_max
            from api.v_hydro_debit_mensuel
            where {_station_match_clause("station_token")}
            group by station_id
        )
        select
            station_id,
            station_uuid,
            'observed'::text as source_type,
            'OBS'::text as scenario_code,
            'Mesures ABH'::text as scenario_name,
            1::int as run_id,
            'Débit'::text as property_name,
            'monthly'::text as time_step,
            station_id::int as ts_id,
            station_uuid as ts_uuid,
            dt_min,
            dt_max
        from base

        union all

        select
            station_id,
            station_uuid,
            'observed'::text as source_type,
            'OBS'::text as scenario_code,
            'Mesures ABH'::text as scenario_name,
            1::int as run_id,
            'Débit'::text as property_name,
            'annual'::text as time_step,
            station_id::int as ts_id,
            station_uuid as ts_uuid,
            dt_min,
            dt_max
        from base
        order by time_step
        """
    )
    return db.execute(query, {"station_token": station_id}).mappings().all()


def _aggregation_sql(aggregation: str) -> tuple[str, str]:
    if aggregation == "monthly":
        return (
            "bucket_month::date as datetime",
            "valeur_moy_m3s::double precision as value",
        )
    if aggregation == "annual":
        return (
            "date_trunc('year', bucket_month)::date as datetime",
            "avg(valeur_moy_m3s)::double precision as value",
        )
    raise HTTPException(400, "Invalid aggregation")


@router.get("/timeseries")
def hydro_timeseries(
    ts_id: str,
    aggregation: str,
    date_start: str,
    date_end: str,
    db: Session = Depends(get_climate_db),
):
    datetime_sql, value_sql = _aggregation_sql(aggregation)
    group_by = "" if aggregation == "monthly" else "group by date_trunc('year', bucket_month)::date"

    query = text(
        f"""
        select
            {datetime_sql},
            {value_sql}
        from api.v_hydro_debit_mensuel
        where {_station_match_clause("station_token")}
          and (:date_start = '' or bucket_month >= cast(:date_start as date))
          and (:date_end = '' or bucket_month <= cast(:date_end as date))
        {group_by}
        order by datetime
        """
    )

    return db.execute(
        query,
        {
            "station_token": ts_id,
            "date_start": date_start or "",
            "date_end": date_end or "",
        },
    ).mappings().all()



@router.get("/kpis")
def hydro_kpis(
    ts_id: str,
    aggregation: str,
    date_start: str,
    date_end: str,
    db: Session = Depends(get_climate_db),
):
    if aggregation == "monthly":
        value_expr = "valeur_moy_m3s"
        cte = ""
        from_source = "api.v_hydro_debit_mensuel"
        where_clause = f"""
        where {_station_match_clause("station_token")}
          and (:date_start = '' or bucket_month >= cast(:date_start as date))
          and (:date_end = '' or bucket_month <= cast(:date_end as date))
        """
    elif aggregation == "annual":
        value_expr = "value"
        cte = f"""
        with annual_values as (
            select
                date_trunc('year', bucket_month)::date as year_date,
                avg(valeur_moy_m3s)::double precision as value
            from api.v_hydro_debit_mensuel
            where {_station_match_clause("station_token")}
              and (:date_start = '' or bucket_month >= cast(:date_start as date))
              and (:date_end = '' or bucket_month <= cast(:date_end as date))
            group by date_trunc('year', bucket_month)::date
        )
        """
        from_source = "annual_values"
        where_clause = ""
    else:
        raise HTTPException(400, "Invalid aggregation")

    query = text(
        f"""
        {cte}
        select
            min({value_expr}) as min,
            max({value_expr}) as max,
            avg({value_expr}) as mean
        from {from_source}
        {where_clause}
        """
    )

    return db.execute(
        query,
        {
            "station_token": ts_id,
            "date_start": date_start or "",
            "date_end": date_end or "",
        },
    ).mappings().first()


@router.get("/latest")
def hydro_latest(
    aggregation: str = "monthly",
    date_start: str | None = "",
    date_end: str | None = "",
    db: Session = Depends(get_climate_db),
):
    if aggregation not in {"monthly", "annual"}:
        raise HTTPException(400, "Invalid aggregation")

    if aggregation == "monthly":
        query = text(
            """
            select
              station_id::text as entity_id,
              max(legacy_station_id)::text as legacy_entity_id,
              avg(valeur_moy_m3s)::double precision as value
            from api.v_hydro_debit_mensuel
            where station_id is not null
              and (:date_start = '' or bucket_month >= cast(:date_start as date))
              and (:date_end = '' or bucket_month <= cast(:date_end as date))
            group by station_id
            """
        )
    else:
        query = text(
            """
            with annual as (
              select
                station_id::text as entity_id,
                date_trunc('year', bucket_month)::date as y,
                avg(valeur_moy_m3s)::double precision as v
              from api.v_hydro_debit_mensuel
              where station_id is not null
                and (:date_start = '' or bucket_month >= cast(:date_start as date))
                and (:date_end = '' or bucket_month <= cast(:date_end as date))
              group by station_id, date_trunc('year', bucket_month)::date
            )
            select entity_id, avg(v)::double precision as value
            from annual
            group by entity_id
            """
        )

    return db.execute(
        query,
        {"date_start": date_start or "", "date_end": date_end or ""},
    ).mappings().all()
