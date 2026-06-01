# Questions métier à remonter

## Questions prioritaires
| Sujet | Question | Pourquoi c'est important |
|---|---|---|
| Segment inversé | Le segment suit-il réellement le sens aval observé ? | Décision de correction future |
| Segment plat | Le secteur est-il une plaine, retenue ou zone aménagée ? | Eviter une fausse alerte MNT |
| Confluence | Quel est l'axe principal aval ? | Corriger la logique de propagation |
| Barrage/retenue | Le segment traverse-t-il une retenue ou un ouvrage ? | Le MNT peut être non représentatif |
| Données terrain | Existe-t-il une carte ou source métier plus fiable ? | Arbitrage scientifique |

## Cas à escalader
- Décision impossible visuellement.
- Inversion suspectée sur axe principal.
- Segment plat long proche d'un barrage.
- Confluence incohérente.
- Différence forte entre MNT et logique réseau.

## Règle
Tout cas marqué `UNCERTAIN` ou `NEED_FIELD_VALIDATION` doit être relu avant correction réseau.
