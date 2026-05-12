-- =============================================================================
-- BLOC 2 — S1 : Vues WASP normalisées dans le schéma api
-- Fichier  : backend/sql/bloc2_view_wasp_resultats_actifs.sql
-- Créé     : 2026-04-14  |  Révisé : 2026-04-14 (v2 — ajustements pré-exécution)
-- Auteur   : SAD Sebou — Architecture Data
--
-- Sources exploitées :
--   wasp_sebou.wasp_results    (931 770 lignes — seule source WASP/SWAT active)
--   wasp_sebou.wasp_scenarios  (référentiel scénarios, 1 scénario actif)
--                               ⚠ Pas de colonne scenario_code native :
--                               scenario_code est dérivé de name via
--                               LOWER(REPLACE(TRIM(name), ' ', '_'))
--   wasp_sebou.wasp_variables  (référentiel variables : code, nom, unité)
--
-- Vues créées :
--   1. api.v_wasp_resultats_actifs    — format long, grain journalier
--   2. api.v_wasp_resultats_mensuel   — agrégation mensuelle moy/min/max/stddev
--   3. api.v_wasp_snapshot_spatial    — dernière valeur par partition exacte
--
-- Modifications v2 (obligatoires) :
--   - Ajout scenario_code dérivé dans les 3 vues
--   - Renommage date → date_simulation dans vue 1
--   - Snapshot v3 sécurisé avec DISTINCT ON (scenario_id, segment_id, variable_id)
--     ORDER BY date DESC, plus robuste que MAX + re-JOIN
--
-- Modifications v2 (non bloquantes) :
--   - Vue mensuelle : ajout nb_jours_theoriques_mois
--   - Snapshot : ajout nb_obs_segment_variable
--   - Validation DO : contrôle NULL explicite
--
-- Rollback complet (ordre inverse des dépendances) :
--   DROP VIEW IF EXISTS api.v_wasp_snapshot_spatial;
--   DROP VIEW IF EXISTS api.v_wasp_resultats_mensuel;
--   DROP VIEW IF EXISTS api.v_wasp_resultats_actifs;
-- =============================================================================

BEGIN;

-- =============================================================================
-- VUE 1 : api.v_wasp_resultats_actifs
-- Grain     : 1 ligne par (scenario_id, segment_id, date_simulation, variable_id)
-- Usage     : séries temporelles journalières, comparaison simulé/observé
-- Cardinalité attendue : ~931 770 lignes
--
-- Colonnes exposées (ordre final) :
--   source_model, scenario_id, scenario_code, scenario_nom, modele_version,
--   scenario_date_debut, scenario_date_fin,
--   segment_id,
--   date_simulation, bucket_month, annee, mois,
--   variable_id, variable_code, variable_nom, variable_unite,
--   valeur
-- =============================================================================

CREATE OR REPLACE VIEW api.v_wasp_resultats_actifs AS
SELECT
    -- ── Traçabilité source ────────────────────────────────────────────────────
    'WASP'::text                                    AS source_model,

    -- ── Scénario ─────────────────────────────────────────────────────────────
    r.scenario_id,
    -- scenario_code dérivé : wasp_scenarios.name n'a pas de colonne code dédiée.
    -- Dérivation déterministe : LOWER(REPLACE(TRIM(name), ' ', '_'))
    -- Ex: "Baseline Sebou 2023" → 'baseline_sebou_2023'
    LOWER(REPLACE(TRIM(ws.name), ' ', '_'))         AS scenario_code,
    ws.name                                         AS scenario_nom,
    ws.model_version                                AS modele_version,
    ws.start_date                                   AS scenario_date_debut,
    ws.end_date                                     AS scenario_date_fin,

    -- ── Dimension spatiale ───────────────────────────────────────────────────
    r.segment_id,

    -- ── Dimension temporelle ─────────────────────────────────────────────────
    -- Renommé date → date_simulation pour éviter l'ambiguïté avec le mot-clé SQL DATE
    r.date                                          AS date_simulation,
    date_trunc('month', r.date)::date               AS bucket_month,
    EXTRACT(year  FROM r.date)::int                 AS annee,
    EXTRACT(month FROM r.date)::int                 AS mois,

    -- ── Variable ─────────────────────────────────────────────────────────────
    r.variable_id,
    wv.code                                         AS variable_code,
    wv.name                                         AS variable_nom,
    wv.unit                                         AS variable_unite,

    -- ── Valeur ───────────────────────────────────────────────────────────────
    r.value                                         AS valeur

FROM      wasp_sebou.wasp_results    r
JOIN      wasp_sebou.wasp_scenarios  ws ON ws.id = r.scenario_id
JOIN      wasp_sebou.wasp_variables  wv ON wv.id = r.variable_id;

COMMENT ON VIEW api.v_wasp_resultats_actifs IS
    'Vue normalisée journalière des résultats WASP (source_model=WASP). '
    'Grain : 1 ligne par (scenario, segment, date_simulation, variable). '
    'scenario_code est dérivé de wasp_scenarios.name (pas de colonne native). '
    'Colonnes : source_model, scenario_id, scenario_code, scenario_nom, modele_version, '
    'scenario_date_debut, scenario_date_fin, segment_id, date_simulation, bucket_month, '
    'annee, mois, variable_id, variable_code, variable_nom, variable_unite, valeur.';


-- =============================================================================
-- VUE 2 : api.v_wasp_resultats_mensuel
-- Grain     : 1 ligne par (scenario_id, segment_id, bucket_month, variable_code)
-- Usage     : graphiques de tendance mensuelle, exports analytiques
-- Cardinalité attendue : ~30 000–40 000 lignes
--
-- Colonnes exposées (ordre final) :
--   source_model, scenario_id, scenario_code, scenario_nom,
--   segment_id,
--   bucket_month, annee, mois, nb_jours_theoriques_mois,
--   variable_code, variable_nom, variable_unite,
--   valeur_moy, valeur_min, valeur_max, valeur_ecart_type, nb_obs
-- =============================================================================

CREATE OR REPLACE VIEW api.v_wasp_resultats_mensuel AS
SELECT
    -- ── Traçabilité source ────────────────────────────────────────────────────
    'WASP'::text                                    AS source_model,

    -- ── Scénario ─────────────────────────────────────────────────────────────
    r.scenario_id,
    LOWER(REPLACE(TRIM(ws.name), ' ', '_'))         AS scenario_code,
    ws.name                                         AS scenario_nom,

    -- ── Dimension spatiale ───────────────────────────────────────────────────
    r.segment_id,

    -- ── Dimension temporelle ─────────────────────────────────────────────────
    date_trunc('month', r.date)::date                            AS bucket_month,
    -- annee/mois derivés de date_trunc (déjà dans le GROUP BY) — pas de r.date direct
    EXTRACT(year  FROM date_trunc('month', r.date))::int         AS annee,
    EXTRACT(month FROM date_trunc('month', r.date))::int         AS mois,
    -- Nombre de jours théoriques du mois (gère années bissextiles)
    EXTRACT(
        DAY FROM (
            date_trunc('month', r.date) + INTERVAL '1 month' - INTERVAL '1 day'
        )
    )::int                                                       AS nb_jours_theoriques_mois,

    -- ── Variable ─────────────────────────────────────────────────────────────
    wv.code                                         AS variable_code,
    wv.name                                         AS variable_nom,
    wv.unit                                         AS variable_unite,

    -- ── Agrégats ─────────────────────────────────────────────────────────────
    AVG(r.value)                                    AS valeur_moy,
    MIN(r.value)                                    AS valeur_min,
    MAX(r.value)                                    AS valeur_max,
    STDDEV(r.value)                                 AS valeur_ecart_type,
    -- nb_obs = jours effectivement présents dans la table (peut différer du théorique)
    COUNT(*)                                        AS nb_obs

FROM      wasp_sebou.wasp_results    r
JOIN      wasp_sebou.wasp_scenarios  ws ON ws.id = r.scenario_id
JOIN      wasp_sebou.wasp_variables  wv ON wv.id = r.variable_id
GROUP BY
    r.scenario_id, ws.name,
    r.segment_id,
    date_trunc('month', r.date),
    wv.code, wv.name, wv.unit;

COMMENT ON VIEW api.v_wasp_resultats_mensuel IS
    'Agrégation mensuelle des résultats WASP (source_model=WASP). '
    'Grain : 1 ligne par (scenario, segment, mois, variable). '
    'nb_jours_theoriques_mois corrige les mois de 28/29/30/31 jours. '
    'Colonnes : source_model, scenario_id, scenario_code, scenario_nom, segment_id, '
    'bucket_month, annee, mois, nb_jours_theoriques_mois, variable_code, variable_nom, '
    'variable_unite, valeur_moy, valeur_min, valeur_max, valeur_ecart_type, nb_obs.';


-- =============================================================================
-- VUE 3 : api.v_wasp_snapshot_spatial   (v2 — DISTINCT ON sécurisé)
-- Grain     : 1 ligne par (scenario_id, segment_id, variable_id) — dernière date
-- Usage     : cartes choroplèthes, indicateurs tableau de bord
-- Cardinalité attendue : nb_segments × nb_variables (compact)
--
-- Sécurisation v2 : DISTINCT ON (scenario_id, segment_id, variable_id)
--   ORDER BY date DESC au lieu du pattern MAX + re-JOIN qui peut produire
--   des doublons si deux lignes partagent exactement la même dernière date
--   pour un même triplet (scénario, segment, variable).
--
-- Colonnes exposées (ordre final) :
--   source_model, scenario_id, scenario_code, scenario_nom, modele_version,
--   segment_id,
--   derniere_date, annee_snapshot, mois_snapshot,
--   variable_code, variable_nom, variable_unite,
--   valeur_derniere, nb_obs_segment_variable
-- =============================================================================

CREATE OR REPLACE VIEW api.v_wasp_snapshot_spatial AS
WITH obs_counts AS (
    -- Pré-calcul du nombre total d'observations par (scenario, segment, variable)
    -- pour enrichir le snapshot sans second passage sur la table principale
    SELECT
        scenario_id,
        segment_id,
        variable_id,
        COUNT(*) AS nb_obs_total
    FROM wasp_sebou.wasp_results
    GROUP BY scenario_id, segment_id, variable_id
),
snapshot_raw AS (
    -- DISTINCT ON garantit exactement 1 ligne par partition (scenario, segment, variable)
    -- en prenant la date la plus récente. PostgreSQL évalue ORDER BY avant DISTINCT ON.
    SELECT DISTINCT ON (r.scenario_id, r.segment_id, r.variable_id)
        r.scenario_id,
        r.segment_id,
        r.variable_id,
        r.date      AS derniere_date,
        r.value     AS valeur_derniere
    FROM wasp_sebou.wasp_results r
    ORDER BY r.scenario_id, r.segment_id, r.variable_id, r.date DESC
)
SELECT
    -- ── Traçabilité source ────────────────────────────────────────────────────
    'WASP'::text                                    AS source_model,

    -- ── Scénario ─────────────────────────────────────────────────────────────
    s.scenario_id,
    LOWER(REPLACE(TRIM(ws.name), ' ', '_'))         AS scenario_code,
    ws.name                                         AS scenario_nom,
    ws.model_version                                AS modele_version,

    -- ── Dimension spatiale ───────────────────────────────────────────────────
    s.segment_id,

    -- ── Snapshot temporel ────────────────────────────────────────────────────
    s.derniere_date,
    EXTRACT(year  FROM s.derniere_date)::int        AS annee_snapshot,
    EXTRACT(month FROM s.derniere_date)::int        AS mois_snapshot,

    -- ── Variable ─────────────────────────────────────────────────────────────
    wv.code                                         AS variable_code,
    wv.name                                         AS variable_nom,
    wv.unit                                         AS variable_unite,

    -- ── Valeur et couverture ─────────────────────────────────────────────────
    s.valeur_derniere,
    oc.nb_obs_total                                 AS nb_obs_segment_variable

FROM      snapshot_raw              s
JOIN      wasp_sebou.wasp_scenarios ws  ON ws.id = s.scenario_id
JOIN      wasp_sebou.wasp_variables wv  ON wv.id = s.variable_id
JOIN      obs_counts                oc  ON  oc.scenario_id = s.scenario_id
                                        AND oc.segment_id  = s.segment_id
                                        AND oc.variable_id = s.variable_id;

COMMENT ON VIEW api.v_wasp_snapshot_spatial IS
    'Snapshot spatial WASP (source_model=WASP). '
    'Dernière valeur disponible par partition exacte (scenario_id, segment_id, variable_id). '
    'Sécurisé via DISTINCT ON + ORDER BY date DESC — pas de doublon possible. '
    'nb_obs_segment_variable indique la couverture temporelle totale du triplet. '
    'Colonnes : source_model, scenario_id, scenario_code, scenario_nom, modele_version, '
    'segment_id, derniere_date, annee_snapshot, mois_snapshot, variable_code, variable_nom, '
    'variable_unite, valeur_derniere, nb_obs_segment_variable.';

COMMIT;


-- =============================================================================
-- REQUÊTES DE VALIDATION POST-DÉPLOIEMENT (à exécuter séparément, hors transaction)
-- =============================================================================

-- ----------------------------------------------------------------------------
-- VALIDATION 1 : Comptage total par vue avec seuils de cohérence
-- Attendu :
--   v_wasp_resultats_actifs  ≈ 931 770 lignes (tolérance -5%)
--   v_wasp_resultats_mensuel ≈ 10 000–50 000 lignes
--   v_wasp_snapshot_spatial  > 0 lignes, compact
-- ----------------------------------------------------------------------------
SELECT
    vue,
    lignes,
    CASE
        WHEN vue = 'api.v_wasp_resultats_actifs'
             AND lignes > 885000  THEN '✅ OK (>' || 885000 || ')'
        WHEN vue = 'api.v_wasp_resultats_mensuel'
             AND lignes BETWEEN 5000 AND 100000 THEN '✅ OK (plage attendue)'
        WHEN vue = 'api.v_wasp_snapshot_spatial'
             AND lignes > 0 THEN '✅ OK'
        WHEN lignes = 0 THEN '❌ VUE VIDE — vérifier les JOINs et les tables source'
        ELSE '⚠ Valeur hors plage attendue — vérifier'
    END AS statut
FROM (
    SELECT 'api.v_wasp_resultats_actifs'  AS vue,
           COUNT(*)                       AS lignes
    FROM   api.v_wasp_resultats_actifs

    UNION ALL

    SELECT 'api.v_wasp_resultats_mensuel',
           COUNT(*)
    FROM   api.v_wasp_resultats_mensuel

    UNION ALL

    SELECT 'api.v_wasp_snapshot_spatial',
           COUNT(*)
    FROM   api.v_wasp_snapshot_spatial
) counts
ORDER BY vue;


-- ----------------------------------------------------------------------------
-- VALIDATION 2 : Test sur variable DO (Dissolved Oxygen)
-- Contrôles :
--   - source_model = 'WASP' systématiquement
--   - valeur dans la plage physique [0, 20] mg/L
--   - aucune valeur NULL
--   - couverture pluriannuelle (date_min ≠ date_max)
--   - nb_segments > 0
-- ----------------------------------------------------------------------------
SELECT
    source_model,
    scenario_id,
    scenario_code,
    scenario_nom,
    variable_code,
    variable_nom,
    variable_unite,
    COUNT(*)                                        AS nb_lignes,
    MIN(date_simulation)                            AS date_min,
    MAX(date_simulation)                            AS date_max,
    (MAX(date_simulation) - MIN(date_simulation))   AS amplitude_jours,
    COUNT(DISTINCT segment_id)                      AS nb_segments,
    ROUND(AVG(valeur)::numeric, 4)                  AS valeur_moy,
    ROUND(MIN(valeur)::numeric, 4)                  AS valeur_min,
    ROUND(MAX(valeur)::numeric, 4)                  AS valeur_max,
    -- Contrôles qualité
    COUNT(*) FILTER (WHERE valeur IS NULL)          AS nb_null,
    COUNT(*) FILTER (WHERE valeur < 0)              AS nb_negatifs,
    COUNT(*) FILTER (WHERE valeur > 20)             AS nb_hors_seuil_20,
    CASE
        WHEN COUNT(*) FILTER (WHERE valeur IS NULL) > 0 THEN '❌ NULL présents'
        WHEN COUNT(*) FILTER (WHERE valeur < 0)    > 0 THEN '⚠ Valeurs négatives'
        WHEN COUNT(*) FILTER (WHERE valeur > 20)   > 0 THEN '⚠ Valeurs > 20 mg/L'
        WHEN MIN(date_simulation) = MAX(date_simulation)   THEN '⚠ Série ponctuelle'
        ELSE '✅ OK'
    END AS statut_qa
FROM api.v_wasp_resultats_actifs
WHERE variable_code = 'DO'
GROUP BY
    source_model, scenario_id, scenario_code, scenario_nom,
    variable_code, variable_nom, variable_unite
ORDER BY scenario_id;


-- ----------------------------------------------------------------------------
-- VALIDATION 3 : Snapshot spatial pour variable DO
-- Contrôles :
--   - 1 seule ligne par segment (unicité garantie par DISTINCT ON)
--   - source_model = 'WASP'
--   - nb_obs_segment_variable renseigné et cohérent
--   - aucun segment avec valeur_derniere NULL
--   - cohérence: derniere_date unique par snapshot (tolérance : certains segments
--     peuvent avoir arrêté à des dates différentes)
-- ----------------------------------------------------------------------------
SELECT
    source_model,
    scenario_code,
    scenario_nom,
    modele_version,
    variable_code,
    variable_unite,
    -- Couverture spatiale
    COUNT(DISTINCT segment_id)                              AS nb_segments_couverts,
    -- Snapshot temporel
    MIN(derniere_date)                                      AS derniere_date_min,
    MAX(derniere_date)                                      AS derniere_date_max,
    COUNT(DISTINCT derniere_date)                           AS nb_dates_snapshot_distinctes,
    -- Valeurs snapshot
    ROUND(AVG(valeur_derniere)::numeric, 4)                 AS valeur_moy_snapshot,
    ROUND(MIN(valeur_derniere)::numeric, 4)                 AS valeur_min_snapshot,
    ROUND(MAX(valeur_derniere)::numeric, 4)                 AS valeur_max_snapshot,
    -- Couverture temporelle totale (depuis nb_obs_segment_variable)
    ROUND(AVG(nb_obs_segment_variable)::numeric, 0)         AS nb_obs_moyen_par_segment,
    MIN(nb_obs_segment_variable)                            AS nb_obs_min_segment,
    MAX(nb_obs_segment_variable)                            AS nb_obs_max_segment,
    -- Contrôles qualité
    COUNT(*) FILTER (WHERE valeur_derniere IS NULL)         AS nb_segments_null,
    COUNT(*) FILTER (WHERE nb_obs_segment_variable = 0)     AS nb_segments_sans_obs,
    CASE
        WHEN COUNT(*) FILTER (WHERE valeur_derniere IS NULL)  > 0 THEN '❌ NULL présents'
        WHEN COUNT(*) FILTER (WHERE nb_obs_segment_variable = 0) > 0 THEN '⚠ Segment sans obs'
        WHEN COUNT(DISTINCT segment_id) = 0 THEN '❌ Aucun segment'
        ELSE '✅ OK'
    END AS statut_qa
FROM api.v_wasp_snapshot_spatial
WHERE variable_code = 'DO'
GROUP BY
    source_model, scenario_code, scenario_nom,
    modele_version, variable_code, variable_unite
ORDER BY scenario_code;
