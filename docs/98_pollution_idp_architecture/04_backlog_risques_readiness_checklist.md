# Backlog, risques, readiness et checklist

## Backlog

1. stabiliser `api.v_pollution_sources` ;
2. définir la table ou vue réelle des points non résolus ;
3. brancher les écrans React pollution hors mocks ;
4. définir popups et légendes métier ABH ;
5. définir métriques de résolution GEO et de qualité QA.

## Risques

| Risque | Impact | Gravité | Réponse |
|---|---|---|---|
| fusion constat / analyses | perte de sens métier | élevée | séparation stricte |
| géométrie incomplète | carte partielle | élevée | couche non résolus dédiée |
| pollution non numérique | perte de trace labo | moyenne | conserver `valeur_raw` |
| mélange avec qualité courante | UX confuse | élevée | module pollution isolé |

## Readiness

- architecture pollution / IDP : `GO_CONCEPTION_DETAILLEE`
- cartographie métier : `READY_FOR_WIREFRAMES`
- API cible : `READY_FOR_BACKLOG_TECHNIQUE`
- frontend cible : `READY_FOR_BACKLOG_TECHNIQUE`

## Checklist validation

| Question | Oui/Non | Commentaire |
|---|---|---|
| La séparation constat / analyse finale est-elle validée ? | | |
| La couche points non résolus est-elle jugée nécessaire ? | | |
| Le workflow GEO progressif est-il acceptable ? | | |
| Les APIs cibles couvrent-elles les usages métier ? | | |
| Les composants frontend cibles sont-ils suffisants ? | | |
