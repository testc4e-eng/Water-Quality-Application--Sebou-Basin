# Controle structure Phase 2

## Context

Controle post-creation de `hydro.mesure_barrage_param`.

Script execute :

- `docs/84_hydro_barrage_param_deploiement/04_sql_create_table_execute.sql`

Perimetre d'ecriture :

- creation structurelle de `hydro.mesure_barrage_param`
- contraintes, index et commentaires lies a la table cible

Aucune insertion de donnees n'a ete executee.

## Analysis

### Existence et volume

| Controle | Resultat |
|---|---|
| table `hydro.mesure_barrage_param` existe | oui |
| volume initial | 0 |
| donnees inserees | non |

### Colonnes creees

| Colonne | Type | Null | Defaut |
|---|---|---|---|
| `id` | `uuid` | non | `gen_random_uuid()` |
| `barrage_id` | `uuid` | non |  |
| `temps` | `timestamptz` | non |  |
| `parametre_code` | `text` | non |  |
| `parametre_ref_id` | `uuid` | non |  |
| `valeur` | `numeric` | non |  |
| `unite` | `text` | non |  |
| `scenario` | `text` | non | `ACTUEL` |
| `scenario_id` | `uuid` | oui |  |
| `source_table` | `text` | non |  |
| `source_row_id` | `text` | oui |  |
| `source_row_hash` | `text` | non |  |
| `target_business_key_hash` | `text` | non |  |
| `metadata_json` | `jsonb` | non | `{}` |
| `created_at` | `timestamptz` | non | `now()` |

### Contraintes creees

| Contrainte | Type | Role |
|---|---|---|
| `mesure_barrage_param_pkey` | primary key | identifiant technique `id` |
| `uq_mesure_barrage_param_business_hash` | unique | unicite de `target_business_key_hash` |
| `fk_mesure_barrage_param_ref_id` | foreign key | rattachement au referentiel canonique par `parametre_ref_id` |
| `fk_mesure_barrage_param_code` | foreign key | rattachement au referentiel canonique par `parametre_code` |
| `chk_mesure_barrage_param_code` | check | parametres limites a `NIVEAU_EAU`, `VOLUME`, `LACHER`, `APPORTS_HM3`, `TRANSFERT` |
| `chk_mesure_barrage_param_unit` | check | coherence parametre / unite |
| `chk_mesure_barrage_param_valeur_non_negative` | check | `valeur >= 0` |
| `chk_mesure_barrage_param_metadata_object` | check | `metadata_json` objet JSON |

### Index crees

| Index | Role |
|---|---|
| `idx_mesure_barrage_param_barrage_temps` | acces barrage / temps descendant |
| `idx_mesure_barrage_param_barrage_temps_code` | acces barrage / temps descendant / parametre |
| `idx_mesure_barrage_param_code_temps` | acces parametre / temps descendant |
| `idx_mesure_barrage_param_source_row_hash` | audit source |
| `mesure_barrage_param_pkey` | index primaire sur `id` |
| `uq_mesure_barrage_param_business_hash` | index unique sur `target_business_key_hash` |

### Tables interdites

Volumes controles apres creation :

| Table | Volume |
|---|---:|
| `hydro.mesure_barrage` | 84831 |
| `hydro.mesure_debit` | 652446 |
| `meteo.mesure_evaporation` | 48900 |
| `meteo.mesure_precipitation` | 546007 |
| `meteo.mesure_temperature` | 0 |
| `qualite.mesure_qualite_barrage` | 7820 |
| `qualite.mesure_qualite_nappe` | 63047 |
| `qualite.mesure_qualite_riviere` | 59534 |
| `qualite.mesure_qualite_sebou` | 49954 |

## Solution

La structure cible est conforme a la Phase 2 :

- table creee
- volume initial egal a 0
- contraintes metier et referentielles presentes
- index obligatoires presents
- aucune insertion realisee
- aucune table metier interdite modifiee par le script

Decision controle structure :

- `PARAM_TABLE_CREATED`

## Optional improvements

La Phase 3 devra tester les contraintes sans inserer en production, via requetes de preparation et controles de normalisation.
