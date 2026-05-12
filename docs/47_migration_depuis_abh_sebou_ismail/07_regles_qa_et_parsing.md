# Règles QA et parsing

## Règles de parsing
| Cas | Règle | Flag |
|---|---|---|
| `3,4x102` | convertir en `3.4 × 10² = 340` | `SCIENTIFIC_NOTATION_CONVERTED` |
| `1,5.102` | convertir en `1.5 × 10² = 150` | `SCIENTIFIC_NOTATION_CONVERTED` |
| `<0,005` | convertir en `0.005` et conserver l’information de limite | `BELOW_DETECTION_LIMIT` |
| `>x` | convertir en `x` et conserver l’information de limite | `ABOVE_DETECTION_LIMIT` |
| virgule décimale | convertir la virgule en point | `DECIMAL_COMMA_CONVERTED` |
| texte non interprétable | envoyer en quarantaine | `NON_NUMERIC_QUARANTINE` |
| NULL qualité / évaporation / précipitation | ne pas migrer | `NULL_REJECTED` |
| débit négatif | accepter avec flag si confirmé métier | `NEGATIVE_ACCEPTED` |

## Flags proposés
- `VALID`
- `DECIMAL_COMMA_CONVERTED`
- `SCIENTIFIC_NOTATION_CONVERTED`
- `BELOW_DETECTION_LIMIT`
- `ABOVE_DETECTION_LIMIT`
- `NON_NUMERIC_QUARANTINE`
- `NULL_REJECTED`
- `UNIT_CONFLICT`
- `UNIT_MISSING`
- `PARAMETER_UNMAPPED`
- `PARAMETER_AMBIGUOUS`
- `SUSPECT_OUTLIER`
- `NEGATIVE_ACCEPTED`

## Application
Ces règles sont intégrées au workflow, mais leur exécution reste conditionnée par validation humaine table par table.
