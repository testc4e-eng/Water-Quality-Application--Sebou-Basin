# Performance du Moteur de Routage

## Environnement
- Machine : Windows local (développement)
- PostgreSQL : 127.0.0.1, base `abh_sad`
- Python : 3.14.2 / networkx 3.6.1

## Métriques

| Indicateur | Valeur |
|---|---|
| **Temps de chargement du graphe** | ~0.43 s |
| **Temps de routage T1** | 0.107 s |
| **Temps de routage T2** | < 0.2 s |
| **Mémoire graphe (estimée)** | < 5 MB (267 nœuds × ~18KB/nœud) |
| **Edges dans composant principal** | 266 |
| **Edges total** | 697 |
| **Composants** | 35 |

## Optimisations Déjà en Place
- **Singleton cache** : Le graphe est chargé une seule fois en mémoire au premier appel. Les appels suivants retournent directement l'objet NetworkX en RAM.
- **Composant principal only** : Seul le plus grand composant connexe est chargé (266 edges vs 697 total), réduisant la mémoire et les erreurs de routage.
- **Target node cached** : Le nœud du barrage de garde est calculé une fois et mis en cache global (`_cached_target_node`).

## Limites Actuelles
- Le graphe n'est **pas rechargé automatiquement** si `geo_work` est modifié. Un redémarrage Uvicorn ou l'appel à `graph_builder.reload()` est nécessaire.
- Les 34 sous-composants isolés couvrent ~61% du réseau — des clics dans ces zones retourneront `status: partial`.
