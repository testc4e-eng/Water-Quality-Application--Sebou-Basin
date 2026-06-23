# Limites et arbitrages

## Limites connues

1. **Classification statique par support** : la règle `POLLUTION_IDP = POINT_MEASURE` est une décision métier. Si à l'avenir des campagnes IDP deviennent de véritables séries temporelles, il faudra affiner la règle au niveau objet/paramètre.

2. **Critère `TIME_SERIES`** : `measure_count >= 10 AND date_count >= 5` est un seuil empirique. Il peut être ajusté par le métier.

3. **Source IDP pollution** : il existe deux sources :
   - `POINT_PRELEVEMENT_POLLUTION` : `qualite.source_pollution_mesure_param` + `qualite.source_pollution_prelevement`
   - `SOURCE_POLLUTION` : `qualite.resultat_mesure` + `geo.ref_site_pollution`
   
   Le service `PollutionSeriesProvider` est branché sur la source prélevement. Le support `SOURCE_POLLUTION` (sites) n'a pas encore de provider de séries dédié.

## Arbitrages à valider

1. **Seuil `TIME_SERIES`** : confirmer `measure_count >= 10` et `date_count >= 5` avec le métier.
2. **Libellés** : valider les libellés `data_family` (`QUALITE_ABH`, `POLLUTION_IDP`) et `measurement_context`.
3. **Source pollution site** : décider si `SOURCE_POLLUTION` doit aussi retourner des valeurs ponctuelles via un provider dédié.

## Prochaines étapes

1. Valider les tests métier sur `/dashboard-carto-metier`.
2. Étendre la classification aux supports futurs (`BARRAGE_QUALITE`, `NAPPE`, etc.).
3. Stabiliser le provider `SOURCE_POLLUTION` si besoin.
