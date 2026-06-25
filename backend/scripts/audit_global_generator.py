"""
Générateur automatisé d'Audit Base de Données (SAD Sebou - abh_sebou_070426)
Génère le rapport Markdown et JSON attendu en respectant un cadre strict READ-ONLY.
"""
import io, sys, json, re
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import psycopg2
from psycopg2.extras import RealDictCursor

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
DB_CONFIG = {
    "host": "127.0.0.1",
    "port": 5432,
    "dbname": "abh_sebou_070426",
    "user": "postgres",
    "password": "c4e@test@2025"
}

MD_OUTPUT = "c:/dev/WQDSS/repo_git/docs/audit_abh_sebou_070426_complet.md"
JSON_OUTPUT = "c:/dev/WQDSS/repo_git/docs/audit_abh_sebou_070426_summary.json"

# -----------------------------------------------------------------------------
# Utilitaires d'inférence
# -----------------------------------------------------------------------------
def inferer_famille(table_name):
    t = table_name.lower()
    if t.startswith("mesures_"): return "mesures"
    if t.startswith("inv_") or t.startswith("sources_"): return "inventaire"
    if t.startswith("infra_"): return "infrastructure"
    if t.startswith("geo_") or t.startswith("spatial_"): return "geo"
    if t.startswith("adm_"): return "administratif"
    if t.startswith("ref_"): return "referentiel"
    return "autre"

def extraire_roles_colonnes(columns):
    """Infère les rôles probables d'après le nom et type de colonne."""
    roles = {
        "id": None,
        "station": None,
        "date": None,
        "parametre": None,
        "valeur": None,
        "unite": None,
        "geom": None
    }
    for col in columns:
        c = col['column_name'].lower()
        t = col['data_type'].lower()
        
        # ID
        if c == 'id' or c.endswith('_id') and not roles["id"]:
            roles["id"] = c
        
        # Station / Source
        if any(x in c for x in ['station', 'ire_station', 'code_station', 'source', 'ire_source', 'barrage']) and not roles["station"]:
            roles["station"] = c
            
        # Date / Temps
        if any(x in t for x in ['date', 'time', 'timestamp']) or any(x in c for x in ['date', 'temps', 'moment', 'annee', 'mois']):
            if not roles["date"]: roles["date"] = c
            
        # Paramètre
        if any(x in c for x in ['param', 'qualite', 'variable']):
            if not roles["parametre"]: roles["parametre"] = c
            
        # Valeur
        if any(x in t for x in ['numeric', 'real', 'double precision', 'float', 'integer']) and any(x in c for x in ['valeur', 'val_', 'debit', 'precip', 'niveau']):
            if not roles["valeur"]: roles["valeur"] = c
            
        # Unité
        if 'unit' in c:
            if not roles["unite"]: roles["unite"] = c
            
        # Geometrie
        if any(x in t for x in ['user-defined', 'geometry', 'geography']) or any(x in c for x in ['geom', 'x', 'y', 'lat', 'lon']):
            if not roles["geom"]: roles["geom"] = c

    return roles

def safe_query(conn, sql, params=None):
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            if cur.description:
                return cur.fetchall()
            return []
    except Exception as e:
        conn.rollback() # Important
        return None

# -----------------------------------------------------------------------------
# Process principal
# -----------------------------------------------------------------------------
def main():
    print("Connexion à la base...")
    conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    conn.set_session(readonly=True, autocommit=True)

    print("Récupération des tables du schéma public...")
    tables_query = safe_query(conn, "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'")
    table_names = [r['table_name'] for r in tables_query]
    print(f"{len(table_names)} tables trouvées.")

    results = {}
    fiches_md = []

    # TRI pour respecter la priorité: mesures_, inv_, infra_, geo_
    def priority_sort(name):
        f = inferer_famille(name)
        priorities = {"mesures": 1, "inventaire": 2, "infrastructure": 3, "geo": 4, "administratif": 5, "referentiel": 6, "autre": 7}
        return (priorities.get(f, 99), name)
    
    table_names.sort(key=priority_sort)

    for i, t_name in enumerate(table_names):
        print(f"Audit ({i+1}/{len(table_names)}): {t_name} ...")
        famille = inferer_famille(t_name)
        
        # 1. Structure
        cols_query = safe_query(conn, f"SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name='{t_name}' ORDER BY ordinal_position")
        columns = cols_query if cols_query else []
        roles = extraire_roles_colonnes(columns)
        
        # 2. Base metrics
        count_res = safe_query(conn, f"SELECT COUNT(*) as cnt FROM public.{t_name}")
        total_rows = count_res[0]['cnt'] if count_res else 0
        
        table_info = {
            "name": t_name,
            "famille": famille,
            "total_rows": total_rows,
            "columns_count": len(columns),
            "roles": roles,
            "null_rates": {},
            "distinct_stations": 0,
            "distinct_params": 0,
            "date_min": None,
            "date_max": None,
            "doublons_metier": 0,
            "sample_distincts": {},
            "action_reco": "Garder - Valider"
        }

        if total_rows > 0:
            # Taux de Null sur colonnes d'intérêt
            for role, col in roles.items():
                if col:
                    sql_null = f"SELECT COUNT(*) as null_cnt FROM public.{t_name} WHERE \"{col}\" IS NULL"
                    res_null = safe_query(conn, sql_null)
                    if res_null:
                        pct = round(100.0 * res_null[0]['null_cnt'] / total_rows, 2)
                        table_info['null_rates'][col] = f"{pct}%"
            
            # Min/Max Date
            if roles['date'] and columns:
                # check if data_type allows min/max easily
                d_type = [c['data_type'] for c in columns if c['column_name']==roles['date']][0]
                if 'timestamp' in d_type or 'date' in d_type:
                    res_d = safe_query(conn, f"SELECT MIN(\"{roles['date']}\") as dmin, MAX(\"{roles['date']}\") as dmax FROM public.{t_name}")
                    if res_d and res_d[0]['dmin']:
                        table_info['date_min'] = str(res_d[0]['dmin'])
                        table_info['date_max'] = str(res_d[0]['dmax'])
            
            # Distincts
            if roles['station']:
                r_st = safe_query(conn, f"SELECT COUNT(DISTINCT \"{roles['station']}\") as ds FROM public.{t_name}")
                if r_st: table_info['distinct_stations'] = r_st[0]['ds']
                # Sample stations si raisonnable (max 5)
                r_samp = safe_query(conn, f"SELECT DISTINCT \"{roles['station']}\"::text as st FROM public.{t_name} WHERE \"{roles['station']}\" IS NOT NULL LIMIT 5")
                if r_samp: table_info['sample_distincts']['stations_sample'] = [x['st'] for x in r_samp]

            if roles['parametre']:
                r_pa = safe_query(conn, f"SELECT COUNT(DISTINCT \"{roles['parametre']}\") as dp FROM public.{t_name}")
                if r_pa: table_info['distinct_params'] = r_pa[0]['dp']
                r_samp_p = safe_query(conn, f"SELECT DISTINCT \"{roles['parametre']}\"::text as dp FROM public.{t_name} WHERE \"{roles['parametre']}\" IS NOT NULL LIMIT 5")
                if r_samp_p: table_info['sample_distincts']['params_sample'] = [x['dp'] for x in r_samp_p]

            # Doublons (Business Key inferée)
            bkeys = []
            if roles['station']: bkeys.append(f"\"{roles['station']}\"")
            if roles['date']: bkeys.append(f"\"{roles['date']}\"")
            if roles['parametre']: bkeys.append(f"\"{roles['parametre']}\"")
            
            if len(bkeys) > 0:
                bk_str = ", ".join(bkeys)
                sql_dbl = f"SELECT SUM(cnt - 1) as tot_dbl FROM (SELECT {bk_str}, COUNT(*) as cnt FROM public.{t_name} GROUP BY {bk_str} HAVING COUNT(*) > 1) t"
                r_dbl = safe_query(conn, sql_dbl)
                if r_dbl and r_dbl[0]['tot_dbl'] is not None:
                    table_info['doublons_metier'] = int(r_dbl[0]['tot_dbl'])

            # Geometrie nulles
            if roles['geom']:
                r_g = safe_query(conn, f"SELECT COUNT(*) as gn FROM public.{t_name} WHERE \"{roles['geom']}\" IS NULL")
                if r_g: table_info['null_rates'][roles['geom']] = f"{round(100.0 * r_g[0]['gn']/total_rows, 1)}% (Geom Null)"

        # Heuristique d'action recommandée
        # (Très simple, on met en évidence ce qui a l'air vide ou completement redondant)
        if total_rows == 0:
            table_info['action_reco'] = "🔴 Violemment VIDE (À Dropper/Archiver)"
            statut = "Vide"
        elif 'doublons_metier' in table_info and table_info['doublons_metier'] > (total_rows * 0.1):
            table_info['action_reco'] = "🔴 Doublons massifs (>10%) - Nettoyage Urgent"
            statut = "Semi-traitée (Sale)"
        elif '_jr' in t_name or 'suivi_qualite' in t_name or t_name == "mesures_debit_sources":
            table_info['action_reco'] = "🟡 Probablement Brute (Legacy à fusionner)"
            statut = "Brute"
        elif famille == "mesures":
            table_info['action_reco'] = "🟢 Table Métier potentiellement valide. A confirmer via mapping."
            statut = "Normalisée (?)"
        else:
            table_info['action_reco'] = "🟢 Référentiel/Inventaire actif"
            statut = "Sain"
            
        table_info['statut'] = statut
        results[t_name] = table_info
        
        # Generation Fiche NIVEAU 2 pour Markdown
        fiche = f"### Table : `{t_name}`\n"
        fiche += f"**1. IDENTITE**\n"
        fiche += f"- Famille estimée : {famille.capitalize()} | {statut}\n"
        fiche += f"- Volumétrie : {total_rows} lignes | {len(columns)} colonnes\n\n"
        
        fiche += f"**2. STRUCTURE (Inférence de Rôles)**\n"
        for r, c in roles.items():
            if c: fiche += f"- Colonne **{r.capitalize()}** : `{c}`\n"
            
        fiche += f"\n**3. CONTENU REEL & 4. QUALITE**\n"
        if total_rows == 0:
            fiche += "- *Table totalement vide.*\n"
        else:
            if table_info['date_min'] and table_info['date_max']:
                fiche += f"- **Période calendaire** : {table_info['date_min']} -> {table_info['date_max']}\n"
            if table_info['distinct_stations'] > 0:
                fiche += f"- **Stations distinctes** : {table_info['distinct_stations']} (Echantillon: {table_info['sample_distincts'].get('stations_sample', [])})\n"
            if table_info['distinct_params'] > 0:
                fiche += f"- **Paramètres distincts** : {table_info['distinct_params']} (Echantillon: {table_info['sample_distincts'].get('params_sample', [])})\n"
            fiche += f"- **Taux de Nulls identifiés** : {table_info['null_rates']}\n"
            if len([x for x in [roles['station'], roles['date'], roles['parametre']] if x]) > 0:
                fiche += f"- **Conflits de doublons (Station + Date + Paramètre probables)** : {table_info['doublons_metier']} conflits\n"
                
        fiche += f"\n**5. & 6. SYNTHESE METIER / ACTION REQUISE**\n"
        fiche += f"> **Recommandation SAD :** {table_info['action_reco']}\n\n"
        fiche += "---\n"
        
        fiches_md.append(fiche)

    conn.close()
    
    print("Ecriture du rapport Markdown (docs/audit_abh_sebou_070426_complet.md)...")
    with open(MD_OUTPUT, "w", encoding="utf-8") as f:
        # NIVEAU 1
        f.write("# Audit Extensif Base SAD Sebou (`abh_sebou_070426`)\n")
        f.write(f"*Généré automatiquement le {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
        f.write("## NIVEAU 1 — Vue d'ensemble\n\n")
        f.write("Aperçu quantitatif et qualitatif global de la base de données. L'ordonnancement respecte les priorités (Mesures, Inventaires, Infra...).\n\n")
        
        f.write("| Schema | Table | Famille Estimée | Nb Lignes | Statut Rapide | Action Principale |\n")
        f.write("|---|---|---|---|---|---|\n")
        for t_name, info in results.items():
            f.write(f"| `public` | `{t_name}` | {info['famille']} | {info['total_rows']} | {info['statut']} | {info['action_reco']} |\n")
        
        f.write("\n\n## NIVEAU 2 — Fiches détaillées table par table\n\n")
        for fiche in fiches_md:
            f.write(fiche)
            
        # NIVEAU 3
        f.write("\n## NIVEAU 3 — Conclusions Globales (Pré-généré)\n\n")
        f.write("### Tables vides à PURGER / IGNORER\n")
        for t_name, info in results.items():
            if info['total_rows'] == 0: f.write(f"- `{t_name}`\n")
            
        f.write("\n### Tables Brutes identifiées (Potentiel Legacy/Archives)\n")
        for t_name, info in results.items():
            if "Brute" in info['statut'] or "suivi_" in t_name or "_jr" in t_name: f.write(f"- `{t_name}`\n")

        f.write("\n### Tables avec des doublons critiques nécessitant assainissement\n")
        for t_name, info in results.items():
            if info['doublons_metier'] > 0: f.write(f"- `{t_name}` ({info['doublons_metier']} doublons)\n")
            
        f.write("\n> La décision d'arquiver formellement ces tables en legacy revient désormais au chef de produit WQDSS via action des scripts métiers appropriés.\n")

    print("Ecriture de l'export JSON (docs/audit_abh_sebou_070426_summary.json)...")
    with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
        json.dump({"date_audit": datetime.now().isoformat(), "tables_audit": results}, f, indent=2, ensure_ascii=False)

    print("TERMINE AVEC SUCCES.")

if __name__ == "__main__":
    main()
