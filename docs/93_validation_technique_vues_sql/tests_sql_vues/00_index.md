# Tests SQL vues metier specialisees

## Objet

Validation technique controlee du SQL des vues metier specialisees dans une transaction terminee par `ROLLBACK`.

## Fichiers

| Fichier | Role |
|---|---|
| `01_resultats_compilation.md` | Resultats de compilation des vues |
| `02_resultats_count_par_vue.md` | Volumetries observees par vue |
| `03_resultats_colonnes_communes.md` | Verification du modele de colonnes commun |
| `04_resultats_explain_performance.md` | Synthese EXPLAIN et risques performance |
| `05_anomalies_sql_corrigees.md` | Anomalies detectees et corrections apportees au SQL propose |
| `06_sql_vues_corrigees_VALIDATION_REQUISE.sql` | SQL final corrige avec `ROLLBACK` actif |
| `07_checklist_go_create_views.md` | Checklist GO/HOLD creation vues |
| `08_recommandation_finale_create_views.md` | Recommandation finale |

## Statut

| Controle | Resultat |
|---|---|
| Compilation transactionnelle | `OK` |
| Rollback teste | `OK` |
| Colonnes communes | `OK` |
| Regles metier critiques | `OK_APRES_CORRECTION` |
| Creation durable | `NON_EXECUTEE` |
| Decision create views | `GO_TECHNIQUE_SOUS_CONDITIONS` |
