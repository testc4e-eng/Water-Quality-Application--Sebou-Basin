# Rapport pre-migration — referentiel consolide

## Synthese

- Taux de mapping final exploitable (perimetre mesures client uniquement) : **100.0%**
- Lignes de mapping scope `MESURE` : **448**
- Lignes pretes a migrer (`MIGRER` + `MIGRER_AVEC_FLAG`) : **448**
- Volume pret a migrer : **3729256**
- Volume en quarantaine : **0**
- Decision pre-migration : **PRET POUR LOT E**

## Parametre master final

| Statut | Nombre |
|---|---:|
| A_VALIDER | 11 |
| NON_RECONNU | 61 |
| QUARANTAINE | 2 |
| VALID_WITH_QA | 122 |

## Mapping final

| Action | Nombre lignes | Volume total |
|---|---:|---:|
| MIGRER | 194 | 634170 |
| MIGRER_AVEC_FLAG | 254 | 3095086 |
| QUARANTAINE | 66 | 77 |
| A_VALIDER_MODELE | 11 | 0 |

## Conversions et hypotheses appliquees

| Type | Nombre de lignes |
|---|---:|
| UNIT_ASSUMED | 227 |
| UNIT_CONVERTED | 23 |

## Regles majeures appliquees

- `Hg` et `H_G` separent explicitement Mercure vs Huiles/Graisses.
- `MO` et `Mo` separent explicitement Matiere organique vs Molybdène.
- `RS105` et `RS185` fusionnes vers `RESIDUS_SECS` avec attribut `temperature_reference`.
- `Debit_m`, `Debit_jr`, `debit_l_s`, `Q` fusionnes vers `DEBIT` avec attribut `time_step`.
- Unites source manquantes remplacees par l unite standard metier avec flag `UNIT_ASSUMED`.
- Conversions preparees : `L/s -> m3/s`, `°F -> meq/L`, `µg/L -> mg/L`.
- Valeurs `<x` et `>x` conservees en preparation via flags `INFERIEUR` / `SUPERIEUR`.

## Anomalies restantes

- Sorties modeles SWAT/WASP conservees hors perimetre client avec action `A_VALIDER_MODELE`.
- Parametres exclus par retour metier : `FM`, `MD` -> `QUARANTAINE`.
- Lignes de type `raw_types_mesures` sans colonne valeur classees hors migration de mesures.

## Controle

| Controle | Resultat |
|---|---|
| Aucune table metadata creee | OK |
| Aucun SQL actif | OK |
| Aucune modification BD | OK |
| Volumes raw preserves, preparation documentaire uniquement | OK |
