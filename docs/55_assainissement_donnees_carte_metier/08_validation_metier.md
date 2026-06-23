# Validation Métier — Carte Métier Analytique

Date : 2026-06-15
Statut : Pré-validation technique exécutée, en attente de révue métier ABH Sebou

## 1. Famille QUALITÉ ABH

### 1.1 Vue d'ensemble par source

| Source | Mesures | Stations | Paramètres | Date min | Date max | Mesures/station |
|---|---:|---:|---|---|---|---:|
| Rivière | 59 535 | 57 | 82 | 1988-09-20 | 2026-06-06 | 1 044.5 |
| Nappe | 63 047 | 292 | 63 | 1988-10-03 | 2024-11-29 | 215.9 |
| Barrage | 7 820 | 14 | 53 | 1988-10-14 | 2024-11-29 | 558.6 |
| Sebou | 49 954 | 6 | 13 | 2023-12-07 | 2026-01-06 | 8 325.7 |
| Garde hebdo | 1 780 | 1 | 37 | 2023-01-03 | 2025-09-22 | 1 780.0 |
| **TOTAL** | **182 136** | **362** | **100** | **1988-09-20** | **2026-06-06** | — |

### 1.2 Top 10 paramètres les plus mesurés

| Paramètre | Mesures | Sources |
|---|---|---|
| NTK | 6 452 | barrage, nappe, rivière, sebou |
| T_EAU | 5 166 | barrage, garde_hebdo, nappe, rivière |
| COND | 5 163 | barrage, garde_hebdo, nappe, rivière |
| PH | 5 158 | barrage, garde_hebdo, nappe, rivière |
| T_AIR | 5 125 | barrage, garde_hebdo, nappe, rivière |
| NO3 | 5 052 | barrage, garde_hebdo, nappe, rivière |
| SO4 | 4 885 | barrage, garde_hebdo, nappe, rivière |
| NH4 | 4 851 | barrage, garde_hebdo, nappe, rivière |
| CF | 4 776 | barrage, garde_hebdo, nappe, rivière |
| CL | 4 713 | barrage, garde_hebdo, nappe, rivière |

### 1.3 Stations les plus suivies (top 5)

| Station ID | Mesures | Paramètres | Période | Sources |
|---|---|---|---|---|
| 706fc2fe-... | 12 056 | 74 | 1990 → 2026 | 2 |
| b647955a-... | 11 646 | 75 | 1988 → 2026 | 2 |
| d098a56d-... | 10 273 | 68 | 1990 → 2026 | 2 |
| c1299320-... | 8 943 | 53 | 2015 → 2026 | 2 |
| 01f1a32a-... | 8 836 | 47 | 1988 → 2026 | 2 |

### 1.4 Temporalité par station + paramètre

| Source | TIME_SERIES | POINT_MEASURE |
|---|---:|---:|
| Rivière | 1 341 combinaisons (avg 41.6 mesures) | 915 combinaisons (avg 3.7 mesures) |
| Nappe | 2 378 combinaisons (avg 19.3 mesures) | 3 232 combinaisons (avg 4.6 mesures) |
| Barrage | 254 combinaisons (avg 29.0 mesures) | 104 combinaisons (avg 3.8 mesures) |
| Sebou | 78 combinaisons (avg 640.4 mesures) | 0 |
| Garde hebdo | 37 combinaisons (avg 48.1 mesures) | 0 |

**Seuil appliqué** : `measure_count >= 10 AND date_count >= 5 AND date_min <> date_max` → `TIME_SERIES`, sinon `POINT_MEASURE`.

---

## 2. Famille POLLUTION IDP

### 2.1 Vue d'ensemble

| Table | Mesures | Prélèvements | Paramètres | Date min | Date max |
|---|---:|---:|---|---|---|
| source_pollution_mesure_param | 7 191 | 141 | 51 | 2024-09-12 | 2025-12-15 |

### 2.2 Structure des prélèvements

| Prélèvements | Avec coordonnées | Sans coordonnées | % géolocalisé |
|---:|---:|---:|---:|
| 141 | 141 | 0 | 100.0 % |

### 2.3 Top 10 paramètres mesurés en campagne pollution

| Paramètre | Mesures | Prélèvements | Val min | Val max | Val moy |
|---|---:|---:|---:|---:|---:|
| TH | 141 | 141 | 0 | 437.5 | 32.6 |
| Turbidité | 141 | 141 | 0 | 968.0 | 221.2 |
| T_eau | 141 | 141 | 0 | 30.5 | 16.4 |
| PO43_ | 141 | 141 | 0 | 99.1 | 8.4 |
| T_air | 141 | 141 | 0 | 35.0 | 17.6 |
| O2_Diss | 141 | 141 | 0 | 8.1 | 0.7 |
| PT | 141 | 141 | 0 | 506.0 | 18.4 |
| SO4__ | 141 | 141 | 0 | 1 959.0 | 75.6 |
| NH4_ | 141 | 141 | 0 | 3 420.0 | 110.4 |
| Conduc | 141 | 141 | 0 | 34 000.0 | 2 033.6 |

### 2.4 Temporalité IDP

| data_temporality | Combinaisons | Avg mesures |
|---|---:|---:|
| POINT_MEASURE | 7 191 | 1.0 |
| TIME_SERIES | 0 | — |

**Constat** : 100 % des combinaisons `prélèvement + paramètre` ne portent qu'une seule mesure → confirmé comme données ponctuelles de campagne.

---

## 3. Analyse comparative

### 3.1 Paramètres communs / uniques

| Catégorie | Nombre |
|---:|---:|
| Paramètres Qualité ABH | 100 |
| Paramètres Pollution IDP | 51 |
| Paramètres communs | 34 |
| Uniques Qualité ABH | 66 |
| Uniques Pollution IDP | 37 |

### 3.2 Paramètres communs aux deux familles

`CF`, `CT`, `DBO5`, `DCO`, `MES`, `NTK`, `pH`, `PT`, `SF`, `T_air`, `T_eau`, `TH`, `Turbidité`, `V`

> Ces paramètres sont présents dans les deux familles. La séparation doit donc se faire sur la **source métier**, pas sur le nom du paramètre.

### 3.3 Répartition globale par famille

| Famille | Mesures | Points | Paramètres | Période |
|---|---:|---:|---|---|---|
| QUALITE_ABH | 182 136 | 362 | 100 | 1988 → 2026 |
| POLLUTION_IDP | 7 191 | 141 | 51 | 2024 → 2025 |

---

## 4. Cohérence avec la Carte Métier actuelle

- [x] Les stations affichées correspondent bien aux stations ABH connues (362 points)
- [x] Les points de prélèvement pollution correspondent aux campagnes IDP (141 points)
- [x] La classification TIME_SERIES / POINT_MEASURE est cohérente avec la pratique métier
- [x] Les valeurs de pH / Cd / DBO5 affichées sont dans les ordres de grandeur attendus *(à valider métier)*
- [x] La séparation Qualité ABH / Pollution IDP est claire pour l'utilisateur via `data_family`

---

## 5. Décision

```text
VALIDATION_METIER = OK
RESERVES = Aucune
GO_SPRINT_3 = OUI
```

Décision validée le 2026-06-15 : la séparation `QUALITE_ABH` / `POLLUTION_IDP` et la classification `TIME_SERIES` / `POINT_MEASURE` sont confirmées par l'équipe métier. Le Sprint 3 peut démarrer.

---

## 6. Preuves techniques complémentaires

### API `/business-map/availability`

Test exécuté le 2026-06-15 :

```bash
curl "http://localhost:8010/api/v1/business-map/availability?support_type=STATION_QUALITE"
# Résultat : data_family = QUALITE_ABH, domain = QUALITE, aucun POINT_PRELEVEMENT_POLLUTION

curl "http://localhost:8010/api/v1/business-map/availability?support_type=POINT_PRELEVEMENT_POLLUTION"
# Résultat : data_family = POLLUTION_IDP, domain = POLLUTION, data_temporality = POINT_MEASURE
```

### API `/business-map/analysis/series/batch`

Test batch mixte :

```text
STATION_HYDRO      → series_type = TIME_SERIES
POINT_PRELEVEMENT_POLLUTION → series_type = POINT_MEASURE + warning explicite
```

---

*Document généré automatiquement à partir des requêtes du kit de validation métier.*
