# Workspace revue cartographique simplifiee

Statut : DEV / revue metier. Aucune fusion automatique.

| Couche | Objets | Action attendue |
|---|---:|---|
| review_exact_0m | 8771 | Valider `ACCEPT_MATCH` ou basculer en `SAME_SITE_DIFFERENT_OBJECT` |
| review_very_close_2m | 126 | Revue visuelle prioritaire |
| review_different_object | 5438 | Confirmer objets distincts au meme site |
| review_orphans | 102 | Attendre correction source ou invalider geometrie |

Modifier uniquement `business_decision` et `comments` dans QGIS, puis exporter le CSV final.

## Fichiers a utiliser

Utiliser uniquement les couches simplifiees :

- `review_exact_0m.gpkg`
- `review_very_close_2m.gpkg`
- `review_different_object.gpkg`
- `review_orphans.gpkg`

Certains anciens exports par typologie peuvent rester visibles si un processus Windows les garde verrouilles. Ils ne font plus partie du workflow P0 simplifie.
