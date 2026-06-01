# LOT 4A-4 : Audit A/B (IDP et Pollutions Ponctuelles)

## NIVEAU 1 — Vue globale

### 1.1 Volumétrie Production (`abh_sad`)
- `qualite.source_pollution_prelevement` : **141**
- `qualite.source_pollution_mesure_param` : **7191**
- `infra.rejet_domestique` : **362**
- `infra.rejet_industriel` : **11**
- `infra.rejet_abattoir` : **61**

### 1.2 Volumétrie Source (`abh_sebou_070426`)
- `public.mesures_idp_2024_qualite_globale` : **4894**
- `public.mesures_idp_2024_qualite_marche_cadre` : **3614**
- `public.mesures_idp_2024_src_pollution_globale` : **243**
- `public.mesures_idp_2024_src_pollution_marche_cadre` : **148**
- `public.inv_rejets_abattoirs_abhs` : **61**
- `public.inv_rejets_domestiques_abhs` : **362**
- `public.inv_rejets_ind_abhs` : **11**

## NIVEAU 2 — Table par table

### Table : `mesures_idp_2024_qualite_globale`
- **Volume** : 4894 lignes
- **Colonnes Clés suspectées** : ID=`id_pts`, Date=`2024-09-12 au 2025-12-14`
- **Paramètres Distingables** (57) : `['Fe2+', 'TAC_meq/l', 'NTK', 'Fe', 'Se', 'As', 'Sn', 'Pb', 'CF', 'K+']...`
- **Taux NULL** : 0 (soit 0.0%)
- **Valeurs Négatives** : 0

### Table : `mesures_idp_2024_qualite_marche_cadre`
- **Volume** : 3614 lignes
- **Colonnes Clés suspectées** : ID=`id_pts`, Date=`2025-10-06 au 2025-12-01`
- **Paramètres Distingables** (65) : `['pH au laboratoire', 'Fe2+', 'MEST Filtr', 'Na+3', 'DCO \n2h décant.', 'Fe', 'SO42-_IC', 'Cond 25°C *1,1*0,01', 'Mn5', 'somme\nanions_mg/l']...`
- **Taux NULL** : 11 (soit 0.3%)
- **Valeurs Négatives** : 0

### Table : `mesures_idp_2024_src_pollution_globale`
- **Volume** : 243 lignes
- **Colonnes Clés suspectées** : ID=`id_pts`, Date=`2024-09-12 au 2025-12-15`
- **Paramètres Distingables** (8) : `['Source', 'Oued', 'Forage', 'A-B-C-D-H-E', 'A-B-C-D', 'Puits', 'Rejet', 'F-G-D']...`
- **Taux NULL** : 0 (soit 0.0%)
- **Valeurs Négatives** : 0

### Table : `mesures_idp_2024_src_pollution_marche_cadre`
- **Volume** : 148 lignes
- **Colonnes Clés suspectées** : ID=`id_pts`, Date=`2025-10-06 au 2025-12-01`
- **Paramètres Distingables** (0) : `[]...`
- **Taux NULL** : 0 (soit 0.0%)
- **Valeurs Négatives** : 0

### Table : `inv_rejets_abattoirs_abhs`
- **Volume** : 61 lignes
- **Colonnes Clés suspectées** : ID=`id`, Date=`N/A au N/A`

### Table : `inv_rejets_domestiques_abhs`
- **Volume** : 362 lignes
- **Colonnes Clés suspectées** : ID=`id`, Date=`N/A au N/A`

### Table : `inv_rejets_ind_abhs`
- **Volume** : 11 lignes
- **Colonnes Clés suspectées** : ID=`id`, Date=`N/A au N/A`

## NIVEAU 3 — Synthèse métier
1. **Fragmentation Sémantique** : Les 4 tables IDP 2024 semblent avoir des gènes fonctionnels (paramètres) différents mais le format d'enregistrement hybride (Global vs Cadre) compliquera l'Upsert simple. 
2. **Identifiants Géospatiaux Orphelins** : Les inventaires `_abhs` listent des sources absolues qui, à la genèse du Lot 4, ne devaient pas être forcément cataloguées sous `infra.stations_mesure` mais peut être sous `infra.rejet_domestique`... La question du support topographique est entière (Où écrit-on l'ID de prelevement ponctuel !?).
3. **Intégrabilité** : Oui, sous réserve de configurer un `map_source_pollution_id` pointu (ou de générer la trace infra si c'est nouveau).

