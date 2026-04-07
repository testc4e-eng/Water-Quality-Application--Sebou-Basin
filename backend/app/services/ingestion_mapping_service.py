from __future__ import annotations

import re
from typing import Any

import pandas as pd

from app.services.ingestion_structural_validation import (
    _infer_column_type,
    _normalize_col_name,
    load_structural_source,
    validate_structural_file,
)


def _type_compatible(type_source: str, type_cible: str) -> bool:
    if type_source == type_cible:
        return True
    if type_cible == "numerique" and type_source in {"texte"}:
        return False
    if type_cible == "date" and type_source == "texte":
        return False
    return False


WASP_SEGMENT_PATTERN = re.compile(r"^segment_(\d+)_(.+)$")


def _target_schema_for_format(model: str, format_detecte: str | None) -> dict[str, str]:
    fmt = (format_detecte or model or "").upper()
    if "SWAT OUTPUT (SUB RAW)" in fmt:
        return {
            "subbasin": "numerique",
            "date": "date",
            "precip": "numerique",
            "surq": "numerique",
            "gw_q": "numerique",
            "wyld": "numerique",
            "sedp": "numerique",
            "orgn": "numerique",
            "solp": "numerique",
        }
    if "SWAT OUTPUT (RCH RAW)" in fmt:
        return {
            "reach": "numerique",
            "date": "date",
            "flow_in": "numerique",
            "flow_out": "numerique",
            "sed_in": "numerique",
            "sed_out": "numerique",
            "no3_out": "numerique",
            "orgp_out": "numerique",
            "chla_out": "numerique",
        }
    # WASP target long schema
    return {
        "segment_id": "numerique",
        "date": "date",
        "variable": "texte",
        "value": "numerique",
    }


def _mapping_rules_for_format(model: str, format_detecte: str | None) -> dict[str, str]:
    fmt = (format_detecte or model or "").upper()
    if "SWAT OUTPUT (SUB RAW)" in fmt:
        return {
            "sub": "subbasin",
            "yyyyddd": "date",
            "precipmm": "precip",
            "surqmm": "surq",
            "gw_qmm": "gw_q",
            "wyldmm": "wyld",
            "sedpkg_ha": "sedp",
            "orgnkg_ha": "orgn",
            "solpkg_ha": "solp",
        }
    if "SWAT OUTPUT (RCH RAW)" in fmt:
        return {
            "sub": "reach",
            "yyyyddd": "date",
            "flow_incms": "flow_in",
            "flow_outcms": "flow_out",
            "sed_intons": "sed_in",
            "sed_outtons": "sed_out",
            "no3_outkg": "no3_out",
            "orgp_outkg": "orgp_out",
            "chla_outkg": "chla_out",
        }
    # WASP
    return {"date_time": "date"}


def _infer_direct_or_pattern_target(norm_col: str, rules: dict[str, str], format_detecte: str | None) -> str | None:
    if norm_col in rules:
        return rules[norm_col]
    fmt = (format_detecte or "").upper()
    if "WASP TOXI (WIDE RAW)" in fmt and WASP_SEGMENT_PATTERN.match(norm_col):
        return "value"
    return None


def _is_wasp_wide_transformable_segment_column(norm_col: str, format_detecte: str | None) -> bool:
    fmt = (format_detecte or "").upper()
    return "WASP TOXI (WIDE RAW)" in fmt and bool(WASP_SEGMENT_PATTERN.match(norm_col))


def _can_transform_to_target(
    *,
    norm_col: str,
    type_source: str,
    type_cible: str,
    inferred_target: str | None,
    format_detecte: str | None,
) -> bool:
    if inferred_target is None:
        return False

    if _is_wasp_wide_transformable_segment_column(norm_col, format_detecte) and inferred_target == "value":
        return type_source == "numerique"

    if inferred_target == "date" and norm_col == "date_time":
        # WASP Excel often stores datetime as serial numeric values.
        return type_source in {"numerique", "texte", "date"} and type_cible == "date"

    return False


def _convert_excel_or_text_datetime(series: pd.Series) -> pd.Series:
    # 1) Try numeric Excel serial conversion (origin 1899-12-30)
    numeric = pd.to_numeric(series, errors="coerce")
    from_numeric = pd.to_datetime(numeric, unit="D", origin="1899-12-30", errors="coerce")

    # 2) Fallback to generic datetime parsing for text/date cells
    from_text = pd.to_datetime(series, errors="coerce", dayfirst=True)

    # Prefer numeric conversion when available, otherwise parsed text.
    return from_numeric.where(from_numeric.notna(), from_text)


def build_mapping_report(path: str, original_filename: str | None = None) -> dict[str, Any]:
    structural = validate_structural_file(path=path, original_filename=original_filename)
    source = load_structural_source(path)
    format_detecte = structural.get("format_detecte")
    model = structural.get("modele_detecte", "INCONNU")
    target_schema = _target_schema_for_format(str(model), str(format_detecte) if format_detecte else None)
    rules = _mapping_rules_for_format(str(model), str(format_detecte) if format_detecte else None)

    rows: list[dict[str, Any]] = []
    covered_targets: set[str] = set()
    covered_targets_ready: set[str] = set()
    source_cols = [str(c) for c in source.df.columns]
    has_wasp_segment_columns = False

    for col in source_cols:
        norm = _normalize_col_name(col)
        inferred_target = _infer_direct_or_pattern_target(norm, rules, str(format_detecte) if format_detecte else None)
        if _is_wasp_wide_transformable_segment_column(norm, str(format_detecte) if format_detecte else None):
            has_wasp_segment_columns = True
        type_source = _infer_column_type(source.df[col])
        measured_series = source.df[col]
        if inferred_target == "date" and norm == "date_time":
            measured_series = _convert_excel_or_text_datetime(source.df[col])
            if measured_series.notna().mean() >= 0.9:
                type_source = "date"
        nulls = int(measured_series.isna().sum())
        total = max(1, int(len(source.df)))
        fill_pct = round(((total - nulls) / total) * 100.0, 2)
        type_cible = target_schema.get(inferred_target, "inconnu") if inferred_target else "inconnu"
        compatible = bool(inferred_target and _type_compatible(type_source, type_cible))
        transformable = _can_transform_to_target(
            norm_col=norm,
            type_source=type_source,
            type_cible=type_cible,
            inferred_target=inferred_target,
            format_detecte=str(format_detecte) if format_detecte else None,
        )

        if inferred_target:
            covered_targets.add(inferred_target)
            if compatible or transformable:
                covered_targets_ready.add(inferred_target)

        if inferred_target is None:
            statut = "ORPHELIN"
        elif transformable and not compatible:
            statut = "TRANSFORMABLE"
        elif not compatible:
            statut = "INCOMPATIBLE"
        else:
            statut = "VALIDE"

        rows.append(
            {
                "statut": statut,
                "champ_source": col,
                "champ_cible": inferred_target,
                "type_source": type_source,
                "type_cible": type_cible,
                "compatible": compatible,
                "transformable": transformable,
                "taux_remplissage_pct": fill_pct,
                "valeurs_nulles": nulls,
            }
        )

    fmt = (format_detecte or "").upper()
    if "WASP TOXI (WIDE RAW)" in fmt and has_wasp_segment_columns:
        synthetic_rows = [
            {
                "statut": "TRANSFORMABLE",
                "champ_source": "Segment_X-*",
                "champ_cible": "segment_id",
                "type_source": "texte (nom de colonne)",
                "type_cible": target_schema["segment_id"],
                "compatible": False,
                "transformable": True,
                "taux_remplissage_pct": 100.0,
                "valeurs_nulles": 0,
            },
            {
                "statut": "TRANSFORMABLE",
                "champ_source": "Segment_X-*",
                "champ_cible": "variable",
                "type_source": "texte (nom de colonne)",
                "type_cible": target_schema["variable"],
                "compatible": False,
                "transformable": True,
                "taux_remplissage_pct": 100.0,
                "valeurs_nulles": 0,
            },
        ]
        rows.extend(synthetic_rows)
        covered_targets.add("segment_id")
        covered_targets.add("variable")
        covered_targets_ready.add("segment_id")
        covered_targets_ready.add("variable")

    champs_cibles_manquants = [k for k in target_schema.keys() if k not in covered_targets]
    champs_cibles_non_prets = [k for k in target_schema.keys() if k not in covered_targets_ready]
    for target in champs_cibles_manquants:
        rows.append(
            {
                "statut": "INCOMPATIBLE",
                "champ_source": None,
                "champ_cible": target,
                "type_source": "absent",
                "type_cible": target_schema[target],
                "compatible": False,
                "transformable": False,
                "taux_remplissage_pct": 0.0,
                "valeurs_nulles": None,
            }
        )

    score_completude = round((len(covered_targets) / max(1, len(target_schema))) * 100.0, 2)
    score_pret_migration = round((len(covered_targets_ready) / max(1, len(target_schema))) * 100.0, 2)

    order = {"INCOMPATIBLE": 0, "TRANSFORMABLE": 1, "ORPHELIN": 2, "VALIDE": 3}
    rows_sorted = sorted(rows, key=lambda r: (order.get(str(r.get("statut")), 9), str(r.get("champ_source") or "")))

    return {
        "modele_detecte": model,
        "format_detecte": format_detecte,
        "score_completude_pct": score_completude,
        "score_pret_migration_pct": score_pret_migration,
        "colonnes_orphelines": [r["champ_source"] for r in rows_sorted if r["statut"] == "ORPHELIN"],
        "champs_cibles_non_couverts": champs_cibles_manquants,
        "champs_cibles_non_prets_migration": champs_cibles_non_prets,
        "tableau_mapping": rows_sorted,
    }
