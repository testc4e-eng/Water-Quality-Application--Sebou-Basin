-- PROPOSITION DE CHARGEMENT DEV - NE PAS EXECUTER SANS VALIDATION EXPLICITE
-- Projet WQDSS / SAD Sebou
-- Charge le référentiel réglementaire qualité Tableau n°1 dans les tables metadata.qualite_*_reglementaire.
-- Prérequis : DDL appliqué, statut DDL_DEV_APPLIQUE__SEUILS_NON_CHARGES.
-- Interdits respectés : aucun DROP, aucun TRUNCATE, aucune modification de metadata.referentiel_parametre_canonique.
-- Script idempotent : INSERT ... ON CONFLICT DO UPDATE.
-- Version réglementaire : REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19

BEGIN;

-- 1. Source réglementaire Tableau n°1
INSERT INTO metadata.qualite_source_reglementaire (
    code_source, source_document, version_reglementaire, titre, page_pdf, tableau_pdf,
    statut_operationnel, actif, commentaire, validation_metier, validation_date, updated_at
)
VALUES (
    'ABH_QUALITE_EAUX_SURFACE_TABLEAU_1', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19',
    'Tableau n°1 - Grille générale d''évaluation de la qualité des eaux de surface',
    8, 'Tableau n°1', 'REGLEMENTAIRE_OPERATIONNEL', true,
    'Source réglementaire opérationnelle unique du moteur SAD.', 'VALIDATED_DEV', now(), now()
)
ON CONFLICT (code_source, version_reglementaire) DO UPDATE SET
    titre = EXCLUDED.titre,
    page_pdf = EXCLUDED.page_pdf,
    tableau_pdf = EXCLUDED.tableau_pdf,
    statut_operationnel = EXCLUDED.statut_operationnel,
    actif = EXCLUDED.actif,
    commentaire = EXCLUDED.commentaire,
    validation_metier = EXCLUDED.validation_metier,
    validation_date = EXCLUDED.validation_date,
    updated_at = now();

-- 2. Types d'eau : opérationnel + grilles documentaires non opérationnelles
INSERT INTO metadata.qualite_type_eau (
    code_type_eau, libelle_type_eau, source_document, version_reglementaire,
    statut_operationnel, actif, commentaire, validation_metier, validation_date, updated_at
)
VALUES
    ('surface_generale', 'Eaux de surface - grille générale Tableau n°1', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', 'REGLEMENTAIRE_OPERATIONNEL', true, 'Unique type d''eau opérationnel pour le moteur SAD.', 'VALIDATED_DEV', now(), now()),
    ('riviere_simplifiee', 'Rivières - grille simplifiée documentaire', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', 'DOCUMENTAIRE_NON_OPERATIONNEL', false, 'Grille simplifiée exclue du moteur SAD.', 'VALIDATED_DEV', now(), now()),
    ('lac_simplifiee', 'Lacs - grille simplifiée documentaire', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', 'DOCUMENTAIRE_NON_OPERATIONNEL', false, 'Grille simplifiée exclue du moteur SAD.', 'VALIDATED_DEV', now(), now()),
    ('souterraine_simplifiee', 'Eaux souterraines - grille simplifiée documentaire', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', 'DOCUMENTAIRE_NON_OPERATIONNEL', false, 'Grille simplifiée exclue du moteur SAD.', 'VALIDATED_DEV', now(), now())
ON CONFLICT (code_type_eau, version_reglementaire) DO UPDATE SET
    libelle_type_eau = EXCLUDED.libelle_type_eau,
    statut_operationnel = EXCLUDED.statut_operationnel,
    actif = EXCLUDED.actif,
    commentaire = EXCLUDED.commentaire,
    validation_metier = EXCLUDED.validation_metier,
    validation_date = EXCLUDED.validation_date,
    updated_at = now();

-- 3. Classes qualité et palette SAD
INSERT INTO metadata.qualite_classe_reglementaire (
    code_classe, libelle_classe, ordre_qualite, score_min, score_max, couleur_pdf, couleur_sad, couleur_hex,
    source_document, version_reglementaire, actif, commentaire, validation_metier, validation_date, updated_at
)
VALUES
    ('excellente', 'Excellente', 1, 80, 100, 'bleu', 'bleu', '#2563eb', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Palette SAD mixte normalisée validée.', 'VALIDATED_DEV', now(), now()),
    ('bonne', 'Bonne', 2, 60, 80, 'vert', 'vert', '#16a34a', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Palette SAD mixte normalisée validée.', 'VALIDATED_DEV', now(), now()),
    ('moyenne', 'Moyenne', 3, 40, 60, 'orange/jaune', 'jaune/orange', '#f59e0b', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Palette SAD mixte normalisée validée.', 'VALIDATED_DEV', now(), now()),
    ('mauvaise', 'Mauvaise', 4, 20, 40, 'rouge/violet', 'rouge', '#dc2626', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Palette SAD mixte normalisée validée.', 'VALIDATED_DEV', now(), now()),
    ('tres_mauvaise', 'Très mauvaise', 5, 0, 20, 'violet/rouge', 'violet', '#7c3aed', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Palette SAD mixte normalisée validée.', 'VALIDATED_DEV', now(), now())
ON CONFLICT (code_classe, version_reglementaire) DO UPDATE SET
    libelle_classe = EXCLUDED.libelle_classe,
    ordre_qualite = EXCLUDED.ordre_qualite,
    score_min = EXCLUDED.score_min,
    score_max = EXCLUDED.score_max,
    couleur_pdf = EXCLUDED.couleur_pdf,
    couleur_sad = EXCLUDED.couleur_sad,
    couleur_hex = EXCLUDED.couleur_hex,
    actif = EXCLUDED.actif,
    commentaire = EXCLUDED.commentaire,
    validation_metier = EXCLUDED.validation_metier,
    validation_date = EXCLUDED.validation_date,
    updated_at = now();

-- 4. Paramètres réglementaires Tableau n°1
INSERT INTO metadata.qualite_parametre_reglementaire (
    code_reglementaire, code_canonique_cible, libelle_reglementaire, parametre_pdf, famille_parametre,
    unite_reglementaire_source, unite_moteur, facteur_conversion_vers_unite_moteur,
    classifiable, statut_operationnel, source_document, version_reglementaire, actif,
    commentaire, validation_metier, validation_date, updated_at
)
VALUES
    ('NH4', 'NH4', 'Ammonium', 'Ammonium', 'azote', 'mgNH4/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Unité source mgNH4/l acceptée comme concentration moteur mg/L après décision métier.', 'VALIDATED_DEV', now(), now()),
    ('AS', 'AS', 'Arsenic (As)', 'Arsenic (As)', 'metaux_lourds', 'µg/l', 'mg/L', 0.001, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Source µg/l, moteur mg/L, facteur 0.001.', 'VALIDATED_DEV', now(), now()),
    ('BARYUM', 'BA', 'Baryum', 'Baryum', 'micropolluants', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Équivalent canonique BA vérifié.', 'VALIDATED_DEV', now(), now()),
    ('CD', 'CD', 'Cadmium (Cd)', 'Cadmium (Cd)', 'metaux_lourds', 'µg/l', 'mg/L', 0.001, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Source µg/l, moteur mg/L, facteur 0.001.', 'VALIDATED_DEV', now(), now()),
    ('CHL_A', 'CHLA', 'Chlorophylle a', 'Chlorophylle a', 'biologique', 'µg/l', 'µg/l', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Équivalent canonique CHLA vérifié.', 'VALIDATED_DEV', now(), now()),
    ('CL', 'CL', 'Chlorures (Cl-)', 'Chlorures (Cl-)', 'mineralisation', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV', now(), now()),
    ('CR', 'CRT', 'Chrome total (Cr)', 'Chrome total (Cr)', 'metaux_lourds', 'µg/l', 'mg/L', 0.001, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Alias canoniques Chrome/Cr/CR/CrT vérifiés.', 'VALIDATED_DEV', now(), now()),
    ('CF', 'CF', 'Coliformes fécaux', 'Coliformes fécaux', 'microbiologie', '/100ml', 'UFC/100 mL', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '/100ml équivalent opérationnel à UFC/100 mL.', 'VALIDATED_DEV', now(), now()),
    ('CT', 'CT', 'Coliformes totaux', 'Coliformes totaux', 'microbiologie', '/100ml', 'UFC/100 mL', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '/100ml équivalent opérationnel à UFC/100 mL.', 'VALIDATED_DEV', now(), now()),
    ('CONDUCTIVITE', 'CONDUCTIVITE', 'Conductivité à 20° C', 'Conductivité à 20° C', 'mineralisation', 'µs/cm', 'µS/cm', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV', now(), now()),
    ('COULEUR_ECHELLE_PT', 'COULEUR', 'Couleur (échelle Pt)', 'Couleur (échelle Pt)', 'micropolluants', 'mg Pt/L', 'mg Pt/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Équivalent canonique COULEUR vérifié.', 'VALIDATED_DEV', now(), now()),
    ('CU', 'CU', 'Cuivre (Cu)', 'Cuivre (Cu)', 'metaux_lourds', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV', now(), now()),
    ('CN', 'CN', 'Cyanures (CN-)', 'Cyanures (CN-)', 'micropolluants', 'µg/l', 'mg/L', 0.001, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Source µg/l, moteur mg/L, facteur 0.001.', 'VALIDATED_DEV', now(), now()),
    ('DBO5', 'DBO5', 'DBO 5', 'DBO 5', 'oxygene_matiere_organique', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'mgO2/l et mg/L équivalents opérationnels pour DBO5/DCO.', 'VALIDATED_DEV', now(), now()),
    ('DCO', 'DCO', 'DCO', 'DCO', 'oxygene_matiere_organique', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'mgO2/l et mg/L équivalents opérationnels pour DBO5/DCO.', 'VALIDATED_DEV', now(), now()),
    ('DETERGENTS', 'DETERGENT', 'Détergents anioniques', 'Détergents anioniques', 'micropolluants', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Équivalent canonique DETERGENT vérifié.', 'VALIDATED_DEV', now(), now()),
    ('FE', 'FE', 'Fe total (Fe)', 'Fe total (Fe)', 'metaux_lourds', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV', now(), now()),
    ('FLUORURE_F', 'F-', 'Fluorure (F-)', 'Fluorure (F-)', 'micropolluants', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Équivalent canonique F- vérifié.', 'VALIDATED_DEV', now(), now()),
    ('H_P_A_TOTAUX', NULL, 'H.P.A. totaux', 'H.P.A. totaux', 'micropolluants', 'µg/l', 'µg/l', NULL, false, 'OBSERVATIONNEL_NON_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Vrai absent canonique, non utilisable moteur.', 'VALIDATED_DEV', now(), now()),
    ('HYDROCARBURES', NULL, 'Hydrocarbures', 'Hydrocarbures', 'micropolluants', 'mg/l', 'mg/L', NULL, false, 'OBSERVATIONNEL_NON_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Vrai absent canonique, pas d’assimilation automatique à HCT/HUILES_GRAISSES.', 'VALIDATED_DEV', now(), now()),
    ('MES', 'MES', 'MES', 'MES', 'matieres_en_suspension', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV', now(), now()),
    ('MN', 'MN', 'Manganèse (Mn)', 'Manganèse (Mn)', 'metaux_lourds', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV', now(), now()),
    ('HG', 'HG', 'Mercure (Hg)', 'Mercure (Hg)', 'metaux_lourds', 'µg/l', 'mg/L', 0.001, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Règle spécifique validée : <1 moyenne, >=1 mauvaise.', 'VALIDATED_DEV', now(), now()),
    ('NTK', 'AZOTE_TOT_KJELD', 'NTK', 'NTK', 'azote', 'mgN/l', 'mgN/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Alias canonique NTK vérifié.', 'VALIDATED_DEV', now(), now()),
    ('NI', 'NI', 'Nickel (Ni)', 'Nickel (Ni)', 'metaux_lourds', 'µg/l', 'mg/L', 0.001, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Source µg/l, moteur mg/L, facteur 0.001.', 'VALIDATED_DEV', now(), now()),
    ('NO3', 'NO3-', 'Nitrates (NO3-)', 'Nitrates (NO3-)', 'azote', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'NO3 alias réglementaire, NO3- canonique.', 'VALIDATED_DEV', now(), now()),
    ('O2_DISSOUS', 'O2_DISS', 'O2 dissous', 'O2 dissous', 'oxygene_matiere_organique', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'O2_DISSOUS alias réglementaire, O2_DISS canonique.', 'VALIDATED_DEV', now(), now()),
    ('ODEUR_DILU_A_25_C', 'ODEUR', 'Odeur (dilu à 25° C)', 'Odeur (dilu à 25° C)', 'micropolluants', '', 'qualitatif', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Équivalent canonique ODEUR vérifié.', 'VALIDATED_DEV', now(), now()),
    ('OXYDABILITE_KMNO4', NULL, 'Oxydabilité KMnO4', 'Oxydabilité KMnO4', 'oxygene_matiere_organique', 'mg/l', 'mg/L', NULL, false, 'OBSERVATIONNEL_NON_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Vrai absent canonique, non utilisable moteur.', 'VALIDATED_DEV', now(), now()),
    ('P_TOTAL', 'PHOSPHORE_TOTAL', 'P total (Pt)', 'P total (Pt)', 'phosphore', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Alias canoniques Phosphore total/PT vérifiés.', 'VALIDATED_DEV', now(), now()),
    ('PH', 'PH', 'PH', 'PH', 'acidification', '', '', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV', now(), now()),
    ('PESTICIDES_PAR_SUBST', NULL, 'Pesticides par subst', 'Pesticides par subst', 'micropolluants', 'µg/l', 'µg/l', NULL, false, 'OBSERVATIONNEL_NON_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Vrai absent canonique, non utilisable moteur.', 'VALIDATED_DEV', now(), now()),
    ('PESTICIDES_TOTAUX', NULL, 'Pesticides totaux', 'Pesticides totaux', 'micropolluants', 'µg/l', 'µg/l', NULL, false, 'OBSERVATIONNEL_NON_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Vrai absent canonique, non utilisable moteur.', 'VALIDATED_DEV', now(), now()),
    ('PO4', 'PO4_3-', 'Phosphates (PO4--)', 'Phosphates (PO4--)', 'phosphore', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Alias canonique PO4 vérifié.', 'VALIDATED_DEV', now(), now()),
    ('PHENOLS', 'PHENOL', 'Phénols', 'Phénols', 'micropolluants', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Équivalent canonique PHENOL vérifié.', 'VALIDATED_DEV', now(), now()),
    ('PB', 'PB', 'Plomb (Pb)', 'Plomb (Pb)', 'metaux_lourds', 'µg/l', 'mg/L', 0.001, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Source µg/l, moteur mg/L, facteur 0.001.', 'VALIDATED_DEV', now(), now()),
    ('SELENIUM_SE', 'SE', 'Selenium (Se)', 'Selenium (Se)', 'micropolluants', 'µg/l', 'mg/L', 0.001, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Équivalent canonique SE vérifié; source µg/l, moteur mg/L.', 'VALIDATED_DEV', now(), now()),
    ('SF', 'SF', 'Streptocoques fécaux', 'Streptocoques fécaux', 'microbiologie', '/100ml', 'UFC/100 mL', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '/100ml équivalent opérationnel à UFC/100 mL.', 'VALIDATED_DEV', now(), now()),
    ('SO4', 'SO4', 'Sulfates (SO4-)', 'Sulfates (SO4-)', 'mineralisation', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV', now(), now()),
    ('T_EAU', 'T_EAU', 'Température', 'Température', 'temperature', '°C', '°C', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV', now(), now()),
    ('ZN', 'ZN', 'Zinc (Zn)', 'Zinc (Zn)', 'metaux_lourds', 'mg/l', 'mg/L', NULL, true, 'REGLEMENTAIRE_CLASSIFIABLE', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV', now(), now())
ON CONFLICT (code_reglementaire, version_reglementaire) DO UPDATE SET
    code_canonique_cible = EXCLUDED.code_canonique_cible,
    libelle_reglementaire = EXCLUDED.libelle_reglementaire,
    parametre_pdf = EXCLUDED.parametre_pdf,
    famille_parametre = EXCLUDED.famille_parametre,
    unite_reglementaire_source = EXCLUDED.unite_reglementaire_source,
    unite_moteur = EXCLUDED.unite_moteur,
    facteur_conversion_vers_unite_moteur = EXCLUDED.facteur_conversion_vers_unite_moteur,
    classifiable = EXCLUDED.classifiable,
    statut_operationnel = EXCLUDED.statut_operationnel,
    actif = EXCLUDED.actif,
    commentaire = EXCLUDED.commentaire,
    validation_metier = EXCLUDED.validation_metier,
    validation_date = EXCLUDED.validation_date,
    updated_at = now();

-- 5. Mappings canonique/réglementaire. Le référentiel canonique est lu, jamais modifié.
WITH mapping_values(code_reglementaire, code_canonique, statut_mapping, commentaire, validation_metier) AS (
    VALUES
    ('NH4', 'NH4', 'match_exact_unite_equivalente', 'Unité source mgNH4/l acceptée comme concentration moteur mg/L après décision métier.', 'VALIDATED_DEV'),
    ('AS', 'AS', 'match_exact_unite_normalisee', 'Source µg/l, moteur mg/L, facteur 0.001.', 'VALIDATED_DEV'),
    ('BARYUM', 'BA', 'match_probable', 'Équivalent canonique BA vérifié.', 'VALIDATED_DEV'),
    ('CD', 'CD', 'match_exact_unite_normalisee', 'Source µg/l, moteur mg/L, facteur 0.001.', 'VALIDATED_DEV'),
    ('CHL_A', 'CHLA', 'match_probable', 'Équivalent canonique CHLA vérifié.', 'VALIDATED_DEV'),
    ('CL', 'CL', 'match_exact', '', 'VALIDATED_DEV'),
    ('CR', 'CRT', 'match_probable_fort', 'Alias canoniques Chrome/Cr/CR/CrT vérifiés.', 'VALIDATED_DEV'),
    ('CF', 'CF', 'match_exact_unite_equivalente', '/100ml équivalent opérationnel à UFC/100 mL.', 'VALIDATED_DEV'),
    ('CT', 'CT', 'match_exact_unite_equivalente', '/100ml équivalent opérationnel à UFC/100 mL.', 'VALIDATED_DEV'),
    ('CONDUCTIVITE', 'CONDUCTIVITE', 'match_exact', '', 'VALIDATED_DEV'),
    ('COULEUR_ECHELLE_PT', 'COULEUR', 'match_probable', 'Équivalent canonique COULEUR vérifié.', 'VALIDATED_DEV'),
    ('CU', 'CU', 'match_exact', '', 'VALIDATED_DEV'),
    ('CN', 'CN', 'match_exact_unite_normalisee', 'Source µg/l, moteur mg/L, facteur 0.001.', 'VALIDATED_DEV'),
    ('DBO5', 'DBO5', 'match_exact_unite_equivalente', 'mgO2/l et mg/L équivalents opérationnels pour DBO5/DCO.', 'VALIDATED_DEV'),
    ('DCO', 'DCO', 'match_exact_unite_equivalente', 'mgO2/l et mg/L équivalents opérationnels pour DBO5/DCO.', 'VALIDATED_DEV'),
    ('DETERGENTS', 'DETERGENT', 'match_probable', 'Équivalent canonique DETERGENT vérifié.', 'VALIDATED_DEV'),
    ('FE', 'FE', 'match_exact', '', 'VALIDATED_DEV'),
    ('FLUORURE_F', 'F-', 'match_probable', 'Équivalent canonique F- vérifié.', 'VALIDATED_DEV'),
    ('H_P_A_TOTAUX', NULL, 'absent_non_utilisable', 'Vrai absent canonique, non utilisable moteur.', 'A_VALIDER'),
    ('HYDROCARBURES', NULL, 'absent_non_utilisable', 'Vrai absent canonique, pas d’assimilation automatique à HCT/HUILES_GRAISSES.', 'A_VALIDER'),
    ('MES', 'MES', 'match_exact', '', 'VALIDATED_DEV'),
    ('MN', 'MN', 'match_exact', '', 'VALIDATED_DEV'),
    ('HG', 'HG', 'match_exact_unite_normalisee', 'Règle spécifique validée : <1 moyenne, >=1 mauvaise.', 'VALIDATED_DEV'),
    ('NTK', 'AZOTE_TOT_KJELD', 'match_probable_fort', 'Alias canonique NTK vérifié.', 'VALIDATED_DEV'),
    ('NI', 'NI', 'match_exact_unite_normalisee', 'Source µg/l, moteur mg/L, facteur 0.001.', 'VALIDATED_DEV'),
    ('NO3', 'NO3-', 'alias_reglementaire_valide', 'NO3 alias réglementaire, NO3- canonique.', 'VALIDATED_DEV'),
    ('O2_DISSOUS', 'O2_DISS', 'alias_reglementaire_valide', 'O2_DISSOUS alias réglementaire, O2_DISS canonique.', 'VALIDATED_DEV'),
    ('ODEUR_DILU_A_25_C', 'ODEUR', 'match_probable', 'Équivalent canonique ODEUR vérifié.', 'VALIDATED_DEV'),
    ('OXYDABILITE_KMNO4', NULL, 'absent_non_utilisable', 'Vrai absent canonique, non utilisable moteur.', 'A_VALIDER'),
    ('P_TOTAL', 'PHOSPHORE_TOTAL', 'match_probable_fort', 'Alias canoniques Phosphore total/PT vérifiés.', 'VALIDATED_DEV'),
    ('PH', 'PH', 'match_exact', '', 'VALIDATED_DEV'),
    ('PESTICIDES_PAR_SUBST', NULL, 'absent_non_utilisable', 'Vrai absent canonique, non utilisable moteur.', 'A_VALIDER'),
    ('PESTICIDES_TOTAUX', NULL, 'absent_non_utilisable', 'Vrai absent canonique, non utilisable moteur.', 'A_VALIDER'),
    ('PO4', 'PO4_3-', 'match_probable_fort', 'Alias canonique PO4 vérifié.', 'VALIDATED_DEV'),
    ('PHENOLS', 'PHENOL', 'match_probable', 'Équivalent canonique PHENOL vérifié.', 'VALIDATED_DEV'),
    ('PB', 'PB', 'match_exact_unite_normalisee', 'Source µg/l, moteur mg/L, facteur 0.001.', 'VALIDATED_DEV'),
    ('SELENIUM_SE', 'SE', 'match_probable', 'Équivalent canonique SE vérifié; source µg/l, moteur mg/L.', 'VALIDATED_DEV'),
    ('SF', 'SF', 'match_exact_unite_equivalente', '/100ml équivalent opérationnel à UFC/100 mL.', 'VALIDATED_DEV'),
    ('SO4', 'SO4', 'match_exact', '', 'VALIDATED_DEV'),
    ('T_EAU', 'T_EAU', 'match_exact', '', 'VALIDATED_DEV'),
    ('ZN', 'ZN', 'match_exact', '', 'VALIDATED_DEV')
)
INSERT INTO metadata.qualite_mapping_canonique_reglementaire (
    parametre_reglementaire_id, parametre_canonique_id, code_reglementaire, code_canonique,
    statut_mapping, source_column, source_system, source_document, version_reglementaire,
    actif, commentaire, validation_metier, validation_date, updated_at
)
SELECT
    pr.id,
    rpc.parametre_ref_id,
    mv.code_reglementaire,
    mv.code_canonique,
    mv.statut_mapping,
    'parametre_pdf',
    'REGLEMENTAIRE_QUALITE_ABH',
    'Système d''evaluation de la Qualité des ressources en eau.pdf',
    'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19',
    (mv.statut_mapping <> 'absent_non_utilisable'),
    mv.commentaire,
    mv.validation_metier,
    now(),
    now()
FROM mapping_values mv
JOIN metadata.qualite_parametre_reglementaire pr
  ON pr.code_reglementaire = mv.code_reglementaire
 AND pr.version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19'
LEFT JOIN metadata.referentiel_parametre_canonique rpc
  ON rpc.code_parametre = mv.code_canonique
ON CONFLICT (code_reglementaire, (COALESCE(code_canonique, '')), version_reglementaire) DO UPDATE SET
    parametre_reglementaire_id = EXCLUDED.parametre_reglementaire_id,
    parametre_canonique_id = EXCLUDED.parametre_canonique_id,
    statut_mapping = EXCLUDED.statut_mapping,
    source_column = EXCLUDED.source_column,
    source_system = EXCLUDED.source_system,
    actif = EXCLUDED.actif,
    commentaire = EXCLUDED.commentaire,
    validation_metier = EXCLUDED.validation_metier,
    validation_date = EXCLUDED.validation_date,
    updated_at = now();

-- 6. Seuils réglementaires Tableau n°1. Les vrais absents canonique sont chargés mais inactifs moteur.
WITH seuil_values(
    code_reglementaire, code_canonique_cible, code_classe,
    borne_min_source, operateur_min, borne_max_source, operateur_max,
    borne_min_moteur, borne_max_moteur, valeur_intervalle_originale,
    unite_reglementaire_source, unite_moteur, facteur_conversion_vers_unite_moteur,
    regle_specifique, indice_min, indice_max, confiance_extraction,
    source_document, version_reglementaire, actif, commentaire, validation_metier
) AS (
    VALUES
    ('COULEUR_ECHELLE_PT', 'COULEUR', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '20', 'mg Pt/L', 'mg Pt/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('COULEUR_ECHELLE_PT', 'COULEUR', 'bonne', 20, '>=', 50, '<=', 20, 50, '20-50', 'mg Pt/L', 'mg Pt/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('COULEUR_ECHELLE_PT', 'COULEUR', 'moyenne', 50, '>=', 100, '<=', 50, 100, '50-100', 'mg Pt/L', 'mg Pt/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('COULEUR_ECHELLE_PT', 'COULEUR', 'mauvaise', 100, '>=', 200, '<=', 100, 200, '100-200', 'mg Pt/L', 'mg Pt/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('COULEUR_ECHELLE_PT', 'COULEUR', 'tres_mauvaise', 200, '>', NULL, NULL, 200, NULL, '>200', 'mg Pt/L', 'mg Pt/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('ODEUR_DILU_A_25_C', 'ODEUR', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '3', '', 'qualitatif', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'unité non indiquée dans le tableau', 'VALIDATED_DEV'),
    ('ODEUR_DILU_A_25_C', 'ODEUR', 'bonne', 3, '>=', 10, '<=', 3, 10, '3-10', '', 'qualitatif', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'unité non indiquée dans le tableau', 'VALIDATED_DEV'),
    ('ODEUR_DILU_A_25_C', 'ODEUR', 'moyenne', 10, '>=', 20, '<=', 10, 20, '10-20', '', 'qualitatif', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'unité non indiquée dans le tableau', 'VALIDATED_DEV'),
    ('ODEUR_DILU_A_25_C', 'ODEUR', 'mauvaise', 20, '>', NULL, NULL, 20, NULL, '>20', '', 'qualitatif', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'unité non indiquée dans le tableau', 'VALIDATED_DEV'),
    ('ODEUR_DILU_A_25_C', 'ODEUR', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', '', 'qualitatif', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'unité non indiquée dans le tableau', 'VALIDATED_DEV'),
    ('T_EAU', 'T_EAU', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '20', '°C', '°C', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('T_EAU', 'T_EAU', 'bonne', 20, '>=', 25, '<=', 20, 25, '20-25', '°C', '°C', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('T_EAU', 'T_EAU', 'moyenne', 25, '>=', 30, '<=', 25, 30, '25-30', '°C', '°C', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('T_EAU', 'T_EAU', 'mauvaise', 30, '>=', 35, '<=', 30, 35, '30-35', '°C', '°C', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('T_EAU', 'T_EAU', 'tres_mauvaise', 35, '>', NULL, NULL, 35, NULL, '>35', '°C', '°C', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PH', 'PH', 'excellente', 6.5, '>=', 8.5, '<=', 6.5, 8.5, '6,5-8,5', '', '', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classes 4 et 5 identiques dans le tableau', 'VALIDATED_DEV'),
    ('PH', 'PH', 'bonne', 6.5, '>=', 8.5, '<=', 6.5, 8.5, '6,5-8,5', '', '', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classes 4 et 5 identiques dans le tableau', 'VALIDATED_DEV'),
    ('PH', 'PH', 'moyenne', 6.5, '>=', 9.2, '<=', 6.5, 9.2, '6,5-9,2', '', '', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classes 4 et 5 identiques dans le tableau', 'VALIDATED_DEV'),
    ('PH', 'PH', 'mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', '', '', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classes 4 et 5 identiques dans le tableau', 'VALIDATED_DEV'),
    ('PH', 'PH', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', '', '', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classes 4 et 5 identiques dans le tableau', 'VALIDATED_DEV'),
    ('CONDUCTIVITE', 'CONDUCTIVITE', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '750', 'µs/cm', 'µS/cm', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CONDUCTIVITE', 'CONDUCTIVITE', 'bonne', 750, '>=', 1300, '<=', 750, 1300, '750-1300', 'µs/cm', 'µS/cm', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CONDUCTIVITE', 'CONDUCTIVITE', 'moyenne', 1300, '>=', 2700, '<=', 1300, 2700, '1300-2700', 'µs/cm', 'µS/cm', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CONDUCTIVITE', 'CONDUCTIVITE', 'mauvaise', 2700, '>=', 3000, '<=', 2700, 3000, '2700-3000', 'µs/cm', 'µS/cm', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CONDUCTIVITE', 'CONDUCTIVITE', 'tres_mauvaise', 3000, '>', NULL, NULL, 3000, NULL, '>3000', 'µs/cm', 'µS/cm', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CL', 'CL', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '200', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CL', 'CL', 'bonne', 200, '>=', 300, '<=', 200, 300, '200-300', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CL', 'CL', 'moyenne', 300, '>=', 750, '<=', 300, 750, '300-750', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CL', 'CL', 'mauvaise', 750, '>=', 1000, '<=', 750, 1000, '750-1000', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CL', 'CL', 'tres_mauvaise', 1000, '>', NULL, NULL, 1000, NULL, '>1000', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('SO4', 'SO4', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '100', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('SO4', 'SO4', 'bonne', 100, '>=', 200, '<=', 100, 200, '100-200', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('SO4', 'SO4', 'moyenne', 200, '>=', 250, '<=', 200, 250, '200-250', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('SO4', 'SO4', 'mauvaise', 250, '>=', 400, '<=', 250, 400, '250-400', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('SO4', 'SO4', 'tres_mauvaise', 400, '>', NULL, NULL, 400, NULL, '>400', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('MES', 'MES', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '50', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('MES', 'MES', 'bonne', 50, '>=', 200, '<=', 50, 200, '50-200', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('MES', 'MES', 'moyenne', 200, '>=', 1000, '<=', 200, 1000, '200-1000', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('MES', 'MES', 'mauvaise', 1000, '>=', 2000, '<=', 1000, 2000, '1000-2000', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('MES', 'MES', 'tres_mauvaise', 2000, '>', NULL, NULL, 2000, NULL, '>2000', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('O2_DISSOUS', 'O2_DISS', 'excellente', 7, '>', NULL, NULL, 7, NULL, '>7', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('O2_DISSOUS', 'O2_DISS', 'bonne', 7, '>=', 5, '<=', 7, 5, '7-5', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('O2_DISSOUS', 'O2_DISS', 'moyenne', 5, '>=', 3, '<=', 5, 3, '5-3', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('O2_DISSOUS', 'O2_DISS', 'mauvaise', 3, '>=', 1, '<=', 3, 1, '3-1', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('O2_DISSOUS', 'O2_DISS', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '1', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DBO5', 'DBO5', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '3', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DBO5', 'DBO5', 'bonne', 3, '>=', 5, '<=', 3, 5, '3-5', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DBO5', 'DBO5', 'moyenne', 5, '>=', 10, '<=', 5, 10, '5-10', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DBO5', 'DBO5', 'mauvaise', 10, '>=', 25, '<=', 10, 25, '10-25', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DBO5', 'DBO5', 'tres_mauvaise', 25, '>', NULL, NULL, 25, NULL, '>25', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DCO', 'DCO', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '30', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DCO', 'DCO', 'bonne', 30, '>=', 35, '<=', 30, 35, '30-35', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DCO', 'DCO', 'moyenne', 35, '>=', 40, '<=', 35, 40, '35-40', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DCO', 'DCO', 'mauvaise', 40, '>=', 80, '<=', 40, 80, '40-80', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DCO', 'DCO', 'tres_mauvaise', 80, '>', NULL, NULL, 80, NULL, '>80', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('OXYDABILITE_KMNO4', NULL, 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '2', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('OXYDABILITE_KMNO4', NULL, 'bonne', 2, '>=', 5, '<=', 2, 5, '2-5', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('OXYDABILITE_KMNO4', NULL, 'moyenne', 5, '>=', 10, '<=', 5, 10, '5-10', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('OXYDABILITE_KMNO4', NULL, 'mauvaise', 10, '>', NULL, NULL, 10, NULL, '>10', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('OXYDABILITE_KMNO4', NULL, 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('NO3', 'NO3-', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '10', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NO3', 'NO3-', 'bonne', 10, '>=', 25, '<=', 10, 25, '10-25', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NO3', 'NO3-', 'moyenne', 25, '>=', 50, '<=', 25, 50, '25-50', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NO3', 'NO3-', 'mauvaise', 50, '>', NULL, NULL, 50, NULL, '>50', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NO3', 'NO3-', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NTK', 'AZOTE_TOT_KJELD', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '1', 'mgN/l', 'mgN/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NTK', 'AZOTE_TOT_KJELD', 'bonne', 1, '>=', 2, '<=', 1, 2, '1-2', 'mgN/l', 'mgN/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NTK', 'AZOTE_TOT_KJELD', 'moyenne', 2, '>=', 3, '<=', 2, 3, '2-3', 'mgN/l', 'mgN/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NTK', 'AZOTE_TOT_KJELD', 'mauvaise', 3, '>', NULL, NULL, 3, NULL, '>3', 'mgN/l', 'mgN/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NTK', 'AZOTE_TOT_KJELD', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'mgN/l', 'mgN/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NH4', 'NH4', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,1', 'mgNH4/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NH4', 'NH4', 'bonne', 0.1, '>=', 0.5, '<=', 0.1, 0.5, '0,1-0,5', 'mgNH4/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NH4', 'NH4', 'moyenne', 0.5, '>=', 2, '<=', 0.5, 2, '0,5-2', 'mgNH4/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NH4', 'NH4', 'mauvaise', 2, '>=', 8, '<=', 2, 8, '2-8', 'mgNH4/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NH4', 'NH4', 'tres_mauvaise', 8, '>', NULL, NULL, 8, NULL, '>8', 'mgNH4/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('BARYUM', 'BA', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,1', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('BARYUM', 'BA', 'bonne', 0.1, '>=', 0.7, '<=', 0.1, 0.7, '0,1-0,7', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('BARYUM', 'BA', 'moyenne', 0.7, '>=', 1, '<=', 0.7, 1, '0,7-1', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('BARYUM', 'BA', 'mauvaise', 1, '>', NULL, NULL, 1, NULL, '>1', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('BARYUM', 'BA', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PO4', 'PO4_3-', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,2', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PO4', 'PO4_3-', 'bonne', 0.2, '>=', 0.5, '<=', 0.2, 0.5, '0,2-0,5', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PO4', 'PO4_3-', 'moyenne', 0.5, '>=', 1, '<=', 0.5, 1, '0,5-1', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PO4', 'PO4_3-', 'mauvaise', 1, '>=', 5, '<=', 1, 5, '1-5', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PO4', 'PO4_3-', 'tres_mauvaise', 5, '>', NULL, NULL, 5, NULL, '>5', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('P_TOTAL', 'PHOSPHORE_TOTAL', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,1', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('P_TOTAL', 'PHOSPHORE_TOTAL', 'bonne', 0.1, '>=', 0.3, '<=', 0.1, 0.3, '0,1-0,3', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('P_TOTAL', 'PHOSPHORE_TOTAL', 'moyenne', 0.3, '>=', 0.5, '<=', 0.3, 0.5, '0,3-0,5', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('P_TOTAL', 'PHOSPHORE_TOTAL', 'mauvaise', 0.5, '>=', 3, '<=', 0.5, 3, '0,5-3', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('P_TOTAL', 'PHOSPHORE_TOTAL', 'tres_mauvaise', 3, '>', NULL, NULL, 3, NULL, '>3', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('FE', 'FE', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,5', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('FE', 'FE', 'bonne', 0.5, '>=', 1, '<=', 0.5, 1, '0,5-1', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('FE', 'FE', 'moyenne', 1, '>=', 2, '<=', 1, 2, '1-2', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('FE', 'FE', 'mauvaise', 2, '>=', 5, '<=', 2, 5, '2-5', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('FE', 'FE', 'tres_mauvaise', 5, '>', NULL, NULL, 5, NULL, '>5', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CU', 'CU', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,02', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CU', 'CU', 'bonne', 0.02, '>=', 0.05, '<=', 0.02, 0.05, '0,02-0,05', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CU', 'CU', 'moyenne', 0.05, '>=', 1, '<=', 0.05, 1, '0,05-1', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CU', 'CU', 'mauvaise', 1, '>', NULL, NULL, 1, NULL, '>1', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CU', 'CU', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('ZN', 'ZN', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,5', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('ZN', 'ZN', 'bonne', 0.5, '>=', 1, '<=', 0.5, 1, '0,5-1', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('ZN', 'ZN', 'moyenne', 1, '>=', 5, '<=', 1, 5, '1-5', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('ZN', 'ZN', 'mauvaise', 5, '>', NULL, NULL, 5, NULL, '>5', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('ZN', 'ZN', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('MN', 'MN', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,1', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('MN', 'MN', 'bonne', 0.1, '>=', 0.5, '<=', 0.1, 0.5, '0,1-0,5', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('MN', 'MN', 'moyenne', 0.5, '>=', 1, '<=', 0.5, 1, '0,5-1', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('MN', 'MN', 'mauvaise', 1, '>', NULL, NULL, 1, NULL, '>1', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('MN', 'MN', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('FLUORURE_F', 'F-', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,7', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('FLUORURE_F', 'F-', 'bonne', 0.7, '>=', 1, '<=', 0.7, 1, '0,7-1', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('FLUORURE_F', 'F-', 'moyenne', 1, '>=', 1.7, '<=', 1, 1.7, '1-1,7', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('FLUORURE_F', 'F-', 'mauvaise', 1.7, '>', NULL, NULL, 1.7, NULL, '>1,7', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('FLUORURE_F', 'F-', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('HYDROCARBURES', NULL, 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,05', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('HYDROCARBURES', NULL, 'bonne', 0.05, '>=', 0.2, '<=', 0.05, 0.2, '0,05-0,2', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('HYDROCARBURES', NULL, 'moyenne', 0.2, '>=', 1, '<=', 0.2, 1, '0,2-1', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('HYDROCARBURES', NULL, 'mauvaise', 1, '>', NULL, NULL, 1, NULL, '>1', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('HYDROCARBURES', NULL, 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('PHENOLS', 'PHENOL', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,001', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PHENOLS', 'PHENOL', 'bonne', 0.001, '>=', 0.005, '<=', 0.001, 0.005, '0,001-0,005', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PHENOLS', 'PHENOL', 'moyenne', 0.005, '>=', 0.01, '<=', 0.005, 0.01, '0,005-0,01', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PHENOLS', 'PHENOL', 'mauvaise', 0.01, '>', NULL, NULL, 0.01, NULL, '>0,01', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PHENOLS', 'PHENOL', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DETERGENTS', 'DETERGENT', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,2', 'mg/l', 'mg/L', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DETERGENTS', 'DETERGENT', 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '0,2', 'mg/l', 'mg/L', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DETERGENTS', 'DETERGENT', 'moyenne', 0.2, '>=', 0.5, '<=', 0.2, 0.5, '0,2-0,5', 'mg/l', 'mg/L', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DETERGENTS', 'DETERGENT', 'mauvaise', 0.5, '>=', 5, '<=', 0.5, 5, '0,5-5', 'mg/l', 'mg/L', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('DETERGENTS', 'DETERGENT', 'tres_mauvaise', 5, '>', NULL, NULL, 5, NULL, '>5', 'mg/l', 'mg/L', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('AS', 'AS', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '10', 'µg/l', 'mg/L', 0.001, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('AS', 'AS', 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '10', 'µg/l', 'mg/L', 0.001, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('AS', 'AS', 'moyenne', 10, '>=', 50, '<=', 0.010, 0.050, '10-50', 'µg/l', 'mg/L', 0.001, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('AS', 'AS', 'mauvaise', 50, '>', NULL, NULL, 0.050, NULL, '>50', 'µg/l', 'mg/L', 0.001, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('AS', 'AS', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'µg/l', 'mg/L', 0.001, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CD', 'CD', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '3', 'µg/l', 'mg/L', 0.001, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CD', 'CD', 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '3', 'µg/l', 'mg/L', 0.001, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CD', 'CD', 'moyenne', 3, '>=', 5, '<=', 0.003, 0.005, '3-5', 'µg/l', 'mg/L', 0.001, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CD', 'CD', 'mauvaise', 5, '>', NULL, NULL, 0.005, NULL, '>5', 'µg/l', 'mg/L', 0.001, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CD', 'CD', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'µg/l', 'mg/L', 0.001, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CN', 'CN', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '10', 'µg/l', 'mg/L', 0.001, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CN', 'CN', 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '10', 'µg/l', 'mg/L', 0.001, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CN', 'CN', 'moyenne', 10, '>=', 50, '<=', 0.010, 0.050, '10-50', 'µg/l', 'mg/L', 0.001, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CN', 'CN', 'mauvaise', 50, '>', NULL, NULL, 0.050, NULL, '>50', 'µg/l', 'mg/L', 0.001, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CN', 'CN', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'µg/l', 'mg/L', 0.001, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CR', 'CRT', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '50', 'µg/l', 'mg/L', 0.001, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classe 3 identique visuellement aux classes 1 et 2', 'VALIDATED_DEV'),
    ('CR', 'CRT', 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '50', 'µg/l', 'mg/L', 0.001, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classe 3 identique visuellement aux classes 1 et 2', 'VALIDATED_DEV'),
    ('CR', 'CRT', 'moyenne', NULL, NULL, NULL, NULL, NULL, NULL, '50', 'µg/l', 'mg/L', 0.001, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classe 3 identique visuellement aux classes 1 et 2', 'VALIDATED_DEV'),
    ('CR', 'CRT', 'mauvaise', 50, '>', NULL, NULL, 0.050, NULL, '>50', 'µg/l', 'mg/L', 0.001, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classe 3 identique visuellement aux classes 1 et 2', 'VALIDATED_DEV'),
    ('CR', 'CRT', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'µg/l', 'mg/L', 0.001, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classe 3 identique visuellement aux classes 1 et 2', 'VALIDATED_DEV'),
    ('PB', 'PB', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '10', 'µg/l', 'mg/L', 0.001, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PB', 'PB', 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '10', 'µg/l', 'mg/L', 0.001, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PB', 'PB', 'moyenne', 10, '>=', 50, '<=', 0.010, 0.050, '10-50', 'µg/l', 'mg/L', 0.001, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PB', 'PB', 'mauvaise', 50, '>', NULL, NULL, 0.050, NULL, '>50', 'µg/l', 'mg/L', 0.001, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('PB', 'PB', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'µg/l', 'mg/L', 0.001, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('HG', 'HG', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '1', 'µg/l', 'mg/L', 0.001, 'HG_SPECIFIQUE_2026_05_19', 80, 100, 'faible', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, 'Classe non retenue pour Hg après arbitrage métier.', 'REJECTED'),
    ('HG', 'HG', 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '1', 'µg/l', 'mg/L', 0.001, 'HG_SPECIFIQUE_2026_05_19', 60, 80, 'faible', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, 'Classe non retenue pour Hg après arbitrage métier.', 'REJECTED'),
    ('HG', 'HG', 'moyenne', NULL, NULL, 1, '<', NULL, 0.001, '< 1', 'µg/l', 'mg/L', 0.001, 'HG_SPECIFIQUE_2026_05_19', 40, 60, 'faible', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Règle métier validée : Hg < 1 µg/l = moyenne.', 'VALIDATED_DEV'),
    ('HG', 'HG', 'mauvaise', 1, '>=', NULL, NULL, 0.001, NULL, '>= 1', 'µg/l', 'mg/L', 0.001, 'HG_SPECIFIQUE_2026_05_19', 20, 40, 'faible', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Règle métier validée : Hg >= 1 µg/l = mauvaise.', 'VALIDATED_DEV'),
    ('HG', 'HG', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'µg/l', 'mg/L', 0.001, 'HG_SPECIFIQUE_2026_05_19', 0, 20, 'faible', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, 'Classe non retenue pour Hg après arbitrage métier.', 'REJECTED'),
    ('NI', 'NI', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '20', 'µg/l', 'mg/L', 0.001, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NI', 'NI', 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '20', 'µg/l', 'mg/L', 0.001, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NI', 'NI', 'moyenne', 20, '>=', 50, '<=', 0.020, 0.050, '20-50', 'µg/l', 'mg/L', 0.001, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NI', 'NI', 'mauvaise', 50, '>', NULL, NULL, 0.050, NULL, '>50', 'µg/l', 'mg/L', 0.001, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('NI', 'NI', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'µg/l', 'mg/L', 0.001, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('SELENIUM_SE', 'SE', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '10', 'µg/l', 'mg/L', 0.001, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classe 3 visuellement identique aux classes 1 et 2', 'VALIDATED_DEV'),
    ('SELENIUM_SE', 'SE', 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '10', 'µg/l', 'mg/L', 0.001, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classe 3 visuellement identique aux classes 1 et 2', 'VALIDATED_DEV'),
    ('SELENIUM_SE', 'SE', 'moyenne', NULL, NULL, NULL, NULL, NULL, NULL, '10', 'µg/l', 'mg/L', 0.001, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classe 3 visuellement identique aux classes 1 et 2', 'VALIDATED_DEV'),
    ('SELENIUM_SE', 'SE', 'mauvaise', 10, '>', NULL, NULL, 0.010, NULL, '>10', 'µg/l', 'mg/L', 0.001, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classe 3 visuellement identique aux classes 1 et 2', 'VALIDATED_DEV'),
    ('SELENIUM_SE', 'SE', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'µg/l', 'mg/L', 0.001, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'classe 3 visuellement identique aux classes 1 et 2', 'VALIDATED_DEV'),
    ('PESTICIDES_PAR_SUBST', NULL, 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,1', 'µg/l', 'µg/l', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('PESTICIDES_PAR_SUBST', NULL, 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '0,1', 'µg/l', 'µg/l', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('PESTICIDES_PAR_SUBST', NULL, 'moyenne', NULL, NULL, NULL, NULL, NULL, NULL, '0,1', 'µg/l', 'µg/l', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('PESTICIDES_PAR_SUBST', NULL, 'mauvaise', 0.1, '>', NULL, NULL, 0.1, NULL, '>0,1', 'µg/l', 'µg/l', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('PESTICIDES_PAR_SUBST', NULL, 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'µg/l', 'µg/l', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('PESTICIDES_TOTAUX', NULL, 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,5', 'µg/l', 'µg/l', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('PESTICIDES_TOTAUX', NULL, 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '0,5', 'µg/l', 'µg/l', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('PESTICIDES_TOTAUX', NULL, 'moyenne', NULL, NULL, NULL, NULL, NULL, NULL, '0,5', 'µg/l', 'µg/l', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('PESTICIDES_TOTAUX', NULL, 'mauvaise', 0.5, '>', NULL, NULL, 0.5, NULL, '>0,5', 'µg/l', 'µg/l', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('PESTICIDES_TOTAUX', NULL, 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'µg/l', 'µg/l', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('H_P_A_TOTAUX', NULL, 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '0,2', 'µg/l', 'µg/l', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('H_P_A_TOTAUX', NULL, 'bonne', NULL, NULL, NULL, NULL, NULL, NULL, '0,2', 'µg/l', 'µg/l', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('H_P_A_TOTAUX', NULL, 'moyenne', NULL, NULL, NULL, NULL, NULL, NULL, '0,2', 'µg/l', 'µg/l', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('H_P_A_TOTAUX', NULL, 'mauvaise', 0.2, '>', NULL, NULL, 0.2, NULL, '>0,2', 'µg/l', 'µg/l', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('H_P_A_TOTAUX', NULL, 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', 'µg/l', 'µg/l', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', false, '', 'A_VALIDER'),
    ('CF', 'CF', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '20', '/100ml', 'UFC/100 mL', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CF', 'CF', 'bonne', 20, '>=', 2000, '<=', 20, 2000, '20-2000', '/100ml', 'UFC/100 mL', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CF', 'CF', 'moyenne', 2000, '>=', 20.000, '<=', 2000, 20.000, '2000-20.000', '/100ml', 'UFC/100 mL', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CF', 'CF', 'mauvaise', 20.000, '>', NULL, NULL, 20.000, NULL, '>20.000', '/100ml', 'UFC/100 mL', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CF', 'CF', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', '/100ml', 'UFC/100 mL', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CT', 'CT', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '50', '/100ml', 'UFC/100 mL', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CT', 'CT', 'bonne', 50, '>=', 5000, '<=', 50, 5000, '50-5000', '/100ml', 'UFC/100 mL', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CT', 'CT', 'moyenne', 5000, '>=', 50.000, '<=', 5000, 50.000, '5000-50.000', '/100ml', 'UFC/100 mL', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CT', 'CT', 'mauvaise', 50.000, '>', NULL, NULL, 50.000, NULL, '>50.000', '/100ml', 'UFC/100 mL', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CT', 'CT', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', '/100ml', 'UFC/100 mL', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('SF', 'SF', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '20', '/100ml', 'UFC/100 mL', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('SF', 'SF', 'bonne', 20, '>=', 1000, '<=', 20, 1000, '20-1000', '/100ml', 'UFC/100 mL', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('SF', 'SF', 'moyenne', 1000, '>=', 10.000, '<=', 1000, 10.000, '1000-10.000', '/100ml', 'UFC/100 mL', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('SF', 'SF', 'mauvaise', 10.000, '>', NULL, NULL, 10.000, NULL, '>10.000', '/100ml', 'UFC/100 mL', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('SF', 'SF', 'tres_mauvaise', NULL, NULL, NULL, NULL, NULL, NULL, '', '/100ml', 'UFC/100 mL', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CHL_A', 'CHLA', 'excellente', NULL, NULL, NULL, NULL, NULL, NULL, '2,5', 'µg/l', 'µg/l', NULL, NULL, 80, 100, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CHL_A', 'CHLA', 'bonne', 2.5, '>=', 10, '<=', 2.5, 10, '2,5-10', 'µg/l', 'µg/l', NULL, NULL, 60, 80, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CHL_A', 'CHLA', 'moyenne', 10, '>=', 30, '<=', 10, 30, '10-30', 'µg/l', 'µg/l', NULL, NULL, 40, 60, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CHL_A', 'CHLA', 'mauvaise', 30, '>=', 110, '<=', 30, 110, '30-110', 'µg/l', 'µg/l', NULL, NULL, 20, 40, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV'),
    ('CHL_A', 'CHLA', 'tres_mauvaise', 110, '>', NULL, NULL, 110, NULL, '>110', 'µg/l', 'µg/l', NULL, NULL, 0, 20, 'moyenne', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, '', 'VALIDATED_DEV')
)
INSERT INTO metadata.qualite_seuil_reglementaire (
    parametre_reglementaire_id, type_eau_id, classe_id, code_reglementaire, code_canonique_cible, code_classe,
    borne_min_source, operateur_min, borne_max_source, operateur_max,
    borne_min_moteur, borne_max_moteur, valeur_intervalle_originale,
    unite_reglementaire_source, unite_moteur, facteur_conversion_vers_unite_moteur,
    regle_specifique, indice_min, indice_max, confiance_extraction,
    source_document, version_reglementaire, actif, commentaire, validation_metier, validation_date, updated_at
)
SELECT
    pr.id,
    te.id,
    cl.id,
    sv.code_reglementaire,
    sv.code_canonique_cible,
    sv.code_classe,
    sv.borne_min_source,
    sv.operateur_min,
    sv.borne_max_source,
    sv.operateur_max,
    sv.borne_min_moteur,
    sv.borne_max_moteur,
    sv.valeur_intervalle_originale,
    sv.unite_reglementaire_source,
    sv.unite_moteur,
    sv.facteur_conversion_vers_unite_moteur,
    sv.regle_specifique,
    sv.indice_min,
    sv.indice_max,
    sv.confiance_extraction,
    sv.source_document,
    sv.version_reglementaire,
    sv.actif,
    sv.commentaire,
    sv.validation_metier,
    now(),
    now()
FROM seuil_values sv
JOIN metadata.qualite_parametre_reglementaire pr
  ON pr.code_reglementaire = sv.code_reglementaire
 AND pr.version_reglementaire = sv.version_reglementaire
JOIN metadata.qualite_type_eau te
  ON te.code_type_eau = 'surface_generale'
 AND te.version_reglementaire = sv.version_reglementaire
JOIN metadata.qualite_classe_reglementaire cl
  ON cl.code_classe = sv.code_classe
 AND cl.version_reglementaire = sv.version_reglementaire
ON CONFLICT (code_reglementaire, code_classe, version_reglementaire, valeur_intervalle_originale) DO UPDATE SET
    parametre_reglementaire_id = EXCLUDED.parametre_reglementaire_id,
    type_eau_id = EXCLUDED.type_eau_id,
    classe_id = EXCLUDED.classe_id,
    code_canonique_cible = EXCLUDED.code_canonique_cible,
    borne_min_source = EXCLUDED.borne_min_source,
    operateur_min = EXCLUDED.operateur_min,
    borne_max_source = EXCLUDED.borne_max_source,
    operateur_max = EXCLUDED.operateur_max,
    borne_min_moteur = EXCLUDED.borne_min_moteur,
    borne_max_moteur = EXCLUDED.borne_max_moteur,
    unite_reglementaire_source = EXCLUDED.unite_reglementaire_source,
    unite_moteur = EXCLUDED.unite_moteur,
    facteur_conversion_vers_unite_moteur = EXCLUDED.facteur_conversion_vers_unite_moteur,
    regle_specifique = EXCLUDED.regle_specifique,
    indice_min = EXCLUDED.indice_min,
    indice_max = EXCLUDED.indice_max,
    confiance_extraction = EXCLUDED.confiance_extraction,
    actif = EXCLUDED.actif,
    commentaire = EXCLUDED.commentaire,
    validation_metier = EXCLUDED.validation_metier,
    validation_date = now(),
    updated_at = now();

-- 7. Règles de classification
INSERT INTO metadata.qualite_regle_classification (
    code_regle, libelle_regle, type_regle, ordre_execution, description,
    source_document, version_reglementaire, actif, commentaire, validation_metier, validation_date, updated_at
)
VALUES
    ('CLASSIFICATION_INTERVALLE', 'Classification par intervalle', 'INTERVALLE', 10, 'Comparer la valeur moteur aux bornes actives du seuil réglementaire Tableau n°1.', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Règle DEV issue des décisions métier validées.', 'VALIDATED_DEV', now(), now()),
    ('UNITE_SOURCE_MOTEUR', 'Gestion unité source/moteur', 'UNITE', 20, 'Conserver unité réglementaire source et comparer en unité moteur validée.', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Règle DEV issue des décisions métier validées.', 'VALIDATED_DEV', now(), now()),
    ('GLOBAL_PLUS_PENALISANT', 'Qualité globale par paramètre le plus pénalisant', 'GLOBAL', 30, 'La classe globale correspond à la classe valide la plus défavorable parmi les paramètres classifiables.', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Règle DEV issue des décisions métier validées.', 'VALIDATED_DEV', now(), now()),
    ('NON_CLASSIFIABLE_HORS_CANONIQUE', 'Exclusion vrais absents canonique', 'NON_CLASSIFIABLE', 40, 'Un paramètre absent du canonique est stockable/visible mais exclu du moteur.', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Règle DEV issue des décisions métier validées.', 'VALIDATED_DEV', now(), now()),
    ('HG_SPECIFIQUE_2026_05_19', 'Règle spécifique Mercure', 'REGLE_SPECIFIQUE', 50, 'Mercure : < 1 µg/l = moyenne ; >= 1 µg/l = mauvaise ; autres classes inactives.', 'Système d''evaluation de la Qualité des ressources en eau.pdf', 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19', true, 'Règle DEV issue des décisions métier validées.', 'VALIDATED_DEV', now(), now())
ON CONFLICT (code_regle, version_reglementaire) DO UPDATE SET
    libelle_regle = EXCLUDED.libelle_regle,
    type_regle = EXCLUDED.type_regle,
    ordre_execution = EXCLUDED.ordre_execution,
    description = EXCLUDED.description,
    actif = EXCLUDED.actif,
    commentaire = EXCLUDED.commentaire,
    validation_metier = EXCLUDED.validation_metier,
    validation_date = EXCLUDED.validation_date,
    updated_at = now();

-- 8. SELECT de contrôle
SELECT 'sources' AS controle, count(*) AS total FROM metadata.qualite_source_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
SELECT 'types_eau' AS controle, count(*) AS total FROM metadata.qualite_type_eau WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
SELECT 'classes' AS controle, count(*) AS total FROM metadata.qualite_classe_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
SELECT 'parametres_total' AS controle, count(*) AS total FROM metadata.qualite_parametre_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
SELECT 'parametres_classifiables' AS controle, count(*) AS total FROM metadata.qualite_parametre_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19' AND classifiable IS true;
SELECT 'mappings_valides_actifs' AS controle, count(*) AS total FROM metadata.qualite_mapping_canonique_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19' AND actif IS true AND parametre_canonique_id IS NOT NULL;
SELECT 'seuils_total' AS controle, count(*) AS total FROM metadata.qualite_seuil_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
SELECT 'seuils_actifs_moteur' AS controle, count(*) AS total FROM metadata.qualite_seuil_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19' AND actif IS true;
SELECT 'regles' AS controle, count(*) AS total FROM metadata.qualite_regle_classification WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';

SELECT pr.code_reglementaire, pr.parametre_pdf, pr.statut_operationnel
FROM metadata.qualite_parametre_reglementaire pr
LEFT JOIN metadata.qualite_mapping_canonique_reglementaire mp
  ON mp.parametre_reglementaire_id = pr.id
WHERE pr.version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19'
  AND pr.classifiable IS true
  AND (mp.id IS NULL OR mp.parametre_canonique_id IS NULL OR mp.actif IS false)
ORDER BY pr.code_reglementaire;

SELECT s.code_reglementaire, s.code_classe, s.valeur_intervalle_originale
FROM metadata.qualite_seuil_reglementaire s
LEFT JOIN metadata.qualite_parametre_reglementaire pr ON pr.id = s.parametre_reglementaire_id
WHERE s.version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19'
  AND pr.id IS NULL;

SELECT 'fk_invalides_mapping_parametre' AS controle, count(*) AS total
FROM metadata.qualite_mapping_canonique_reglementaire mp
LEFT JOIN metadata.qualite_parametre_reglementaire pr ON pr.id = mp.parametre_reglementaire_id
WHERE mp.version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19' AND pr.id IS NULL;

SELECT 'fk_invalides_seuils' AS controle, count(*) AS total
FROM metadata.qualite_seuil_reglementaire s
LEFT JOIN metadata.qualite_parametre_reglementaire pr ON pr.id = s.parametre_reglementaire_id
LEFT JOIN metadata.qualite_type_eau te ON te.id = s.type_eau_id
LEFT JOIN metadata.qualite_classe_reglementaire cl ON cl.id = s.classe_id
WHERE s.version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19'
  AND (pr.id IS NULL OR te.id IS NULL OR cl.id IS NULL);

SELECT 'couverture_41_parametres' AS controle, count(*) AS total
FROM metadata.qualite_parametre_reglementaire
WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';

SELECT 'couverture_205_seuils' AS controle, count(*) AS total
FROM metadata.qualite_seuil_reglementaire
WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';

COMMIT;
