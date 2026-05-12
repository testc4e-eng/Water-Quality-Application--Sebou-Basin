-- PROPOSITION NON EXECUTEE
-- A EXECUTER UNIQUEMENT APRES VALIDATION EXPLICITE
-- Objectif : enrichir metadata.referentiel_parametre_canonique avec le dictionnaire metier C4E.
-- NOTE : version historique remplacee par 16_sql_enrichissement_referentiel_FINAL_VALIDATION_REQUISE.sql.
-- Source prioritaire : parametre_standariser.csv.
-- Securite : transaction ouverte, ROLLBACK actif, COMMIT commente.

BEGIN;

-- 1. Backup logique propose.
CREATE TABLE audit.bkp_referentiel_parametre_canonique_avant_enrichissement_20260508 AS
SELECT *
FROM metadata.referentiel_parametre_canonique;

-- 2. Enrichissement des parametres existants resolus par le dictionnaire C4E.
WITH enrich(code_parametre, unite_reference, sous_domaine, famille, aliases, description_metier) AS (
    VALUES
        ('CONDUCTIVITE','µS/cm','physicochimie','mineralisation','["Cond","cond_20_c","Conductivite","Conductivité","Conductivite20C(µs/cm)"]'::jsonb,'Conductivite electrique de l eau.'),
        ('O2_DISS','mg/L','physicochimie','oxygene','["O2_diss","O2_dissous","O2_DISSOUS","O2dissous(mgO2/l)"]'::jsonb,'Oxygene dissous dans l eau.'),
        ('NO3-','mg/L','nutriments','azote','["NO3","NO3-(mg/l)","NO3_Spectro","Nitrates"]'::jsonb,'Nitrates.'),
        ('NO2-','mg/L','nutriments','azote','["NO2","NO2-_Spectro"]'::jsonb,'Nitrites.'),
        ('PO4_3-','mg/L','nutriments','phosphore','["PO3","PO4","PO4 3-","PO43-(mgP/l)"]'::jsonb,'Orthophosphates.'),
        ('HCO3-','mg/L','mineralisation','alcalinite','["HCO","HCO3","HCT","Bicarbonates"]'::jsonb,'Bicarbonates.'),
        ('SAT','%','physicochimie','oxygene','["sat","SATURATION_OXYGENE"]'::jsonb,'Saturation en oxygene.'),
        ('HG','mg/L','metaux','micropolluant','["Hg","Mercure","Mercure(mg/l)","HG_MERCURE"]'::jsonb,'Mercure.'),
        ('NH4','mg/L','nutriments','azote','["Ammonium","NH4+","NH4+ Titri","NH4+ Spect"]'::jsonb,'Ammonium.'),
        ('TURBIDITE','NTU','physicochimie','matiere en suspension','["turbidite","Turbidite","Turbidité"]'::jsonb,'Turbidite.'),
        ('HUILES_GRAISSES','mg/L','pollution','hydrocarbures','["H_G","Huiles Graisses","Huiles Graisses (H G T)"]'::jsonb,'Huiles et graisses.'),
        ('AZOTE_ORG','mg/L','nutriments','azote','["N_org","Azote_Org"]'::jsonb,'Azote organique.'),
        ('AZOTE_TOTAL','mg/L','nutriments','azote','["N_tot","Azote_Total"]'::jsonb,'Azote total.'),
        ('AZOTE_TOT_KJELD','mg/L','nutriments','azote','["NTK","NTK Spectr","NTK Titri","Azote_tot_kjeld","Azote_tot_kjeldhal"]'::jsonb,'Azote total Kjeldahl.'),
        ('AZOTE_TOT_KJELDHAL','mg/L','nutriments','azote','["Azote_tot_kjeldhal"]'::jsonb,'Variante legacy a conserver, ne pas utiliser comme cible prioritaire si AZOTE_TOT_KJELD est valide.'),
        ('PHOSPHORE_TOTAL','mg/L','nutriments','phosphore','["PT","Phosphore total","Phosphore_Total","PT(mgP/l)"]'::jsonb,'Phosphore total.'),
        ('SIO3','mg/L','mineralisation','silice','["SiO3"]'::jsonb,'Silicates.'),
        ('CRT','mg/L','metaux','micropolluant','["Cr","CrT","Chrome","Chrome(mg/l)"]'::jsonb,'Chrome total. CR/CrT resolu vers CRT par decision C4E.'),
        ('DBO5','mg/L','pollution organique','oxygene','["DBO5","DBO5_dec2h"]'::jsonb,'Demande biologique en oxygene a 5 jours. DBO5_dec2h conserve la methode DECANTE_2H via le libelle source.')
)
UPDATE metadata.referentiel_parametre_canonique r
SET
    unite_reference = COALESCE(NULLIF(TRIM(r.unite_reference), ''), e.unite_reference),
    sous_domaine = COALESCE(NULLIF(TRIM(r.sous_domaine), ''), e.sous_domaine),
    famille = COALESCE(NULLIF(TRIM(r.famille), ''), e.famille),
    table_cible = COALESCE(NULLIF(TRIM(r.table_cible), ''), 'qualite.*'),
    aliases = (
        SELECT jsonb_agg(DISTINCT alias_value ORDER BY alias_value)
        FROM jsonb_array_elements_text(COALESCE(r.aliases, '[]'::jsonb) || e.aliases) AS alias_value
    ),
    description_metier = e.description_metier,
    source_origine = COALESCE(NULLIF(TRIM(r.source_origine), ''), 'dictionnaire_metier_C4E')
FROM enrich e
WHERE r.code_parametre = e.code_parametre
  AND r.statut = 'ACTIF';

-- 3. Creation des nouveaux parametres resolus par le dictionnaire C4E.
WITH new_params(code_parametre, nom_parametre, type_metier, aliases, sous_domaine, famille, unite_reference, description_metier, categorie_dashboard) AS (
    VALUES
        ('F-','Fluorures','physicochimie','["F","F-(mg/l)"]'::jsonb,'mineralisation','halogenes','mg/L','Fluorures.','qualite'),
        ('CN','Cyanures','pollution','["CN-","CN","CN(mg/l)"]'::jsonb,'pollution','toxiques','mg/L','Cyanures.','qualite'),
        ('SIO2','Silice','physicochimie','["SiO2","SiO2(mg/l)"]'::jsonb,'mineralisation','silice','mg/L','Silice.','qualite'),
        ('SO3','Sulfites','physicochimie','["SO3","SO3²-"]'::jsonb,'mineralisation','soufre','mg/L','Sulfites.','qualite'),
        ('H2S','Hydrogene sulfure','physicochimie','["H2S"]'::jsonb,'pollution','soufre','mg/L','Hydrogene sulfure.','qualite'),
        ('CO2_LIBRE','Dioxyde de carbone libre','physicochimie','["CO2_libre","CO2 libre"]'::jsonb,'physicochimie','gaz dissous','mg/L','Dioxyde de carbone libre.','qualite'),
        ('CL2_RES','Chlore residuel','physicochimie','["Cl2_res","CL2_res"]'::jsonb,'desinfection','chlore','mg/L','Chlore residuel.','qualite'),
        ('GERME_22','Germes totaux a 22 C','microbiologie','["Germe_22","Germe_tt_22","GERME22"]'::jsonb,'microbiologie','germes','UFC/mL','Germes totaux a 22 C.','qualite_microbio'),
        ('GERME_37','Germes totaux a 37 C','microbiologie','["Germe_37","Germe_tt_37","GERME37"]'::jsonb,'microbiologie','germes','UFC/mL','Germes totaux a 37 C.','qualite_microbio'),
        ('PSEUDO_AER','Pseudomonas aeruginosa','microbiologie','["Pseudo_aer","Pseudomonas"]'::jsonb,'microbiologie','pathogenes','UFC/100 mL','Pseudomonas aeruginosa.','qualite_microbio'),
        ('VIBRIO','Vibrion cholerique','microbiologie','["Vibrio","Vibrion_Cholerique"]'::jsonb,'microbiologie','pathogenes','UFC/100 mL','Vibrion cholerique.','qualite_microbio'),
        ('CLOSTRI','Clostridium sulfito-reducteurs','microbiologie','["Clostri","Clostri_sul_redu"]'::jsonb,'microbiologie','pathogenes','spores/100 mL','Clostridium sulfito-reducteurs.','qualite_microbio'),
        ('ODEUR','Odeur','organoleptique','["Odeur"]'::jsonb,'organoleptique','sensoriel','qualitatif','Odeur.','qualite_sensoriel'),
        ('SAVEUR','Saveur','organoleptique','["Saveur"]'::jsonb,'organoleptique','sensoriel','qualitatif','Saveur.','qualite_sensoriel'),
        ('PTD','Phosphore total dissous','physicochimie','["PTD"]'::jsonb,'nutriments','phosphore','mg/L','Phosphore total dissous.','qualite'),
        ('PTP','Phosphore total particulaire','physicochimie','["PTP"]'::jsonb,'nutriments','phosphore','mg/L','Phosphore total particulaire.','qualite'),
        ('DCO_DEC2H','DCO decantee 2h','analytique','["DCO_dec2h","DCO_2h décant.","DCO 2h","DCO_2h"]'::jsonb,'pollution organique','oxygene','mg/L','DCO decantee en 2h.','qualite'),
        ('COULEUR','Couleur','organoleptique','["Couleur"]'::jsonb,'organoleptique','sensoriel','qualitatif','Couleur de l eau.','qualite_sensoriel'),
        ('BORE','Bore','pollution','["UNREC_BORE_MG_L","Bore"]'::jsonb,'metaux/metalloides','micropolluant','mg/L','Bore.','qualite')
)
INSERT INTO metadata.referentiel_parametre_canonique (
    parametre_ref_id,
    code_parametre,
    nom_parametre,
    type_metier,
    aliases,
    domaine,
    sous_domaine,
    famille,
    unite_reference,
    type_geo_supporte,
    table_cible,
    source_origine,
    type_source,
    categorie_dashboard,
    scenario_compatible,
    description_metier,
    statut
)
SELECT
    gen_random_uuid(),
    n.code_parametre,
    n.nom_parametre,
    n.type_metier,
    n.aliases,
    'qualite',
    n.sous_domaine,
    n.famille,
    n.unite_reference,
    'station|barrage|point_eau',
    'qualite.*',
    'dictionnaire_metier_C4E:parametre_standariser.csv',
    'NOUVEAU_CANONIQUE_PROPOSE',
    n.categorie_dashboard,
    true,
    n.description_metier,
    'ACTIF'
FROM new_params n
WHERE NOT EXISTS (
    SELECT 1
    FROM metadata.referentiel_parametre_canonique r
    WHERE r.code_parametre = n.code_parametre
);

-- 4. Cas restant volontairement non corriges automatiquement.
-- MO_METAL : CLIENT_REQUIRED.
-- FM / F_M_mes : observation C4E "a ecarter valider cote client".
-- MD : matieres decantables, unite et exposition a valider.
-- DBO5_dec2h : resolu vers DBO5, methode DECANTE_2H a conserver.
-- PT decante : resolu vers PHOSPHORE_TOTAL, methode DECANTE_2H a conserver.
-- CR / CrT : resolu vers CRT.

-- 5. Controles dans transaction.
SELECT COUNT(*) AS duplicate_codes
FROM (
    SELECT code_parametre
    FROM metadata.referentiel_parametre_canonique
    GROUP BY code_parametre
    HAVING COUNT(*) > 1
) d;

SELECT COUNT(*) AS aliases_not_array
FROM metadata.referentiel_parametre_canonique
WHERE jsonb_typeof(aliases) <> 'array';

SELECT code_parametre, unite_reference, aliases
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN (
    'AZOTE_TOT_KJELD','PHOSPHORE_TOTAL','F-','CN','CLOSTRI','CO2_LIBRE',
    'H2S','PSEUDO_AER','VIBRIO','GERME_22','GERME_37','CL2_RES',
    'SIO2','SIO3','HUILES_GRAISSES'
)
ORDER BY code_parametre;

ROLLBACK;
-- COMMIT; -- A activer uniquement apres validation explicite.
