# Validation technique des vues SQL metier

## Objet

Revue technique prealable a toute creation reelle des vues SQL et a tout `UPDATE metadata.referentiel_parametre_canonique.table_cible`.

## Perimetre

- Vues metier specialisees meteo, hydrologie, qualite, barrage qualite, pollution / IDP.
- Analyse schema, colonnes communes, unions multi-supports, QA/GEO, performance et risques.
- SQL propose uniquement, non execute.

## Fichiers

| Fichier | Role |
|---|---|
| `01_inventaire_sources_par_vue.md` | Sources, supports, volumetrie et risques par vue |
| `02_modele_colonnes_communes.md` | Modele commun d'exposition analytique |
| `03_analyse_unions_multi_supports.md` | Analyse des unions qualite/meteo/pollution |
| `04_validation_qa_geo.md` | Regles QA, GEO, consultation only et quarantaine |
| `05_analyse_performance_et_index.md` | Index existants, risques full scan et recommandations |
| `06_sql_vues_reelles_PROPOSEES.sql` | SQL propose non execute des vues |
| `07_analyse_risques_architecture.md` | Risques architecture et mitigations |
| `08_checklist_pre_execution.md` | Checklist obligatoire avant execution |
| `09_recommandation_execution_table_cible.md` | Decision GO/HOLD pour vues, table_cible, API, ingestion |

## Decision courante

| Action | Decision |
|---|---|
| Creation documentaire des vues proposees | `GO` |
| `CREATE VIEW` reel | `HOLD` |
| `UPDATE table_cible` | `HOLD` |
| API FastAPI | `HOLD` |
| Frontend | `HOLD` |

## Mise a jour execution reelle

| Action | Statut |
|---|---|
| Creation reelle des vues SQL specialisees | `VUES_SQL_SPECIALISEES_CREEES` |
| Controle post-creation | `OK` |
| `UPDATE table_cible` | `HOLD_APRES_VALIDATION_POST_CREATE` |
| API FastAPI | `HOLD` |
| Frontend | `HOLD` |
