# Controle apres rollback

## Volumes

- volume `qualite.mesure_qualite_sebou` apres rollback : `10955`
- volume attendu si rollback strict avait ete parfait : `51402`
- ecart vs attendu : `-40447`
- lignes E1 restantes dans `qualite.mesure_qualite_sebou` : `0`
- doublons naturels apres rollback : `0`
- `hydro.mesure_debit_source` conserve : `oui`
- volume `hydro.mesure_debit_source` apres rollback cible : `3978`

## Controle de perimetre

- aucune suppression dans `hydro.mesure_debit_source`
- aucune action sur `infra.*`
- aucune action sur `geo.*`
- aucune action sur `metadata.*`
- aucune action sur `IDP`

## Alerte critique

Le volume `qualite.mesure_qualite_sebou` est tombe a `10955` au lieu de `51402`.
Le rollback a donc supprime des donnees historiques hors perimetre E1.

## Echantillon de collision `ctid`

- `(13,11)` repete `108` fois
- `(13,12)` repete `108` fois
- `(13,13)` repete `108` fois
- `(13,14)` repete `108` fois
- `(13,15)` repete `108` fois
- `(13,16)` repete `108` fois
- `(13,17)` repete `108` fois
- `(13,18)` repete `108` fois
- `(13,19)` repete `108` fois
- `(13,20)` repete `108` fois
- `(13,21)` repete `108` fois
- `(13,10)` repete `107` fois
- `(13,22)` repete `107` fois
- `(13,23)` repete `107` fois
- `(13,24)` repete `107` fois
- `(13,25)` repete `107` fois
- `(13,26)` repete `107` fois
- `(13,27)` repete `107` fois
- `(13,28)` repete `107` fois
- `(13,29)` repete `107` fois
