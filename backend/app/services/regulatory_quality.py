from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session


@dataclass(frozen=True)
class RegulatoryContext:
    version: str | None
    type_eau_code: str
    parameters_by_alias: dict[str, dict[str, Any]]
    thresholds_by_parameter: dict[str, list[dict[str, Any]]]


def _as_float(value: Any) -> float | None:
    if value is None or value == "":
        return None
    try:
        return float(Decimal(str(value).replace(",", ".")))
    except (InvalidOperation, ValueError):
        return None


def _normalize_unit(unit: str | None) -> str | None:
    if not unit:
        return None
    normalized = (
        str(unit)
        .strip()
        .replace("Âµ", "µ")
        .replace("μ", "µ")
        .replace(" ", "")
        .lower()
    )
    aliases = {
        "mg/l": "mg/l",
        "mgo2/l": "mg/l",
        "mgd'o2/l": "mg/l",
        "mgn/l": "mg/l",
        "mgnh4/l": "mg/l",
        "mgno3/l": "mg/l",
        "mgp/l": "mg/l",
        "µg/l": "µg/l",
        "ug/l": "µg/l",
        "ufc/100ml": "ufc/100ml",
        "/100ml": "ufc/100ml",
    }
    return aliases.get(normalized, normalized)


def _passes_min(value: float, operator: str | None, bound: Any) -> bool:
    numeric_bound = _as_float(bound)
    if numeric_bound is None:
        return True
    if operator == ">":
        return value > numeric_bound
    return value >= numeric_bound


def _passes_max(value: float, operator: str | None, bound: Any) -> bool:
    numeric_bound = _as_float(bound)
    if numeric_bound is None:
        return True
    if operator == "<":
        return value < numeric_bound
    return value <= numeric_bound


def _threshold_matches(value: float, threshold: dict[str, Any]) -> bool:
    min_value = _as_float(threshold.get("borne_min"))
    max_value = _as_float(threshold.get("borne_max"))
    min_operator = threshold.get("operateur_min")
    max_operator = threshold.get("operateur_max")

    if min_value is not None and max_value is not None and min_value > max_value:
        return max_value <= value <= min_value
    return _passes_min(value, min_operator, min_value) and _passes_max(
        value,
        max_operator,
        max_value,
    )


def _prepare_motor_value(value: float | None, unit: str | None, threshold: dict[str, Any]) -> tuple[float | None, str | None]:
    if value is None:
        return None, "NON_CLASSABLE_VALEUR_MANQUANTE"

    input_unit = _normalize_unit(unit)
    source_unit = _normalize_unit(threshold.get("unite_source"))
    motor_unit = _normalize_unit(threshold.get("unite_moteur"))
    factor = _as_float(threshold.get("facteur_conversion"))

    if not input_unit or input_unit == motor_unit:
        return float(value), None
    if input_unit == source_unit and factor is not None:
        return float(value) * factor, None

    if input_unit in {"/100ml", "ufc/100ml"} and motor_unit == "ufc/100ml":
        return float(value), None

    if input_unit in {"mgo2/l", "mg/l", "mg/litre"} and motor_unit == "mg/l":
        return float(value), None

    if not motor_unit:
        return float(value), None

    return None, "NON_CLASSABLE_UNITE"


def _to_dict(row: Any) -> dict[str, Any]:
    data = dict(row)
    for key, value in list(data.items()):
        if isinstance(value, Decimal):
            data[key] = float(value)
    return data


def _active_version(db: Session) -> str | None:
    return db.execute(
        text(
            """
            SELECT version_reglementaire
            FROM metadata.qualite_source_reglementaire
            WHERE actif IS TRUE
            ORDER BY created_at DESC
            LIMIT 1
            """
        )
    ).scalar_one_or_none()


def load_regulatory_context(
    db: Session,
    *,
    type_eau_code: str = "surface_generale",
    version_reglementaire: str | None = None,
) -> RegulatoryContext:
    version = version_reglementaire or _active_version(db)
    if not version:
        return RegulatoryContext(version=None, type_eau_code=type_eau_code, parameters_by_alias={}, thresholds_by_parameter={})

    parameter_rows = db.execute(
        text(
            """
            SELECT
                p.id AS parametre_reglementaire_id,
                p.code_reglementaire,
                p.code_canonique_cible,
                p.libelle_reglementaire,
                p.unite_reglementaire_source AS unite_source,
                p.unite_moteur,
                p.facteur_conversion_vers_unite_moteur AS facteur_conversion,
                p.classifiable,
                p.actif,
                p.statut_operationnel,
                p.validation_metier,
                p.commentaire,
                m.code_canonique,
                m.statut_mapping
            FROM metadata.qualite_parametre_reglementaire p
            LEFT JOIN metadata.qualite_mapping_canonique_reglementaire m
                ON m.parametre_reglementaire_id = p.id
                AND m.actif IS TRUE
                AND m.version_reglementaire = p.version_reglementaire
            WHERE p.actif IS TRUE
              AND p.version_reglementaire = :version_reglementaire
            """
        ),
        {"version_reglementaire": version},
    ).mappings()

    parameters_by_alias: dict[str, dict[str, Any]] = {}
    for row in parameter_rows:
        parameter = _to_dict(row)
        aliases = [
            parameter.get("code_reglementaire"),
            parameter.get("code_canonique"),
            parameter.get("code_canonique_cible"),
        ]
        for alias in aliases:
            if alias:
                parameters_by_alias[str(alias)] = parameter

    threshold_rows = db.execute(
        text(
            """
            SELECT
                p.code_reglementaire,
                s.id AS seuil_reglementaire_id,
                s.classe_id,
                c.code_classe,
                c.libelle_classe,
                c.couleur_sad,
                c.couleur_hex,
                c.ordre_qualite,
                s.borne_min_moteur AS borne_min,
                s.operateur_min,
                s.borne_max_moteur AS borne_max,
                s.operateur_max,
                s.valeur_intervalle_originale,
                s.unite_reglementaire_source AS unite_source,
                s.unite_moteur,
                s.facteur_conversion_vers_unite_moteur AS facteur_conversion,
                s.source_document,
                NULL::integer AS page_source
            FROM metadata.qualite_seuil_reglementaire s
            JOIN metadata.qualite_parametre_reglementaire p
                ON p.id = s.parametre_reglementaire_id
            JOIN metadata.qualite_classe_reglementaire c
                ON c.id = s.classe_id
            JOIN metadata.qualite_type_eau t
                ON t.id = s.type_eau_id
            WHERE s.actif IS TRUE
              AND s.validation_metier IN ('VALIDATED_DEV', 'VALIDATED_METIER')
              AND p.actif IS TRUE
              AND c.actif IS TRUE
              AND t.actif IS TRUE
              AND s.version_reglementaire = :version_reglementaire
              AND t.code_type_eau = :type_eau_code
            ORDER BY p.code_reglementaire, c.ordre_qualite ASC
            """
        ),
        {"version_reglementaire": version, "type_eau_code": type_eau_code},
    ).mappings()

    thresholds_by_parameter: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in threshold_rows:
        threshold = _to_dict(row)
        thresholds_by_parameter[threshold["code_reglementaire"]].append(threshold)

    return RegulatoryContext(
        version=version,
        type_eau_code=type_eau_code,
        parameters_by_alias=parameters_by_alias,
        thresholds_by_parameter=dict(thresholds_by_parameter),
    )


def classify_measurement(
    context: RegulatoryContext,
    *,
    parameter_code: str | None,
    value_numeric: Any,
    unit: str | None,
) -> dict[str, Any]:
    if not context.version:
        return {
            "status": "REFERENTIEL_REGLEMENTAIRE_ABSENT",
            "message": "Aucune version réglementaire active.",
        }
    if not parameter_code:
        return {"status": "PARAMETRE_MANQUANT", "message": "Code paramètre absent."}

    parameter = context.parameters_by_alias.get(str(parameter_code))
    if not parameter:
        return {
            "status": "PARAMETRE_NON_REGLEMENTAIRE",
            "message": "Paramètre absent du référentiel réglementaire opérationnel.",
        }

    if parameter.get("classifiable") is not True:
        return {
            "status": "NON_CLASSIFIABLE",
            "reason_code": "PARAMETRE_NON_CLASSIFIABLE",
            "message": "Paramètre stockable et visualisable, mais non classifiable par seuil réglementaire.",
            "regulatory_parameter": parameter,
        }

    value = _as_float(value_numeric)
    if value is None:
        return {
            "status": "VALEUR_NON_NUMERIQUE",
            "message": "Valeur absente ou non numérique.",
            "regulatory_parameter": parameter,
        }

    thresholds = context.thresholds_by_parameter.get(parameter["code_reglementaire"], [])
    if not thresholds:
        return {
            "status": "HORS_PERIMETRE_REGLEMENTAIRE",
            "reason_code": "SEUIL_ABSENT",
            "message": "Aucun seuil actif pour ce paramètre et ce type d'eau.",
            "regulatory_parameter": parameter,
        }

    motor_value, non_classable_reason = _prepare_motor_value(value, unit, thresholds[0])
    if non_classable_reason or motor_value is None:
        return {
            "status": non_classable_reason or "NON_CLASSABLE_VALEUR",
            "message": "La valeur ou l'unité ne permet pas une classification réglementaire.",
            "regulatory_parameter": parameter,
        }

    for threshold in thresholds:
        if _threshold_matches(motor_value, threshold):
            return {
                "status": "CLASSIFIED",
                "version_reglementaire": context.version,
                "type_eau": context.type_eau_code,
                "parameter_code": parameter["code_reglementaire"],
                "class_code": threshold["code_classe"],
                "class_label": threshold["libelle_classe"],
                "color": threshold.get("couleur_hex") or threshold.get("couleur_sad"),
                "severity_order": threshold["ordre_qualite"],
                "threshold": {
                    "borne_min": threshold.get("borne_min"),
                    "operateur_min": threshold.get("operateur_min"),
                    "borne_max": threshold.get("borne_max"),
                    "operateur_max": threshold.get("operateur_max"),
                    "valeur_intervalle_originale": threshold.get("valeur_intervalle_originale"),
                    "unite_source": threshold.get("unite_source"),
                    "unite_moteur": threshold.get("unite_moteur"),
                    "tableau_source": threshold.get("tableau_source"),
                    "page_source": threshold.get("page_source"),
                },
            }

    return {
        "status": "HORS_INTERVALLES",
        "message": "Valeur numérique hors des intervalles actifs.",
        "regulatory_parameter": parameter,
    }
