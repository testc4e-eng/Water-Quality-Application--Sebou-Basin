# Plan de Nodification du Réseau

## Stratégie Technique
L'objectif est de transformer le réseau hydrographique original (`geo.reseau_hydrographique`) en un ensemble de segments parfaitement découpés à chaque intersection.

### 1. Préparation (UnaryUnion)
Utiliser `ST_UnaryUnion` pour fusionner les géométries et éliminer les recouvrements parfaits.

### 2. Nodification (ST_Node)
Appliquer `ST_Node` pour insérer des points d'inflexion (nœuds) à chaque intersection géométrique.

### 3. Explosion (ST_Dump)
Éclater les MultiLineStrings résultantes en LineStrings simples. Chaque LineString sera garantie de ne pas avoir d'intersection interne.

### 4. Reconstruction Topologique
- Générer les nœuds terminaux (ST_StartPoint, ST_EndPoint).
- Assigner `source` et `target`.
- Recalculer les longueurs et préserver les attributs (Z_Min, Z_Max).
