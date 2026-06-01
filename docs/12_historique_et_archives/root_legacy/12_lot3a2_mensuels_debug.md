# LOT 3A-2 : Rapport de Débogage sur Flux Mensuels

Ce sous-lot explique pourquoi la totalité métrique mensuelle (19k lignes) s'est effondrée en refus (WOULD_CONFLICT).

## 1. Topologie de l'Objectif de Matching
- **Structure Target** : La table d'agrégation `hydro.mesure_debit_mensuel` requiert `(station_id, bucket_month)` pour lier la valeur moyenne.
- **La table Sandbox** `mesures_debit_m` fournit `(ire_station, mois, annee, debit_m)`.

###  Aperçu de ce que le dictionnaire cible attendait (Format Python) :
- Clé : `(0436c345-452d-4239-a3e3-2842fd3ab7b1, '1995-09-01')` -> Valeur : `8.442520833`
- Clé : `(0436c345-452d-4239-a3e3-2842fd3ab7b1, '1995-10-01')` -> Valeur : `13.54322923`
- Clé : `(0436c345-452d-4239-a3e3-2842fd3ab7b1, '1995-11-01')` -> Valeur : `17.24026817`
- Clé : `(0436c345-452d-4239-a3e3-2842fd3ab7b1, '1995-12-01')` -> Valeur : `44.35953326`
- Clé : `(0436c345-452d-4239-a3e3-2842fd3ab7b1, '1996-01-01')` -> Valeur : `228.3590295`

## 2. Tableau Diagnostique d'Échantillons de Conflit
| Code Source (`ire_station`) | ID Cible Obtenu | Dt Brute (`annee`/`mois`) | Clé Formattée tentée | Debit Source | Raison de l'Échec |
|---|---|---|---|---|---|
| `581/22` | `7e3c2f7a-cf6a-47a9-bafb-8dd4e3a68d78` | `1935/Février` | `` | `17.53347059` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Février'` |
| `581/22` | `7e3c2f7a-cf6a-47a9-bafb-8dd4e3a68d78` | `1939/Mars` | `` | `27.22322581` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Mars'` |
| `581/22` | `7e3c2f7a-cf6a-47a9-bafb-8dd4e3a68d78` | `1939/Avril` | `` | `71.04573333` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Avril'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1949/Septembre` | `` | `1.6483381` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Septembre'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1949/Octobre` | `` | `1.572644968` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Octobre'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1949/Novembre` | `` | `1.9767738` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Novembre'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1949/Décembre` | `` | `2.547757581` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Décembre'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1950/Janvier` | `` | `3.296767935` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Janvier'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1950/Février` | `` | `4.210963821` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Février'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1950/Mars` | `` | `5.335621258` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Mars'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1950/Avril` | `` | `4.571055` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Avril'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1950/Mai` | `` | `6.01415` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Mai'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1950/Juin` | `` | `2.031097633` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Juin'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1950/Juillet` | `` | `1.373914032` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Juillet'` |
| `582/22` | `83d3c62f-4017-4188-b953-a7158860ffd6` | `1950/Août` | `` | `1.308386097` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Août'` |
| `260/9` | `517c713a-dda4-4dcb-a033-4143062487fd` | `1952/Janvier` | `` | `31.12666667` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Janvier'` |
| `260/9` | `517c713a-dda4-4dcb-a033-4143062487fd` | `1952/Février` | `` | `32.82413793` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Février'` |
| `260/9` | `517c713a-dda4-4dcb-a033-4143062487fd` | `1952/Mars` | `` | `19.67419355` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Mars'` |
| `260/9` | `517c713a-dda4-4dcb-a033-4143062487fd` | `1952/Avril` | `` | `33.71333333` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Avril'` |
| `260/9` | `517c713a-dda4-4dcb-a033-4143062487fd` | `1952/Mai` | `` | `33.10967742` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Mai'` |
| `260/9` | `517c713a-dda4-4dcb-a033-4143062487fd` | `1952/Juin` | `` | `10.03666667` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Juin'` |
| `260/9` | `517c713a-dda4-4dcb-a033-4143062487fd` | `1952/Juillet` | `` | `4.188387097` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Juillet'` |
| `260/9` | `517c713a-dda4-4dcb-a033-4143062487fd` | `1952/Août` | `` | `2.872580645` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Août'` |
| `260/9` | `517c713a-dda4-4dcb-a033-4143062487fd` | `1952/Septembre` | `` | `3.094333333` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Septembre'` |
| `260/9` | `517c713a-dda4-4dcb-a033-4143062487fd` | `1952/Octobre` | `` | `0.979101` | `DATE FORMAT ERROR: invalid literal for int() with base 10: 'Octobre'` |

## 3. Analyse de la Vraie Cause
- Si l'ID cible est None : Mismatch critique entre le tableau stations_mesure de production et l'ire_station des débits mensuels. *Bizarre : l'hydrologie infra_journalière passait ce check !!*
- Si Format est DATE/ID NOT IN TARGET : La date est formattée différement dans la BDD (ex: la BDD est au 15 du mois `YYYY-MM-15` ou la Prod contient-elle moins de lignes que prévu ou aucune ?) 
