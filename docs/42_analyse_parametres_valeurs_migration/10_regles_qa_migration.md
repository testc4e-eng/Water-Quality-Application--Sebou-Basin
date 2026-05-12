# Règles QA migration

## Règles générales
- NULL qualité : ne pas migrer
- NULL évaporation : ne pas migrer
- NULL précipitation : ne pas migrer
- débit négatif : migrer avec flag après validation métier
- valeur non numérique non interprétable : quarantaine
- valeur `<x` : migrer `x` avec flag `BELOW_DETECTION_LIMIT` si validé métier
- valeur `>x` : migrer `x` avec flag `ABOVE_DETECTION_LIMIT` si validé métier
- valeur avec virgule décimale : convertir en point avant migration
- valeur aberrante : quarantaine ou flag selon décision validée
- paramètre non mappé : ne pas migrer vers le référentiel cible tant que le mapping n’est pas validé
- paramètre ambigu : quarantaine avant migration

## Flags proposés
- `VALID`
- `NULL_REJECTED`
- `BELOW_DETECTION_LIMIT`
- `ABOVE_DETECTION_LIMIT`
- `NON_NUMERIC_QUARANTINE`
- `UNIT_CONFLICT`
- `SUSPECT_OUTLIER`
- `NEGATIVE_ACCEPTED`
- `PARAMETER_UNMAPPED`
- `PARAMETER_AMBIGUOUS`
