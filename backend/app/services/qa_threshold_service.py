from __future__ import annotations

from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session


def ensure_thresholds_table(db: Session) -> None:
    db.execute(text("CREATE SCHEMA IF NOT EXISTS qa"))
    db.execute(
        text(
            """
            CREATE TABLE IF NOT EXISTS qa.variable_thresholds (
                id BIGSERIAL PRIMARY KEY,
                model VARCHAR(16) NOT NULL,
                variable_name VARCHAR(255) NOT NULL,
                scenario_id INTEGER NULL,
                min_value DOUBLE PRECISION NULL,
                max_value DOUBLE PRECISION NULL,
                warn_z_info DOUBLE PRECISION NOT NULL DEFAULT 2.0,
                warn_z_avertissement DOUBLE PRECISION NOT NULL DEFAULT 3.0,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
            """
        )
    )
    db.execute(
        text(
            """
            CREATE UNIQUE INDEX IF NOT EXISTS uq_variable_thresholds_model_var_scenario
            ON qa.variable_thresholds (model, variable_name, COALESCE(scenario_id, -1))
            """
        )
    )
    db.commit()


def upsert_threshold(
    db: Session,
    *,
    model: str,
    variable_name: str,
    scenario_id: int | None,
    min_value: float | None,
    max_value: float | None,
    warn_z_info: float,
    warn_z_avertissement: float,
    is_active: bool,
) -> None:
    ensure_thresholds_table(db)
    db.execute(
        text(
            """
            INSERT INTO qa.variable_thresholds (
                model, variable_name, scenario_id, min_value, max_value,
                warn_z_info, warn_z_avertissement, is_active
            )
            VALUES (
                :model, :variable_name, :scenario_id, :min_value, :max_value,
                :warn_z_info, :warn_z_avertissement, :is_active
            )
            ON CONFLICT (model, variable_name, COALESCE(scenario_id, -1))
            DO UPDATE SET
                min_value = EXCLUDED.min_value,
                max_value = EXCLUDED.max_value,
                warn_z_info = EXCLUDED.warn_z_info,
                warn_z_avertissement = EXCLUDED.warn_z_avertissement,
                is_active = EXCLUDED.is_active,
                updated_at = NOW()
            """
        ),
        {
            "model": model.lower().strip(),
            "variable_name": variable_name.strip(),
            "scenario_id": scenario_id,
            "min_value": min_value,
            "max_value": max_value,
            "warn_z_info": warn_z_info,
            "warn_z_avertissement": warn_z_avertissement,
            "is_active": is_active,
        },
    )
    db.commit()


def list_thresholds(
    db: Session,
    *,
    model: str | None = None,
    scenario_id: int | None = None,
    limit: int = 500,
) -> list[dict[str, Any]]:
    ensure_thresholds_table(db)
    sql = """
        SELECT id, model, variable_name, scenario_id, min_value, max_value,
               warn_z_info, warn_z_avertissement, is_active, created_at, updated_at
        FROM qa.variable_thresholds
        WHERE 1=1
    """
    params: dict[str, Any] = {"lim": max(1, min(limit, 2000))}
    if model:
        sql += " AND model = :model"
        params["model"] = model.lower().strip()
    if scenario_id is None:
        sql += " AND scenario_id IS NULL"
    else:
        sql += " AND scenario_id = :scenario_id"
        params["scenario_id"] = scenario_id
    sql += " ORDER BY model, variable_name LIMIT :lim"
    rows = db.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows]
