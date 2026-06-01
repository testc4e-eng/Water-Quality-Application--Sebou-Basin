import psycopg2

conn = psycopg2.connect(
    host='127.0.0.1', port=5432, dbname='abh_sad',
    user='postgres', password='c4e@test@2025'
)
cur = conn.cursor()

print("=== Aperçu de la Nodification (Phase D.1B) - Version UnaryUnion ===")

try:
    cur.execute("DROP TABLE IF EXISTS geo_work.reseau_hydro_edges_noded_preview CASCADE")
    cur.execute("""
        CREATE TABLE geo_work.reseau_hydro_edges_noded_preview AS 
        WITH unioned AS (
            SELECT ST_UnaryUnion(ST_Collect(geom)) as geom 
            FROM geo.reseau_hydrographique
            WHERE ST_GeometryType(geom) IN ('ST_LineString', 'ST_MultiLineString')
        ), 
        dumped AS (
            SELECT (ST_Dump(geom)).geom as geom 
            FROM unioned
        ) 
        SELECT 
            row_number() OVER () as edge_id, 
            geom,
            ST_Length(geom) as length_m
        FROM dumped
    """)
    
    cur.execute("SELECT COUNT(*) FROM geo_work.reseau_hydro_edges_noded_preview")
    new_count = cur.fetchone()[0]
    print(f"  Nouveau nombre d'arêtes après UnaryUnion: {new_count}")

except Exception as e:
    print(f"  ERREUR: {e}")

conn.commit()
conn.close()
