# Décision mini-lot

## Statut

**QUALITE_GARDE_HEBDO_OK**

## Justification

- backup créé avant reset
- reset exécuté uniquement sur `qualite.suivi_qualite_barrage_garde_hebdo`
- remigration effectuée sans `ctid`
- audit stable alimenté dans `qa_dry_run.e1_1_insert_audit`
- `1 780` lignes insérées proprement
- `0` doublon métier restant
- `0` valeur critique nulle (`station_id`, `parametre_qualite`, `valeur`, `barrage_id`)

## Réserve documentaire

- `539` lignes restent avec `parametre_ref_id` null
- ce point doit alimenter le backlog référentiel paramètres, sans remettre en cause le résultat du mini-lot

## Suite

Ne pas enchaîner automatiquement sur une autre table. Le prochain mini-lot doit faire l’objet d’une validation humaine séparée.
