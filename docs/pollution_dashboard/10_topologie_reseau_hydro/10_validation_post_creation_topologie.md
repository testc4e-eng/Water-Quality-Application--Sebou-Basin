# Validation Post-Création de la Topologie

## Date de validation : 2026-05-12

## Validation Structure

| Indicateur | Valeur | Statut |
|---|---:|---|
| Total edges (geo_work) | 697 | ✅ |
| Edges avec source/target | 697 | ✅ |
| Total nodes (geo_work) | 732 | ✅ |
| Self-loops (source = target) | 0 | ✅ |
| SRID | 26191 | ✅ |
| Géométries invalides | 0 | ✅ |

## Validation Connectivité (Graphe NetworkX)

| Indicateur | Valeur |
|---|---:|
| **Nœuds composant principal** | 267 |
| **Arêtes composant principal** | 266 |
| **Composants totaux** | 35 |
| **Sous-réseaux isolés** | 34 |
| **Cycles détectés** | Aucun (DiGraph acyclique) |

> [!WARNING]
> Le réseau est fragmenté en **35 composants**. Le composant principal (267 nœuds) représente environ 38% du réseau total. Les 34 sous-réseaux isolés correspondent probablement à des affluents non numérisés jusqu'à leur confluence. Ce sera l'objet d'un futur audit SIG.

## Validation Écoulement

Tous les 697 tronçons ont `flow_status = 'FLOW_PROBABLE'` (valeur par défaut Phase C). La distinction `FLOW_CONFIRMED` / `FLOW_REVERSED_SUSPECTED` nécessitera le croisement avec le MNT (Z_Min/Z_Max) dans une Phase D.

## Méthode de Snapping Retenue

Après un premier essai avec `ST_SnapToGrid(geom, 5.0)` qui produisait seulement 192 nœuds connectés (trop de fusion), la méthode retenue est `ST_ClusterDBSCAN(p, eps=50, minpoints=1)`. Cette approche :
- Tolère un gap de 50m entre extrémités de lignes (réaliste pour la digitalisation)
- Produit 732 nœuds distincts
- Aucun self-loop
