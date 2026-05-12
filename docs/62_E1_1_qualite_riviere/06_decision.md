# Décision mini-lot

## Statut

**QUALITE_RIVIERE_OK**

## Justification

- backup créé avant reset
- reset exécuté uniquement sur `qualite.mesure_qualite_riviere`
- remigration effectuée sans `ctid`
- audit stable alimenté dans `qa_dry_run.e1_1_insert_audit`
- `59 534` lignes insérées proprement
- `0` doublon métier restant
- `0` valeur critique nulle (`station_id`, `parametre_qualite`, `valeur`)

## Réserve documentaire

- `17 287` lignes restent avec `parametre_ref_id` null
- ce point doit alimenter le backlog référentiel paramètres, sans remettre en cause le résultat du mini-lot

## Suite

Ne pas enchaîner automatiquement sur une autre table. Le prochain mini-lot doit faire l’objet d’une validation humaine séparée.
