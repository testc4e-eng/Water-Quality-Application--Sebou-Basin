import sys, json, io
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

DB_CONFIG = {
    "host": "127.0.0.1",
    "port": 5432,
    "dbname": "abh_sebou_070426",
    "user": "postgres",
    "password": "c4e@test@2025"
}

MD_OUTPUT = "c:/dev/WQDSS/repo_git/docs/06_audit_idp_qualite.md"

IDP_TABLES = [
    "mesures_idp_2024_qualite_globale",
    "mesures_idp_2024_qualite_marche_cadre",
    "mesures_idp_2024_src_pollution_globale",
    "mesures_idp_2024_src_pollution_marche_cadre"
]

def extraire_roles_idp(columns):
    res = {"id": None, "station": None, "date": None, "parametre": None, "valeur": None, "unite": None}
    for col in columns:
        c = col['column_name'].lower()
        t = col['data_type'].lower()
        if c == 'id' or c.endswith('_id'): 
            if not res["id"]: res["id"] = c
        if any(x in c for x in ['station', 'point', 'site', 'code', 'local']):
            if not res["station"]: res["station"] = c
        if any(x in t for x in ['date', 'time']) or any(x in c for x in ['date', 'temps', 'campange']):
            if not res["date"]: res["date"] = c
        if any(x in c for x in ['param', 'qualite', 'polluant', 'element']):
            if not res["parametre"]: res["parametre"] = c
        if any(x in t for x in ['numeric', 'real', 'double', 'float', 'integer']) and any(x in c for x in ['val', 'res']):
            if not res["valeur"]: res["valeur"] = c
        if 'unit' in c:
            if not res["unite"]: res["unite"] = c
    return res

def run_audit():
    conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    conn.set_session(readonly=True, autocommit=True)
    cur = conn.cursor()

    md_content = f"# Audit Spécifique : Tables IDP 2024 (SAD Sebou)\n*Date : {datetime.now().strftime('%Y-%m-%d')}*\n\n"
    md_content += "Cet audit isole l'analyse qualitative et structurelle des 4 tables de campagnes d’Incidence Directe de la Pollution (IDP) pour préparer le BLOC 4.\n\n"

    for t_name in IDP_TABLES:
        print(f"Auditing IDP Table: {t_name}")
        md_content += f"## Table : `{t_name}`\n"
        
        # Structure
        cur.execute(f"SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name='{t_name}' ORDER BY ordinal_position")
        columns = cur.fetchall()
        
        if not columns:
            md_content += "> 🔴 **TABLE INTROUVABLE OU VIDE**\n\n"
            continue

        roles = extraire_roles_idp(columns)
        
        cur.execute(f"SELECT COUNT(*) as cnt FROM public.{t_name}")
        total = cur.fetchone()['cnt']
        
        md_content += f"### 1. Identité et Structure\n- **Volumétrie** : {total} lignes\n"
        md_content += "- **Colonnes inférées** : " + ", ".join([f"{k} = `{v}`" for k, v in roles.items() if v]) + "\n"
        
        if total == 0:
            md_content += "\n> ⚪ Table existante mais totalement vide, ignorée pour le reste de l'audit.\n\n"
            continue

        md_content += "\n### 2. Contenu Réel & Qualité\n"
        # Null rates
        nulls_results = []
        for role, col_name in roles.items():
            if col_name:
                cur.execute(f"SELECT COUNT(*) as n FROM public.{t_name} WHERE \"{col_name}\" IS NULL")
                n_cnt = cur.fetchone()['n']
                nulls_results.append(f"`{col_name}` : {round(100.0 * n_cnt / total,2)}% NULL")
        md_content += "- **Taux de Nulls** : " + " | ".join(nulls_results) + "\n"

        # Unique counts & mapping params
        md_content += "\n#### Statistiques Métier \n"
        if roles['station']:
            cur.execute(f"SELECT COUNT(DISTINCT \"{roles['station']}\") as cnt FROM public.{t_name}")
            dcnt = cur.fetchone()['cnt']
            md_content += f"- **Stations/Points distincts** : {dcnt}\n"
            cur.execute(f"SELECT DISTINCT \"{roles['station']}\" as st FROM public.{t_name} WHERE \"{roles['station']}\" IS NOT NULL LIMIT 8")
            samples = [str(x['st']) for x in cur.fetchall()]
            md_content += f"  - Echantillon : `{', '.join(samples)}`\n"

        if roles['parametre']:
            cur.execute(f"SELECT COUNT(DISTINCT \"{roles['parametre']}\") as cnt FROM public.{t_name}")
            dcnt = cur.fetchone()['cnt']
            md_content += f"- **Paramètres distincts** : {dcnt}\n"
            cur.execute(f"SELECT \"{roles['parametre']}\" as p, COUNT(*) as occ FROM public.{t_name} WHERE \"{roles['parametre']}\" IS NOT NULL GROUP BY \"{roles['parametre']}\" ORDER BY occ DESC LIMIT 15")
            samples = [f"{x['p']} ({x['occ']})" for x in cur.fetchall()]
            md_content += f"  - Top 15 (fréquence) : \n    - " + "\n    - ".join(samples) + "\n"

        if roles['date']:
            cur.execute(f"SELECT MIN(\"{roles['date']}\") as dmin, MAX(\"{roles['date']}\") as dmax FROM public.{t_name}")
            dres = cur.fetchone()
            md_content += f"- **Période temporelle** : `{dres['dmin']}` -> `{dres['dmax']}`\n"

        # Doublons probables
        bkeys = []
        for x in [roles.get('station'), roles.get('date'), roles.get('parametre')]:
            if x: bkeys.append(f"\"{x}\"")
        if len(bkeys) > 0:
            bk_str = ", ".join(bkeys)
            try:
                sql_dbl = f"SELECT SUM(cnt - 1) as tot_dbl, COUNT(*) as group_cnt FROM (SELECT {bk_str}, COUNT(*) as cnt FROM public.{t_name} GROUP BY {bk_str} HAVING COUNT(*) > 1) t"
                cur.execute(sql_dbl)
                r_dbl = cur.fetchone()
                d_val = r_dbl['tot_dbl'] if r_dbl['tot_dbl'] is not None else 0
                g_val = r_dbl['group_cnt'] if r_dbl['group_cnt'] is not None else 0
                md_content += f"- **Doublons métier détectés (clé = {bk_str})** : **{d_val}** conflits (répartis sur {g_val} groupes)\n"
            except Exception as e:
                md_content += f"- Doublons: Erreur de parsing clé ({e})\n"
                conn.rollback()

        md_content += "\n### 3. Conclusion & Niveau de Risque\n"
        md_content += "> **Hypothèses et Risques** : \n"
        if not roles['parametre']: md_content += "> - Le paramètre de qualité n'est pas explicite (table pivotée ou nom de colonne complexe).\n"
        if not roles['station']: md_content += "> - Le rattachement spatial / station est ambigu.\n"
        md_content += "> - **Action préparatoire** : Mappage sémantique obligatoire des paramètres pour injection unifiée.\n\n"
        md_content += "---\n\n"

    with open(MD_OUTPUT, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    cur.close()
    conn.close()
    print("Done generating IDP audit.")

if __name__=="__main__":
    run_audit()
