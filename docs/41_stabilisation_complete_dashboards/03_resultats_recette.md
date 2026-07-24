# 03  Résultats recette

## STAB-01  Accueil DG

| Champ | Résultat |
|---|---|
| Route | `/` |
| Statut | `HOME_READY_AVEC_RESERVES` |
| Endpoint principal | `GET /api/v1/dashboard/home` |
| Temps cold start mesuré après correction | environ `32 s` sur runtime local |
| Endpoint stations Home | `GET /api/v1/quality/stations-with-timeseries?limit=6` -> `200` |
| UI loading | Validé |
| UI success | Validé |
| Reload | Validé |
| Navigation Carte Métier | Validée |
| Console bloquante | Aucune dans la recette Playwright |
| Erreurs réseau bloquantes | Aucune dans la recette Playwright |

## Tests exécutés

| Commande | Résultat |
|---|---|
| `docker exec sad-backend python -m py_compile /app/app/services/dashboard/home_service.py /app/app/services/dashboard/runtime_service.py` | OK |
| `npx playwright test e2e/01-home-dashboard.spec.ts --timeout=180000` | 1 passed |
| `npm run test` | 6 files, 29 tests passed |
| `npm run build` | OK avec warning Vite chunk size |

## Captures

| Capture | Chemin |
|---|---|
| Loading | `frontend/test-results/platform-stabilization/01-home/01-home-loading.png` |
| Success | `frontend/test-results/platform-stabilization/01-home/02-home-success.png` |
| Reload | `frontend/test-results/platform-stabilization/01-home/03-home-reload.png` |

## Réserves

- Le Home froid reste lent, mais la page conserve un état de chargement et finit en succès dans la recette automatisée.
- Le crash NumPy Windows bloque certains tests backend locaux hors conteneur.
- Le warning Vite de taille de bundle reste une dette frontend non bloquante pour la démonstration.

## Prochaine étape

Lancer `STAB-02 - Qualité des eaux`.
