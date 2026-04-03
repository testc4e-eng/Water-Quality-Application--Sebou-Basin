from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db

router = APIRouter()


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
