# Diagnostic E1.1 — hydro.mesure_debit

## Résumé exécutif

- table cible : `hydro.mesure_debit`
- source brute : `staging.raw_mesures_debit_jr`
- source préparée : `qa_dry_run.e0_mesures_preparees`
- run source : `f0f2a858-1c90-4b15-a6af-cc172bece071`
- volume source préparée : `515 978`
- volume cible actuel : `521 433`
- lignes déjà présentes sur clé `(temps, station_id)` : `384 965`
- lignes nouvelles côté source : `131 013`
- lignes contradictoires sur même clé : `1 553`
- lignes présentes en cible mais absentes de la source préparée : `136 468`
- doublons métier source : `0`
- doublons métier cible : `0`
- mapping station : `100 %`
- unité : `m3/s` unique
- `source_row_id` au format `ctid` : `515 978 / 515 978`

## Conclusion

Le blocage principal n’est pas la clé métier ni le mapping station. Le blocage vient d’un cumul de trois facteurs :

1. `source_row_id` est entièrement dépendant de `ctid`, donc non rejouable de façon fiable.
2. `hydro.mesure_debit` ne porte aucune provenance source ni hash métier permettant un `UPSERT` ou un rollback sûr.
3. `1 553` lignes portent une contradiction de valeur très forte entre la source préparée et la cible, avec des indices clairs d’erreur de parsing/scaling sur certaines valeurs de débit.

## Décision finale

**HYDRO_DEBIT_A_REMODELER**
