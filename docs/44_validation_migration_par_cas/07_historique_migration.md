# Historique migration

## 2026-04-29 — Initialisation de la gouvernance par cas
- Transformation du tableau de décision global en registre de cas unitaires.
- Création d’une fiche par cas avec statut `PENDING`.
- Génération d’un SQL proposé non exécuté pour chaque cas.
- Aucun passage en métier, aucune quarantaine effective, aucune suppression.

## Règle active
- tout cas doit être validé explicitement avant exécution ;
- toute exécution future devra être documentée dans `03_journal_decisions.md` et `04_log_execution.md` ;
- le rollback doit être préparé avant toute première exécution.
