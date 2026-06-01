# Workflow arbitrage cartographique identite spatiale

## Statut

`GO_REVUE_CARTOGRAPHIQUE_DEV`  
`NOGO_FUSION_AUTOMATIQUE`

## Workflow complet

1. Ouvrir le projet QGIS du workspace cartographique.
2. Filtrer un lot prioritaire : STEP/STM, rejets, huileries, mines/decharges, IDP ou orphelins.
3. Examiner la géométrie source, le master candidat, la distance, le score et le contexte métier.
4. Renseigner le template de décision.
5. Sauvegarder les décisions métier validées.
6. Charger plus tard les décisions via `load_cartographic_decisions.py --execute`.
7. Produire un rapport de couverture.
8. Préparer seulement ensuite un pipeline de fusion contrôlé.

## Rôle reviewer cartographique

- Vérifier la cohérence visuelle.
- Comparer le point source et le master candidat.
- Identifier les cas de superposition non fusionnable.
- Renseigner une décision traçable.
- Signaler les besoins terrain/topologie.

## Rôle validation métier

- Confirmer les règles de rattachement.
- Valider les décisions `ACCEPT_MATCH`, `KEEP_SEPARATE`, `CREATE_NEW_MASTER_SITE`.
- Escalader les conflits bloquants.

## Rôle DG

- Arbitrer les cas critiques ou structurants.
- Valider les choix impactant les dashboards PREPROD/PROD.

## Critères de fusion future

Fusion future possible seulement si :

- décision `ACCEPT_MATCH` ou `DUPLICATE_SOURCE_RECORD`;
- `future_merge_allowed=true`;
- `geometry_checked=true`;
- `status=VALIDATED_METIER` ou `VALIDATED_DG`;
- aucun conflit topologique ou terrain ouvert.

## Critères PREPROD

PREPROD possible si :

- lots prioritaires STEP/STM, rejets et mines/decharges validés;
- orphelins critiques classés;
- aucun `HIGH_RISK` bloquant sur couche métier officielle;
- décision QA exportée et chargeable;
- endpoints DEV conservés en parallèle.

## Risques

- Fusion abusive d'objets superposés mais métier distincts.
- Géométrie officielle SRID 0 mal interprétée.
- Lot IDP massif difficile à valider manuellement.
- Orphelins sans géométrie non représentables en carte.

## Backlog

- Interface web de revue MapLibre.
- Export différentiel par reviewer.
- Pipeline de génération de liens `source_link`.
- Apprentissage futur par IA sur décisions validées.

## Automatisation future

Les décisions validées pourront alimenter :

- création de liens source -> master;
- génération de nouveaux master sites;
- désactivation logique de doublons;
- entraînement de scores de matching;
- symbologie QA dans les dashboards métier.
