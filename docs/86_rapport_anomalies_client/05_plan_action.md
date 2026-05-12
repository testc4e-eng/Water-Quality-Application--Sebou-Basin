# Plan action

## Priorites

| Priorite | Action | Responsable | Delai indicatif |
|---|---|---|---|
| P1 | livrer rapport anomalies client | C4E | immediat |
| P1 | faire valider mappings IDP/GEO par client | Client + C4E | 1 a 2 semaines |
| P2 | completer referentiel qualite et unites | C4E | 1 a 2 semaines |
| P2 | documenter valeurs evaporation nulles et pollution non numerique | C4E | 1 semaine |
| P3 | dedier un chantier ingestion futures donnees | C4E | apres cloture migration |
| P3 | remplacer jeux SWAT/WASP temporaires | C4E + Client modelisation | chantier separe |

## Regles

- aucune correction destructive sans backup/audit
- aucune suppression SWAT/WASP avant decision de transition
- toute nouvelle ingestion doit passer par QA, mapping parametre, mapping GEO et rollback

