# Reconstruction stable — hydro.mesure_debit

## Résumé

- table cible : `hydro.mesure_debit`
- source brute officielle : `staging.raw_mesures_debit_jr`
- source préparée `E0` actuelle : `qa_dry_run.e0_mesures_preparees`
- run source : `f0f2a858-1c90-4b15-a6af-cc172bece071`

## Chiffres structurants

- volume source brute stable reconstruit : `521 433`
- volume source préparée `E0` : `515 978`
- volume hors `E0` / backlog : `5 455`
- volume déjà cohérent en cible : `383 412`
- volume prêt à insérer après correction : `131 013`
- volume anomalies de valeur à arbitrer : `1 553`
- dont anomalies de scaling massif à très forte confiance : `56`

## Décision

**HYDRO_DEBIT_READY_AFTER_FIX**

## Lecture

Le flux `hydro.mesure_debit` n’est pas bloqué par la clé métier, ni par le mapping station, ni par l’unité. Il devient exploitable si on :

1. reconstruit une source stable indépendante de `ctid` ;
2. isole les `1 553` conflits de valeur ;
3. traite `56` cas comme erreurs de parsing/scaling quasi certaines ;
4. applique ensuite une stratégie `INSERT_ONLY_MISSING` sur le périmètre propre.
