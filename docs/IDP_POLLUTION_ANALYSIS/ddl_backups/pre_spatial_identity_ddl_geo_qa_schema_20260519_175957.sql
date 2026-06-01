--
-- PostgreSQL database dump
--

\restrict Szghx0c4Cv2eN48ypjIdAGhS1JyDuYEoXBpOdQyY8kO6bdWxU7cbpumL2qy49HL

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: geo; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA geo;


ALTER SCHEMA geo OWNER TO postgres;

--
-- Name: qa; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA qa;


ALTER SCHEMA qa OWNER TO postgres;

--
-- Name: fn_ref_site_pollution_set_geom_4326(); Type: FUNCTION; Schema: geo; Owner: postgres
--

CREATE FUNCTION geo.fn_ref_site_pollution_set_geom_4326() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.geom IS NOT NULL THEN
        NEW.geom_4326 := ST_Transform(NEW.geom, 4326);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION geo.fn_ref_site_pollution_set_geom_4326() OWNER TO postgres;

--
-- Name: fn_set_updated_at(); Type: FUNCTION; Schema: geo; Owner: postgres
--

CREATE FUNCTION geo.fn_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION geo.fn_set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bassin_versant; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.bassin_versant (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    superficie_km2 numeric(10,2),
    geom public.geometry(MultiPolygon,4326) NOT NULL
);


ALTER TABLE geo.bassin_versant OWNER TO postgres;

--
-- Name: sous_bassin_abh; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.sous_bassin_abh (
    id integer NOT NULL,
    bassin_versant_id integer,
    nom character varying(100) NOT NULL,
    superficie_km2 numeric(10,2),
    geom public.geometry(MultiPolygon,4326) NOT NULL
);


ALTER TABLE geo.sous_bassin_abh OWNER TO postgres;

--
-- Name: source; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.source (
    id integer NOT NULL,
    code_commune text,
    code_nappe text,
    ire_source text,
    nom_source text,
    type_source text,
    coord_x double precision,
    coord_y double precision,
    coord_z double precision,
    geom public.geometry
);


ALTER TABLE geo.source OWNER TO postgres;

--
-- Name: nappe; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.nappe (
    id integer NOT NULL,
    nappes text,
    code_nappe text,
    nom_nappe text,
    superficie_km2 double precision,
    geom public.geometry
);


ALTER TABLE geo.nappe OWNER TO postgres;

--
-- Name: reseau_hydrographique; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.reseau_hydrographique (
    id integer NOT NULL,
    geom public.geometry(MultiLineString,26191),
    waterway character varying(254),
    name character varying(254),
    "Shape_Leng" numeric(18,11),
    "Z_Min" numeric(18,11),
    "Z_Max" numeric(18,11),
    "SLength" numeric(18,11),
    "Pente" numeric(18,11),
    "AvgWidth" numeric(18,11),
    "SegID" numeric(18,11),
    sous_bassi character varying(100),
    "Shape_Le_1" numeric(18,11),
    "ID" integer,
    "ORIG_SEQ" bigint,
    "IDD" numeric(18,11),
    "ORIG_FID" bigint,
    full_id character varying(254),
    osm_id character varying(254),
    osm_type character varying(254),
    "SegDéch" numeric(18,11),
    layer character varying(254),
    path character varying(254)
);


ALTER TABLE geo.reseau_hydrographique OWNER TO postgres;

--
-- Name: sous_bassin_swat_bas_sebou; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.sous_bassin_swat_bas_sebou (
    id integer NOT NULL,
    subbasin integer,
    area numeric,
    slo1 numeric,
    len1 numeric,
    sll numeric,
    csl numeric,
    wid1 numeric,
    dep1 numeric,
    lat numeric,
    long_ numeric,
    elev numeric,
    elevmin numeric,
    elevmax numeric,
    bname character varying(80),
    shape_len numeric,
    shape_area numeric,
    hydroid integer,
    outletid integer,
    geom public.geometry(MultiPolygon,26191),
    bassin_code text,
    bassin_nom text,
    source_file text,
    version_geom_date date
);


ALTER TABLE geo.sous_bassin_swat_bas_sebou OWNER TO postgres;

--
-- Name: sous_bassin_swat_bassin_cotier; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.sous_bassin_swat_bassin_cotier (
    id integer NOT NULL,
    subbasin integer,
    area numeric,
    slo1 numeric,
    len1 numeric,
    sll numeric,
    csl numeric,
    wid1 numeric,
    dep1 numeric,
    lat numeric,
    long_ numeric,
    elev numeric,
    elevmin numeric,
    elevmax numeric,
    bname character varying(80),
    shape_len numeric,
    shape_area numeric,
    hydroid integer,
    outletid integer,
    geom public.geometry(MultiPolygon,26191),
    bassin_code text,
    bassin_nom text,
    source_file text,
    version_geom_date date
);


ALTER TABLE geo.sous_bassin_swat_bassin_cotier OWNER TO postgres;

--
-- Name: sous_bassin_swat_beht; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.sous_bassin_swat_beht (
    id integer NOT NULL,
    polygonid double precision,
    area numeric,
    subbasin integer,
    geom public.geometry(MultiPolygon,26191),
    bassin_code text,
    bassin_nom text,
    source_file text,
    version_geom_date date
);


ALTER TABLE geo.sous_bassin_swat_beht OWNER TO postgres;

--
-- Name: sous_bassin_swat_haut_sebou; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.sous_bassin_swat_haut_sebou (
    id integer NOT NULL,
    polygonid double precision,
    area numeric,
    subbasin integer,
    geom public.geometry(MultiPolygon,26191),
    bassin_code text,
    bassin_nom text,
    source_file text,
    version_geom_date date
);


ALTER TABLE geo.sous_bassin_swat_haut_sebou OWNER TO postgres;

--
-- Name: sous_bassin_swat_leben_innaouen; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.sous_bassin_swat_leben_innaouen (
    id integer NOT NULL,
    geom public.geometry(MultiPolygon,26191),
    "Subbasin" integer,
    "Area" numeric,
    "Slo1" numeric(23,15),
    "Len1" numeric(23,15),
    "Sll" numeric(23,15),
    "Csl" numeric(23,15),
    "Wid1" numeric(23,15),
    "Dep1" numeric(23,15),
    "Lat" numeric(23,15),
    "Long_" numeric(23,15),
    "Elev" numeric(23,15),
    "ElevMin" numeric(23,15),
    "ElevMax" numeric(23,15),
    "Bname" character varying(80),
    "Shape_Len" numeric(23,15),
    "Shape_Area" numeric,
    "HydroID" integer,
    "OutletID" integer,
    bassin_code text NOT NULL,
    bassin_nom text NOT NULL,
    source_file text,
    version_geom_date date
);


ALTER TABLE geo.sous_bassin_swat_leben_innaouen OWNER TO postgres;

--
-- Name: sous_bassin_swat_moyen_sebou; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.sous_bassin_swat_moyen_sebou (
    id integer NOT NULL,
    polygonid double precision,
    area numeric,
    subbasin integer,
    geom public.geometry(MultiPolygon,26191),
    bassin_code text,
    bassin_nom text,
    source_file text,
    version_geom_date date
);


ALTER TABLE geo.sous_bassin_swat_moyen_sebou OWNER TO postgres;

--
-- Name: sous_bassin_swat_ouergha; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.sous_bassin_swat_ouergha (
    id integer NOT NULL,
    subbasin integer,
    area numeric,
    slo1 numeric,
    len1 numeric,
    sll numeric,
    csl numeric,
    wid1 numeric,
    dep1 numeric,
    lat numeric,
    long_ numeric,
    elev numeric,
    elevmin numeric,
    elevmax numeric,
    bname character varying(80),
    shape_len numeric,
    shape_area numeric,
    hydroid integer,
    outletid integer,
    geom public.geometry(MultiPolygon,26191),
    bassin_code text,
    bassin_nom text,
    source_file text,
    version_geom_date date
);


ALTER TABLE geo.sous_bassin_swat_ouergha OWNER TO postgres;

--
-- Name: ref_site_pollution; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.ref_site_pollution (
    site_id uuid DEFAULT gen_random_uuid() NOT NULL,
    site_code text,
    site_name text,
    source_type_id uuid,
    pollution_category_id uuid,
    commune text,
    province text,
    bassin text,
    source_origin text NOT NULL,
    validation_status text DEFAULT 'TO_VALIDATE'::text NOT NULL,
    geom public.geometry(Point,26191) NOT NULL,
    geom_4326 public.geometry(Point,4326),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_ref_site_pollution_geom_4326_srid CHECK (((geom_4326 IS NULL) OR (public.st_srid(geom_4326) = 4326))),
    CONSTRAINT chk_ref_site_pollution_geom_srid CHECK ((public.st_srid(geom) = 26191)),
    CONSTRAINT chk_ref_site_pollution_validation_status CHECK ((validation_status = ANY (ARRAY['VALIDATED'::text, 'TO_VALIDATE'::text, 'REJECTED'::text, 'DUPLICATE_CANDIDATE'::text, 'CONFLICT_TO_RESOLVE'::text, 'GEOMETRY_MISSING'::text])))
);


ALTER TABLE geo.ref_site_pollution OWNER TO postgres;

--
-- Name: TABLE ref_site_pollution; Type: COMMENT; Schema: geo; Owner: postgres
--

COMMENT ON TABLE geo.ref_site_pollution IS 'Canonical spatial pollution site reference used by IDP, existing infra pollution layers, API and MapLibre.';


--
-- Name: COLUMN ref_site_pollution.source_origin; Type: COMMENT; Schema: geo; Owner: postgres
--

COMMENT ON COLUMN geo.ref_site_pollution.source_origin IS 'Origin of the canonical site: infra.step, infra.rejet_domestique, staging.raw_idp_*, LPEE, manual_arbitrage, etc.';


--
-- Name: _bak_sous_bassin_swat_leben_innaouen_20260403; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo._bak_sous_bassin_swat_leben_innaouen_20260403 (
    id integer,
    geom public.geometry(MultiPolygon,26191),
    "Subbasin" integer,
    "Area" numeric,
    "Slo1" numeric(23,15),
    "Len1" numeric(23,15),
    "Sll" numeric(23,15),
    "Csl" numeric(23,15),
    "Wid1" numeric(23,15),
    "Dep1" numeric(23,15),
    "Lat" numeric(23,15),
    "Long_" numeric(23,15),
    "Elev" numeric(23,15),
    "ElevMin" numeric(23,15),
    "ElevMax" numeric(23,15),
    "Bname" character varying(80),
    "Shape_Len" numeric(23,15),
    "Shape_Area" numeric,
    "HydroID" integer,
    "OutletID" integer,
    bassin_code text,
    bassin_nom text
);


ALTER TABLE geo._bak_sous_bassin_swat_leben_innaouen_20260403 OWNER TO postgres;

--
-- Name: bassin_versant_id_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.bassin_versant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE geo.bassin_versant_id_seq OWNER TO postgres;

--
-- Name: bassin_versant_id_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.bassin_versant_id_seq OWNED BY geo.bassin_versant.id;


--
-- Name: nappes_abhs_n_id_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.nappes_abhs_n_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE geo.nappes_abhs_n_id_seq OWNER TO postgres;

--
-- Name: nappes_abhs_n_id_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.nappes_abhs_n_id_seq OWNED BY geo.nappe.id;


--
-- Name: reseau_hydrographique_id_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.reseau_hydrographique_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE geo.reseau_hydrographique_id_seq OWNER TO postgres;

--
-- Name: reseau_hydrographique_id_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.reseau_hydrographique_id_seq OWNED BY geo.reseau_hydrographique.id;


--
-- Name: sources_abhs_id_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.sources_abhs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE geo.sources_abhs_id_seq OWNER TO postgres;

--
-- Name: sources_abhs_id_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.sources_abhs_id_seq OWNED BY geo.source.id;


--
-- Name: sous_bassin_id_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.sous_bassin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE geo.sous_bassin_id_seq OWNER TO postgres;

--
-- Name: sous_bassin_id_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.sous_bassin_id_seq OWNED BY geo.sous_bassin_abh.id;


--
-- Name: sous_bassin_swat_id_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.sous_bassin_swat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE geo.sous_bassin_swat_id_seq OWNER TO postgres;

--
-- Name: sous_bassin_swat_id_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.sous_bassin_swat_id_seq OWNED BY geo.sous_bassin_swat_leben_innaouen.id;


--
-- Name: v_existing_pollution_spatial_sources; Type: VIEW; Schema: geo; Owner: postgres
--

CREATE VIEW geo.v_existing_pollution_spatial_sources AS
 SELECT 'infra.step'::text AS source_layer,
    (step.id)::text AS source_feature_id,
    step.code_step AS site_code,
    COALESCE(step.code_step, step.code_commune) AS site_name,
    'STEP'::text AS source_type_code,
    step.code_commune AS commune,
    NULL::text AS province,
    (step.geom)::public.geometry(Point,26191) AS geom
   FROM infra.step
  WHERE (step.geom IS NOT NULL)
UNION ALL
 SELECT 'infra.step_industrielle'::text AS source_layer,
    (step_industrielle.id)::text AS source_feature_id,
    step_industrielle.code_step AS site_code,
    COALESCE(step_industrielle.nom_step, step_industrielle.code_step, step_industrielle.commune_nom) AS site_name,
    'STEP_INDUSTRIELLE'::text AS source_type_code,
    step_industrielle.commune_nom AS commune,
    NULL::text AS province,
    (step_industrielle.geom)::public.geometry(Point,26191) AS geom
   FROM infra.step_industrielle
  WHERE (step_industrielle.geom IS NOT NULL)
UNION ALL
 SELECT 'infra.stm'::text AS source_layer,
    (stm.id)::text AS source_feature_id,
    stm.code_stm AS site_code,
    COALESCE(stm.nom_stm, stm.code_stm, stm.commune_nom) AS site_name,
    'STM'::text AS source_type_code,
    stm.commune_nom AS commune,
    NULL::text AS province,
    (stm.geom)::public.geometry(Point,26191) AS geom
   FROM infra.stm
  WHERE (stm.geom IS NOT NULL)
UNION ALL
 SELECT 'infra.huilerie_inventaire_pollution'::text AS source_layer,
    (huilerie_inventaire_pollution.id)::text AS source_feature_id,
    huilerie_inventaire_pollution.code_huilerie_source AS site_code,
    COALESCE(huilerie_inventaire_pollution.nom_huilerie_source, huilerie_inventaire_pollution.code_huilerie_source, huilerie_inventaire_pollution.commune_nom) AS site_name,
    'HUILERIE'::text AS source_type_code,
    huilerie_inventaire_pollution.commune_nom AS commune,
    huilerie_inventaire_pollution.province_nom AS province,
    huilerie_inventaire_pollution.geom
   FROM infra.huilerie_inventaire_pollution
  WHERE (huilerie_inventaire_pollution.geom IS NOT NULL)
UNION ALL
 SELECT 'infra.mine_inventaire_pollution'::text AS source_layer,
    (mine_inventaire_pollution.id)::text AS source_feature_id,
    COALESCE(mine_inventaire_pollution.num_licence_raw, (mine_inventaire_pollution.source_row_id)::text) AS site_code,
    COALESCE(mine_inventaire_pollution.nom_mine_source, mine_inventaire_pollution.num_licence_raw, mine_inventaire_pollution.commune_nom) AS site_name,
    'MINE'::text AS source_type_code,
    mine_inventaire_pollution.commune_nom AS commune,
    mine_inventaire_pollution.province_nom AS province,
    mine_inventaire_pollution.geom
   FROM infra.mine_inventaire_pollution
  WHERE (mine_inventaire_pollution.geom IS NOT NULL)
UNION ALL
 SELECT 'infra.decharge_inventaire_pollution'::text AS source_layer,
    (decharge_inventaire_pollution.id)::text AS source_feature_id,
    (decharge_inventaire_pollution.source_row_id)::text AS site_code,
    COALESCE(decharge_inventaire_pollution.nom_site, (decharge_inventaire_pollution.source_row_id)::text, decharge_inventaire_pollution.commune_nom) AS site_name,
    'DECHARGE'::text AS source_type_code,
    decharge_inventaire_pollution.commune_nom AS commune,
    decharge_inventaire_pollution.province_nom AS province,
    decharge_inventaire_pollution.geom
   FROM infra.decharge_inventaire_pollution
  WHERE (decharge_inventaire_pollution.geom IS NOT NULL)
UNION ALL
 SELECT 'infra.decharge_inventaire_pollution_general'::text AS source_layer,
    (decharge_inventaire_pollution_general.id)::text AS source_feature_id,
    COALESCE(decharge_inventaire_pollution_general.code_decharge_source, (decharge_inventaire_pollution_general.source_row_id)::text) AS site_code,
    COALESCE(decharge_inventaire_pollution_general.nom_site, decharge_inventaire_pollution_general.code_decharge_source, decharge_inventaire_pollution_general.commune_nom) AS site_name,
    'DECHARGE_ABANDONNEE'::text AS source_type_code,
    decharge_inventaire_pollution_general.commune_nom AS commune,
    decharge_inventaire_pollution_general.province_nom AS province,
    decharge_inventaire_pollution_general.geom
   FROM infra.decharge_inventaire_pollution_general
  WHERE (decharge_inventaire_pollution_general.geom IS NOT NULL)
UNION ALL
 SELECT 'infra.rejet_inventaire_pollution'::text AS source_layer,
    (rejet_inventaire_pollution.id)::text AS source_feature_id,
    rejet_inventaire_pollution.code_rejet AS site_code,
    COALESCE(rejet_inventaire_pollution.code_rejet, rejet_inventaire_pollution.ville_nom, rejet_inventaire_pollution.commune_nom) AS site_name,
    'REJET_DOMESTIQUE'::text AS source_type_code,
    rejet_inventaire_pollution.commune_nom AS commune,
    rejet_inventaire_pollution.province_nom AS province,
    rejet_inventaire_pollution.geom
   FROM infra.rejet_inventaire_pollution
  WHERE (rejet_inventaire_pollution.geom IS NOT NULL)
UNION ALL
 SELECT 'infra.rejet_abattoir_inventaire_pollution'::text AS source_layer,
    (rejet_abattoir_inventaire_pollution.id)::text AS source_feature_id,
    (rejet_abattoir_inventaire_pollution.source_row_id)::text AS site_code,
    COALESCE(rejet_abattoir_inventaire_pollution.commune_nom, (rejet_abattoir_inventaire_pollution.source_row_id)::text) AS site_name,
    'REJET_ABATTOIR'::text AS source_type_code,
    rejet_abattoir_inventaire_pollution.commune_nom AS commune,
    rejet_abattoir_inventaire_pollution.province_nom AS province,
    rejet_abattoir_inventaire_pollution.geom
   FROM infra.rejet_abattoir_inventaire_pollution
  WHERE (rejet_abattoir_inventaire_pollution.geom IS NOT NULL)
UNION ALL
 SELECT 'infra.fosses_septiques_abhs'::text AS source_layer,
    (fosses_septiques_abhs.id)::text AS source_feature_id,
    (fosses_septiques_abhs.code_commu)::text AS site_code,
    (COALESCE(fosses_septiques_abhs.centre_fr, fosses_septiques_abhs.commune_fr, fosses_septiques_abhs.code_commu))::text AS site_name,
    'FOSSE_SEPTIQUE'::text AS source_type_code,
    (fosses_septiques_abhs.commune_fr)::text AS commune,
    (fosses_septiques_abhs.province_f)::text AS province,
    fosses_septiques_abhs.geom
   FROM infra.fosses_septiques_abhs
  WHERE (fosses_septiques_abhs.geom IS NOT NULL)
UNION ALL
 SELECT 'qualite.source_pollution_prelevement'::text AS source_layer,
    (source_pollution_prelevement.id)::text AS source_feature_id,
    (source_pollution_prelevement.source_row_id)::text AS site_code,
    COALESCE(source_pollution_prelevement.point_prelevement, source_pollution_prelevement.nature, source_pollution_prelevement.commune) AS site_name,
    'SOURCE_POLLUTION_PRELEVEMENT'::text AS source_type_code,
    source_pollution_prelevement.commune,
    source_pollution_prelevement.province,
    source_pollution_prelevement.geom
   FROM qualite.source_pollution_prelevement
  WHERE (source_pollution_prelevement.geom IS NOT NULL);


ALTER VIEW geo.v_existing_pollution_spatial_sources OWNER TO postgres;

--
-- Name: v_idp_spatial_sources; Type: VIEW; Schema: geo; Owner: postgres
--

CREATE VIEW geo.v_idp_spatial_sources AS
 SELECT 'staging.raw_idp_src_pollution_globale'::text AS source_layer,
    raw_idp_src_pollution_globale.source_feature_id,
    COALESCE(raw_idp_src_pollution_globale.id_table, raw_idp_src_pollution_globale.id_pts, raw_idp_src_pollution_globale.source_feature_id) AS site_code,
    COALESCE(raw_idp_src_pollution_globale.pts_prelev, raw_idp_src_pollution_globale.id_table, raw_idp_src_pollution_globale.source_feature_id) AS site_name,
    COALESCE(NULLIF(raw_idp_src_pollution_globale.nature, ''::text), NULLIF(raw_idp_src_pollution_globale.parametre, ''::text), 'IDP_SOURCE'::text) AS source_type_code,
    raw_idp_src_pollution_globale.commune,
    NULL::text AS province,
    raw_idp_src_pollution_globale.geom_original AS geom,
    raw_idp_src_pollution_globale.import_batch_id
   FROM staging.raw_idp_src_pollution_globale
UNION ALL
 SELECT 'staging.raw_idp_src_pollution_marche_cadre'::text AS source_layer,
    raw_idp_src_pollution_marche_cadre.source_feature_id,
    COALESCE(raw_idp_src_pollution_marche_cadre.id_table, raw_idp_src_pollution_marche_cadre.id_pts, raw_idp_src_pollution_marche_cadre.source_feature_id) AS site_code,
    COALESCE(raw_idp_src_pollution_marche_cadre.pts_prelev, raw_idp_src_pollution_marche_cadre.id_table, raw_idp_src_pollution_marche_cadre.source_feature_id) AS site_name,
    COALESCE(NULLIF(raw_idp_src_pollution_marche_cadre.parametre, ''::text), 'IDP_SOURCE'::text) AS source_type_code,
    raw_idp_src_pollution_marche_cadre.commune,
    NULL::text AS province,
    raw_idp_src_pollution_marche_cadre.geom_original AS geom,
    raw_idp_src_pollution_marche_cadre.import_batch_id
   FROM staging.raw_idp_src_pollution_marche_cadre
UNION ALL
 SELECT 'staging.raw_idp_mesures_qualite_marche_cadre_2024'::text AS source_layer,
    raw_idp_mesures_qualite_marche_cadre_2024.source_feature_id,
    COALESCE(raw_idp_mesures_qualite_marche_cadre_2024.id_table, raw_idp_mesures_qualite_marche_cadre_2024.id_pts, raw_idp_mesures_qualite_marche_cadre_2024.source_feature_id) AS site_code,
    COALESCE(raw_idp_mesures_qualite_marche_cadre_2024.pts_prelev, raw_idp_mesures_qualite_marche_cadre_2024.id_table, raw_idp_mesures_qualite_marche_cadre_2024.source_feature_id) AS site_name,
    'IDP_MEASURE_POINT'::text AS source_type_code,
    raw_idp_mesures_qualite_marche_cadre_2024.commune,
    NULL::text AS province,
    raw_idp_mesures_qualite_marche_cadre_2024.geom_original AS geom,
    raw_idp_mesures_qualite_marche_cadre_2024.import_batch_id
   FROM staging.raw_idp_mesures_qualite_marche_cadre_2024
UNION ALL
 SELECT 'staging.raw_idp_mesures_qualite_globale_2024'::text AS source_layer,
    raw_idp_mesures_qualite_globale_2024.source_feature_id,
    COALESCE(raw_idp_mesures_qualite_globale_2024.id_table, raw_idp_mesures_qualite_globale_2024.id_pts, raw_idp_mesures_qualite_globale_2024.source_feature_id) AS site_code,
    COALESCE(raw_idp_mesures_qualite_globale_2024.pts_prelev, raw_idp_mesures_qualite_globale_2024.id_table, raw_idp_mesures_qualite_globale_2024.source_feature_id) AS site_name,
    'IDP_MEASURE_POINT'::text AS source_type_code,
    raw_idp_mesures_qualite_globale_2024.commune,
    NULL::text AS province,
    raw_idp_mesures_qualite_globale_2024.geom_original AS geom,
    raw_idp_mesures_qualite_globale_2024.import_batch_id
   FROM staging.raw_idp_mesures_qualite_globale_2024;


ALTER VIEW geo.v_idp_spatial_sources OWNER TO postgres;

--
-- Name: v_pollution_duplicate_exact; Type: VIEW; Schema: qa; Owner: postgres
--

CREATE VIEW qa.v_pollution_duplicate_exact AS
 SELECT a.site_id AS site_id_a,
    b.site_id AS site_id_b,
    a.site_code AS site_code_a,
    b.site_code AS site_code_b,
    a.site_name AS site_name_a,
    b.site_name AS site_name_b,
    a.commune AS commune_a,
    b.commune AS commune_b,
    (0)::double precision AS distance_m,
    'DUPLICATE_EXACT'::text AS qa_issue
   FROM (geo.ref_site_pollution a
     JOIN geo.ref_site_pollution b ON (((a.site_id < b.site_id) AND (a.geom IS NOT NULL) AND (b.geom IS NOT NULL) AND public.st_equals(a.geom, b.geom))));


ALTER VIEW qa.v_pollution_duplicate_exact OWNER TO postgres;

--
-- Name: v_pollution_duplicate_near; Type: VIEW; Schema: qa; Owner: postgres
--

CREATE VIEW qa.v_pollution_duplicate_near AS
 SELECT a.site_id AS site_id_a,
    b.site_id AS site_id_b,
    a.site_code AS site_code_a,
    b.site_code AS site_code_b,
    a.site_name AS site_name_a,
    b.site_name AS site_name_b,
    a.commune AS commune_a,
    b.commune AS commune_b,
    public.st_distance(a.geom, b.geom) AS distance_m,
        CASE
            WHEN (public.st_distance(a.geom, b.geom) <= (5)::double precision) THEN 'DUPLICATE_NEAR_5M'::text
            WHEN (public.st_distance(a.geom, b.geom) <= (10)::double precision) THEN 'DUPLICATE_NEAR_10M'::text
            ELSE 'DUPLICATE_NEAR_25M'::text
        END AS qa_issue
   FROM (geo.ref_site_pollution a
     JOIN geo.ref_site_pollution b ON (((a.site_id < b.site_id) AND (a.geom IS NOT NULL) AND (b.geom IS NOT NULL) AND public.st_dwithin(a.geom, b.geom, (25)::double precision) AND (NOT public.st_equals(a.geom, b.geom)))));


ALTER VIEW qa.v_pollution_duplicate_near OWNER TO postgres;

--
-- Name: v_pollution_geometry_missing; Type: VIEW; Schema: qa; Owner: postgres
--

CREATE VIEW qa.v_pollution_geometry_missing AS
 SELECT source_origin AS source_layer,
    (site_id)::text AS source_feature_id,
    site_code,
    site_name,
    commune,
    'GEOMETRY_MISSING'::text AS "?column?"
   FROM geo.ref_site_pollution
  WHERE (geom IS NULL);


ALTER VIEW qa.v_pollution_geometry_missing OWNER TO postgres;

--
-- Name: v_pollution_measurements_without_geometry; Type: VIEW; Schema: qa; Owner: postgres
--

CREATE VIEW qa.v_pollution_measurements_without_geometry AS
 SELECT resultat_id,
    source_layer,
    source_feature_id,
    point_name,
    commune,
    raw_parameter_code,
    raw_value,
    'MEASUREMENT_WITHOUT_GEOMETRY'::text AS qa_issue
   FROM qualite.resultat_mesure
  WHERE (geom IS NULL);


ALTER VIEW qa.v_pollution_measurements_without_geometry OWNER TO postgres;

--
-- Name: v_pollution_multi_source_conflicts; Type: VIEW; Schema: qa; Owner: postgres
--

CREATE VIEW qa.v_pollution_multi_source_conflicts AS
 SELECT site_code,
    lower(btrim(COALESCE(site_name, ''::text))) AS normalized_site_name,
    lower(btrim(COALESCE(commune, ''::text))) AS normalized_commune,
    count(*) AS site_count,
    array_agg(site_id ORDER BY site_id) AS site_ids,
    array_agg(DISTINCT source_origin ORDER BY source_origin) AS source_origins,
    'MULTI_SOURCE_CONFLICT'::text AS qa_issue
   FROM geo.ref_site_pollution
  GROUP BY site_code, (lower(btrim(COALESCE(site_name, ''::text)))), (lower(btrim(COALESCE(commune, ''::text))))
 HAVING (count(*) > 1);


ALTER VIEW qa.v_pollution_multi_source_conflicts OWNER TO postgres;

--
-- Name: v_pollution_param_unmapped; Type: VIEW; Schema: qa; Owner: postgres
--

CREATE VIEW qa.v_pollution_param_unmapped AS
 SELECT resultat_id,
    source_layer,
    source_feature_id,
    raw_parameter_code,
    raw_value,
    quality_flag,
    'PARAM_UNMAPPED'::text AS qa_issue
   FROM qualite.resultat_mesure
  WHERE ((parameter_id IS NULL) OR (quality_flag = 'PARAM_UNMAPPED'::text));


ALTER VIEW qa.v_pollution_param_unmapped OWNER TO postgres;

--
-- Name: v_pollution_points_without_site; Type: VIEW; Schema: qa; Owner: postgres
--

CREATE VIEW qa.v_pollution_points_without_site AS
 SELECT resultat_id,
    source_layer,
    source_feature_id,
    point_name,
    commune,
    raw_parameter_code,
    raw_value,
    'POINT_WITHOUT_SITE'::text AS qa_issue
   FROM qualite.resultat_mesure
  WHERE (site_id IS NULL);


ALTER VIEW qa.v_pollution_points_without_site OWNER TO postgres;

--
-- Name: v_pollution_unit_unmapped; Type: VIEW; Schema: qa; Owner: postgres
--

CREATE VIEW qa.v_pollution_unit_unmapped AS
 SELECT resultat_id,
    source_layer,
    source_feature_id,
    raw_parameter_code,
    raw_value,
    quality_flag,
    'UNIT_UNMAPPED'::text AS qa_issue
   FROM qualite.resultat_mesure
  WHERE ((quality_flag = 'UNIT_UNMAPPED'::text) OR ((parameter_id IS NOT NULL) AND (unit_canonical IS NULL)));


ALTER VIEW qa.v_pollution_unit_unmapped OWNER TO postgres;

--
-- Name: v_pollution_qa_summary; Type: VIEW; Schema: qa; Owner: postgres
--

CREATE VIEW qa.v_pollution_qa_summary AS
 SELECT 'geometry_missing'::text AS qa_view,
    count(*) AS issue_count
   FROM qa.v_pollution_geometry_missing
UNION ALL
 SELECT 'duplicate_exact'::text AS qa_view,
    count(*) AS issue_count
   FROM qa.v_pollution_duplicate_exact
UNION ALL
 SELECT 'duplicate_near'::text AS qa_view,
    count(*) AS issue_count
   FROM qa.v_pollution_duplicate_near
UNION ALL
 SELECT 'param_unmapped'::text AS qa_view,
    count(*) AS issue_count
   FROM qa.v_pollution_param_unmapped
UNION ALL
 SELECT 'unit_unmapped'::text AS qa_view,
    count(*) AS issue_count
   FROM qa.v_pollution_unit_unmapped
UNION ALL
 SELECT 'points_without_site'::text AS qa_view,
    count(*) AS issue_count
   FROM qa.v_pollution_points_without_site
UNION ALL
 SELECT 'measurements_without_geometry'::text AS qa_view,
    count(*) AS issue_count
   FROM qa.v_pollution_measurements_without_geometry
UNION ALL
 SELECT 'multi_source_conflicts'::text AS qa_view,
    count(*) AS issue_count
   FROM qa.v_pollution_multi_source_conflicts;


ALTER VIEW qa.v_pollution_qa_summary OWNER TO postgres;

--
-- Name: v_spatial_site_candidates; Type: VIEW; Schema: qa; Owner: postgres
--

CREATE VIEW qa.v_spatial_site_candidates AS
 WITH nearest_existing AS (
         SELECT DISTINCT ON (i.source_layer, i.source_feature_id) i.source_layer,
            i.source_feature_id,
            i.site_code,
            i.site_name,
            i.source_type_code,
            i.commune,
            i.geom,
            e.source_layer AS existing_source_layer,
            e.source_feature_id AS existing_source_feature_id,
            e.site_code AS existing_site_code,
            e.site_name AS existing_site_name,
            e.source_type_code AS existing_source_type_code,
            e.commune AS existing_commune,
            public.st_distance(i.geom, e.geom) AS distance_m
           FROM (geo.v_idp_spatial_sources i
             JOIN geo.v_existing_pollution_spatial_sources e ON (((i.geom IS NOT NULL) AND (e.geom IS NOT NULL) AND public.st_dwithin(i.geom, e.geom, (25)::double precision))))
          ORDER BY i.source_layer, i.source_feature_id, (public.st_distance(i.geom, e.geom))
        ), idp_with_match AS (
         SELECT i.source_layer,
            i.source_feature_id,
            i.site_code,
            i.site_name,
            i.source_type_code,
            i.commune,
            i.province,
            i.geom,
            i.import_batch_id,
            n.existing_source_layer,
            n.existing_source_feature_id,
            n.existing_site_code,
            n.existing_site_name,
            n.existing_source_type_code,
            n.existing_commune,
            n.distance_m
           FROM (geo.v_idp_spatial_sources i
             LEFT JOIN nearest_existing n ON (((n.source_layer = i.source_layer) AND (n.source_feature_id = i.source_feature_id))))
        )
 SELECT (((((((((substr(md5(((source_layer || ':'::text) || source_feature_id)), 1, 8) || '-'::text) || substr(md5(((source_layer || ':'::text) || source_feature_id)), 9, 4)) || '-'::text) || substr(md5(((source_layer || ':'::text) || source_feature_id)), 13, 4)) || '-'::text) || substr(md5(((source_layer || ':'::text) || source_feature_id)), 17, 4)) || '-'::text) || substr(md5(((source_layer || ':'::text) || source_feature_id)), 21, 12)))::uuid AS candidate_site_id,
    source_layer,
    source_feature_id,
        CASE
            WHEN (geom IS NULL) THEN 'GEOMETRY_MISSING'::text
            WHEN (existing_source_layer IS NULL) THEN 'NEW_SITE'::text
            WHEN (distance_m = (0)::double precision) THEN 'REUSE_EXISTING_SITE_EXACT'::text
            WHEN (distance_m <= (10)::double precision) THEN 'REUSE_EXISTING_SITE_NEAR'::text
            ELSE 'POSSIBLE_EXISTING_SITE'::text
        END AS candidate_type,
    distance_m,
    (
        CASE
            WHEN (geom IS NULL) THEN 0.0
            WHEN (existing_source_layer IS NULL) THEN 0.6
            WHEN (distance_m = (0)::double precision) THEN 1.0
            WHEN (distance_m <= (5)::double precision) THEN 0.95
            WHEN (distance_m <= (10)::double precision) THEN 0.90
            WHEN (distance_m <= (25)::double precision) THEN 0.75
            ELSE 0.0
        END)::numeric(5,2) AS match_score,
        CASE
            WHEN (existing_source_layer IS NULL) THEN NULL::text
            ELSE ((existing_source_layer || ':'::text) || existing_source_feature_id)
        END AS existing_site_match,
    ((geom IS NULL) OR (existing_source_layer IS NULL) OR (distance_m > (10)::double precision) OR ((commune IS NOT NULL) AND (existing_commune IS NOT NULL) AND (lower(btrim(commune)) <> lower(btrim(existing_commune))))) AS requires_review,
        CASE
            WHEN (geom IS NULL) THEN 'MISSING'::text
            WHEN (NOT public.st_isvalid(geom)) THEN 'INVALID'::text
            ELSE 'OK'::text
        END AS geometry_status
   FROM idp_with_match;


ALTER VIEW qa.v_spatial_site_candidates OWNER TO postgres;

--
-- Name: variable_thresholds; Type: TABLE; Schema: qa; Owner: postgres
--

CREATE TABLE qa.variable_thresholds (
    id bigint NOT NULL,
    model character varying(16) NOT NULL,
    variable_name character varying(255) NOT NULL,
    scenario_id integer,
    min_value double precision,
    max_value double precision,
    warn_z_info double precision DEFAULT 2.0 NOT NULL,
    warn_z_avertissement double precision DEFAULT 3.0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE qa.variable_thresholds OWNER TO postgres;

--
-- Name: variable_thresholds_id_seq; Type: SEQUENCE; Schema: qa; Owner: postgres
--

CREATE SEQUENCE qa.variable_thresholds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE qa.variable_thresholds_id_seq OWNER TO postgres;

--
-- Name: variable_thresholds_id_seq; Type: SEQUENCE OWNED BY; Schema: qa; Owner: postgres
--

ALTER SEQUENCE qa.variable_thresholds_id_seq OWNED BY qa.variable_thresholds.id;


--
-- Name: bassin_versant id; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.bassin_versant ALTER COLUMN id SET DEFAULT nextval('geo.bassin_versant_id_seq'::regclass);


--
-- Name: nappe id; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.nappe ALTER COLUMN id SET DEFAULT nextval('geo.nappes_abhs_n_id_seq'::regclass);


--
-- Name: reseau_hydrographique id; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.reseau_hydrographique ALTER COLUMN id SET DEFAULT nextval('geo.reseau_hydrographique_id_seq'::regclass);


--
-- Name: source id; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.source ALTER COLUMN id SET DEFAULT nextval('geo.sources_abhs_id_seq'::regclass);


--
-- Name: sous_bassin_abh id; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.sous_bassin_abh ALTER COLUMN id SET DEFAULT nextval('geo.sous_bassin_id_seq'::regclass);


--
-- Name: sous_bassin_swat_leben_innaouen id; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.sous_bassin_swat_leben_innaouen ALTER COLUMN id SET DEFAULT nextval('geo.sous_bassin_swat_id_seq'::regclass);


--
-- Name: variable_thresholds id; Type: DEFAULT; Schema: qa; Owner: postgres
--

ALTER TABLE ONLY qa.variable_thresholds ALTER COLUMN id SET DEFAULT nextval('qa.variable_thresholds_id_seq'::regclass);


--
-- Name: bassin_versant bassin_versant_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.bassin_versant
    ADD CONSTRAINT bassin_versant_pkey PRIMARY KEY (id);


--
-- Name: nappe nappes_abhs_n_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.nappe
    ADD CONSTRAINT nappes_abhs_n_pkey PRIMARY KEY (id);


--
-- Name: ref_site_pollution ref_site_pollution_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.ref_site_pollution
    ADD CONSTRAINT ref_site_pollution_pkey PRIMARY KEY (site_id);


--
-- Name: reseau_hydrographique reseau_hydrographique_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.reseau_hydrographique
    ADD CONSTRAINT reseau_hydrographique_pkey PRIMARY KEY (id);


--
-- Name: sous_bassin_abh sous_bassin_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.sous_bassin_abh
    ADD CONSTRAINT sous_bassin_pkey PRIMARY KEY (id);


--
-- Name: sous_bassin_swat_bas_sebou sous_bassin_swat_bas_sebou_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.sous_bassin_swat_bas_sebou
    ADD CONSTRAINT sous_bassin_swat_bas_sebou_pkey PRIMARY KEY (id);


--
-- Name: sous_bassin_swat_bassin_cotier sous_bassin_swat_bassin_cotier_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.sous_bassin_swat_bassin_cotier
    ADD CONSTRAINT sous_bassin_swat_bassin_cotier_pkey PRIMARY KEY (id);


--
-- Name: sous_bassin_swat_beht sous_bassin_swat_beht_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.sous_bassin_swat_beht
    ADD CONSTRAINT sous_bassin_swat_beht_pkey PRIMARY KEY (id);


--
-- Name: sous_bassin_swat_haut_sebou sous_bassin_swat_haut_sebou_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.sous_bassin_swat_haut_sebou
    ADD CONSTRAINT sous_bassin_swat_haut_sebou_pkey PRIMARY KEY (id);


--
-- Name: sous_bassin_swat_moyen_sebou sous_bassin_swat_moyen_sebou_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.sous_bassin_swat_moyen_sebou
    ADD CONSTRAINT sous_bassin_swat_moyen_sebou_pkey PRIMARY KEY (id);


--
-- Name: sous_bassin_swat_ouergha sous_bassin_swat_ouergha_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.sous_bassin_swat_ouergha
    ADD CONSTRAINT sous_bassin_swat_ouergha_pkey PRIMARY KEY (id);


--
-- Name: sous_bassin_swat_leben_innaouen sous_bassin_swat_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.sous_bassin_swat_leben_innaouen
    ADD CONSTRAINT sous_bassin_swat_pkey PRIMARY KEY (id);


--
-- Name: variable_thresholds variable_thresholds_pkey; Type: CONSTRAINT; Schema: qa; Owner: postgres
--

ALTER TABLE ONLY qa.variable_thresholds
    ADD CONSTRAINT variable_thresholds_pkey PRIMARY KEY (id);


--
-- Name: idx_geo_bv_geom; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_geo_bv_geom ON geo.bassin_versant USING gist (geom);


--
-- Name: idx_geo_nappe_geom_gist_708faed4; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_geo_nappe_geom_gist_708faed4 ON geo.nappe USING gist (geom);


--
-- Name: idx_geo_reseau_hydrographique_geom_gist_5d867224; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_geo_reseau_hydrographique_geom_gist_5d867224 ON geo.reseau_hydrographique USING gist (geom);


--
-- Name: idx_geo_sb_geom; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_geo_sb_geom ON geo.sous_bassin_abh USING gist (geom);


--
-- Name: idx_geo_source_geom_gist_a12b6569; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_geo_source_geom_gist_a12b6569 ON geo.source USING gist (geom);


--
-- Name: idx_geo_sous_bassin_swat_bassin_sub; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_geo_sous_bassin_swat_bassin_sub ON geo.sous_bassin_swat_leben_innaouen USING btree (bassin_code, "Subbasin");


--
-- Name: idx_ref_site_pollution_category; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_ref_site_pollution_category ON geo.ref_site_pollution USING btree (pollution_category_id);


--
-- Name: idx_ref_site_pollution_commune; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_ref_site_pollution_commune ON geo.ref_site_pollution USING btree (commune);


--
-- Name: idx_ref_site_pollution_geom; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_ref_site_pollution_geom ON geo.ref_site_pollution USING gist (geom);


--
-- Name: idx_ref_site_pollution_geom_4326; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_ref_site_pollution_geom_4326 ON geo.ref_site_pollution USING gist (geom_4326);


--
-- Name: idx_ref_site_pollution_status; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_ref_site_pollution_status ON geo.ref_site_pollution USING btree (validation_status);


--
-- Name: idx_ref_site_pollution_type; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_ref_site_pollution_type ON geo.ref_site_pollution USING btree (source_type_id);


--
-- Name: idx_sous_bassin_swat_bas_sebou_geom_gist; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_sous_bassin_swat_bas_sebou_geom_gist ON geo.sous_bassin_swat_bas_sebou USING gist (geom);


--
-- Name: idx_sous_bassin_swat_bassin_cotier_geom_gist; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_sous_bassin_swat_bassin_cotier_geom_gist ON geo.sous_bassin_swat_bassin_cotier USING gist (geom);


--
-- Name: idx_sous_bassin_swat_beht_geom_gist; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_sous_bassin_swat_beht_geom_gist ON geo.sous_bassin_swat_beht USING gist (geom);


--
-- Name: idx_sous_bassin_swat_haut_sebou_geom_gist; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_sous_bassin_swat_haut_sebou_geom_gist ON geo.sous_bassin_swat_haut_sebou USING gist (geom);


--
-- Name: idx_sous_bassin_swat_leben_innaouen_geom_gist; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_sous_bassin_swat_leben_innaouen_geom_gist ON geo.sous_bassin_swat_leben_innaouen USING gist (geom);


--
-- Name: idx_sous_bassin_swat_moyen_sebou_geom_gist; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_sous_bassin_swat_moyen_sebou_geom_gist ON geo.sous_bassin_swat_moyen_sebou USING gist (geom);


--
-- Name: idx_sous_bassin_swat_ouergha_geom_gist; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX idx_sous_bassin_swat_ouergha_geom_gist ON geo.sous_bassin_swat_ouergha USING gist (geom);


--
-- Name: ux_ref_site_pollution_origin_code; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE UNIQUE INDEX ux_ref_site_pollution_origin_code ON geo.ref_site_pollution USING btree (source_origin, site_code) WHERE (site_code IS NOT NULL);


--
-- Name: uq_variable_thresholds_model_var_scenario; Type: INDEX; Schema: qa; Owner: postgres
--

CREATE UNIQUE INDEX uq_variable_thresholds_model_var_scenario ON qa.variable_thresholds USING btree (model, variable_name, COALESCE(scenario_id, '-1'::integer));


--
-- Name: bassin_versant trg_audit_bassin; Type: TRIGGER; Schema: geo; Owner: postgres
--

CREATE TRIGGER trg_audit_bassin AFTER INSERT OR DELETE OR UPDATE ON geo.bassin_versant FOR EACH ROW EXECUTE FUNCTION security.fn_trigger_audit();


--
-- Name: ref_site_pollution trg_ref_site_pollution_set_geom_4326; Type: TRIGGER; Schema: geo; Owner: postgres
--

CREATE TRIGGER trg_ref_site_pollution_set_geom_4326 BEFORE INSERT OR UPDATE OF geom ON geo.ref_site_pollution FOR EACH ROW EXECUTE FUNCTION geo.fn_ref_site_pollution_set_geom_4326();


--
-- Name: ref_site_pollution trg_ref_site_pollution_set_updated_at; Type: TRIGGER; Schema: geo; Owner: postgres
--

CREATE TRIGGER trg_ref_site_pollution_set_updated_at BEFORE UPDATE ON geo.ref_site_pollution FOR EACH ROW EXECUTE FUNCTION geo.fn_set_updated_at();


--
-- Name: ref_site_pollution ref_site_pollution_pollution_category_id_fkey; Type: FK CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.ref_site_pollution
    ADD CONSTRAINT ref_site_pollution_pollution_category_id_fkey FOREIGN KEY (pollution_category_id) REFERENCES metadata.ref_categorie_pollution(pollution_category_id);


--
-- Name: ref_site_pollution ref_site_pollution_source_type_id_fkey; Type: FK CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.ref_site_pollution
    ADD CONSTRAINT ref_site_pollution_source_type_id_fkey FOREIGN KEY (source_type_id) REFERENCES metadata.ref_type_source_pollution(source_type_id);


--
-- Name: sous_bassin_abh sous_bassin_bassin_versant_id_fkey; Type: FK CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.sous_bassin_abh
    ADD CONSTRAINT sous_bassin_bassin_versant_id_fkey FOREIGN KEY (bassin_versant_id) REFERENCES geo.bassin_versant(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Szghx0c4Cv2eN48ypjIdAGhS1JyDuYEoXBpOdQyY8kO6bdWxU7cbpumL2qy49HL

