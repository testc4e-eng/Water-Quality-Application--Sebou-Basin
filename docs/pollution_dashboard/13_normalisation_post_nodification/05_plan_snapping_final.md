# Plan de Snapping Final Contrôlé

Le snapping intervient en dernière étape pour "combler" les derniers gaps physiques du réseau.

## Seuils de Snapping
| Distance | Statut | Action |
| :--- | :--- | :--- |
| **< 5m** | **AUTO** | Snapping automatique via `ST_Snap`. |
| **5-10m** | **CONTROLLED** | Snapping si `sous_bassin` identique. |
| **10-25m** | **MANUAL** | Requiert une validation visuelle en mode QA. |
| **> 25m** | **FORBIDDEN** | Aucune connexion automatique autorisée. |

## Précautions
- Interdiction de connecter deux bassins versants différents.
- Préservation du composant `ISOLATED_ACCEPTED` documenté en Phase D.1.
