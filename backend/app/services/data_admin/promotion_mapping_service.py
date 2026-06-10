from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session


IDENTIFIER_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


@dataclass(frozen=True)
class PromotionMapping:
    class_code: str
    target_schema: str
    target_table: str
    source_to_target: dict[str, str]
    identity_fields: list[str]
    returning_fields: list[str] | None = None
    target_sql_expressions: dict[str, str] | None = None
    mode: str = "INSERT_ONLY"
    static_target_values: dict[str, Any] | None = None


class PromotionMappingService:
    _MAPPINGS: dict[str, PromotionMapping] = {
        "HYDRO_DEBIT": PromotionMapping(
            class_code="HYDRO_DEBIT",
            target_schema="hydro",
            target_table="mesure_debit",
            source_to_target={
                "station_id": "station_id",
                "temps": "temps",
                "valeur": "valeur",
                "est_valide": "est_valide",
            },
            identity_fields=["station_id", "temps", "valeur"],
            static_target_values={},
        ),
        "METEO_PRECIPITATION": PromotionMapping(
            class_code="METEO_PRECIPITATION",
            target_schema="meteo",
            target_table="mesure_precipitation",
            source_to_target={
                "station_id": "station_id",
                "temps": "temps",
                "val_observees": "val_observees",
                "pas_temps": "pas_temps",
                "ire_precipitation": "ire_precipitation",
            },
            identity_fields=["station_id", "temps"],
            static_target_values={"source_system": "data_admin_mvp3"},
        ),
        "QUALITE_RIVIERE": PromotionMapping(
            class_code="QUALITE_RIVIERE",
            target_schema="qualite",
            target_table="mesure_qualite_riviere",
            source_to_target={
                "station_id": "station_id",
                "ire_station": "ire_station",
                "temps": "temps",
                "parametre_qualite": "parametre_qualite",
                "valeur": "valeur",
            },
            identity_fields=["station_id", "ire_station", "temps", "parametre_qualite"],
            static_target_values={"source_row_id": -1, "source_system": "data_admin_mvp3"},
        ),
        "INFRA_STATION": PromotionMapping(
            class_code="INFRA_STATION",
            target_schema="infra",
            target_table="stations_mesure",
            source_to_target={
                "code_station": "code_station",
                "nom": "nom",
                "type_station": "type_station",
                "altitude_m": "altitude_m",
                "date_mise_service": "date_mise_service",
            },
            identity_fields=["code_station"],
            returning_fields=["id"],
            target_sql_expressions={
                "geom": "ST_Transform(ST_GeomFromText(:geom_wkt, :srid), 4326)",
            },
            static_target_values={"actif": True},
        ),
        "POLLUTION_SITE": PromotionMapping(
            class_code="POLLUTION_SITE",
            target_schema="geo",
            target_table="ref_site_pollution",
            source_to_target={
                "site_code": "site_code",
                "site_name": "site_name",
                "commune": "commune",
                "province": "province",
                "bassin": "bassin",
                "validation_status": "validation_status",
            },
            identity_fields=["site_code"],
            returning_fields=["site_id"],
            target_sql_expressions={
                "geom": "ST_Transform(ST_GeomFromText(:geom_wkt, :srid), 26191)",
                "geom_4326": "ST_Transform(ST_GeomFromText(:geom_wkt, :srid), 4326)",
            },
            static_target_values={"source_origin": "data_admin_mvp3d"},
        ),
    }

    def __init__(self, db: Session):
        self.db = db

    def list_enabled_classes(self) -> list[str]:
        return sorted(self._MAPPINGS)

    def get_mapping(self, class_code: str) -> PromotionMapping:
        mapping = self._MAPPINGS.get(class_code)
        if mapping is None:
            raise ValueError("PROMOTION_CLASS_NOT_ENABLED")
        return mapping

    def audit_mapping(self, class_code: str) -> dict[str, Any]:
        mapping = self.get_mapping(class_code)
        self._assert_identifier(mapping.target_schema)
        self._assert_identifier(mapping.target_table)
        rows = self.db.execute(
            text(
                """
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_schema = :schema
                  AND table_name = :table
                ORDER BY ordinal_position
                """
            ),
            {"schema": mapping.target_schema, "table": mapping.target_table},
        ).mappings().all()
        columns = {row["column_name"]: row["data_type"] for row in rows}
        required_without_default = [
            row["column_name"]
            for row in rows
            if row["is_nullable"] == "NO" and row["column_default"] is None
        ]
        table_exists = len(rows) > 0
        provided_columns = (
            set(mapping.source_to_target.values())
            | set((mapping.static_target_values or {}).keys())
            | set((mapping.target_sql_expressions or {}).keys())
        )
        missing_columns = [
            target_column
            for target_column in mapping.source_to_target.values()
            if target_column not in columns
        ]
        missing_required_assignments = [
            column_name
            for column_name in required_without_default
            if column_name not in provided_columns
        ]
        return {
            "class_code": class_code,
            "target_schema": mapping.target_schema,
            "target_table": mapping.target_table,
            "mode": mapping.mode,
            "columns": columns,
            "table_exists": table_exists,
            "missing_columns": missing_columns,
            "missing_required_assignments": missing_required_assignments,
            "is_valid": table_exists and len(missing_columns) == 0 and len(missing_required_assignments) == 0,
        }

    def prepare_insert(self, class_code: str, normalized_payload: dict[str, Any]) -> dict[str, Any]:
        mapping = self.get_mapping(class_code)
        audit = self.audit_mapping(class_code)
        if not audit["is_valid"]:
            target = f"{mapping.target_schema}.{mapping.target_table}"
            if not audit["table_exists"]:
                raise ValueError(
                    f"PROMOTION_TARGET_TABLE_UNAVAILABLE: class={class_code}; target={target}; action=verify_target_table"
                )
            if audit["missing_required_assignments"]:
                raise ValueError(
                    "PROMOTION_TARGET_COLUMN_INVALID: "
                    f"class={class_code}; target={target}; "
                    f"required_without_assignment={','.join(audit['missing_required_assignments'])}; action=complete_mapping"
                )
            raise ValueError(
                "PROMOTION_MAPPING_MISSING_COLUMN: "
                f"class={class_code}; target={target}; missing={','.join(audit['missing_columns'])}; action=fix_mapping"
            )

        insert_payload: dict[str, Any] = {}
        for source_field, target_field in mapping.source_to_target.items():
            insert_payload[target_field] = normalized_payload.get(source_field)
        for target_field, value in (mapping.static_target_values or {}).items():
            insert_payload[target_field] = value
        if class_code == "POLLUTION_SITE" and not insert_payload.get("validation_status"):
            insert_payload["validation_status"] = "TO_VALIDATE"
        expression_columns = dict(mapping.target_sql_expressions or {})

        target_pk = {
            field: normalized_payload.get(field)
            for field in mapping.identity_fields
            if normalized_payload.get(field) is not None
        }
        return {
            "mapping": mapping,
            "insert_payload": insert_payload,
            "expression_columns": expression_columns,
            "normalized_payload": normalized_payload,
            "target_pk": target_pk or None,
            "audit": audit,
        }

    def target_row_exists(self, class_code: str, target_pk: dict[str, Any] | None) -> bool:
        if not target_pk:
            return False
        mapping = self.get_mapping(class_code)
        conditions: list[str] = []
        params: dict[str, Any] = {}
        for index, (column, value) in enumerate(target_pk.items()):
            param_name = f"p_{index}"
            self._assert_identifier(column)
            conditions.append(f"{column} = :{param_name}")
            params[param_name] = value
        where_clause = " AND ".join(conditions)
        query = text(
            f"""
            SELECT EXISTS (
                SELECT 1
                FROM {mapping.target_schema}.{mapping.target_table}
                WHERE {where_clause}
            )
            """
        )
        return bool(self.db.execute(query, params).scalar_one())

    @staticmethod
    def _assert_identifier(value: str) -> None:
        if not IDENTIFIER_RE.match(value):
            raise ValueError("UNSAFE_IDENTIFIER")
