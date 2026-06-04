# D1 - Arbitrage spatial IDP

## 1. Objet

Présenter les cas ambigus restants du périmètre IDP et préparer une décision client simple, traçable et validable.

## 2. Faits vérifiés

- le pipeline IDP est opérationnel en environnement DEV ;
- les cas ambigus résiduels ont été isolés dans `docs/37_fiches_arbitrage_idp_2024/` et `docs/38_reunion_arbitrage_IDP/` ;
- les sujets principaux portent sur :
  - sources non rattachées ;
  - points amont / aval ;
  - recouvrements `globale` / `marché` ;
  - fragmentation de 4 tables IDP ;
  - statut cible de certaines tables absentes de `abh_sad`.

## 3. Cas ambigus restants

| Sujet | Fait vérifié | Décision attendue |
|---|---|---|
| Sources non rattachées | des points restent sans lien référentiel confirmé | confirmer rattachement manuel, maintien en attente ou exclusion |
| Points amont / aval | des lignes doivent être distinguées entre source et point de contrôle | confirmer leur statut métier |
| Recouvrement qualité `globale` / `marché` | recouvrements documentés | valider la règle de fusion ou de séparation |
| Recouvrement pollution `globale` / `marché` | recouvrements documentés | valider la règle de fusion ou de séparation |
| Fragmentation des tables IDP | 4 tables et 8 899 lignes structurées en ensembles distincts | confirmer principe de fusion avec traçabilité ou maintien de séparation |
| Tables IDP absentes de la cible | statut cible à confirmer | confirmer intégration, maintien source ou intégration partielle |

## 4. Options possibles

### Option 1

`VALIDE`

Le client confirme la règle proposée et autorise la qualification métier du sujet sans correction structurelle préalable.

### Option 2

`A_CORRIGER`

Le client confirme le sujet mais demande une correction métier ou documentaire avant qualification finale.

### Option 3

`A_CONFIRMER`

Le client estime qu’un complément de validation ou une confirmation interne est requis avant décision.

## 5. Impacts par option

| Sujet | `VALIDE` | `A_CORRIGER` | `A_CONFIRMER` |
|---|---|---|---|
| Sources non rattachées | qualification possible avec statut résolu | correction du rattachement à prévoir | maintien en attente traçable |
| Points amont / aval | statut métier figé | correction de catégorisation à prévoir | restitution limitée à statut provisoire |
| Recouvrements | règle unique de fusion/séparation applicable | ajustements documentaires ou de règle à prévoir | préproduction conditionnée sur ce point |
| Fragmentation IDP | modèle cible confirmé | révision du modèle de qualification | maintien du statut conditionné |

## 6. Recommandation C4E

- conserver les cas non validés dans une logique traçable ;
- confirmer par priorité :
  - statut métier des points amont / aval ;
  - règle de fusion `globale` / `marché` ;
  - statut cible des tables IDP ;
- éviter toute fusion non explicitement validée par le client.

## 7. Proposition de décision client

| Sujet | Décision proposée |
|---|---|
| Sources non rattachées | `A_CONFIRMER` |
| Points amont / aval | `A_CONFIRMER` |
| Recouvrements `globale` / `marché` | `A_CONFIRMER` |
| Fragmentation IDP | `A_CONFIRMER` |
| Statut cible des tables IDP | `A_CONFIRMER` |
