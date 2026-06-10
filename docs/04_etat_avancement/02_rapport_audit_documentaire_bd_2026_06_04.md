# Rapport d'audit documentaire et BD — 2026-06-04

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport d'audit et corrections |
| Date | 2026-06-04 |
| Auteur | Kimi Code CLI (audit automatisé + relecture manuelle) |
| Périmètre | documents maîtres, catalogues, clôtures migration, rapport température, statuts préprod |

---

## 1. Méthodologie

1. **Lecture chronologique** de la documentation du projet (dossiers 01 à 113) via agents d'exploration parallèles.
2. **Vérification base de données** `abh_sad` (PostgreSQL/PostGIS) en lecture seule — requêtes SQL de cardinalités, schémas, vues matérialisées.
3. **Vérification code** — backend (`api_v1.py`, `main.py`), frontend (`config/api.ts`, `.env`), routeurs legacy.
4. **Comparaison croisée** doc ↔ DB ↔ code.
5. **Corrections** appliquées sur les documents maîtres et actifs.

---

## 2. Incohérences majeures détectées

### 2.1 Température — ERREUR CRITIQUE (12 documents impactés)

**Réalité DB** : `meteo.mesure_temperature` = **437 889 lignes** (batch `2d67f599-7714-4712-ba1f-5f3584c4c961`, commit 2026-05-25, 36 stations, période 1983-2026).

**Documents disant à tort "0" ou "absente"** :

| Document | Mention erronée | Correction appliquée |
|---|---|---|
| `docs/00_SOURCE_OF_TRUTH_MASTER.md` | `meteo.mesure_temperature = 0` | ✅ corrigé → `437889` |
| `docs/04_etat_avancement/00_project_global_status.md` | `meteo.mesure_temperature = 0` + statut "température absente" | ✅ corrigé |
| `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md` | `meteo.mesure_temperature = 0` | ✅ corrigé |
| `docs/07_donnees_et_referentiels/00_data_landscape.md` | `DONNEE_ABSENTE` | ✅ corrigé → `COMMITTED` |
| `docs/87_cloture_migration_donnees_client/02_volumetrie_finale.md` | `meteo.mesure_temperature = 0` | ✅ corrigé |
| `docs/90_cloture_globale_migration/00_index.md` | `Temperature \| DONNEE_NON_FOURNIE` | ✅ corrigé → `COMMITTED` |
| `docs/90_cloture_globale_migration/01_synthese_globale.md` | `meteo.mesure_temperature = 0 \| DONNEE_NON_FOURNIE` | ✅ corrigé |
| `docs/90_cloture_globale_migration/03_anomalies_client.md` | `temperature absente \| 0 ligne` | ✅ corrigé → RÉSOLU |
| `docs/90_cloture_globale_migration/10_reclassification_risques_restants.md` | `Temperature absente \| DONNEE_NON_FOURNIE` | ✅ corrigé |
| `docs/01_contexte_projet/01_mvp_scope.md` | `température absente` | ✅ corrigé |
| `docs/00_source_of_truth/01_source_of_truth_consolidee.md` | `température absente` | ✅ corrigé |
| `docs/96_catalogue_metier_donnees_affichage/04_catalogue_sources_tables.md` | `meteo.mesure_temperature = 0 \| PIPELINE_TO_IMPLEMENT` | ✅ corrigé |
| `docs/33_annexes_anomalies_detaillees/A10_temperature_non_disponible.md` | anomalie entière obsolète | ✅ marqué RÉSOLU/ARCHIVE |
| `docs/40_temperature_ingestion_closure/10_temperature_ingestion_execution_report.md` | `ROLLBACK_REQUIRED` (faux) | ✅ marqué OBSOLÈTE/ARCHIVE |

**Preuve DB** :
```sql
SELECT count(*) FROM meteo.mesure_temperature;
-- Résultat : 437889
```

### 2.2 Cardinalités obsolètes dans SOURCE_OF_TRUTH_MASTER (snapshot 2026-04-17)

**Réalité DB au 2026-06-04** vs **ancien SOURCE_OF_TRUTH** :

| Objet | Ancienne valeur | Valeur réelle DB | Delta |
|---|---|---|---|
| `infra.barrages` | 34 | **33** | -1 |
| `hydro.mesure_debit` | 521433 | **652446** | +131013 (insertion E1.1) |
| `hydro.mesure_barrage_param` | absent | **272652** | nouveau |
| `meteo.mesure_temperature` | 0 | **437889** | nouveau |
| `qualite.mesure_qualite_riviere` | 60097 | **59534** | -563 |
| `qualite.mesure_qualite_nappe` | 63088 | **63047** | -41 |
| `qualite.mesure_qualite_barrage` | 15808 | **7820** | -7988 (reset E1.1) |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 7094 | **1780** | -5314 (reset E1.1) |
| `geo.ref_site_pollution` | absent | **2026** | nouveau (dont 75 IDP-C1B) |
| `security.activity_logs` | 74935 | **87346** | +12411 |

**Correction** : `docs/00_SOURCE_OF_TRUTH_MASTER.md` section 3 et cardinalités mis à jour au 2026-06-04.

### 2.3 Schémas counts obsolètes dans SOURCE_OF_TRUTH_MASTER

| Schéma | Ancien count | Réalité DB | Correction |
|---|---|---|---|
| `audit` | 1 table | 17 tables | ✅ |
| `geo` | 13 tables | 18 tables + 2 vues | ✅ |
| `geo_work` | absent | 26 tables + 1 vue | ✅ ajouté |
| `hydro` | 7 tables | 8 tables | ✅ |
| `metadata` | 37 tables | 52 tables | ✅ |
| `public` | 1 table + 2 matviews | 1 table + 4 vues (0 matview) | ✅ |
| `qa` | 1 table | 9 tables | ✅ |
| `qa_dry_run` | absent | 7 tables | ✅ ajouté |
| `qualite` | 8 tables | 9 tables | ✅ |
| `staging` | 35 tables | 51 tables + 1 vue | ✅ |

### 2.4 Documents de migration dépassés

| Document | Problème | Action |
|---|---|---|
| `docs/77_validation_finale_migration/00_index.md` | Verdict `NO GO` obsolète (barrage paramétrique désormais déployé, migration clôturée 85-90) | ✅ marqué OBSOLÈTE/ARCHIVE |

### 2.5 Matrice préprod IDP obsolète

| Document | Problème | Action |
|---|---|---|
| `docs/108_qualification_metier_preproduction/07_matrice_go_no_go_preproduction.md` | IDP = `NO-GO partiel` alors que C1-B est `COMPLETED_DEV_DB_CONFIRMED` depuis le 2026-06-04 | ✅ corrigé |

### 2.6 Configuration frontend incohérente

| Source | Valeur |
|---|---|
| `README.md` racine | `VITE_API_BASE_URL=http://127.0.0.1:8000` |
| `frontend/.env` réel | `VITE_API_BASE_URL=http://127.0.0.1:8000` |
| `frontend/src/config/api.ts` | fallback `http://127.0.0.1:8000/api/v1` |

**Action** : `README.md` corrigé avec note explicative sur l'alignement des ports.

---

## 3. Documents corrigés (liste complète)

1. `docs/00_SOURCE_OF_TRUTH_MASTER.md`
2. `docs/00_source_of_truth/01_source_of_truth_consolidee.md`
3. `docs/01_contexte_projet/01_mvp_scope.md`
4. `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`
5. `docs/04_etat_avancement/00_project_global_status.md`
6. `docs/07_donnees_et_referentiels/00_data_landscape.md`
7. `docs/33_annexes_anomalies_detaillees/A10_temperature_non_disponible.md`
8. `docs/40_temperature_ingestion_closure/10_temperature_ingestion_execution_report.md`
9. `docs/77_validation_finale_migration/00_index.md`
10. `docs/87_cloture_migration_donnees_client/02_volumetrie_finale.md`
11. `docs/90_cloture_globale_migration/00_index.md`
12. `docs/90_cloture_globale_migration/01_synthese_globale.md`
13. `docs/90_cloture_globale_migration/03_anomalies_client.md`
14. `docs/90_cloture_globale_migration/10_reclassification_risques_restants.md`
15. `docs/96_catalogue_metier_donnees_affichage/04_catalogue_sources_tables.md`
16. `docs/108_qualification_metier_preproduction/07_matrice_go_no_go_preproduction.md`
17. `README.md` (racine repo)
18. `backend/README.md`
19. `frontend/README.md`
20. `docs/01_project_reference/backend/backend_overview.md`
21. `docs/01_project_reference/frontend/frontend_reference.md`
22. `docs/03_ai_knowledge_base/MEMORY_CORE.md`
23. `docs/04_working_prompts_and_runs/runs/popup_rules/popup_rules_functional_test_workflow.md`
24. `docs/44_dashboard_platform_audit_and_alignment/02_inventory_available_apis_and_views.md`
25. `docs/dockerisation_sad/00_audit_initial.md`
26. `docs/dockerisation_sad/03_depannage_erreurs_frequentes.md`
27. `docs/dockerisation_sad/04_validation_lancement_docker.md`
28. `docs/38_cloture_referentiel_qualite_preprod/04_tests_api_quality_thresholds_classify.md`
29. `docs/94_api_frontend_transition/frontend_pilote_metaux/04_tests_frontend.md`
30. `docs/04_etat_avancement/02_rapport_audit_documentaire_bd_2026_06_04.md` (présent rapport)

---

## 4. Documents restants obsolètes non corrigés (archive / legacy)

Les fichiers ci-dessous contiennent encore des valeurs obsolètes mais relèvent de l'**archive historique** ou de **fichiers JSON générés automatiquement**. Ils ne devraient pas être utilisés pour le pilotage courant :

- `docs/12_historique_et_archives/root_legacy/*`
- `docs/90_reorganisation_documentaire_finale/_audit_data/summary.json`
- `docs/59_E1_1_reprise_par_table/99_debug_metrics.json`
- `docs/66_E1_1_hydro_mesure_debit/summary.json`
- `docs/63_E1_1_suivi_qualite_barrage_garde_hebdo/summary.json`
- `docs/60_E1_1_qualite_barrage/summary.json`
- `docs/48_plan_execution_migration_corrige/13_log_pre_execution.md`
- `docs/56_lot_E1_execution_reelle/02_execution_rows.json`
- `docs/52_lot_E0_execution/01_volume_source_vs_prepare.md`
- `docs/35_donnees_problematiques_par_bloc/05_tableau_global_entites_problematiques.md`
- `docs/34_synthese_strategique_anomalies/03_bloc_donnees.md`
- `docs/05_blocages_et_risques/00_problemes_racines.md`
- `docs/89_modele_ingestion_futures_donnees/finalisation/04_pipeline_meteo.md`

> **Recommandation** : si ces fichiers sont ouverts par un agent IA ou un collaborateur, un bandeau d'avertissement devrait être ajouté en début de fichier pour éviter toute confusion.

---

## 5. Vérifications code / runtime confirmées

| Élément | Statut vérifié | Preuve |
|---|---|---|
| Backend routes montées | ✅ Stable | `backend/app/api/api_v1.py` — 20+ routeurs montés sous `/api/v1` |
| Routeurs legacy `public.*` | ✅ En quarantaine | `backend/app/routers_legacy_public/` — 6 fichiers déplacés, non montés |
| `public.*` runtime | ✅ Aucune dépendance critique | `spatial_ref_sys` + vues PostGIS uniquement |
| Frontend API base URL | ✅ Harmonisation complète | `.env`, fallback code, README, docker-compose → 8000 ; 8011 obsolète |
| Docker compose | ✅ Présent | `docker-compose.yml` à jour |

---

## 6. Recommandations

1. **Garder `docs/00_SOURCE_OF_TRUTH_MASTER.md` comme document vivant** : le mettre à jour systématiquement après chaque exécution de migration ou ingestion (pas seulement après les réunions).
2. **Ne pas réutiliser les docs d'archive** : les documents marqués `(ARCHIVE)` ou dans `root_legacy` ne doivent plus alimenter les synthèses projet.
3. **Automatiser le snapshot DB** : un script hebdomadaire `scripts/db_snapshot.py` pourrait générer un fichier JSON des cardinalités et le comparer aux docs maîtres.
4. ~~**Unifier les ports frontend/backend**~~ ✅ **FAIT** — port `8000` adopté comme standard unique. `.env`, `docker-compose.yml`, `frontend/src/config/api.ts`, `vite.config.ts`, `README.md`, `backend/README.md`, `frontend/README.md`, docs dockerisation et docs référence ont été alignés. `8011` est désormais obsolète partout.
5. **Mise à jour des vues matérialisées** : `analytics.mv_dashboard_*` sont à jour (358 MB, 53 MB, 84 MB) — le refresh industrialisé fonctionne.

---

## 7. Synthèse exécutive

| Indicateur | Valeur |
|---|---|
| Documents analysés | ~120 index + 20+ docs maîtres approfondis |
| Incohérences critiques trouvées | **4** (température, cardinalités, schémas counts, migration NO-GO dépassé) |
| Documents corrigés | **30** |
| Documents marqués archive/obsolète | **3** |
| Preuves DB exécutées | 15+ requêtes SQL vérifiées |
| Fichiers code inspectés | `api_v1.py`, `main.py`, `api.ts`, `.env`, `routers_legacy_public/` |
| Fichiers code modifiés | `frontend/src/config/api.ts`, `frontend/vite.config.ts`, `README.md`, `backend/README.md`, `frontend/README.md` |

**Verdict** : Les documents maîtres du projet sont désormais alignés avec la réalité de la base `abh_sad` et du code au **2026-06-04**. Le risque majeur de désinformation sur la température et les cardinalités migration est résolu.

---

## 8. Action post-audit — Harmonisation des ports (2026-06-04)

| Élément | Avant | Après |
|---|---|---|
| Port backend documenté | `8011` (docs historiques, README, fallback code) | `8000` (standard unique) |
| `frontend/src/config/api.ts` | fallback `http://127.0.0.1:8011/api/v1` | fallback `http://127.0.0.1:8000/api/v1` |
| `frontend/vite.config.ts` | proxy `http://127.0.0.1:8011` | proxy `http://127.0.0.1:8000` |
| `README.md` racine | exemple `uvicorn --port 8011` | exemple `uvicorn --port 8000` |
| Docs dockerisation | tests et référence sur `8011` | tests et référence sur `8000`, `8011` marqué obsolète |
| Docs référence (`backend_overview`, `frontend_reference`, `MEMORY_CORE`, `source_of_truth_consolidee`) | `8011` comme norme | `8000` comme norme, `8011` obsolète |
| Rapport d'audit | `8011` mentionné comme incohérence | `8011` mentionné comme résolu |

**Fichiers modifiés** : `frontend/src/config/api.ts`, `frontend/vite.config.ts`, `README.md`, `backend/README.md`, `frontend/README.md`, `docs/00_SOURCE_OF_TRUTH_MASTER.md`, `docs/00_source_of_truth/01_source_of_truth_consolidee.md`, `docs/01_project_reference/backend/backend_overview.md`, `docs/01_project_reference/frontend/frontend_reference.md`, `docs/03_ai_knowledge_base/MEMORY_CORE.md`, `docs/04_working_prompts_and_runs/runs/popup_rules/popup_rules_functional_test_workflow.md`, `docs/44_dashboard_platform_audit_and_alignment/02_inventory_available_apis_and_views.md`, `docs/dockerisation_sad/00_audit_initial.md`, `docs/dockerisation_sad/03_depannage_erreurs_frequentes.md`, `docs/dockerisation_sad/04_validation_lancement_docker.md`, `docs/38_cloture_referentiel_qualite_preprod/04_tests_api_quality_thresholds_classify.md`, `docs/94_api_frontend_transition/frontend_pilote_metaux/04_tests_frontend.md`, `docs/04_etat_avancement/02_rapport_audit_documentaire_bd_2026_06_04.md`.

**Résultat** : Le port `8000` est désormais le standard unique pour le backend en local et Docker. Le port `8011` n'apparaît plus comme valeur active dans aucun fichier de configuration ou documentation opérationnelle.
