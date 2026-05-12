# Harmonisation APPORT - Controles

## Controles post-migration

| Controle | Resultat |
|---|---:|
| lignes `APPORTS_HM3` restantes | 0 |
| lignes `APPORT` | 84820 |
| reference canonique `APPORT` active | 1 |
| reference canonique `APPORTS_HM3` active | 0 |
| unites incoherentes | 0 |
| lignes orphelines referentiel | 0 |
| doublons metier | 0 |
| collisions hash metier | 0 |
| lignes vue API parametrique | 272652 |
| lignes dashboard barrage | 272652 |
| controle SQL latest `APPORT` | 10 entites |
| controle SQL timeseries `APPORT` | 10 lignes echantillon |

## Distribution API

| Parametre | Metric | Unite | Volume |
|---|---|---|---:|
| `APPORT` | `apport` | `Mm3/j` | 84820 |

## Distribution dashboard barrage

| Variable | Unite | Volume |
|---|---|---:|
| `apport` | `Mm3/j` | 84820 |
| `lacher_barrage` | `Mm3/j` | 84830 |
| `niveau_barrage` | `m` | 84831 |
| `transfert` | `Mm3/j` | 8035 |
| `volume_barrage` | `Mm3` | 10136 |

## Audit DB

| Champ | Valeur |
|---|---|
| statut | `SUCCESS` |
| rows_before | 84820 |
| rows_after | 84820 |
| value_delta_max | 0 |
| unit_errors | 0 |
| orphan_param_rows | 0 |
| metadata_ref_rows | 1 |
