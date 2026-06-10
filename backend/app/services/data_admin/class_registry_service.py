from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.repositories.data_admin.class_registry_repository import ClassRegistryRepository


class ClassRegistryService:
    def __init__(self, db: Session):
        self.repository = ClassRegistryRepository(db)

    def list_classes(self) -> dict[str, Any]:
        classes, state = self.repository.list_classes()
        return {
            "status": "DB_EXECUTION_PENDING" if state.db_execution_pending else "OK",
            "count": len(classes),
            "data": classes,
            "metadata": {
                "registry_source": state.registry_source,
                "db_execution_pending": state.db_execution_pending,
                "warning": state.warning,
            },
        }

    def get_class(self, class_code: str) -> dict[str, Any]:
        class_row, state = self.repository.get_class(class_code)
        return {
            "status": "DB_EXECUTION_PENDING" if state.db_execution_pending else "OK",
            "data": class_row,
            "metadata": {
                "registry_source": state.registry_source,
                "db_execution_pending": state.db_execution_pending,
                "warning": state.warning,
            },
        }

    def get_class_schema(self, class_code: str) -> dict[str, Any]:
        fields, state = self.repository.get_class_schema(class_code)
        return {
            "status": "DB_EXECUTION_PENDING" if state.db_execution_pending else "OK",
            "class_code": class_code,
            "count": len(fields),
            "data": fields,
            "metadata": {
                "registry_source": state.registry_source,
                "db_execution_pending": state.db_execution_pending,
                "warning": state.warning,
            },
        }

    def get_class_records(
        self,
        class_code: str,
        *,
        limit: int,
        offset: int,
        filters: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        result = self.repository.get_class_records(class_code, limit=limit, offset=offset, filters=filters)
        return {
            "status": "DB_EXECUTION_PENDING" if result.db_execution_pending else "OK",
            "class_code": class_code,
            "count": len(result.rows),
            "limit": min(max(limit, 1), self.repository.MAX_PAGE_SIZE),
            "offset": max(offset, 0),
            "data": result.rows,
            "metadata": {
                "db_execution_pending": result.db_execution_pending,
                "warning": result.warning,
                "source_schema": result.source_schema,
                "source_name": result.source_name,
                "source_kind": result.source_kind,
                "filters": filters or {},
                "total_count": result.total_count,
            },
        }

    def get_class_count(self, class_code: str) -> dict[str, Any]:
        count, state = self.repository.get_class_count(class_code)
        return {
            "status": "DB_EXECUTION_PENDING" if state.db_execution_pending else "OK",
            "class_code": class_code,
            "count": count,
            "metadata": {
                "registry_source": state.registry_source,
                "db_execution_pending": state.db_execution_pending,
                "warning": state.warning,
            },
        }
