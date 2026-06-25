from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session


ROLLBACK_TRANSITIONS: dict[str, set[str]] = {
    "PREPARE": {"NOT_PREPARED", "FAILED"},
    "REQUEST": {"READY"},
    "APPROVE": {"REQUESTED"},
    "APPLY": {"APPROVED"},
}


class RollbackService:
    def __init__(self, db: Session):
        self.db = db

    def get_rollback_status(self, change_request_id: str) -> dict[str, Any]:
        row = self._get_change_request_row(change_request_id)
        if row is None:
            raise ValueError("CHANGE_REQUEST_NOT_FOUND")
        return {"status": "OK", "data": self._serialize_request_row(row), "metadata": {}}

    def prepare_rollback(self, change_request_id: str, actor: str, comments: str | None = None) -> dict[str, Any]:
        row = self._get_change_request_row(change_request_id)
        if row is None:
            raise ValueError("CHANGE_REQUEST_NOT_FOUND")
        if row["request_status"] != "APPLIED":
            raise ValueError("ROLLBACK_REQUEST_NOT_APPLIED")
        self._assert_transition(row["rollback_status"], "PREPARE")

        reference = self._build_rollback_reference(change_request_id, row)
        available = reference is not None
        rollback_status = "READY" if available else "NOT_PREPARED"
        self.db.execute(
            text(
                """
                UPDATE data_admin.change_request
                SET rollback_available = :rollback_available,
                    rollback_status = :rollback_status,
                    rollback_reference = CAST(:rollback_reference AS jsonb),
                    comments = COALESCE(:comments, comments)
                WHERE change_request_id = CAST(:change_request_id AS uuid)
                """
            ),
            {
                "change_request_id": change_request_id,
                "rollback_available": available,
                "rollback_status": rollback_status,
                "rollback_reference": json.dumps(reference, default=str) if reference is not None else None,
                "comments": comments,
            },
        )
        self._insert_audit_log(
            change_request_id=change_request_id,
            run_id=row["run_id"],
            class_code=row["class_code"],
            action="ROLLBACK_PREPARE",
            actor=actor,
            target_schema=reference["target_schema"] if reference else None,
            target_table=reference["target_table"] if reference else None,
            target_pk=None,
            payload={"rollback_available": available, "item_count": len(reference["items"]) if reference else 0},
            metadata={"rollback_status": rollback_status, "comments": comments},
        )
        self.db.commit()
        return self.get_rollback_status(change_request_id)

    def request_rollback(self, change_request_id: str, actor: str, comments: str | None = None) -> dict[str, Any]:
        row = self._get_change_request_row(change_request_id)
        if row is None:
            raise ValueError("CHANGE_REQUEST_NOT_FOUND")
        self._assert_request_ready(row)
        self._assert_transition(row["rollback_status"], "REQUEST")
        now = datetime.now(UTC)
        self.db.execute(
            text(
                """
                UPDATE data_admin.change_request
                SET rollback_status = 'REQUESTED',
                    rollback_requested_by = :actor,
                    rollback_requested_at = :requested_at,
                    comments = COALESCE(:comments, comments)
                WHERE change_request_id = CAST(:change_request_id AS uuid)
                """
            ),
            {"change_request_id": change_request_id, "actor": actor, "requested_at": now, "comments": comments},
        )
        self._insert_audit_log(
            change_request_id=change_request_id,
            run_id=row["run_id"],
            class_code=row["class_code"],
            action="ROLLBACK_REQUEST",
            actor=actor,
            target_schema=None,
            target_table=None,
            target_pk=None,
            payload={"rollback_status": "REQUESTED"},
            metadata={"comments": comments},
        )
        self.db.commit()
        return self.get_rollback_status(change_request_id)

    def approve_rollback(self, change_request_id: str, actor: str, comments: str | None = None) -> dict[str, Any]:
        row = self._get_change_request_row(change_request_id)
        if row is None:
            raise ValueError("CHANGE_REQUEST_NOT_FOUND")
        self._assert_request_ready(row)
        self._assert_transition(row["rollback_status"], "APPROVE")
        now = datetime.now(UTC)
        self.db.execute(
            text(
                """
                UPDATE data_admin.change_request
                SET rollback_status = 'APPROVED',
                    rollback_approved_by = :actor,
                    rollback_approved_at = :approved_at,
                    comments = COALESCE(:comments, comments)
                WHERE change_request_id = CAST(:change_request_id AS uuid)
                """
            ),
            {"change_request_id": change_request_id, "actor": actor, "approved_at": now, "comments": comments},
        )
        self._insert_audit_log(
            change_request_id=change_request_id,
            run_id=row["run_id"],
            class_code=row["class_code"],
            action="ROLLBACK_APPROVE",
            actor=actor,
            target_schema=None,
            target_table=None,
            target_pk=None,
            payload={"rollback_status": "APPROVED"},
            metadata={"comments": comments},
        )
        self.db.commit()
        return self.get_rollback_status(change_request_id)

    def apply_rollback(self, change_request_id: str, actor: str, comments: str | None = None) -> dict[str, Any]:
        row = self._get_change_request_row(change_request_id)
        if row is None:
            raise ValueError("CHANGE_REQUEST_NOT_FOUND")
        if row["request_status"] != "APPLIED":
            raise ValueError("ROLLBACK_REQUEST_NOT_APPLIED")
        if row["rollback_status"] == "APPLIED":
            raise ValueError("ROLLBACK_ALREADY_APPLIED")
        if row["rollback_status"] != "APPROVED":
            raise ValueError("ROLLBACK_NOT_APPROVED")
        self._assert_request_ready(row)

        reference = dict(row["rollback_reference"] or {})
        items = list(reference.get("items") or [])
        if not items:
            raise ValueError("ROLLBACK_NOT_AVAILABLE")

        try:
            for item in items:
                target_schema = item["target_schema"]
                target_table = item["target_table"]
                target_pk = dict(item["target_pk"] or {})
                if not target_pk:
                    raise ValueError("ROLLBACK_NOT_AVAILABLE")
                target_count = self._count_target_rows(target_schema, target_table, target_pk)
                if target_count == 0:
                    raise ValueError(
                        "ROLLBACK_TARGET_NOT_FOUND: "
                        f"class={row['class_code']}; target={target_schema}.{target_table}; "
                        f"key={json.dumps(target_pk, default=str)}"
                    )
                if target_count > 1:
                    raise ValueError(
                        "ROLLBACK_TARGET_NOT_UNIQUE: "
                        f"class={row['class_code']}; target={target_schema}.{target_table}; "
                        f"key={json.dumps(target_pk, default=str)}; count={target_count}"
                    )
                self._delete_target_row(target_schema, target_table, target_pk)
                self._insert_audit_log(
                    change_request_id=change_request_id,
                    run_id=row["run_id"],
                    class_code=row["class_code"],
                    action="ROLLBACK_APPLY_ITEM",
                    actor=actor,
                    target_schema=target_schema,
                    target_table=target_table,
                    target_pk=target_pk,
                    payload={"item_id": item["item_id"], "audit_id": item["audit_id"]},
                    metadata={"mode": "ROLLBACK_INSERT_ONLY"},
                )

            now = datetime.now(UTC)
            self.db.execute(
                text(
                    """
                    UPDATE data_admin.change_request
                    SET rollback_status = 'APPLIED',
                        rollback_applied_by = :actor,
                        rollback_applied_at = :applied_at,
                        comments = COALESCE(:comments, comments)
                    WHERE change_request_id = CAST(:change_request_id AS uuid)
                    """
                ),
                {
                    "change_request_id": change_request_id,
                    "actor": actor,
                    "applied_at": now,
                    "comments": comments,
                },
            )
            self._insert_audit_log(
                change_request_id=change_request_id,
                run_id=row["run_id"],
                class_code=row["class_code"],
                action="ROLLBACK_APPLY",
                actor=actor,
                target_schema=reference.get("target_schema"),
                target_table=reference.get("target_table"),
                target_pk=None,
                payload={"item_count": len(items)},
                metadata={"mode": "ROLLBACK_INSERT_ONLY", "comments": comments},
            )
            self.db.commit()
        except Exception as exc:  # noqa: BLE001
            self.db.rollback()
            self.db.execute(
                text(
                    """
                    UPDATE data_admin.change_request
                    SET rollback_status = 'FAILED',
                        comments = COALESCE(:comments, comments)
                    WHERE change_request_id = CAST(:change_request_id AS uuid)
                    """
                ),
                {"change_request_id": change_request_id, "comments": comments},
            )
            self._insert_audit_log(
                change_request_id=change_request_id,
                run_id=row["run_id"],
                class_code=row["class_code"],
                action="ROLLBACK_FAILED",
                actor=actor,
                target_schema=reference.get("target_schema"),
                target_table=reference.get("target_table"),
                target_pk=None,
                payload={"error": str(exc)},
                metadata={"mode": "ROLLBACK_INSERT_ONLY"},
            )
            self.db.commit()
            if isinstance(exc, ValueError):
                raise
            raise ValueError("ROLLBACK_TRANSACTION_FAILED") from exc

        return self.get_rollback_status(change_request_id)

    def _build_rollback_reference(self, change_request_id: str, row: dict[str, Any]) -> dict[str, Any] | None:
        item_rows = self.db.execute(
            text(
                """
                SELECT item_id::text, target_schema, target_table, target_pk, applied_at, item_status
                FROM data_admin.change_request_item
                WHERE change_request_id = CAST(:change_request_id AS uuid)
                ORDER BY item_id
                """
            ),
            {"change_request_id": change_request_id},
        ).mappings().all()
        if not item_rows:
            return None

        items: list[dict[str, Any]] = []
        target_schema: str | None = None
        target_table: str | None = None
        for item_row in item_rows:
            if item_row["item_status"] != "APPLIED":
                return None
            item_target_pk = dict(item_row["target_pk"] or {})
            if not item_row["target_schema"] or not item_row["target_table"] or not item_target_pk:
                return None
            audit_row = self.db.execute(
                text(
                    """
                    SELECT audit_id::text
                    FROM data_admin.promotion_audit_log
                    WHERE change_request_id = CAST(:change_request_id AS uuid)
                      AND action = 'APPLY_ITEM'
                      AND target_schema = :target_schema
                      AND target_table = :target_table
                      AND target_pk = CAST(:target_pk AS jsonb)
                    ORDER BY created_at DESC, audit_id DESC
                    LIMIT 1
                    """
                ),
                {
                    "change_request_id": change_request_id,
                    "target_schema": item_row["target_schema"],
                    "target_table": item_row["target_table"],
                    "target_pk": json.dumps(item_target_pk, default=str),
                },
            ).scalar()
            if not audit_row:
                return None
            target_schema = item_row["target_schema"]
            target_table = item_row["target_table"]
            items.append(
                {
                    "item_id": item_row["item_id"],
                    "target_schema": item_row["target_schema"],
                    "target_table": item_row["target_table"],
                    "target_pk": item_target_pk,
                    "applied_at": item_row["applied_at"].isoformat() if item_row["applied_at"] else None,
                    "audit_id": audit_row,
                }
            )

        return {
            "mode": "ROLLBACK_INSERT_ONLY",
            "class_code": row["class_code"],
            "target_schema": target_schema,
            "target_table": target_table,
            "items": items,
        }

    @staticmethod
    def _assert_transition(current_status: str, action: str) -> None:
        if current_status == "APPLIED":
            raise ValueError("ROLLBACK_ALREADY_APPLIED")
        if current_status not in ROLLBACK_TRANSITIONS[action]:
            raise ValueError(
                f"INVALID_ROLLBACK_TRANSITION: action={action}; current_status={current_status}"
            )

    @staticmethod
    def _build_conditions(target_pk: dict[str, Any]) -> tuple[str, dict[str, Any]]:
        conditions: list[str] = []
        params: dict[str, Any] = {}
        for index, (column, value) in enumerate(target_pk.items()):
            param_name = f"p_{index}"
            conditions.append(f"{column} = :{param_name}")
            params[param_name] = value
        return " AND ".join(conditions), params

    def _count_target_rows(self, schema: str, table: str, target_pk: dict[str, Any]) -> int:
        conditions, params = self._build_conditions(target_pk)
        return int(
            self.db.execute(
                text(
                    f"""
                    SELECT COUNT(*)
                    FROM {schema}.{table}
                    WHERE {conditions}
                    """
                ),
                params,
            ).scalar_one()
        )

    def _delete_target_row(self, schema: str, table: str, target_pk: dict[str, Any]) -> None:
        conditions, params = self._build_conditions(target_pk)
        self.db.execute(
            text(
                f"""
                DELETE FROM {schema}.{table}
                WHERE {conditions}
                """
            ),
            params,
        )

    @staticmethod
    def _assert_request_ready(row: dict[str, Any]) -> None:
        if row["request_status"] != "APPLIED":
            raise ValueError("ROLLBACK_REQUEST_NOT_APPLIED")
        if row["promotion_mode"] != "INSERT_ONLY":
            raise ValueError("ROLLBACK_NOT_AVAILABLE")
        if not row["rollback_available"] or not row["rollback_reference"]:
            raise ValueError("ROLLBACK_NOT_AVAILABLE")

    def _get_change_request_row(self, change_request_id: str):
        return self.db.execute(
            text(
                """
                SELECT change_request_id::text, run_id::text, class_code, request_status, promotion_mode,
                       requested_by, requested_at, reviewed_by, reviewed_at, approved_by, approved_at,
                       rejected_by, rejected_at, applied_by, applied_at,
                       rollback_available, rollback_status, rollback_reference,
                       rollback_requested_by, rollback_requested_at,
                       rollback_approved_by, rollback_approved_at,
                       rollback_applied_by, rollback_applied_at,
                       summary, comments
                FROM data_admin.change_request
                WHERE change_request_id = CAST(:change_request_id AS uuid)
                """
            ),
            {"change_request_id": change_request_id},
        ).mappings().first()

    def _insert_audit_log(
        self,
        *,
        change_request_id: str,
        run_id: str,
        class_code: str,
        action: str,
        actor: str,
        target_schema: str | None,
        target_table: str | None,
        target_pk: dict[str, Any] | None,
        payload: dict[str, Any],
        metadata: dict[str, Any],
    ) -> None:
        self.db.execute(
            text(
                """
                INSERT INTO data_admin.promotion_audit_log (
                    audit_id, change_request_id, run_id, class_code, action,
                    target_schema, target_table, target_pk, payload, actor, created_at, metadata
                )
                VALUES (
                    gen_random_uuid(), CAST(:change_request_id AS uuid), CAST(:run_id AS uuid), :class_code, :action,
                    :target_schema, :target_table, CAST(:target_pk AS jsonb), CAST(:payload AS jsonb), :actor, :created_at, CAST(:metadata AS jsonb)
                )
                """
            ),
            {
                "change_request_id": change_request_id,
                "run_id": run_id,
                "class_code": class_code,
                "action": action,
                "target_schema": target_schema,
                "target_table": target_table,
                "target_pk": json.dumps(target_pk, default=str),
                "payload": json.dumps(payload, default=str),
                "actor": actor,
                "created_at": datetime.now(UTC),
                "metadata": json.dumps(metadata, default=str),
            },
        )

    @staticmethod
    def _serialize_request_row(row: Any) -> dict[str, Any]:
        return dict(
            row,
            summary=dict(row["summary"] or {}),
            rollback_reference=dict(row["rollback_reference"] or {}) if row["rollback_reference"] is not None else None,
        )
