# Deploiement modele barrage parametrique - Phase 1

## Context

Cette phase controle l'etat reel avant creation de `hydro.mesure_barrage_param`.

Perimetre execute :

- lecture seule PostgreSQL/PostGIS sur `abh_sad`
- aucun `CREATE`, `INSERT`, `UPDATE`, `DELETE`, `DROP`
- aucun usage de `ctid`
- aucune modification de `hydro.mesure_barrage`

## Analysis

References projet consultees :

- `docs/README.md`
- `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`
- `docs/03_ai_knowledge_base/api_for_agents.md`
- `docs/03_ai_knowledge_base/architecture_for_agents.md`
- `docs/75_hydro_barrage_param_model/04_sql_insert_normalise.sql`

Contraintes metier confirmees :

- `LACHER` est un volume journalier barrage en `Mm3/j`, pas un debit.
- `APPORTS_HM3` est un volume journalier entrant en `Mm3/j`.
- `TRANSFERT` est un volume journalier transfere en `Mm3/j`.
- `VOLUME` est un stock barrage en `Mm3`.
- `NIVEAU_EAU` est un niveau barrage en `m`.
- `lacher_m3s` reste une colonne legacy technique, non exposable comme verite metier.

## Solution

Livrables de phase :

- `01_controle_avant_deploiement.md`
- `02_volumetrie_attendue.md`
- `03_verification_referentiel.md`
- `04_sql_create_table_execute.sql`
- `05_controle_structure.md`
- `06_decision_creation.md`
- `07_sql_prepare_normalisation.sql`
- `08_controle_normalisation.md`
- `09_lignes_exclues.csv`
- `10_simulation_insertion.md`
- `11_distribution_parametres.md`
- `12_controles_qa.md`
- `13_decision_normalisation.md`
- `14_backup_avant_load.md`
- `15_execution_load.md`
- `16_controle_post_load.md`
- `17_audit_load.md`
- `18_decision_load.md`
- `19_backend_refactor.md`
- `20_frontend_refactor.md`
- `21_vues_compatibilite.sql`
- `22_controles_api_dashboard.md`
- `23_decision_bascule.md`
- `24_apport_harmonisation_audit.md`
- `25_apport_refactor_backend.md`
- `26_apport_refactor_frontend.md`
- `27_apport_controles.md`
- `28_apport_decision.md`

Decision Phase 1 :

- `READY_FOR_PARAM_MODEL`

Justification :

- `hydro.mesure_barrage` existe et reste disponible comme legacy lecture seule.
- `metadata.referentiel_parametre_canonique` existe et contient les 5 parametres barrage requis.
- aucune collision `code_parametre` dans le referentiel canonique.
- volume parametrique attendu : `272652` lignes.
- aucun doublon cible attendu sur `(barrage_id, temps, parametre_code, scenario)`.
- aucun parametre orphelin attendu.
- aucune incoherence d'unite attendue dans la transformation.

## Optional improvements

Phase suivante autorisee apres validation humaine :

- Phase 5 : bascule API / dashboard, uniquement apres validation explicite.

## Phase 2 executee

| Controle | Resultat |
|---|---|
| table cible creee | oui |
| volume initial | 0 |
| contraintes creees | 8 |
| index crees | 6 |
| insertion de donnees | aucune |
| `hydro.mesure_barrage` modifiee | non |
| tables metier hors cible modifiees | non observe |

Decision Phase 2 :

- `PARAM_TABLE_CREATED`

## Phase 3 executee

| Controle | Resultat |
|---|---:|
| volume source brut | 85166 |
| volume stable | 84831 |
| volume parametrique simule | 272652 |
| volume exclu | 335 |
| volume backlog | 0 |
| collisions business hash | 0 |
| collisions FK referentiel | 0 |
| unites incoherentes | 0 |
| parametres hors referentiel | 0 |
| doublons metier simules | 0 |

Decision Phase 3 :

- `NORMALISATION_OK`

## Phase 4 executee

| Controle | Resultat |
|---|---:|
| volume avant load | 0 |
| backup cree | 0 |
| volume insere | 272652 |
| volume final | 272652 |
| anomalies post-load | 0 |
| doublons metier | 0 |
| collisions business hash | 0 |
| collisions FK referentiel | 0 |
| unites incoherentes | 0 |
| melange debit / volume | 0 |

Audit :

- `audit.hydro_barrage_param_load_audit`
- `run_id = fb24228c-efdf-4b1c-bd1f-9d22a849b997`
- `status = SUCCESS`

Decision Phase 4 :

- `HYDRO_BARRAGE_PARAM_OK`

## Phase 5 executee

| Controle | Resultat |
|---|---:|
| `api.v_hydro_barrage_param_journalier` | 272652 |
| `api.v_hydro_barrage_param_compat_wide` | 84831 |
| `analytics.mv_dashboard_hydrologie_menu` | 816081 |
| lignes barrage dashboard | 272652 |
| `m3/s` sur volumes journaliers barrage | 0 |
| unites incoherentes barrage | 0 |

Variables barrage exposees :

| Variable | Unite |
|---|---|
| `niveau_barrage` | `m` |
| `volume_barrage` | `Mm3` |
| `lacher_barrage` | `Mm3/j` |
| `apports_hm3` | `Mm3/j` |
| `transfert` | `Mm3/j` |

Controles applicatifs :

- compilation Python routeurs : OK
- build frontend : OK
- table legacy `hydro.mesure_barrage` conservee : oui
- modification tables metier hors cible : aucune

Decision Phase 5 :

- `API_DASHBOARD_PARAM_OK`

## Harmonisation APPORT executee

| Controle | Resultat |
|---|---:|
| lignes `APPORTS_HM3` restantes | 0 |
| lignes `APPORT` | 84820 |
| delta numerique max | 0 |
| unites incoherentes | 0 |
| orphelins referentiel | 0 |
| doublons metier | 0 |
| collisions hash metier | 0 |

Decision harmonisation :

- `APPORT_HARMONISATION_OK`
