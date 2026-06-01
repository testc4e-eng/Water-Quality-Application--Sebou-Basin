# Analyse géométrique et doublons

## Qualité géométrique

| Couche | Géométrie | CRS | Entités | Géom nulles | Géom vides | Géom invalides | Min X | Max X | Min Y | Max Y |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| idp_src_pollution_globale | Point | EPSG:26191 | 243 | 36 | 0 | 0 | 379171.0 | 633742.0 | 294194.0 | 495449.0 |
| idp_src_pollution_marche_cadre | Point | EPSG:26191 | 3614 | 0 | 0 | 0 | 377613.0 | 626964.0 | 283900.0 | 491230.0 |
| idp_mesures_qualité_marche_cadre_2024 | Point | EPSG:26191 | 3614 | 0 | 0 | 0 | 377613.0 | 626964.0 | 283900.0 | 491230.0 |
| idp_mesures_qualité_globale_2024 | Point | EPSG:26191 | 4894 | 275 | 0 | 0 | 392616.0 | 633742.0 | 300449.0 | 495449.0 |

## Doublons détectés

| Type | Nombre de paires candidates |
|---|---:|
| DUPLICATE_EXACT | 359945 |
| DUPLICATE_NEAR <= 5 m | 729 |
| DUPLICATE_NEAR <= 10 m | 729 |
| DUPLICATE_NEAR <= 25 m | 729 |

Les fichiers `duplicate_exact.csv` et `duplicate_near.csv` contiennent les paires candidates. Aucune suppression automatique n'a été réalisée.

## Classification recommandée

- `DUPLICATE_EXACT` : même coordonnée X/Y.
- `DUPLICATE_NEAR` : distance positive dans les seuils 5/10/25 m.
- `SAME_SITE_DIFFERENT_SOURCE` : proximité spatiale avec attributs métier divergents.
- `INVENTORY_TO_MEASURE_MATCH` : rapprochement inventaire ↔ mesure à score élevé.
- `POSSIBLE_MATCH` : rapprochement plausible nécessitant validation.
- `UNIQUE` : aucun candidat détecté.
- `TO_VALIDATE` : incohérence ou ambiguïté métier.
