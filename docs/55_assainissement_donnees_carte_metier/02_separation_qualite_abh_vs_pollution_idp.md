# Séparation Qualité ABH vs Pollution IDP

## Qualité ABH

Supports autorisés :

```text
STATION_QUALITE
STATION_SENTINELLE
BARRAGE_QUALITE
BARRAGE_GARDE
NAPPE
PUITS
FORAGE
```

Sources autorisées :

```text
qualite.mesure_qualite_riviere
qualite.mesure_qualite_sebou
qualite.mesure_qualite_barrage
qualite.suivi_qualite_barrage_garde_hebdo
qualite.mesure_qualite_nappe
```

## Pollution IDP

Supports séparés :

```text
POINT_PRELEVEMENT_POLLUTION
SOURCE_POLLUTION
REJET
STEP
HUILERIE
DECHARGE
MINE
FOSSE_SEPTIQUE
```

Sources :

```text
qualite.source_pollution_prelevement
qualite.source_pollution_mesure_param
qualite.resultat_mesure
api.v_pollution_sites
api.v_pollution_latest_results
```

## Règle critique

```text
Ne jamais classer un point IDP pollution comme STATION_QUALITE.
```

Même si le paramètre est identique (`DBO5`, `DCO`, `MES`, `NO3`, `Cd`, `As`, `Pb`, `Hg`), le critère de séparation est la **source métier**, pas le nom du paramètre.

## Classification `data_family`

| Support | `data_family` |
|---|---|
| STATION_QUALITE | `QUALITE_ABH` |
| STATION_SENTINELLE | `QUALITE_ABH` |
| STATION_HYDRO | `HYDROLOGIE` |
| STATION_METEO | `CLIMATOLOGIE` |
| BARRAGE | `BARRAGE` |
| POINT_PRELEVEMENT_POLLUTION | `POLLUTION_IDP` |
| SOURCE_POLLUTION | `POLLUTION_IDP` |
