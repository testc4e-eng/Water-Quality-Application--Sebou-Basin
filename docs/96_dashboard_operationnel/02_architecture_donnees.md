# Architecture données

## Principe

La stratégie données du dashboard opérationnel repose sur trois classes :

1. **disponible aujourd'hui** ;
2. **disponible après ingestion / consolidation** ;
3. **disponible après intégration externe**.

## 1. Disponible aujourd'hui

### Barrages

| Usage | Source principale | Source d'exposition recommandée | Statut |
|---|---|---|---|
| inventaire barrages | `infra.barrages` | `api.v_barrage_dimension` | disponible |
| apports journaliers | `hydro.mesure_barrage_param` | `api.v_hydro_barrage_param_journalier` | disponible |
| lâchers journaliers | `hydro.mesure_barrage_param` | `api.v_hydro_barrage_param_journalier` | disponible |
| niveau journalier | `hydro.mesure_barrage_param` | `api.v_hydro_barrage_param_journalier` | disponible |

Remarque :

- éviter `infra.barrages.apports_hm` comme source opérationnelle du home ;
- préférer la série journalière consolidée par paramètre.

### Hydro

| Usage | Source principale | Source d'exposition recommandée | Statut |
|---|---|---|---|
| débits journaliers | `hydro.mesure_debit` | `api.v_hydro_debit_journalier_qa` | disponible |
| dimension stations | `api.v_station_dimension` | `api.v_station_dimension` | disponible |

### Pluvio

| Usage | Source principale | Source d'exposition recommandée | Statut |
|---|---|---|---|
| précipitations journalières | `meteo.mesure_precipitation` | `api.v_meteo_precipitation_journalier_qa` | disponible |
| dimension stations | `api.v_station_dimension` | `api.v_station_dimension` | disponible mais typologie à corriger |

### Qualité journalière

| Usage | Source principale | Source d'exposition recommandée | Statut |
|---|---|---|---|
| 6 stations qualité journalières | `qualite.mesure_qualite_sebou` | endpoint dédié futur home / vue dédiée | disponible |
| température eau | `api.v_qualite_terrain` avec `code_parametre='T_EAU'` | endpoint dédié futur | disponible avec support à consolider |
| température air | `meteo.mesure_temperature` ou `api.v_meteo_temperature` | endpoint climat dédié | disponible, hors qualité eau |

## 2. Disponible après ingestion / consolidation

### Qualité opérationnelle home

Problème actuel :

- `api.v_qualite_terrain` expose `T_EAU` et `T_AIR`, mais `support_nom` ressort vide sur les lignes observées ;
- cela empêche de faire un bloc home robuste sans consolidation complémentaire.

Action recommandée :

- créer un contrat d'exposition dédié aux 6 stations qualité journalières ;
- exposer explicitement :
  - station ;
  - date ;
  - paramètre critique ;
  - classe qualité ;
  - dernière valeur.

### Typologie pluvio

Problème actuel :

- la vue pluie QA mélange des stations `hydrologique`, `pluviometrique` et `barrage`.

Action recommandée :

- créer une vue opérationnelle `pluvio_home_ready` fondée sur un mapping métier clair des stations pluie.

## 3. Disponible après intégration externe

### Prévisions météo / hydro

À intégrer plus tard :

- `ERA5-Land`
- `CHIRPS`
- `GPM IMERG`
- `Open-Meteo`
- `Copernicus CEMS / GloFAS`

Rôle :

- combler les trous ;
- enrichir la carte ;
- préparer les alertes et tendances futures ;
- alimenter un module prévisionnel.

## Règle température

### AIR_TEMPERATURE

Sources valides :

- `meteo.mesure_temperature`
- `api.v_meteo_temperature`

Usage :

- météo ;
- climat ;
- prévisions ;
- tendances climatiques.

### WATER_TEMPERATURE

Sources valides :

- `T_EAU`
- `api.v_qualite_terrain`

Usage :

- qualité de l'eau ;
- corrélations qualité ;
- suivi stations qualité.

### Interdiction

- ne jamais dériver un indicateur climat à partir de `T_EAU` ;
- ne jamais dériver un indicateur qualité de l'eau à partir de `meteo.mesure_temperature`.

## Décision de modélisation

Pour le home opérationnel :

- barrages : **OK aujourd'hui**
- hydro : **OK aujourd'hui**
- pluvio : **OK avec réserve typologie**
- qualité journalière : **OK avec contrat d'exposition dédié à stabiliser**
