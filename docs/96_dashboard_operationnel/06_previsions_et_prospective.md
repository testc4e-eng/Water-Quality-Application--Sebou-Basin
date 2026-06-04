# Prévisions et prospective

## Objectif

Préparer l'étape où le SAD ne se contente plus d'observer, mais commence à anticiper :

- la pluie ;
- les débits ;
- les risques qualité.

## Tableau comparatif

| Source | Ce qu'elle apporte | Résolution / fréquence | Coût | Intérêt SAD | Limites | Recommandation |
|---|---|---|---|---|---|---|
| `Open-Meteo` | prévisions météo simples | jusqu'à 16 jours, hourly | gratuit | très forte valeur court terme | API externe, pas hydrologique | `P1 immédiat` |
| `GPM IMERG` | pluie quasi temps réel satellite | 0.1°, demi-heure, NRT | gratuit | excellent pour zones sans station | produit grille, pas station | `P1 immédiat` |
| `CHIRPS` | pluie historique longue | 0.05°, 1981→présent | gratuit | très fort pour climatologie et gap filling | pas une prévision | `P1` |
| `ERA5-Land` | réanalyse météo / surface | 0.1°, hourly, 1950→présent | gratuit | très fort pour reconstitution et features | pas du temps réel capteur | `P2` |
| `Copernicus CEMS / GloFAS` | débits prévisionnels globaux | daily, jusqu'à 30 jours | gratuit | utile pour veille hydrologique régionale | maille globale, pas barrage local | `P2 pilote` |

## Détail par source

### ERA5-Land

Source officielle :

- [ERA5-Land hourly data from 1950 to present](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land?tab=overview)

Constats officiels :

- résolution `0.1° x 0.1°`, native `9 km`
- fréquence `hourly`
- couverture `1950 to present`
- mise à jour `daily`

Intérêt métier :

- reconstituer des séries manquantes ;
- produire des variables d'entrée ML ;
- construire des normales climatiques.

Limite :

- réanalyse, pas mesure locale directe.

### CHIRPS

Source officielle :

- [CHIRPS](https://www.chc.ucsb.edu/data/chirps)

Constats officiels :

- pluie quasi-globale ;
- `1981 to near-present`
- résolution `0.05°`
- conçu pour tendance et suivi sécheresse.

Intérêt métier :

- combler les trous pluviométriques ;
- produire des cumuls et normales saisonnières ;
- comparer stations ABHS vs grille.

Limite :

- pas une prévision ;
- grille spatiale, pas station terrain.

### GPM IMERG

Source officielle :

- [NASA IMERG](https://gpm.nasa.gov/data/imerg)

Constats officiels :

- quasi temps réel ;
- mise à jour toutes les `30 minutes`
- résolution `0.1°`
- adapté aux applications faible latence.

Intérêt métier :

- surveillance pluie rapide ;
- couverture des zones sans station ;
- détection d'épisodes intenses.

Limite :

- intensité satellite, pas équivalent à une station ;
- nécessite une stratégie de calibration locale.

### Open-Meteo

Source officielle :

- [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs)

Constats officiels :

- prévisions jusqu'à `16 days`
- variables hourly :
  - température ;
  - humidité ;
  - précipitation ;
  - vent ;
  - ET0.

Intérêt métier :

- la meilleure entrée simple pour un premier module prévisionnel ;
- pas de pipeline lourd ;
- utile pour dashboard DG et alertes courtes.

Limite :

- dépendance API externe ;
- qualité variable selon le modèle sous-jacent.

### Copernicus CEMS / GloFAS

Source officielle :

- [GloFAS forecast dataset](https://ewds.climate.copernicus.eu/datasets/cems-glofas-forecast?tab=overview)

Constats officiels :

- prévisions `daily`
- horizon jusqu'à `30 days`
- grille `0.05° x 0.05°` pour la version 4
- variable principale : `river discharge`

Intérêt métier :

- veille hydrologique amont ;
- anticipation crue / hautes eaux ;
- comparaison avec stations locales.

Limite :

- produit global maillé ;
- insuffisant seul pour piloter un barrage ou une station locale ;
- doit rester un signal complémentaire.

## Recommandation de priorité

### Priorité 1

- `Open-Meteo`
- `GPM IMERG`

### Priorité 2

- `CHIRPS`
- `ERA5-Land`

### Priorité 3

- `GloFAS`

## Décision

Pour une équipe de 2 personnes :

- commencer par prévision météo simple et surveillance pluie satellite ;
- ne pas ouvrir immédiatement un chantier de modélisation hydrologique lourd.
