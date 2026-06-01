# Recommandation API / Frontend

## Decision finale

| Action | Decision |
|---|---|
| Nouvelle architecture API | `GO_CONCEPTION_DETAILLEE` |
| Nouvelle architecture frontend | `GO_CONCEPTION_DETAILLEE` |
| Refactor legacy | `GO_PROGRESSIF_SANS_SUPPRESSION` |
| Debut implementation APIs | `P0_IMPLEMENTE` |
| Debut frontend | `HOLD_ATTENTE_ENDPOINTS_SPECIALISES` |
| Ingestion V1 | `HOLD_FIN_PROJET` |

## Recommandation pragmatique

La prochaine etape doit etre un lot backend minimal :

1. Ajouter un repository lecture seule whiteliste pour les vues `api.*`.
2. Ajouter les endpoints P0 qualité :
   - `/api/v1/qualite/metaux`
   - `/api/v1/qualite/chimie-minerale`
   - `/api/v1/qualite/physicochimie`
   - `/api/v1/qualite/pollution-organique`
3. Ajouter les schemas de reponse standard.
4. Tester imports, counts, filtres, exclusions.

Les endpoints backend P0 qualite sont maintenant disponibles en router specialise. Le frontend reste en `HOLD` jusqu'a validation de l'application backend complete, car le chargement global `app.main` reste bloque dans l'environnement de test courant par l'import preexistant `swat_analysis` / `numpy`.

## Points non negociables

- Ne pas casser les routes legacy existantes.
- Ne pas supprimer les anciens composants frontend.
- Ne pas utiliser `raw` comme source dashboard.
- Les nouvelles APIs lisent uniquement `api.*`.
- `FM` et `F_M_MES` ne sont pas exposés.
- `MO` et `Mo` restent distincts.
- `COULEUR` reste consultation only.

## Statut global

`BACKEND_P0_SPECIALIZED_APIS_READY__FRONTEND_HOLD`
