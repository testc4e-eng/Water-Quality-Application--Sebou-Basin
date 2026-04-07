from __future__ import annotations

import re
from typing import Any

import pandas as pd
from sqlalchemy.orm import Session

from app.services.ingestion_dedup_service import detect_duplicate_before_ingestion
from app.services.ingestion_mapping_service import build_mapping_report
from app.services.ingestion_structural_validation import _normalize_col_name, load_structural_source, validate_structural_file
from app.services.qa_validation_service import SWAT_THRESHOLDS, Threshold


WASP_SEGMENT_PATTERN = re.compile(r"^segment_(\d+)_(.+)$")


def _to_datetime_series(series: pd.Series) -> pd.Series:
    numeric = pd.to_numeric(series, errors="coerce")
    from_numeric = pd.to_datetime(numeric, unit="D", origin="1899-12-30", errors="coerce")
    from_text = pd.to_datetime(series, errors="coerce", dayfirst=True)
    return from_numeric.where(from_numeric.notna(), from_text)


def _resolve_wasp_threshold(variable_name: str) -> Threshold:
    name = (variable_name or "").strip().lower()
    if "dissolved oxygen" in name:
        return Threshold(min_value=4.0, max_value=14.0)
    if name == "ph" or "ph" in name:
        return Threshold(min_value=6.0, max_value=9.0)
    if "temperature" in name:
        return Threshold(min_value=0.0, max_value=35.0)
    return Threshold(min_value=0.0, max_value=20.0)


def _is_critical(value: float, threshold: Threshold) -> bool:
    if threshold.min_value is not None and value < threshold.min_value:
        return True
    if threshold.max_value is not None and value > threshold.max_value:
        return True
    return False


def _find_col(df: pd.DataFrame, name: str) -> str | None:
    target = _normalize_col_name(name)
    for col in df.columns:
        if _normalize_col_name(str(col)) == target:
            return str(col)
    return None


def _swat_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    entity_col = _find_col(df, "subbasin") or _find_col(df, "sub") or _find_col(df, "reach")
    date_col = _find_col(df, "date")
    yyyyddd_col = _find_col(df, "yyyyddd")
    year_col = _find_col(df, "year")
    mon_col = _find_col(df, "mon")

    if date_col:
        date_values = pd.to_datetime(df[date_col], errors="coerce", dayfirst=True)
    elif yyyyddd_col:
        yday = pd.to_numeric(df[yyyyddd_col], errors="coerce").dropna().astype(int).astype(str)
        date_values = pd.to_datetime(yday, format="%Y%j", errors="coerce")
        date_values = date_values.reindex(df.index)
    elif year_col and mon_col:
        year = pd.to_numeric(df[year_col], errors="coerce")
        mon = pd.to_numeric(df[mon_col], errors="coerce")
        tmp = pd.DataFrame({"year": year, "month": mon, "day": 1})
        date_values = pd.to_datetime(tmp, errors="coerce")
    else:
        date_values = pd.Series([pd.NaT] * len(df), index=df.index)

    var_map = {
        "precip": _find_col(df, "precip") or _find_col(df, "precipmm"),
        "surq": _find_col(df, "surq") or _find_col(df, "surqmm"),
        "gw_q": _find_col(df, "gw_q") or _find_col(df, "gw_qmm"),
        "wyld": _find_col(df, "wyld") or _find_col(df, "wyldmm"),
        "sedp": _find_col(df, "sedp") or _find_col(df, "sedpkg_ha"),
        "orgn": _find_col(df, "orgn") or _find_col(df, "orgnkg_ha"),
        "solp": _find_col(df, "solp") or _find_col(df, "solpkg_ha"),
    }

    for idx in df.index:
        entity = None
        if entity_col:
            ev = pd.to_numeric(pd.Series([df.at[idx, entity_col]]), errors="coerce").iloc[0]
            entity = int(ev) if pd.notna(ev) else None
        dt = date_values.iloc[idx] if idx in date_values.index else pd.NaT
        dt_str = dt.date().isoformat() if pd.notna(dt) else None
        for variable, src_col in var_map.items():
            if not src_col:
                continue
            val = pd.to_numeric(pd.Series([df.at[idx, src_col]]), errors="coerce").iloc[0]
            if pd.isna(val):
                continue
            records.append({"entite": entity, "date": dt_str, "variable": variable, "valeur": float(val)})
    return records


def _wasp_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    segment_col = _find_col(df, "segment_id")
    variable_col = _find_col(df, "variable")
    value_col = _find_col(df, "value")
    date_col = _find_col(df, "date") or _find_col(df, "date_time")

    if date_col:
        if _normalize_col_name(date_col) == "date_time":
            date_values = _to_datetime_series(df[date_col])
        else:
            date_values = pd.to_datetime(df[date_col], errors="coerce", dayfirst=True)
    else:
        date_values = pd.Series([pd.NaT] * len(df), index=df.index)

    if segment_col and variable_col and value_col:
        for idx in df.index:
            seg = pd.to_numeric(pd.Series([df.at[idx, segment_col]]), errors="coerce").iloc[0]
            variable = str(df.at[idx, variable_col]) if pd.notna(df.at[idx, variable_col]) else ""
            val = pd.to_numeric(pd.Series([df.at[idx, value_col]]), errors="coerce").iloc[0]
            if pd.isna(seg) or not variable or pd.isna(val):
                continue
            dt = date_values.iloc[idx] if idx in date_values.index else pd.NaT
            dt_str = dt.date().isoformat() if pd.notna(dt) else None
            records.append({"entite": int(seg), "date": dt_str, "variable": variable, "valeur": float(val)})
        return records

    # WASP wide raw: Date_Time + Segment_X-Variable columns
    segment_columns = []
    for col in df.columns:
        ncol = _normalize_col_name(str(col))
        m = WASP_SEGMENT_PATTERN.match(ncol)
        if m:
            segment_columns.append((str(col), int(m.group(1)), m.group(2).replace("_", " ")))

    for idx in df.index:
        dt = date_values.iloc[idx] if idx in date_values.index else pd.NaT
        dt_str = dt.date().isoformat() if pd.notna(dt) else None
        for raw_col, segment_id, variable in segment_columns:
            val = pd.to_numeric(pd.Series([df.at[idx, raw_col]]), errors="coerce").iloc[0]
            if pd.isna(val):
                continue
            records.append({"entite": segment_id, "date": dt_str, "variable": variable, "valeur": float(val)})
    return records


def _qa_from_records(model_type: str, records: list[dict[str, Any]]) -> dict[str, Any]:
    anomalies: list[dict[str, Any]] = []
    for rec in records:
        variable = str(rec["variable"])
        value = float(rec["valeur"])
        if model_type == "SWAT":
            threshold = SWAT_THRESHOLDS.get(variable)
            if threshold is None:
                continue
        else:
            threshold = _resolve_wasp_threshold(variable)
        if _is_critical(value, threshold):
            anomalies.append(
                {
                    "entite": rec.get("entite"),
                    "date": rec.get("date"),
                    "variable": variable,
                    "valeur": value,
                    "seuil_min": threshold.min_value,
                    "seuil_max": threshold.max_value,
                    "statut": "CRITIQUE",
                }
            )
    return {
        "total_anomalies": len(anomalies),
        "total_critiques": len(anomalies),
        "anomalies": anomalies[:5000],
    }


def _score_quality(nb_format_errors: int, nb_duplicates: int, nb_qa_critiques: int, nb_rows: int) -> float:
    if nb_rows <= 0:
        return 0.0
    penalty = 0.0
    penalty += min(40.0, nb_format_errors * 20.0)
    penalty += min(30.0, nb_duplicates * 20.0)
    penalty += min(60.0, (nb_qa_critiques / max(1, nb_rows)) * 100.0)
    return round(max(0.0, 100.0 - penalty), 2)


def simulate_ingestion_dry_run(db: Session, *, path: str, original_filename: str | None = None) -> dict[str, Any]:
    structural = validate_structural_file(path=path, original_filename=original_filename)
    mapping = build_mapping_report(path=path, original_filename=original_filename)
    duplicate = detect_duplicate_before_ingestion(
        db=db,
        path=path,
        original_filename=original_filename,
        persist_signature=False,
    )
    source = load_structural_source(path)

    model_detected = str(structural.get("modele_detecte", "INCONNU")).upper()
    model_type = "SWAT" if "SWAT" in model_detected else "WASP" if "WASP" in model_detected else "INCONNU"
    if model_type == "SWAT":
        records = _swat_records(source.df)
    elif model_type == "WASP":
        records = _wasp_records(source.df)
    else:
        records = []

    qa = _qa_from_records(model_type=model_type, records=records)

    nb_lignes_traitees = int(structural.get("total_lignes", len(source.df)))
    nb_erreurs_format = int(len(structural.get("colonnes_manquantes", [])))
    if structural.get("statut_format") == "INVALIDE" and nb_erreurs_format == 0:
        nb_erreurs_format = 1
    nb_doublons = 0 if duplicate.get("statut") == "NOUVEAU" else 1
    nb_critiques_qa = int(qa["total_critiques"])
    score = _score_quality(
        nb_format_errors=nb_erreurs_format,
        nb_duplicates=nb_doublons,
        nb_qa_critiques=nb_critiques_qa,
        nb_rows=max(1, len(records)),
    )

    if structural.get("statut_format") == "INVALIDE" or duplicate.get("statut") == "DOUBLON_EXACT":
        recommandation = "REJETER"
    elif nb_critiques_qa > 0 or duplicate.get("statut") == "DOUBLON_PARTIEL" or (mapping.get("score_pret_migration_pct", 0) < 100):
        recommandation = "CORRIGER_ET_RETESTER"
    else:
        recommandation = "PUBLIER"

    return {
        "mode_simulation": True,
        "fichier": original_filename,
        "etape_1_analyse_format": structural,
        "etape_2_mapping": mapping,
        "etape_3_detection_doublons": duplicate,
        "etape_4_validation_qa": {
            "modele": model_type,
            "total_points_analyses": len(records),
            "total_critiques": qa["total_critiques"],
            "anomalies": qa["anomalies"],
        },
        "etape_5_bilan_dry_run": {
            "nb_lignes_traitees": nb_lignes_traitees,
            "nb_erreurs_format": nb_erreurs_format,
            "nb_doublons": nb_doublons,
            "nb_critiques_qa": nb_critiques_qa,
            "score_qualite_pct": score,
            "recommandation": recommandation,
        },
    }

