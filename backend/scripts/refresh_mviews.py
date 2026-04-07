"""
Refresh performance materialized views.

Usage:
  C:\\micromamba\\envs\\sad_backend\\python.exe backend\\scripts\\refresh_mviews.py --note "scheduled 6h"
"""

from __future__ import annotations

import argparse
import os
import sys
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine, text


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--note", default="manual refresh", help="Optional note stored in metadata.mv_refresh_status")
    args = parser.parse_args()

    load_dotenv("c:/dev/WQDSS/repo_git/backend/.env")

    user = os.getenv("DB_USER")
    password = quote_plus(os.getenv("DB_PASS", ""))
    host = os.getenv("DB_HOST", "127.0.0.1")
    port = os.getenv("DB_PORT", "5432")
    dbname = os.getenv("DB_NAME")

    if not user or not dbname:
        print("Missing DB env vars (DB_USER/DB_NAME).")
        return 1

    url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}"
    engine = create_engine(url, pool_pre_ping=True)

    try:
        with engine.begin() as conn:
            conn.execute(text("select metadata.refresh_perf_mviews(:note)"), {"note": args.note})
        print("Materialized views refreshed successfully.")
        return 0
    except Exception as exc:  # noqa: BLE001
        print(f"Refresh failed: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())

