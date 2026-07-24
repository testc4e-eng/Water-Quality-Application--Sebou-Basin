# 02 — Analyse des données de campagne pollution

> Requêtes exécutées en lecture seule sur la base `abh_sad`.

---

## 1. Tables sources auditées

| Table | Rôle |
|-------|------|
| `qualite.source_pollution_prelevement` | Prélèvements ponctuels (1 ligne = 1 point/date) |
| `qualite.source_pollution_mesure_param` | Mesures paramétrées rattachées à un prélèvement |
| `qualite.source_pollution_prelevement_lien` | Liens entre prélèvements et entités d'inventaire pollution |
| `api.v_source_pollution_prelevement` | Vue enrichie (compteurs liens/mesures) |
| `api.v_pollution_latest_results` | Vue unifiée IDP (5 paramètres P0, campagne_code) |
| `api.v_pollution_sites` | Sites IDP pour la carte existante |

### Schéma réel (différent du modèle attendu initialement)

```text
qualite.source_pollution_prelevement
  id (uuid PK), source_row_id, date_reception, date_prelevement,
  point_prelevement, abh, cercle, province, commune,
  coord_x, coord_y, geom, debit_raw, nature, observation,
  source_system, qa_flag_missing_geom, qa_flag_missing_commune, ...

qualite.source_pollution_mesure_param
  id, prelevement_id, param_code_legacy, valeur_raw, valeur_num,
  valeur_qualifier, parametre_ref_id,
  qa_flag_value_missing, qa_flag_value_non_numeric, qa_flag_param_unmapped

qualite.source_pollution_prelevement_lien
  prelevement_id, entite_type, entite_id, mapping_method, is_primary
```

**Important :** il n'existe pas de colonne `id_campagne` ou `id_site` dans les tables brutes. La notion de campagne doit être reconstruite via `source_system`, `date_prelevement` ou la vue `api.v_pollution_latest_results.campagne_code`.

---

## 2. Volumétrie

### 2.1 Vue globale

```sql
SELECT 
  COUNT(*) as nb_prelevements,
  COUNT(DISTINCT point_prelevement) as nb_points,
  COUNT(DISTINCT commune) as nb_communes,
  MIN(date_prelevement) as date_min,
  MAX(date_prelevement) as date_max
FROM qualite.source_pollution_prelevement;
```

| nb_prelevements | nb_points | nb_communes | date_min | date_max |
|-----------------|-----------|-------------|----------|----------|
| 141 | 141 | 81 | 2024-09-12 | 2025-12-15 |

### 2.2 Mesures

```sql
SELECT COUNT(*) as total_mesures,
       COUNT(DISTINCT param_code_legacy) as nb_parametres
FROM qualite.source_pollution_mesure_param;
```

| total_mesures | nb_paramètres |
|---------------|---------------|
| 7 191 | 51 |

→ Chaque prélèvement dispose théoriquement de **51 mesures** (141 × 51 = 7 191).

---

## 3. Distribution temporelle

```sql
SELECT date_prelevement,
       COUNT(*) as nb_prelevements,
       COUNT(DISTINCT commune) as nb_communes
FROM qualite.source_pollution_prelevement
GROUP BY date_prelevement
ORDER BY date_prelevement DESC;
```

**Résultat résumé :**

- **Campagne 2024** : 13 jours de prélèvement entre le 12 et le 24 septembre 2024 (81 prélèvements)
- **Campagne 2025** : 30 jours de prélèvement entre le 1er octobre et le 15 décembre 2025 (60 prélèvements)
- Pic d'activité : 11 prélèvements le 18/09/2024 et 5 prélèvements le 15/10/2025

Les deux phases correspondent aux campagnes visibles dans `api.v_pollution_latest_results` :

| campagne_code | nb_mesures | nb_sites | nb_paramètres | date_min | date_max |
|---------------|------------|----------|---------------|----------|----------|
| IDP_GLOBALE_2024 | 804 | 317 | 5 | 2024-09-13 | 2025-12-14 |
| IDP_MARCHE_CADRE_2024 | 455 | 247 | 5 | 2025-10-06 | 2025-12-01 |

> La vue IDP contient **plus de sites et uniquement les 5 paramètres P0** ; les tables brutes contiennent **141 prélèvements et 51 paramètres**. Il s'agit de deux périmètres de données distincts.

---

## 4. Paramètres mesurés

```sql
SELECT param_code_legacy,
       COUNT(*) as nb_mesures,
       MIN(valeur_num) as val_min,
       MAX(valeur_num) as val_max,
       ROUND(AVG(valeur_num)::numeric, 3) as val_moy
FROM qualite.source_pollution_mesure_param
GROUP BY param_code_legacy
ORDER BY nb_mesures DESC;
```

**Liste complète des 51 paramètres (tous mesurés 141 fois) :**

Ag, Al, As_, Ba, Be, Ca__, Cd, CF, Cl_, Co, Conduc, CrT, CT, Cu, DBO5, DCO, Fe, Fe2_, Hg, Huiles_Gra, K_, Li, MES, Mg__, Mn, Mo, Na_, NH4_, Ni, NO2_, NO3_, NTK, O2_Diss, Pb, pH, Phénol, PO43_, PT, Sb, Se, SF, Sn, SO4__, Sr, T_air, T_eau, TH, Tl, Turbidité, V, Zn.

**Paramètres prioritaires pour la conformité réglementaire :**

| Paramètre | val_min | val_max | val_moy | Observations |
|-----------|---------|---------|---------|--------------|
| Cd | 0.001 | 0.0024 | 0.001 | Valeurs < LQ, unité à confirmer (probablement mg/L) |
| Pb | 0.01 | 0.042 | 0.018 | Métal lourd |
| Hg | 0.00025 | 0.00042 | ~0 | Métal lourd, très faibles concentrations |
| CrT | 0.01 | 0.111 | 0.029 | Métal lourd |
| DBO5 | 0 | 17 450.57 | 711.49 | Valeurs extrêmes (rejet industriel probable) |
| DCO | 0 | 30 720 | 1 522.82 | Valeurs extrêmes |
| MES | 3.11 | 24 008 | 1 483.70 | Valeurs extrêmes |
| NH4_ | 0 | 3 420 | 110.41 | Valeurs extrêmes |

---

## 5. Géolocalisation

```sql
SELECT 
  COUNT(*) FILTER (WHERE geom IS NULL) as sans_geom,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE qa_flag_missing_geom = true) as flag_geom,
  COUNT(*) FILTER (WHERE qa_flag_missing_commune = true) as flag_commune
FROM qualite.source_pollution_prelevement;
```

| sans_geom | total | flag_geom | flag_commune |
|-----------|-------|-----------|--------------|
| 0 | 141 | 0 | 0 |

✅ **100 % des prélèvements sont géolocalisés et possèdent une commune.**

---

## 6. Qualité des données

```sql
SELECT 
  COUNT(*) as total_mesures,
  COUNT(*) FILTER (WHERE valeur_num IS NULL) as valeur_nulle,
  COUNT(*) FILTER (WHERE qa_flag_value_missing = true) as flag_valeur_manquante,
  COUNT(*) FILTER (WHERE qa_flag_value_non_numeric = true) as flag_valeur_non_numerique,
  COUNT(*) FILTER (WHERE qa_flag_param_unmapped = true) as flag_param_non_mappe
FROM qualite.source_pollution_mesure_param;
```

| total_mesures | valeur_nulle | % nul | flag_valeur_non_num | flag_param_non_mappe |
|---------------|--------------|-------|---------------------|----------------------|
| 7 191 | 3 447 | 47.9 % | 0 | 0 |

**Analyse :**

- Près de **la moitié des mesures sont sans valeur numérique** (souvent valeur `< LQ` ou `-` non convertie).
- Aucune erreur de typage numérique ni paramètre non mappé détectée.
- Les colonnes `valeur_raw` contiennent des valeurs littérales comme `<0,001`, `-`, `FAIBLE` ; la colonne `valeur_num` est nulle dans ces cas.

---

## 7. Liens vers les entités d'inventaire pollution

```sql
SELECT entite_type,
       COUNT(*) as nb_liens,
       COUNT(DISTINCT prelevement_id) as nb_prelevements,
       COUNT(DISTINCT entite_id) as nb_entites
FROM qualite.source_pollution_prelevement_lien
GROUP BY entite_type;
```

| entite_type | nb_liens | nb_prélèvements | nb_entités |
|-------------|----------|-----------------|------------|
| rejet_inventaire | 96 | 96 | 72 |
| rejet_abattoir_inventaire | 18 | 18 | 18 |
| huilerie_inventaire | 1 | 1 | 1 |
| step | 1 | 1 | 1 |

→ **116 prélèvements sur 141 (82 %) sont rattachés à une entité d'inventaire pollution.** 25 prélèvements n'ont pas de lien connu (`entite_type IS NULL`).

---

## 8. Points de vigilance pour le dashboard

1. **Pas de table `campagnes` explicite** : la notion de campagne doit être déduite (`date_prelevement`, `source_system`, ou `campagne_code` de la vue IDP).
2. **Unités non stockées dans `source_pollution_mesure_param`** : nécessaire pour comparer aux seuils réglementaires.
3. **Valeurs `< LQ` non converties** : 48 % des mesures sans valeur_num ; il faut décider si on affiche `< LQ`, la LQ, ou `null`.
4. **Seuils métaux lourds** : disponibles uniquement dans `frontend/src/config/thematiques.config.ts`, pas en base. Conversion mg/L ↔ µg/L à valider.
5. **Deux périmètres de données** :
   - **Campagnes brutes** : 141 prélèvements × 51 paramètres → cible du dashboard à créer.
   - **IDP unifié** : 2 026 sites × 5 paramètres P0 → déjà restitué par le Dashboard Pollution existant.
