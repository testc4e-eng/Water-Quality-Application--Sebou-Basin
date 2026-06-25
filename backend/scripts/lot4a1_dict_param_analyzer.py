import os
import io
import sys
import psycopg2
from collections import defaultdict
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

def guess_family(param_name):
    low = str(param_name).lower().strip()
    if any(k in low for k in ['ibgn', 'ibd', 'pheopigment', 'chl']): return 'Hydrobiologie / Indices'
    if any(k in low for k in ['germe', 'clostri', 'vibrion', 'cf', 'pseudo_aer', 'strept', 'coli', 'salmon']): return 'Microbiologie'
    if any(k in low for k in ['ag', 'al', 'as', 'ba', 'cd', 'co', 'cr', 'cu', 'fe', 'hg', 'li', 'mg', 'mn', 'ni', 'pb', 'sb', 'se', 'zn', 'plomb', 'mercure', 'arsenic', 'fer ', 'cuivre', 'cadmium', 'chrome']): return 'Métaux Lourds'
    if any(k in low for k in ['dbo', 'dco', 'carbone_org', 'mo', 'phenol', 'detergent', 'h_g', 'cyanure', 'cn']): return 'Organique'
    if any(k in low for k in ['azote', 'nh4', 'no2', 'no3', 'ntk', 'po4', 'po3', 'pt', 'ptp', 'ptd', 'nitrat', 'phosphore', 'ammonium']): return 'Nutriments'
    if any(k in low for k in ['t_air', 't_eau', 'temperature', 'ph', 'odeur', 'saveur', 'couleur', 'profondeur', 'disque', 'largeur', 'eh', 'sat', 'debit', 'numerotation', 'niveau']): return 'In situ / Terrain'
    return 'Physico-chimie générale' # ions majeurs (Ca, SO4, Cl...), Conductivité, MES...

def guess_canonical(param_name):
    low = str(param_name).strip()
    # Unité extract
    unit = "N/A"
    unit_match = re.search(r'\(([^)]+)\)', low)
    if unit_match:
        unit = unit_match.group(1).replace('µ', 'u')
        
    code_c = low.split('(')[0].replace('_', '').replace(' ', '').upper()
    name_c = low.split('(')[0].capitalize()
    
    trust = "Moyen"
    if len(code_c) <= 2 and code_c.isalpha(): trust = "Élevé"
    
    return code_c, name_c, unit, trust

def main():
    db_pass = os.environ.get("WQDSS_DB_PASSWORD", "c4e@test@2025")
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass)
    cur_src = conn_src.cursor()
    
    query = """
    WITH glob AS (
        SELECT parametre_qualite, 'qualite_rivieres' as ts FROM public.mesures_qualite_rivieres WHERE parametre_qualite IS NOT NULL
        UNION ALL
        SELECT parametre_qualite, 'qualite_nappes' as ts FROM public.mesures_qualite_nappes WHERE parametre_qualite IS NOT NULL
        UNION ALL
        SELECT parametre_qualite, 'qualite_barrages' as ts FROM public.mesures_qualite_barrages WHERE parametre_qualite IS NOT NULL
        UNION ALL
        SELECT parametre_qualite, 'suivi_sebou_6_stations' as ts FROM public.mesures_suivi_qualite_sebou_jr_6stations WHERE parametre_qualite IS NOT NULL
        UNION ALL
        SELECT parametre_qualite, 'suivi_brg_garde_hebdo' as ts FROM public.mesures_suivi_qualite_brg_garde_hebdo WHERE parametre_qualite IS NOT NULL
    )
    SELECT parametre_qualite, COUNT(*) as freq, string_agg(DISTINCT ts, ', ') as srcs
    FROM glob
    GROUP BY parametre_qualite
    ORDER BY freq DESC;
    """
    
    cur_src.execute(query)
    rows = cur_src.fetchall()
    
    families = defaultdict(list)
    ambiguous_params = []
    
    for r in rows:
        raw_name = r[0]
        freq = r[1]
        srcs = r[2]
        
        fam = guess_family(raw_name)
        code_c, name_c, unit_c, trust = guess_canonical(raw_name)
        
        # Ambiguity check
        ambig = "Ambigu (Orthographe / Symbole double)" if len(code_c) > 10 or '-' in code_c or '+' in code_c else "Non"
        if ambig != "Non":
            ambiguous_params.append(raw_name)
            
        families[fam].append({
            "raw": str(raw_name), "norm": name_c, "code_c": code_c,
            "freq": freq, "srcs": srcs, "trust": trust,
            "unit": unit_c, "ambig": ambig
        })

    md_file = "c:/dev/WQDSS/repo_git/docs/12_lot4a1_dictionnaire_parametres.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 4A-1 : Audit et Normalisation du Dictionnaire des Paramètres \n\n")
        f.write("L'unification du vocabulaire des données est un socle inaliénable du Big Data analytique. Cet audit structure les dénominations hétéroclites des laboratoires via une taxonomie `qualite.ref_parametre` stricte.\n\n")
        
        f.write("## 1. Regroupement Opérationnel par Familles Métier\n\n")
        for fam_name in sorted(families.keys()):
            f.write(f"### 🧪 Famille : {fam_name}\n")
            f.write("| Alias Brut | Code Cible Proposé | Libellé Normalisé | Unité Cible | Occurrences | Confiance | Sources |\n")
            f.write("|---|---|---|---|---|---|---|\n")
            for p in sorted(families[fam_name], key=lambda x: x['freq'], reverse=True):
                f.write(f"| `{p['raw']}` | `{p['code_c'][:12]}` | {p['norm']} | *{p['unit']}* | **{p['freq']}** | {p['trust']} ({p['ambig']}) | {p['srcs']} |\n")
            f.write("\n")
            
        f.write("## 2. Alias Nécessitant un Arbitrage Métier Radical\n")
        f.write("Les valeurs suivantes sont malformées, extrêmement vagues ou possèdent des symboles invalides ne permettant pas la conciliation automatique sécurisée (ex: mélange de nom, symboles `3-`, ions `+`). Elles requièrent un arbitrage chimiste:\n")
        f.write(", ".join([f"`{a}`" for a in ambiguous_params]) + "\n\n")
        
        f.write("## 3. Proposition de Modèle de Donnée Cible (Structure `abh_sad`)\n")
        f.write("L'architecture analytique des pollutions requiert la fondation d'un triptyque référentiel :\n")
        f.write("```sql\n")
        f.write("CREATE TABLE qualite.ref_parametre (\n")
        f.write("   id SERIAL PRIMARY KEY,\n")
        f.write("   code_interne VARCHAR(25) UNIQUE,  -- ex: 'NH4'\n")
        f.write("   libelle_officiel VARCHAR(150),    -- ex: 'Ammonium'\n")
        f.write("   famille_id INTEGER NULL,\n")
        f.write("   formule_chimique VARCHAR(50)\n")
        f.write(");\n\n")
        f.write("CREATE TABLE qualite.map_parametre_source (\n")
        f.write("   alias_brut VARCHAR(255) PRIMARY KEY, -- ex: 'Ammonium(mg/l)'\n")
        f.write("   parametre_ref_id INTEGER REFERENCES qualite.ref_parametre(id)\n")
        f.write(");\n\n")
        f.write("CREATE TABLE qualite.ref_unite (\n")
        f.write("   id SERIAL PRIMARY KEY,\n")
        f.write("   symbole VARCHAR(20) UNIQUE, -- ex: 'mg/l', 'NTU', 'µS/cm'\n")
        f.write("   dimension VARCHAR(50)\n")
        f.write(");\n")
        f.write("```\n")
        f.write("*(Note: Le modèle exact de ta prod devra être synchronisé avec cette recommandation)*.\n\n")
        
        f.write("## 4. Règles QA d'Ingestion Futures\n")
        f.write("1. **NULL** (`ANO-LOT4A-002`) : Toute remontée chiffrée valant stritement NULL sera exclue (`WOULD_SKIP`) ou levée par le QA formel `qa_flag_null_value` lors du scan, selon affinité.\n")
        f.write("2. **Négatifs** (`ANO-LOT4A-003`) : Une mole ou un atome ne peut physiquement être négatif. Ces seuils de censure des instruments (-99 ou <LOQ) transiteront impérativement flagués par `qa_flag_negative=TRUE` et la vraie macro `valeur_num` mise à `NULL` pour ne pas écraser les sommes arithmétiques du dashboard.\n")
        f.write("3. **Libellés Corrompus** : Si `map_parametre_source` reste muette quant à un libellé orphelin, la ligne passe en `qa_flag_param_missing=TRUE` (ou `WOULD_CONFLICT` si la stratégie d'Upsert la bannit).\n")
        f.write("4. **Paramètres Sans Unités Explicites** : La table d'ingestion factuelle s'abrogera d'une unité, qui doit être raccordée au `ref_parametre`. Un paramètre entré sans unité restera toléré si le mapping de son code parent le relève.\n")
        
        f.write("\n\n*Rappel de Gouvernance (Contexte Validé)* : La table `mesures_suivi_qualite_brg_garde_hebdo` jouira formellement, d'après les notes, du mapping direct `station = Barrage Garde Sebou` (`qa_flag_station_infered=TRUE`, etc). Cette décision a été intégrée comme jurisprudence du bloc 4.*\n")
    
    print(f"L'analyse syntaxique des {len('all_params')} métriques est complétée : {md_file}.")

if __name__ == "__main__":
    main()
