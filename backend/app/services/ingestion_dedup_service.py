from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

import pandas as pd
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.ingestion_audit_service import compute_file_md5
from app.services.ingestion_structural_validation import (
    _normalize_col_name,
    load_structural_source,
    validate_structural_file,
)


WASP_SEGMENT_PATTERN = re.compile(r"^segment_(\d+)_(.+)$")


@dataclass(frozen=True)
class DuplicateResult:
    statut: str
    action_requise: str
    scenario_existant_id: int | None
    date_ingestion_originale: str | None
    zones_chevauchement: list[dict[str, Any]]
    autorisation: str | None


def _ensure_signature_table(db: Session) -> None:
    db.execute(text("CREATE SCHEMA IF NOT EXISTS audit"))
    db.execute(
        text(
            """
            CREATE TABLE IF NOT EXISTS audit.ingestion_dataset_signatures (
                id BIGSERIAL PRIMARY KEY,
                signature_key TEXT NOT NULL,
                file_md5 VARCHAR(32) NOT NULL,
                model_type VARCHAR(32) NOT NULL,
                start_date DATE,
                end_date DATE,
                entity_hash VARCHAR(32) NOT NULL,
                entity_count INTEGER NOT NULL,
                entities_json JSONB NOT NULL,
                scenario_id INTEGER,
                file_name TEXT,
                first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                hit_count INTEGER NOT NULL DEFAULT 1
            )
            """
        )
    )
    db.execute(
        text(
            """
            CREATE INDEX IF NOT EXISTS idx_ingestion_dataset_signatures_signature_key
            ON audit.ingestion_dataset_signatures (signature_key)
            """
        )
    )
    db.execute(
        text(
            """
            CREATE INDEX IF NOT EXISTS idx_ingestion_dataset_signatures_model_dates
            ON audit.ingestion_dataset_signatures (model_type, start_date, end_date)
            """
        )
    )
    db.commit()


def _to_iso(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, pd.Timestamp):
        if pd.isna(value):
            return None
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    try:
        parsed = pd.to_datetime(value, errors="coerce", dayfirst=True)
        if pd.isna(parsed):
            return None
        return parsed.date().isoformat()
    except Exception:
        return None


def _excel_or_text_to_datetime(series: pd.Series) -> pd.Series:
    numeric = pd.to_numeric(series, errors="coerce")
    from_numeric = pd.to_datetime(numeric, unit="D", origin="1899-12-30", errors="coerce")
    from_text = pd.to_datetime(series, errors="coerce", dayfirst=True)
    return from_numeric.where(from_numeric.notna(), from_text)


def _hash_entities(entities: list[int]) -> str:
    joined = ",".join(str(v) for v in sorted(set(entities)))
    return hashlib.md5(joined.encode("utf-8")).hexdigest()


def _extract_swat_dates_entities(df: pd.DataFrame) -> tuple[str | None, str | None, list[int]]:
    normalized = {_normalize_col_name(str(c)): str(c) for c in df.columns}
    entities: list[int] = []
    date_series: pd.Series | None = None

    if "subbasin" in normalized:
        entities = pd.to_numeric(df[normalized["subbasin"]], errors="coerce").dropna().astype(int).tolist()
    elif "sub" in normalized:
        entities = pd.to_numeric(df[normalized["sub"]], errors="coerce").dropna().astype(int).tolist()
    elif "reach" in normalized:
        entities = pd.to_numeric(df[normalized["reach"]], errors="coerce").dropna().astype(int).tolist()

    if "date" in normalized:
        date_series = pd.to_datetime(df[normalized["date"]], errors="coerce", dayfirst=True)
    elif "yyyyddd" in normalized:
        yday = pd.to_numeric(df[normalized["yyyyddd"]], errors="coerce").dropna().astype(int).astype(str)
        date_series = pd.to_datetime(yday, format="%Y%j", errors="coerce")
    elif "year" in normalized and "mon" in normalized:
        year = pd.to_numeric(df[normalized["year"]], errors="coerce")
        mon = pd.to_numeric(df[normalized["mon"]], errors="coerce")
        tmp = pd.DataFrame({"year": year, "month": mon, "day": 1})
        date_series = pd.to_datetime(tmp, errors="coerce")

    start_date = _to_iso(date_series.min()) if date_series is not None else None
    end_date = _to_iso(date_series.max()) if date_series is not None else None
    return start_date, end_date, sorted(set(entities))


def _extract_wasp_dates_entities(df: pd.DataFrame) -> tuple[str | None, str | None, list[int]]:
    normalized = {_normalize_col_name(str(c)): str(c) for c in df.columns}
    entities: list[int] = []
    date_series: pd.Series | None = None

    if "segment_id" in normalized:
        entities = pd.to_numeric(df[normalized["segment_id"]], errors="coerce").dropna().astype(int).tolist()
    else:
        for ncol in normalized.keys():
            m = WASP_SEGMENT_PATTERN.match(ncol)
            if m:
                entities.append(int(m.group(1)))

    if "date" in normalized:
        date_series = pd.to_datetime(df[normalized["date"]], errors="coerce", dayfirst=True)
    elif "date_time" in normalized:
        date_series = _excel_or_text_to_datetime(df[normalized["date_time"]])

    start_date = _to_iso(date_series.min()) if date_series is not None else None
    end_date = _to_iso(date_series.max()) if date_series is not None else None
    return start_date, end_date, sorted(set(entities))


def _extract_dataset_profile(path: str, original_filename: str | None = None) -> dict[str, Any]:
    structural = validate_structural_file(path=path, original_filename=original_filename)
    source = load_structural_source(path)
    model_detected = str(structural.get("modele_detecte", "INCONNU")).upper()
    model_type = "SWAT" if "SWAT" in model_detected else "WASP" if "WASP" in model_detected else "INCONNU"

    if model_type == "SWAT":
        start_date, end_date, entities = _extract_swat_dates_entities(source.df)
    elif model_type == "WASP":
        start_date, end_date, entities = _extract_wasp_dates_entities(source.df)
    else:
        start_date, end_date, entities = None, None, []

    file_md5 = compute_file_md5(Path(path))
    entity_hash = _hash_entities(entities)
    signature_raw = "|".join([file_md5, model_type, start_date or "", end_date or "", entity_hash])
    signature_key = hashlib.md5(signature_raw.encode("utf-8")).hexdigest()

    return {
        "modele_detecte": model_detected,
        "type_modele": model_type,
        "file_md5": file_md5,
        "plage_dates": {"debut": start_date, "fin": end_date},
        "liste_entites": entities,
        "entity_hash": entity_hash,
        "signature_key": signature_key,
    }


def _load_existing_scenario_profiles(db: Session, model_type: str) -> list[dict[str, Any]]:
    if model_type == "SWAT":
        rows = db.execute(
            text(
                """
                SELECT
                  s.id AS scenario_id,
                  MIN(r.date) AS start_date,
                  MAX(r.date) AS end_date,
                  ARRAY_AGG(DISTINCT r.subbasin ORDER BY r.subbasin) AS entities
                FROM swat_sebou.swat_scenarios s
                JOIN swat_sebou.swat_subbasin_results r ON r.scenario_id = s.id
                GROUP BY s.id
                """
            )
        ).mappings().all()
    elif model_type == "WASP":
        rows = db.execute(
            text(
                """
                SELECT
                  s.id AS scenario_id,
                  MIN(r.date) AS start_date,
                  MAX(r.date) AS end_date,
                  ARRAY_AGG(DISTINCT r.segment_id ORDER BY r.segment_id) AS entities
                FROM wasp_sebou.wasp_scenarios s
                JOIN wasp_sebou.wasp_results r ON r.scenario_id = s.id
                GROUP BY s.id
                """
            )
        ).mappings().all()
    else:
        rows = []

    out: list[dict[str, Any]] = []
    for row in rows:
        entities = [int(v) for v in (row.get("entities") or []) if v is not None]
        out.append(
            {
                "scenario_id": int(row["scenario_id"]),
                "start_date": _to_iso(row.get("start_date")),
                "end_date": _to_iso(row.get("end_date")),
                "entities": sorted(set(entities)),
                "entity_hash": _hash_entities(entities),
            }
        )
    return out


def _has_date_overlap(a_start: str | None, a_end: str | None, b_start: str | None, b_end: str | None) -> bool:
    if not a_start or not a_end or not b_start or not b_end:
        return False
    return not (a_end < b_start or b_end < a_start)


def _save_or_touch_signature(
    db: Session,
    *,
    profile: dict[str, Any],
    file_name: str,
    scenario_id: int | None = None,
) -> None:
    _ensure_signature_table(db)
    existing = db.execute(
        text(
            """
            SELECT id
            FROM audit.ingestion_dataset_signatures
            WHERE signature_key = :signature_key
              AND model_type = :model_type
            ORDER BY first_seen_at ASC
            LIMIT 1
            """
        ),
        {"signature_key": profile["signature_key"], "model_type": profile["type_modele"]},
    ).mappings().first()

    payload = {
        "signature_key": profile["signature_key"],
        "file_md5": profile["file_md5"],
        "model_type": profile["type_modele"],
        "start_date": profile["plage_dates"]["debut"],
        "end_date": profile["plage_dates"]["fin"],
        "entity_hash": profile["entity_hash"],
        "entity_count": len(profile["liste_entites"]),
        "entities_json": json.dumps(profile["liste_entites"]),
        "scenario_id": scenario_id,
        "file_name": file_name,
    }

    if existing:
        db.execute(
            text(
                """
                UPDATE audit.ingestion_dataset_signatures
                SET hit_count = hit_count + 1,
                    last_seen_at = NOW(),
                    scenario_id = COALESCE(:scenario_id, scenario_id),
                    file_name = COALESCE(:file_name, file_name)
                WHERE id = :id
                """
            ),
            {"id": int(existing["id"]), "scenario_id": scenario_id, "file_name": file_name},
        )
    else:
        db.execute(
            text(
                """
                INSERT INTO audit.ingestion_dataset_signatures (
                    signature_key, file_md5, model_type, start_date, end_date, entity_hash,
                    entity_count, entities_json, scenario_id, file_name
                ) VALUES (
                    :signature_key, :file_md5, :model_type, :start_date, :end_date, :entity_hash,
                    :entity_count, CAST(:entities_json AS JSONB), :scenario_id, :file_name
                )
                """
            ),
            payload,
        )
    db.commit()


def detect_duplicate_before_ingestion(
    db: Session,
    *,
    path: str,
    original_filename: str | None = None,
    persist_signature: bool = True,
) -> dict[str, Any]:
    profile = _extract_dataset_profile(path=path, original_filename=original_filename)
    model_type = profile["type_modele"]
    exact_row = None
    if persist_signature:
        _ensure_signature_table(db)
    try:
        exact_row = db.execute(
            text(
                """
                SELECT scenario_id, first_seen_at
                FROM audit.ingestion_dataset_signatures
                WHERE signature_key = :signature_key
                  AND model_type = :model_type
                ORDER BY first_seen_at ASC
                LIMIT 1
                """
            ),
            {"signature_key": profile["signature_key"], "model_type": model_type},
        ).mappings().first()
    except Exception:
        # Registry table may not exist in dry-run mode, ignore gracefully.
        exact_row = None

    scenario_profiles = _load_existing_scenario_profiles(db, model_type)
    same_shape = [
        p
        for p in scenario_profiles
        if p["start_date"] == profile["plage_dates"]["debut"]
        and p["end_date"] == profile["plage_dates"]["fin"]
        and p["entity_hash"] == profile["entity_hash"]
    ]

    partial_overlaps: list[dict[str, Any]] = []
    for existing in scenario_profiles:
        if not _has_date_overlap(
            profile["plage_dates"]["debut"],
            profile["plage_dates"]["fin"],
            existing["start_date"],
            existing["end_date"],
        ):
            continue
        overlap_entities = sorted(set(profile["liste_entites"]).intersection(set(existing["entities"])))
        if not overlap_entities:
            continue
        partial_overlaps.append(
            {
                "scenario_id": existing["scenario_id"],
                "date_debut": max(profile["plage_dates"]["debut"], existing["start_date"]),
                "date_fin": min(profile["plage_dates"]["fin"], existing["end_date"]),
                "entites_chevauchees": overlap_entities[:50],
                "nb_entites_chevauchees": len(overlap_entities),
            }
        )

    if exact_row:
        result = DuplicateResult(
            statut="DOUBLON_EXACT",
            action_requise="BLOQUER",
            scenario_existant_id=int(exact_row["scenario_id"]) if exact_row["scenario_id"] is not None else (same_shape[0]["scenario_id"] if same_shape else None),
            date_ingestion_originale=_to_iso(exact_row["first_seen_at"]),
            zones_chevauchement=[],
            autorisation=None,
        )
    elif same_shape or partial_overlaps:
        overlap = partial_overlaps
        if not overlap and same_shape:
            overlap = [
                {
                    "scenario_id": same_shape[0]["scenario_id"],
                    "date_debut": profile["plage_dates"]["debut"],
                    "date_fin": profile["plage_dates"]["fin"],
                    "entites_chevauchees": profile["liste_entites"][:50],
                    "nb_entites_chevauchees": len(profile["liste_entites"]),
                }
            ]
        result = DuplicateResult(
            statut="DOUBLON_PARTIEL",
            action_requise="AVERTIR",
            scenario_existant_id=same_shape[0]["scenario_id"] if same_shape else overlap[0]["scenario_id"],
            date_ingestion_originale=None,
            zones_chevauchement=overlap,
            autorisation=None,
        )
    else:
        result = DuplicateResult(
            statut="NOUVEAU",
            action_requise="PROCEDER",
            scenario_existant_id=None,
            date_ingestion_originale=None,
            zones_chevauchement=[],
            autorisation="PROCEDER",
        )

    if persist_signature:
        _save_or_touch_signature(db, profile=profile, file_name=original_filename or Path(path).name)

    return {
        "statut": result.statut,
        "scenario_existant_id": result.scenario_existant_id,
        "date_ingestion_originale": result.date_ingestion_originale,
        "action_requise": result.action_requise,
        "zones_chevauchement": result.zones_chevauchement,
        "autorisation": result.autorisation,
        "signature": {
            "file_md5": profile["file_md5"],
            "type_modele": profile["type_modele"],
            "plage_dates": profile["plage_dates"],
            "liste_entites": profile["liste_entites"][:100],
            "nb_entites": len(profile["liste_entites"]),
            "signature_key": profile["signature_key"],
        },
    }
