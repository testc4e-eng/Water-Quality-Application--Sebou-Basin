DELETE FROM data_admin.field_registry
WHERE (class_code = 'INFRA_STATION' AND field_name = 'geom')
   OR (class_code = 'POLLUTION_SITE' AND field_name = 'geom_4326');

INSERT INTO data_admin.field_registry (
    class_code,
    field_name,
    field_label,
    data_type,
    required,
    editable,
    ingestable,
    validation_rule,
    reference_source,
    display_order,
    example_value,
    unit_expected,
    allowed_values_source,
    description
)
VALUES
-- HYDRO_DEBIT
('HYDRO_DEBIT', 'station_id', 'Identifiant station', 'uuid', true, true, true, 'UUID existant dans infra.stations_mesure.id.', 'infra.stations_mesure.id', 1, '1b62f3e9-91a7-4c4a-9385-d3aa78eae978', NULL, NULL, 'Reference vers la station de mesure de debit.'),
('HYDRO_DEBIT', 'temps', 'Horodatage de mesure', 'timestamp with time zone', true, true, true, 'Timestamp ISO 8601 obligatoire.', NULL, 2, '2026-06-01T00:00:00Z', NULL, NULL, 'Date et heure de mesure du debit.'),
('HYDRO_DEBIT', 'valeur', 'Debit mesure', 'double precision', true, true, true, 'Valeur numerique >= 0.', NULL, 3, '12.75', 'm3/s', NULL, 'Debit observe en metre cube par seconde.'),
('HYDRO_DEBIT', 'est_valide', 'Statut de validation', 'boolean', false, true, true, 'Booleen true/false.', NULL, 4, 'true', NULL, 'true | false', 'Indique si la mesure est consideree valide.'),

-- METEO_PRECIPITATION
('METEO_PRECIPITATION', 'station_id', 'Identifiant station', 'uuid', true, true, true, 'UUID existant dans infra.stations_mesure.id.', 'infra.stations_mesure.id', 1, 'bc8e6d83-08d3-4bfa-8c78-daa754af79b7', NULL, NULL, 'Reference vers la station meteorologique.'),
('METEO_PRECIPITATION', 'temps', 'Horodatage de mesure', 'timestamp with time zone', true, true, true, 'Timestamp ISO 8601 obligatoire.', NULL, 2, '2026-06-01T00:00:00Z', NULL, NULL, 'Date et heure de la mesure de precipitation.'),
('METEO_PRECIPITATION', 'val_observees', 'Precipitation observee', 'double precision', true, true, true, 'Valeur numerique >= 0.', NULL, 3, '4.2', 'mm', NULL, 'Valeur de precipitation observee.'),
('METEO_PRECIPITATION', 'pas_temps', 'Pas de temps', 'character varying', false, true, true, 'Valeur attendue: daily.', NULL, 4, 'daily', NULL, 'daily', 'Resolution temporelle attendue pour le lot.'),
('METEO_PRECIPITATION', 'ire_precipitation', 'Code IRE precipitation', 'text', false, true, true, 'Texte libre aligne avec le code source.', NULL, 5, '1000/23', NULL, NULL, 'Code historique de station precipitation.'),

-- QUALITE_RIVIERE
('QUALITE_RIVIERE', 'station_id', 'Identifiant station', 'uuid', false, true, true, 'UUID existant dans infra.stations_mesure.id ; station_id ou ire_station requis.', 'infra.stations_mesure.id', 1, '79aa3ca5-175b-436f-a9a9-34c5f4bd3fbc', NULL, NULL, 'Reference vers la station de qualite.'),
('QUALITE_RIVIERE', 'ire_station', 'Code IRE station', 'text', false, true, true, 'Code station existant dans infra.stations_mesure.code_station.', 'infra.stations_mesure.code_station', 2, '2817/15', NULL, NULL, 'Code metier station utilise dans les campagnes qualite.'),
('QUALITE_RIVIERE', 'temps', 'Horodatage de mesure', 'timestamp with time zone', true, true, true, 'Timestamp ISO 8601 obligatoire.', NULL, 3, '2026-06-01T10:30:00Z', NULL, NULL, 'Date et heure du prelevement ou de la mesure.'),
('QUALITE_RIVIERE', 'parametre_qualite', 'Code parametre qualite', 'text', true, true, true, 'Code canonique actif obligatoire.', 'metadata.referentiel_parametre_canonique', 4, 'NH4', NULL, 'Codes qualite actifs du referentiel canonique', 'Code du parametre qualite selon le referentiel canonique.'),
('QUALITE_RIVIERE', 'valeur', 'Valeur mesuree', 'double precision', true, true, true, 'Valeur numerique ; unite depend du parametre.', NULL, 5, '15.5', NULL, NULL, 'Valeur observee pour le parametre qualite.'),

-- POLLUTION_SITE
('POLLUTION_SITE', 'site_code', 'Code site pollution', 'text', true, true, true, 'Code site unique et non vide.', NULL, 1, 'ARB-DECH', NULL, NULL, 'Code metier unique du site pollution.'),
('POLLUTION_SITE', 'site_name', 'Nom site pollution', 'text', true, true, true, 'Texte metier non vide.', NULL, 2, 'Decharge Khemisset', NULL, NULL, 'Nom principal du site pollution.'),
('POLLUTION_SITE', 'commune', 'Commune', 'text', false, true, true, 'Texte libre.', NULL, 3, 'Ait Ouribel', NULL, NULL, 'Commune de rattachement du site.'),
('POLLUTION_SITE', 'province', 'Province', 'text', false, true, true, 'Texte libre.', NULL, 4, 'Khemisset', NULL, NULL, 'Province de rattachement du site.'),
('POLLUTION_SITE', 'bassin', 'Bassin', 'text', false, true, true, 'Texte libre ou code bassin metier.', NULL, 5, 'Sebou', NULL, NULL, 'Bassin hydrographique de rattachement du site.'),
('POLLUTION_SITE', 'validation_status', 'Statut de validation', 'text', false, true, true, 'Valeur dans VALIDATED / TO_VALIDATE / REJECTED.', NULL, 6, 'VALIDATED', NULL, 'VALIDATED | TO_VALIDATE | REJECTED', 'Statut metier du site dans le workflow de validation.'),
('POLLUTION_SITE', 'geom_wkt', 'Geometrie WKT', 'text', true, true, true, 'WKT geometrique valide avec SRID explicite.', NULL, 7, 'POINT(-6.05529 32.87652)', NULL, NULL, 'Geometrie source du site, en WKT.'),
('POLLUTION_SITE', 'srid', 'SRID geometrique', 'integer', true, true, true, 'Valeur autorisee: 4326 ou 26191.', NULL, 8, '4326', NULL, '4326 | 26191', 'SRID declare de la geometrie source.'),

-- INFRA_STATION
('INFRA_STATION', 'code_station', 'Code station', 'character varying', true, true, true, 'Code station unique et non vide.', NULL, 1, '1586/600', NULL, NULL, 'Code metier unique de la station.'),
('INFRA_STATION', 'nom', 'Nom station', 'character varying', true, true, true, 'Texte metier non vide.', NULL, 2, 'Bab Taza', NULL, NULL, 'Nom metier de la station de mesure.'),
('INFRA_STATION', 'type_station', 'Type station', 'character varying', true, true, true, 'Type de station conforme au vocabulaire metier.', NULL, 3, 'pluviometrique', NULL, 'pluviometrique | hydrometrique | qualite', 'Categorie metier de la station.'),
('INFRA_STATION', 'altitude_m', 'Altitude', 'numeric', false, true, true, 'Valeur numerique en metres.', NULL, 4, '902.00', 'm', NULL, 'Altitude de la station.'),
('INFRA_STATION', 'date_mise_service', 'Date mise en service', 'date', false, true, true, 'Format ISO YYYY-MM-DD.', NULL, 5, '2026-01-15', NULL, NULL, 'Date de mise en service de la station.'),
('INFRA_STATION', 'geom_wkt', 'Geometrie WKT', 'text', true, true, true, 'WKT geometrique valide avec SRID explicite.', NULL, 6, 'POINT(-5.20372 35.05764)', NULL, NULL, 'Geometrie source de la station, en WKT.'),
('INFRA_STATION', 'srid', 'SRID geometrique', 'integer', true, true, true, 'Valeur autorisee: 4326 ou 26191.', NULL, 7, '4326', NULL, '4326 | 26191', 'SRID declare de la geometrie source.'),

-- INFRA_BARRAGE
('INFRA_BARRAGE', 'nom_barrage', 'Nom barrage', 'text', true, true, true, 'Texte metier non vide.', NULL, 1, 'Barrage Idriss Ier', NULL, NULL, 'Nom officiel du barrage.'),
('INFRA_BARRAGE', 'nom_oued', 'Nom oued', 'text', false, true, true, 'Texte libre.', NULL, 2, 'Sebou', NULL, NULL, 'Oued associe au barrage.'),
('INFRA_BARRAGE', 'type_barrage', 'Type barrage', 'text', false, true, true, 'Texte metier aligne au referentiel barrage.', NULL, 3, 'poids', NULL, NULL, 'Type structurel du barrage.'),
('INFRA_BARRAGE', 'vrn_hm3', 'Volume retenue normale', 'numeric', false, true, true, 'Valeur numerique >= 0.', NULL, 4, '1129.0', 'hm3', NULL, 'Volume de retenue normale.'),

-- QUALITE_NAPPE
('QUALITE_NAPPE', 'station_id', 'Identifiant station', 'uuid', true, true, true, 'UUID existant dans infra.stations_mesure.', 'infra.stations_mesure.station_id', 1, '79aa3ca5-175b-436f-a9a9-34c5f4bd3fbc', NULL, NULL, 'Reference vers la station ou ouvrage nappe.'),
('QUALITE_NAPPE', 'temps', 'Horodatage de mesure', 'timestamp with time zone', true, true, true, 'Timestamp ISO 8601 obligatoire.', NULL, 2, '2026-06-01T10:30:00Z', NULL, NULL, 'Date et heure de la mesure nappe.'),
('QUALITE_NAPPE', 'parametre_qualite', 'Code parametre qualite', 'text', true, true, true, 'Code canonique actif obligatoire.', 'metadata.referentiel_parametre_canonique', 3, 'NO3', NULL, 'Codes qualite actifs du referentiel canonique', 'Code du parametre qualite nappe.'),
('QUALITE_NAPPE', 'valeur', 'Valeur mesuree', 'double precision', true, true, true, 'Valeur numerique ; unite depend du parametre.', NULL, 4, '8.3', NULL, NULL, 'Valeur mesuree sur eau souterraine.'),

-- QUALITE_BARRAGE
('QUALITE_BARRAGE', 'station_id', 'Identifiant station', 'uuid', true, true, true, 'UUID existant dans infra.stations_mesure.', 'infra.stations_mesure.station_id', 1, '79aa3ca5-175b-436f-a9a9-34c5f4bd3fbc', NULL, NULL, 'Reference vers la station barrage.'),
('QUALITE_BARRAGE', 'temps', 'Horodatage de mesure', 'timestamp with time zone', true, true, true, 'Timestamp ISO 8601 obligatoire.', NULL, 2, '2026-06-01T10:30:00Z', NULL, NULL, 'Date et heure de la mesure barrage.'),
('QUALITE_BARRAGE', 'parametre_qualite', 'Code parametre qualite', 'text', true, true, true, 'Code canonique actif obligatoire.', 'metadata.referentiel_parametre_canonique', 3, 'O2_DISS', NULL, 'Codes qualite actifs du referentiel canonique', 'Code du parametre qualite barrage.'),
('QUALITE_BARRAGE', 'valeur', 'Valeur mesuree', 'double precision', true, true, true, 'Valeur numerique ; unite depend du parametre.', NULL, 4, '7.1', NULL, NULL, 'Valeur mesuree sur barrage.')
ON CONFLICT (class_code, field_name) DO UPDATE
SET
    field_label = EXCLUDED.field_label,
    data_type = EXCLUDED.data_type,
    required = EXCLUDED.required,
    editable = EXCLUDED.editable,
    ingestable = EXCLUDED.ingestable,
    validation_rule = EXCLUDED.validation_rule,
    reference_source = EXCLUDED.reference_source,
    display_order = EXCLUDED.display_order,
    example_value = EXCLUDED.example_value,
    unit_expected = EXCLUDED.unit_expected,
    allowed_values_source = EXCLUDED.allowed_values_source,
    description = EXCLUDED.description,
    updated_at = now();
