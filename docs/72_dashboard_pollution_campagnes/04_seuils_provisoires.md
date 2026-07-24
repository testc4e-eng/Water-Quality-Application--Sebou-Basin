# 04 — Seuils — Alertes pollution

## Source des seuils

Les seuils sont chargés dynamiquement depuis `metadata.qualite_seuil_reglementaire` (jointure avec `metadata.qualite_parametre_reglementaire` et `metadata.referentiel_parametre`).

Seul le paramètre **CrT** utilise un seuil fallback provisoire (`0.050 mg/L`) car il n'est pas présent dans le référentiel des seuils.

## Paramètres surveillés (prioritaires)

| Catégorie | Paramètres |
|---|---|
| Métaux lourds | Cd, Pb, Hg, CrT |
| Métaux traces | As_, Cu, Ni, Zn |
| Pollution organique | DBO5, DCO, MES, NH4_, NO3_ |
| Nutriments | PT, PO43_, NTK |
| Physico-chimique | pH, Conduc, O2_Diss, T_eau, Turbidité |

## Seuils constatés dans le référentiel

| Paramètre | Seuil (borne max moteur) | Unité |
|---|---|---|
| Cd | 0.005 | mg/L |
| Pb | 0.050 | mg/L |
| Hg | 0.001 | mg/L |
| As_ | 0.050 | mg/L |
| Cu | 0.05 / 1 | mg/L |
| Ni | 0.050 | mg/L |
| Zn | 1 / 5 | mg/L |
| DBO5 | 5 / 10 / 25 | mg/L |
| DCO | 35 / 40 / 80 | mg/L |
| MES | 200 / 1000 / 2000 | mg/L |
| NH4_ | 0.5 / 2 / 8 | mg/L |
| NO3_ | 25 / 50 | mg/L |
| PT | 0.3 / 0.5 / 3 | mg/L |
| PO43_ | 0.5 / 1 / 5 | mg/L |
| NTK | 2 / 3 | mgN/L |
| pH | 8.5 / 9.2 | - |
| Conduc | 1300 / 2700 / 3000 | µS/cm |
| O2_Diss | 1 / 3 / 5 | mg/L |
| T_eau | 25 / 30 / 35 | °C |

## Règles d'alerte

- **WARNING** : `valeur >= seuil`
- **CRITICAL** : `valeur >= 2 × seuil`
- Les valeurs `< LQ` ne déclenchent pas d'alerte.
- Les paramètres sans seuil dans le référentiel ne sont pas surveillés.
