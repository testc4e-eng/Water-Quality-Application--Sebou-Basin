# Plan de creation couches IDP

## Structure technique proposee

- schema cible propose : `qa_dry_run` ou `geo_idp` apres validation
- une table par couche logique :
  - `idp_qualite_globale_points`
  - `idp_qualite_marche_cadre_points`
  - `idp_src_pollution_globale_points`
  - `idp_src_pollution_marche_cadre_points`

## Geometrie

- type : `geometry(Point, 26191)` propose
- justification : les XY sont metriques et s'alignent avec plusieurs couches `infra.*` et `geo.reseau_hydrographique` en `SRID 26191`
- statut : `SRID_PROBABLE_A_VALIDER`

## Attributs a conserver

- identifiants bruts : `id_pts`, `id_table`, `ire`, `n_enregestrement`, `n_ordre`, `n_indice`
- localisation brute : `commune`, `code_commune`, `coord_x`, `coord_y`
- typologie brute : `pts_prelevement`, `nature_pts_prelevement`, `nature`
- temporel : `date_jr_prelevement`, `heure_prelevement`
- qualite / mesure : `parametre_qualite`, `val_qual`, `parametre`
- observations : `observation`, `observations`

## Flags QA proposes

- `IDP_NO_XY`
- `IDP_SRID_TO_CONFIRM`
- `IDP_DUPLICATE_POINT`
- `IDP_CROSS_TABLE_MATCH_EXACT`
- `IDP_CROSS_TABLE_MATCH_LE_2M`
- `IDP_CROSS_TABLE_MATCH_LE_5M`
- `IDP_CROSS_TABLE_MATCH_LE_10M`
- `IDP_PTS_PRELEVEMENT_TO_VALIDATE`
