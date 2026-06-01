# Backlog, risques, readiness et checklist

## Backlog

1. préciser les schémas techniques staging / quarantaine ;
2. définir les contrats batch et identifiants de version ;
3. cadrer l'API de revue GEO ;
4. préparer les dashboards d'exploitation ingestion ;
5. formaliser le mapping alias complet et ses règles de gouvernance.

## Risques

| Risque | Impact | Gravité | Réponse |
|---|---|---|---|
| mapping alias incomplet | lignes non publiables | élevée | validation référentiel obligatoire |
| absence quarantaine | correction manuelle opaque | élevée | quarantaine native |
| GEO ambigu | publication carto erronée | élevée | workflow GEO séparé |
| rollback non cadré | perte de traçabilité | élevée | batch versionné |

## Readiness

- architecture ingestion : `GO_CONCEPTION`
- QA / GEO / rollback : `READY_FOR_SPEC_DETAIL`
- APIs ingestion futures : `READY_FOR_BACKLOG_TECHNIQUE`

## Checklist validation

| Question | Oui/Non | Commentaire |
|---|---|---|
| Le workflow batch est-il clair ? | | |
| La quarantaine est-elle suffisante ? | | |
| Le workflow GEO est-il séparé du QA général ? | | |
| Le rollback est-il batch-centric ? | | |
| Les dashboards ingestion futurs couvrent-ils l'exploitation ? | | |
