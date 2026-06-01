# Recommandations de gouvernance

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport de réorganisation documentaire |
| Source de vérité | Non - rapport d'audit et de consolidation |
| Date | 2026-05-22 |

## Recommandations prioritaires

| Priorité | Recommandation | Justification |
|---|---|---|
| P0 | Ne plus ajouter de dossiers numérotés historiques à la racine de `docs` | racine illisible |
| P0 | Classer tout nouveau document actif/historique/expérimental/obsolète | évite les faux contrats |
| P0 | Interdire les références non qualifiées à `public.*` | legacy/absent |
| P1 | Créer un registre DOCUMENT_STATUS | facilite agents IA |
| P1 | Marquer chaque SQL PROPOSE/EXECUTE_DEV/EXECUTE_PROD/ROLLBACK/HOLD | réduit ambiguïtés pipeline |
| P1 | Valider déplacements par lots avec rapport liens avant/après | préserve traçabilité |
