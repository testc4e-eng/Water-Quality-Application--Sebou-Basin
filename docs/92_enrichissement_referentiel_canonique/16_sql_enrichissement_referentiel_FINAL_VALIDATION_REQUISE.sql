-- PROPOSITION NON EXECUTEE
-- A EXECUTER UNIQUEMENT APRES VALIDATION EXPLICITE
-- Objet : enrichissement final du referentiel canonique qualite apres validation C4E.
-- Perimetre : metadata.referentiel_parametre_canonique uniquement.
-- Interdictions : ne touche pas aux tables de mesures, n'insere pas MO_METAL, FM/F_M_mes, MD.
-- Securite : transaction ouverte, ROLLBACK actif, COMMIT commente.

BEGIN;

-- 1. Backup logique des lignes referentiel concernees.
CREATE TABLE IF NOT EXISTS audit.bkp_ref_param_canonique_enrich_final_20260508 AS
WITH concerned_codes(code_parametre) AS (
    VALUES
        ('CONDUCTIVITE'),('O2_DISS'),('NO3-'),('NO2-'),('PO4_3-'),('HCO3-'),('SAT'),('HG'),('NH4'),
        ('TURBIDITE'),('HUILES_GRAISSES'),('AZOTE_ORG'),('AZOTE_TOTAL'),('AZOTE_TOT_KJELD'),
        ('AZOTE_TOT_KJELDHAL'),('PHOSPHORE_TOTAL'),('SIO3'),('CRT'),('DBO5'),('DCO_DEC2H'),
        ('RS105'),('PTD'),('PTP'),('F-'),('CN'),('SIO2'),('SO3'),('H2S'),('CO2_LIBRE'),
        ('CL2_RES'),('GERME_22'),('GERME_37'),('PSEUDO_AER'),('VIBRIO'),('CLOSTRI'),
        ('ODEUR'),('SAVEUR'),('BORE')
)
SELECT r.*
FROM metadata.referentiel_parametre_canonique r
JOIN concerned_codes c ON c.code_parametre = r.code_parametre;

-- 2. Enrichissement des parametres existants.
WITH enrich(code_parametre, unite_reference, sous_domaine, famille, aliases, description_metier, categorie_dashboard) AS (
    VALUES
        ('CONDUCTIVITE','µS/cm','physicochimie','mineralisation','["Cond","cond_20_c","Conductivite","Conductivité","Conductivite20C(µs/cm)"]'::jsonb,'Conductivite electrique de l eau.','qualite'),
        ('O2_DISS','mg/L','physicochimie','oxygene','["O2_diss","O2_dissous","O2_DISSOUS","O2dissous(mgO2/l)"]'::jsonb,'Oxygene dissous dans l eau.','qualite'),
        ('NO3-','mg/L','nutriments','azote','["NO3","NO3-(mg/l)","NO3_Spectro","Nitrates"]'::jsonb,'Nitrates.','qualite'),
        ('NO2-','mg/L','nutriments','azote','["NO2","NO2-_Spectro"]'::jsonb,'Nitrites.','qualite'),
        ('PO4_3-','mg/L','nutriments','phosphore','["PO3","PO4","PO4 3-","PO43-(mgP/l)"]'::jsonb,'Orthophosphates.','qualite'),
        ('HCO3-','mg/L','mineralisation','alcalinite','["HCO","HCO3","HCT","Bicarbonates"]'::jsonb,'Bicarbonates.','qualite'),
        ('SAT','%','physicochimie','oxygene','["sat","SATURATION_OXYGENE"]'::jsonb,'Saturation en oxygene.','qualite'),
        ('HG','mg/L','metaux','micropolluant','["Hg","Mercure","Mercure(mg/l)","HG_MERCURE"]'::jsonb,'Mercure.','qualite'),
        ('NH4','mg/L','nutriments','azote','["Ammonium","NH4+","NH4+ Titri","NH4+ Spect"]'::jsonb,'Ammonium.','qualite'),
        ('TURBIDITE','NTU','physicochimie','matiere en suspension','["turbidite","Turbidite","Turbidité"]'::jsonb,'Turbidite.','qualite'),
        ('HUILES_GRAISSES','mg/L','pollution','hydrocarbures','["H_G","Huiles Graisses","Huiles Graisses (H G T)"]'::jsonb,'Huiles et graisses.','qualite'),
        ('AZOTE_ORG','mg/L','nutriments','azote','["N_ORG","N_org","Azote_Org"]'::jsonb,'Azote organique.','qualite'),
        ('AZOTE_TOTAL','mg/L','nutriments','azote','["N_TOT","N_tot","Azote_Total"]'::jsonb,'Azote total.','qualite'),
        ('AZOTE_TOT_KJELD','mg/L','nutriments','azote','["NTK","NTK Spectr","NTK Titri","Azote_tot_kjeld","Azote_tot_kjeldhal"]'::jsonb,'Azote total Kjeldahl. Cible canonique officielle pour NTK.','qualite'),
        ('AZOTE_TOT_KJELDHAL','mg/L','nutriments','azote','[]'::jsonb,'Code legacy conserve sans alias pour eviter une collision avec la cible canonique AZOTE_TOT_KJELD.','qualite'),
        ('PHOSPHORE_TOTAL','mg/L','nutriments','phosphore','["PT","PT décant. 2h","PT DECANTE","PT(mgP/l)","Phosphore total","Phosphore_Total"]'::jsonb,'Phosphore total. Les variantes decantees conservent la methode analytique DECANTE_2H via le libelle source.','qualite'),
        ('SIO3','mg/L','mineralisation','silice','["SiO3"]'::jsonb,'Silicates. Ne pas confondre avec SIO2 silice.','qualite'),
        ('CRT','mg/L','metaux','micropolluant','["Cr","CrT","Chrome","Chrome(mg/l)","CR"]'::jsonb,'Chrome total.','qualite'),
        ('DBO5','mg/L','pollution organique','oxygene','["DBO5","DBO5_dec2h","DBO5_DEC2H"]'::jsonb,'Demande biologique en oxygene a 5 jours. Les variantes decantees conservent la methode analytique DECANTE_2H via le libelle source.','qualite'),
        ('DCO_DEC2H','mg/L','pollution organique','oxygene','["DCO_dec2h","DCO_2h décant.","DCO 2h","DCO_2h"]'::jsonb,'DCO decantee en 2h.','qualite'),
        ('RS105','mg/L','mineralisation','residus','["RS mesuré","RS mesuré à 105 °C","RS105","RESIDUS_SECS"]'::jsonb,'Residu sec a 105 C.','qualite'),
        ('PTD','mg/L','nutriments','phosphore','["PTD"]'::jsonb,'Phosphore total dissous.','qualite'),
        ('PTP','mg/L','nutriments','phosphore','["PTP"]'::jsonb,'Phosphore total particulaire.','qualite')
)
UPDATE metadata.referentiel_parametre_canonique r
SET
    unite_reference = COALESCE(NULLIF(TRIM(r.unite_reference), ''), e.unite_reference),
    sous_domaine = COALESCE(NULLIF(TRIM(r.sous_domaine), ''), e.sous_domaine),
    famille = COALESCE(NULLIF(TRIM(r.famille), ''), e.famille),
    table_cible = COALESCE(NULLIF(TRIM(r.table_cible), ''), 'qualite.*'),
    aliases = COALESCE((
        SELECT jsonb_agg(DISTINCT alias_value ORDER BY alias_value)
        FROM jsonb_array_elements_text(COALESCE(r.aliases, '[]'::jsonb) || e.aliases) AS alias_value
    ), '[]'::jsonb),
    description_metier = e.description_metier,
    categorie_dashboard = COALESCE(NULLIF(TRIM(r.categorie_dashboard), ''), e.categorie_dashboard),
    source_origine = COALESCE(NULLIF(TRIM(r.source_origine), ''), 'dictionnaire_metier_C4E:parametre_standariser.csv')
FROM enrich e
WHERE r.code_parametre = e.code_parametre
  AND r.statut = 'ACTIF';

-- 3. Creation des nouveaux parametres valides par C4E.
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
    'CANONIQUE_C4E_VALIDE',
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

-- 4. Exclusions explicites.
-- MO_METAL : vrai inconnu, CLIENT_REQUIRED, non insere, non mappe.
-- FM / F_M_mes : validation client, non enrichi ici.
-- MD : validation client, non cree ici malgre la ligne C4E.

-- 5. Controles dans transaction.
SELECT code_parametre, COUNT(*) AS n
FROM metadata.referentiel_parametre_canonique
GROUP BY code_parametre
HAVING COUNT(*) > 1;

SELECT code_parametre
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('MO_METAL','MD')
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference, aliases
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN (
    'F-','CN','SIO2','SO3','H2S','CO2_LIBRE','CL2_RES','GERME_22',
    'GERME_37','CLOSTRI','PSEUDO_AER','VIBRIO','ODEUR','SAVEUR','BORE',
    'AZOTE_TOT_KJELD','PHOSPHORE_TOTAL','CRT','DBO5','RS105'
)
ORDER BY code_parametre;

ROLLBACK;
-- COMMIT; -- A decommenter uniquement apres validation explicite et controles OK.
