# GO/NOGO execution DEV - IDP pollution

Date decision : 2026-05-18

## GO DEV

| Composant | Statut | Preuve |
|---|---|---|
| PostgreSQL/PostGIS DEV | GO | connexion OK, PostGIS 3.5.3 |
| Schemas `staging`, `geo`, `qualite`, `metadata`, `qa`, `api` | GO | droits USAGE/CREATE confirmes |
| Import staging SHP IDP | GO | 12365 lignes importees, batch rollbackable |
| Couche canonique `geo.ref_site_pollution` | GO DEV | 1951 sites charges |
| Format long P0 | GO partiel | 1409 resultats charges |
| Vues API SQL | GO | 1951 sites, 517 derniers resultats |
| Endpoint FastAPI GeoJSON | GO | `/api/v1/pollution/sites.geojson` retourne 200 |
| Test MapLibre | GO DEV | config + HTML + GeoJSON echantillon generes |

## NOGO production / pre-production

| Sujet | Raison |
|---|---|
| Couverture complete NH4/NO3 | alias parametres non mappes |
| Interpretation analytique fiable | 572 unites non mappees |
| Dedoublonnage | 1316 exacts et 69 proches a arbitrer |
| Consolidation definitive sites | 9593 nouveaux candidats et 299 conflits multi-sources |
| Typologie IDP definitive | certains libelles source restent bruts et doivent etre valides contre la typologie pollution |

## Performances observees

- `api.v_pollution_sites LIMIT 100` : 12.056 ms.
- `api.v_pollution_latest_results` filtre P0 `LIMIT 100` : 12.729 ms.

## Decision

GO pour environnement DEV et demonstration MapLibre.

NOGO pour pre-production tant que les mappings parametres/unites P0 et les arbitrages spatiaux prioritaires ne sont pas valides.

## Prochaines actions prioritaires

1. Ajouter/valider les alias P0 dans `metadata.mapping_parametre_source` : `NH4+`, `NH4+ Spect`, `NH4+ Titri`, `NO3-`, `NO3-_Spectro`, `MEST Filtr`.
2. Valider les unites canoniques pour `DBO5`, `DCO`, `MES`, `NH4`, `NO3`.
3. Exporter les 299 conflits multi-sources et les 69 doublons proches en lot d'arbitrage metier.
4. Valider les typologies source IDP avant usage metier des styles/filtres.
5. Relancer le format long P0 puis `api.v_pollution_latest_results`.
6. Brancher la couche MapLibre dans l'interface React cible apres validation metier P0.
