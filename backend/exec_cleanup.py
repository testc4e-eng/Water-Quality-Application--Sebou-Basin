import psycopg2

conn = psycopg2.connect(
    host='127.0.0.1', port=5432, dbname='abh_sad',
    user='postgres', password='c4e@test@2025'
)
cur = conn.cursor()

print("=== ÉTAPE 4 : Exécution du Cleanup Topologique ===")

try:
    # 1. Création de la table NODED réelle (si absente)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS geo_work.reseau_hydro_edges_noded AS 
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
    print("  Table reseau_hydro_edges_noded prête.")

    # 2. Exécution du Cleanup (07_sql_cleanup_prepare_A_VALIDER.sql)
    cur.execute("DROP TABLE IF EXISTS geo_work.reseau_hydro_edges_final CASCADE")
    cur.execute("""
        CREATE TABLE geo_work.reseau_hydro_edges_final (
            edge_id serial PRIMARY KEY,
            source int,
            target int,
            geom geometry(LineString, 26191),
            length_m float,
            flow_status text DEFAULT 'FLOW_PROBABLE',
            component_id int,
            qa_status text,
            is_cycle boolean DEFAULT false,
            is_micro_segment boolean DEFAULT false
        )
    """)
    
    # Import avec filtre > 1.0m
    cur.execute("""
        INSERT INTO geo_work.reseau_hydro_edges_final (geom, length_m, qa_status)
        SELECT geom, ST_Length(geom), 'CLEANED'
        FROM geo_work.reseau_hydro_edges_noded
        WHERE ST_Length(geom) >= 1.0
    """)
    
    # Marquage micro-segments résiduels (1-5m)
    cur.execute("UPDATE geo_work.reseau_hydro_edges_final SET is_micro_segment = true WHERE length_m < 5.0")
    
    # Reconstruction de la Topologie via pgRouting
    print("  Reconstruction de la topologie (pgr_createTopology)...")
    cur.execute("SELECT pgr_createTopology('geo_work.reseau_hydro_edges_final', 0.1, 'geom', 'edge_id')")
    
    # Récupération des altitudes Z (nécessaire pour graph_builder)
    cur.execute("""
        UPDATE geo_work.reseau_hydro_edges_final n
        SET flow_status = 'FLOW_CONFIRMED'
        FROM geo.reseau_hydrographique s
        WHERE ST_Intersects(n.geom, s.geom)
          AND ST_Length(ST_Intersection(n.geom, s.geom)) > ST_Length(n.geom) * 0.9
          AND s."Z_Max" > s."Z_Min"
    """)

    conn.commit()
    print("  Cleanup terminé avec succès.")

except Exception as e:
    conn.rollback()
    print(f"  ERREUR CRITIQUE : {e}")

conn.close()
