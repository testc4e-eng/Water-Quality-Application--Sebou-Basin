# Note de clôture C1 IDP

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | note de clôture |
| Périmètre | clôture C1-B IDP et gouvernance du résiduel global |
| Source de vérité | Oui, pour la décision de clôture C1 |
| Date de décision | 2026-06-04 |

## Décision validée

Le périmètre `C1-B` d'arbitrage spatial final IDP est clôturé en DEV.

Statut retenu :

```text
C1-B = COMPLETED_DEV_DB_CONFIRMED
```

Le résiduel global IDP reste ouvert hors du périmètre de clôture C1-B.

Statut retenu :

```text
C1_GLOBAL = PARTIAL_DB_CONFIRMED
```

## Preuves DB vérifiées

Les preuves ci-dessous ont été vérifiées en lecture seule dans `abh_sad` :

- `qa.spatial_identity_decisions_cartographic` : `105` décisions métier validées ;
- `102` décisions `CREATE_NEW_MASTER_SITE` ;
- `3` décisions `ACCEPT_MATCH` ;
- `geo.ref_site_pollution` : `75` sites maîtres `IDP-C1B-*` créés ;
- `geo.ref_site_pollution_source_link` : `105` liens source -> site créés ;
- `qa.v_true_ambiguous_cases` : `491` résiduels réels seulement, contre `14366` lignes brutes encore présentes dans `qa.spatial_identity_conflicts`.

## Lecture correcte du résiduel

Les tables QA brutes et la vue de résiduel métier ne portent pas le même sens :

- `qa.spatial_identity_conflicts` contient encore `14366` lignes `PENDING` ;
- `qa.spatial_identity_orphans` contient `590` lignes, dont `102 CREATE_MASTER` et `488 PENDING` ;
- `qa.v_true_ambiguous_cases` réduit le résiduel opérationnel réel à `491` cas :
  - `3` conflits `TO_VALIDATE` ;
  - `488` orphelins `WAIT_SOURCE_FIX`.

Les `3` conflits encore visibles dans `qa.v_true_ambiguous_cases` ont déjà une décision cartographique `ACCEPT_MATCH` chargée dans `qa.spatial_identity_decisions_cartographic`. Il s'agit d'un écart de réconciliation de statut QA, pas d'un arbitrage métier non traité.

Les `102` orphelins en statut `CREATE_MASTER` correspondent aux `102` décisions `CREATE_NEW_MASTER_SITE` déjà validées.

## Gouvernance du résiduel global

### 1. Doubles exacts

Les `14239` lignes `DUPLICATE_EXACT` de `qa.spatial_identity_conflicts` ne constituent pas un arbitrage métier C1-B. Elles relèvent d'un chantier technique de consolidation des doublons historiques.

Statut retenu :

```text
IDP_DUPLICATE_CONSOLIDATION = OPEN
```

Objectifs :

- fusionner les doublons exacts ;
- conserver un seul enregistrement de référence ;
- préserver le lineage et la traçabilité ;
- réduire les doubles comptages ;
- éviter les biais analytiques et ML.

### 2. Possible match

Les `124` lignes `POSSIBLE_MATCH` restent potentiellement fusionnables, mais ne bloquent pas la préproduction du périmètre `C1-B`.

Statut retenu :

```text
IDP_POSSIBLE_MATCH_REVIEW = OPEN
```

Objectifs :

- échantillonnage ;
- revue métier progressive ;
- validation ou rejet de fusion.

### 3. Wait source fix

Les `488` lignes `WAIT_SOURCE_FIX` sont des objets sans géométrie exploitable :

- `488/488` sans `source_geom` ;
- `488/488` sans `source_commune` ;
- `recommended_action = WAIT_SOURCE_FIX`.

Ces objets sont non arbitrables spatialement et sortent du périmètre C4E.

Statut retenu :

```text
WAIT_SOURCE_FIX = CLIENT_REQUIRED_DATA_FIX
```

Ils doivent rester :

- historisés ;
- traçables ;
- documentés ;
- exportables pour rapport client.

Ils ne doivent pas être utilisés dans :

- frontend ;
- dashboards ;
- KPI ;
- analyses spatiales ;
- graphes de propagation ;
- scénarios ;
- datasets ML ;
- feature store ;
- entraînements ;
- validations scientifiques.

## Statut final retenu

```text
C1-B = COMPLETED_DEV_DB_CONFIRMED

IDP_DUPLICATE_CONSOLIDATION = OPEN

IDP_POSSIBLE_MATCH_REVIEW = OPEN

WAIT_SOURCE_FIX = CLIENT_REQUIRED_DATA_FIX

C1_GLOBAL = PARTIAL_DB_CONFIRMED
```

## Règle de lecture projet

La clôture `C1-B` ne signifie pas que toute la dette QA historique IDP est résolue.

Elle signifie :

- que l'arbitrage spatial final du lot C1-B est clôturé ;
- que les décisions métier sont chargées ;
- que les créations/liaisons C1-B sont matérialisées en base ;
- que le résiduel global restant est soit technique, soit client, soit hors périmètre de clôture C1-B.

## Action documentaire obligatoire

Toute synthèse projet postérieure au `2026-06-04` doit utiliser la formulation suivante :

```text
C1-B = COMPLETED_DEV_DB_CONFIRMED
C1_GLOBAL = PARTIAL_DB_CONFIRMED
```
