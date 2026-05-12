# Harmonisation APPORT - Frontend

## Changements

| Composant | Changement |
|---|---|
| `frontend/src/layers/config.ts` | couche `apport` avec label `Apport barrage` et unite `Mm3/j`. |
| `frontend/src/layers/layerManager.ts` | routage `apport` vers `/observatory/barrage/latest?metric=apport`. |
| `frontend/src/api/observatory.ts` | type metric et compatibilite `apports_hm3` conserves. |

## Unite dashboard

| Variable | Unite |
|---|---|
| `apport` | `Mm3/j` |

## Controle

`npm run build` : OK.

Note : avertissement Vite existant sur taille de chunk, non bloquant pour l'harmonisation APPORT.
