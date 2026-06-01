# Intégration API spécialisée

## Client API

`frontend/src/api/qualite.ts` expose :

- `getQualiteFamily(family, filters)` ;
- `getQualiteMetaux(filters)` ;
- `getQualiteChimieMinerale(filters)` ;
- `getQualitePhysicochimie(filters)` ;
- `getQualitePollutionOrganique(filters)`.

## Endpoints utilisés

| Famille | Endpoint |
|---|---|
| Métaux | `/api/v1/qualite/metaux` |
| Chimie minérale | `/api/v1/qualite/chimie-minerale` |
| Physico-chimie | `/api/v1/qualite/physicochimie` |
| Pollution organique | `/api/v1/qualite/pollution-organique` |

## Filtres envoyés

- `code_parametre` obligatoire après clic `Afficher` ;
- `date_start` ;
- `date_end` ;
- `support_type` si renseigné ;
- `limit` obligatoire ;
- `include_geom=true` uniquement si mode `map` est choisi.

## Non-régression

Le menu V2 ne consomme pas `/raw`, ne lit pas les tables métier et ne remplace pas les endpoints legacy existants.
