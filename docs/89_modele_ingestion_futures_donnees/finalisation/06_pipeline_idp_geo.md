# Pipeline IDP / GEO

## Objectif

Traiter les futures donnees IDP/GEO avec validation client explicite.

## Etapes

1. charger points et attributs bruts ;
2. valider coordonnees ;
3. construire geometrie PostGIS ;
4. rattacher station, point eau, nappe, profil ;
5. controler intersections spatiales ;
6. isoler ambiguïtés client ;
7. publier uniquement les objets resolus.

## Cas client actuels

| Cas | Volume | Statut |
|---|---:|---|
| nappes non resolues | 292 | `CLIENT_REQUIRED` |
| points eau nappe non resolus | 22 | `CLIENT_REQUIRED` |
| points eau station non resolus | 46 | `CLIENT_REQUIRED` |
| profils nappe non resolus | 1204 | `CLIENT_REQUIRED` |
| station `null I` | 1 | `CLIENT_REQUIRED` |

## Regle

Ne pas corriger un rattachement GEO sans preuve client ou preuve spatiale documentee.
