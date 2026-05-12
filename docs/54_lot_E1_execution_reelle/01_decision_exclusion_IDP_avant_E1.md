# Decision d'exclusion IDP avant E1

## Decision metier appliquee

Les 4 tables `IDP 2024` sont retirees completement du lot `E1` :

- `staging.raw_idp_2024_mesures_qualite_globale`
- `staging.raw_idp_2024_mesures_qualite_marche_cadre`
- `staging.raw_idp_2024_src_pollution_globale`
- `staging.raw_idp_2024_src_pollution_marche_cadre`

## Justification

- ces tables ne doivent pas etre forcees dans les tables finales `qualite.*`
- elles seront traitees comme couches geographiques dediees dans un lot separe `IDP-GEO`
- le lot `E1` doit rester focalise sur les mesures et inventaires deja qualifies dans `E0`

## Impact chiffre

- volume `E1` avant exclusion : `3318316`
- volume `IDP` exclu du scope `E1` : `776`
- volume `E1` final sans `IDP` : `3317540`

## Regle d'execution

Aucune requete d'insertion finale `E1` ne doit reference les 4 tables `IDP 2024`.
Les cas `IDP` restent hors migration finale jusqu'a validation du lot `IDP-GEO`.
