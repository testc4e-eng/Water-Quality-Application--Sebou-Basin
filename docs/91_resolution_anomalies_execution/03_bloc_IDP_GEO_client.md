# Bloc 3 - IDP / GEO / donnees client

## 1. Resume executif

Ce bloc depend principalement d'arbitrages client. Les controles montrent que les points pollution charges ont une geometrie, mais des mappings nappes/points/profils restent non resolus.

## 2. Tableau des anomalies du bloc

| ID | Anomalie | Volume | Classe actuelle | Diagnostic | Decision cible | Action |
|---|---|---:|---|---|---|---|
| GEO-001 | nappes non resolues | 292 | CLIENT_REQUIRED | stations mappees mais sans nappe intersectee | CLIENT_REQUIRED | demander mapping officiel nappe |
| GEO-002 | points eau nappe non resolus | 22 | CLIENT_REQUIRED | points sans nappe mappee | CLIENT_REQUIRED | demander rattachement point/nappe |
| GEO-003 | points eau station non resolus | 46 | CLIENT_REQUIRED | volume confirme | CLIENT_REQUIRED | demander mapping station/point |
| GEO-004 | profils nappe non resolus | 1204 | CLIENT_REQUIRED | profils sans mapping nappe | CLIENT_REQUIRED | demander table profil/nappe |
| GEO-005 | station suivi qualite barrage null I | 1 | CLIENT_REQUIRED | volume confirme | CLIENT_REQUIRED | arbitrer identifiant station |
| GEO-006 | points sans XY ou geom source manquante | 0 en pollution cible | CLIENT_REQUIRED si nouveaux fichiers | CLOTURE_SANS_ACTION | aucun cas pollution cible actuel |

## 3. Cas traitables immediatement

`GEO-006` est cloturable sans action pour la table pollution cible actuelle : `geom NULL = 0`, `coord_x/coord_y NULL = 0`.

## 4. Cas necessitant validation client

`GEO-001` a `GEO-005`.

Questions client :

- Fournir le mapping officiel des stations/points vers les nappes.
- Confirmer les codes points eau non resolus.
- Fournir la correspondance profil/nappe.
- Arbitrer la station `null I` du suivi qualite barrage.

## 5. Cas hors perimetre / legacy

Aucun legacy technique dans ce bloc.

## 6. Requetes SELECT utilisees

```sql
SELECT COUNT(*) FROM metadata.mapping_nappe_unresolved_qualite_nappes;
SELECT COUNT(*) FROM metadata.mapping_point_eau_unresolved_nappe;
SELECT COUNT(*) FROM metadata.mapping_point_eau_unresolved_station;
SELECT COUNT(*) FROM metadata.mapping_profil_unresolved_nappe;
SELECT COUNT(*) FROM metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i;
SELECT COUNT(*) FROM qualite.source_pollution_prelevement WHERE geom IS NULL;
```

## 7. Corrections proposees mais non executees

Aucune correction C4E sans retour client.

## 8. Points a valider avant execution

- fichiers de mapping client
- regles de priorite si plusieurs nappes possibles
- acceptation d'exclusions si coordonnees absentes dans futurs fichiers

