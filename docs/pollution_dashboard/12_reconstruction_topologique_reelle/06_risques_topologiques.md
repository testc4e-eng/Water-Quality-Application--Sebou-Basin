# Risques Topologiques et Mitigation

## 1. Fragmentation résiduelle
Certains composants peuvent rester isolés si le gap est physique (espace entre lignes) et non topologique (croisement).
- **Mitigation** : Le snapping (Phase D.1A) devra être ré-appliqué *après* la nodification.

## 2. Doublons géométriques
`ST_Node` peut générer des segments en doublon si les données sources sont superposées.
- **Mitigation** : Utiliser `DISTINCT ON (ST_AsBinary(geom))` lors du Dump.

## 3. Perte d'attributs
Le découpage d'un segment peut rendre ambigu l'attribution des `Z_Min` / `Z_Max`.
- **Mitigation** : Le segment découpé héritera d'une interpolation linéaire de l'altitude ou conservera les valeurs du segment parent.
