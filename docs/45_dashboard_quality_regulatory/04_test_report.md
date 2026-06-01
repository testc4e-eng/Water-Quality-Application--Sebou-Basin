# Rapport de test dashboard qualité réglementaire P0

Date : 2026-06-01

## Build

| Test | Résultat |
|---|---|
| `python -m py_compile backend/app/routers/quality.py backend/app/services/regulatory_quality.py` | OK |
| `npm run build` | OK |

Warning non bloquant : bundle principal supérieur à 500 kB, dette de code splitting à traiter séparément.

## API réelles

| Test | Résultat |
|---|---|
| `/health` | `OK` |
| `/quality/regulatory-status` | `41` paramètres, `36` classifiables, `177` seuils actifs |
| `/quality/thresholds?type_eau=surface_generale&active_only=true` | `177` seuils |
| `DBO5=4.2 mg/L` | `CLASSIFIED`, classe `bonne` |
| `NO3=20 mg/L` | `CLASSIFIED`, résolution canonique `NO3-` |
| `O2_DISSOUS=7 mg/L` | `CLASSIFIED`, résolution canonique `O2_DISS` |
| `MO=5 mg/L` | `PARAMETRE_NON_REGLEMENTAIRE` |
| `Mo=0.01 mg/L` | `PARAMETRE_NON_REGLEMENTAIRE`, distinct de `MO` |
| `HYDROCARBURES=1 mg/L` | `NON_CLASSIFIABLE` |
| `DBO5`, `type_eau=lac` | `TYPE_EAU_NON_OPERATIONNEL` |
| legacy `water_type=surface_generale` | warning dépréciation explicite |
| `/quality/stations` | `56` stations |
| `/quality/timeseries` station test | `31` points |
| `/quality/latest?parameter=dbo5` | `56` dernières valeurs |
| `/quality/thresholds?active_only=false` | `205` seuils disponibles uniquement pour audit |

## Validation navigateur

- Route ouverte : `http://127.0.0.1:5173/dashboard-qualite-reglementaire`
- Sélection station test : `ain aicha`
- Dernière valeur DBO5 : `0.8`
- Classification affichée : `CLASSIFIED`, `Excellente`
- Graphique Recharts rendu : OK
- Changement paramètre vers `NO3` : dernière valeur `4.58`, graphique rendu, alias `NO3 -> NO3-` visible
- Message erreur API : absent

Capture : `frontend/dashboard-qualite-reglementaire-station.png`.
