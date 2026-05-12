# Phase 5 - Frontend refactor

## Perimetre

Les couches dashboard barrage utilisent maintenant les metriques metier parametriques.

| Fichier | Changement |
|---|---|
| `frontend/src/layers/config.ts` | Ajout/alignement des couches `lacher_barrage`, `apports_hm3`, `transfert` avec unites `Mm3/j`. |
| `frontend/src/layers/layerManager.ts` | Routage des couches barrage vers `/observatory/barrage/latest` avec metrique metier. |

## Unites dashboard

| Couche | Unite affichee |
|---|---|
| `niveau_barrage` | `m` |
| `volume_barrage` | `Mm3` |
| `lacher_barrage` | `Mm3/j` |
| `apports_hm3` | `Mm3/j` |
| `transfert` | `Mm3/j` |

## Controle

`npm run build` : OK.

Note : Vite signale un chunk superieur a 500 kB. Cet avertissement est hors perimetre barrage et n'est pas bloquant pour la Phase 5.
