# Catalogue métier frontend

## Fichier

`frontend/src/config/observatoryCatalog.ts`

## Domaines

| Domaine | Statut | Familles |
|---|---|---|
| Météo | À venir | Température, précipitation, évaporation |
| Hydrologie | À venir | Débit, barrages |
| Qualité de l'eau | Actif partiel P0 | Métaux, chimie minérale, physico-chimie, pollution organique |
| Pollution / IDP | À venir | Inventaire, points IDP |
| Modélisation | À venir | SWAT, WASP |

## Familles P0 actives

| Famille | Endpoint | Vue source | Paramètre défaut |
|---|---|---|---|
| Métaux | `/api/v1/qualite/metaux` | `api.v_qualite_metaux` | `Mo` |
| Chimie minérale | `/api/v1/qualite/chimie-minerale` | `api.v_qualite_chimie_minerale` | `Ca` |
| Physico-chimie | `/api/v1/qualite/physicochimie` | `api.v_qualite_physicochimie` | `pH` |
| Pollution organique | `/api/v1/qualite/pollution-organique` | `api.v_qualite_pollution_organique` | `MO` |

## Règles métier encodées

- `Mo` est présent dans Métaux.
- `MO` est présent dans Pollution organique.
- `MO != Mo`.
- `FM`, `F_M_MES`, `MO_METAL` sont absents du catalogue.
- Les familles non exposées affichent `Module à venir` au lieu de lancer un appel API.
