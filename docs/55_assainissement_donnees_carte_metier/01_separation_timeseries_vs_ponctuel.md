# Séparation séries temporelles vs données ponctuelles

## Règle métier

### Série temporelle (`TIME_SERIES`)

Une donnée est considérée comme `TIME_SERIES` si elle respecte au minimum :

```text
même objet + même paramètre + plusieurs dates de mesure + période temporelle exploitable
```

Critères appliqués côté SQL :

```text
measure_count >= 10
date_count >= 5
date_min != date_max
```

### Donnée ponctuelle (`POINT_MEASURE`)

Une donnée est considérée comme `POINT_MEASURE` si :

```text
measure_count < 10 ou date_count < 5 ou date_min = date_max
```

Elle n'ouvre pas un graphique temporel par défaut. Elle affiche plutôt :

```text
dernière valeur
date
paramètre
unité
source
contexte campagne
table attributaire
```

## Implémentation SQL

Vue `api.mv_business_map_availability` :

```sql
CASE 
    WHEN data_family = 'POLLUTION_IDP' THEN 'POINT_MEASURE'
    WHEN measure_count >= 10 AND date_count >= 5 AND date_min <> date_max THEN 'TIME_SERIES'
    WHEN measure_count > 0 THEN 'POINT_MEASURE'
    ELSE 'NO_DATA'
END AS data_temporality
```

> La famille `POLLUTION_IDP` prime sur le critère statistique : même si un point IDP a beaucoup de mesures étalées, il reste une donnée de campagne/source ponctuelle par nature métier.
