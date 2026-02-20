# backend/app/routers/raw.py
from fastapi import APIRouter, Depends, HTTPException, Query, Response,Body
from sqlalchemy.orm import Session
from sqlalchemy import text
from io import StringIO, BytesIO
import pandas as pd
from app.db.session import SessionLocal

router = APIRouter(prefix="/raw", tags=["raw"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🧾 1️⃣ Liste des tables disponibles
@router.get("/tables")
def list_raw_tables(db: Session = Depends(get_db)):
    sql = text("""
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name;
    """)
    rows = db.execute(sql).fetchall()
    return [{"schema": r.table_schema, "table": r.table_name} for r in rows]


# 📖 2️⃣ Lecture d'une table
@router.get("/data/{schema}/{table}", summary="Lire le contenu brut d’une table")
def read_raw_table(
    schema: str,
    table: str,
    limit: int = Query(1000, ge=1, le=10000),
    db: Session = Depends(get_db),
):
    try:
        sql = text(f'SELECT * FROM "{schema}"."{table}" LIMIT :limit')
        rows = db.execute(sql, {"limit": limit}).mappings().all()
        return [dict(r) for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lecture : {e}")


# 📤 3️⃣ Export CSV ou Excel
@router.get("/export/{schema}/{table}")
def export_raw_table(
    schema: str,
    table: str,
    fmt: str = Query("csv", pattern="^(csv|xlsx)$"),
    limit: int = Query(10000, ge=1, le=100000),
    db: Session = Depends(get_db),
):
    sql = text(f'SELECT * FROM "{schema}"."{table}" LIMIT :limit')
    df = pd.read_sql(sql, db.bind, params={"limit": limit})

    if fmt == "csv":
        buffer = StringIO()
        df.to_csv(buffer, index=False)
        return Response(
            content=buffer.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{table}.csv"'},
        )

    buffer = BytesIO()
    with pd.ExcelWriter(buffer, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False)
    return Response(
        content=buffer.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{table}.xlsx"'},
    )


# ✏️ 4️⃣ Mise à jour
@router.put("/{schema}/{table}/{id}")
def update_row(
    schema: str,
    table: str,
    id: str,
    data: dict = Body(...),
    db: Session = Depends(get_db)
):
    if not data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")

    try:
        cols = ", ".join([f'"{k}" = :{k}' for k in data.keys()])
        query = text(f'UPDATE "{schema}"."{table}" SET {cols} WHERE id = :id')
        db.execute(query, {**data, "id": id})
        db.commit()
        return {"status": "ok", "message": "Ligne mise à jour"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erreur update : {e}")









# 🗑️ 5️⃣ Suppression
@router.delete("/{schema}/{table}/{id}")
def delete_row(schema: str, table: str, id: str, db: Session = Depends(get_db)):
    try:
        query = text(f'DELETE FROM "{schema}"."{table}" WHERE id = :id')
        db.execute(query, {"id": id})
        db.commit()
        return {"status": "ok", "message": "Ligne supprimée"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erreur delete : {e}")


# ➕ 6️⃣ Création
@router.post("/{schema}/{table}")
def create_row(schema: str, table: str, data: dict, db: Session = Depends(get_db)):
    """
    Crée un nouvel enregistrement dans une table donnée.
    Vérifie les doublons et ignore les colonnes spéciales (geom, id...).
    """
    if not data:
        raise HTTPException(status_code=400, detail="Aucune donnée envoyée")

    try:
        clean_data = {k: (None if v in ["", None] else v) for k, v in data.items()}
        for field in ["id", "geom", "geometry", "the_geom", "shape"]:
            if field in clean_data:
                del clean_data[field]

        # 🔍 Vérification clé primaire ou champ unique
        # on récupère le nom de la clé primaire de la table
        pk_query = text(f"""
            SELECT a.attname
            FROM pg_index i
            JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            WHERE i.indrelid = '{schema}.{table}'::regclass AND i.indisprimary;
        """)
        pk_result = db.execute(pk_query).fetchone()
        if pk_result:
            pk = pk_result[0]
            if pk in clean_data:
                # Vérifie si cette valeur existe déjà
                check_query = text(f'SELECT 1 FROM "{schema}"."{table}" WHERE "{pk}" = :val LIMIT 1')
                exists = db.execute(check_query, {"val": clean_data[pk]}).fetchone()
                if exists:
                    raise HTTPException(
                        status_code=400,
                        detail=f"⚠️ Enregistrement déjà existant (clé primaire '{pk}' = {clean_data[pk]})"
                    )

        cols = ", ".join([f'"{k}"' for k in clean_data.keys()])
        vals = ", ".join([f":{k}" for k in clean_data.keys()])
        query = text(f'INSERT INTO "{schema}"."{table}" ({cols}) VALUES ({vals}) RETURNING *')
        result = db.execute(query, clean_data)
        db.commit()
        created = result.mappings().first()
        return {"status": "ok", "created": dict(created) if created else None}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Insertion échouée : {e}")
