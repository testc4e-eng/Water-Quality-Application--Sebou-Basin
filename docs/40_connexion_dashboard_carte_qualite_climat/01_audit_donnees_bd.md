# Audit Données BD

## Contexte

Audit réalisé en lecture seule sur `abh_sad` via PostgreSQL local :

- `qualite.mesure_qualite_sebou`
- `qualite.mesure_qualite_riviere`
- `qualite.suivi_qualite_barrage_garde_hebdo`
- `infra.stations_mesure`
- `api.v_station_dimension`
- `meteo.mesure_precipitation`
- `meteo.mesure_temperature`
- `hydro.mesure_debit`

## Volumétries constatées

- `qualite.mesure_qualite_sebou` : `49 954`
- `qualite.mesure_qualite_riviere` : `59 535`
- `qualite.suivi_qualite_barrage_garde_hebdo` : `1 780`
- `meteo.mesure_precipitation` : `546 008`
- `meteo.mesure_temperature` : `437 889`
- `hydro.mesure_debit` : `652 451`

## 6 stations qualité réelles utilisées

Source retenue pour l’accueil : `qualite.mesure_qualite_sebou`.

1. `aval rejet sucrerie bel ksiri` (`3695/8`)  
   `station_id=710cbf59-4303-4d7c-8173-1083560eef5a`
2. `amont barrage de garde` (`3738/8`)  
   `station_id=c1299320-3bdb-4bb3-8bbf-0f9dc3ca71ef`
3. `P29 a allal tazi` (`1355/8`)  
   `station_id=01f1a32a-f424-4f5b-ab26-6cb57a601d81`
4. `dar el arsa` (`2263/15`)  
   `station_id=706fc2fe-3cee-4ec2-8e85-dbde9b672f89`
5. `pont rp 26` (`1541/15`)  
   `station_id=d098a56d-7e97-453f-b1c0-32305b595087`
6. `azib soltane` (`1540/15`)  
   `station_id=b647955a-e26d-4564-8509-25cb40ef1404`

## Couverture qualité observée

- nombre de stations dans `qualite.mesure_qualite_sebou` : `6`
- période observée : `2023-12-07` à `2026-01-06`
- paramètres visibles : `13`
- exemples de paramètres récents :
  - `pH`
  - `O2_dissous`
  - `DBO5`
  - `DCO`
  - `Nitrates`
  - `Ammonium`
  - `Conductivité`
  - `T_eau`

## Séries météo / hydro observées

- pluie :
  - table : `meteo.mesure_precipitation`
  - stations : `48`
  - période : `1985-09-01` à `2026-06-06`
- température :
  - table : `meteo.mesure_temperature`
  - stations : `36`
  - période : `1983-01-01` à `2026-06-10`
- débit :
  - table : `hydro.mesure_debit`
  - stations : `39`
  - période : `1956-09-01` à `2026-06-06`

## Écarts utiles pour le frontend

- le bloc qualité Home utilisait encore des cartes fictives `Station sentinelle 01..06`
- le popup carte métier n’interrogeait pas les tables de mesures pour les supports station
- la tendance température n’était pas branchée
- la pluie et le débit pouvaient apparaître vides ou trompeurs sans expliciter l’absence réelle de points
