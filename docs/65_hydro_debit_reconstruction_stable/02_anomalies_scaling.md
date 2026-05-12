# Anomalies de parsing / scaling

## Volume

- contradictions de valeur sur clé métier : `1 553`
- anomalies de scaling massif à très forte confiance : `56`
- conflits de valeur à revoir manuellement : `1 497`

## Symptômes observés

Exemples :

- `25.100011 -> 2 500 000 000 000`
- `36.107 -> 360 000 000`
- `4.1006 -> 4 000 000`
- `2.106 -> 2 000 000`

## Lecture

Sur ces cas :

- la valeur brute `raw.debit_jr` est cohérente
- la valeur cible existante `hydro.mesure_debit.valeur` est cohérente
- la valeur préparée `E0` est aberrante

Le problème ne vient donc pas de la source officielle, mais de la préparation `E0`.

## Hypothèse racine

Le flux a subi une surinterprétation de motifs pseudo-scientifiques pendant `E0`, visible dans les flags :

- `SCIENTIFIC_NOTATION_CONVERTED`
- `UNIT_ASSUMED`

## Consigne de correction

Pour `hydro.mesure_debit`, la valeur de référence doit être reconstruite directement depuis :

- `staging.raw_mesures_debit_jr.debit_jr`

et non depuis `e0.valeur_preparee` lorsque la valeur diverge.
