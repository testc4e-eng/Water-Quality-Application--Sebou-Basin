# Arbitrage métier du gap résiduel 2026-06-02

## Contexte

La meilleure version technique actuelle du réseau est :

- `geo_work.reseau_hydro_edges_gapfixed_20260602`

Un seul gap candidat reste présent dans :

- `geo_work.reseau_hydro_gaps_gapfixed_20260602`

Ce gap n’a pas été reconnecté automatiquement car il est situé dans la même composante et correspond probablement à un micro-décalage, un doublon local ou une micro-segmentation à arbitrer métier/cartographie.

## Localisation du gap

Résumé du gap résiduel :

| Indicateur | Valeur |
|---|---|
| `node_a` | `225` |
| `node_b` | `495` |
| `component_a` | `3` |
| `component_b` | `3` |
| Distance | `0.1046 m` |
| Recommandation actuelle | `revue_manuelle` |

Emprise locale approximative en `EPSG:26191` :

| Coordonnée | Valeur |
|---|---:|
| `min_x` | `571639.05` |
| `min_y` | `431348.76` |
| `max_x` | `571639.13` |
| `max_y` | `431348.83` |

Géométries exportées pour QGIS :

- `gap_points`
- `gap_candidate_line`
- `segments_context_50m`
- `reseau_gapfixed_readonly`

GeoPackage :

- `C:\dev\WQDSS\data\arbitrage_reseau_hydro\gap_residuel_20260602.gpkg`

## Pourquoi ce gap est en revue manuelle

Ce gap relie :

- deux nœuds terminaux ;
- dans la même composante connectée ;
- à une distance quasi nulle (`10 cm` environ).

Le contexte immédiat contient `6` segments dans un rayon de `50 m`, dont plusieurs micro-segments déjà issus du noding fin :

- `gid 613` longueur `0.1492 m`
- `gid 615` longueur `0.0836 m`
- `gid 616` longueur `0.0210 m`

Lecture technique :

- il peut s’agir d’un doublon local ou d’une micro-discontinuité graphique ;
- une reconnexion automatique supplémentaire risquerait de figer une erreur de dessin si les deux extrémités ne doivent pas être fusionnées ;
- une correction cartographique manuelle dans QGIS peut être plus propre si la géométrie métier doit être redessinée.

## Décision attendue

L’arbitrage métier/cartographique attendu doit choisir une seule option :

### `RECONNECTER`

À choisir si :

- les deux nœuds représentent bien une continuité hydraulique unique ;
- aucune séparation métier n’est voulue ;
- la micro-lacune provient d’un défaut de dessin.

### `IGNORER`

À choisir si :

- le gap ne gêne pas le comportement métier attendu ;
- les deux extrémités doivent rester distinctes ;
- la micro-discontinuité est acceptable comme état documentaire.

### `CORRECTION_QGIS`

À choisir si :

- la géométrie doit être redessinée localement ;
- une simple micro-ligne de reconnexion n’est pas satisfaisante ;
- le réseau métier doit être corrigé à la source cartographique avant toute nouvelle dérivation topologique.

## Consigne de validation métier

Dans QGIS :

1. ouvrir `C:\dev\WQDSS\data\arbitrage_reseau_hydro\gap_residuel_20260602.gpkg`
2. afficher les couches `gap_points`, `gap_candidate_line`, `segments_context_50m`, `reseau_gapfixed_readonly`
3. zoomer sur l’emprise du gap
4. vérifier si `node_a=225` et `node_b=495` doivent être fusionnés
5. consigner une décision unique :
   - `RECONNECTER`
   - `IGNORER`
   - `CORRECTION_QGIS`
6. reporter la décision dans le fichier SQL préparatoire avant toute action technique ultérieure

## Sortie attendue après arbitrage

Après retour métier, exécuter uniquement la branche correspondante du script préparatoire :

- `database/sql/109_validation_reseau_hydrographique/apply_gap_residuel_decision_20260602.sql`

Ce script reste volontairement en `ROLLBACK` par défaut et ne doit pas être appliqué tel quel sans validation finale.
