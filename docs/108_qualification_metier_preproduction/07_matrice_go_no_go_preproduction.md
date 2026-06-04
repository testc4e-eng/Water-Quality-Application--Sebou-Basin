# Matrice GO / NO-GO préproduction

| Domaine | Statut | Dépendance | Go | No Go | Commentaire |
|---|---|---|---|---|---|
| Hydro | avancé | validation hydraulique scientifique ciblée | X |  | socle exploitable ; usages avancés conditionnés |
| Météo | avancé | complétude et validation métier minimale | X |  | température désormais intégrée, vigilance historique sur certains jeux |
| Qualité | partiellement qualifié | D2 + D4 | X |  | go possible avec règles validées |
| IDP | qualifié en partie | D1 |  | X | préproduction conditionnée par arbitrage spatial |
| Cartographie | prête DEV/P0 | D1 + validation métier finale | X |  | go partiel possible hors cas IDP non validés |
| API | stable en grande partie | dette legacy restante | X |  | vigilance sur certains segments legacy |
| Dashboards | partiellement qualifiés | validation métier des écrans P0 | X |  | go conditionné selon périmètre retenu |
| Référentiels | partiellement figés | D2 + D3 |  | X | préproduction complète conditionnée par validation |

## Lecture synthétique

- **GO conditionné** sur Hydro, Météo, Qualité, Cartographie, API et Dashboards ;
- **NO-GO partiel** sur IDP et Référentiels tant que D1, D2 et D3 ne sont pas formellement validés.

## Recommandation

Préproduction **conditionnée** plutôt que NO-GO global.
