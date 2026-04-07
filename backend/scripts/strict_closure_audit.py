"""
Strict closure audit for critical deliverables.

Checks:
- required API views existence
- required observatory endpoints reachable (if backend running)
- popup rules table + row count
- hierarchy listing health
- core metier tables not directly exposed in api (informative gap list)
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import dataclass, asdict
from urllib import request, error

from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


REQUIRED_API_VIEWS = [
    "v_hierarchie_metier_listing",
    "v_meteo_precipitation_journalier_qa",
    "v_meteo_evaporation_journalier_qa",
    "v_hydro_debit_journalier_qa",
    "v_hydro_niveau_barrage_journalier",
    "v_qualite_riviere_mesures",
    "v_qualite_sebou_mesures",
    "v_suivi_qualite_barrage_garde_hebdo",
    "v_source_pollution_prelevement",
    "v_swat_qualite_subbasin_consolide",
    "v_wasp_qualite_segment_consolide",
]

CORE_BUSINESS_TABLES = [
    ("meteo", "mesure_precipitation"),
    ("meteo", "mesure_evaporation"),
    ("meteo", "mesure_temperature"),
    ("hydro", "mesure_debit"),
    ("hydro", "mesure_barrage"),
    ("qualite", "mesure_qualite_riviere"),
    ("qualite", "mesure_qualite_sebou"),
    ("qualite", "mesure_qualite_barrage"),
    ("qualite", "mesure_qualite_nappe"),
]


@dataclass
class Check:
    name: str
    status: str
    detail: str


def http_ok(url: str) -> tuple[bool, str]:
    try:
        req = request.Request(url, method="GET")
        with request.urlopen(req, timeout=5) as resp:
            return True, f"HTTP {resp.status}"
    except Exception as e:  # noqa: BLE001
        return False, str(e)


def api_json_ok(url: str) -> tuple[bool, str]:
    try:
        req = request.Request(url, method="GET")
        with request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            json.loads(body)
            return True, f"HTTP {resp.status}"
    except Exception as e:  # noqa: BLE001
        return False, str(e)


def run(base_url: str) -> dict:
    checks: list[Check] = []
    gaps: list[dict] = []

    with engine_climate.connect() as conn:
        # 1) required API views
        existing = {
            r[0]
            for r in conn.execute(
                text(
                    """
                    select table_name
                    from information_schema.views
                    where table_schema = 'api'
                    """
                )
            )
        }
        missing = [v for v in REQUIRED_API_VIEWS if v not in existing]
        checks.append(
            Check(
                name="api_required_views",
                status="OK" if not missing else "KO",
                detail="all present" if not missing else f"missing: {', '.join(missing)}",
            )
        )

        # 2) popup_rules table
        popup_exists = conn.execute(
            text(
                """
                select exists(
                  select 1
                  from information_schema.tables
                  where table_schema='metadata' and table_name='popup_rules_config'
                )
                """
            )
        ).scalar()
        if popup_exists:
            cnt = conn.execute(text("select count(*) from metadata.popup_rules_config")).scalar()
            checks.append(
                Check(
                    name="metadata.popup_rules_config",
                    status="OK",
                    detail=f"exists, rows={cnt}",
                )
            )
        else:
            checks.append(
                Check(
                    name="metadata.popup_rules_config",
                    status="KO",
                    detail="table missing",
                )
            )

        # 3) hierarchy health
        try:
            h = conn.execute(
                text(
                    """
                    select theme, count(*) as n
                    from api.v_hierarchie_metier_listing
                    group by theme
                    order by theme
                    """
                )
            ).fetchall()
            detail = "; ".join([f"{t}:{n}" for t, n in h]) if h else "empty view"
            checks.append(
                Check(
                    name="api.v_hierarchie_metier_listing",
                    status="OK" if h else "KO",
                    detail=detail,
                )
            )
        except Exception as e:  # noqa: BLE001
            checks.append(
                Check(
                    name="api.v_hierarchie_metier_listing",
                    status="KO",
                    detail=str(e),
                )
            )

        # 4) core tables coverage by api view dependencies
        view_defs = conn.execute(
            text(
                """
                select c.relname as view_name, pg_get_viewdef(c.oid, true) as view_def
                from pg_class c
                join pg_namespace n on n.oid = c.relnamespace
                where c.relkind='v' and n.nspname='api'
                """
            )
        ).fetchall()
        coverage: dict[tuple[str, str], set[str]] = {}
        for view_name, view_def in view_defs:
            low = (view_def or "").lower()
            for s, t in CORE_BUSINESS_TABLES:
                token = f"{s}.{t}".lower()
                if token in low:
                    coverage.setdefault((s, t), set()).add(view_name)
        for s, t in CORE_BUSINESS_TABLES:
            views = sorted(list(coverage.get((s, t), set())))
            if not views:
                gaps.append({"schema": s, "table": t, "api_views": []})

        checks.append(
            Check(
                name="core_tables_api_coverage",
                status="OK" if not gaps else "WARN",
                detail="all covered" if not gaps else f"uncovered={len(gaps)}",
            )
        )

    # 5) backend live + key endpoints
    live, live_detail = http_ok(f"{base_url.replace('/api/v1','')}/health")
    checks.append(Check(name="backend_health", status="OK" if live else "KO", detail=live_detail))

    if live:
        for ep in [
            "/observatory/popup-rules",
            "/observatory/popup-rules/list",
            "/observatory/catalog/themes",
        ]:
            ok, detail = api_json_ok(f"{base_url}{ep}")
            checks.append(
                Check(
                    name=f"endpoint {ep}",
                    status="OK" if ok else "KO",
                    detail=detail,
                )
            )

    overall = "OK"
    if any(c.status == "KO" for c in checks):
        overall = "KO"
    elif any(c.status == "WARN" for c in checks):
        overall = "WARN"

    return {
        "overall": overall,
        "checks": [asdict(c) for c in checks],
        "gaps": gaps,
    }


def main() -> int:
    load_dotenv()
    # Fallback mapping for environments still using DB_* keys.
    os.environ.setdefault("CLIMATE_DB_USER", os.getenv("DB_USER", ""))
    os.environ.setdefault("CLIMATE_DB_PASS", os.getenv("DB_PASS", ""))
    os.environ.setdefault("CLIMATE_DB_HOST", os.getenv("DB_HOST", ""))
    os.environ.setdefault("CLIMATE_DB_PORT", os.getenv("DB_PORT", ""))
    os.environ.setdefault("CLIMATE_DB_NAME", os.getenv("DB_NAME", ""))
    from app.db.climate_database import engine_climate, text  # noqa: WPS433,E402

    globals()["engine_climate"] = engine_climate
    globals()["text"] = text

    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:8000/api/v1")
    parser.add_argument("--out", default="c:/dev/WQDSS/repo_git/backend/audit_results_strict.json")
    args = parser.parse_args()

    result = run(args.base_url.rstrip("/"))
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"\nWritten: {args.out}")
    return 0 if result["overall"] != "KO" else 1


if __name__ == "__main__":
    sys.exit(main())
