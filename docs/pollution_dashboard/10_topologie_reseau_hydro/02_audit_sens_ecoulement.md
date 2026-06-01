# Audit : Sens d'Écoulement

Pour qu'un modèle de pollution fonctionne, le parcours du graphe doit impérativement s'effectuer de l'amont vers l'aval. L'orientation des lignes digitalisées (de `ST_StartPoint` vers `ST_EndPoint`) correspond-elle au sens d'écoulement naturel ?

## Sources Disponibles
- **Altitudes** : Présence des colonnes `Z_Min`, `Z_Max`, et `Pente`.
- **Analyse** : Si `Z_Start > Z_End` (en supposant que `Z_Max` = Start et `Z_Min` = End), alors la ligne est digitalisée dans le bon sens.
- **Direction vers l'océan** : L'oued Sebou s'écoule globalement vers l'Ouest (Océan Atlantique).

## Classification Proposée (`flow_status`)
- `FLOW_CONFIRMED` : `Z_Max` -> `Z_Min` correspond à `ST_StartPoint` -> `ST_EndPoint`.
- `FLOW_PROBABLE` : Pas de Z fiable, mais direction Ouest confirmée.
- `FLOW_UNKNOWN` : Segments plats ou direction ambiguë.
- `FLOW_REVERSED_SUSPECTED` : `Z_Min` est au `ST_StartPoint` (la ligne remonte la pente).

## Actions
Une colonne `needs_reverse boolean` sera ajoutée dans la table de travail `geo_work.reseau_hydro_edges_raw`. Elle permettra d'appliquer dynamiquement `ST_Reverse(geom)` uniquement sur les tronçons problématiques sans modifier la source.
