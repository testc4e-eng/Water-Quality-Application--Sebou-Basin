from __future__ import annotations

from dataclasses import dataclass
from time import perf_counter
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session


EXCLUDED_PARAMETER_CODES = ("H_G", "PTD", "PTP", "MD", "FM", "F_M_MES", "MO_METAL")
EXCLUDED_PARAMETER_CODES_SQL = ", ".join(f"'{code}'" for code in EXCLUDED_PARAMETER_CODES)


@dataclass(frozen=True)
class ApiViewQueryResult:
    rows: list[dict[str, Any]]
    total_count: int
    elapsed_ms: float


class ApiViewsRepository:
    """Read-only repository for whitelisted SQL exposure views in schema api."""

    ALLOWED_VIEWS: dict[str, str] = {
        "metaux": "api.v_qualite_metaux",
        "chimie_minerale": "api.v_qualite_chimie_minerale",
        "physicochimie": "api.v_qualite_physicochimie",
        "pollution_organique": "api.v_qualite_pollution_organique",
    }

    BASE_COLUMNS = (
        "source_table",
        "support_type",
        "support_id",
        "support_nom",
        "date_mesure",
        "parametre_ref_id",
        "code_parametre",
        "libelle_parametre",
        "unite_reference",
        "valeur_num",
        "valeur_raw",
        "qa_status",
        "geo_status",
        "source_row_id",
        "campagne_id",
        "ingestion_batch_id",
    )

    def __init__(self, db: Session):
        self.db = db

    @classmethod
    def resolve_view(cls, view_key: str) -> str:
        try:
            return cls.ALLOWED_VIEWS[view_key]
        except KeyError as exc:
            raise ValueError(f"View key is not whitelisted: {view_key}") from exc

    def query_view(
        self,
        view_key: str,
        *,
        date_start: str | None = None,
        date_end: str | None = None,
        support_type: str | None = None,
        support_id: str | None = None,
        code_parametre: str | None = None,
        qa_status: str | None = None,
        geo_status: str | None = None,
        limit: int = 500,
        offset: int = 0,
        include_geom: bool = False,
    ) -> ApiViewQueryResult:
        view_name = self.resolve_view(view_key)
        safe_limit = min(max(limit, 1), 5000)
        safe_offset = max(offset, 0)

        where_clauses = [
            f"code_parametre NOT IN ({EXCLUDED_PARAMETER_CODES_SQL})",
        ]
        params: dict[str, Any] = {
            "limit": safe_limit,
            "offset": safe_offset,
        }

        if date_start:
            where_clauses.append("date_mesure >= :date_start")
            params["date_start"] = date_start
        if date_end:
            where_clauses.append("date_mesure <= :date_end")
            params["date_end"] = date_end
        if support_type:
            where_clauses.append("support_type = :support_type")
            params["support_type"] = support_type
        if support_id:
            where_clauses.append("support_id = :support_id")
            params["support_id"] = support_id
        if code_parametre:
            where_clauses.append("code_parametre = :code_parametre")
            params["code_parametre"] = code_parametre
        if qa_status:
            where_clauses.append("qa_status = :qa_status")
            params["qa_status"] = qa_status
        if geo_status:
            where_clauses.append("geo_status = :geo_status")
            params["geo_status"] = geo_status

        where_sql = " AND ".join(where_clauses)
        geom_expr = "ST_AsGeoJSON(geom)::jsonb AS geom" if include_geom else "NULL::jsonb AS geom"
        select_columns = ", ".join(self.BASE_COLUMNS)

        count_sql = text(f"SELECT count(*)::int AS total_count FROM {view_name} WHERE {where_sql}")
        data_sql = text(
            f"""
            SELECT {select_columns}, {geom_expr}
            FROM {view_name}
            WHERE {where_sql}
            ORDER BY date_mesure DESC NULLS LAST, support_id, code_parametre
            LIMIT :limit OFFSET :offset
            """
        )

        started = perf_counter()
        total_count = int(self.db.execute(count_sql, params).scalar() or 0)
        rows = [dict(row) for row in self.db.execute(data_sql, params).mappings().all()]
        elapsed_ms = round((perf_counter() - started) * 1000, 2)

        return ApiViewQueryResult(rows=rows, total_count=total_count, elapsed_ms=elapsed_ms)
