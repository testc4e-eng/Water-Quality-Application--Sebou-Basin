# Rapport d'Audit Qualité Données - Migration Schéma Public vers Schémas Métier

Date: 2026-04-03
Base analysée: `abh_sad`
Périmètre: tables et vues traitées pendant la session (hydro, meteo, qualite, infra, geo, metadata, api, public, staging)

## 1) Méthodologie
- Vérification structurelle: schémas, colonnes, PK/FK, index
- Vérification qualité: nulls, valeurs négatives, doublons, clés de jointure, couverture temporelle
- Vérification migration: correspondance source/target, volumétrie, mapping legacy -> UUID
- Vérification exploitation dashboard: vues API, géométrie, cohérence des lignes exposées

## 2) Constats globaux de qualité

### 2.1 Urbanisation / migration
- Constat: migration partiellement hétérogène selon domaines (certaines entités encore legacy ou renommées différemment selon environnements).
- Impact: risque de confusion des jointures et de non-uniformité API.
- Statut: Partiellement corrigé (normalisation metadata + vues API engagée).

### 2.2 Géométrie SIG
- Constat: plusieurs couches ont SRID=0 et quelques géométries invalides sur certains jeux (historique audit).
- Impact: risque d'erreurs carto, surcoût spatial, résultats incohérents en `ST_Intersects`.
- Statut: À corriger progressivement (plan de normalisation SRID/validité à maintenir).

### 2.3 Référentiels dupliqués
- Constat: `geo.source` contient des doublons de `id` (ids 1,2,3 observés).
- Impact: duplication des lignes dans les vues API lors des jointures.
- Statut: Contourné en vue (`DISTINCT ON`) dans `api.v_hydro_debit_sources_timeseries`; correction source toujours recommandée.

## 3) Détail par table/processus traité

## 3.1 `hydro._legacy_mesures_debit` vs `hydro.mesure_debit`
- Volumétrie: 521433 vs 521433
- Doublons internes:
  - legacy `(ire_station, date_jr)`: 0
  - new `(station_id, temps)`: 0
- Valeurs négatives: 1931 (dans les deux jeux)
- Mapping legacy -> station UUID: 100%
- Remarque: la comparaison exacte ligne-à-ligne diffère sur l'heure (00:00/01:00) mais pas sur la logique station+jour+valeur.
- Action réalisée:
  - suppression de `hydro._legacy_mesures_debit`
  - QA ajoutée sur `hydro.mesure_debit` (`qa_flag_negative`, `qa_flag_outlier`, `qa_flag_method_missing`, trigger)
  - convention `bucket_day` UTC via vue API
- Statut: Corrigé et industrialisé.

## 3.2 `public.mesures_debit_jr` (source externe `abh_sebou`) -> `staging.mesures_debit_jr`
- Migration réalisée avec succès
- Source = cible: 173251 lignes
- Doublons PK `code_debit`: 0
- Statut: OK (archivage/traçabilité en staging).

## 3.3 `hydro.barrage_bathymetrie` et `hydro.mesure_barrage`
- `hydro.barrage_bathymetrie`:
  - 62359 lignes
  - colonnes non temporelles (`hauteur_m`, `volume_mm3`, `surface_km2`, `ire_barrage`)
  - pas de doublons exacts détectés
- `hydro.mesure_barrage`:
  - initialement vide
  - alimentée depuis `public.mesures_niv_eau_barrages` avec déduplication `(ire_barrage, date_jr)`
  - final: 84831 lignes, doublons `(barrage_id, temps)` = 0
- Remarque qualité majeure:
  - `infra.barrages.ire` non unique (ex `1699/9` dupliqué)
- Action réalisée:
  - mapping barrage UUID via metadata
  - vue carto bathymétrie créée: `api.v_barrage_bathymetrie_geo` (62359 lignes, 0 geom NULL)
- Statut: Corrigé pour exploitation; dette qualité legacy `infra.barrages` à nettoyer.

## 3.4 `metadata.mapping_station` (standardisation)
- Colonnes renommées et enrichies:
  - `legacy_station_id`, `station_id`, `legacy_code_station`, `source_system`, `mapping_confidence`, `created_at`, `updated_at`
- Couverture:
  - mapping legacy->nouveau: 390/390
  - doublons: 0
- Usage API:
  - branché explicitement dans `api.v_station_dimension` et `api.v_hydro_debit_journalier_qa`
- Statut: OK.

## 3.5 `metadata.mapping_barrage`
- Table créée (10 lignes)
- branchée explicitement dans `api.v_barrage_dimension`
- ancienne table `hydro.mapping_barrage_ire` supprimée
- Statut: OK.

## 3.6 `public.mesures_debit_m` (mensuel)
- Structure legacy: `mois` (FR), `annee` (text), `debit_m`
- Qualité:
  - 19316 lignes
  - négatifs: 0, nulls: 0
  - doublons `(ire_station, annee, mois)`: 0
  - parsing mois/année: 100% valide
- Action réalisée:
  - archivage en `staging.mesures_debit_m`
  - migration vers `hydro.mesure_debit_mensuel`
  - vue `api.v_hydro_debit_mensuel` + matview `api.mv_hydro_debit_mensuel`
  - suppression table `public`
- Validation:
  - staging=19316, hydro=19316, API=19316, doublons métier=0
- Statut: Corrigé et industrialisé.

## 3.7 `public.mesures_debit_sources` (événementiel)
- Structure: `id`, `moment`, `ire_source`, `debit`
- Qualité:
  - 2816 lignes
  - null débit: 0, négatifs: 0
  - doublons `(ire_source, moment)`: 0
  - mapping `ire_source -> geo.source.ire_source`: 100%
- Action réalisée:
  - archivage en `staging.mesures_debit_sources`
  - création `metadata.mapping_source`
  - migration vers hypertable `hydro.mesure_debit_source`
  - trigger QA + règles
  - vue `api.v_hydro_debit_sources_timeseries` + matview `api.ca_hydro_debit_source_day`
  - suppression table `public`
- Incident qualité détecté:
  - duplication API initiale due à doublons `geo.source.id`
  - correction appliquée dans la vue API par déduplication contrôlée
- Validation finale:
  - hydro=2816, API=2816, doublons métier=0
- Statut: Corrigé, avec dette source `geo.source` à traiter.

## 4) Liste consolidée des anomalies qualité (finale)

### 4.1 Anomalies corrigées pendant la session
- Redondance `_legacy` débit journalier conservée en parallèle de la table métier.
- Absence de QA opérationnelle (`est_valide` à true partout).
- Absence de modèle mensuel métier pour `mesures_debit_m`.
- Absence de modèle métier pour `mesures_debit_sources`.
- Duplication des sorties API sur débits sources (jointure sur source dupliquée).

### 4.2 Anomalies restantes (à planifier)
- Doublons métiers legacy dans `infra.barrages.ire` (ex: `1699/9`).
- Doublons de clé `id` dans `geo.source`.
- Couches géométriques avec SRID=0 / géométrie invalide sur certains jeux historiques.
- `methode_id` manquant sur séries débit (journalier/sources) => QA méthode en warning massif.

## 5) Recommandations prioritaires (prochain sprint)
1. Nettoyer les doublons `geo.source` et ajouter contrainte d'unicité métier (au moins sur `ire_source`; `id` doit être strictement unique).
2. Dédupliquer `infra.barrages` et imposer unicité sur `ire` après arbitrage métier.
3. Fixer une convention timezone documentée par table (`moment` source locale -> stockage UTC).
4. Renforcer QA par seuils station/source/barrage calibrés métier (pas seulement min=0).
5. Ajouter un rapport d'audit automatique versionné (table `metadata.audit_quality_log`) après chaque migration.

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: création rapport initial consolidé.
- 2026-04-03: migration `mesures_debit_m` et `mesures_debit_sources` vers schémas métier + API.
- 2026-04-03: standardisation mappings metadata station/barrage/source.

## 3.8 `public.mesures_evaporation_jr` (journalier)
- Structure legacy: `id`, `date_mesure`, `code_commune`, `ire_station`, `val_evaporation`, `geom`
- Qualité:
  - 48900 lignes
  - valeurs nulles `val_evaporation`: 10308
  - valeurs négatives: 0
  - doublons `(ire_station, date_mesure)`: 0
  - mapping station (`metadata.mapping_station`) : 100% (0 non mappé)
- Migration réalisée:
  - archivage en `staging.mesures_evaporation_jr`
  - création table métier hypertable `meteo.mesure_evaporation`
  - QA automatique (trigger + flags): `qa_flag_null_value`, `qa_flag_negative`, `qa_flag_outlier`, `qa_flag_method_missing`
  - vue API: `api.v_meteo_evaporation_journalier_qa`
  - matview API: `api.ca_meteo_evaporation_day`
  - suppression table `public.mesures_evaporation_jr` après validation
- Validation:
  - public avant suppression=48900, staging=48900, meteo=48900, API vue=48900, matview=48900
  - invalides QA: 10308 (uniquement valeurs nulles)
  - période: 2013-07-06 -> 2024-08-31
  - stations couvertes: 12
- Statut: Corrigé et industrialisé; anomalie de complétude (nulls) documentée.

## 4) Liste consolidée des anomalies qualité (mise à jour)

### 4.1 Anomalies corrigées pendant la session
- ...
- Absence de modèle métier pour évaporation journalière (`public.mesures_evaporation_jr`) corrigée vers `meteo.mesure_evaporation` hypertable + API.

### 4.2 Anomalies restantes (à planifier)
- ...
- `meteo.mesure_evaporation`: 10308 valeurs manquantes héritées du legacy (à traiter métier: imputation, exclusion analytique, ou drapeau qualité explicite côté dashboard).

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: migration `mesures_evaporation_jr` vers `meteo.mesure_evaporation` + couche API + suppression `public`.
## 3.9 `public.mesures_precipitations_jr_max` (max journalière + stats annuelles)
- Contexte métier: extraction des journées de plus forte précipitation pour une année donnée + statistiques associées.
- Structure legacy: `id`, `annee`, `date_jr`, `p_max`, `p_annuelle`, `nbr_val_jr_mqt`, `nb_mois`, `nb_j_avec_0`, `nb_j_sans_0`, `y`, `ire_precipitation`, `ire_station`
- Qualité:
  - 2085 lignes
  - doublons PK `id`: 0
  - mapping station via `metadata.mapping_station`: 100% (0 non mappé)
  - valeurs négatives `p_max`/`p_annuelle`: 0
  - incohérence `EXTRACT(YEAR(date_jr)) != annee`: 907 lignes
- Migration réalisée:
  - archivage en `staging.mesures_precipitations_jr_max`
  - création table métier `meteo.mesure_precipitation_annuelle_max` (toutes colonnes conservées + mapping/QA)
  - vue API `api.v_meteo_precipitation_annuelle_max`
  - matview API `api.mv_meteo_precipitation_annuelle_max`
  - table de revue mapping non concluant: `metadata.mapping_station_unresolved_precip_ann_max` (vide ici car mapping complet)
  - suppression table `public.mesures_precipitations_jr_max` après validation
- Validation:
  - public avant suppression=2085, staging=2085, meteo=2085, API vue=2085, matview=2085
- Statut: Corrigé et industrialisé; anomalie métier date/année à investiguer (907 lignes).

## 4) Liste consolidée des anomalies qualité (mise à jour)

### 4.2 Anomalies restantes (à planifier)
- ...
- `meteo.mesure_precipitation_annuelle_max`: 907 lignes où l'année de `date_jr` diffère de `annee` (potentiel décalage de définition hydrologique ou erreur de saisie).

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: migration `mesures_precipitations_jr_max` vers `meteo.mesure_precipitation_annuelle_max` + couche API + suppression `public`.

### Mise à jour métier (Règle Année Hydrologique) - 2026-04-03
- Décision validée: la colonne `annee` suit la logique **année hydrologique** (début au mois 9 = septembre).
- Implémentation réalisée dans `meteo.mesure_precipitation_annuelle_max`:
  - ajout `annee_civile`
  - ajout `annee_hydrologique_calculee`
  - ajout `annee_hydrologique_debut_mois` (=9)
  - QA enrichie dans `qa_flags` avec:
    - `flag_date_year_mismatch_civil`
    - `flag_annee_hydrologique_mismatch`
- Résultat de contrôle:
  - `civil_mismatch` = 907
  - `hydro_mismatch` = 0
- Conclusion: les 907 écarts observés vs année civile sont conformes à la règle hydrologique et ne constituent pas une anomalie de données.
## 3.10 `public.mesures_precipitations_jr_traitees` (observé + NASA + valeur remplie)
- Contexte métier confirmé:
  - `val_observees` = mesure observée
  - `val_power_nasa` = donnée NASA
  - `val_remplies` = valeur finale (priorité observée, sinon imputation corrélée NASA)
- Qualité source:
  - 546007 lignes
  - `val_observees` NULL: 45702
  - `val_power_nasa` NULL: 0
  - `val_remplies` NULL: 0
  - négatives: 0
  - doublons `(ire_station, date_jr)`: 0
  - mapping station: 100%
- Migration réalisée:
  - archivage en `staging.mesures_precipitations_jr_traitees`
  - table métier hypertable `meteo.mesure_precipitation_traitee`
  - QA métier ajoutée:
    - `qa_flag_null_filled`
    - `qa_flag_negative`
    - `qa_flag_fill_inconsistency` (si observée existe et diffère de remplie)
    - `qa_flag_source_nasa_only` (observée absente, NASA utilisée)
    - `qa_flag_method_missing`
  - vue API `api.v_meteo_precipitation_traitee_journalier_qa`
  - matview API `api.ca_meteo_precipitation_traitee_day`
  - suppression table `public.mesures_precipitations_jr_traitees` après validation
- Validation:
  - public avant suppression=546007, staging=546007, meteo=546007, API vue=546007, matview=546007
  - duplicats métier `(station_id, temps)`: 0
  - `qa_flag_source_nasa_only` = 45702 (conforme au contexte d'imputation)
- Statut: Corrigé et industrialisé.

## 4) Liste consolidée des anomalies qualité (mise à jour)

### 4.2 Anomalies restantes (à planifier)
- ...
- Sur la série `meteo.mesure_precipitation_traitee`, les jours imputés NASA (`qa_flag_source_nasa_only`) représentent 45702 enregistrements: indicateur qualité à suivre dans les dashboards (part d'imputation).

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: migration `mesures_precipitations_jr_traitees` vers `meteo.mesure_precipitation_traitee` + couche API + suppression `public`.

## 3.11 Rationalisation finale des tables précipitation (source de vérité unique)
- Décision appliquée:
  - `_legacy_mesures_precip` déplacée vers `staging.mesures_precip` puis retirée de `meteo`.
  - `meteo.mesure_precipitation_traitee` renommée en `meteo.mesure_precipitation` (source métier unique).
  - ancien modèle simple `meteo.mesure_precipitation` archivé en `staging.mesure_precipitation_old_model`.
- API validée pour la source de vérité:
  - vue canonique: `api.v_meteo_precipitation_journalier_qa` (inclut `valeur = val_remplies`)
  - agrégat journalier: `api.ca_meteo_precip_day`
- Validation:
  - `staging.mesures_precip` = 669880
  - `staging.mesure_precipitation_old_model` = 507930
  - `meteo.mesure_precipitation` (canonique) = 546007
  - `api.v_meteo_precipitation_journalier_qa` = 546007
  - `api.ca_meteo_precip_day` = 546007
  - QA: `qa_flag_source_nasa_only` = 45702, `qa_flag_fill_inconsistency` = 0, invalides = 0
- Statut: Rationalisation terminée, redondance métier supprimée (hors archives staging).

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: rationalisation finale précipitation: une seule source métier (`meteo.mesure_precipitation`) + API canonique.
## 3.12 `public.mesures_qualite_barrages`
- Structure legacy: `id`, `date_prelevement`, `ire_station`, `parametre_qualite`, `milieu_prelevement`, `val_qual_barr`
- Qualité source:
  - 8714 lignes
  - doublons source_row (`id`) après migration: 0
  - mapping station via `metadata.mapping_station`: 100% (0 non mappé)
- Migration réalisée:
  - archivage en `staging.mesures_qualite_barrages`
  - table métier hypertable `qualite.mesure_qualite_barrage`
  - clé technique ajustée: `PRIMARY KEY (temps, station_id, parametre_qualite, source_row_id)`
    (pour préserver les cas multi-prélèvements/milieux légitimes sur même date+paramètre)
  - QA ajoutée (`qa_flag_null_value`, `qa_flag_negative`, `qa_flag_param_missing`, `qa_flag_station_unmapped`)
  - vue API `api.v_qualite_barrages_mesures`
  - matview API `api.mv_qualite_barrages_day`
  - table revue mapping: `metadata.mapping_station_unresolved_qualite_barrages` (0 ligne)
  - suppression `public.mesures_qualite_barrages` après validation
- Validation:
  - public avant suppression=8714, staging=8714, qualite=8714, API vue=8714
  - matview journalière agrégée=7830 (normal: agrégation)
  - invalides QA = 0
  - période: 1988-10-14 -> 2024-11-29
  - stations: 14, paramètres: 60
- Statut: Corrigé et industrialisé.

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: migration `mesures_qualite_barrages` vers `qualite.mesure_qualite_barrage` + couche API + suppression `public`.
## 3.13 `public.mesures_qualite_nappes`
- Structure legacy: `id`, `date_prelevement`, `ire_station`, `parametre_qualite`, `val_qual_nap`
- Migration réalisée:
  - archivage en `staging.mesures_qualite_nappes`
  - table métier hypertable `qualite.mesure_qualite_nappe`
  - mappings appliqués:
    - station: `metadata.mapping_station` (couverture 100%)
    - nappe: intersection géométrique station -> `geo.nappe` (couverture partielle)
    - paramètre: via `metadata.mapping_parametre_source` / `metadata.referentiel_parametre`
  - vues API:
    - `api.v_qualite_nappes_mesures`
    - `api.mv_qualite_nappes_day`
  - tables de revue mapping:
    - `metadata.mapping_station_unresolved_qualite_nappes` (0)
    - `metadata.mapping_nappe_unresolved_qualite_nappes` (292)
  - suppression `public.mesures_qualite_nappes` après validation
- Validation:
  - public avant suppression=63088, staging=63088, qualite=63088, API vue=63088, matview=63083 (agrégation)
- Qualité détectée:
  - invalides QA: 1 (1 valeur négative)
  - `qa_flag_nappe_unmapped`: 63088 (aucune station n'a intersecté un polygone nappe dans le mapping actuel)
  - `parametre_ref_id` manquant: 72 lignes
  - stations: 292, paramètres: 71
- Statut: Migré et industrialisé, mais mapping nappe et mapping paramètre restent à améliorer.

## 4) Liste consolidée des anomalies qualité (mise à jour)

### 4.2 Anomalies restantes (à planifier)
- ...
- `qualite.mesure_qualite_nappe`: mapping nappe non concluant (292 stations concernées, `qa_flag_nappe_unmapped` massif) -> revoir la logique de rattachement nappe (clé métier ou spatial avec SRID/validité).
- `qualite.mesure_qualite_nappe`: 72 lignes sans `parametre_ref_id` -> compléter `metadata.mapping_parametre_source` pour les nouveaux paramètres nappes.
- `qualite.mesure_qualite_nappe`: 1 valeur négative à valider/corriger métier.

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: migration `mesures_qualite_nappes` vers `qualite.mesure_qualite_nappe` + couche API + suppression `public`.
## 3.14 `public.points_eau_abhs`
- Nature de la donnée: référentiel spatial ponctuel (non time-series).
- Pipeline appliqué:
  - archivage en `staging.points_eau_abhs`
  - création mapping `metadata.mapping_point_eau` (legacy id -> UUID métier)
  - migration vers table métier `infra.point_eau`
  - mapping dérivé:
    - nappe: intersection spatiale vers `geo.nappe`
    - station: proximité spatiale vers `infra.stations_mesure`
  - vue API carto `api.v_points_eau`
  - tables de revue mapping:
    - `metadata.mapping_point_eau_unresolved_nappe`
    - `metadata.mapping_point_eau_unresolved_station`
  - suppression table `public.points_eau_abhs` après validation
- Validation:
  - public avant suppression=46, staging=46, infra=46, API=46
- Qualité détectée:
  - géométrie manquante: 4 points
  - géométrie invalide: 0
  - points sans nappe mappée: 22
  - points sans station mappée: 46 (mapping spatial station non concluant)
- Statut: Migré et exploitable carto, avec dette de mapping station/nappe à traiter en atelier métier.

### Note méthodologique
- Contrairement aux tables de mesures, `points_eau_abhs` n'est pas une série temporelle. La migration en hypertable n'est pas pertinente ici; table de référence métier standard appliquée.

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: migration `points_eau_abhs` vers `infra.point_eau` + vue API carto + suppression `public`.
## 3.15 `public.profils_stations`
- Nature de la donnée: référentiel spatial de profils (non time-series).
- Pipeline appliqué:
  - archivage en `staging.profils_stations`
  - création mapping `metadata.mapping_profil_station` (legacy id -> UUID)
  - migration vers table métier `infra.profil_station`
  - mapping dérivé:
    - station via `metadata.mapping_station` (couverture complète)
    - nappe via intersection spatiale (`geo.nappe`) (couverture partielle)
  - vue API carto `api.v_profils_stations`
  - tables de revue mapping:
    - `metadata.mapping_profil_unresolved_station`
    - `metadata.mapping_profil_unresolved_nappe`
  - suppression `public.profils_stations` après validation
- Validation:
  - public avant suppression=1980, staging=1980, infra=1980, API=1980
- Qualité détectée:
  - géométries manquantes: 0
  - géométries invalides: 0
  - station non mappée: 0
  - nappe non mappée: 1204
- Statut: Migré et exploitable carto, avec dette de rattachement nappe à traiter.

### Note méthodologique
- `profils_stations` est un référentiel spatial; migration en hypertable non pertinente.

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: migration `profils_stations` vers `infra.profil_station` + vue API carto + suppression `public`.
## 3.16 `public.step_ind_abhs`
- Nature de la donnée: référentiel spatial d'entités STEP industrielles (non time-series).
- Pipeline appliqué:
  - archivage en `staging.step_ind_abhs`
  - mapping legacy UUID via `metadata.mapping_step_ind`
  - migration vers table métier `infra.step_industrielle`
  - mapping commune via `admin.communes(code_commune)`
  - vue API carto `api.v_step_industrielles`
  - table de revue mapping commune `metadata.mapping_step_ind_unresolved_commune`
  - suppression `public.step_ind_abhs` après validation
- Validation:
  - public avant suppression=15, staging=15, infra=15, API=15
- Qualité détectée:
  - géométrie manquante: 0
  - géométrie invalide: 0
  - `code_step` manquant/vide: 15 (100%)
  - communes non mappées: 0
- Statut: Migré et exploitable carto, mais identifiant métier `code_step` absent dans tout le jeu source.

### Note méthodologique
- Référentiel spatial non temporel: hypertable non pertinente.

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: migration `step_ind_abhs` vers `infra.step_industrielle` + vue API carto + suppression `public`.
## 3.17 `public.stm_abhs`
- Nature de la donnée: référentiel spatial d'entités STM (non time-series).
- Pipeline appliqué:
  - archivage en `staging.stm_abhs`
  - mapping legacy UUID via `metadata.mapping_stm`
  - migration vers table métier `infra.stm`
  - mapping commune via `admin.communes(code_commune)`
  - vue API carto `api.v_stm`
  - table de revue mapping commune `metadata.mapping_stm_unresolved_commune`
  - suppression `public.stm_abhs` après validation
- Validation:
  - public avant suppression=18, staging=18, infra=18, API=18
- Qualité détectée:
  - géométrie manquante: 0
  - géométrie invalide: 0
  - `code_stm` manquant/vide: 18 (100%)
  - communes non mappées: 0
- Statut: Migré et exploitable carto, mais identifiant métier `code_stm` absent dans tout le jeu source.

### Note méthodologique
- Référentiel spatial non temporel: hypertable non pertinente.

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: migration `stm_abhs` vers `infra.stm` + vue API carto + suppression `public`.
## 3.18 `public.suivi_qualite_brg_garde_hebdo`
- Structure legacy: `id`, `date_prelevement`, `ire_station`, `milieu_prelevement`, `parametre_qualite`, `val_qual_brg_garde_hebdo`, `observation`
- Pipeline exécuté:
  - archivage en `staging.suivi_qualite_brg_garde_hebdo`
  - création table cible hypertable `qualite.suivi_qualite_barrage_hebdo`
  - création vues API associées
  - suppression `public.suivi_qualite_brg_garde_hebdo` après archivage
- Résultat migration métier:
  - 0 ligne chargée dans la table métier
  - cause: `ire_station` absent/vide sur tout le jeu (7094/7094), donc mapping station impossible
- Action de mitigation:
  - création d'un buffer opérationnel `qualite.suivi_qualite_barrage_hebdo_unmapped` contenant 7094 lignes
  - raison de non-mapping tracée (`missing ire_station`)
- Statut: Migration structurelle en place mais intégration métier bloquée en attente de règle de rattachement (station/barrage) validée par équipe métier.

## 4) Liste consolidée des anomalies qualité (mise à jour)

### 4.2 Anomalies restantes (à planifier)
- ...
- `suivi_qualite_brg_garde_hebdo`: 7094 lignes sans `ire_station` exploitable, empêchant tout mapping station/barrage et chargement dans la table métier principale.

## 6) Journal d'évolution (à enrichir)
- 2026-04-03: préparation migration `suivi_qualite_brg_garde_hebdo`, blocage mapping, création buffer `qualite.suivi_qualite_barrage_hebdo_unmapped`.

## 2026-04-03 - suivi_qualite_brg_garde_hebdo (validation métier barrage unique)

- Règle métier validée: 100% des lignes correspondent au barrage **Garde Sebou** (`ire_barrage = 3323/8`).
- Mapping forcé et tracé: `metadata.mapping_barrage` mis à jour avec `legacy_ire_barrage='3323/8'` -> `barrage_id='4179b4bb-277c-4b29-80fa-300fd49eb9c2'`.
- Chargement barrage-centric exécuté depuis `qualite.suivi_qualite_barrage_hebdo_unmapped` vers `qualite.suivi_qualite_barrage_hebdo`.
- Résultat chargement:
  - `unmapped_buffer`: 7094
  - `loaded_main`: 7094
  - `loaded_station_3323_8`: 7094
  - `barrage_id IS NULL`: 0
  - `qa_flag_barrage_unmapped = TRUE`: 0
- Couches de restitution mises à jour:
  - `ANALYZE qualite.suivi_qualite_barrage_hebdo`
  - `REFRESH MATERIALIZED VIEW api.mv_suivi_qualite_barrages_hebdo_day`
  - lignes agrégées matview: 3627

## 2026-04-03 - Rationalisation schema qualite (post-validation barrage garde)

Actions exécutées sans rupture API:
- `qualite.suivi_qualite_barrage_hebdo` renommée en `qualite.suivi_qualite_barrage_garde_hebdo`.
- suppression buffer technique `qualite.suivi_qualite_barrage_hebdo_unmapped` (100% déjà rechargé).
- déplacement vers `public` pour validation métier:
  - `qualite._legacy_qualite_riviere` -> `public._legacy_qualite_riviere`
  - `qualite.suivi_qualite_sebou` -> `public.suivi_qualite_sebou`
- suppression tables vides:
  - `qualite.resultat_analyse`
  - `qualite.campagne_mesure`
  - `qualite.norme_qualite`
  - `qualite.ref_parametre`

Contrôles post-opération:
- Vue API `api.v_suivi_qualite_barrages_hebdo` opérationnelle: 7094 lignes.
- Matview `api.mv_suivi_qualite_barrages_hebdo_day` opérationnelle: 3627 lignes.

## 2026-04-03 - Migration `public._legacy_qualite_riviere` -> `qualite.mesure_qualite_riviere`

Traitement exécuté (pipeline complet):
- archive source créée/alimentée: `staging._legacy_qualite_riviere`.
- table métier créée: `qualite.mesure_qualite_riviere` (hypertable Timescale) + index + trigger QA.
- mapping station: complet via `infra.stations_mesure.code_station` (56/56 IRE distincts mappés).
- mapping paramètres:
  - 56/96 paramètres mappés automatiquement par réutilisation d'un mapping univoque existant.
  - 40/96 non mappés consignés dans `metadata.mapping_parametre_unresolved_legacy_qualite_riviere`.
- couche API créée:
  - `api.v_qualite_riviere_mesures`
  - `api.mv_qualite_riviere_day`
- source `public._legacy_qualite_riviere` retirée après migration (source de vérité basculée).

Résultats de contrôle:
- `staging._legacy_qualite_riviere`: 60097 lignes
- `qualite.mesure_qualite_riviere`: 60097 lignes
- QA `qa_flag_param_missing=TRUE`: 6084 lignes (liées aux 40 paramètres non encore mappés)
- `api.v_qualite_riviere_mesures`: 60097 lignes
- `api.mv_qualite_riviere_day`: 60075 lignes agrégées

## 2026-04-03 - Migration `public.suivi_qualite_sebou` -> `qualite.mesure_qualite_sebou`

Traitement exécuté (pipeline complet):
- archive source: `staging.suivi_qualite_sebou` (snapshot traçabilité).
- table métier créée: `qualite.mesure_qualite_sebou` (hypertable) + index + trigger QA.
- mapping station: complet (6/6 IRE mappés).
- mapping paramètres:
  - 3/13 mappés automatiquement par réutilisation d'un mapping existant.
  - 10/13 non mappés consignés dans `metadata.mapping_parametre_unresolved_suivi_qualite_sebou`.
- couche API créée:
  - `api.v_qualite_sebou_mesures`
  - `api.mv_qualite_sebou_day`
- source `public.suivi_qualite_sebou` retirée après migration.

Résultats de contrôle:
- `staging.suivi_qualite_sebou`: 51402 lignes
- `qualite.mesure_qualite_sebou`: 51402 lignes
- QA `qa_flag_null_value=TRUE`: 9645 lignes
- QA `qa_flag_param_missing=TRUE`: 39540 lignes
- `api.v_qualite_sebou_mesures`: 51402 lignes
- `api.mv_qualite_sebou_day`: 51402 lignes

## 2026-04-03 - Automatisation refresh + mapping assisté paramètres (rivière/sebou)

### Automatisation refresh matviews
- Fonction job créée: `api.fn_refresh_qualite_matviews(job_id int, config jsonb)`.
- Job TimescaleDB actif:
  - `job_id=1008`
  - `application_name=refresh_qualite_riviere_sebou_matviews`
  - intervalle: `1 hour`
  - scheduled: `true`

### Mapping assisté paramètres
- Méthode: normalisation textuelle (`metadata.fn_norm_txt`) et matching automatique univoque via:
  - mappings existants (`metadata.mapping_parametre_source`)
  - référentiel (`metadata.referentiel_parametre`)
- Nouvelles correspondances ajoutées: 4
- Lignes mises à jour dans tables métier:
  - `qualite.mesure_qualite_riviere`: 1972 lignes
  - `qualite.mesure_qualite_sebou`: 11862 lignes

### Impact QA après remapping
- Unresolved paramètres:
  - rivière: 40 -> 39
  - sebou: 10 -> 7
- `qa_flag_param_missing=TRUE`:
  - rivière: 6084 -> 4112
  - sebou: 39540 -> 27678

### Actions de recalcul
- `REFRESH MATERIALIZED VIEW` exécuté:
  - `api.mv_qualite_riviere_day`
  - `api.mv_qualite_sebou_day`
- `ANALYZE` exécuté sur tables métier concernées.

## 2026-04-03 - Inventaire pollution STMS (`public.stms`)

Décision métier appliquée:
- ignorer la ligne invalide/placeholder `id=19` (QA invalide: champs vides, coordonnées 0/0).

Actions exécutées:
- archive source: `staging.stms` alimentée (`19` lignes).
- suppression de `public.stms` après archivage.
- aucune réinjection de la ligne invalide dans le métier.
- exploitation dashboard via vue API créée:
  - `api.v_inventaire_pollution_stms_detail`
  - source: `infra.stm` (18 lignes valides)
  - enrichissement administratif via `admin.communes`
  - projection carto WGS84 exposée (`geom_wgs84`, `longitude`, `latitude`).

Contrôle post-opération:
- `public.stms`: supprimée
- `staging.stms`: 19 lignes
- `infra.stm`: 18 lignes
- `api.v_inventaire_pollution_stms_detail`: 18 lignes

## 2026-04-03 - `public.steps_industrielles` (archive + harmonisation vue API)

Décision appliquée:
- archive `public.steps_industrielles` dans `staging.steps_industrielles` puis suppression de `public`.
- renommage vue API pour convention inventaire pollution:
  - `api.v_step_industrielles` -> `api.v_inventaire_pollution_steps_industrielles_detail`

Contrôle:
- `public.steps_industrielles`: supprimée
- `staging.steps_industrielles`: 14 lignes
- `api.v_inventaire_pollution_steps_industrielles_detail`: 15 lignes (inclut 1 enregistrement infra supplémentaire déjà existant)

## 2026-04-03 - `public.steps` -> `infra.step_inventaire_pollution` + référentiel abréviations

Choix d'architecture appliqué:
- conservation de `infra.step` comme couche de référence légère.
- création d'une table dédiée inventaire: `infra.step_inventaire_pollution`.

Actions réalisées:
- archivage source: `staging.steps` (49 lignes).
- migration vers `infra.step_inventaire_pollution` (49 lignes) avec mapping vers `infra.step`:
  - mapping prioritaire par `code_step`, fallback par coordonnées `X/Y`.
- vue API détail créée:
  - `api.v_inventaire_pollution_steps_detail`.
- suppression de `public.steps` après migration.

Qualité/mapping:
- `qa_flag_unmapped_step=TRUE`: 14 lignes (STEP non résolues vers `infra.step`).
- dates traitées en parsing robuste (formats mixtes `MM/DD/YYYY` et `DD/MM/YYYY`).

Référentiel abréviations (générique inventaires):
- table ref créée: `metadata.referentiel_abreviation_inventaire`.
- table mapping créée: `metadata.mapping_abreviation_colonne_inventaire`.
- extraction depuis `steps.Abréviati`:
  - 8 abréviations référencées
  - 8 mappings source->référence créés

Contrôle post-opération:
- `public.steps`: supprimée
- `staging.steps`: 49 lignes
- `infra.step_inventaire_pollution`: 49 lignes
- `api.v_inventaire_pollution_steps_detail`: 49 lignes

## 2026-04-03 - `public.rejets_brutes` -> `infra.rejet_inventaire_pollution`

Choix d'architecture appliqué:
- table dédiée inventaire: `infra.rejet_inventaire_pollution`.
- lien prioritaire vers `infra.rejet_domestique`.

Actions réalisées:
- archivage source: `staging.rejets_brutes` (277 lignes).
- migration vers `infra.rejet_inventaire_pollution` (277 lignes) avec mapping:
  - priorité mapping par `code_rejet`
  - fallback par coordonnées `X/Y`
- vue API détail créée:
  - `api.v_inventaire_pollution_rejets_bruts_detail`
- suppression de `public.rejets_brutes` après migration.

Qualité/mapping:
- `qa_flag_unmapped_rejet_domestique=TRUE`: 0 ligne (mapping complet).

Abréviations:
- extraction depuis `rejets_brutes.Abréviati` vers référentiel central:
  - `metadata.referentiel_abreviation_inventaire` (+2 entrées)
  - `metadata.mapping_abreviation_colonne_inventaire` (+2 mappings source)

Contrôle post-opération:
- `public.rejets_brutes`: supprimée
- `staging.rejets_brutes`: 277 lignes
- `infra.rejet_inventaire_pollution`: 277 lignes
- `api.v_inventaire_pollution_rejets_bruts_detail`: 277 lignes

## 2026-04-03 - `public.rejet_abattoir` -> `infra.rejet_abattoir_inventaire_pollution`

Traitement exécuté:
- archivage source: `staging.rejet_abattoir` (56 lignes).
- création table dédiée inventaire: `infra.rejet_abattoir_inventaire_pollution`.
- mapping prioritaire vers `infra.rejet_abattoir` via coordonnées `X/Y`.
- création vue API détail:
  - `api.v_inventaire_pollution_rejet_abattoir_detail`.
- suppression de `public.rejet_abattoir` après migration.

Qualité/mapping:
- lignes inventaire: 56
- `qa_flag_unmapped_rejet_abattoir=TRUE`: 1 ligne

Abréviations:
- la source `public.rejet_abattoir` ne contient pas de colonne abréviation.
- journalisation dans `metadata.mapping_abreviation_unresolved_sources`:
  - note: "Aucune colonne abréviation dans la source legacy."

Contrôle post-opération:
- `public.rejet_abattoir`: supprimée
- `staging.rejet_abattoir`: 56 lignes
- `infra.rejet_abattoir_inventaire_pollution`: 56 lignes
- `api.v_inventaire_pollution_rejet_abattoir_detail`: 56 lignes

## 2026-04-03 - `public.mines` -> `infra.mine_inventaire_pollution`

Traitement exécuté:
- archivage source: `staging.mines` (39 lignes).
- création table dédiée inventaire: `infra.mine_inventaire_pollution`.
- mapping vers `infra.mine`:
  - priorité coordonnées `X/Y`
  - fallback sur nom de mine
- création vue API détail:
  - `api.v_inventaire_pollution_mines_detail`
- suppression de `public.mines` après migration.

Qualité/mapping:
- lignes inventaire: 39
- `qa_flag_unmapped_mine=TRUE`: 1 ligne

Abréviations:
- la source `public.mines` ne contient pas de colonne abréviation.
- journalisation dans `metadata.mapping_abreviation_unresolved_sources`:
  - note: "Aucune colonne abréviation dans la source legacy."

Contrôle post-opération:
- `public.mines`: supprimée
- `staging.mines`: 39 lignes
- `infra.mine_inventaire_pollution`: 39 lignes
- `api.v_inventaire_pollution_mines_detail`: 39 lignes

## 2026-04-03 - `public.decharges_Abondonees` -> `infra.decharge_inventaire_pollution`

Décision métier appliquée:
- conserver les lignes placeholders (x=0/y=0, commune vide, etc.) dans l'inventaire avec flags QA.

Traitement exécuté:
- archivage source: `staging.decharges_Abondonees` (11 lignes).
- création table dédiée inventaire: `infra.decharge_inventaire_pollution`.
- mapping vers `infra.decharge`:
  - priorité coordonnées `x/y`
  - fallback nom de site
- création vue API détail:
  - `api.v_inventaire_pollution_decharges_abandonnees_detail`
- suppression de `public.decharges_Abondonees` après migration.

Qualité/mapping:
- lignes inventaire: 11
- `qa_flag_missing_geom=TRUE`: 5
- `qa_flag_missing_commune=TRUE`: 5
- `qa_flag_unmapped_decharge=TRUE`: 5

Abréviations:
- aucune abréviation exploitable dans la source (`F9` vide).
- journalisation dans `metadata.mapping_abreviation_unresolved_sources`.

Contrôle post-opération:
- `public.decharges_Abondonees`: supprimée
- `staging.decharges_Abondonees`: 11 lignes
- `infra.decharge_inventaire_pollution`: 11 lignes
- `api.v_inventaire_pollution_decharges_abandonnees_detail`: 11 lignes

## 2026-04-03 - `public.decharges` -> `infra.decharge_inventaire_pollution_general`

Traitement exécuté:
- archivage source: `staging.decharges` (139 lignes).
- création table dédiée inventaire: `infra.decharge_inventaire_pollution_general`.
- mapping vers `infra.decharge`:
  - priorité `code_decharge` (colonne `Code`),
  - fallback coordonnées `X/Y`,
  - fallback nom du site.
- création vue API détail:
  - `api.v_inventaire_pollution_decharges_detail`
- suppression de `public.decharges` après migration.

Qualité/mapping:
- lignes inventaire: 139
- `qa_flag_unmapped_decharge=TRUE`: 0 ligne

Abréviations:
- extraction depuis `decharges.Abréviati` vers référentiel central:
  - 3 mappings source ajoutés dans `metadata.mapping_abreviation_colonne_inventaire`

Contrôle post-opération:
- `public.decharges`: supprimée
- `staging.decharges`: 139 lignes
- `infra.decharge_inventaire_pollution_general`: 139 lignes
- `api.v_inventaire_pollution_decharges_detail`: 139 lignes

## 2026-04-03 - Harmonisation décharges: vue API consolidée

Objectif réalisé:
- consolidation des deux inventaires décharges dans une vue unique dashboard carto.

Vue créée:
- `api.v_inventaire_pollution_decharges_consolide`
  - sources fusionnées:
    - `infra.decharge_inventaire_pollution` (abandonnées)
    - `infra.decharge_inventaire_pollution_general` (général)
  - colonne de traçabilité: `source_inventaire` (`abandonnees` / `general`)
  - schéma harmonisé + champs carto WGS84 (`geom_wgs84`, `longitude`, `latitude`)

Contrôle:
- total: 150 lignes
- abandonnées: 11 lignes
- général: 139 lignes
- non mappées décharge: 5 lignes (issues des abandonnées placeholders)

## 2026-04-03 - `public.huileries` -> `infra.huilerie_inventaire_pollution`

Traitement exécuté:
- archivage source: `staging.huileries` (606 lignes).
- création table dédiée inventaire: `infra.huilerie_inventaire_pollution`.
- mapping vers `infra.huilerie`:
  - priorité `code_huilerie` (source `Code`),
  - fallback coordonnées `X/Y`,
  - fallback nom huilerie.
- conservation des colonnes inventaire riches via `raw_payload` (JSONB) pour éviter perte d'information.
- création vue API détail:
  - `api.v_inventaire_pollution_huileries_detail`
- suppression de `public.huileries` après migration.

Qualité/mapping:
- lignes inventaire: 606
- `qa_flag_unmapped_huilerie=TRUE`: 0 ligne

Abréviations:
- pas de colonne abréviation dédiée clairement exploitable dans la source.
- journalisation dans `metadata.mapping_abreviation_unresolved_sources`:
  - note: "Aucune colonne abréviation dédiée; informations conservées dans raw_payload."

Contrôle post-opération:
- `public.huileries`: supprimée
- `staging.huileries`: 606 lignes
- `infra.huilerie_inventaire_pollution`: 606 lignes
- `api.v_inventaire_pollution_huileries_detail`: 606 lignes

## 2026-04-03 - `public.sources_polution_mesure` -> modèle mesures pollution multi-rattachement

Contexte métier appliqué:
- mesures ponctuelles sur points de prélèvement, rattachées aux infrastructures d'inventaire.
- règle spécifique validée: multi-rattachement autorisé quand un point match plusieurs infrastructures.

Implémentation réalisée:
- archivage source: `staging.sources_polution_mesure` (141 lignes).
- modèle métier en 3 couches:
  - `qualite.source_pollution_prelevement` (entêtes de prélèvement)
  - `qualite.source_pollution_prelevement_lien` (liens multi-entités)
  - `qualite.source_pollution_mesure_param` (mesures paramétriques en format long)
- parsing des valeurs analytiques:
  - fonctions `metadata.fn_parse_mesure_numeric` et `metadata.fn_extract_qualifier`
  - gestion des valeurs type `<0,010`, `4,5X106`, etc.
- mapping paramètres:
  - réutilisation auto de `metadata.mapping_parametre_source` quand correspondance univoque disponible.
- vue API détaillée créée:
  - `api.v_inventaire_pollution_sources_mesures_detail`
- suppression de `public.sources_polution_mesure` après migration.

Résultats de contrôle:
- `prelevements_rows`: 141
- `liens_rows`: 116
  - `liens_rejet`: 96
  - `liens_step`: 1
  - (multi-rattachement conservé, ex. point matchant rejet+step)
- `mesures_rows`: 7191
- `qa_param_unmapped`: 5499 (paramètres encore non reliés au référentiel)
- `api_rows`: 7242

Abréviations:
- pas de colonne abréviation dédiée dans cette source.
- journalisation dans `metadata.mapping_abreviation_unresolved_sources`.

## 2026-04-03 - Ingestion SWAT qualité (Lebene Innaouen / scénario normal)

### Préparation structure multi-bassin / multi-scénario
- `geo.sous_bassin_swat` enrichie pour identification bassin:
  - `bassin_code='leben_innaouen'`
  - `bassin_nom='Lebene Innaouen'`
- schéma cible créé: `swat_output`
  - `ref_bassin`, `ref_scenario`, `ref_run_modele`, `ref_subbasin`, `ref_parametre_qualite`
  - `mesure_qualite_subbasin_ts` (timeseries)
  - staging: `stg_swat_qualite_long`, `stg_swat_qualite_meta`

### Ingestion fichier Excel
- Source: `data/processed/result_SWATOutput/extracted_swat_tables/SWAT_parameters_qualite.xlsx`
- Run enregistré: `leben_innaouen_normal_20260403_xlsx_v1`
- Paramètres ingérés: `ORGN`, `ORGP`, `NSURQ`, `SOLP`, `SEDP`
- Volumétrie:
  - staging long: 745110 lignes
  - staging metadata/audit: 123 lignes
  - fact table: 745110 lignes
- Couverture:
  - sous-bassins: 18
  - période: 2002-01-01 -> 2024-08-31

### Performance / exploitation
- `mesure_qualite_subbasin_ts` convertie en hypertable Timescale.
- index créés pour filtres run/subbasin/paramètre/temps.

### Vue API consolidée dashboard
- `api.v_swat_qualite_subbasin_consolide`
  - inclut: bassin, scénario, run, paramètre, valeur, QA, géométrie sous-bassin
  - expose `geom_wgs84`, `longitude`, `latitude`
- Contrôle vue:
  - lignes: 745110
  - bassins: 1
  - scénarios: 1
  - paramètres: 5
  - sous-bassins: 18

## 2026-04-03 - Sprint mapping paramètres `sources_polution_mesure`

Objectif:
- réduction forte de `qa_param_unmapped` sur `qualite.source_pollution_mesure_param`.

Actions exécutées:
- mapping explicite vers référentiel existant (codes métier): `Conduc`, `Turbidité`, `Phénol`, `NTK`, `PT`.
- création de 22 nouveaux paramètres dans `metadata.referentiel_parametre` (métaux + huiles/graisses + Fe2).
- création des mappings source (`public.sources_polution_mesure`, `source_column='column_name'`) pour les codes legacy restants.
- passe auto de normalisation complémentaire (`metadata.fn_norm_txt`).
- mise à jour des mesures et recalcul QA via trigger.

Résultats:
- avant: `total=7191`, `qa_param_unmapped=5499`, `codes_unmapped=39`
- après: `total=7191`, `qa_param_unmapped=0`, `codes_unmapped=0`
- mappings source actifs pour cette table: `51`

Impact:
- couverture paramétrique complète pour la source `sources_polution_mesure`.
- la vue `api.v_inventaire_pollution_sources_mesures_detail` exploite désormais les paramètres mappés sans trous référentiel.

## 2026-04-03 - Ingestion WASP Leben Innaouen (scenario normal)

- Renommage confirmé: `geo.sous_bassin_swat` -> `geo.sous_bassin_swat_leben_innaouen` (FK `swat_output.ref_subbasin` conservée automatiquement).
- Source ingérée: `data/processed/result_WASP/SAD/Resultats_Innaouen_WASP_Transforme.xlsx`.
- Schéma cible créé/complété: `wasp_output`.
- Objets créés:
  - `wasp_output.ref_parametre_qualite`
  - `wasp_output.ref_run_modele`
  - `wasp_output.ref_segment_modele`
  - `wasp_output.stg_wasp_qualite_long`
  - `wasp_output.mesure_qualite_segment_ts` (hypertable Timescale)
  - `api.v_wasp_qualite_segment_consolide`
- Référentiel paramètres WASP chargé: 12 paramètres.
- Mapping segments: `segment_local_id -> geo.reseau_hydrographique.id` pour `1..22` (bassin `leben_innaouen`).
- Run chargé: `leben_innaouen_normal_wasp_20260403_xlsx_v1`.

### Contrôles de chargement

- `staging_rows`: 931770
- `fact_rows`: 931770
- `api_rows`: 931770
- `date_min`: 2015-09-01 00:00:00+00
- `date_max`: 2025-08-31 09:41:00+00
- `param_count`: 12
- `segment_count`: 22
- `unmapped_segment_rows`: 0
- `qa_negative_rows`: 0

### Remarques QA

- Horodatage source conservé tel quel (présence d'heures/minutes non alignées jour civil); agrégation dashboard à faire via `bucket_day`.
- Aucun segment non mappé sur ce run.
