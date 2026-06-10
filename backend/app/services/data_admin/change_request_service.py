from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any
from uuid import uuid4

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.data_admin.promotion_mapping_service import PromotionMappingService


ALLOWED_RUN_STATUSES = {"STAGED", "VALIDATED_WITH_WARNINGS"}
REJECTED_RUN_STATUSES = {"VALIDATION_FAILED", "REJECTED", "CANCELLED"}
READY_ROW_STATUSES = {"VALID", "WARNING"}
REQUEST_TRANSITIONS: dict[str, set[str]] = {
    "SUBMIT": {"DRAFT"},
    "APPROVE": {"SUBMITTED", "UNDER_REVIEW"},
    "REJECT": {"DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED"},
    "APPLY": {"APPROVED"},
}


class ChangeRequestService:
    def __init__(self, db: Session):
        self.db = db
        self.mapping_service = PromotionMappingService(db)

    def create_change_request(self, run_id: str, actor: str, comments: str | None = None) -> dict[str, Any]:
        run_row = self._get_run(run_id)
        if run_row is None:
            raise ValueError("RUN_NOT_FOUND")
        if run_row["run_status"] in REJECTED_RUN_STATUSES or run_row["run_status"] not in ALLOWED_RUN_STATUSES:
            raise ValueError("RUN_NOT_ELIGIBLE_FOR_CHANGE_REQUEST")

        existing = self.db.execute(
            text(
                """
                SELECT change_request_id::text
                FROM data_admin.change_request
                WHERE run_id = CAST(:run_id AS uuid)
                LIMIT 1
                """
            ),
            {"run_id": run_id},
        ).scalar()
        if existing:
            raise ValueError("CHANGE_REQUEST_ALREADY_EXISTS")

        staging_rows = self.db.execute(
            text(
                """
                SELECT staging_row_id::text, run_id::text, class_code, row_number, row_status,
                       raw_payload, normalized_payload, validation_errors, created_at
                FROM data_admin.ingestion_staging_row
                WHERE run_id = CAST(:run_id AS uuid)
                  AND row_status IN ('VALID', 'WARNING')
                ORDER BY row_number
                """
            ),
            {"run_id": run_id},
        ).mappings().all()
        if not staging_rows:
            raise ValueError("NO_STAGING_ROWS_ELIGIBLE")

        class_code = run_row["class_code"]
        mapping_audit = self.mapping_service.audit_mapping(class_code)
        if not mapping_audit["is_valid"]:
            raise ValueError("PROMOTION_MAPPING_NEED_FIX")

        change_request_id = str(uuid4())
        now = datetime.now(UTC)
        summary = {
            "run_status": run_row["run_status"],
            "candidate_items": len(staging_rows),
            "row_statuses": sorted({row["row_status"] for row in staging_rows}),
            "target_schema": mapping_audit["target_schema"],
            "target_table": mapping_audit["target_table"],
            "promotion_mode": "INSERT_ONLY",
            "all_or_nothing": True,
        }
        self.db.execute(
            text(
                """
                INSERT INTO data_admin.change_request (
                    change_request_id, run_id, class_code, request_status, promotion_mode,
                    requested_by, requested_at, rollback_available, rollback_status, summary, comments
                )
                VALUES (
                    CAST(:change_request_id AS uuid), CAST(:run_id AS uuid), :class_code, 'DRAFT', 'INSERT_ONLY',
                    :requested_by, :requested_at, false, 'NOT_PREPARED', CAST(:summary AS jsonb), :comments
                )
                """
            ),
            {
                "change_request_id": change_request_id,
                "run_id": run_id,
                "class_code": class_code,
                "requested_by": actor,
                "requested_at": now,
                "summary": json.dumps(summary),
                "comments": comments,
            },
        )

        for row in staging_rows:
            prepared = self.mapping_service.prepare_insert(class_code, dict(row["normalized_payload"] or {}))
            self.db.execute(
                text(
                    """
                    INSERT INTO data_admin.change_request_item (
                        item_id, change_request_id, staging_row_id, item_status,
                        raw_payload, normalized_payload, validation_errors,
                        promotion_action, target_schema, target_table, target_pk
                    )
                    VALUES (
                        CAST(:item_id AS uuid), CAST(:change_request_id AS uuid), CAST(:staging_row_id AS uuid), 'READY',
                        CAST(:raw_payload AS jsonb), CAST(:normalized_payload AS jsonb), CAST(:validation_errors AS jsonb),
                        'INSERT_ONLY', :target_schema, :target_table, CAST(:target_pk AS jsonb)
                    )
                    """
                ),
                {
                    "item_id": str(uuid4()),
                    "change_request_id": change_request_id,
                    "staging_row_id": row["staging_row_id"],
                    "raw_payload": json.dumps(dict(row["raw_payload"] or {}), default=str),
                    "normalized_payload": json.dumps(dict(row["normalized_payload"] or {}), default=str),
                    "validation_errors": json.dumps(list(row["validation_errors"] or []), default=str),
                    "target_schema": prepared["mapping"].target_schema,
                    "target_table": prepared["mapping"].target_table,
                    "target_pk": json.dumps(prepared["target_pk"], default=str),
                },
            )

        self._insert_audit_log(
            change_request_id=change_request_id,
            run_id=run_id,
            class_code=class_code,
            action="CREATE_CHANGE_REQUEST",
            actor=actor,
            target_schema=mapping_audit["target_schema"],
            target_table=mapping_audit["target_table"],
            target_pk=None,
            payload={"candidate_items": len(staging_rows)},
            metadata={"all_or_nothing": True},
        )
        self.db.commit()
        return self.get_change_request(change_request_id)

    def list_change_requests(self, limit: int = 100) -> dict[str, Any]:
        rows = self.db.execute(
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
                ORDER BY requested_at DESC
                LIMIT :limit
                """
            ),
            {"limit": limit},
        ).mappings().all()
        return {
            "status": "OK",
            "count": len(rows),
            "data": [self._serialize_request_row(row) for row in rows],
            "metadata": {"limit": limit},
        }

    def get_change_request(self, change_request_id: str) -> dict[str, Any]:
        request_row = self.db.execute(
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
        if request_row is None:
            raise ValueError("CHANGE_REQUEST_NOT_FOUND")

        item_rows = self.db.execute(
            text(
                """
                SELECT item_id::text, change_request_id::text, staging_row_id::text, item_status,
                       raw_payload, normalized_payload, validation_errors, promotion_action,
                       target_schema, target_table, target_pk, applied_at, error_message
                FROM data_admin.change_request_item
                WHERE change_request_id = CAST(:change_request_id AS uuid)
                ORDER BY item_status, staging_row_id
                """
            ),
            {"change_request_id": change_request_id},
        ).mappings().all()
        return {
            "status": "OK",
            "data": {
                "request": self._serialize_request_row(request_row),
                "items": [self._serialize_item_row(row) for row in item_rows],
            },
            "metadata": {},
        }

    def submit_change_request(self, change_request_id: str, actor: str, comments: str | None = None) -> dict[str, Any]:
        return self._transition_request(
            change_request_id=change_request_id,
            actor=actor,
            comments=comments,
            action="SUBMIT",
            next_status="SUBMITTED",
        )

    def approve_change_request(self, change_request_id: str, actor: str, comments: str | None = None) -> dict[str, Any]:
        return self._transition_request(
            change_request_id=change_request_id,
            actor=actor,
            comments=comments,
            action="APPROVE",
            next_status="APPROVED",
        )

    def reject_change_request(self, change_request_id: str, actor: str, comments: str | None = None) -> dict[str, Any]:
        return self._transition_request(
            change_request_id=change_request_id,
            actor=actor,
            comments=comments,
            action="REJECT",
            next_status="REJECTED",
        )

    def apply_change_request(self, change_request_id: str, actor: str, comments: str | None = None) -> dict[str, Any]:
        request_row = self._get_change_request_row(change_request_id)
        if request_row is None:
            raise ValueError("CHANGE_REQUEST_NOT_FOUND")
        self._assert_transition(request_row["request_status"], "APPLY")
        if request_row["promotion_mode"] != "INSERT_ONLY":
            raise ValueError("PROMOTION_MODE_NOT_ALLOWED")

        class_code = request_row["class_code"]
        mapping_audit = self.mapping_service.audit_mapping(class_code)
        if not mapping_audit["is_valid"]:
            raise ValueError("PROMOTION_MAPPING_NEED_FIX")

        item_rows = self.db.execute(
            text(
                """
                SELECT item_id::text, change_request_id::text, staging_row_id::text, item_status,
                       raw_payload, normalized_payload, validation_errors, promotion_action,
                       target_schema, target_table, target_pk, applied_at, error_message
                FROM data_admin.change_request_item
                WHERE change_request_id = CAST(:change_request_id AS uuid)
                ORDER BY staging_row_id
                """
            ),
            {"change_request_id": change_request_id},
        ).mappings().all()
        ready_items = [row for row in item_rows if row["item_status"] == "READY"]
        if not ready_items:
            raise ValueError("NO_READY_ITEMS_TO_APPLY")

        now = datetime.now(UTC)
        try:
            for row in ready_items:
                normalized_payload = dict(row["normalized_payload"] or {})
                prepared = self.mapping_service.prepare_insert(class_code, normalized_payload)
                if self.mapping_service.target_row_exists(class_code, prepared["target_pk"]):
                    raise ValueError(
                        "PROMOTION_INSERT_WOULD_DUPLICATE_EXISTING_ROW: "
                        f"class={class_code}; staging_row_id={row['staging_row_id']}; "
                        f"target={prepared['mapping'].target_schema}.{prepared['mapping'].target_table}; "
                        f"key={json.dumps(prepared['target_pk'], default=str)}; action=review_or_reject"
                    )
                applied_target_pk = self._insert_business_row(prepared)
                target_pk = applied_target_pk or prepared["target_pk"]
                self.db.execute(
                    text(
                        """
                        UPDATE data_admin.change_request_item
                        SET item_status = 'APPLIED',
                            applied_at = :applied_at,
                            target_pk = CAST(:target_pk AS jsonb),
                            error_message = NULL
                        WHERE item_id = CAST(:item_id AS uuid)
                        """
                    ),
                    {
                        "item_id": row["item_id"],
                        "applied_at": now,
                        "target_pk": json.dumps(target_pk, default=str),
                    },
                )
                self._insert_audit_log(
                    change_request_id=change_request_id,
                    run_id=request_row["run_id"],
                    class_code=class_code,
                    action="APPLY_ITEM",
                    actor=actor,
                    target_schema=prepared["mapping"].target_schema,
                    target_table=prepared["mapping"].target_table,
                    target_pk=target_pk,
                    payload=prepared["insert_payload"],
                    metadata={"mode": "INSERT_ONLY"},
                )

            summary = self._compute_summary(change_request_id)
            summary["request_status"] = "APPLIED"
            self.db.execute(
                text(
                    """
                    UPDATE data_admin.change_request
                    SET request_status = 'APPLIED',
                        applied_by = :applied_by,
                        applied_at = :applied_at,
                        rollback_available = false,
                        rollback_status = 'NOT_PREPARED',
                        rollback_reference = NULL,
                        rollback_requested_by = NULL,
                        rollback_requested_at = NULL,
                        rollback_approved_by = NULL,
                        rollback_approved_at = NULL,
                        rollback_applied_by = NULL,
                        rollback_applied_at = NULL,
                        comments = COALESCE(:comments, comments),
                        summary = CAST(:summary AS jsonb)
                    WHERE change_request_id = CAST(:change_request_id AS uuid)
                    """
                ),
                {
                    "change_request_id": change_request_id,
                    "applied_by": actor,
                    "applied_at": now,
                    "comments": comments,
                    "summary": json.dumps(summary),
                },
            )
            self._insert_audit_log(
                change_request_id=change_request_id,
                run_id=request_row["run_id"],
                class_code=class_code,
                action="APPLY_CHANGE_REQUEST",
                actor=actor,
                target_schema=mapping_audit["target_schema"],
                target_table=mapping_audit["target_table"],
                target_pk=None,
                payload={"applied_items": len(ready_items)},
                metadata={"mode": "INSERT_ONLY", "all_or_nothing": True},
            )
            self.db.commit()
        except Exception as exc:  # noqa: BLE001
            self.db.rollback()
            error_message = str(exc)
            self.db.execute(
                text(
                    """
                    UPDATE data_admin.change_request_item
                    SET item_status = CASE WHEN item_status = 'READY' THEN 'FAILED' ELSE item_status END,
                        error_message = CASE WHEN item_status = 'READY' THEN :error_message ELSE error_message END
                    WHERE change_request_id = CAST(:change_request_id AS uuid)
                    """
                ),
                {"change_request_id": change_request_id, "error_message": error_message},
            )
            failed_summary = self._compute_summary(change_request_id)
            failed_summary["request_status"] = "FAILED"
            self.db.execute(
                text(
                    """
                    UPDATE data_admin.change_request
                    SET request_status = 'FAILED',
                        rollback_available = false,
                        rollback_status = 'NOT_PREPARED',
                        comments = COALESCE(:comments, comments),
                        summary = CAST(:summary AS jsonb)
                    WHERE change_request_id = CAST(:change_request_id AS uuid)
                    """
                ),
                {
                    "change_request_id": change_request_id,
                    "comments": comments,
                    "summary": json.dumps(failed_summary),
                },
            )
            self._insert_audit_log(
                change_request_id=change_request_id,
                run_id=request_row["run_id"],
                class_code=class_code,
                action="APPLY_FAILED",
                actor=actor,
                target_schema=mapping_audit["target_schema"],
                target_table=mapping_audit["target_table"],
                target_pk=None,
                payload={"error": error_message},
                metadata={"mode": "INSERT_ONLY", "all_or_nothing": True},
            )
            self.db.commit()
            if isinstance(exc, ValueError):
                raise ValueError(error_message) from exc
            raise ValueError(
                "PROMOTION_TRANSACTION_ROLLED_BACK: "
                f"class={class_code}; change_request_id={change_request_id}; action=inspect_audit_log"
            ) from exc

        return self.get_change_request(change_request_id)

    def get_audit_log(self, change_request_id: str) -> dict[str, Any]:
        change_request = self._get_change_request_row(change_request_id)
        if change_request is None:
            raise ValueError("CHANGE_REQUEST_NOT_FOUND")
        rows = self.db.execute(
            text(
                """
                SELECT audit_id::text, change_request_id::text, run_id::text, class_code, action,
                       target_schema, target_table, target_pk, payload, actor, created_at, metadata
                FROM data_admin.promotion_audit_log
                WHERE change_request_id = CAST(:change_request_id AS uuid)
                ORDER BY created_at, audit_id
                """
            ),
            {"change_request_id": change_request_id},
        ).mappings().all()
        return {
            "status": "OK",
            "change_request_id": change_request_id,
            "count": len(rows),
            "data": [self._serialize_audit_row(row) for row in rows],
            "metadata": {},
        }

    def _transition_request(
        self,
        *,
        change_request_id: str,
        actor: str,
        comments: str | None,
        action: str,
        next_status: str,
    ) -> dict[str, Any]:
        request_row = self._get_change_request_row(change_request_id)
        if request_row is None:
            raise ValueError("CHANGE_REQUEST_NOT_FOUND")
        self._assert_transition(request_row["request_status"], action)

        now = datetime.now(UTC)
        updates: dict[str, Any] = {
            "change_request_id": change_request_id,
            "comments": comments,
        }
        set_clauses = ["request_status = :next_status", "comments = COALESCE(:comments, comments)"]
        updates["next_status"] = next_status
        if action == "APPROVE":
            set_clauses.extend(
                [
                    "reviewed_by = :actor",
                    "reviewed_at = :reviewed_at",
                    "approved_by = :actor",
                    "approved_at = :approved_at",
                ]
            )
            updates["actor"] = actor
            updates["reviewed_at"] = now
            updates["approved_at"] = now
        elif action == "REJECT":
            set_clauses.extend(
                [
                    "reviewed_by = :actor",
                    "reviewed_at = :reviewed_at",
                    "rejected_by = :actor",
                    "rejected_at = :rejected_at",
                ]
            )
            updates["actor"] = actor
            updates["reviewed_at"] = now
            updates["rejected_at"] = now
        elif action == "SUBMIT":
            updates["actor"] = actor

        self.db.execute(
            text(
                f"""
                UPDATE data_admin.change_request
                SET {", ".join(set_clauses)}
                WHERE change_request_id = CAST(:change_request_id AS uuid)
                """
            ),
            updates,
        )
        self._insert_audit_log(
            change_request_id=change_request_id,
            run_id=request_row["run_id"],
            class_code=request_row["class_code"],
            action=f"{action}_CHANGE_REQUEST",
            actor=actor,
            target_schema=None,
            target_table=None,
            target_pk=None,
            payload={"status": next_status},
            metadata={"comments": comments},
        )
        self.db.commit()
        return self.get_change_request(change_request_id)

    def _insert_business_row(self, prepared: dict[str, Any]) -> dict[str, Any] | None:
        mapping = prepared["mapping"]
        insert_payload = dict(prepared["insert_payload"])
        expression_columns = dict(prepared.get("expression_columns") or {})
        normalized_payload = dict(prepared.get("normalized_payload") or {})
        columns = list(insert_payload.keys()) + list(expression_columns.keys())
        column_clause = ", ".join(columns)
        value_fragments = [f":{column}" for column in insert_payload.keys()] + list(expression_columns.values())
        value_clause = ", ".join(value_fragments)
        params = dict(insert_payload)
        params.update(normalized_payload)
        returning_clause = ""
        if mapping.returning_fields:
            returning_clause = " RETURNING " + ", ".join(mapping.returning_fields)
        try:
            result = self.db.execute(
                text(
                    f"""
                    INSERT INTO {mapping.target_schema}.{mapping.target_table} ({column_clause})
                    VALUES ({value_clause}){returning_clause}
                    """
                ),
                params,
            )
            if mapping.returning_fields:
                row = result.mappings().first()
                if row:
                    return {field: row[field] for field in mapping.returning_fields or []}
            return None
        except Exception as exc:  # noqa: BLE001
            raise ValueError(
                "PROMOTION_ITEM_FAILED: "
                f"target={mapping.target_schema}.{mapping.target_table}; "
                f"columns={column_clause}; error={type(exc).__name__}: {exc}"
            ) from exc

    def _compute_summary(self, change_request_id: str) -> dict[str, Any]:
        request_row = self._get_change_request_row(change_request_id)
        item_rows = self.db.execute(
            text(
                """
                SELECT item_status, COUNT(*) AS count
                FROM data_admin.change_request_item
                WHERE change_request_id = CAST(:change_request_id AS uuid)
                GROUP BY item_status
                """
            ),
            {"change_request_id": change_request_id},
        ).mappings().all()
        counts = {row["item_status"]: int(row["count"]) for row in item_rows}
        return {
            "request_status": request_row["request_status"] if request_row else None,
            "item_counts": counts,
            "candidate_items": sum(counts.values()),
            "ready_items": counts.get("READY", 0),
            "applied_items": counts.get("APPLIED", 0),
            "failed_items": counts.get("FAILED", 0),
            "all_or_nothing": True,
            "promotion_mode": request_row["promotion_mode"] if request_row else "INSERT_ONLY",
        }

    def _get_run(self, run_id: str):
        return self.db.execute(
            text(
                """
                SELECT run_id::text, class_code, run_status, file_name
                FROM data_admin.ingestion_run
                WHERE run_id = CAST(:run_id AS uuid)
                """
            ),
            {"run_id": run_id},
        ).mappings().first()

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

    @staticmethod
    def _assert_transition(current_status: str, action: str) -> None:
        if current_status == "APPLIED":
            raise ValueError("CHANGE_REQUEST_ALREADY_APPLIED")
        if current_status == "REJECTED":
            raise ValueError("CHANGE_REQUEST_REJECTED")
        if action == "APPLY" and current_status != "APPROVED":
            raise ValueError("CHANGE_REQUEST_NOT_APPROVED")
        if current_status not in REQUEST_TRANSITIONS[action]:
            raise ValueError(
                f"INVALID_CHANGE_REQUEST_TRANSITION: action={action}; current_status={current_status}"
            )

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
                    CAST(:audit_id AS uuid), CAST(:change_request_id AS uuid), CAST(:run_id AS uuid), :class_code, :action,
                    :target_schema, :target_table, CAST(:target_pk AS jsonb), CAST(:payload AS jsonb), :actor, :created_at, CAST(:metadata AS jsonb)
                )
                """
            ),
            {
                "audit_id": str(uuid4()),
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

    @staticmethod
    def _serialize_item_row(row: Any) -> dict[str, Any]:
        return dict(
            row,
            raw_payload=dict(row["raw_payload"] or {}),
            normalized_payload=dict(row["normalized_payload"] or {}),
            validation_errors=list(row["validation_errors"] or []),
            target_pk=dict(row["target_pk"] or {}) if row["target_pk"] is not None else None,
        )

    @staticmethod
    def _serialize_audit_row(row: Any) -> dict[str, Any]:
        return dict(
            row,
            target_pk=dict(row["target_pk"] or {}) if row["target_pk"] is not None else None,
            payload=dict(row["payload"] or {}),
            metadata=dict(row["metadata"] or {}),
        )
