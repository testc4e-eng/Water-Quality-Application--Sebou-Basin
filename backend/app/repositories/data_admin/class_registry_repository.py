from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import Any

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session


logger = logging.getLogger(__name__)

IDENTIFIER_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


@dataclass(frozen=True)
class RegistryQueryState:
    db_execution_pending: bool
    registry_source: str
    warning: str | None = None


@dataclass(frozen=True)
class ClassRecordsQueryResult:
    rows: list[dict[str, Any]]
    total_count: int
    source_schema: str
    source_name: str
    source_kind: str
    db_execution_pending: bool
    warning: str | None = None


FALLBACK_CLASS_REGISTRY: tuple[dict[str, Any], ...] = (
    {
        "class_code": "INFRA_STATION",
        "class_label": "Stations de mesure",
        "domain": "INFRA",
        "target_schema": "infra",
        "target_table": "stations_mesure",
        "exposure_view_schema": "api",
        "exposure_view_name": "v_station_dimension",
        "staging_schema": "staging",
        "staging_table": "raw_stations_abhs",
        "geometry_required": True,
        "temporal_required": False,
        "validation_level": "STANDARD",
        "editable": False,
        "ingestable": True,
        "realtime_capable": False,
        "owner_role": "DATA_MANAGER",
        "status": "ACTIVE",
    },
    {
        "class_code": "INFRA_BARRAGE",
        "class_label": "Barrages",
        "domain": "INFRA",
        "target_schema": "infra",
        "target_table": "barrages",
        "exposure_view_schema": "api",
        "exposure_view_name": "v_barrage_dimension",
        "staging_schema": "staging",
        "staging_table": "raw_barrages_abhs",
        "geometry_required": True,
        "temporal_required": False,
        "validation_level": "STANDARD",
        "editable": False,
        "ingestable": True,
        "realtime_capable": False,
        "owner_role": "DATA_MANAGER",
        "status": "ACTIVE",
    },
    {
        "class_code": "HYDRO_DEBIT",
        "class_label": "Mesures de debit",
        "domain": "HYDRO",
        "target_schema": "hydro",
        "target_table": "mesure_debit",
        "exposure_view_schema": None,
        "exposure_view_name": None,
        "staging_schema": "staging",
        "staging_table": "raw_mesures_debit_jr",
        "geometry_required": False,
        "temporal_required": True,
        "validation_level": "STANDARD",
        "editable": False,
        "ingestable": True,
        "realtime_capable": True,
        "owner_role": "DATA_MANAGER",
        "status": "ACTIVE",
    },
    {
        "class_code": "METEO_PRECIPITATION",
        "class_label": "Mesures de precipitation",
        "domain": "METEO",
        "target_schema": "meteo",
        "target_table": "mesure_precipitation",
        "exposure_view_schema": None,
        "exposure_view_name": None,
        "staging_schema": "staging",
        "staging_table": "raw_mesures_precipitations_jr_traitees",
        "geometry_required": False,
        "temporal_required": True,
        "validation_level": "STANDARD",
        "editable": False,
        "ingestable": True,
        "realtime_capable": True,
        "owner_role": "DATA_MANAGER",
        "status": "ACTIVE",
    },
    {
        "class_code": "QUALITE_RIVIERE",
        "class_label": "Qualite riviere",
        "domain": "QUALITE",
        "target_schema": "qualite",
        "target_table": "mesure_qualite_riviere",
        "exposure_view_schema": None,
        "exposure_view_name": None,
        "staging_schema": "staging",
        "staging_table": "raw_mesures_qualite_rivieres",
        "geometry_required": False,
        "temporal_required": True,
        "validation_level": "STANDARD",
        "editable": False,
        "ingestable": True,
        "realtime_capable": False,
        "owner_role": "DATA_MANAGER",
        "status": "ACTIVE",
    },
    {
        "class_code": "QUALITE_NAPPE",
        "class_label": "Qualite nappe",
        "domain": "QUALITE",
        "target_schema": "qualite",
        "target_table": "mesure_qualite_nappe",
        "exposure_view_schema": None,
        "exposure_view_name": None,
        "staging_schema": "staging",
        "staging_table": "raw_mesures_qualite_nappes",
        "geometry_required": False,
        "temporal_required": True,
        "validation_level": "STANDARD",
        "editable": False,
        "ingestable": True,
        "realtime_capable": False,
        "owner_role": "DATA_MANAGER",
        "status": "ACTIVE",
    },
    {
        "class_code": "QUALITE_BARRAGE",
        "class_label": "Qualite barrage",
        "domain": "QUALITE",
        "target_schema": "qualite",
        "target_table": "mesure_qualite_barrage",
        "exposure_view_schema": None,
        "exposure_view_name": None,
        "staging_schema": "staging",
        "staging_table": "raw_mesures_qualite_barrages",
        "geometry_required": False,
        "temporal_required": True,
        "validation_level": "STANDARD",
        "editable": False,
        "ingestable": True,
        "realtime_capable": False,
        "owner_role": "DATA_MANAGER",
        "status": "ACTIVE",
    },
    {
        "class_code": "POLLUTION_SITE",
        "class_label": "Sites pollution",
        "domain": "POLLUTION",
        "target_schema": "geo",
        "target_table": "ref_site_pollution",
        "exposure_view_schema": "api",
        "exposure_view_name": "v_pollution_sites",
        "staging_schema": "staging",
        "staging_table": "raw_idp_2024_src_pollution_globale",
        "geometry_required": True,
        "temporal_required": False,
        "validation_level": "STRICT",
        "editable": False,
        "ingestable": True,
        "realtime_capable": False,
        "owner_role": "SIG",
        "status": "ACTIVE",
    },
)


FALLBACK_FIELD_REGISTRY: dict[str, tuple[dict[str, Any], ...]] = {
    "INFRA_STATION": (
        {"field_name": "station_id", "field_label": "ID station", "data_type": "uuid", "display_order": 1},
        {"field_name": "code_station", "field_label": "Code station", "data_type": "text", "display_order": 2},
        {"field_name": "nom_station", "field_label": "Nom station", "data_type": "text", "display_order": 3},
        {"field_name": "type_station", "field_label": "Type station", "data_type": "text", "display_order": 4},
    ),
    "INFRA_BARRAGE": (
        {"field_name": "barrage_id", "field_label": "ID barrage", "data_type": "uuid", "display_order": 1},
        {"field_name": "nom_barrage", "field_label": "Nom barrage", "data_type": "text", "display_order": 2},
    ),
    "HYDRO_DEBIT": (
        {"field_name": "ire_station", "field_label": "Code station", "data_type": "text", "display_order": 1},
        {"field_name": "date_jr", "field_label": "Date", "data_type": "date", "display_order": 2},
        {"field_name": "valeur_m3s", "field_label": "Debit (m3/s)", "data_type": "numeric", "display_order": 3},
    ),
    "METEO_PRECIPITATION": (
        {"field_name": "ire_station", "field_label": "Code station", "data_type": "text", "display_order": 1},
        {"field_name": "date_jr", "field_label": "Date", "data_type": "date", "display_order": 2},
        {"field_name": "valeur_mm", "field_label": "Precipitation (mm)", "data_type": "numeric", "display_order": 3},
    ),
    "QUALITE_RIVIERE": (
        {"field_name": "ire_station", "field_label": "Code station", "data_type": "text", "display_order": 1},
        {"field_name": "temps", "field_label": "Date mesure", "data_type": "timestamp", "display_order": 2},
        {"field_name": "parametre_qualite", "field_label": "Parametre", "data_type": "text", "display_order": 3},
        {"field_name": "valeur", "field_label": "Valeur", "data_type": "numeric", "display_order": 4},
    ),
    "QUALITE_NAPPE": (
        {"field_name": "ire_station", "field_label": "Code station", "data_type": "text", "display_order": 1},
        {"field_name": "temps", "field_label": "Date mesure", "data_type": "timestamp", "display_order": 2},
        {"field_name": "parametre_qualite", "field_label": "Parametre", "data_type": "text", "display_order": 3},
        {"field_name": "valeur", "field_label": "Valeur", "data_type": "numeric", "display_order": 4},
    ),
    "QUALITE_BARRAGE": (
        {"field_name": "ire_station", "field_label": "Code station", "data_type": "text", "display_order": 1},
        {"field_name": "temps", "field_label": "Date mesure", "data_type": "timestamp", "display_order": 2},
        {"field_name": "parametre_qualite", "field_label": "Parametre", "data_type": "text", "display_order": 3},
        {"field_name": "valeur", "field_label": "Valeur", "data_type": "numeric", "display_order": 4},
    ),
    "POLLUTION_SITE": (
        {"field_name": "site_id", "field_label": "ID site", "data_type": "uuid", "display_order": 1},
        {"field_name": "site_code", "field_label": "Code site", "data_type": "text", "display_order": 2},
        {"field_name": "site_nom", "field_label": "Nom site", "data_type": "text", "display_order": 3},
    ),
}


class ClassRegistryRepository:
    MAX_PAGE_SIZE = 500

    def __init__(self, db: Session):
        self.db = db

    def list_classes(self) -> tuple[list[dict[str, Any]], RegistryQueryState]:
        registry_rows, state = self._load_registry_rows()
        return registry_rows, state

    def get_class(self, class_code: str) -> tuple[dict[str, Any], RegistryQueryState]:
        registry_rows, state = self._load_registry_rows()
        for row in registry_rows:
            if row["class_code"] == class_code:
                return row, state
        raise ValueError(f"Unknown class_code: {class_code}")

    def get_class_schema(self, class_code: str) -> tuple[list[dict[str, Any]], RegistryQueryState]:
        registry_row, state = self.get_class(class_code)
        if not state.db_execution_pending and self._table_exists("data_admin", "field_registry"):
            try:
                rows = self.db.execute(
                    text(
                        """
                        SELECT
                            field_name,
                            field_label,
                            data_type,
                            required,
                            editable,
                            ingestable,
                            validation_rule,
                            reference_source,
                            display_order
                        FROM data_admin.field_registry
                        WHERE class_code = :class_code
                        ORDER BY display_order, field_name
                        """
                    ),
                    {"class_code": class_code},
                ).mappings().all()
                if rows:
                    return [dict(row) for row in rows], state
            except SQLAlchemyError as exc:
                logger.warning("field_registry query failed for %s: %s", class_code, exc)

        source_schema, source_name, _ = self._resolve_read_source(registry_row)
        if not state.db_execution_pending and self._object_exists(source_schema, source_name):
            fields = self._load_columns_for_object(source_schema, source_name)
            if fields:
                return fields, state

        return list(FALLBACK_FIELD_REGISTRY.get(class_code, ())), state

    def get_class_records(
        self,
        class_code: str,
        *,
        limit: int,
        offset: int,
        filters: dict[str, Any] | None = None,
    ) -> ClassRecordsQueryResult:
        registry_row, state = self.get_class(class_code)
        source_schema, source_name, source_kind = self._resolve_read_source(registry_row)

        if state.db_execution_pending:
            return ClassRecordsQueryResult(
                rows=[],
                total_count=0,
                source_schema=source_schema,
                source_name=source_name,
                source_kind=source_kind,
                db_execution_pending=True,
                warning=state.warning,
            )

        if not self._object_exists(source_schema, source_name):
            return ClassRecordsQueryResult(
                rows=[],
                total_count=0,
                source_schema=source_schema,
                source_name=source_name,
                source_kind=source_kind,
                db_execution_pending=True,
                warning=f"Registered source object is missing: {source_schema}.{source_name}",
            )

        safe_limit = min(max(limit, 1), self.MAX_PAGE_SIZE)
        safe_offset = max(offset, 0)
        quoted_source = self._qualified_identifier(source_schema, source_name)
        order_sql = self._default_order_sql(source_schema, source_name)
        count_sql = text(f"SELECT COUNT(*)::int FROM {quoted_source}")
        data_sql = text(
            f"""
            SELECT *
            FROM {quoted_source}
            {order_sql}
            LIMIT :limit OFFSET :offset
            """
        )
        params = {"limit": safe_limit, "offset": safe_offset}
        rows = [dict(row) for row in self.db.execute(data_sql, params).mappings().all()]
        total_count = int(self.db.execute(count_sql).scalar() or 0)
        return ClassRecordsQueryResult(
            rows=rows,
            total_count=total_count,
            source_schema=source_schema,
            source_name=source_name,
            source_kind=source_kind,
            db_execution_pending=False,
            warning=None,
        )

    def get_class_count(self, class_code: str) -> tuple[int, RegistryQueryState]:
        records_result = self.get_class_records(class_code, limit=1, offset=0)
        state = RegistryQueryState(
            db_execution_pending=records_result.db_execution_pending,
            registry_source="code_seed" if records_result.db_execution_pending else "data_admin_or_seed",
            warning=records_result.warning,
        )
        return records_result.total_count, state

    def _load_registry_rows(self) -> tuple[list[dict[str, Any]], RegistryQueryState]:
        if not self._table_exists("data_admin", "data_class_registry"):
            return (
                [dict(row, db_execution_pending=True) for row in FALLBACK_CLASS_REGISTRY],
                RegistryQueryState(
                    db_execution_pending=True,
                    registry_source="code_seed",
                    warning="DB_EXECUTION_PENDING: data_admin.data_class_registry not available",
                ),
            )

        try:
            rows = self.db.execute(
                text(
                    """
                    SELECT
                        class_code,
                        class_label,
                        domain,
                        target_schema,
                        target_table,
                        exposure_view_schema,
                        exposure_view_name,
                        staging_schema,
                        staging_table,
                        geometry_required,
                        temporal_required,
                        validation_level,
                        editable,
                        ingestable,
                        realtime_capable,
                        owner_role,
                        status
                    FROM data_admin.data_class_registry
                    WHERE status = 'ACTIVE'
                    ORDER BY domain, class_code
                    """
                )
            ).mappings().all()
        except SQLAlchemyError as exc:
            logger.warning("data_class_registry query failed: %s", exc)
            return (
                [dict(row, db_execution_pending=True) for row in FALLBACK_CLASS_REGISTRY],
                RegistryQueryState(
                    db_execution_pending=True,
                    registry_source="code_seed",
                    warning=f"DB_EXECUTION_PENDING: registry query failed ({type(exc).__name__})",
                ),
            )

        if not rows:
            return (
                [dict(row, db_execution_pending=True) for row in FALLBACK_CLASS_REGISTRY],
                RegistryQueryState(
                    db_execution_pending=True,
                    registry_source="code_seed",
                    warning="DB_EXECUTION_PENDING: data_admin.data_class_registry is empty",
                ),
            )

        return (
            [dict(row, db_execution_pending=False) for row in rows],
            RegistryQueryState(
                db_execution_pending=False,
                registry_source="data_admin.data_class_registry",
                warning=None,
            ),
        )

    def _table_exists(self, schema: str, table: str) -> bool:
        try:
            row = self.db.execute(
                text(
                    """
                    SELECT 1
                    FROM information_schema.tables
                    WHERE table_schema = :schema AND table_name = :table
                    """
                ),
                {"schema": schema, "table": table},
            ).first()
            return row is not None
        except SQLAlchemyError as exc:
            logger.warning("table_exists failed for %s.%s: %s", schema, table, exc)
            return False

    def _view_exists(self, schema: str, view_name: str) -> bool:
        try:
            row = self.db.execute(
                text(
                    """
                    SELECT 1
                    FROM information_schema.views
                    WHERE table_schema = :schema AND table_name = :view_name
                    """
                ),
                {"schema": schema, "view_name": view_name},
            ).first()
            return row is not None
        except SQLAlchemyError as exc:
            logger.warning("view_exists failed for %s.%s: %s", schema, view_name, exc)
            return False

    def _object_exists(self, schema: str, object_name: str) -> bool:
        return self._table_exists(schema, object_name) or self._view_exists(schema, object_name)

    def _resolve_read_source(self, registry_row: dict[str, Any]) -> tuple[str, str, str]:
        exposure_schema = registry_row.get("exposure_view_schema")
        exposure_name = registry_row.get("exposure_view_name")
        if exposure_schema and exposure_name:
            return str(exposure_schema), str(exposure_name), "exposure_view"
        return str(registry_row["target_schema"]), str(registry_row["target_table"]), "target_table"

    def _load_columns_for_object(self, schema: str, object_name: str) -> list[dict[str, Any]]:
        try:
            rows = self.db.execute(
                text(
                    """
                    SELECT
                        column_name AS field_name,
                        column_name AS field_label,
                        data_type,
                        CASE WHEN is_nullable = 'NO' THEN true ELSE false END AS required,
                        false AS editable,
                        false AS ingestable,
                        NULL::text AS validation_rule,
                        NULL::text AS reference_source,
                        ordinal_position AS display_order
                    FROM information_schema.columns
                    WHERE table_schema = :schema
                      AND table_name = :object_name
                    ORDER BY ordinal_position
                    """
                ),
                {"schema": schema, "object_name": object_name},
            ).mappings().all()
            return [dict(row) for row in rows]
        except SQLAlchemyError as exc:
            logger.warning("column introspection failed for %s.%s: %s", schema, object_name, exc)
            return []

    def _default_order_sql(self, schema: str, object_name: str) -> str:
        pk_col = self._primary_key_column(schema, object_name)
        if pk_col:
            return f'ORDER BY "{pk_col}"'
        return ""

    def _primary_key_column(self, schema: str, object_name: str) -> str | None:
        try:
            row = self.db.execute(
                text(
                    """
                    SELECT a.attname
                    FROM pg_index i
                    JOIN pg_class c ON c.oid = i.indrelid
                    JOIN pg_namespace n ON n.oid = c.relnamespace
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indisprimary
                      AND n.nspname = :schema
                      AND c.relname = :object_name
                    LIMIT 1
                    """
                ),
                {"schema": schema, "object_name": object_name},
            ).first()
            return str(row[0]) if row else None
        except SQLAlchemyError:
            return None

    def _qualified_identifier(self, schema: str, object_name: str) -> str:
        return f'{self._quote_identifier(schema)}.{self._quote_identifier(object_name)}'

    @staticmethod
    def _quote_identifier(value: str) -> str:
        if not IDENTIFIER_RE.match(value):
            raise ValueError(f"Unsafe identifier: {value}")
        return f'"{value}"'
