# Decision qualite sebour

## Statut

**QUALITE_SEBOU_REMIGREE_OK**

## Justification

- backup cree : `oui`
- lignes supprimees par reset : `10955`
- lignes remigrees : `49954`
- doublons restants : `0`
- lignes ecartees : `0`

## Garde-fous respectes

- aucune action sur `hydro.*` hors lecture de controle
- aucune action sur `meteo.*`
- aucune action sur les autres tables `qualite.*`
- aucune action sur `infra.*`, `geo.*`, `metadata.*`, `IDP`
- audit stable base sur `source_row_hash` et `target_business_key_hash`
