# Execution reelle CREATE VIEW

## Perimetre execute

Script source :

`docs/93_validation_technique_vues_sql/tests_sql_vues/06_sql_vues_corrigees_VALIDATION_REQUISE.sql`

Execution realisee uniquement pour :

- creation du schema `api` si absent ;
- creation/remplacement des vues SQL metier specialisees ;
- aucun `UPDATE table_cible` ;
- aucune modification des tables metier ;
- aucune modification des unites, alias ou `parametre_ref_id` ;
- aucune modification backend/API/frontend.

## Transaction

Le script de validation contenait un `ROLLBACK` actif par defaut. Pour l'execution explicitement validee, le `ROLLBACK` final a ete remplace par `COMMIT` dans une copie temporaire d'execution.

| Etape | Resultat |
|---|---|
| `BEGIN` | `OK` |
| `CREATE SCHEMA IF NOT EXISTS api` | `OK`, schema deja existant |
| `CREATE OR REPLACE VIEW` | `19` vues creees |
| `COMMIT` | `OK` |

## Vues creees

| Vue | Statut |
|---|---|
| `api.v_meteo_temperature` | `CREEE` |
| `api.v_meteo_precipitation` | `CREEE` |
| `api.v_meteo_evaporation` | `CREEE` |
| `api.v_barrage_parametres` | `CREEE` |
| `api.v_barrage_qualite` | `CREEE` |
| `api.v_qualite_base_multi_support` | `CREEE` |
| `api.v_qualite_physicochimie` | `CREEE` |
| `api.v_qualite_chimie_minerale` | `CREEE` |
| `api.v_qualite_metaux` | `CREEE` |
| `api.v_qualite_pollution_organique` | `CREEE` |
| `api.v_qualite_microbiologie` | `CREEE` |
| `api.v_qualite_biologique` | `CREEE` |
| `api.v_qualite_terrain` | `CREEE` |
| `api.v_qualite_contexte_station` | `CREEE` |
| `api.v_qualite_organoleptique` | `CREEE` |
| `api.v_pollution_constat_prealable` | `CREEE` |
| `api.v_pollution_analyses_finales` | `CREEE` |
| `api.v_idp_points` | `CREEE` |
| `api.v_idp_points_non_resolus` | `CREEE` |

## Controle non-perimetre

| Controle | Resultat |
|---|---|
| `metadata.referentiel_parametre_canonique` modifie | `NON` |
| `table_cible` modifie | `NON` |
| tables qualite modifiees | `NON` |
| tables meteo modifiees | `NON` |
| tables hydro modifiees | `NON` |
| tables pollution modifiees | `NON` |
| backend/frontend modifie | `NON` |

## Statut

`VUES_SQL_SPECIALISEES_CREEES`
