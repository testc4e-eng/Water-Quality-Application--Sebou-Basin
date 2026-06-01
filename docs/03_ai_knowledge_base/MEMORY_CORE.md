# MEMORY_CORE

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | summary |
| Périmètre | noyau de mémoire projet pour agents IA |
| Source de vérité | Oui sur le périmètre IA |
| Documents liés | [QUICK_REFERENCE](./QUICK_REFERENCE.md), [AGENT_RULES](./AGENT_RULES.md), [../00_SOURCE_OF_TRUTH_MASTER.md](../00_SOURCE_OF_TRUTH_MASTER.md), [SOURCE_OF_TRUTH](../01_project_reference/SOURCE_OF_TRUTH.md) |
| Dernière mise à jour | 2026-05-22 |

## 1. Mission du projet

Le projet met en place un système d’aide à la décision web pour la gestion de la qualité des eaux de surface du bassin du Sebou. La plateforme combine :

- données métier et SIG ;
- dashboards analytiques et cartographiques ;
- administration, audit et gouvernance ;
- intégration des résultats de modèles SWAT/WASP.

## 2. Ce qu’un agent doit lire en priorité

1. `docs/00_source_of_truth/00_documents_prioritaires.md`
2. `docs/04_etat_avancement/00_project_global_status.md`
3. `docs/01_contexte_projet/01_mvp_scope.md`
4. `docs/05_blocages_et_risques/00_problemes_racines.md`
5. `docs/02_gouvernance_et_decisions/00_registre_decisions.md`
6. `docs/07_donnees_et_referentiels/00_data_landscape.md`
7. `docs/00_SOURCE_OF_TRUTH_MASTER.md`

## 3. Ce qui fait autorité

- la référence projet est dans `docs/01_project_reference/`
- la gouvernance décisionnelle est dans `docs/00_source_of_truth/`, `docs/01_contexte_projet/`, `docs/02_gouvernance_et_decisions/`, `docs/04_etat_avancement/`, `docs/05_blocages_et_risques/` et `docs/07_donnees_et_referentiels/`
- le contractuel et les rapports sont dans `docs/02_contractual_and_reports/`
- la mémoire IA résume, mais ne remplace pas, les documents maîtres

## 4. Ce qui ne fait pas autorité

- `docs/04_working_prompts_and_runs/`
- `docs/99_legacy_archive/`
- les exports bureautiques `generated_exports/`

## 5. Modules critiques

| Zone | Points à préserver |
|---|---|
| Backend | contrats d’API consommés par le frontend, routes analytics/observatory/layers/ingestion/admin |
| Frontend | dashboards cartographiques et analytiques, écrans admin, logique de filtres et parcours protégés |
| Base | couche `api`, schémas `metadata`, `security`, `staging`, `swat_*`, `wasp_*` |
| Gouvernance | logs, popup rules, scan des données, data viewer, rôles utilisateurs |

## 6. Points de vigilance

- ne pas créer de nouvelle source documentaire concurrente ;
- ne pas modifier des endpoints sans vérifier le frontend consommateur ;
- ne pas utiliser `99_legacy_archive` comme base de vérité ;
- distinguer clairement données brutes, vues d’exposition et restitutions analytiques ;
- préserver la cohérence entre documentation active et code.
- ne jamais mélanger débit instantané et volume journalier barrage.

## 7. Regles barrage a memoriser

- `DEBIT` = debit instantane = `m3/s`.
- `LACHER` = volume journalier barrage = `Mm3/j`.
- `RESTITUTION` est seulement un alias source de `LACHER`.
- `APPORT` = volume journalier entrant = `Mm3/j`; `APPORTS_HM3` reste un alias legacy.
- `TRANSFERT` = volume journalier transfere = `Mm3/j`.
- `VOLUME` = stock barrage = `Mm3`.
- `lacher_m3s` est legacy technique et ne doit plus etre expose comme flux metier barrage.

## 8. Regles qualite sensibles a la casse

- `MO` = Matieres organiques.
- `Mo` = Molybdene.
- Ne jamais fusionner `MO` et `Mo`.
- Ne jamais appliquer de normalisation `upper()` / `lower()` sur ces codes metier sensibles.
- `MO_METAL` est un alias legacy mappe vers `Mo` uniquement quand la source brute prouve `Molybdene(mg/l)`.

## 9. Logique d’intervention recommandée

1. identifier le document maître du sujet ;
2. lire le code concerné ;
3. limiter le changement au bon périmètre ;
4. mettre à jour la documentation active si le comportement change ;
5. compléter les preuves ou les pointeurs d’entrée si nécessaire.

## 10. Regle pollution hydrologie Phase E

- Le dashboard pollution utilise un moteur topologique visuel, pas un moteur hydraulique scientifique.
- Le runtime actif est `geo_work.reseau_hydro_edges_final` + `geo_work.reseau_hydro_edges_final_vertices_pgr`.
- Ne pas inverser automatiquement les aretes avec `Z_Max > Z_Min`.
- `direction_validated=false` et `hydraulic_direction_validated=false` tant que la validation MNT/source-target n'est pas faite.
- Le fallback non oriente est acceptable pour la demonstration, mais doit rester explicitement signale comme `used_fallback=true`.

## 11. Pipeline DEV pollution IDP

- Le pipeline DEV IDP pollution charge les SHP en staging, consolide `geo.ref_site_pollution`, pivote les mesures P0 dans `qualite.resultat_mesure` et expose `api.v_pollution_sites` / `api.v_pollution_latest_results`.
- Le router `/api/v1/pollution` est lecture seule et sert la premiere couche MapLibre DEV.
- Les mappings P0 `NH4`/`NO3` et unites sont corriges en DEV depuis les referentiels existants.
- Avant pre-production, traiter les mesures sans geometrie/site et les arbitrages doublons/conflits ; ne pas dedoublonner automatiquement.

## 12. Pipeline SAD Sebou - Model Build, Feature Store et IA

Mise a jour du 2026-05-22 :

- Le projet evolue vers une plateforme hydro-spatio-temporelle gouvernee, reproductible, QA-first, ML-ready, Graph-ready et compatible futur Digital Twin hydro-environnemental.
- Le pipeline cible est : sources brutes -> raw/staging -> canonical reference -> model_build -> QA/lineage/certification -> feature_store -> training datasets -> ML/forecasting/surrogate -> future Graph AI.
- Phase A `Data Governance Foundation` : READY.
- Phase B `Model Build Specification` : READY.
- Phase C `Feature Store Specification` : READY.
- Phase D `QA & Lineage Framework` : READY.
- Phase E `Pre-ML Readiness & First ML Pilot` : PREPARED.
- Phase E1 `First Real ML Sandbox Execution` : SANDBOX_BASELINE_EXECUTED. Run `run_20260522_143742_hydro_ml_baseline_v0_sandbox`, dataset hash `a1d4a95709562a3c57c143b8bb982f1e010ffabf3817f4430ad3f3b38dcce26e`, persistence baseline uniquement, outputs `ML_SANDBOX_ONLY`, feedback vers D.1 Graph Governance.
- Les outputs SWAT/WASP actuels restent `LEGACY_MODELING_TO_REPLACE`.
- Aucun mapping spatial, SWAT ou WASP ne doit etre fige sans validation SIG/QA, Reda ou Anas.
- Aucun Graph AI officiel ne doit etre produit tant que la topology et la direction hydraulique ne sont pas validees.
- E1 autorise uniquement un pipeline hydro sandbox pour observer gaps, leakage, instabilite features, problemes de splits et limites QA. Aucun reporting DG, GNN, embedding graph, propagation officielle ou promotion scientifique n'est autorise.
- E1.1 révèle déjà : forte lacune évaporation (~74% null), généralisation faible à J+7 en test, environnement ML à stabiliser avant XGBoost/LightGBM, aucun signal graph exploitable car aucune feature graph-aware n'a été utilisée.

## 13. Gouvernance décisionnelle

Mise a jour du 2026-05-22 :

- Le projet est maintenant piloté par cinq documents maîtres : état global, MVP/périmètre, problèmes racines, registre des décisions et data landscape.
- Les audits et lots historiques restent des preuves, mais ne doivent plus être le niveau principal de pilotage.
- Les anomalies doivent être classées en `ANOMALIE`, `AMBIGUITE`, `DONNEE_ABSENTE`, `FUTURE_DONNEE`, `EXPERIMENTAL` ou `STABILISE`.
- Le statut global est : migration historique clôturée avec backlog, dashboard cartographique métier P0 prêt DEV, IDP pollution GO DEV mais NOGO préproduction, SWAT/WASP sandbox legacy.
- Avant toute évolution, vérifier le document maître de gouvernance concerné puis `docs/00_SOURCE_OF_TRUTH_MASTER.md`.

## 14. Réorganisation documentaire 2026-05-22

- Rapport principal : `docs/90_reorganisation_documentaire_finale/16_rapport_final_reorganisation.md`.
- Source consolidée : `docs/00_source_of_truth/01_source_of_truth_consolidee.md`.
- Audit BD read-only : 339 objets tables/vues, 31 vues matérialisées, 4554 colonnes.
- Documents analysés : 2144.
- Lot A exécuté : 50 fichiers historiques racine déplacés dans `docs/12_historique_et_archives/root_legacy/`.
- Références mises à jour pendant le lot A : 216 occurrences.
- Les dossiers historiques complets restent en place pour éviter de casser les liens ; leur déplacement est documenté comme lot B différé.
- Toute ancienne référence à un fichier racine `docs/12_*`, `docs/14_*`, `docs/30_*`, etc. doit être recherchée sous `docs/12_historique_et_archives/root_legacy/`.

## 15. Dashboard qualité réglementaire P0

- Route DEV : `/dashboard-qualite-reglementaire`.
- Périmètre : Tableau n°1, `type_eau=surface_generale`, 41 paramètres, 36 classifiables, 177 seuils actifs, 28 exclus.
- Les paramètres observationnels restent visibles avec statut `NON_CLASSIFIABLE` et ne participent jamais à la qualité globale.
- Contrats critiques : `MO != Mo`, `NO3 -> NO3-`, `O2_DISSOUS -> O2_DISS`.
- Statut : `GO_DEV_DEMO_DASHBOARD_QUALITY_REGULATORY_P0`, pas encore `GO_PREPROD_FINAL`.
