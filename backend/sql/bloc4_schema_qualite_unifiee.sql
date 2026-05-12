-- =====================================================================================
-- BLOC 4 : ARCHITECTURE CIBLE - COUCHE QUALITE UNIFIEE (V2)
-- Fichier : backend/sql/bloc4_schema_qualite_unifiee.sql
-- =====================================================================================
-- Objectif : Modéliser le référentiel et les tables transactionnelles pour centraliser
-- toutes les mesures de qualité (labo, campagnes ciblées, rivières, nappes, IDP).
-- Corrections apportées (NULLable params, gestion des doublons, mapping station exact).
-- =====================================================================================

-- Prérequis d'extensions pour sécuriser UUID et géométries
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE SCHEMA IF NOT EXISTS qualite;

-- 1. Référentiel des Unités
CREATE TABLE IF NOT EXISTS qualite.ref_unite (
    id SERIAL PRIMARY KEY,
    code_unite VARCHAR(50) UNIQUE NOT NULL,
    nom_long VARCHAR(100),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Référentiel Canonique des Paramètres (Métaux, Bactério, Physico-chimie)
CREATE TABLE IF NOT EXISTS qualite.ref_parametre (
    id SERIAL PRIMARY KEY,
    code_parametre VARCHAR(100) UNIQUE NOT NULL,  -- ex: 'DISSOLVED_OXYGEN', 'PH', 'BOD5'
    nom_usuel VARCHAR(255) NOT NULL,
    famille_theme VARCHAR(100) NOT NULL,         -- 'Physico-chimie', 'Métaux lourds', 'Microbiologie'
    unite_canonique_id INTEGER REFERENCES qualite.ref_unite(id),
    type_donnee VARCHAR(50) DEFAULT 'numeric',    -- 'numeric', 'categorical', 'boolean'
    limite_detection NUMERIC,
    limite_quantite NUMERIC,
    plage_min_alert NUMERIC,
    plage_max_alert NUMERIC,
    statut_actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table des Correspondances : Sources BRUTES -> Canonique
CREATE TABLE IF NOT EXISTS qualite.map_parametre_source (
    id SERIAL PRIMARY KEY,
    source_system VARCHAR(100) NOT NULL,          -- ex: 'idp_2024_marche_cadre', 'suivi_brg_garde'
    parametre_nom_origine VARCHAR(255) NOT NULL,  -- Le nom exact tel qu'écrit dans la table brute
    parametre_canonique_id INTEGER REFERENCES qualite.ref_parametre(id),
    is_mapped BOOLEAN GENERATED ALWAYS AS (parametre_canonique_id IS NOT NULL) STORED,
    remarques_mapping TEXT,
    UNIQUE (source_system, parametre_nom_origine)
);

-- 4. Référentiels d'origine et natures de mesure
CREATE TABLE IF NOT EXISTS qualite.ref_type_mesure (
    id SERIAL PRIMARY KEY,
    code_type VARCHAR(50) UNIQUE NOT NULL,        -- 'IN_SITU', 'LABORATOIRE', 'SONDE_AUTO'
    description TEXT
);

CREATE TABLE IF NOT EXISTS qualite.ref_source_mesure (
    id SERIAL PRIMARY KEY,
    code_source VARCHAR(100) UNIQUE NOT NULL,     -- 'CAMPAGNE_IDP', 'SUIVI_ABH_REGULIER', 'ETUDE_SPECIFIQUE'
    description TEXT
);

-- 5. Gestion des Campagnes
CREATE TABLE IF NOT EXISTS qualite.campagne (
    id SERIAL PRIMARY KEY,
    nom_campagne VARCHAR(255) NOT NULL,
    source_mesure_id INTEGER REFERENCES qualite.ref_source_mesure(id),
    annee_reference INTEGER,
    date_debut DATE,
    date_fin DATE,
    prestataire_labo VARCHAR(255),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Prélèvement (Table de Fait Spatiale/Temporelle)
CREATE TABLE IF NOT EXISTS qualite.prelevement (
    id SERIAL PRIMARY KEY,
    uuid_prelevement UUID DEFAULT uuid_generate_v4() UNIQUE,
    campagne_id INTEGER REFERENCES qualite.campagne(id),
    -- CORRECTION 1 : Liaison vers la table réelle existante infra_stations_abhs identifiée lors de l'audit
    station_id INTEGER, -- Liaison logique vers public.infra_stations_abhs(id_station) sans FK stricte (pas de contrainte UNIQUE sur source)
    geom_hors_station GEOMETRY(Point, 4326),
    date_prelevement TIMESTAMPTZ NOT NULL,
    profondeur_m NUMERIC,
    milieu_type VARCHAR(100),
    observations_terrain TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CORRECTION 4 : Unicité assouplie (Une même station, même date, mais profondeur / type de milieu différent devient unique)
CREATE UNIQUE INDEX idx_prelevement_unique ON qualite.prelevement(
    station_id, 
    date_prelevement, 
    COALESCE(profondeur_m, -1),   -- Fallback à -1 si pas de profondeur précise
    COALESCE(milieu_type, 'UNK')  -- Fallback string pour éviter la collision sur des points multiples
) WHERE station_id IS NOT NULL;

-- 7. Table Unifiée Centrale Qualitative
CREATE TABLE IF NOT EXISTS qualite.mesure_qualite_unifiee (
    id BIGSERIAL PRIMARY KEY,
    prelevement_id INTEGER REFERENCES qualite.prelevement(id) NOT NULL,
    -- CORRECTION 2 : Paramètre nullable (NULL si non mappé) + conservation valeur string brute obligatoire
    parametre_id INTEGER REFERENCES qualite.ref_parametre(id),
    parametre_brut VARCHAR(255) NOT NULL,                 -- Garantie de ne "rien perdre"
    
    type_mesure_id INTEGER REFERENCES qualite.ref_type_mesure(id),
    valeur_numerique DOUBLE PRECISION,
    valeur_texte VARCHAR(255),
    unite_originale_id INTEGER REFERENCES qualite.ref_unite(id),
    
    -- Quality Assurance & Flags
    flag_qa_statut VARCHAR(50) DEFAULT 'NON_VERIFIE',     -- 'VALIDE', 'SUSPECT', 'ACHEVÉ'
    flag_hors_norme BOOLEAN DEFAULT FALSE,
    flag_param_non_mappe BOOLEAN GENERATED ALWAYS AS (parametre_id IS NULL) STORED, 
    
    -- CORRECTION 6 : Stratégie de Résolution Doublons et Préséance
    indice_confiance_source INTEGER DEFAULT 0,            -- Poids de préséance pour un conflit (ex: Labo certifié = 100, Sonde = 50)
    flag_is_doublon_candidat BOOLEAN DEFAULT FALSE,       -- Y a-t-il une autre mesure de ce param au même prélèvement ?
    flag_doublon_resolution VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE' (Celle choisie pour le dashboard) / 'RETIRED' (Doublon caché, mais gardé en DB)
    
    -- Lignage Tracking
    source_system VARCHAR(100) NOT NULL,
    source_row_id VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexation métier performance
CREATE INDEX idx_mesure_unifiee_param ON qualite.mesure_qualite_unifiee(parametre_id);
CREATE INDEX idx_mesure_unifiee_prelev ON qualite.mesure_qualite_unifiee(prelevement_id);

-- CORRECTION 3 : Suppression de l'index d'unicité stricte sur (prelevement_id, parametre_id)
-- L'index d'unicité est enlevé. Pour identifier virtuellement les doublons, un index non bloquant 
-- permettra au code Python de scorer les `indice_confiance_source` et assigner le tag `ACTIVE`/`RETIRED`
CREATE INDEX idx_mesure_candidat_doublon ON qualite.mesure_qualite_unifiee(prelevement_id, parametre_id);

-- 8. Audit Intégration Data Pipeline
CREATE TABLE IF NOT EXISTS qualite.audit_integration_qualite (
    id SERIAL PRIMARY KEY,
    source_system VARCHAR(100) NOT NULL,
    date_run TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    lignes_scannees INTEGER NOT NULL,
    lignes_inserees INTEGER NOT NULL,
    lignes_rejetees INTEGER NOT NULL,
    doublons_detectes INTEGER NOT NULL,
    parametres_orphelins INTEGER,                        
    log_erreur TEXT
);

COMMENT ON SCHEMA qualite IS 'Couche de consolidation analytique pour la qualité des eaux';
COMMENT ON TABLE qualite.mesure_qualite_unifiee IS 'Dépôt unique consolidé sans suppression: on gère par flag_doublon_resolution et param_non_mappe.';
