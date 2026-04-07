from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import Request
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.security.jwt_service import decode_token


VALID_ACTIONS = {"IMPORT", "VALIDATION", "VIDER_CACHE", "PUBLICATION", "REJET"}


@dataclass
class AuditFileInfo:
    nom: str | None = None
    type: str | None = None
    taille: int | None = None
    hash_md5: str | None = None


@dataclass
class AuditResultInfo:
    statut: str
    nb_erreurs: int = 0
    nb_lignes: int = 0
    duree_ms: int = 0


def ensure_audit_table(db: Session) -> None:
    db.execute(text("CREATE SCHEMA IF NOT EXISTS audit"))
    db.execute(
        text(
            """
            CREATE TABLE IF NOT EXISTS audit.ingestion_audit_logs (
                id BIGSERIAL PRIMARY KEY,
                action VARCHAR(32) NOT NULL,
                utilisateur VARCHAR(255),
                horodatage TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                fichier_nom TEXT,
                fichier_type VARCHAR(32),
                fichier_taille BIGINT,
                fichier_hash_md5 VARCHAR(32),
                scenario_id INTEGER,
                resultat_statut VARCHAR(64) NOT NULL,
                resultat_nb_erreurs INTEGER NOT NULL DEFAULT 0,
                resultat_nb_lignes INTEGER NOT NULL DEFAULT 0,
                resultat_duree_ms INTEGER NOT NULL DEFAULT 0,
                message_lisible TEXT NOT NULL,
                metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
                duplicate_count INTEGER NOT NULL DEFAULT 1,
                last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
            """
        )
    )
    db.execute(text("ALTER TABLE audit.ingestion_audit_logs ADD COLUMN IF NOT EXISTS duplicate_count INTEGER NOT NULL DEFAULT 1"))
    db.execute(text("ALTER TABLE audit.ingestion_audit_logs ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()"))
    db.execute(
        text(
            """
            CREATE INDEX IF NOT EXISTS idx_ingestion_audit_logs_horodatage
            ON audit.ingestion_audit_logs (horodatage DESC)
            """
        )
    )
    db.commit()


def _extract_active_user_identifier(request: Request | None) -> str:
    if request is None:
        return "system"
    auth = request.headers.get("Authorization", "")
    if auth.lower().startswith("bearer "):
        token = auth.split(" ", 1)[1].strip()
        payload = decode_token(token)
        if payload and payload.get("sub"):
            return str(payload.get("sub"))
    return "anonymous"


def compute_file_md5(file_path: str | Path) -> str:
    path = Path(file_path)
    digest = hashlib.md5()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            digest.update(chunk)
    return digest.hexdigest()


def build_file_info_from_path(file_path: str | Path, file_type: str | None = None) -> AuditFileInfo:
    path = Path(file_path)
    if not path.exists():
        return AuditFileInfo(nom=path.name, type=file_type, taille=None, hash_md5=None)
    return AuditFileInfo(
        nom=path.name,
        type=file_type,
        taille=path.stat().st_size,
        hash_md5=compute_file_md5(path),
    )


def log_ingestion_action(
    db: Session,
    action: str,
    request: Request | None,
    scenario_id: int | None,
    result: AuditResultInfo,
    message_lisible: str,
    file_info: AuditFileInfo | None = None,
    metadata: dict[str, Any] | None = None,
    user_identifier: str | None = None,
    dedup_window_seconds: int = 60,
) -> None:
    if action not in VALID_ACTIONS:
        raise ValueError(f"Unsupported action: {action}")
    ensure_audit_table(db)
    user_identifier = user_identifier or _extract_active_user_identifier(request)
    now_iso = datetime.now(timezone.utc).isoformat()

    fi = file_info or AuditFileInfo()
    dedup_row = db.execute(
        text(
            """
            SELECT id
            FROM audit.ingestion_audit_logs
            WHERE action = :action
              AND COALESCE(utilisateur, '') = COALESCE(:utilisateur, '')
              AND COALESCE(fichier_nom, '') = COALESCE(:fichier_nom, '')
              AND COALESCE(fichier_hash_md5, '') = COALESCE(:fichier_hash_md5, '')
              AND COALESCE(scenario_id, -1) = COALESCE(:scenario_id, -1)
              AND resultat_statut = :resultat_statut
              AND resultat_nb_erreurs = :resultat_nb_erreurs
              AND resultat_nb_lignes = :resultat_nb_lignes
              AND horodatage >= (NOW() - (:dedup_seconds * INTERVAL '1 second'))
            ORDER BY horodatage DESC
            LIMIT 1
            """
        ),
        {
            "action": action,
            "utilisateur": user_identifier,
            "fichier_nom": fi.nom,
            "fichier_hash_md5": fi.hash_md5,
            "scenario_id": scenario_id,
            "resultat_statut": result.statut,
            "resultat_nb_erreurs": result.nb_erreurs,
            "resultat_nb_lignes": result.nb_lignes,
            "dedup_seconds": max(10, min(dedup_window_seconds, 600)),
        },
    ).mappings().first()

    if dedup_row:
        db.execute(
            text(
                """
                UPDATE audit.ingestion_audit_logs
                SET duplicate_count = duplicate_count + 1,
                    last_seen_at = NOW(),
                    resultat_duree_ms = :resultat_duree_ms,
                    message_lisible = :message_lisible
                WHERE id = :id
                """
            ),
            {
                "id": dedup_row["id"],
                "resultat_duree_ms": result.duree_ms,
                "message_lisible": message_lisible,
            },
        )
        db.commit()
        return

    db.execute(
        text(
            """
            INSERT INTO audit.ingestion_audit_logs (
                action, utilisateur, horodatage, fichier_nom, fichier_type, fichier_taille, fichier_hash_md5,
                scenario_id, resultat_statut, resultat_nb_erreurs, resultat_nb_lignes, resultat_duree_ms,
                message_lisible, metadata, duplicate_count, last_seen_at
            )
            VALUES (
                :action, :utilisateur, :horodatage, :fichier_nom, :fichier_type, :fichier_taille, :fichier_hash_md5,
                :scenario_id, :resultat_statut, :resultat_nb_erreurs, :resultat_nb_lignes, :resultat_duree_ms,
                :message_lisible, CAST(:metadata AS JSONB), 1, NOW()
            )
            """
        ),
        {
            "action": action,
            "utilisateur": user_identifier,
            "horodatage": now_iso,
            "fichier_nom": fi.nom,
            "fichier_type": fi.type,
            "fichier_taille": fi.taille,
            "fichier_hash_md5": fi.hash_md5,
            "scenario_id": scenario_id,
            "resultat_statut": result.statut,
            "resultat_nb_erreurs": result.nb_erreurs,
            "resultat_nb_lignes": result.nb_lignes,
            "resultat_duree_ms": result.duree_ms,
            "message_lisible": message_lisible,
            "metadata": json.dumps(metadata or {}, ensure_ascii=False),
        },
    )
    db.commit()


def list_ingestion_audit_logs(db: Session, limit: int = 200) -> list[dict[str, Any]]:
    ensure_audit_table(db)
    rows = db.execute(
        text(
            """
            SELECT
              id,
              action,
              utilisateur,
              horodatage,
              fichier_nom,
              fichier_type,
              fichier_taille,
              fichier_hash_md5,
              scenario_id,
              resultat_statut,
              resultat_nb_erreurs,
              resultat_nb_lignes,
              resultat_duree_ms,
              message_lisible,
              duplicate_count
            FROM audit.ingestion_audit_logs
            ORDER BY horodatage DESC
            LIMIT :lim
            """
        ),
        {"lim": max(1, min(limit, 1000))},
    ).mappings().all()

    out: list[dict[str, Any]] = []
    for r in rows:
        out.append(
            {
                "id": r["id"],
                "action": r["action"],
                "utilisateur": r["utilisateur"],
                "horodatage": r["horodatage"].isoformat() if r["horodatage"] is not None else None,
                "fichier": {
                    "nom": r["fichier_nom"],
                    "type": r["fichier_type"],
                    "taille": r["fichier_taille"],
                    "hash_md5": r["fichier_hash_md5"],
                },
                "scenario_id": r["scenario_id"],
                "resultat": {
                    "statut": r["resultat_statut"],
                    "nb_erreurs": r["resultat_nb_erreurs"],
                    "nb_lignes": r["resultat_nb_lignes"],
                    "duree_ms": r["resultat_duree_ms"],
                },
                "message_lisible": r["message_lisible"],
                "duplicate_count": r.get("duplicate_count", 1),
            }
        )
    return out
