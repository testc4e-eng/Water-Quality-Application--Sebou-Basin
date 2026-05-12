# Décision mini-lot

## Statut

**QUALITE_BARRAGE_OK**

## Justification

- backup créé avant reset
- reset exécuté uniquement sur `qualite.mesure_qualite_barrage`
- remigration effectuée sans `ctid`
- audit stable alimenté dans `qa_dry_run.e1_1_insert_audit`
- `7 820` lignes insérées proprement
- `0` doublon métier restant
- `0` valeur critique nulle (`station_id`, `parametre_qualite`, `valeur`)

## Suite

Ne pas enchaîner automatiquement sur une autre table. Le prochain mini-lot doit faire l’objet d’une validation humaine séparée.
