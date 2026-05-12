import json
import os

JSON_PATH = "c:/dev/WQDSS/repo_git/docs/audit_abh_sebou_070426_summary.json"
MD_PATH = "c:/dev/WQDSS/repo_git/docs/11_catalogue_decision_tables.md"

def generate_catalogue():
    if not os.path.exists(JSON_PATH):
        print(f"Erreur : fichier introuvable {JSON_PATH}")
        return

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    md_content = "# Catalogue de Décisions de Convergence : abh_sebou_070426 -> abh_sad\n\n"
    md_content += "Le présent catalogue dresse l'état qualitatif et l'arbitrage organisationnel défini pour chaque table auditée de la base de consolidation. Ce registre trace les décisions stratégiques associées à chaque objet.\n\n"

    md_content += "| Famille / Domaine | Table Source (Sandbox) | Statut / Volumétrie | Qualité / Anomalies | Décision Cible (abh_sad) | Priorité (Lot) | Action Technique Recommandée |\n"
    md_content += "|---|---|---|---|---|---|---|\n"

    tables = data.get("tables_audit", {})
    
    # Tri métier des tables
    sorted_tables = sorted(tables.items(), key=lambda item: item[1].get('famille', 'autre'))

    for t_name, info in sorted_tables:
        famille = info.get('famille', 'autre').upper()
        volume = info.get('total_rows', 0)
        statut = info.get('statut', 'Inconnu')
        
        # Determine flaws
        flaws = []
        if info.get('doublons_metier', 0) > 0: flaws.append(f"Doublons ({info['doublons_metier']})")
        if volume == 0: flaws.append("Vide")
        # Simplified flaws string
        if not flaws:
            flaws_str = "Sain / Sans doublons"
        else:
            flaws_str = " | ".join(flaws)

        # Heuristic Decision making
        if volume == 0:
            dec = "NE PAS INTEGRER"
            prio = "IGNORE"
            action = "Ignorer (Archiver silencieusement via script)"
        elif "infra" in famille.lower():
            dec = "MIGRER / ENRICHIR"
            prio = "LOT 1"
            action = "Mapping et Enrichment de `infra.stations_mesure` et `infra.barrages`"
        elif "geo" in famille.lower() or "admin" in famille.lower():
            dec = "MIGRER"
            prio = "LOT 1"
            action = "Synchronisation de référentiel géographique spatial pur."
        elif "hydro" in t_name or "niv" in t_name or 'debit' in t_name or 'precip' in t_name or 'evapo' in t_name:
            dec = "MIGRER"
            prio = "LOT 2"
            action = "Insertion en table hydro.* / meteo.* native (Mapping station id_station)"
        elif "inv_" in t_name:
            dec = "NORMALISER / MIGRER"
            prio = "LOT 3"
            action = "Standardisation spatiale vers schéma d'Inventaires Sources Polluantes"
        elif "qualite" in t_name or "_idp" in t_name:
            dec = "NORMALISER"
            prio = "LOT 4"
            action = "Mashing complexe vers `qualite.mesure_qualite_unifiee` + Ref_Params"
        else:
            dec = "ARCHIVER / DEPRECIER"
            prio = "LOT 5"
            action = "Potentiel rejet ou archivage legacy car domaine obscur."

        md_content += f"| {famille} | `{t_name}` | {statut} ({volume} L.) | {flaws_str} | **{dec}** | {prio} | {action} |\n"

    with open(MD_PATH, "w", encoding="utf-8") as f:
        f.write(md_content)

    print(f"Catalogue {MD_PATH} généré avec succès!")

if __name__ == "__main__":
    generate_catalogue()
