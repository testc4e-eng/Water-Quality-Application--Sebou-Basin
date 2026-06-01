# GO/NOGO frontend dashboard cartographique métier

## Décision DEV

`GO_DEV_DEMO_P0_1`

La route `/dashboard-carto-metier` est prête pour une démonstration DEV contrôlée.

## Ce qui fonctionne

- Catalogue métier chargé depuis `/api/v1/map/catalog`.
- Navigation principale alignée métier :
  - Stations ;
  - Inventaire sources pollution ;
  - Campagne de mesures pollution.
- Chargement explicite des entités via `/api/v1/map/entities`.
- Carte MapLibre avec GeoJSON.
- Popup entité avec métadonnées, source backend, latest values et classification si disponible.
- Panneau latéral détail.
- Symbologie réglementaire ou metadata.
- Build frontend validé.
- P0.1 : support `stations.barrage` présélectionné et chargé au démarrage après réception du catalogue.
- P0.1 : fit bounds automatique et message clair si aucune entité n’est retournée.
- P0.1 : erreurs API enrichies avec endpoint, paramètres, status HTTP et message backend.

## Tests exécutés

| Test | Résultat |
|---|---|
| `npm run build` | OK |
| `GET /api/v1/map/catalog` | 200 |
| `GET /api/v1/map/entities?group_code=stations&support_code=barrage&limit=5` | 200, 5 features |
| `GET /api/v1/map/entities?group_code=inventaire_source_pollution&support_code=point_mesures&limit=5` | 200, 5 features |
| `GET /api/v1/map/entities?group_code=inventaire_mesures_pollution&support_code=point_prelevement&limit=5` | 200, 5 features |
| `GET /api/v1/map/latest-values?support=idp_pollution&parameter_code=DBO5&limit=5` | 200 |
| `GET /api/v1/map/classification?parameter_code=DBO5&value=10&unit=mg/L` | 200 |
| Ouverture navigateur `/dashboard-carto-metier` via Vite | OK route rendue ; validation popup complète à refaire avec serveur FastAPI HTTP DEV lancé |

P0.1 :

| Test | Résultat |
|---|---|
| `GET /api/v1/map/entities?group_code=stations&support_code=barrage&limit=5` | 200, 5 features |
| `GET /api/v1/map/entities?group_code=inventaire_source_pollution&support_code=point_mesures&limit=5` | 200, 5 features |
| `GET /api/v1/map/entities?group_code=inventaire_mesures_pollution&support_code=point_prelevement&limit=5` | 200, 5 features |

## NOGO préproduction

Préproduction non recommandée tant que :

- arbitrages spatiaux métier non finalisés ;
- couverture latest values non homogène sur tous les supports ;
- validation navigateur métier non faite ;
- optimisation bundle non traitée si les temps de chargement DEV deviennent gênants.

## Risques

| Risque | Niveau | Mitigation |
|---|---|---|
| Bundle principal volumineux | WARNING | lazy-load de pages lourdes en P1 |
| Classification absente sur certains supports | INFO | afficher non classifiable sans bloquer |
| Supports métier sans données selon environnement | WARNING | `data_status` et messages backend |
| Séries temporelles non branchées | INFO | placeholder P1 explicite |

## Prochaines actions P1

1. Validation navigateur avec backend DEV réel.
2. Ajout endpoint timeseries métier.
3. Lazy loading de `/dashboard-carto-metier` si nécessaire.
4. Ajout couches contexte bassin/réseau hydro.
5. Tests UX avec l’équipe métier sur les supports P0.
