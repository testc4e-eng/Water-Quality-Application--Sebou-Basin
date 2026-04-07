from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pandas as pd


SWAT_OUTPUT_REQUIRED_COLUMNS = [
    "subbasin",
    "date",
    "precip",
    "surq",
    "gw_q",
    "wyld",
    "sedp",
    "orgn",
    "solp",
]

WASP_TOXI_REQUIRED_COLUMNS = [
    "segment_id",
    "date",
    "variable",
    "value",
]

# Native SWAT Access output tables (raw)
SWAT_SUB_RAW_REQUIRED_COLUMNS = [
    "sub",
    "year",
    "mon",
    "surqmm",
    "gw_qmm",
    "wyldmm",
    "orgnkg_ha",
    "solpkg_ha",
]

SWAT_RCH_RAW_REQUIRED_COLUMNS = [
    "sub",
    "year",
    "mon",
    "flow_incms",
    "flow_outcms",
    "sed_intons",
    "sed_outtons",
]

WASP_WIDE_BASE_REQUIRED_COLUMNS = [
    "date_time",
]

CSV_ENCODINGS_TO_TRY = ["utf-8-sig", "utf-8", "utf-16", "cp1252", "latin1"]


@dataclass
class StructuralSource:
    columns: list[str]
    df: pd.DataFrame
    encoding: str
    source_name: str | None = None
    format_hint: str | None = None


def _normalize_col_name(value: str) -> str:
    return (
        value.strip()
        .lower()
        .replace(" ", "_")
        .replace("-", "_")
        .replace(".", "_")
    )


def _required_for_model(model_type: str) -> list[str]:
    if model_type == "SWAT OUTPUT":
        return SWAT_OUTPUT_REQUIRED_COLUMNS
    return WASP_TOXI_REQUIRED_COLUMNS


def _guess_model_type(filename: str, columns: list[str]) -> str:
    ncols = [_normalize_col_name(c) for c in columns]
    cols_set = set(ncols)
    swat_score = len(cols_set.intersection(SWAT_OUTPUT_REQUIRED_COLUMNS))
    wasp_score = len(cols_set.intersection(WASP_TOXI_REQUIRED_COLUMNS))

    lname = filename.lower()
    if "swat" in lname:
        swat_score += 1
    if "wasp" in lname or "toxi" in lname:
        wasp_score += 1

    return "SWAT OUTPUT" if swat_score >= wasp_score else "WASP TOXI"


def _try_read_csv(path: Path) -> StructuralSource:
    last_exc: Exception | None = None
    for encoding in CSV_ENCODINGS_TO_TRY:
        try:
            df = pd.read_csv(path, encoding=encoding)
            return StructuralSource(columns=[str(c) for c in df.columns], df=df, encoding=encoding)
        except Exception as exc:  # pragma: no cover - depends on external files
            last_exc = exc
    raise ValueError(f"Impossible de lire le CSV avec les encodages testes: {last_exc}")


def _try_read_excel(path: Path) -> StructuralSource:
    try:
        df = pd.read_excel(path)
    except ImportError as exc:  # pragma: no cover - env dependency
        raise ValueError(
            "Lecture Excel indisponible: installez la dependance openpyxl pour lire les fichiers .xlsx."
        ) from exc
    except Exception as exc:
        raise ValueError(f"Lecture Excel impossible: {exc}") from exc
    return StructuralSource(columns=[str(c) for c in df.columns], df=df, encoding="binary-excel")


def _try_read_mdb(path: Path) -> StructuralSource:
    try:
        import pyodbc  # type: ignore
    except Exception as exc:  # pragma: no cover - optional dependency
        raise ValueError(
            "Lecture MDB indisponible: installez le driver Access ODBC et la librairie pyodbc."
        ) from exc

    conn_str = (
        r"DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};"
        rf"DBQ={path};"
    )

    try:
        cnxn = pyodbc.connect(conn_str, timeout=10)
    except Exception as exc:  # pragma: no cover - environment dependent
        raise ValueError(f"Connexion MDB impossible: {exc}") from exc

    with cnxn:
        cursor = cnxn.cursor()
        tables = [t.table_name for t in cursor.tables(tableType="TABLE") if not str(t.table_name).startswith("MSys")]
        if not tables:
            raise ValueError("Aucune table exploitable trouvee dans le fichier MDB.")

        best_df: pd.DataFrame | None = None
        best_table: str | None = None
        best_score = -1
        best_hint: str | None = None
        for table in tables:
            try:
                tmp_df = pd.read_sql(f"SELECT * FROM [{table}]", cnxn)
            except Exception:
                continue

            normalized = {_normalize_col_name(str(c)) for c in tmp_df.columns}
            score = max(
                len(normalized.intersection(SWAT_OUTPUT_REQUIRED_COLUMNS)),
                len(normalized.intersection(WASP_TOXI_REQUIRED_COLUMNS)),
            )

            hint = None
            if set(SWAT_SUB_RAW_REQUIRED_COLUMNS).issubset(normalized):
                score += 100
                hint = "SWAT_SUB_RAW"
            elif set(SWAT_RCH_RAW_REQUIRED_COLUMNS).issubset(normalized):
                score += 90
                hint = "SWAT_RCH_RAW"

            if score > best_score:
                best_score = score
                best_df = tmp_df
                best_table = table
                best_hint = hint

        if best_df is None:
            raise ValueError("Impossible de lire une table MDB exploitable.")

        return StructuralSource(
            columns=[str(c) for c in best_df.columns],
            df=best_df,
            encoding="binary-mdb",
            source_name=best_table,
            format_hint=best_hint,
        )


def _detect_wasp_wide_format(detected_cols: list[str]) -> bool:
    cols = set(detected_cols)
    if "date_time" not in cols:
        return False
    return any(c.startswith("segment_") and c != "segment_id" for c in detected_cols)


def _required_for_source(model_type: str, source: StructuralSource, detected_cols: list[str]) -> tuple[list[str], str]:
    if source.format_hint == "SWAT_SUB_RAW":
        return SWAT_SUB_RAW_REQUIRED_COLUMNS, "SWAT OUTPUT (SUB RAW)"
    if source.format_hint == "SWAT_RCH_RAW":
        return SWAT_RCH_RAW_REQUIRED_COLUMNS, "SWAT OUTPUT (RCH RAW)"
    if model_type == "WASP TOXI" and _detect_wasp_wide_format(detected_cols):
        return WASP_WIDE_BASE_REQUIRED_COLUMNS, "WASP TOXI (WIDE RAW)"
    return _required_for_model(model_type), model_type


def _infer_column_type(series: pd.Series) -> str:
    non_null = series.dropna()
    if non_null.empty:
        return "texte"

    # Normalize blank text to null equivalent for stronger inference.
    if non_null.dtype == object:
        stripped = non_null.astype(str).str.strip()
        non_null = stripped[stripped != ""]
        if non_null.empty:
            return "texte"

    numeric = pd.to_numeric(non_null, errors="coerce")
    if numeric.notna().mean() >= 0.9:
        return "numerique"

    dates = pd.to_datetime(non_null, errors="coerce", dayfirst=True)
    if dates.notna().mean() >= 0.9:
        return "date"

    return "texte"


def _analyze_table_structure(filename: str, source: StructuralSource) -> dict[str, Any]:
    detected_cols_raw = [str(c) for c in source.columns]
    detected_cols = [_normalize_col_name(c) for c in detected_cols_raw]
    model_type = _guess_model_type(filename=filename, columns=detected_cols_raw)
    required, format_detected = _required_for_source(model_type, source, detected_cols)
    detected_set = set(detected_cols)

    missing = [col for col in required if col not in detected_set]
    wrong_order = [col for col in required if col in detected_set]
    detected_positions = [detected_cols.index(c) for c in wrong_order]
    is_wrong_order = detected_positions != sorted(detected_positions)

    suggestions = []
    for req in missing:
        req_stripped = req.replace("_", "")
        for got in detected_cols:
            if req_stripped == got.replace("_", ""):
                suggestions.append({"attendu": req, "detecte": got})
                break

    types_inferred = {
        _normalize_col_name(col): _infer_column_type(source.df[col])
        for col in source.df.columns
    }

    # Empty row: all values null/blank after trim.
    stripped_df = source.df.copy()
    for col in stripped_df.columns:
        if stripped_df[col].dtype == object:
            stripped_df[col] = stripped_df[col].astype(str).str.strip().replace("", pd.NA)
    empty_rows = int(stripped_df.isna().all(axis=1).sum())

    null_counts = {
        _normalize_col_name(col): int(stripped_df[col].isna().sum())
        for col in stripped_df.columns
    }

    status = "VALIDE"
    if missing:
        status = "INVALIDE"
    elif is_wrong_order or suggestions or any(v > 0 for v in null_counts.values()) or empty_rows > 0:
        status = "AVERTISSEMENT"

    result: dict[str, Any] = {
        "modele_detecte": model_type,
        "format_detecte": format_detected,
        "source_table": source.source_name,
        "total_lignes": int(len(source.df)),
        "colonnes_detectees": detected_cols,
        "colonnes_manquantes": missing,
        "colonnes_mal_nommees": suggestions,
        "ordre_incorrect": is_wrong_order,
        "types_inferres": types_inferred,
        "lignes_vides": empty_rows,
        "valeurs_nulles": null_counts,
        "encodage": source.encoding,
        "statut_format": status,
    }
    return result


def validate_structural_file(path: str, original_filename: str | None = None) -> dict[str, Any]:
    file_path = Path(path)
    if not file_path.exists():
        raise ValueError(f"Fichier introuvable: {path}")

    ext = file_path.suffix.lower()
    display_name = original_filename or file_path.name

    if ext == ".csv":
        source = _try_read_csv(file_path)
    elif ext in {".xlsx", ".xls"}:
        source = _try_read_excel(file_path)
    elif ext in {".mdb", ".accdb"}:
        source = _try_read_mdb(file_path)
    else:
        return {
            "modele_detecte": "INCONNU",
            "colonnes_detectees": [],
            "colonnes_manquantes": [],
            "types_inferres": {},
            "lignes_vides": 0,
            "encodage": "inconnu",
            "statut_format": "INVALIDE",
            "message": f"Extension non supportee: {ext}",
        }

    return _analyze_table_structure(filename=display_name, source=source)


def load_structural_source(path: str) -> StructuralSource:
    file_path = Path(path)
    if not file_path.exists():
        raise ValueError(f"Fichier introuvable: {path}")
    ext = file_path.suffix.lower()
    if ext == ".csv":
        return _try_read_csv(file_path)
    if ext in {".xlsx", ".xls"}:
        return _try_read_excel(file_path)
    if ext in {".mdb", ".accdb"}:
        return _try_read_mdb(file_path)
    raise ValueError(f"Extension non supportee: {ext}")

