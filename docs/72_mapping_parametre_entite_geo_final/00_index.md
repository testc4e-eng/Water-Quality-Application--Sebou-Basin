# Mapping final paramètre -> entité géographique

| Indicateur | Valeur |
|---|---:|
| Paramètres analysés | 421 |
| Paramètres canoniques distincts | 234 |
| Paramètres GEO_OK | 288 |
| Paramètres sans ref geo | 129 |
| Paramètres sans X/Y | 2 |
| Paramètres ambigus | 124 |
| Tables prêtes | 13 |
| Tables bloquées | 7 |
| Décision finale | GEO_MAPPING_BLOCKED |

## Règles de lecture

- Les anciennes données de la base officielle ne font plus autorité.
- Les conflits avec l’historique ne sont plus bloquants dans ce contrôle.
- Le seul critère ici est le rattachement `paramètre -> entité géographique`, plus les cas critiques de référentiel canonique encore manquants.
