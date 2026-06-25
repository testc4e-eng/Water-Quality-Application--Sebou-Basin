from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class ExposureResponse(BaseModel):
    status: str
    count: int
    filters: dict[str, Any]
    data: list[dict[str, Any]]
    metadata: dict[str, Any]
