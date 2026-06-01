# Workflows QA, GEO, rollback et audit

## Workflow QA

1. contrôle type ;
2. contrôle unité ;
3. contrôle mapping paramètre ;
4. contrôle statut métier ;
5. contrôle valeurs extrêmes / nulles ;
6. décision `accept`, `warn`, `quarantine`.

## Workflow GEO

1. lecture XY ;
2. validation projection / format ;
3. rattachement automatique ;
4. statut `geo_status` ;
5. publication ou quarantaine GEO.

## Workflow rollback

- un batch = une unité annulable ;
- rollback logique, pas correction manuelle non auditée ;
- journal batch obligatoire.

## Workflow audit

- journal d'entrée ;
- journal de transformation ;
- journal de quarantaine ;
- journal de publication ;
- preuve de version référentiel utilisée.
