# Volumes E1 recalcules sans IDP

## Synthese

- volume E1 avant exclusion IDP : `3318316`
- volume IDP exclu : `776`
- volume E1 final a migrer : `3317540`
- volume quarantaine E0 hors E1 : `399727`

## Volumes par domaine

- `hydro` : `998063`
- `meteo` : `2141979`
- `qualite` : `176615`
- `inventaire/pollution` : `883`

## Lecture metier

L'exclusion des 4 tables `IDP 2024` retire uniquement les lignes encore presentes dans
`qa_dry_run.e0_mesures_preparees`, sans modifier les autres domaines. Le volume retire
du lot `E1` correspond a `raw_idp_2024_mesures_qualite_globale` (`776` lignes preparees).
Les trois autres tables `IDP 2024` n'avaient deja aucune ligne preparee dans `E0`.
