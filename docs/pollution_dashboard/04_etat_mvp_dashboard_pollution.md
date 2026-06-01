# État du MVP Dashboard Pollution

Le système actuel constitue une base très solide (environ 65% d'un MVP démontrable global), prêt pour des présentations métier et des validations d'interface.

## Matrice de Maturité des Fonctionnalités

| Composant / Fonctionnalité | Statut | Type de logique | Remarques / Dette |
| :--- | :---: | :--- | :--- |
| **Carte Interactive (MapLibre)** | ✅ Stable | Réelle | Excellente réactivité. HMR opérationnel. |
| **Flux GeoJSON (Réseau, Stations)**| ✅ Stable | Réelle | API performante, reprojection WGS84 résolue. |
| **Filtres Métier (Hydrologiques)** | ✅ Stable | Réelle | Filtrage Frontend efficace. |
| **UI Dashboard & Synchronisation** | ✅ Stable | Réelle | L'UX est claire, les composants communiquent bien. |
| **Sélection Point d'Impact** | ✅ Stable | Réelle | Clic carte capture la vraie longitude/latitude. |
| **Propagation Aval (Routage)** | ⚠️ Partiel | **Mockée** | Basée sur la longitude (Est-Ouest). Topologie ignorée. |
| **Tracé Réseau (Ligne d'impact)** | ⚠️ Partiel | **Mockée** | Vecteur droit dessiné au lieu de suivre le réseau. |
| **Calcul Temps d'Arrivée (ETA)** | ❌ Fictif | **Mockée** | Vitesse constante + Distance euclidienne approximée. |
| **Calcul de Concentration/Dilution**| ❌ Absent | N/A | Non implémenté dans le MVP. |

## Risques Principaux
- **Biais de Perception** : L'interface est très aboutie visuellement, ce qui donne l'illusion aux utilisateurs non techniques que le moteur scientifique sous-jacent est déjà opérationnel. **Il est vital de communiquer qu'il s'agit d'une simulation purement démonstrative à ce stade.**
