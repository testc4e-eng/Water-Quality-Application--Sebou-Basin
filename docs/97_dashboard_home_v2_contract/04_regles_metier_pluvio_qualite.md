# Règles métier pluvio / qualité

## Pré-requis 1 — Pluvio

### Constat

`api.v_meteo_precipitation_journalier_qa` mélange actuellement des stations typées :

- `hydrologique`
- `pluviometrique`
- `barrage`

### Règle temporaire

Libellé obligatoire :

- `Données pluie disponibles`

Libellé interdit tant que la typologie n'est pas consolidée :

- `Stations pluviométriques validées`

### Règle cible

Créer une vue ou un contrat home-ready n'exposant que les stations pluie validées métier.

Nom recommandé :

- `api.v_home_rainfall_stations_ready`

ou exposer la même logique directement dans le futur service `dashboard/home`.

## Pré-requis 2 — Qualité journalière

### Constat

Le home opérationnel repose sur un réseau quotidien de `6` stations actives dans `qualite.mesure_qualite_sebou`.

### Vocabulaire obligatoire

Libellés autorisés :

- `Stations sentinelles qualité`
- `Réseau qualité quotidien`

Libellé interdit :

- `Seulement 6 stations qualité`

### Contrat métier recommandé

Pour chaque station sentinelle, exposer :

- `station_id`
- `station_name`
- `date_derniere_mesure`
- `classe_qualite`
- `parametre_critique`
- `valeur_critique`
- `unite`
- `tendance`

## Température

### Règle absolue

- `AIR_TEMPERATURE != WATER_TEMPERATURE`

### Climat

Sources valides :

- `meteo.mesure_temperature`
- `api.v_meteo_temperature`

### Qualité eau

Sources valides :

- `T_EAU`
- `api.v_qualite_terrain`

### Interdictions

- ne jamais utiliser `T_EAU` pour le climat ;
- ne jamais utiliser la température météo pour qualifier l'eau.
