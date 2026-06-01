# Index - Clôture référentiel qualité préproduction

Date d'audit : 2026-05-22
Base contrôlée : `abh_sad` en lecture seule.
Statut proposé : `GO_PREPROD_CONDITIONNEL`.

## Synthèse
- Version réglementaire active détectée : `REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19`.
- Tables réglementaires présentes : 7/7.
- Paramètres réglementaires : 41.
- Paramètres classifiables actifs : 36.
- Seuils chargés : 205.
- Seuils actifs exposés par le moteur : 177.
- Endpoints qualité testés : `/health`, `/quality/regulatory-status`, `/quality/thresholds`, `/quality/classify`.
- Données BD modifiées : non.

## Fichiers
| Fichier | Contenu | Statut |
|---|---|---|
| 00_index.md | Index de clôture préproduction | Produit |
| 01_audit_contexte_documentaire.md | Synthèse des documents source de vérité lus | Produit |
| 02_audit_tables_reglementaires.md | Etat réel des tables réglementaires DEV | Produit |
| 03_audit_couverture_parametres.md | Couverture paramètres, mappings, tables mesures | Produit |
| 04_tests_api_quality_thresholds_classify.md | Tests endpoints qualité DEV | Produit |
| 05_ecarts_et_blocages.md | Ecarts et blocages restants | Produit |
| 06_plan_deblocage_preprod.md | Plan court de déblocage préproduction | Produit |
| 07_scripts_sql_readonly_verification.sql | Script SQL SELECT uniquement | Produit, non exécuté |
| 08_scripts_sql_chargement_preprod_A_VALIDER.sql | Script/wrapper de chargement préprod à valider | Produit, non exécuté |
| 09_rapport_go_nogo_preproduction.md | Rapport GO/NOGO préproduction | Produit |
| 10_points_validation_metier.md | Points métier à valider | Produit |


## Artefacts audit internes
- `_audit_readonly_results.json` : résultats SELECT lecture seule.
- `_api_test_results.json` : réponses API TestClient.
