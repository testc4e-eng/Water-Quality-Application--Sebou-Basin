# Index - geo corr plan avant E0

## Synthese

| Indicateur | Valeur |
|---|---:|
| Lignes IDP testees | 8899 |
| Rattachees <= 2 m | 816 |
| Ambigues <= 2 m | 3790 |
| Orphelines apres buffer 2 m | 4293 |
| Taux global de rattachement geo | 99.27% |

## Decision

**GEO_BLOCKED**

## Regles appliquees

- IDP 2024 : rattachement par coordonnees X/Y avec buffer strict <= 2 m.
- Incoherences geo : traitement une par une, sans correction automatique.
- Problemes geometriques/spatiaux : flags QA, non bloquants par defaut si rattachement unique.
