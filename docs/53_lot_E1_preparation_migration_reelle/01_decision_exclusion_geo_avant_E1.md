# Decision d'exclusion geo avant E1

## Decisions appliquees

1. `311` lignes IDP sans `X/Y` sont exclues temporairement.
2. `3790` lignes IDP ambiguës restent en backlog d'arbitrage.
3. `3982` lignes IDP orphelines avec `X/Y` restent exclues.
4. `399727` lignes deja en quarantaine `E0` restent hors `E1`.
5. `2824` lignes de support geo sans mapping mesure actif restent hors `E1`.

## Justification metier

- Les lignes sans `X/Y` ne permettent aucun rattachement geo fiable.
- Les lignes IDP ambiguës ont plusieurs candidats geo concurrents ; elles exigent un arbitrage metier.
- Les lignes IDP orphelines restent sans entite geo valide malgre la regle `<= 2 m`.
- Les lignes en quarantaine `E0` sont deja qualifiees comme non migrables en l'etat.
- Les tables de support geo ne relevent pas du lot mesure `E1`.

## Impact sur E1

- volume prepare `E0` : `3318316`
- volume eligible `E1` : `3318316`
- volume exclu geo (backlog + support) : `10907`
- volume quarantaine `E0` : `399727`
- delta attendu `E1` : `0`
