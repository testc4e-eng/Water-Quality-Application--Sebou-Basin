# Requêtes SQL READ-ONLY exécutées

Toutes les requêtes exécutées l'ont été avec des clauses de sélection strictes (`SELECT`).

-- Objectif : Lister les tables de qualité
-- Résultat attendu : Inventaire des tables
```sql
SELECT table_schema, table_name, table_type
FROM information_schema.tables
WHERE table_schema IN ('qualite', 'staging', 'metadata', 'api', 'infra')
ORDER BY table_schema, table_name;
```

-- Objectif : Analyser la volumétrie des mesures rivière
-- Table : qualite.mesure_qualite_riviere
-- Résultat attendu : Nombre de lignes, d'IRE uniques, de paramètres et période couverte
```sql
SELECT COUNT(*) as c, COUNT(DISTINCT ire_station) as si, COUNT(DISTINCT parametre_qualite) as sp, 
       MIN(temps) as dmin, MAX(temps) as dmax, SUM(CASE WHEN valeur IS NULL THEN 1 ELSE 0 END) as vnull 
FROM qualite.mesure_qualite_riviere;
```

-- Objectif : Analyser la volumétrie des mesures sebou (sentinelles)
-- Table : qualite.mesure_qualite_sebou
-- Résultat attendu : Focus sur les stations sentinelles
```sql
SELECT COUNT(*) as c, COUNT(DISTINCT ire_station) as si, COUNT(DISTINCT parametre_qualite) as sp, 
       MIN(temps) as dmin, MAX(temps) as dmax, SUM(CASE WHEN valeur IS NULL THEN 1 ELSE 0 END) as vnull 
FROM qualite.mesure_qualite_sebou;
```

-- Objectif : Vérifier la présence d'une sentinelle dans les tables
-- Résultat attendu : Audit par IRE (ex: 3695/8)
```sql
SELECT COUNT(*) as c, MIN(temps) as dmin, MAX(temps) as dmax 
FROM qualite.mesure_qualite_sebou 
WHERE ire_station = '3695/8';

SELECT DISTINCT parametre_qualite 
FROM qualite.mesure_qualite_sebou 
WHERE ire_station = '3695/8';
```
