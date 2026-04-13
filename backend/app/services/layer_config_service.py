from __future__ import annotations

from typing import Any

from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.layer_config import LayerConfigCreate, LayerConfigResponse, LayerConfigUpdate


class LayerConfigService:
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def _to_response(row: Any) -> LayerConfigResponse:
        return LayerConfigResponse(
            id=row["id"],
            layer_name=row["layer_name"],
            geometry_type=row["geometry_type"],
            style_config=row["style_config"],
            popup_config=row["popup_config"],
            is_active=row["is_active"],
            created_by=row["created_by"],
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )

    def get_all(self, active_only: bool = True) -> list[LayerConfigResponse]:
        sql = """
            SELECT id, layer_name, geometry_type, style_config, popup_config, is_active, created_by, created_at, updated_at
            FROM sad.layer_configs
        """
        params: dict[str, Any] = {}
        if active_only:
            sql += " WHERE is_active = true"
        sql += " ORDER BY layer_name"
        rows = self.db.execute(text(sql), params).mappings().all()
        return [self._to_response(row) for row in rows]

    def get_by_name(self, layer_name: str, active_only: bool = True) -> LayerConfigResponse | None:
        sql = """
            SELECT id, layer_name, geometry_type, style_config, popup_config, is_active, created_by, created_at, updated_at
            FROM sad.layer_configs
            WHERE layer_name = :layer_name
        """
        params: dict[str, Any] = {"layer_name": layer_name}
        if active_only:
            sql += " AND is_active = true"
        row = self.db.execute(text(sql), params).mappings().first()
        if not row:
            return None
        return self._to_response(row)

    def create(self, payload: LayerConfigCreate, created_by: str | None = None) -> LayerConfigResponse:
        sql = text(
            """
            INSERT INTO sad.layer_configs (layer_name, geometry_type, style_config, popup_config, is_active, created_by)
            VALUES (:layer_name, :geometry_type, CAST(:style_config AS jsonb), CAST(:popup_config AS jsonb), true, :created_by)
            RETURNING id, layer_name, geometry_type, style_config, popup_config, is_active, created_by, created_at, updated_at
            """
        )
        try:
            row = self.db.execute(
                sql,
                {
                    "layer_name": payload.layer_name,
                    "geometry_type": payload.geometry_type,
                    "style_config": payload.style_config.model_dump_json(),
                    "popup_config": payload.popup_config.model_dump_json(),
                    "created_by": created_by,
                },
            ).mappings().first()
            self.db.commit()
        except Exception as exc:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Unable to create layer config: {exc}") from exc

        if not row:
            raise HTTPException(status_code=500, detail="Layer config creation failed")
        return self._to_response(row)

    def update(self, layer_name: str, payload: LayerConfigUpdate) -> LayerConfigResponse:
        sql = text(
            """
            UPDATE sad.layer_configs
            SET
                geometry_type = :geometry_type,
                style_config = CAST(:style_config AS jsonb),
                popup_config = CAST(:popup_config AS jsonb),
                is_active = true,
                updated_at = NOW()
            WHERE layer_name = :layer_name
            RETURNING id, layer_name, geometry_type, style_config, popup_config, is_active, created_by, created_at, updated_at
            """
        )
        row = self.db.execute(
            sql,
            {
                "layer_name": layer_name,
                "geometry_type": payload.geometry_type,
                "style_config": payload.style_config.model_dump_json(),
                "popup_config": payload.popup_config.model_dump_json(),
            },
        ).mappings().first()

        if not row:
            self.db.rollback()
            raise HTTPException(status_code=404, detail=f"Layer '{layer_name}' not found")

        self.db.commit()
        return self._to_response(row)

    def soft_delete(self, layer_name: str) -> None:
        row = self.db.execute(
            text(
                """
                UPDATE sad.layer_configs
                SET is_active = false, updated_at = NOW()
                WHERE layer_name = :layer_name
                RETURNING id
                """
            ),
            {"layer_name": layer_name},
        ).first()

        if not row:
            self.db.rollback()
            raise HTTPException(status_code=404, detail=f"Layer '{layer_name}' not found")

        self.db.commit()
