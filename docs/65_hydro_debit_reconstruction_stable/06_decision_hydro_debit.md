# Décision hydro.mesure_debit

## Stratégie recommandée

**INSERT_ONLY_MISSING après correction**

## Justification

- la clé métier `(temps, station_id)` est valide
- le mapping station est complet à `100 %`
- l’unité est homogène (`m3/s`)
- la cible ne contient pas de doublons métier
- `383 412` lignes sont déjà cohérentes
- `131 013` lignes peuvent être insérées après reconstruction stable

## Blocages résiduels

- `1 553` lignes contradictoires à isoler
- `5 455` lignes backlog hors `E0` préparé actuel
- dépendance `ctid` à supprimer de la chaîne de reprise

## Décision finale

**HYDRO_DEBIT_READY_AFTER_FIX**

## Condition de passage

Avant tout mini-lot d’exécution, il faut :

1. matérialiser une source stable indépendante de `ctid`
2. sortir les `1 553` conflits du flux insérable
3. traiter les `56` erreurs de scaling comme cas QA bloquants
4. exécuter uniquement un `INSERT_ONLY_MISSING` sur le périmètre propre
