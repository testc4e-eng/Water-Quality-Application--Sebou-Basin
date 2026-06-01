# Synthèse architecture UX

## Vues cibles

| Vue | Public | Priorité |
|---|---|---|
| Dashboard DG | DG / cadres | état récent, critiques, alertes |
| Dashboard analyste | analystes / ingénieurs | exploration multi-support et multi-période |
| Dashboard métier | équipes techniques | campagnes, détails, QA, consultation |
| Carte opérationnelle | transversal | anomalies + alertes + focus récent |

## Principes

- la carte montre d'abord l'essentiel ;
- l'historique est secondaire et volontaire ;
- aucune donnée n'est chargée avant action utilisateur sur les écrans spécialisés ;
- les anomalies et alertes doivent être visibles avant les tables détaillées ;
- la timeline sert à naviguer dans la fraîcheur, pas à déclencher des chargements massifs implicites.

## APIs cibles prioritaires

- `/api/v1/qualite/metaux`
- `/api/v1/qualite/chimie-minerale`
- `/api/v1/qualite/physicochimie`
- `/api/v1/qualite/pollution-organique`
- `/api/v1/hydro/barrages/parametres` cible
- `/api/v1/pollution/constat-prealable` cible
- `/api/v1/idp/points` cible

## Readiness

- prototype V1 : `READY`
- architecture V2 : `GO_CONCEPTION_DETAILLEE`
