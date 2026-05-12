# Recommandation d’action

## Problème principal identifié

Le blocage vient d’un couple :

- **modèle cible insuffisant pour une reprise sûre**
- **anomalie de transformation numérique sur une partie du flux débit**

## % données exploitables

Si l’on raisonne uniquement sur le mapping station et l’unicité métier :

- données techniquement exploitables après refonte de reprise : `99,70 %`
  - `514 425 / 515 978`
  - soit `source nouvelle + source déjà cohérente`

## % données incohérentes

- données contradictoires sur même clé métier : `0,30 %`
  - `1 553 / 515 978`

## Stratégie recommandée

**Aucune exécution E1.1 directe sur `hydro.mesure_debit`.**

Étapes recommandées :

1. reconstruire une source de reprise stable pour `raw_mesures_debit_jr`
   - abandon de `ctid`
   - utiliser `code_debit` + `ire_station` + `date_jr` + hash métier source
2. corriger la logique de parsing/scaling des valeurs contradictoires
   - en particulier les cas où `25.100011` devient `2 500 000 000 000`
3. préparer une table cible rejouable
   - ou enrichir le flux de migration avec audit stable externe
   - provenance par ligne obligatoire
4. seulement après cela, arbitrer entre :
   - `UPSERT_METIER` si l’historique actuel doit être conservé
   - `RESET_AND_RELOAD` si l’utilisateur accepte de reconstruire intégralement la table

## Niveau de risque

**Élevé**

## Décision finale

**HYDRO_DEBIT_A_REMODELER**
