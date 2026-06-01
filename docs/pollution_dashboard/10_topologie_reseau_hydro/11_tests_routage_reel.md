# Tests de Routage Réel — Barrage de Garde Sebou

## Date : 2026-05-12 | Méthode : NetworkX Dijkstra (weight=length_m)

### Résultats des Tests

| Test | Point Départ | Status | Arêtes | Longueur | ETA (fictif) | Notes |
|---|---|---|---:|---:|---|---|
| T1 — Amont Fès | -5.0°, 34.1° | ✅ success | 68 | 368.82 km | +36h52m | Chemin complet trouvé |
| T2 — Milieu Sebou | -5.5°, 34.3° | ✅ success | N/A | 218.40 km | +21h50m | Chemin partiel trouvé |
| T3 — Proche barrage | -6.2°, 34.4° | ⚠️ partial | 0 | 0 km | N/A | Sous-réseau isolé |

### Analyse

**Test T1 (Amont Fès → Garde Sebou)** : Premier routage réussi avec 68 tronçons traversés sur 368 km. La longueur élevée indique que le chemin NetworkX passe par plusieurs segments mal orientés ou utilise des chemins détournés (le réseau n'est pas encore orienté amont→aval).

**Test T3 (Échec attendu)** : Le point proche du barrage de garde tombe dans un sous-composant isolé. Ce cas est géré proprement par le backend qui retourne `status: "partial"` + message explicatif.

### Nœud Barrage de Garde Retenu

- **Entité** : `v_barrage_dimension.legacy_barrage_id = 51` ("brg garde du sebou")
- **Fallback** : `v_station_dimension.legacy_station_id = 52` ("brg de garde / sebou")
- **Nœud graph** : Calculé dynamiquement par `ST_Distance` au démarrage de l'API (cached)
- **Ambiguïté** : Les entités 51 et 52 représentent très probablement le même ouvrage. Décision métier finale requise pour figer le nœud cible officiel.
