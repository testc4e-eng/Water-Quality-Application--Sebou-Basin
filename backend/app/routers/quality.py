from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db
from app.services.dashboard import list_quality_stations_with_timeseries

router = APIRouter()


DEFAULT_REGULATORY_TYPE_EAU = "surface_generale"


class QualityClassifyRequest(BaseModel):
    parameter_code: str = Field(..., description="Code canonique ou réglementaire")
    value: float | None = Field(None, description="Valeur mesurée")
    unit: str | None = Field(None, description="Unité de la valeur mesurée")
    type_eau: str | None = None
    water_type: str | None = Field(None, description="Champ legacy déprécié. Utiliser type_eau.")
    version_reglementaire: str | None = None


class QualityGlobalMeasurement(BaseModel):
    parameter_code: str
    value: float | None = None
    unit: str | None = None


class QualityGlobalIndexRequest(BaseModel):
    measurements: list[QualityGlobalMeasurement]
    type_eau: str | None = None
    water_type: str | None = Field(None, description="Champ legacy déprécié. Utiliser type_eau.")
    version_reglementaire: str | None = None


def _row_to_dict(row: Any) -> dict[str, Any] | None:
    if row is None:
        return None
    return dict(row._mapping if hasattr(row, "_mapping") else row)


def _rows_to_dicts(rows: Any) -> list[dict[str, Any]]:
    return [dict(row._mapping if hasattr(row, "_mapping") else row) for row in rows]


def _active_regulatory_version(db: Session, requested_version: str | None = None) -> str | None:
    if requested_version:
        return requested_version
    row = db.execute(
        text(
            """
            SELECT version_reglementaire
            FROM metadata.qualite_source_reglementaire
            WHERE actif IS true
              AND validation_metier IN ('VALIDATED_DEV', 'VALIDATED_METIER')
            ORDER BY updated_at DESC, created_at DESC
            LIMIT 1
            """
        )
    ).first()
    return row[0] if row else None


def _quality_status_payload(status: str, message: str, **extra: Any) -> dict[str, Any]:
    payload = {"status": status, "message": message}
    payload.update(extra)
    return payload


def _resolved_type_eau(type_eau: str | None, water_type: str | None = None) -> str:
    return type_eau or water_type or DEFAULT_REGULATORY_TYPE_EAU


def _with_legacy_warning(payload: dict[str, Any], water_type: str | None, type_eau: str) -> dict[str, Any]:
    payload["type_eau_resolved"] = type_eau
    payload["deprecated_field_used"] = bool(water_type)
    if water_type:
        payload["warning"] = "water_type is deprecated; use type_eau"
    return payload


def _is_operational_type_eau(db: Session, version: str, type_eau: str) -> bool:
    return bool(
        db.execute(
            text(
                """
                SELECT 1
                FROM metadata.qualite_type_eau
                WHERE version_reglementaire = :version
                  AND code_type_eau = :type_eau
                  AND actif IS true
                  AND statut_operationnel = 'REGLEMENTAIRE_OPERATIONNEL'
                LIMIT 1
                """
            ),
            {"version": version, "type_eau": type_eau},
        ).first()
    )


def _severity_order(code_classe: str | None) -> int | None:
    return {
        "excellente": 1,
        "bonne": 2,
        "moyenne": 3,
        "mauvaise": 4,
        "tres_mauvaise": 5,
    }.get(code_classe or "")


def _normalize_unit(unit: str | None) -> str:
    normalized = (
        (unit or "")
        .strip()
        .lower()
        .replace(" ", "")
        .replace("Âµ", "µ")
        .replace("âµ", "µ")
        .replace("μ", "µ")
    )
    if normalized.endswith("g/l") and normalized not in {"mg/l", "mgo2/l"} and "µ" not in normalized:
        return "µg/l"
    return normalized


def _prepare_motor_value(value: float | None, unit: str | None, threshold: dict[str, Any]) -> tuple[float | None, str | None]:
    if value is None:
        return None, "NON_CLASSABLE_VALEUR_MANQUANTE"

    input_unit = _normalize_unit(unit)
    source_unit = _normalize_unit(threshold.get("unite_reglementaire_source"))
    motor_unit = _normalize_unit(threshold.get("unite_moteur"))
    factor = threshold.get("facteur_conversion_vers_unite_moteur")

    if not input_unit or input_unit == motor_unit:
        return float(value), None
    if input_unit == source_unit and factor is not None:
        return float(value) * float(factor), None

    microbiology = {"/100ml", "ufc/100ml", "ufc/100ml"}
    if input_unit in microbiology and motor_unit == "ufc/100ml":
        return float(value), None

    oxygen_units = {"mgo2/l", "mg/l", "mg/litre"}
    if input_unit in oxygen_units and motor_unit == "mg/l":
        return float(value), None

    if not motor_unit:
        return float(value), None

    return None, "NON_CLASSABLE_UNITE"


def _compare_boundary(value: float, operator: str | None, boundary: Any) -> bool:
    if operator is None or boundary is None:
        return True
    bound = float(boundary)
    return {
        ">": value > bound,
        ">=": value >= bound,
        "<": value < bound,
        "<=": value <= bound,
        "=": value == bound,
    }.get(operator, False)


def _numeric_original(value: str | None) -> float | None:
    if value is None:
        return None
    raw = str(value).strip().replace(",", ".")
    if not raw:
        return None
    try:
        return float(raw)
    except ValueError:
        return None


def _threshold_matches(value: float, threshold: dict[str, Any]) -> bool:
    op_min = threshold.get("operateur_min")
    op_max = threshold.get("operateur_max")
    min_value = threshold.get("borne_min_moteur")
    max_value = threshold.get("borne_max_moteur")

    if min_value is not None and max_value is not None and float(min_value) > float(max_value):
        return float(max_value) <= value <= float(min_value)

    if min_value is None and max_value is None:
        original = _numeric_original(threshold.get("valeur_intervalle_originale"))
        if original is None:
            return False
        class_code = threshold.get("code_classe")
        code = threshold.get("code_canonique_cible") or threshold.get("code_reglementaire")
        if code in {"O2_DISS", "O2_DISSOUS"} and class_code == "tres_mauvaise":
            return value <= original
        if class_code == "excellente":
            return value <= original
        return False

    return _compare_boundary(value, op_min, min_value) and _compare_boundary(value, op_max, max_value)


def _classify_value(
    db: Session,
    parameter_code: str,
    value: float | None,
    unit: str | None,
    type_eau: str,
    version_reglementaire: str | None,
) -> dict[str, Any]:
    version = _active_regulatory_version(db, version_reglementaire)
    if not version:
        return _quality_status_payload(
            "NON_CLASSABLE_REFERENTIEL_ABSENT",
            "Aucune version réglementaire active n'est chargée.",
            parameter_code=parameter_code,
            value=value,
            unit=unit,
        )
    if not _is_operational_type_eau(db, version, type_eau):
        return _quality_status_payload(
            "TYPE_EAU_NON_OPERATIONNEL",
            "Le type d'eau demandé existe dans le référentiel documentaire mais n'est pas activé pour la classification réglementaire PREPROD.",
            parameter_code=parameter_code,
            type_eau=type_eau,
            version_reglementaire=version,
        )

    param = _row_to_dict(
        db.execute(
            text(
                """
                SELECT pr.*
                FROM metadata.qualite_parametre_reglementaire pr
                LEFT JOIN metadata.qualite_mapping_canonique_reglementaire mp
                  ON mp.parametre_reglementaire_id = pr.id
                WHERE pr.version_reglementaire = :version
                  AND pr.actif IS true
                  AND (
                    pr.code_reglementaire = :parameter_code
                    OR pr.code_canonique_cible = :parameter_code
                    OR mp.code_canonique = :parameter_code
                  )
                ORDER BY pr.classifiable DESC, pr.code_reglementaire
                LIMIT 1
                """
            ),
            {"version": version, "parameter_code": parameter_code},
        ).first()
    )
    if not param:
        return _quality_status_payload(
            "PARAMETRE_NON_REGLEMENTAIRE",
            "Paramètre absent du référentiel réglementaire actif.",
            parameter_code=parameter_code,
            version_reglementaire=version,
        )

    if not param.get("classifiable") or param.get("statut_operationnel") != "REGLEMENTAIRE_CLASSIFIABLE":
        return _quality_status_payload(
            "NON_CLASSIFIABLE",
            "Paramètre stockable/visible mais non classifiable par le moteur réglementaire.",
            parameter_code=parameter_code,
            code_reglementaire=param.get("code_reglementaire"),
            code_canonique=param.get("code_canonique_cible"),
            reason_code="PARAMETRE_ABSENT_CANONIQUE",
            version_reglementaire=version,
        )

    thresholds = _rows_to_dicts(
        db.execute(
            text(
                """
                SELECT
                    s.*,
                    c.libelle_classe,
                    c.ordre_qualite,
                    c.couleur_sad,
                    te.code_type_eau
                FROM metadata.qualite_seuil_reglementaire s
                JOIN metadata.qualite_classe_reglementaire c ON c.id = s.classe_id
                JOIN metadata.qualite_type_eau te ON te.id = s.type_eau_id
                WHERE s.version_reglementaire = :version
                  AND s.actif IS true
                  AND s.validation_metier IN ('VALIDATED_DEV', 'VALIDATED_METIER')
                  AND te.code_type_eau = :type_eau
                  AND s.code_reglementaire = :code_reglementaire
                ORDER BY c.ordre_qualite
                """
            ),
            {
                "version": version,
                "type_eau": type_eau,
                "code_reglementaire": param.get("code_reglementaire"),
            },
        )
    )
    if not thresholds:
        return _quality_status_payload(
            "HORS_PERIMETRE_REGLEMENTAIRE",
            "Aucun seuil actif n'est disponible pour ce paramètre et ce type d'eau.",
            parameter_code=parameter_code,
            code_reglementaire=param.get("code_reglementaire"),
            code_canonique=param.get("code_canonique_cible"),
            reason_code="SEUIL_ABSENT",
            version_reglementaire=version,
        )

    motor_value, non_classable_reason = _prepare_motor_value(value, unit, thresholds[0])
    if non_classable_reason:
        return _quality_status_payload(
            non_classable_reason,
            "La valeur ou l'unité ne permet pas une classification réglementaire.",
            parameter_code=parameter_code,
            code_reglementaire=param.get("code_reglementaire"),
            code_canonique=param.get("code_canonique_cible"),
            value=value,
            unit=unit,
            version_reglementaire=version,
        )

    for threshold in thresholds:
        if _threshold_matches(motor_value, threshold):
            return {
                "status": "CLASSIFIED",
                "parameter_code": parameter_code,
                "code_reglementaire": param.get("code_reglementaire"),
                "code_canonique": param.get("code_canonique_cible"),
                "value": value,
                "unit": unit,
                "value_motor": motor_value,
                "unit_motor": threshold.get("unite_moteur"),
                "class_code": threshold.get("code_classe"),
                "class_label": threshold.get("libelle_classe"),
                "severity_order": threshold.get("ordre_qualite"),
                "color": threshold.get("couleur_sad"),
                "threshold": {
                    "operator_min": threshold.get("operateur_min"),
                    "borne_min": threshold.get("borne_min_moteur"),
                    "operator_max": threshold.get("operateur_max"),
                    "borne_max": threshold.get("borne_max_moteur"),
                    "original": threshold.get("valeur_intervalle_originale"),
                    "unit_source": threshold.get("unite_reglementaire_source"),
                    "unit_motor": threshold.get("unite_moteur"),
                    "conversion_factor": threshold.get("facteur_conversion_vers_unite_moteur"),
                    "specific_rule": threshold.get("regle_specifique"),
                },
                "regulatory_trace": {
                    "source_document": threshold.get("source_document"),
                    "version_reglementaire": version,
                    "type_eau": type_eau,
                    "validation_metier": threshold.get("validation_metier"),
                },
            }

    return _quality_status_payload(
        "SEUIL_NON_MATCH",
        "La valeur ne correspond à aucun intervalle actif.",
        parameter_code=parameter_code,
        code_reglementaire=param.get("code_reglementaire"),
        code_canonique=param.get("code_canonique_cible"),
        value=value,
        unit=unit,
        value_motor=motor_value,
        version_reglementaire=version,
    )


QUALITY_QA_FILTER = """
      AND (:include_invalid = true OR COALESCE(mqr.est_valide, true) = true)
      AND (
            :include_flagged = true
            OR (
                COALESCE(mqr.qa_flag_null_value, false) = false
                AND COALESCE(mqr.qa_flag_negative, false) = false
                AND COALESCE(mqr.qa_flag_param_missing, false) = false
                AND COALESCE(mqr.qa_flag_station_unmapped, false) = false
            )
      )
"""


@router.get("/thresholds")
def get_regulatory_thresholds(
    parameter_code: str | None = Query(None),
    type_eau: str = Query(DEFAULT_REGULATORY_TYPE_EAU),
    version_reglementaire: str | None = Query(None),
    active_only: bool = Query(True),
    db: Session = Depends(get_climate_db),
):
    version = _active_regulatory_version(db, version_reglementaire)
    if not version:
        return {
            "status": "NO_ACTIVE_REGULATORY_VERSION",
            "count": 0,
            "filters": {
                "parameter_code": parameter_code,
                "type_eau": type_eau,
                "version_reglementaire": version_reglementaire,
                "active_only": active_only,
            },
            "data": [],
        }
    if not _is_operational_type_eau(db, version, type_eau):
        return {
            "status": "TYPE_EAU_NON_OPERATIONNEL",
            "message": "Le type d'eau demandé existe dans le référentiel documentaire mais n'est pas activé pour la classification réglementaire PREPROD.",
            "count": 0,
            "filters": {
                "parameter_code": parameter_code,
                "type_eau": type_eau,
                "version_reglementaire": version,
                "active_only": active_only,
            },
            "data": [],
        }

    query = text(
        f"""
        SELECT
            pr.code_reglementaire,
            pr.code_canonique_cible AS code_canonique,
            pr.parametre_pdf,
            pr.libelle_reglementaire,
            pr.famille_parametre,
            pr.classifiable,
            pr.statut_operationnel,
            te.code_type_eau,
            c.code_classe,
            c.libelle_classe,
            c.ordre_qualite,
            c.couleur_sad,
            s.borne_min_source,
            s.operateur_min,
            s.borne_max_source,
            s.operateur_max,
            s.borne_min_moteur,
            s.borne_max_moteur,
            s.valeur_intervalle_originale,
            s.unite_reglementaire_source,
            s.unite_moteur,
            s.facteur_conversion_vers_unite_moteur,
            s.regle_specifique,
            s.actif,
            s.validation_metier,
            s.source_document,
            s.version_reglementaire
        FROM metadata.qualite_seuil_reglementaire s
        JOIN metadata.qualite_parametre_reglementaire pr ON pr.id = s.parametre_reglementaire_id
        JOIN metadata.qualite_type_eau te ON te.id = s.type_eau_id
        JOIN metadata.qualite_classe_reglementaire c ON c.id = s.classe_id
        WHERE s.version_reglementaire = :version
          AND te.code_type_eau = :type_eau
          AND (:active_only = false OR s.actif IS true)
          AND (
            :parameter_code IS NULL
            OR pr.code_reglementaire = :parameter_code
            OR pr.code_canonique_cible = :parameter_code
          )
        ORDER BY pr.code_reglementaire, c.ordre_qualite
        """
    )
    rows = _rows_to_dicts(
        db.execute(
            query,
            {
                "version": version,
                "type_eau": type_eau,
                "parameter_code": parameter_code,
                "active_only": active_only,
            },
        )
    )
    return {
        "status": "OK",
        "count": len(rows),
        "filters": {
            "parameter_code": parameter_code,
            "type_eau": type_eau,
            "version_reglementaire": version,
            "active_only": active_only,
        },
        "data": rows,
    }


@router.post("/classify")
def classify_regulatory_quality(
    payload: QualityClassifyRequest,
    db: Session = Depends(get_climate_db),
):
    type_eau = _resolved_type_eau(payload.type_eau, payload.water_type)
    result = _classify_value(
        db,
        parameter_code=payload.parameter_code,
        value=payload.value,
        unit=payload.unit,
        type_eau=type_eau,
        version_reglementaire=payload.version_reglementaire,
    )
    return _with_legacy_warning(result, payload.water_type, type_eau)


@router.post("/global-index")
def classify_regulatory_global_index(
    payload: QualityGlobalIndexRequest,
    db: Session = Depends(get_climate_db),
):
    if not payload.measurements:
        raise HTTPException(status_code=422, detail="measurements ne doit pas être vide")

    type_eau = _resolved_type_eau(payload.type_eau, payload.water_type)
    details = [
        _classify_value(
            db,
            parameter_code=item.parameter_code,
            value=item.value,
            unit=item.unit,
            type_eau=type_eau,
            version_reglementaire=payload.version_reglementaire,
        )
        for item in payload.measurements
    ]
    classified = [item for item in details if item.get("status") == "CLASSIFIED"]
    if not classified:
        return _with_legacy_warning({
            "status": "NON_CLASSABLE_GLOBAL",
            "message": "Aucune mesure classifiable réglementairement.",
            "type_eau": type_eau,
            "details": details,
        }, payload.water_type, type_eau)

    worst = max(classified, key=lambda item: item.get("severity_order") or 0)
    return _with_legacy_warning({
        "status": "CLASSIFIED_GLOBAL",
        "global_class_code": worst.get("class_code"),
        "global_class_label": worst.get("class_label"),
        "severity_order": worst.get("severity_order"),
        "color": worst.get("color"),
        "penalizing_parameter": {
            "parameter_code": worst.get("parameter_code"),
            "code_reglementaire": worst.get("code_reglementaire"),
            "code_canonique": worst.get("code_canonique"),
            "value": worst.get("value"),
            "unit": worst.get("unit"),
        },
        "classified_count": len(classified),
        "non_classifiable_count": len(details) - len(classified),
        "details": details,
    }, payload.water_type, type_eau)


@router.get("/regulatory-status")
def get_regulatory_status(
    version_reglementaire: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    version = _active_regulatory_version(db, version_reglementaire)
    if not version:
        return {
            "status": "NO_ACTIVE_REGULATORY_VERSION",
            "version_reglementaire": version_reglementaire,
            "summary": {},
            "issues": {
                "parameters_without_mapping": [],
                "true_absent_canonical": [],
            },
        }

    summary_rows = _rows_to_dicts(
        db.execute(
            text(
                """
                SELECT 'sources' AS key, count(*)::int AS total FROM metadata.qualite_source_reglementaire WHERE version_reglementaire = :version
                UNION ALL SELECT 'types_eau', count(*)::int FROM metadata.qualite_type_eau WHERE version_reglementaire = :version
                UNION ALL SELECT 'classes', count(*)::int FROM metadata.qualite_classe_reglementaire WHERE version_reglementaire = :version
                UNION ALL SELECT 'parameters', count(*)::int FROM metadata.qualite_parametre_reglementaire WHERE version_reglementaire = :version
                UNION ALL SELECT 'parameters_classifiable', count(*)::int FROM metadata.qualite_parametre_reglementaire WHERE version_reglementaire = :version AND classifiable IS true
                UNION ALL SELECT 'mappings_active', count(*)::int FROM metadata.qualite_mapping_canonique_reglementaire WHERE version_reglementaire = :version AND actif IS true
                UNION ALL SELECT 'thresholds', count(*)::int FROM metadata.qualite_seuil_reglementaire WHERE version_reglementaire = :version
                UNION ALL SELECT 'thresholds_active', count(*)::int FROM metadata.qualite_seuil_reglementaire WHERE version_reglementaire = :version AND actif IS true
                UNION ALL SELECT 'rules', count(*)::int FROM metadata.qualite_regle_classification WHERE version_reglementaire = :version
                """
            ),
            {"version": version},
        )
    )
    parameters_without_mapping = _rows_to_dicts(
        db.execute(
            text(
                """
                SELECT pr.code_reglementaire, pr.code_canonique_cible, pr.parametre_pdf, pr.statut_operationnel
                FROM metadata.qualite_parametre_reglementaire pr
                LEFT JOIN metadata.qualite_mapping_canonique_reglementaire mp
                  ON mp.parametre_reglementaire_id = pr.id
                 AND mp.actif IS true
                WHERE pr.version_reglementaire = :version
                  AND pr.classifiable IS true
                  AND (mp.id IS NULL OR mp.parametre_canonique_id IS NULL)
                ORDER BY pr.code_reglementaire
                """
            ),
            {"version": version},
        )
    )
    true_absent = _rows_to_dicts(
        db.execute(
            text(
                """
                SELECT code_reglementaire, parametre_pdf, commentaire
                FROM metadata.qualite_parametre_reglementaire
                WHERE version_reglementaire = :version
                  AND classifiable IS false
                  AND statut_operationnel = 'OBSERVATIONNEL_NON_CLASSIFIABLE'
                ORDER BY code_reglementaire
                """
            ),
            {"version": version},
        )
    )
    return {
        "status": "OK",
        "version_reglementaire": version,
        "summary": {item["key"]: item["total"] for item in summary_rows},
        "issues": {
            "parameters_without_mapping": parameters_without_mapping,
            "true_absent_canonical": true_absent,
        },
        "rules": {
            "scope": "Tableau n°1 uniquement",
            "simplified_grids": "DOCUMENTAIRE_NON_OPERATIONNEL",
            "global_index": "paramètre le plus pénalisant",
            "case_sensitive": "MO != Mo",
        },
    }


@router.get("/stations")
def get_quality_stations(
    include_invalid: bool = Query(False),
    include_flagged: bool = Query(False),
    db: Session = Depends(get_climate_db),
):
    """
    Retourne la liste des stations ayant des mesures dans mesures_qualite_rivieres.
    """
    query = text(
        f"""
        SELECT DISTINCT
            COALESCE(mqr.station_id::text, mqr.ire_station) AS station_id,
            coalesce(
                nullif(trim(sd.station_nom), ''),
                nullif(trim(sd.code_station), ''),
                COALESCE(mqr.station_id::text, mqr.ire_station)
            )                                           AS station_name,
            min(mqr.temps)::date                        AS dt_min,
            max(mqr.temps)::date                        AS dt_max,
            count(*)::int                               AS n_mesures
        FROM qualite.mesure_qualite_riviere mqr
        LEFT JOIN api.v_station_dimension sd
            ON sd.station_id::text      = mqr.station_id::text
            OR sd.legacy_code_station   = mqr.ire_station
            OR sd.code_station          = mqr.ire_station
        WHERE COALESCE(mqr.ire_station, mqr.station_id::text) IS NOT NULL
          AND trim(COALESCE(mqr.ire_station, mqr.station_id::text)) <> ''
          {QUALITY_QA_FILTER}
        GROUP BY COALESCE(mqr.station_id::text, mqr.ire_station), sd.station_nom, sd.code_station
        ORDER BY station_name
        """
    )
    return db.execute(
        query,
        {"include_invalid": include_invalid, "include_flagged": include_flagged},
    ).mappings().all()


@router.get("/stations-with-timeseries")
def get_quality_stations_with_timeseries(
    limit: int = Query(6, ge=1, le=20),
    db: Session = Depends(get_climate_db),
):
    """
    Retourne les stations qualité réellement actives dans qualite.mesure_qualite_sebou,
    enrichies avec couverture temporelle, dernières valeurs et statut réglementaire simplifié.
    """
    return list_quality_stations_with_timeseries(db, limit=limit)


@router.get("/parameters")
def get_quality_parameters(
    station_id: str | None = Query(None),
    include_invalid: bool = Query(False),
    include_flagged: bool = Query(False),
    db: Session = Depends(get_climate_db),
):
    """
    Retourne la liste des paramètres qualité disponibles (optionnellement filtrés par station).
    """
    where = """
        WHERE (:station_id IS NULL
               OR mqr.station_id::text = :station_id
               OR mqr.ire_station = :station_id)
    """
    query = text(
        f"""
        SELECT DISTINCT
            trim(parametre_qualite) AS parameter,
            count(*)::int           AS n_mesures
        FROM qualite.mesure_qualite_riviere mqr
        {where}
        {QUALITY_QA_FILTER}
        GROUP BY trim(parametre_qualite)
        ORDER BY parameter
        """
    )
    params = {
        "station_id": station_id,
        "include_invalid": include_invalid,
        "include_flagged": include_flagged,
    }
    return db.execute(query, params).mappings().all()


@router.get("/timeseries")
def get_quality_timeseries(
    station_id: str,
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    include_invalid: bool = Query(False),
    include_flagged: bool = Query(False),
    db: Session = Depends(get_climate_db),
):
    """
    Séries temporelles des paramètres qualité (NO3, pH, DBO5, DCO, O2)
    pour une station, pivotées par date de prélèvement.
    """
    query = text(
        f"""
        SELECT
            temps::date                                                          AS date,
            max(CASE WHEN parametre_qualite ILIKE 'NO3%'  THEN valeur END)       AS no3,
            max(CASE WHEN parametre_qualite ILIKE 'ph%'   THEN valeur END)       AS ph,
            max(CASE WHEN parametre_qualite ILIKE 'DBO%'  THEN valeur END)       AS dbo5,
            max(CASE WHEN parametre_qualite ILIKE 'DCO%'  THEN valeur END)       AS dco,
            max(CASE WHEN parametre_qualite ILIKE 'O2%'   THEN valeur END)       AS o2,
            max(CASE WHEN parametre_qualite ILIKE 'MES%'  THEN valeur END)       AS mes
        FROM qualite.mesure_qualite_riviere mqr
        WHERE (mqr.station_id::text = :station_id OR mqr.ire_station = :station_id)
          AND (:date_start IS NULL OR mqr.temps >= CAST(:date_start AS date))
          AND (:date_end   IS NULL OR mqr.temps <= CAST(:date_end AS date))
          {QUALITY_QA_FILTER}
        GROUP BY temps::date
        ORDER BY date
        """
    )
    return db.execute(
        query,
        {
            "station_id": station_id,
            "date_start": date_start or None,
            "date_end": date_end or None,
            "include_invalid": include_invalid,
            "include_flagged": include_flagged,
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
    include_invalid: bool = Query(False),
    include_flagged: bool = Query(False),
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
            avg(mqr.valeur)::double precision as value
        from qualite.mesure_qualite_riviere mqr
        left join api.v_station_dimension sd
          on sd.station_id::text = mqr.station_id::text
          or sd.legacy_code_station = mqr.ire_station
          or sd.code_station = mqr.ire_station
        where COALESCE(mqr.station_id::text, mqr.ire_station) is not null
          and trim(COALESCE(mqr.station_id::text, mqr.ire_station)) <> ''
          and {where_param}
          and mqr.valeur is not null
          and (:date_start is null or mqr.temps >= CAST(:date_start AS date))
          and (:date_end is null or mqr.temps <= CAST(:date_end AS date))
          {QUALITY_QA_FILTER}
        group by coalesce(sd.station_id::text, sd.legacy_station_id::text, mqr.ire_station)::text
        """
    )
    return db.execute(
        query,
        {
            "date_start": date_start,
            "date_end": date_end,
            "include_invalid": include_invalid,
            "include_flagged": include_flagged,
        },
    ).mappings().all()
