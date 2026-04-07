#backend/app/api/v1/alerts.py
from fastapi import APIRouter
from app.db_raw import connection
from app.util_dbmeta import table_exists
import psycopg2.extras

router = APIRouter(prefix="/alerts")

@router.get("")
def list_alerts(limit: int = 50):
    if table_exists("alerts"):
        with connection() as cx, cx.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT id, station_id, date, type, message
                FROM alerts
                ORDER BY date DESC
                LIMIT %s
            """, (limit,))
            return cur.fetchall()  # -> liste de dicts déjà prête pour JSON

    return []  # pas de table alerts → liste vide
