# Audit Extensif Base SAD Sebou (`abh_sebou_070426`)
*Généré automatiquement le 2026-04-15 12:08:02*

## NIVEAU 1 — Vue d'ensemble

Aperçu quantitatif et qualitatif global de la base de données. L'ordonnancement respecte les priorités (Mesures, Inventaires, Infra...).

| Schema | Table | Famille Estimée | Nb Lignes | Statut Rapide | Action Principale |
|---|---|---|---|---|---|
| `public` | `mesures_bathymetries_barrages_abhs` | mesures | 62359 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `mesures_debit_jr` | mesures | 521433 | Brute | 🟡 Probablement Brute (Legacy à fusionner) |
| `public` | `mesures_debit_m` | mesures | 19316 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `mesures_debit_sources` | mesures | 2816 | Brute | 🟡 Probablement Brute (Legacy à fusionner) |
| `public` | `mesures_evaporation_jr` | mesures | 48900 | Brute | 🟡 Probablement Brute (Legacy à fusionner) |
| `public` | `mesures_idp_2024_qualite_globale` | mesures | 4894 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `mesures_idp_2024_qualite_marche_cadre` | mesures | 3614 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `mesures_idp_2024_src_pollution_globale` | mesures | 243 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `mesures_idp_2024_src_pollution_marche_cadre` | mesures | 148 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `mesures_niv_eau_barrages` | mesures | 85166 | Normalisée (?) | 🟢 Table Métier potentiellement valide. A confirmer via mapping. |
| `public` | `mesures_precipitations_jr` | mesures | 669880 | Brute | 🟡 Probablement Brute (Legacy à fusionner) |
| `public` | `mesures_precipitations_jr_max` | mesures | 2085 | Brute | 🟡 Probablement Brute (Legacy à fusionner) |
| `public` | `mesures_precipitations_jr_traitees` | mesures | 546007 | Brute | 🟡 Probablement Brute (Legacy à fusionner) |
| `public` | `mesures_qualite_barrages` | mesures | 8714 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `mesures_qualite_nappes` | mesures | 63088 | Normalisée (?) | 🟢 Table Métier potentiellement valide. A confirmer via mapping. |
| `public` | `mesures_qualite_rivieres` | mesures | 60097 | Normalisée (?) | 🟢 Table Métier potentiellement valide. A confirmer via mapping. |
| `public` | `mesures_suivi_qualite_brg_garde_hebdo` | mesures | 7094 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `mesures_suivi_qualite_sebou_jr_6stations` | mesures | 59436 | Brute | 🟡 Probablement Brute (Legacy à fusionner) |
| `public` | `inv_decharges_abhs` | inventaire | 233 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `inv_fosses_septiques_abhs` | inventaire | 20 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `inv_huileries_abhs` | inventaire | 612 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `inv_mines_abhs` | inventaire | 42 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `inv_rejets_abattoirs_abhs` | inventaire | 61 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `inv_rejets_domestiques_abhs` | inventaire | 362 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `inv_rejets_ind_abhs` | inventaire | 11 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `inv_step_abhs` | inventaire | 41 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `inv_step_ind_abhs` | inventaire | 15 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `inv_stm_abhs` | inventaire | 18 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `infra_barrages_abhs` | infrastructure | 34 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `infra_profils_stations` | infrastructure | 1980 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `infra_stations_abhs` | infrastructure | 390 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `geo_bassin_sebou` | geo | 1 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `geo_nappes_abhs` | geo | 17 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `geo_points_eau_abhs` | geo | 46 | Semi-traitée (Sale) | 🔴 Doublons massifs (>10%) - Nettoyage Urgent |
| `public` | `geo_reseau_hydro_abhs` | geo | 28 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `geo_sources_abhs` | geo | 135 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `geo_sous_bassin_sebou` | geo | 15 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `spatial_ref_sys` | geo | 8500 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `adm_cercles_abhs` | administratif | 61 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `adm_communes_abhs` | administratif | 346 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `adm_douars_abhs` | administratif | 6013 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `adm_provinces_abhs` | administratif | 21 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `adm_regions_abhs` | administratif | 6 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `adm_villes_abhs` | administratif | 33 | Sain | 🟢 Référentiel/Inventaire actif |
| `public` | `ref_types_mesures` | referentiel | 64 | Sain | 🟢 Référentiel/Inventaire actif |


## NIVEAU 2 — Fiches détaillées table par table

### Table : `mesures_bathymetries_barrages_abhs`
**1. IDENTITE**
- Famille estimée : Mesures | Semi-traitée (Sale)
- Volumétrie : 62359 lignes | 5 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_barrage`

**3. CONTENU REEL & 4. QUALITE**
- **Stations distinctes** : 10 (Echantillon: ['2820/15', '898/16', '1182/9', '1847/15', '1699/9'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_barrage': '0.0%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 62349 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `mesures_debit_jr`
**1. IDENTITE**
- Famille estimée : Mesures | Brute
- Volumétrie : 521433 lignes | 4 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Station** : `ire_station`
- Colonne **Date** : `date_jr`
- Colonne **Valeur** : `code_debit`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 1956-09-01 -> 2025-08-31
- **Stations distinctes** : 38 (Echantillon: ['1000/23', '1215/9', '1216/9', '1217/9', '1359/8'])
- **Taux de Nulls identifiés** : {'ire_station': '0.0%', 'date_jr': '0.0%', 'code_debit': '0.0%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 0 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟡 Probablement Brute (Legacy à fusionner)

---
### Table : `mesures_debit_m`
**1. IDENTITE**
- Famille estimée : Mesures | Semi-traitée (Sale)
- Volumétrie : 19316 lignes | 5 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Station** : `ire_station`
- Colonne **Date** : `mois`
- Colonne **Valeur** : `code_debit_m`

**3. CONTENU REEL & 4. QUALITE**
- **Stations distinctes** : 40 (Echantillon: ['581/22', '1508/9', '1359/8', '1217/9', '1215/9'])
- **Taux de Nulls identifiés** : {'ire_station': '0.0%', 'mois': '0.0%', 'code_debit_m': '0.0%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 18836 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `mesures_debit_sources`
**1. IDENTITE**
- Famille estimée : Mesures | Brute
- Volumétrie : 2816 lignes | 4 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_source`
- Colonne **Date** : `moment`
- Colonne **Valeur** : `debit`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 2000-01-05 11:18:00 -> 2025-07-30 13:15:00
- **Stations distinctes** : 19 (Echantillon: ['853/22Pi', '615/22', '131/22', '1336/16', '630/22'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_source': '0.0%', 'moment': '0.0%', 'debit': '0.0%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 0 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟡 Probablement Brute (Legacy à fusionner)

---
### Table : `mesures_evaporation_jr`
**1. IDENTITE**
- Famille estimée : Mesures | Brute
- Volumétrie : 48900 lignes | 6 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_station`
- Colonne **Date** : `date_mesure`
- Colonne **Valeur** : `val_evaporation`
- Colonne **Geom** : `geom`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 2013-07-06 -> 2024-08-31
- **Stations distinctes** : 12 (Echantillon: ['1710/9', '3264/15', '3265/15', '3546/8', '1709/9'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_station': '0.0%', 'date_mesure': '0.0%', 'val_evaporation': '21.08%', 'geom': '100.0% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 0 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟡 Probablement Brute (Legacy à fusionner)

---
### Table : `mesures_idp_2024_qualite_globale`
**1. IDENTITE**
- Famille estimée : Mesures | Semi-traitée (Sale)
- Volumétrie : 4894 lignes | 16 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Date** : `date_jr_prelevement`
- Colonne **Parametre** : `parametre_qualite`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 2024-09-12 -> 2025-12-14
- **Paramètres distincts** : 57 (Echantillon: ['Fe2+', 'TAC_meq/l', 'NTK', 'Fe', 'Se'])
- **Taux de Nulls identifiés** : {'date_jr_prelevement': '0.0%', 'parametre_qualite': '0.0%', 'coord_x': '5.6% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 3067 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `mesures_idp_2024_qualite_marche_cadre`
**1. IDENTITE**
- Famille estimée : Mesures | Semi-traitée (Sale)
- Volumétrie : 3614 lignes | 16 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Date** : `date_jr_prelevement`
- Colonne **Parametre** : `parametre_qualite`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 2025-10-06 -> 2025-12-01
- **Paramètres distincts** : 65 (Echantillon: ['pH au laboratoire', 'Fe2+', 'MEST Filtr', 'Na+3', 'DCO \n2h décant.'])
- **Taux de Nulls identifiés** : {'date_jr_prelevement': '0.0%', 'parametre_qualite': '0.0%', 'coord_x': '0.0% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 2297 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `mesures_idp_2024_src_pollution_globale`
**1. IDENTITE**
- Famille estimée : Mesures | Semi-traitée (Sale)
- Volumétrie : 243 lignes | 43 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Date** : `date_jr_prelevement`
- Colonne **Parametre** : `parametre`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 2024-09-12 -> 2025-12-15
- **Paramètres distincts** : 8 (Echantillon: ['Oued', 'Forage', 'A-B-C-D-H-E', 'A-B-C-D', 'Puits'])
- **Taux de Nulls identifiés** : {'date_jr_prelevement': '0.0%', 'parametre': '45.68%', 'coord_x': '14.8% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 139 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `mesures_idp_2024_src_pollution_marche_cadre`
**1. IDENTITE**
- Famille estimée : Mesures | Semi-traitée (Sale)
- Volumétrie : 148 lignes | 43 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Date** : `date_jr_prelevement`
- Colonne **Parametre** : `parametre`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 2025-10-06 -> 2025-12-01
- **Taux de Nulls identifiés** : {'date_jr_prelevement': '0.0%', 'parametre': '100.0%', 'coord_x': '0.0% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 115 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `mesures_niv_eau_barrages`
**1. IDENTITE**
- Famille estimée : Mesures | Normalisée (?)
- Volumétrie : 85166 lignes | 9 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_barrage`
- Colonne **Date** : `date_jr`
- Colonne **Valeur** : `niveau_eau_m_ngm`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 1996-12-01 -> 2025-09-01
- **Stations distinctes** : 10 (Echantillon: ['2820/15', '898/16', '1847/15', '1182/9', '296/10'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_barrage': '0.0%', 'date_jr': '0.11%', 'niveau_eau_m_ngm': '0.0%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 334 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Table Métier potentiellement valide. A confirmer via mapping.

---
### Table : `mesures_precipitations_jr`
**1. IDENTITE**
- Famille estimée : Mesures | Brute
- Volumétrie : 669880 lignes | 5 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Station** : `ire_station`
- Colonne **Date** : `date_jr`
- Colonne **Valeur** : `id_precipitation_jr`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 1985-09-01 -> 2025-08-31
- **Stations distinctes** : 47 (Echantillon: ['1000/23', '1213/22', '1215/9', '1216/9', '1217/9'])
- **Taux de Nulls identifiés** : {'ire_station': '0.0%', 'date_jr': '0.0%', 'id_precipitation_jr': '0.0%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 0 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟡 Probablement Brute (Legacy à fusionner)

---
### Table : `mesures_precipitations_jr_max`
**1. IDENTITE**
- Famille estimée : Mesures | Brute
- Volumétrie : 2085 lignes | 12 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_station`
- Colonne **Date** : `annee`
- Colonne **Valeur** : `nbr_val_jr_mqt`
- Colonne **Geom** : `p_max`

**3. CONTENU REEL & 4. QUALITE**
- **Stations distinctes** : 45 (Echantillon: ['1359/8', '1215/9', '1217/9', '2551/15', '198/30'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_station': '0.0%', 'annee': '0.0%', 'nbr_val_jr_mqt': '62.21%', 'p_max': '8.2% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 0 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟡 Probablement Brute (Legacy à fusionner)

---
### Table : `mesures_precipitations_jr_traitees`
**1. IDENTITE**
- Famille estimée : Mesures | Brute
- Volumétrie : 546007 lignes | 7 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_station`
- Colonne **Date** : `date_jr`
- Colonne **Valeur** : `val_observees`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 1985-09-01 -> 2024-08-31
- **Stations distinctes** : 47 (Echantillon: ['1000/23', '1213/22', '1215/9', '1216/9', '1217/9'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_station': '0.0%', 'date_jr': '0.0%', 'val_observees': '8.37%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 0 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟡 Probablement Brute (Legacy à fusionner)

---
### Table : `mesures_qualite_barrages`
**1. IDENTITE**
- Famille estimée : Mesures | Semi-traitée (Sale)
- Volumétrie : 8714 lignes | 6 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_station`
- Colonne **Date** : `date_prelevement`
- Colonne **Parametre** : `parametre_qualite`
- Colonne **Valeur** : `val_qual_barr`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 1988-10-14 -> 2024-11-29
- **Stations distinctes** : 14 (Echantillon: ['1255/22', '3323/8', '3265/15', '3546/8', '3264/15'])
- **Paramètres distincts** : 60 (Echantillon: ['Ca', 'Fe', 'Mg', 'T_eau', 'OH'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_station': '0.0%', 'date_prelevement': '0.0%', 'parametre_qualite': '0.0%', 'val_qual_barr': '0.0%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 884 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `mesures_qualite_nappes`
**1. IDENTITE**
- Famille estimée : Mesures | Normalisée (?)
- Volumétrie : 63088 lignes | 5 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_station`
- Colonne **Date** : `date_prelevement`
- Colonne **Parametre** : `parametre_qualite`
- Colonne **Valeur** : `val_qual_nap`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 1988-10-03 -> 2024-11-29
- **Stations distinctes** : 292 (Echantillon: ['690/22', '3921/14', '1757/14', 'R823/15', '1336/16'])
- **Paramètres distincts** : 71 (Echantillon: ['Ca', 'Fe', 'CO32', 'Temperature_Ambiante', 'As'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_station': '0.0%', 'date_prelevement': '0.0%', 'parametre_qualite': '0.0%', 'val_qual_nap': '0.0%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 5 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Table Métier potentiellement valide. A confirmer via mapping.

---
### Table : `mesures_qualite_rivieres`
**1. IDENTITE**
- Famille estimée : Mesures | Normalisée (?)
- Volumétrie : 60097 lignes | 5 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_station`
- Colonne **Date** : `date_prelevement`
- Colonne **Parametre** : `parametre_qualite`
- Colonne **Valeur** : `val_qual_riv`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 1988-09-20 -> 2024-11-28
- **Stations distinctes** : 56 (Echantillon: ['581/22', '1508/9', '1359/8', '756/16', '2396/14'])
- **Paramètres distincts** : 96 (Echantillon: ['Ca', 'Fe', 'As', 'Se', 'Mg'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_station': '0.0%', 'date_prelevement': '0.0%', 'parametre_qualite': '0.0%', 'val_qual_riv': '0.0%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 22 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Table Métier potentiellement valide. A confirmer via mapping.

---
### Table : `mesures_suivi_qualite_brg_garde_hebdo`
**1. IDENTITE**
- Famille estimée : Mesures | Semi-traitée (Sale)
- Volumétrie : 7094 lignes | 7 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_station`
- Colonne **Date** : `date_prelevement`
- Colonne **Parametre** : `parametre_qualite`
- Colonne **Valeur** : `val_qual_brg_garde_hebdo`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 2023-01-03 -> 2025-09-22
- **Paramètres distincts** : 39 (Echantillon: ['PO43-(mgP/l)', 'MEST(mg/l)', 'Chl.A(µg/l)', 'Indicedephénol(mg/l)', 'PT(mgP/l)'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_station': '100.0%', 'date_prelevement': '0.0%', 'parametre_qualite': '0.0%', 'val_qual_brg_garde_hebdo': '50.45%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 3467 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `mesures_suivi_qualite_sebou_jr_6stations`
**1. IDENTITE**
- Famille estimée : Mesures | Brute
- Volumétrie : 59436 lignes | 6 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_station`
- Colonne **Date** : `date_prelevement`
- Colonne **Parametre** : `parametre_qualite`
- Colonne **Valeur** : `val_qual_sebou_jr`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 2023-12-07 -> 2026-01-06
- **Stations distinctes** : 6 (Echantillon: ['3695/8', '1355/8', '1540/15', '1541/15', '3738/8'])
- **Paramètres distincts** : 13 (Echantillon: ['Conductivité', 'Nitrates', 'Turbidité', 'pH', 'NTK'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_station': '0.0%', 'date_prelevement': '0.0%', 'parametre_qualite': '0.0%', 'val_qual_sebou_jr': '0.0%'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 0 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟡 Probablement Brute (Legacy à fusionner)

---
### Table : `inv_decharges_abhs`
**1. IDENTITE**
- Famille estimée : Inventaire | Semi-traitée (Sale)
- Volumétrie : 233 lignes | 16 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `station_traitement_lixiviat`
- Colonne **Date** : `date_mise_service`
- Colonne **Geom** : `type_decharge`

**3. CONTENU REEL & 4. QUALITE**
- **Stations distinctes** : 5 (Echantillon: ['Bioréacteurs à membrane', 'Non', "En cours d'exécution", ' ', 'Oui'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'station_traitement_lixiviat': '25.32%', 'date_mise_service': '57.94%', 'type_decharge': '31.3% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 196 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `inv_fosses_septiques_abhs`
**1. IDENTITE**
- Famille estimée : Inventaire | Sain
- Volumétrie : 20 lignes | 6 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'coord_x': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `inv_huileries_abhs`
**1. IDENTITE**
- Famille estimée : Inventaire | Sain
- Volumétrie : 612 lignes | 13 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `type_huilerie`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'type_huilerie': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `inv_mines_abhs`
**1. IDENTITE**
- Famille estimée : Inventaire | Sain
- Volumétrie : 42 lignes | 9 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `num_licence_exploit`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'num_licence_exploit': '11.9% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `inv_rejets_abattoirs_abhs`
**1. IDENTITE**
- Famille estimée : Inventaire | Sain
- Volumétrie : 61 lignes | 6 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'coord_x': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `inv_rejets_domestiques_abhs`
**1. IDENTITE**
- Famille estimée : Inventaire | Sain
- Volumétrie : 362 lignes | 12 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Valeur** : `debit_l_s`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'debit_l_s': '42.82%', 'coord_x': '21.5% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `inv_rejets_ind_abhs`
**1. IDENTITE**
- Famille estimée : Inventaire | Sain
- Volumétrie : 11 lignes | 8 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'coord_x': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `inv_step_abhs`
**1. IDENTITE**
- Famille estimée : Inventaire | Semi-traitée (Sale)
- Volumétrie : 41 lignes | 15 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `type_station`
- Colonne **Geom** : `type_station`

**3. CONTENU REEL & 4. QUALITE**
- **Stations distinctes** : 19 (Echantillon: ['lagunage aéré', 'Lagunage Aeré', 'lagunage naturel', 'Lagunage anaérobie', 'Lit bactérien'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'type_station': '24.4% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 21 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `inv_step_ind_abhs`
**1. IDENTITE**
- Famille estimée : Inventaire | Sain
- Volumétrie : 15 lignes | 8 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'coord_x': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `inv_stm_abhs`
**1. IDENTITE**
- Famille estimée : Inventaire | Sain
- Volumétrie : 18 lignes | 8 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'coord_x': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `infra_barrages_abhs`
**1. IDENTITE**
- Famille estimée : Infrastructure | Sain
- Volumétrie : 34 lignes | 17 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `nom_barrage`
- Colonne **Geom** : `type_barrage`

**3. CONTENU REEL & 4. QUALITE**
- **Stations distinctes** : 32 (Echantillon: ['kodiat borna', 'gharbia', 'el kansera', 'aggay', 'sidi abbou'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'nom_barrage': '2.94%', 'type_barrage': '35.3% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 1 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `infra_profils_stations`
**1. IDENTITE**
- Famille estimée : Infrastructure | Semi-traitée (Sale)
- Volumétrie : 1980 lignes | 8 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_station`
- Colonne **Geom** : `type_profil`

**3. CONTENU REEL & 4. QUALITE**
- **Stations distinctes** : 37 (Echantillon: ['581/22', '1359/8', '1508/9', '1215/9', '1217/9'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_station': '0.0%', 'type_profil': '0.0% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 1943 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `infra_stations_abhs`
**1. IDENTITE**
- Famille estimée : Infrastructure | Sain
- Volumétrie : 390 lignes | 15 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Station** : `id_station`
- Colonne **Geom** : `type_station`

**3. CONTENU REEL & 4. QUALITE**
- **Stations distinctes** : 390 (Echantillon: ['262', '90', '330', '16', '257'])
- **Taux de Nulls identifiés** : {'id_station': '0.0%', 'type_station': '31.0% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 0 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `geo_bassin_sebou`
**1. IDENTITE**
- Famille estimée : Geo | Sain
- Volumétrie : 1 lignes | 5 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `geom`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'geom': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `geo_nappes_abhs`
**1. IDENTITE**
- Famille estimée : Geo | Sain
- Volumétrie : 17 lignes | 6 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `geom`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'geom': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `geo_points_eau_abhs`
**1. IDENTITE**
- Famille estimée : Geo | Semi-traitée (Sale)
- Volumétrie : 46 lignes | 18 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Date** : `date_realisation`
- Colonne **Geom** : `dist_pt_eau_foyer_pollut_m`

**3. CONTENU REEL & 4. QUALITE**
- **Période calendaire** : 1940-01-01 -> 2024-01-01
- **Taux de Nulls identifiés** : {'id': '0.0%', 'date_realisation': '60.87%', 'dist_pt_eau_foyer_pollut_m': '39.1% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 28 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🔴 Doublons massifs (>10%) - Nettoyage Urgent

---
### Table : `geo_reseau_hydro_abhs`
**1. IDENTITE**
- Famille estimée : Geo | Sain
- Volumétrie : 28 lignes | 5 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `longueur_km`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'longueur_km': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `geo_sources_abhs`
**1. IDENTITE**
- Famille estimée : Geo | Sain
- Volumétrie : 135 lignes | 10 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Station** : `ire_source`
- Colonne **Geom** : `type_source`

**3. CONTENU REEL & 4. QUALITE**
- **Stations distinctes** : 135 (Echantillon: ['1427/22', '51/23', '1336/16', '1422/8', '174/22'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'ire_source': '0.0%', 'type_source': '2.2% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 0 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `geo_sous_bassin_sebou`
**1. IDENTITE**
- Famille estimée : Geo | Sain
- Volumétrie : 15 lignes | 6 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `geom`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'geom': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `spatial_ref_sys`
**1. IDENTITE**
- Famille estimée : Geo | Sain
- Volumétrie : 8500 lignes | 5 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Geom** : `srtext`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'srtext': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `adm_cercles_abhs`
**1. IDENTITE**
- Famille estimée : Administratif | Sain
- Volumétrie : 61 lignes | 5 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Geom** : `geom`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'geom': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `adm_communes_abhs`
**1. IDENTITE**
- Famille estimée : Administratif | Sain
- Volumétrie : 346 lignes | 14 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Geom** : `geom`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'geom': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `adm_douars_abhs`
**1. IDENTITE**
- Famille estimée : Administratif | Sain
- Volumétrie : 6013 lignes | 8 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'coord_x': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `adm_provinces_abhs`
**1. IDENTITE**
- Famille estimée : Administratif | Sain
- Volumétrie : 21 lignes | 4 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Geom** : `geom`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'geom': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `adm_regions_abhs`
**1. IDENTITE**
- Famille estimée : Administratif | Sain
- Volumétrie : 6 lignes | 4 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Geom** : `geom`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'geom': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `adm_villes_abhs`
**1. IDENTITE**
- Famille estimée : Administratif | Sain
- Volumétrie : 33 lignes | 6 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Geom** : `coord_x`

**3. CONTENU REEL & 4. QUALITE**
- **Taux de Nulls identifiés** : {'id': '0.0%', 'coord_x': '0.0% (Geom Null)'}

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---
### Table : `ref_types_mesures`
**1. IDENTITE**
- Famille estimée : Referentiel | Sain
- Volumétrie : 64 lignes | 5 colonnes

**2. STRUCTURE (Inférence de Rôles)**
- Colonne **Id** : `id`
- Colonne **Parametre** : `parametre_qualite`
- Colonne **Unite** : `unite`
- Colonne **Geom** : `type_mesure`

**3. CONTENU REEL & 4. QUALITE**
- **Paramètres distincts** : 60 (Echantillon: ['Ca', 'Fe', 'Mg', 'T_eau', 'OH'])
- **Taux de Nulls identifiés** : {'id': '0.0%', 'parametre_qualite': '6.25%', 'unite': '7.81%', 'type_mesure': '0.0% (Geom Null)'}
- **Conflits de doublons (Station + Date + Paramètre probables)** : 3 conflits

**5. & 6. SYNTHESE METIER / ACTION REQUISE**
> **Recommandation SAD :** 🟢 Référentiel/Inventaire actif

---

## NIVEAU 3 — Conclusions Globales (Pré-généré)

### Tables vides à PURGER / IGNORER

### Tables Brutes identifiées (Potentiel Legacy/Archives)
- `mesures_debit_jr`
- `mesures_debit_sources`
- `mesures_evaporation_jr`
- `mesures_precipitations_jr`
- `mesures_precipitations_jr_max`
- `mesures_precipitations_jr_traitees`
- `mesures_suivi_qualite_brg_garde_hebdo`
- `mesures_suivi_qualite_sebou_jr_6stations`

### Tables avec des doublons critiques nécessitant assainissement
- `mesures_bathymetries_barrages_abhs` (62349 doublons)
- `mesures_debit_m` (18836 doublons)
- `mesures_idp_2024_qualite_globale` (3067 doublons)
- `mesures_idp_2024_qualite_marche_cadre` (2297 doublons)
- `mesures_idp_2024_src_pollution_globale` (139 doublons)
- `mesures_idp_2024_src_pollution_marche_cadre` (115 doublons)
- `mesures_niv_eau_barrages` (334 doublons)
- `mesures_qualite_barrages` (884 doublons)
- `mesures_qualite_nappes` (5 doublons)
- `mesures_qualite_rivieres` (22 doublons)
- `mesures_suivi_qualite_brg_garde_hebdo` (3467 doublons)
- `inv_decharges_abhs` (196 doublons)
- `inv_step_abhs` (21 doublons)
- `infra_barrages_abhs` (1 doublons)
- `infra_profils_stations` (1943 doublons)
- `geo_points_eau_abhs` (28 doublons)
- `ref_types_mesures` (3 doublons)

> La décision d'arquiver formellement ces tables en legacy revient désormais au chef de produit WQDSS via action des scripts métiers appropriés.
