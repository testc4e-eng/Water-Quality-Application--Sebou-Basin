# Requêtes SQL READ-ONLY exécutées ou recommandées

Ces requêtes sont les scripts d'audit (dry-run) qui permettront l'exécution de la Phase A du plan de fusion.

-- Structure colonnes
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'qualite' AND table_name = 'mesure_qualite_sebou';
```

-- Volumétrie de base
```sql
SELECT count(*) as total_lignes, count(distinct ire_station) as total_ire, count(distinct parametre_qualite) as total_params 
FROM qualite.mesure_qualite_riviere;
```

-- Dates min/max
```sql
SELECT min(temps) as date_min, max(temps) as date_max FROM qualite.mesure_qualite_riviere;
```

-- Doublons exacts (Hachage sur attributs clés)
```sql
SELECT ire_station, temps, parametre_qualite, valeur, count(*)
FROM qualite.mesure_qualite_riviere
GROUP BY ire_station, temps, parametre_qualite, valeur
HAVING count(*) > 1;
```

-- Conflits valeurs (Même station, même date, même param, valeur différente)
```sql
SELECT ire_station, temps, parametre_qualite, count(distinct valeur)
FROM qualite.mesure_qualite_riviere
GROUP BY ire_station, temps, parametre_qualite
HAVING count(distinct valeur) > 1;
```

-- Recouvrement `mesure_qualite_sebou` vs `mesure_qualite_riviere` (Doublons métier)
```sql
SELECT s.ire_station, s.temps, s.parametre_qualite, s.valeur as val_sebou, r.valeur as val_riviere
FROM qualite.mesure_qualite_sebou s
JOIN qualite.mesure_qualite_riviere r 
  ON s.ire_station = r.ire_station AND s.temps = r.temps AND trim(s.parametre_qualite) = trim(r.parametre_qualite);
```

-- Dépendances vues API
```sql
SELECT * FROM information_schema.views 
WHERE view_definition ILIKE '%mesure_qualite_riviere%';
```
