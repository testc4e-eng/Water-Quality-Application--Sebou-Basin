from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.data_admin.dynamic_validation_service import DynamicValidationService
from app.services.data_admin.ingestion_file_parser import ParsedIngestionFile, parse_ingestion_file
from app.services.data_admin.template_generation_service import TemplateGenerationService


UPLOAD_BASE_DIR = Path("data/uploads/data_admin")
PILOT_CLASS_CODES = {
    "HYDRO_DEBIT",
    "METEO_PRECIPITATION",
    "QUALITE_RIVIERE",
    "INFRA_STATION",
    "POLLUTION_SITE",
}
BLOCKING_SEVERITIES = {"BLOCKING", "CRITICAL"}
ALLOWED_GEOMETRY_SRIDS = {4326, 26191}
ALLOWED_POLLUTION_VALIDATION_STATUSES = {"VALIDATED", "TO_VALIDATE", "REJECTED"}


@dataclass(frozen=True)
class ValidationErrorItem:
    error_id: str
    run_id: str
    row_number: int | None
    field_name: str | None
    error_scope: str
    severity: str
    error_code: str
    error_message: str
    raw_value: str | None
    expected_rule: str | None
    created_at: datetime


class DataAdminIngestionService:
    def __init__(self, db: Session):
        self.db = db
        self.template_service = TemplateGenerationService(db)
        self.dynamic_validation_service = DynamicValidationService(db)

    def upload_and_stage(
        self,
        *,
        class_code: str,
        file_name: str,
        mime_type: str,
        content: bytes,
        created_by: str,
    ) -> dict[str, Any]:
        if class_code not in PILOT_CLASS_CODES:
            raise ValueError("CLASS_NOT_ENABLED_FOR_MVP2C")

        template_spec = self.template_service.get_template_spec(class_code)
        field_specs = template_spec["data"]["fields"]
        template_headers = [field["field_name"] for field in field_specs]
        template_labels = [field["field_label"] for field in field_specs]
        template_examples = [str(field.get("example_value") or "") for field in field_specs]

        parsed = parse_ingestion_file(
            file_name=file_name,
            content=content,
            mime_type=mime_type,
            template_headers=template_headers,
            template_field_labels=template_labels,
            template_example_values=template_examples,
        )
        if not parsed.rows:
            raise ValueError("EMPTY_DATASET")

        run_id = str(uuid4())
        sha256 = hashlib.sha256(content).hexdigest()
        stored_path = self._store_uploaded_file(run_id=run_id, file_name=file_name, content=content)
        active_rules = self.dynamic_validation_service.get_active_rules(class_code)
        validation = self._validate_rows(
            class_code=class_code,
            field_specs=field_specs,
            parsed=parsed,
            run_id=run_id,
            active_rules=active_rules,
        )

        run_status = "STAGED"
        if validation["blocking_error_count"] > 0:
            run_status = "VALIDATION_FAILED"
        elif validation["warning_count"] > 0:
            run_status = "VALIDATED_WITH_WARNINGS"

        now = datetime.now(UTC)
        run_payload = {
            "run_id": run_id,
            "class_code": class_code,
            "run_status": run_status,
            "file_name": file_name,
            "file_format": parsed.file_format,
            "row_count": len(parsed.rows),
            "valid_row_count": validation["valid_row_count"],
            "error_row_count": validation["error_row_count"],
            "warning_count": validation["warning_count"],
            "created_by": created_by,
            "created_at": now,
            "validated_at": now,
            "staged_at": now if run_status in {"STAGED", "VALIDATED_WITH_WARNINGS"} else None,
            "metadata": {
                "pilot_class": True,
                "sheet_name": parsed.metadata.get("sheet_name"),
                "field_source": template_spec["data"]["field_source"],
                "raw_preview_count": len(parsed.preview),
                "dynamic_rule_count": len(active_rules),
            },
        }

        file_payload = {
            "file_id": str(uuid4()),
            "run_id": run_id,
            "file_name": file_name,
            "file_format": parsed.file_format,
            "mime_type": mime_type or "application/octet-stream",
            "file_size_bytes": len(content),
            "sha256": sha256,
            "stored_path": stored_path,
            "raw_preview": parsed.preview,
            "created_at": now,
        }

        self._insert_run(run_payload)
        self._insert_file(file_payload)
        if validation["errors"]:
            self._insert_errors(validation["errors"])
        staging_row_count = 0
        if run_status in {"STAGED", "VALIDATED_WITH_WARNINGS"}:
            staging_row_count = self._insert_staging_rows(run_id, class_code, validation["row_results"], now)

        self.db.commit()
        return {
            "status": "OK",
            "run": run_payload,
            "file": file_payload,
            "errors": [self._error_to_dict(item) for item in validation["errors"]],
            "staging_row_count": staging_row_count,
            "metadata": {
                "field_source": template_spec["data"]["field_source"],
                "field_registry_incomplete": template_spec["data"]["field_registry_incomplete"],
                "blocking_error_count": validation["blocking_error_count"],
                "warning_count": validation["warning_count"],
                "stored_path": stored_path,
                "dynamic_rule_count": len(active_rules),
            },
        }

    def list_runs(self, limit: int = 100) -> dict[str, Any]:
        rows = self.db.execute(
            text(
                """
                SELECT run_id::text, class_code, run_status, file_name, file_format, row_count,
                       valid_row_count, error_row_count, warning_count, created_by, created_at,
                       validated_at, staged_at, metadata
                FROM data_admin.ingestion_run
                ORDER BY created_at DESC
                LIMIT :limit
                """
            ),
            {"limit": limit},
        ).mappings().all()
        data = [dict(row, metadata=dict(row["metadata"] or {})) for row in rows]
        return {"status": "OK", "count": len(data), "data": data, "metadata": {"limit": limit}}

    def get_run(self, run_id: str) -> dict[str, Any]:
        run_row = self.db.execute(
            text(
                """
                SELECT run_id::text, class_code, run_status, file_name, file_format, row_count,
                       valid_row_count, error_row_count, warning_count, created_by, created_at,
                       validated_at, staged_at, metadata
                FROM data_admin.ingestion_run
                WHERE run_id = CAST(:run_id AS uuid)
                """
            ),
            {"run_id": run_id},
        ).mappings().first()
        if not run_row:
            raise ValueError("RUN_NOT_FOUND")

        file_row = self.db.execute(
            text(
                """
                SELECT file_id::text, run_id::text, file_name, file_format, mime_type, file_size_bytes,
                       sha256, stored_path, raw_preview, created_at
                FROM data_admin.ingestion_file
                WHERE run_id = CAST(:run_id AS uuid)
                ORDER BY created_at DESC
                LIMIT 1
                """
            ),
            {"run_id": run_id},
        ).mappings().first()

        return {
            "status": "OK",
            "run": dict(run_row, metadata=dict(run_row["metadata"] or {})),
            "file": dict(file_row, raw_preview=list(file_row["raw_preview"] or [])) if file_row else None,
            "metadata": {},
        }

    def get_run_errors(self, run_id: str) -> dict[str, Any]:
        rows = self.db.execute(
            text(
                """
                SELECT error_id::text, run_id::text, row_number, field_name, error_scope, severity, error_code,
                       error_message, raw_value, expected_rule, created_at
                FROM data_admin.ingestion_validation_error
                WHERE run_id = CAST(:run_id AS uuid)
                ORDER BY row_number NULLS FIRST, created_at
                """
            ),
            {"run_id": run_id},
        ).mappings().all()
        data = [dict(row) for row in rows]
        return {"status": "OK", "run_id": run_id, "count": len(data), "data": data, "metadata": {}}

    def get_staging_preview(self, run_id: str, limit: int = 100) -> dict[str, Any]:
        rows = self.db.execute(
            text(
                """
                SELECT staging_row_id::text, run_id::text, class_code, row_number, row_status,
                       raw_payload, normalized_payload, validation_errors, created_at
                FROM data_admin.ingestion_staging_row
                WHERE run_id = CAST(:run_id AS uuid)
                ORDER BY row_number
                LIMIT :limit
                """
            ),
            {"run_id": run_id, "limit": limit},
        ).mappings().all()
        data = [
            dict(
                row,
                raw_payload=dict(row["raw_payload"] or {}),
                normalized_payload=dict(row["normalized_payload"] or {}),
                validation_errors=list(row["validation_errors"] or []),
            )
            for row in rows
        ]
        return {"status": "OK", "run_id": run_id, "count": len(data), "data": data, "metadata": {"limit": limit}}

    def _validate_rows(
        self,
        *,
        class_code: str,
        field_specs: list[dict[str, Any]],
        parsed: ParsedIngestionFile,
        run_id: str,
        active_rules: list[Any],
    ) -> dict[str, Any]:
        now = datetime.now(UTC)
        field_map = {field["field_name"]: field for field in field_specs}
        required_fields = {field["field_name"] for field in field_specs if field.get("required")}
        unknown_columns = [header for header in parsed.headers if header not in field_map]
        errors: list[ValidationErrorItem] = []
        row_results: list[dict[str, Any]] = []
        valid_row_count = 0

        for column in unknown_columns:
            errors.append(
                ValidationErrorItem(
                    error_id=str(uuid4()),
                    run_id=run_id,
                    row_number=None,
                    field_name=column,
                    error_scope="STRUCTURAL",
                    severity="BLOCKING",
                    error_code="UNKNOWN_COLUMN",
                    error_message=f"Colonne non autorisee pour la classe {class_code}.",
                    raw_value=column,
                    expected_rule="Utiliser uniquement les colonnes du canevas metier.",
                    created_at=now,
                )
            )
        for required in required_fields:
            if required not in parsed.headers:
                errors.append(
                    ValidationErrorItem(
                        error_id=str(uuid4()),
                        run_id=run_id,
                        row_number=None,
                        field_name=required,
                        error_scope="STRUCTURAL",
                        severity="BLOCKING",
                        error_code="MISSING_REQUIRED_COLUMN",
                        error_message=f"Colonne obligatoire absente: {required}.",
                        raw_value=None,
                        expected_rule=field_map[required].get("validation_rule"),
                        created_at=now,
                    )
                )
        for row_index, raw_row in enumerate(parsed.rows, start=1):
            row_errors: list[ValidationErrorItem] = []
            normalized_row: dict[str, Any] = {}

            for field_name, field_spec in field_map.items():
                raw_value = raw_row.get(field_name, "")
                normalized_value, field_error = self._normalize_value(field_name, raw_value, field_spec, raw_row)
                if field_error is not None:
                    error_item = ValidationErrorItem(
                        error_id=str(uuid4()),
                        run_id=run_id,
                        row_number=row_index,
                        field_name=field_name,
                        error_scope="STRUCTURAL",
                        severity=field_error["severity"],
                        error_code=field_error["error_code"],
                        error_message=field_error["error_message"],
                        raw_value=field_error["raw_value"],
                        expected_rule=field_error["expected_rule"],
                        created_at=now,
                    )
                    row_errors.append(error_item)
                    errors.append(error_item)
                normalized_row[field_name] = normalized_value

            if class_code == "HYDRO_DEBIT":
                self._apply_hydro_rules(run_id, row_index, raw_row, normalized_row, field_map, now, row_errors, errors)
            elif class_code == "METEO_PRECIPITATION":
                self._apply_meteo_rules(run_id, row_index, raw_row, normalized_row, field_map, now, row_errors, errors)
            elif class_code == "QUALITE_RIVIERE":
                self._apply_qualite_riviere_rules(run_id, row_index, raw_row, normalized_row, field_map, now, row_errors, errors)
            elif class_code == "INFRA_STATION":
                self._apply_infra_station_rules(run_id, row_index, raw_row, normalized_row, field_map, now, row_errors, errors)
            elif class_code == "POLLUTION_SITE":
                self._apply_pollution_site_rules(run_id, row_index, raw_row, normalized_row, field_map, now, row_errors, errors)

            dynamic_issues = self.dynamic_validation_service.validate_row(
                class_code=class_code,
                row_number=row_index,
                raw_row=raw_row,
                normalized_row=normalized_row,
                active_rules=active_rules,
            )
            for issue in dynamic_issues:
                item = ValidationErrorItem(
                    error_id=str(uuid4()),
                    run_id=run_id,
                    row_number=issue.row_number,
                    field_name=issue.field_name,
                    error_scope=issue.error_scope,
                    severity=issue.severity,
                    error_code=issue.error_code,
                    error_message=issue.error_message,
                    raw_value=issue.raw_value,
                    expected_rule=issue.expected_rule,
                    created_at=now,
                )
                row_errors.append(item)
                errors.append(item)

            row_blocking = [error for error in row_errors if error.severity in BLOCKING_SEVERITIES]
            row_warning = [error for error in row_errors if error.severity == "WARNING"]
            row_status = "INVALID" if row_blocking else ("WARNING" if row_warning else "VALID")
            if row_status != "INVALID":
                valid_row_count += 1

            row_results.append(
                {
                    "row_number": row_index,
                    "row_status": row_status,
                    "raw_payload": raw_row,
                    "normalized_payload": normalized_row,
                    "validation_errors": [
                        {
                            "error_scope": error.error_scope,
                            "severity": error.severity,
                            "error_code": error.error_code,
                            "field_name": error.field_name,
                            "error_message": error.error_message,
                        }
                        for error in row_errors
                    ],
                }
            )

        blocking_error_count = sum(1 for error in errors if error.severity in BLOCKING_SEVERITIES)
        warning_count = sum(1 for error in errors if error.severity == "WARNING")
        error_row_count = sum(1 for row in row_results if row["row_status"] == "INVALID")
        return {
            "errors": errors,
            "row_results": row_results,
            "blocking_error_count": blocking_error_count,
            "warning_count": warning_count,
            "valid_row_count": valid_row_count,
            "error_row_count": error_row_count,
        }

    def _normalize_value(
        self,
        field_name: str,
        raw_value: Any,
        field_spec: dict[str, Any],
        raw_row: dict[str, Any],
    ) -> tuple[Any, dict[str, Any] | None]:
        if isinstance(raw_value, str):
            value = raw_value.strip()
        else:
            value = raw_value

        if field_spec.get("required") and (value is None or value == ""):
            return value, {
                "severity": "BLOCKING",
                "error_code": "EMPTY_REQUIRED_VALUE",
                "error_message": f"Champ obligatoire vide: {field_name}.",
                "raw_value": "" if value is None else str(value),
                "expected_rule": field_spec.get("validation_rule"),
            }

        if value in ("", None):
            return None, None

        data_type = str(field_spec.get("data_type", "")).lower()
        if "timestamp" in data_type or data_type == "date":
            if self._is_valid_datetime(value):
                return str(value), None
            return value, {
                "severity": "BLOCKING",
                "error_code": "INVALID_DATE",
                "error_message": f"Format date/temps invalide pour {field_name}.",
                "raw_value": str(value),
                "expected_rule": field_spec.get("validation_rule"),
            }
        if data_type == "uuid":
            try:
                return str(UUID(str(value))), None
            except (TypeError, ValueError):
                return value, {
                    "severity": "BLOCKING",
                    "error_code": "INVALID_UUID",
                    "error_message": f"Identifiant UUID invalide pour {field_name}.",
                    "raw_value": str(value),
                    "expected_rule": field_spec.get("validation_rule"),
                }
        if data_type in {"integer", "bigint"}:
            try:
                return int(str(value)), None
            except (TypeError, ValueError):
                return value, {
                    "severity": "BLOCKING",
                    "error_code": "INVALID_INTEGER",
                    "error_message": f"Valeur entiere invalide pour {field_name}.",
                    "raw_value": str(value),
                    "expected_rule": field_spec.get("validation_rule"),
                }
        if "double precision" in data_type or "numeric" in data_type:
            try:
                return float(value), None
            except (TypeError, ValueError):
                return value, {
                    "severity": "BLOCKING",
                    "error_code": "INVALID_NUMERIC",
                    "error_message": f"Valeur numerique invalide pour {field_name}.",
                    "raw_value": str(value),
                    "expected_rule": field_spec.get("validation_rule"),
                }
        if data_type == "boolean":
            if isinstance(value, bool):
                return value, None
            lowered = str(value).strip().lower()
            if lowered in {"true", "1", "yes", "oui"}:
                return True, None
            if lowered in {"false", "0", "no", "non"}:
                return False, None
            return value, {
                "severity": "BLOCKING",
                "error_code": "INVALID_BOOLEAN",
                "error_message": f"Valeur booleenne invalide pour {field_name}.",
                "raw_value": str(value),
                "expected_rule": field_spec.get("validation_rule"),
            }
        return value, None

    @staticmethod
    def _is_valid_datetime(value: Any) -> bool:
        raw = str(value).strip()
        if raw.endswith("Z"):
            raw = raw[:-1] + "+00:00"
        for parser in (datetime.fromisoformat,):
            try:
                parser(raw)
                return True
            except ValueError:
                continue
        return False

    def _apply_hydro_rules(self, run_id: str, row_number: int, raw_row: dict[str, Any], normalized_row: dict[str, Any], field_map: dict[str, Any], now: datetime, row_errors: list[ValidationErrorItem], errors: list[ValidationErrorItem]) -> None:
        if isinstance(normalized_row.get("valeur"), (int, float)) and float(normalized_row["valeur"]) < 0:
            self._append_business_error(run_id, row_number, "valeur", "BLOCKING", "NEGATIVE_VALUE", "La valeur de debit doit etre >= 0.", raw_row.get("valeur"), field_map["valeur"].get("validation_rule"), now, row_errors, errors)

    def _apply_meteo_rules(self, run_id: str, row_number: int, raw_row: dict[str, Any], normalized_row: dict[str, Any], field_map: dict[str, Any], now: datetime, row_errors: list[ValidationErrorItem], errors: list[ValidationErrorItem]) -> None:
        if isinstance(normalized_row.get("val_observees"), (int, float)) and float(normalized_row["val_observees"]) < 0:
            self._append_business_error(run_id, row_number, "val_observees", "BLOCKING", "NEGATIVE_VALUE", "La precipitation observee doit etre >= 0.", raw_row.get("val_observees"), field_map["val_observees"].get("validation_rule"), now, row_errors, errors)

    def _apply_qualite_riviere_rules(self, run_id: str, row_number: int, raw_row: dict[str, Any], normalized_row: dict[str, Any], field_map: dict[str, Any], now: datetime, row_errors: list[ValidationErrorItem], errors: list[ValidationErrorItem]) -> None:
        if not normalized_row.get("parametre_qualite"):
            self._append_business_error(run_id, row_number, "parametre_qualite", "BLOCKING", "EMPTY_REQUIRED_VALUE", "Le parametre qualite est obligatoire.", raw_row.get("parametre_qualite"), field_map["parametre_qualite"].get("validation_rule"), now, row_errors, errors)
        if not normalized_row.get("station_id") and not normalized_row.get("ire_station"):
            self._append_business_error(run_id, row_number, "station_id", "BLOCKING", "MISSING_STATION_REFERENCE", "station_id ou ire_station doit etre renseigne.", None, "station_id ou ire_station present.", now, row_errors, errors)

    def _apply_infra_station_rules(self, run_id: str, row_number: int, raw_row: dict[str, Any], normalized_row: dict[str, Any], field_map: dict[str, Any], now: datetime, row_errors: list[ValidationErrorItem], errors: list[ValidationErrorItem]) -> None:
        if not normalized_row.get("code_station"):
            self._append_business_error(run_id, row_number, "code_station", "BLOCKING", "EMPTY_REQUIRED_VALUE", "Le code station est obligatoire.", raw_row.get("code_station"), field_map["code_station"].get("validation_rule"), now, row_errors, errors)
        if not normalized_row.get("nom"):
            self._append_business_error(run_id, row_number, "nom", "BLOCKING", "EMPTY_REQUIRED_VALUE", "Le nom de station est obligatoire.", raw_row.get("nom"), field_map["nom"].get("validation_rule"), now, row_errors, errors)
        if not normalized_row.get("type_station"):
            self._append_business_error(run_id, row_number, "type_station", "BLOCKING", "EMPTY_REQUIRED_VALUE", "Le type de station est obligatoire.", raw_row.get("type_station"), field_map["type_station"].get("validation_rule"), now, row_errors, errors)
        if normalized_row.get("srid") not in ALLOWED_GEOMETRY_SRIDS:
            self._append_business_error(run_id, row_number, "srid", "BLOCKING", "INVALID_SRID", "Le SRID station doit etre 4326 ou 26191.", raw_row.get("srid"), field_map["srid"].get("validation_rule"), now, row_errors, errors)

    def _apply_pollution_site_rules(self, run_id: str, row_number: int, raw_row: dict[str, Any], normalized_row: dict[str, Any], field_map: dict[str, Any], now: datetime, row_errors: list[ValidationErrorItem], errors: list[ValidationErrorItem]) -> None:
        site_code = str(normalized_row.get("site_code") or "").strip()
        if not site_code:
            self._append_business_error(run_id, row_number, "site_code", "BLOCKING", "EMPTY_REQUIRED_VALUE", "Le code site est obligatoire.", raw_row.get("site_code"), field_map["site_code"].get("validation_rule"), now, row_errors, errors)
        if site_code.upper().startswith("IDP-C1B-"):
            self._append_business_error(run_id, row_number, "site_code", "BLOCKING", "PROTECTED_IDP_SITE_CODE", "Les codes IDP-C1B-* sont proteges et ne peuvent pas etre importes via data_admin.", raw_row.get("site_code"), "Utiliser un code site manuel distinct du perimetre IDP cloture.", now, row_errors, errors)
        if not normalized_row.get("site_name"):
            self._append_business_error(run_id, row_number, "site_name", "BLOCKING", "EMPTY_REQUIRED_VALUE", "Le nom du site pollution est obligatoire.", raw_row.get("site_name"), field_map["site_name"].get("validation_rule"), now, row_errors, errors)
        validation_status = str(normalized_row.get("validation_status") or "TO_VALIDATE").strip().upper()
        if validation_status and validation_status not in ALLOWED_POLLUTION_VALIDATION_STATUSES:
            self._append_business_error(run_id, row_number, "validation_status", "BLOCKING", "INVALID_ALLOWED_VALUE", "Le statut de validation pollution doit etre VALIDATED, TO_VALIDATE ou REJECTED.", raw_row.get("validation_status"), field_map["validation_status"].get("validation_rule"), now, row_errors, errors)
        if normalized_row.get("srid") not in ALLOWED_GEOMETRY_SRIDS:
            self._append_business_error(run_id, row_number, "srid", "BLOCKING", "INVALID_SRID", "Le SRID pollution doit etre 4326 ou 26191.", raw_row.get("srid"), field_map["srid"].get("validation_rule"), now, row_errors, errors)

    @staticmethod
    def _append_business_error(run_id: str, row_number: int, field_name: str, severity: str, error_code: str, error_message: str, raw_value: Any, expected_rule: str | None, now: datetime, row_errors: list[ValidationErrorItem], errors: list[ValidationErrorItem]) -> None:
        item = ValidationErrorItem(
            error_id=str(uuid4()),
            run_id=run_id,
            row_number=row_number,
            field_name=field_name,
            error_scope="BUSINESS",
            severity=severity,
            error_code=error_code,
            error_message=error_message,
            raw_value=None if raw_value is None else str(raw_value),
            expected_rule=expected_rule,
            created_at=now,
        )
        row_errors.append(item)
        errors.append(item)

    def _store_uploaded_file(self, *, run_id: str, file_name: str, content: bytes) -> str:
        target_dir = UPLOAD_BASE_DIR / run_id
        target_dir.mkdir(parents=True, exist_ok=True)
        target_path = target_dir / file_name
        target_path.write_bytes(content)
        return str(target_path)

    def _insert_run(self, payload: dict[str, Any]) -> None:
        self.db.execute(
            text(
                """
                INSERT INTO data_admin.ingestion_run (
                    run_id, class_code, run_status, file_name, file_format, row_count,
                    valid_row_count, error_row_count, warning_count, created_by,
                    created_at, validated_at, staged_at, metadata
                )
                VALUES (
                    CAST(:run_id AS uuid), :class_code, :run_status, :file_name, :file_format, :row_count,
                    :valid_row_count, :error_row_count, :warning_count, :created_by,
                    :created_at, :validated_at, :staged_at, CAST(:metadata AS jsonb)
                )
                """
            ),
            {**payload, "metadata": json.dumps(payload["metadata"])},
        )

    def _insert_file(self, payload: dict[str, Any]) -> None:
        self.db.execute(
            text(
                """
                INSERT INTO data_admin.ingestion_file (
                    file_id, run_id, file_name, file_format, mime_type, file_size_bytes,
                    sha256, stored_path, raw_preview, created_at
                )
                VALUES (
                    CAST(:file_id AS uuid), CAST(:run_id AS uuid), :file_name, :file_format, :mime_type, :file_size_bytes,
                    :sha256, :stored_path, CAST(:raw_preview AS jsonb), :created_at
                )
                """
            ),
            {**payload, "raw_preview": json.dumps(payload["raw_preview"])},
        )

    def _insert_errors(self, errors: list[ValidationErrorItem]) -> None:
        for error in errors:
            self.db.execute(
                text(
                    """
                    INSERT INTO data_admin.ingestion_validation_error (
                        error_id, run_id, row_number, field_name, error_scope, severity, error_code,
                        error_message, raw_value, expected_rule, created_at
                    )
                    VALUES (
                        CAST(:error_id AS uuid), CAST(:run_id AS uuid), :row_number, :field_name, :error_scope, :severity, :error_code,
                        :error_message, :raw_value, :expected_rule, :created_at
                    )
                    """
                ),
                self._error_to_dict(error),
            )

    def _insert_staging_rows(self, run_id: str, class_code: str, row_results: list[dict[str, Any]], created_at: datetime) -> int:
        count = 0
        for row in row_results:
            if row["row_status"] == "INVALID":
                continue
            self.db.execute(
                text(
                    """
                    INSERT INTO data_admin.ingestion_staging_row (
                        staging_row_id, run_id, class_code, row_number, row_status,
                        raw_payload, normalized_payload, validation_errors, created_at
                    )
                    VALUES (
                        CAST(:staging_row_id AS uuid), CAST(:run_id AS uuid), :class_code, :row_number, :row_status,
                        CAST(:raw_payload AS jsonb), CAST(:normalized_payload AS jsonb), CAST(:validation_errors AS jsonb), :created_at
                    )
                    """
                ),
                {
                    "staging_row_id": str(uuid4()),
                    "run_id": run_id,
                    "class_code": class_code,
                    "row_number": row["row_number"],
                    "row_status": row["row_status"],
                    "raw_payload": json.dumps(row["raw_payload"]),
                    "normalized_payload": json.dumps(row["normalized_payload"], default=str),
                    "validation_errors": json.dumps(row["validation_errors"]),
                    "created_at": created_at,
                },
            )
            count += 1
        return count

    @staticmethod
    def _error_to_dict(error: ValidationErrorItem) -> dict[str, Any]:
        return {
            "error_id": error.error_id,
            "run_id": error.run_id,
            "row_number": error.row_number,
            "field_name": error.field_name,
            "error_scope": error.error_scope,
            "severity": error.severity,
            "error_code": error.error_code,
            "error_message": error.error_message,
            "raw_value": error.raw_value,
            "expected_rule": error.expected_rule,
            "created_at": error.created_at,
        }
