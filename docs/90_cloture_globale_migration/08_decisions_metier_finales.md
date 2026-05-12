# Decisions metier finales

## Parametres qualite

| Decision | Regle |
|---|---|
| `MO` | Matieres organiques |
| `Mo` | Molybdene |
| `MO_METAL` | alias legacy mappe vers `Mo` sur preuve source `Molybdene(mg/l)` |
| `NUMEROTATION` | `LEGACY_IGNORE`, non parametre qualite |
| `NTK` | Azote total Kjeldahl |
| `PT` | Phosphore total |
| `F` | Fluorures |
| `CN` | Cyanures |

La casse est metier et ne doit pas etre normalisee pour `MO` / `Mo`.

## Barrage

| Parametre | Nature | Unite |
|---|---|---|
| `DEBIT` | debit instantane | m3/s |
| `LACHER` | volume journalier | Mm3/j |
| `APPORT` | volume journalier entrant | Mm3/j |
| `TRANSFERT` | volume journalier transfere | Mm3/j |
| `VOLUME` | stockage | Mm3 |
| `NIVEAU_EAU` | niveau | m |

`RESTITUTION` est alias source de `LACHER`. `lacher_m3s` ne doit pas etre expose comme verite metier.

## Donnees lacunaires

| Cas | Decision |
|---|---|
| temperature | `DONNEE_NON_FOURNIE` |
| evaporation nulles | lacunes source, `QA_WARNING`, pas interpolation |
| pollution `valeur_raw = '-'` | valeur manquante explicite, pas zero |

## Modelisation

SWAT/WASP actuels sont `LEGACY_MODELING_TO_REPLACE`.
