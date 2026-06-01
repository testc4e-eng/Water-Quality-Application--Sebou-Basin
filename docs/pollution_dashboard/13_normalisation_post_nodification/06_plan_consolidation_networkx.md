# Plan de Consolidation NetworkX (Phase D.1C)

Le graphe final doit être le plus léger et le plus robuste possible.

## Évolutions
1. **Source Finale** : Basculer de `_noded` vers `_final`.
2. **Métriques de Cycle** : Intégrer un flag `is_in_cycle` pour permettre au frontend de colorer les boucles suspectes en **Violet**.
3. **Statistiques Étendues** :
   - Nombre de composants (Cible : ≤ 3).
   - % du réseau dans le composant principal (Cible : > 85%).
   - Nombre de micro-segments restants.
4. **Optimisation** : Le graphe nettoyé sera plus rapide à charger et plus fiable pour Dijkstra.
