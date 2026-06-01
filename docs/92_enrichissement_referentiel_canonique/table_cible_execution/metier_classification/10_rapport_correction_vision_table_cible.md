# Rapport - correction de la vision `table_cible`

## Limite de la proposition precedente

La proposition initiale raisonnait surtout en regroupement technique :

- `57` parametres qualite vers une seule vue ;
- `5` parametres meteo ;
- `1` parametre barrage.

Cette approche est correcte pour une exposition minimale, mais trop faible pour :

- le frontend cible ;
- l'API metier ;
- l'ingestion future ;
- la QA par famille ;
- l'IA / recherche semantique.

## Nouvelle vision

La nouvelle classification introduit :

- domaine ;
- sous-domaine ;
- type de mesure ;
- support spatial ;
- origine de la mesure ;
- front cible ;
- niveau de fiabilite ;
- vue/API metier.

## Gains attendus

| Axe | Gain |
|---|---|
| Frontend | ecrans plus lisibles et filtres coherents |
| API | endpoints specialises, stables, documentables |
| Ingestion | routage naturel des batches et quarantaines |
| QA | controles specifiques par famille de parametres |
| IA | referentiel semantique plus exploitable |

## Impacts

- `api.v_qualite_dashboard_global` devient une vue de synthese, pas la seule vue qualite.
- Les metaux, microbiologie, nutriments et terrain doivent etre separes.
- Pollution/IDP doit etre traite comme domaine a part, pas comme simple qualite.
- SWAT/WASP restent un module de modelisation distinct.

## Prochaines etapes

1. Valider les decisions listees dans `09_decisions_a_valider_yassine.md`.
2. Produire les SQL de vues metier fines.
3. Recalculer la proposition `table_cible` avec vues metier precises.
4. Ensuite seulement, preparer l'UPDATE referentiel.
