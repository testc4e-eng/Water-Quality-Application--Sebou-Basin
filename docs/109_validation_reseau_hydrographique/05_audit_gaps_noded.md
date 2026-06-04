# Audit des gaps sur le réseau nœudé 2026-06-02

## Contexte

Objet audité en lecture seule :

- `geo_work.reseau_hydro_gaps_noded_20260602`

Cette table recense les gaps candidats détectés après noding du réseau métier validé.

## Liste des gaps candidats

| gap_id | node_a | node_b | component_a | component_b | distance_m | recommandation |
|---|---:|---:|---:|---:|---:|---|
| 1 | 734 | 747 | 1 | 747 | 0.03 | reconnecter |
| 2 | 240 | 241 | 30 | 241 | 0.03 | reconnecter |
| 3 | 230 | 242 | 1 | 241 | 0.06 | reconnecter |
| 4 | 562 | 576 | 32 | 576 | 0.08 | reconnecter |
| 5 | 646 | 647 | 32 | 32 | 0.10 | revue_manuelle |

## Lecture technique

- les `5` gaps candidats sont extrêmement courts, tous inférieurs à `0.10 m` ;
- `4` gaps relient des composantes distinctes et sont donc de bons candidats à reconnexion additive ;
- `1` gap reste dans une même composante, ce qui suggère plutôt un micro-décalage, un doublon local ou une micro-segmentation à contrôler manuellement.

## Décision préparatoire

Pour la version `gapfixed` :

- reconnecter uniquement les gaps `1`, `2`, `3`, `4` ;
- ne pas modifier le gap `5` ;
- documenter explicitement que le gap `5` reste en `revue_manuelle`.
