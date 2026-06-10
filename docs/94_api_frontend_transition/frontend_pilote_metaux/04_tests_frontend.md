# Tests frontend

## Tests à exécuter

| Test | Statut | Résultat |
|---|---|---|
| Compilation Vite | OK | `npm run build` exécuté le 2026-05-13. |
| Type-check global | BLOQUE_EXISTANT | `npx tsc --noEmit` échoue sur des erreurs legacy hors pilote. |
| Route `/qualite/metaux` | A_VALIDER_NAVIGATEUR | Validation manuelle après démarrage Vite. |
| Chargement API | A_VALIDER_BACKEND | Nécessite backend disponible sur `VITE_API_BASE_URL` ou `127.0.0.1:8000/api/v1` (`8011` obsolète). |
| Filtres | A_VALIDER_NAVIGATEUR | Date, support, paramètre, QA, limite. |
| Pagination | A_VALIDER_NAVIGATEUR | Boutons précédent/suivant. |
| Graphique | A_VALIDER_NAVIGATEUR | Séries visibles si données disponibles. |

## Résultat d'exécution

Commande exécutée :

```powershell
npm run build
```

Résultat :

- Build Vite OK.
- 3037 modules transformés.
- Aucune erreur TypeScript/Vite bloquante.
- Avertissement non bloquant : chunk principal supérieur à 500 kB. Recommandation P1/P2 : introduire du code-splitting par routes avant généralisation des écrans spécialisés.

## Type-check global

Commande exécutée :

```powershell
npx tsc --noEmit
```

Résultat :

- Echec global existant hors pilote.
- Exemples de familles d'erreurs : typage `unknown` dans `src/api/analytics.ts` et `src/services/ingestionService.ts`, composants Climate legacy, exports manquants dans `Dashboard1.tsx`, configuration `frontend/src/router.tsx`.
- Aucune erreur remontée sur les fichiers du pilote `qualite/metaux`.
