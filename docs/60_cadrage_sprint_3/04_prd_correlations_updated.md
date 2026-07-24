# Sprint 3 — PRD Corrélations multi-domaines (mise à jour)

## 1. Contexte

Le **Dashboard Carte Métier Analytique** permet déjà d'ajouter plusieurs séries temporelles au workspace et de les visualiser côte à côte. Le Sprint 3 ajoute la capacité d'analyser les **corrélations** entre ces séries, avec un objectif métier clair : identifier les relations entre paramètres qualité, hydrologie, climatologie, etc.

## 2. Objectifs

- Permettre la corrélation de **2 séries temporelles** (minimum).
- Afficher un **scatter plot**, la **régression linéaire** et les métriques **R² / Pearson r / n points / p-value**.
- Proposer un **bonus matriciel** pour 3 à 5 séries (endpoint backend prêt, UI à venir).
- Exclure explicitement les séries **POINT_MEASURE** (pollution ponctuelle).
- Gérer proprement les cas d'erreur : absence de chevauchement, série ponctuelle, série constante.

## 3. Périmètre

| Composant | Impact |
|---|---|
| Dashboard Carte Métier Analytique | ✅ Modifié |
| Dashboard DG | ❌ Aucun |
| Dashboard Qualité | ❌ Aucun |
| Backend business-map | ✅ Nouveaux endpoints |

## 4. User Stories

### US-301 — Corrélation entre deux séries
> En tant qu'analyste, je veux sélectionner deux séries temporelles de mon workspace pour afficher leur corrélation afin de détecter des relations entre paramètres.

**Critères d'acceptation :**
- Le bouton "Corrélations" est désactivé si < 2 séries TIME_SERIES.
- Le panneau permet de choisir Série X et Série Y.
- Le calcul nécessite au moins 10 points communs idéalement ; ici le MVP accepte ≥ 2 points.
- Les résultats affichent R², Pearson r, p-value, nombre de points.
- Un clic ajoute un widget de corrélation au workspace.

### US-302 — Widget de corrélation
> En tant qu'analyste, je veux que le résultat de corrélation soit matérialisé par un widget dans le workspace afin de le comparer aux autres analyses.

**Critères d'acceptation :**
- Le widget a une bordure violette distinctive.
- Il affiche le scatter plot et la ligne de régression.
- Il affiche R², r, n en entête.
- Il peut être exporté en PNG.

### US-303 — Gestion des erreurs
> En tant qu'analyste, je veux comprendre pourquoi une corrélation ne peut pas être calculée.

**Critères d'acceptation :**
- `NO_OVERLAP` : message explicite si les séries n'ont pas de période commune.
- `NOT_TIME_SERIES` : les séries ponctuelles n'apparaissent pas dans la liste.
- `NO_CORRELATION` : message si une série est constante sur la période commune.

## 5. Endpoints API

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/business-map/analysis/correlation` | Corrélation entre 2 séries |
| POST | `/api/v1/business-map/analysis/correlation/matrix` | Matrice N×N (3–5 séries) |

## 6. UX / UI

- Bouton "Corrélations" dans la toolbar du workspace, à droite de "Synchroniser temps".
- Panneau latéral droit, largeur 384 px (24 rem).
- Widget de corrélation : fond blanc, bordure violette, entête violet clair.

## 7. Non-périmètre (Sprint 3)

- Heatmap UI de la matrice de corrélation.
- Export CSV de la matrice.
- Corrélation Spearman (Pearson uniquement).

## 8. Définition de terminé

- [x] Endpoint `/correlation` fonctionnel et testé.
- [x] Endpoint `/correlation/matrix` fonctionnel.
- [x] Panneau et widget frontend implémentés.
- [x] Gestion des erreurs `NO_OVERLAP`, `NOT_TIME_SERIES`, `NO_CORRELATION`.
- [x] `npm run build` passe.
- [x] Dashboards DG/Qualité intacts.
- [x] Documentation Sprint 3 créée.
