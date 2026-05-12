# Phase 1 - Hydro barrage param

## Contexte

- Source de verite lue avant decision :
  - `docs/README.md`
  - `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`
  - `docs/03_ai_knowledge_base/api_for_agents.md`
  - `docs/03_ai_knowledge_base/architecture_for_agents.md`
  - `docs/69_diagnostic_hydro_mesure_barrage/*`
- Tables observees :
  - `staging.raw_mesures_niv_eau_barrages`
  - `hydro.mesure_barrage`
  - `metadata.mapping_barrage`
  - `metadata.referentiel_parametre`
  - `api.v_barrage_dimension`

## Contraintes retenues

- ne pas utiliser `ctid`
- conserver une cle metier stable
- tracer toute recharge via `source_table`, `source_row_hash`, `target_business_key_hash`
- ne pas executer de reset destructif sans backup et stop explicite
- ne pas casser directement les consommateurs frontend/backend existants

## Constats verifies

- `hydro.mesure_barrage` actuel contient `temps`, `barrage_id`, `cote_m`, `volume_mm3`, `lacher_m3s`
- volumetrie cible actuelle : `84 831`
- volumetrie source staging : `85 166`
- cle source dedupee `(ire_barrage, date_jr)` : `84 832`
- 1 cle source dedupee restante a `date_jr IS NULL` pour `ire_barrage='1496/9'`
- `lacher_m3s` est vide a `100 %`
- la source porte 5 concepts : `NIVEAU_EAU`, `VOLUME`, `RESTITUTION`, `APPORTS_HM3`, `TRANSFERT`
- volumetrie parametrique dedupee attendue : `272 655` lignes

## Lecture strategique

- Le blocage est structurel, pas geographique.
- Le mapping barrage est couvert pour le flux actif.
- Le modele actuel est incompatible avec une cloture metier propre :
  - `RESTITUTION` est stockee en `Mm3` en source mais l'existant l'assimile a `lacher_m3s`
  - `APPORTS_HM3` et `TRANSFERT` n'ont aucun support final
  - `VOLUME_BARRAGE` existe dans le referentiel actif alors que le lot cible demande `VOLUME`
  - la distinction `debit instantane` vs `volume journalier barrage` n'est pas verrouillee

## Patch metier unites

Regles validees a appliquer partout :

- `DEBIT` = debit instantane = `m3/s`
- `LACHER` = volume journalier lache = `Mm3/j`
- `RESTITUTION` = alias source de `LACHER`
- `APPORTS_HM3` = volume journalier entrant = `Mm3/j`
- `TRANSFERT` = volume journalier transfere = `Mm3/j`
- `VOLUME` = volume de stockage = `Mm3`
- `NIVEAU_EAU` = niveau = `m`

Interdictions :

- ne jamais exposer `lacher_m3s` comme flux barrage journalier
- ne jamais convertir implicitement un volume journalier barrage en debit

## Livrables

- `01_modele_parametrique.md`
- `02_mapping_parametres.csv`
- `03_sql_create_table.sql`
- `04_sql_insert_normalise.sql`
- `05_sql_reset_reload.sql`
- `06_controles.sql`
- `07_impact_architecture.md`
- `08_decision_finale.md`
