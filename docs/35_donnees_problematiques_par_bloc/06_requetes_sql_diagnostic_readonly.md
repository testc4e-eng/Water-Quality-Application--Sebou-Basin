# Requêtes SQL diagnostic read-only

```sql
-- Bloc : Paramètres
-- Objectif : lister les paramètres distincts par table qualité
-- Table : qualite.mesure_qualite_*
-- Risque métier : variantes non repérées, doublons conceptuels
-- Requête read-only :
SELECT 'riviere' AS table_source, parametre_qualite, COUNT(*)
FROM qualite.mesure_qualite_riviere
GROUP BY 1, 2
UNION ALL
SELECT 'nappe', parametre_qualite, COUNT(*)
FROM qualite.mesure_qualite_nappe
GROUP BY 1, 2
UNION ALL
SELECT 'barrage', parametre_qualite, COUNT(*)
FROM qualite.mesure_qualite_barrage
GROUP BY 1, 2
UNION ALL
SELECT 'sebou', parametre_qualite, COUNT(*)
FROM qualite.mesure_qualite_sebou
GROUP BY 1, 2
ORDER BY 2, 1;
```

```sql
-- Bloc : Paramètres
-- Objectif : compter les paramètres par fréquence sur l'ensemble qualité
-- Table : qualite.*
-- Risque métier : faux poids relatif des paramètres
-- Requête read-only :
WITH p AS (
  SELECT parametre_qualite FROM qualite.mesure_qualite_riviere
  UNION ALL
  SELECT parametre_qualite FROM qualite.mesure_qualite_nappe
  UNION ALL
  SELECT parametre_qualite FROM qualite.mesure_qualite_barrage
  UNION ALL
  SELECT parametre_qualite FROM qualite.mesure_qualite_sebou
  UNION ALL
  SELECT parametre_qualite FROM qualite.suivi_qualite_barrage_garde_hebdo
)
SELECT parametre_qualite, COUNT(*) AS volume
FROM p
GROUP BY 1
ORDER BY volume DESC;
```

```sql
-- Bloc : Paramètres
-- Objectif : détecter les variantes proches dans le mapping
-- Table : metadata.mapping_parametre_source
-- Risque métier : plusieurs variantes pour un même paramètre officiel
-- Requête read-only :
SELECT source_value, COUNT(*) AS nb_mappings
FROM metadata.mapping_parametre_source
WHERE source_value ILIKE 'conductiv%'
   OR source_value IN ('H_G','sat','NO3-','T_eau','PTD','PTP','F_M_mes')
GROUP BY 1
ORDER BY 1;
```

```sql
-- Bloc : Paramètres
-- Objectif : lister les unités par paramètre dans le référentiel
-- Table : metadata.referentiel_parametre
-- Risque métier : unité absente ou incohérente
-- Requête read-only :
SELECT code_canonique, libelle, COALESCE(unite, '[unite absente]') AS unite
FROM metadata.referentiel_parametre
ORDER BY code_canonique;
```

```sql
-- Bloc : Données
-- Objectif : détecter les valeurs NULL dans les tables qualité et météo
-- Table : qualite.*, meteo.*
-- Risque métier : données présentes mais non exploitables
-- Requête read-only :
SELECT 'qualite_barrage' AS domaine, COUNT(*) AS nb_null
FROM qualite.mesure_qualite_barrage
WHERE valeur IS NULL
UNION ALL
SELECT 'qualite_sebou', COUNT(*)
FROM qualite.mesure_qualite_sebou
WHERE valeur IS NULL
UNION ALL
SELECT 'garde_hebdo', COUNT(*)
FROM qualite.suivi_qualite_barrage_garde_hebdo
WHERE valeur IS NULL
UNION ALL
SELECT 'meteo_evaporation', COUNT(*)
FROM meteo.mesure_evaporation
WHERE valeur IS NULL
UNION ALL
SELECT 'meteo_precipitation_observee', COUNT(*)
FROM meteo.mesure_precipitation
WHERE val_observees IS NULL;
```

```sql
-- Bloc : Données
-- Objectif : détecter les valeurs négatives
-- Table : hydro.mesure_debit, qualite.*
-- Risque métier : valeurs impossibles ou codes historiques non clarifiés
-- Requête read-only :
SELECT 'hydro_debit' AS domaine, COUNT(*) AS nb_negatifs, MIN(valeur) AS min_valeur
FROM hydro.mesure_debit
WHERE valeur < 0
UNION ALL
SELECT 'qualite_riviere', COUNT(*), MIN(valeur)
FROM qualite.mesure_qualite_riviere
WHERE valeur < 0;
```

```sql
-- Bloc : Données
-- Objectif : détecter min/max par paramètre
-- Table : qualite.*
-- Risque métier : valeurs extrêmes non qualifiées
-- Requête read-only :
WITH q AS (
  SELECT 'riviere' AS domaine, parametre_qualite, valeur
  FROM qualite.mesure_qualite_riviere
  WHERE valeur IS NOT NULL
  UNION ALL
  SELECT 'nappe', parametre_qualite, valeur
  FROM qualite.mesure_qualite_nappe
  WHERE valeur IS NOT NULL
  UNION ALL
  SELECT 'barrage', parametre_qualite, valeur
  FROM qualite.mesure_qualite_barrage
  WHERE valeur IS NOT NULL
  UNION ALL
  SELECT 'sebou', parametre_qualite, valeur
  FROM qualite.mesure_qualite_sebou
  WHERE valeur IS NOT NULL
)
SELECT domaine, parametre_qualite, MIN(valeur) AS min_valeur, MAX(valeur) AS max_valeur, AVG(valeur) AS moyenne
FROM q
GROUP BY 1, 2
ORDER BY parametre_qualite, domaine;
```

```sql
-- Bloc : Référentiels
-- Objectif : détecter les stations doublons
-- Table : infra.stations_mesure
-- Risque métier : homonymes non distingués
-- Requête read-only :
SELECT LOWER(TRIM(nom)) AS nom_normalise, COUNT(*) AS nb_occurrences,
       STRING_AGG(COALESCE(code_station, '[code absent]'), ', ' ORDER BY code_station) AS codes
FROM infra.stations_mesure
WHERE nom IS NOT NULL AND TRIM(nom) <> ''
GROUP BY 1
HAVING COUNT(*) > 1
ORDER BY nb_occurrences DESC, nom_normalise;
```

```sql
-- Bloc : Référentiels
-- Objectif : détecter les barrages doublons
-- Table : infra.barrages
-- Risque métier : barrage homonyme ou doublonné
-- Requête read-only :
SELECT LOWER(TRIM(nom_barrage)) AS nom_normalise, COUNT(*) AS nb_occurrences,
       STRING_AGG(COALESCE(ire, '[ire absent]'), ', ' ORDER BY ire) AS ires
FROM infra.barrages
WHERE nom_barrage IS NOT NULL AND TRIM(nom_barrage) <> ''
GROUP BY 1
HAVING COUNT(*) > 1
ORDER BY nb_occurrences DESC, nom_normalise;
```

```sql
-- Bloc : Référentiels
-- Objectif : rechercher Garde Sebou
-- Table : infra.stations_mesure, infra.barrages
-- Risque métier : mauvaise référence officielle
-- Requête read-only :
SELECT 'station' AS type_entite, COALESCE(code_station, '[code absent]') AS code, nom
FROM infra.stations_mesure
WHERE LOWER(COALESCE(nom, '')) LIKE '%garde%'
   OR LOWER(COALESCE(nom, '')) LIKE '%sebou%'
UNION ALL
SELECT 'barrage', COALESCE(ire, '[ire absent]'), nom_barrage
FROM infra.barrages
WHERE LOWER(COALESCE(nom_barrage, '')) LIKE '%garde%'
   OR LOWER(COALESCE(nom_barrage, '')) LIKE '%sebou%';
```

```sql
-- Bloc : Référentiels
-- Objectif : rechercher Bouhouda
-- Table : infra.barrages
-- Risque métier : doublon barrage critique
-- Requête read-only :
SELECT COALESCE(ire, '[ire absent]') AS ire, nom_barrage
FROM infra.barrages
WHERE LOWER(COALESCE(nom_barrage, '')) LIKE '%bouhouda%';
```

```sql
-- Bloc : Pollution
-- Objectif : lister les rejets et inventaires pollution existants
-- Table : information_schema.tables
-- Risque métier : fragmentation des ensembles pollution
-- Requête read-only :
SELECT table_schema, table_name
FROM information_schema.tables
WHERE LOWER(table_name) LIKE '%rejet%'
   OR LOWER(table_name) LIKE '%pollution%'
   OR LOWER(table_name) LIKE '%invent%'
ORDER BY table_schema, table_name;
```

```sql
-- Bloc : Pollution
-- Objectif : lister les prélèvements sans source
-- Table : qualite.source_pollution_prelevement, qualite.source_pollution_prelevement_lien
-- Risque métier : impossibilité de consolider la pollution par source
-- Requête read-only :
SELECT p.point_prelevement, p.nature, p.commune, p.date_prelevement
FROM qualite.source_pollution_prelevement p
LEFT JOIN qualite.source_pollution_prelevement_lien l
  ON l.prelevement_id = p.id
WHERE l.prelevement_id IS NULL
ORDER BY p.date_prelevement DESC, p.point_prelevement;
```

```sql
-- Bloc : Pollution
-- Objectif : lister les types de rattachement déjà présents
-- Table : qualite.source_pollution_prelevement_lien
-- Risque métier : confusion entre source, inventaire et point de contrôle
-- Requête read-only :
SELECT entite_type, COUNT(*) AS volume
FROM qualite.source_pollution_prelevement_lien
GROUP BY 1
ORDER BY volume DESC;
```

```sql
-- Bloc : Pollution
-- Objectif : vérifier l'existence de tables IDP
-- Table : information_schema.tables
-- Risque métier : décalage entre documentation IDP et tables réellement présentes
-- Requête read-only :
SELECT table_schema, table_name
FROM information_schema.tables
WHERE LOWER(table_name) LIKE '%idp%'
ORDER BY table_schema, table_name;
```

```sql
-- Bloc : Données
-- Objectif : vérifier la température
-- Table : meteo.mesure_temperature
-- Risque métier : manque de données non distingué d'une anomalie
-- Requête read-only :
SELECT COUNT(*) AS nb_lignes_temperature
FROM meteo.mesure_temperature;
```

```sql
-- Bloc : Données
-- Objectif : compter la météo NULL
-- Table : meteo.mesure_precipitation, meteo.mesure_evaporation
-- Risque métier : séries partielles non signalées
-- Requête read-only :
SELECT 'evaporation_null' AS type, COUNT(*) AS volume
FROM meteo.mesure_evaporation
WHERE valeur IS NULL
UNION ALL
SELECT 'precipitation_observee_null_avec_alternative', COUNT(*)
FROM meteo.mesure_precipitation
WHERE val_observees IS NULL
  AND COALESCE(val_power_nasa, val_remplies) IS NOT NULL;
```

```sql
-- Bloc : Données
-- Objectif : compter l'hydrologie négative
-- Table : hydro.mesure_debit
-- Risque métier : séries hydro potentiellement non interprétables
-- Requête read-only :
SELECT COUNT(*) AS nb_debits_negatifs
FROM hydro.mesure_debit
WHERE valeur < 0;
```
