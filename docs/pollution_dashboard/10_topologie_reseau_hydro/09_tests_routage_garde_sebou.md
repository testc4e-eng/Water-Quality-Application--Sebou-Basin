# Routage vers Barrage de Garde Sebou

## 1. Cible Officielle Routage Barrage de Garde
Le point final (puits/target) de toute pollution s'écoulant dans l'oued principal est le Barrage de Garde de Sebou. L'audit a identifié plusieurs entités pour cette zone :

- **Entité retenue (Station)** : `legacy_station_id: 52` | "brg de garde / sebou" | IRE: `3323/8`
- **Entité synonyme (Barrage)** : `legacy_barrage_id: 51` | "brg garde du sebou" | Code: `3546/8`
- **Point annexe amont** : `legacy_station_id: 341` | "P29 a allal tazi" | IRE: `1355/8` (Confirmé métier Allal Tazi).
- **Point annexe amont 2** : `legacy_station_id: 94` | "amont barrage de garde" | IRE: `3738/8`

**Décision métier requise** : Définir si le routage stoppe mathématiquement sur le `node` le plus proche de la station 52, ou sur le barrage 51. Pour la Phase B, nous considérerons les deux points comme constituant la "Zone d'arrêt" (Target Buffer).

## 2. Options de Routage Comparées

| Option | Précision | Effort | Risque | Recommandation |
|---|---|---|---|---|
| **OPTION 1 — pgRouting** | Exacte (Dijkstra/A*) | Moyen (Installation requise) | Bloquant si droits serveur manquants | Recommandée si OPs le permet. |
| **OPTION 2 — SQL Récursif** | Exacte (CTE orienté) | Élevé (Requête lourde) | Performance/Timeout | **Recommandée par défaut** si pgRouting absent. Gérable si le graphe est correctement orienté. |
| **OPTION 3 — NetworkX Python** | Exacte | Moyen | Perte de synchro mémoire/DB | Plan C si le SQL récursif est trop lent. |

## 3. Contrat API Futur (Phase D)
L'endpoint de simulation basculera de l'Option D (Approximation) à l'Option Topologique via une nouvelle signature :
`GET /api/v1/routing/downstream-to-garde?lng=...&lat=...`

Cet endpoint retournera le tracé **réellement connecté** du point d'impact jusqu'au barrage de garde.
