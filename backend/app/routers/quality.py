from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db

router = APIRouter()


@router.get("/stations")
def get_quality_stations(db: Session = Depends(get_climate_db)):
    """
    Retourne la liste des stations ayant des mesures dans mesures_qualite_rivieres.
    """
    query = text(
        """
        SELECT DISTINCT
            mqr.ire_station                             AS station_id,
            coalesce(
                nullif(trim(sd.station_nom), ''),
                nullif(trim(sd.code_station), ''),
                mqr.ire_station
            )                                           AS station_name,
            min(mqr.date_prelevement)::date             AS dt_min,
            max(mqr.date_prelevement)::date             AS dt_max,
            count(*)::int                               AS n_mesures
        FROM public.mesures_qualite_rivieres mqr
        LEFT JOIN api.v_station_dimension sd
            ON sd.legacy_code_station = mqr.ire_station
            OR sd.code_station        = mqr.ire_station
        WHERE mqr.ire_station IS NOT NULL
          AND trim(mqr.ire_station) <> ''
        GROUP BY mqr.ire_station, sd.station_nom, sd.code_station
        ORDER BY station_name
        """
    )
    return db.execute(query).mappings().all()


@router.get("/parameters")
def get_quality_parameters(
    station_id: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    """
    Retourne la liste des paramètres qualité disponibles (optionnellement filtrés par station).
    """
    where = "WHERE mqr.ire_station = :station_id" if station_id else ""
    query = text(
        f"""
        SELECT DISTINCT
            trim(parametre_qualite) AS parameter,
            count(*)::int           AS n_mesures
        FROM public.mesures_qualite_rivieres mqr
        {where}
        GROUP BY trim(parametre_qualite)
        ORDER BY parameter
        """
    )
    params = {"station_id": station_id} if station_id else {}
    return db.execute(query, params).mappings().all()


@router.get("/timeseries")
def get_quality_timeseries(
    station_id: str,
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    """
    Séries temporelles des paramètres qualité (NO3, pH, DBO5, DCO, O2)
    pour une station, pivotées par date de prélèvement.
    """
    query = text(
        """
        SELECT
            date_prelevement::date                                                         AS date,
            max(CASE WHEN parametre_qualite ILIKE 'NO3%'  THEN val_qual_riv END)           AS no3,
            max(CASE WHEN parametre_qualite ILIKE 'ph%'   THEN val_qual_riv END)           AS ph,
            max(CASE WHEN parametre_qualite ILIKE 'DBO%'  THEN val_qual_riv END)           AS dbo5,
            max(CASE WHEN parametre_qualite ILIKE 'DCO%'  THEN val_qual_riv END)           AS dco,
            max(CASE WHEN parametre_qualite ILIKE 'O2%'   THEN val_qual_riv END)           AS o2,
            max(CASE WHEN parametre_qualite ILIKE 'MES%'  THEN val_qual_riv END)           AS mes
        FROM public.mesures_qualite_rivieres
        WHERE ire_station = :station_id
          AND (:date_start IS NULL OR date_prelevement >= :date_start::date)
          AND (:date_end   IS NULL OR date_prelevement <= :date_end::date)
        GROUP BY date_prelevement::date
        ORDER BY date
        """
    )
    return db.execute(
        query,
        {
            "station_id": station_id,
            "date_start": date_start or None,
            "date_end": date_end or None,
        },
    ).mappings().all()


@router.get("/inventory/rows")
def get_pollution_inventory_rows(db: Session = Depends(get_climate_db)):
    query = text(
        """
        with inventory_rows as (
            select
                'Points d''eau'::text as source,
                coalesce(nullif(trim(pe.nature), ''), nullif(trim(pe.utilisation), ''), 'Point d''eau')::text as source_type,
                'Volume preleve'::text as parameter,
                coalesce(nullif(trim(pe.nom_pt_eau), ''), nullif(trim(pe.code_pt_eau), ''), 'Point d''eau sans nom')::text as source_name,
                concat_ws(
                    ' - ',
                    nullif(trim(pe.code_pt_eau), ''),
                    case
                        when pe.foyer_pollution is not null and trim(pe.foyer_pollution) <> '' then 'Foyer: ' || trim(pe.foyer_pollution)
                        else null
                    end
                )::text as location,
                coalesce(to_char(pe.date_realisation, 'YYYY'), to_char(pe.created_at, 'YYYY'), to_char(current_date, 'YYYY'))::text as period,
                pe.vol_preleve_m3_an::double precision as measured_value,
                'm3/an'::text as unit
            from api.v_points_eau pe
            where pe.vol_preleve_m3_an is not null

            union all

            select
                'Points d''eau'::text as source,
                coalesce(nullif(trim(pe.nature), ''), nullif(trim(pe.utilisation), ''), 'Point d''eau')::text as source_type,
                'Niveau piezometrique'::text as parameter,
                coalesce(nullif(trim(pe.nom_pt_eau), ''), nullif(trim(pe.code_pt_eau), ''), 'Point d''eau sans nom')::text as source_name,
                concat_ws(
                    ' - ',
                    nullif(trim(pe.code_pt_eau), ''),
                    case
                        when pe.foyer_pollution is not null and trim(pe.foyer_pollution) <> '' then 'Foyer: ' || trim(pe.foyer_pollution)
                        else null
                    end
                )::text as location,
                coalesce(to_char(pe.date_realisation, 'YYYY'), to_char(pe.created_at, 'YYYY'), to_char(current_date, 'YYYY'))::text as period,
                pe.niv_piezometrique_m::double precision as measured_value,
                'm'::text as unit
            from api.v_points_eau pe
            where pe.niv_piezometrique_m is not null

            union all

            select
                'Points d''eau'::text as source,
                coalesce(nullif(trim(pe.nature), ''), nullif(trim(pe.utilisation), ''), 'Point d''eau')::text as source_type,
                'Profondeur totale'::text as parameter,
                coalesce(nullif(trim(pe.nom_pt_eau), ''), nullif(trim(pe.code_pt_eau), ''), 'Point d''eau sans nom')::text as source_name,
                concat_ws(
                    ' - ',
                    nullif(trim(pe.code_pt_eau), ''),
                    case
                        when pe.foyer_pollution is not null and trim(pe.foyer_pollution) <> '' then 'Foyer: ' || trim(pe.foyer_pollution)
                        else null
                    end
                )::text as location,
                coalesce(to_char(pe.date_realisation, 'YYYY'), to_char(pe.created_at, 'YYYY'), to_char(current_date, 'YYYY'))::text as period,
                pe.profond_tot_m::double precision as measured_value,
                'm'::text as unit
            from api.v_points_eau pe
            where pe.profond_tot_m is not null

            union all

            select
                'Points d''eau'::text as source,
                coalesce(nullif(trim(pe.nature), ''), nullif(trim(pe.utilisation), ''), 'Point d''eau')::text as source_type,
                'Distance foyer pollution'::text as parameter,
                coalesce(nullif(trim(pe.nom_pt_eau), ''), nullif(trim(pe.code_pt_eau), ''), 'Point d''eau sans nom')::text as source_name,
                concat_ws(
                    ' - ',
                    nullif(trim(pe.code_pt_eau), ''),
                    case
                        when pe.foyer_pollution is not null and trim(pe.foyer_pollution) <> '' then 'Foyer: ' || trim(pe.foyer_pollution)
                        else null
                    end
                )::text as location,
                coalesce(to_char(pe.date_realisation, 'YYYY'), to_char(pe.created_at, 'YYYY'), to_char(current_date, 'YYYY'))::text as period,
                pe.dist_pt_eau_foyer_pollut_m::double precision as measured_value,
                'm'::text as unit
            from api.v_points_eau pe
            where pe.dist_pt_eau_foyer_pollut_m is not null

            union all

            select
                'STEP industrielles'::text as source,
                coalesce(nullif(trim(si.secteur), ''), 'STEP industrielle')::text as source_type,
                'Entites recensees'::text as parameter,
                coalesce(nullif(trim(si.nom_step), ''), nullif(trim(si.code_step), ''), 'STEP sans nom')::text as source_name,
                coalesce(nullif(trim(si.commune_nom), ''), 'Commune non renseignee')::text as location,
                coalesce(to_char(si.created_at, 'YYYY'), to_char(current_date, 'YYYY'))::text as period,
                1.0::double precision as measured_value,
                'entite'::text as unit
            from api.v_step_industrielles si

            union all

            select
                'STM'::text as source,
                coalesce(nullif(trim(stm.etat), ''), 'STM')::text as source_type,
                'Entites recensees'::text as parameter,
                coalesce(nullif(trim(stm.nom_stm), ''), nullif(trim(stm.code_stm), ''), 'STM sans nom')::text as source_name,
                coalesce(nullif(trim(stm.commune_nom), ''), 'Commune non renseignee')::text as location,
                coalesce(to_char(stm.created_at, 'YYYY'), to_char(current_date, 'YYYY'))::text as period,
                1.0::double precision as measured_value,
                'entite'::text as unit
            from api.v_stm stm
        )
        select
            source,
            source_type as "sourceType",
            parameter,
            source_name as "sourceName",
            location,
            period,
            round(measured_value::numeric, 2)::double precision as "measuredValue",
            unit
        from inventory_rows
        where measured_value is not null
        order by source, "sourceType", parameter, "sourceName", period
        """
    )
    return db.execute(query).mappings().all()


@router.get("/latest")
def get_quality_latest(
    parameter: str = Query("ph", pattern="^(no3|ph|dbo5|dco|o2|mes)$"),
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    # Mapping robuste des libellés source vers paramètre logique
    where_param = {
        "no3": "parametre_qualite ILIKE 'NO3%'",
        "ph": "parametre_qualite ILIKE 'ph%'",
        "dbo5": "parametre_qualite ILIKE 'DBO%'",
        "dco": "parametre_qualite ILIKE 'DCO%'",
        "o2": "parametre_qualite ILIKE 'O2%'",
        "mes": "parametre_qualite ILIKE 'MES%'",
    }[parameter]

    query = text(
        f"""
        select
            coalesce(sd.station_id::text, sd.legacy_station_id::text, mqr.ire_station)::text as entity_id,
            avg(mqr.val_qual_riv)::double precision as value
        from public.mesures_qualite_rivieres mqr
        left join api.v_station_dimension sd
          on sd.legacy_code_station = mqr.ire_station
          or sd.code_station = mqr.ire_station
        where mqr.ire_station is not null
          and trim(mqr.ire_station) <> ''
          and {where_param}
          and mqr.val_qual_riv is not null
          and (:date_start is null or mqr.date_prelevement >= :date_start::date)
          and (:date_end is null or mqr.date_prelevement <= :date_end::date)
        group by coalesce(sd.station_id::text, sd.legacy_station_id::text, mqr.ire_station)::text
        """
    )
    return db.execute(query, {"date_start": date_start, "date_end": date_end}).mappings().all()
