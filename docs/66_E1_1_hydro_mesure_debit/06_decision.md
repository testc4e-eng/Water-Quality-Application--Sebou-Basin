# Décision mini-lot

## Statut

**HYDRO_DEBIT_OK**

## Justification

- backup créé avant insertion
- insertion exécutée uniquement sur le périmètre `READY_INSERT_ONLY_MISSING`
- aucune dépendance à `ctid`
- audit stable alimenté dans `qa_dry_run.e1_1_insert_audit`
- `131 013` lignes ajoutées
- `0` doublon métier restant
- `0` null critique (`station_id`, `valeur`)

## Réserve documentaire

- `1 553` conflits de valeur restent exclus
- `5 455` lignes backlog restent exclues
- ces sous-ensembles doivent être traités dans un lot QA/arbitrage séparé

## Suite

Ne pas enchaîner automatiquement sur une autre table. Le prochain mini-lot doit faire l’objet d’une validation humaine séparée.
