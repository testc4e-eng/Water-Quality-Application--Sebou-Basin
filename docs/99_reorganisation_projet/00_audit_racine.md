# Audit racine - reorganisation projet SAD/WQDSS

| Champ | Valeur |
|---|---|
| Statut | actif |
| Type | audit read-only puis plan d'execution |
| Date | 2026-06-22 |
| Perimetre | `repo_git/` hors code backend/frontend/database |

## Objectif

Nettoyer la racine du depot et les fichiers documentaires isoles sans casser :

- les parcours backend/frontend existants ;
- les references documentaires actives ;
- les scripts applicatifs sensibles ;
- la structure documentaire numerotee deja en service.

## Constat principal

La structure `docs/` possede deja une organisation active et numerotee. La reorganisation demandee ne doit donc pas remplacer cette structure, mais ajouter :

- des buckets de classement transverses ;
- des dossiers d'artefacts et de logs ;
- un espace d'archive explicite ;
- un mapping traceable des deplacements.

## Dossiers structurants confirmes

Les dossiers suivants existent et doivent rester des references actives :

- `docs/00_source_of_truth/`
- `docs/38_audit_frontend_vision_dashboards/`
- `docs/46_refonte_dashboard_qualite_metier/`
- `docs/47_dashboard_carte_metier_analytique/`
- `docs/48_sprint0_audit_sources_carte_metier/`
- `docs/49_business_map_backend_v1/`
- `docs/50_sprint1_5_carte_metier_ux_fonctionnelle/`
- `docs/51_sprint2_0_architecture_analytique/`
- `docs/52_sprint2a_backend_batch_series/`
- `docs/55_assainissement_donnees_carte_metier/`

## Fichiers racine identifies

### Deplacables a faible risque

- captures PNG de debug et d'audit Home/dashboard ;
- scripts Python temporaires de patch/audit a la racine ;
- scripts SQL isoles a la racine ;
- logs et snapshots temporaires ;
- note Docker isolee dans `docs/`.

### A traiter avec prudence

- `docs/retour equipe metier.xlsx`
- `docs/retour equipe metier 040526.xlsx`
- `docs/valdiation parametre.xlsx`
- `docs/audit_abh_sebou_070426_complet.md`
- `docs/audit_abh_sebou_070426_summary.json`
- `docs/docs.rar`
- `wqss.env.txt`

Raison : references actives detectees, valeur metier/documentaire, ou contenu potentiellement sensible.

### Hors perimetre de mouvement dans cette passe

- `backend/**`
- `frontend/**`
- `database/**`
- `.env`
- `docker-compose.yml`
- `README.md`

## References detectees avant mouvement

References explicites relevees :

- `docs/97_dashboard_home_v2_contract/19_home_v2_ux_audit.md` pointe vers trois captures racine ;
- `docs/44_bascule_progressive_api_qualite_unifiee/02_tests_api.md` mentionne `test_api.py` ;
- plusieurs documents et SQL de `docs/42_*` et `docs/48_*` mentionnent `docs/retour equipe metier.xlsx` ;
- `backend/scripts/audit_global_generator.py` et `backend/scripts/generate_decision_catalog.py` pointent vers `docs/audit_abh_*` ;
- `sandbox/ml_hydro_baseline/reports/extraction_dry_run_20260522_122901.md` mentionne `wqss.env.txt`.

## Decision de reorganisation

### Passe executee

Deplacer uniquement les fichiers isoles a faible risque, avec mise a jour des references detectees si necessaire.

### Passe differee

Conserver en place les fichiers a forte dependance documentaire ou script tant qu'un reclassement complet avec remplacement global des chemins n'a pas ete valide.

## Structure cible ajoutee

### Buckets documentaires

- `docs/01_livrables_client/`
- `docs/02_documentation_metier/`
- `docs/03_documentation_technique/`
- `docs/04_roadmap_et_pilotage/`
- `docs/05_audits/`
- `docs/06_sprints/`
- `docs/07_validations/`
- `docs/08_archives/`
- `docs/09_media/`
- `docs/99_reorganisation_projet/`

### Artefacts et exploitation

- `artifacts/screenshots/dashboards/`
- `artifacts/screenshots/pollution/`
- `artifacts/screenshots/qualite/`
- `artifacts/screenshots/carte_metier/`
- `artifacts/screenshots/runtime/`
- `artifacts/exports/`
- `artifacts/reports/`
- `artifacts/temp/`
- `logs/backend/`
- `logs/frontend/`
- `logs/console/`
- `logs/runtime/`
- `archive/obsolete/`
- `archive/old_snapshots/`
- `archive/raw_temp/`

### Scripts

- `scripts/sql/migrations/`
- `scripts/sql/temporary/`
- `scripts/python/audit/`
- `scripts/python/maintenance/`
- `scripts/powershell/`
- `scripts/maintenance/`

## Resultat attendu

- racine du depot allignee sur les actifs applicatifs et documentaires essentiels ;
- traces de debug sorties de la racine ;
- scripts temporaires regroupes ;
- mapping ancien/nouveau documente ;
- aucun fichier backend/frontend/database supprime ou modifie pour la reorganisation.
