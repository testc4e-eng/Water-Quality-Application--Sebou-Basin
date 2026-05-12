# Données problématiques — Bloc Données

## 1. Résumé du bloc

Le bloc données distingue clairement quatre situations :

- donnée présente mais incomplète ;
- donnée présente mais incohérente ;
- donnée présente mais partielle ;
- donnée absente de la base.

Les constats principaux confirmés en base sont :

- `16 803` lignes qualité avec valeur nulle ;
- `10 308` lignes d'évaporation sans valeur ;
- `45 702` lignes de précipitation sans valeur observée mais avec valeur alternative ;
- `1 931` débits négatifs ;
- `0` ligne de température.

## 2. Méthode d'extraction

Documents utilisés :

- `A08_donnees_qualite_null.md`
- `A09_donnees_meteo_manquantes.md`
- `A10_temperature_non_disponible.md`
- `A14_donnees_extremes_aberrantes.md`
- `docs/34_synthese_strategique_anomalies/03_bloc_donnees.md`

Tables inspectées :

- `qualite.mesure_qualite_riviere`
- `qualite.mesure_qualite_nappe`
- `qualite.mesure_qualite_barrage`
- `qualite.mesure_qualite_sebou`
- `qualite.suivi_qualite_barrage_garde_hebdo`
- `meteo.mesure_precipitation`
- `meteo.mesure_evaporation`
- `meteo.mesure_temperature`
- `hydro.mesure_debit`
- `hydro.mesure_debit_mensuel`

Requêtes utilisées :

- comptage des `NULL` ;
- comptage des valeurs négatives ;
- contrôle min / max ;
- repérage des séries météo partielles par station ;
- contrôle de présence de la température.

Limites :

- l'identification des "valeurs extrêmes" reste ici un diagnostic métier et non une règle statistique définitive ;
- certaines valeurs très fortes peuvent être réelles, codées, ou relever d'une autre unité ;
- la température est classée comme manque de données, pas comme anomalie technique.

## 3. Tableau global des données problématiques

| Entité / variable | Type problème | Domaine | Volume BD | Exemple valeur | Station / zone | Date exemple | Table | Anomalie source | Décision attendue | Priorité |
|---|---|---|---:|---|---|---|---|---|---|---|
| valeurs qualité nulles | NULL | qualité | 16 803 | `[vide]` | plusieurs stations | plusieurs périodes | tables `qualite.*` | A08 | décider si ces lignes sortent des synthèses métier | Élevée |
| valeurs nulles barrage hebdo | NULL | qualité barrage | 3 579 | `[vide]` | barrage garde / Sebou | plusieurs périodes | `qualite.suivi_qualite_barrage_garde_hebdo` | A08 | exclure ou conserver comme trace | Moyenne |
| valeurs nulles barrage | NULL | qualité barrage | 3 579 | `[vide]` | plusieurs barrages | plusieurs périodes | `qualite.mesure_qualite_barrage` | A08 | exclure ou conserver comme trace | Moyenne |
| valeurs nulles Sebou | NULL | qualité Sebou | 9 645 | `[vide]` | plusieurs stations Sebou | plusieurs périodes | `qualite.mesure_qualite_sebou` | A08 | exclure ou conserver comme trace | Élevée |
| évaporation sans valeur | NULL ; partiel | météo | 10 308 | `[vide]` | barrages et stations météo | 2013-07-06 à 2024-08-31 selon station | `meteo.mesure_evaporation` | A09 | définir le niveau de complétude acceptable | Élevée |
| précipitation sans observé mais avec alternative | partiel | météo | 45 702 | observé `[vide]`, NASA `0.62`, rempli `0.5603864` | plusieurs stations | 1985-09-03 à 2024-08-31 selon station | `meteo.mesure_precipitation` | A09 | distinguer en réunion données observées et alternatives | Élevée |
| température | absent ; non injecté | météo | 0 | aucune donnée | ensemble du périmètre | toutes périodes | `meteo.mesure_temperature` | A10 | confirmer source et priorité d'injection | Critique |
| débits négatifs | négatif ; incohérent | hydro | 1 931 | `-2`, `-1` | `ait khabbach`, `my ali cherif`, autres | 1962-12-26 à 1998-06-30 | `hydro.mesure_debit` | A14 | valider la règle de traitement | Critique |
| CF négatif | négatif ; incohérent | qualité | 1 cas confirmé | `-0.4` | `dar el arsa` | 2006-12-05 | `qualite.mesure_qualite_riviere` | A03, A14 | valider la règle de traitement | Élevée |
| sat très élevé | extrême | qualité | 1 220 cas, min/max observés | `941.2` | plusieurs stations | jusqu'à 2017-09-27 | tables qualité | A02, A14 | confirmer le sens du paramètre avant lecture | Élevée |
| NO3- très élevé | extrême | qualité | 5 158 cas | `15300` | stations rivière | jusqu'à 2024-11-20 | tables qualité | A14 | confirmer unité et validité | Élevée |
| T_eau très élevé | extrême ; à confirmer | qualité | 9 391 cas | `213` | nappes | jusqu'à 2025-09-25 | tables qualité | A14 | vérifier unité ou codification | Élevée |
| H_G très élevé | extrême ; ambigu | qualité | 4 108 cas | `377` | stations Sebou | jusqu'à 2025-09-25 | tables qualité | A02, A14 | ne pas interpréter sans validation | Critique |

## 4. Données absentes ou non injectées

### Température

- Statut : donnée non encore injectée en base
- Volume BD : `0`
- Type : manque de données
- Ce n'est pas une anomalie technique
- Décision : confirmer source + priorité d'injection

## 5. Données nulles

| Domaine | Table | Champ | Nombre NULL | Exemple | Décision |
|---|---|---|---:|---|---|
| qualité rivière | `qualite.mesure_qualite_riviere` | `valeur` | 0 | aucun cas confirmé en base active | aucune décision sur ce point précis |
| qualité nappe | `qualite.mesure_qualite_nappe` | `valeur` | 0 | aucun cas confirmé en base active | aucune décision sur ce point précis |
| qualité barrage | `qualite.mesure_qualite_barrage` | `valeur` | 3 579 | `[vide]` | décider exclusion ou trace |
| qualité Sebou | `qualite.mesure_qualite_sebou` | `valeur` | 9 645 | `[vide]` | décider exclusion ou trace |
| qualité barrage garde | `qualite.suivi_qualite_barrage_garde_hebdo` | `valeur` | 3 579 | `[vide]` | décider exclusion ou trace |
| météo évaporation | `meteo.mesure_evaporation` | `valeur` | 10 308 | `[vide]` | valider le niveau de complétude acceptable |
| météo précipitation | `meteo.mesure_precipitation` | `val_observees` | 45 702 | observé `[vide]` avec valeur alternative | distinguer observé / alternatif |
| météo température | `meteo.mesure_temperature` | `val_moy` | 0 | table vide | confirmer la source d'injection |

## 6. Valeurs négatives

| Domaine | Table | Paramètre | Volume | Min | Exemple station | Exemple date | Décision |
|---|---|---|---:|---|---|---|---|
| hydro | `hydro.mesure_debit` | débit | 1 931 | `-2` | `ait khabbach` | `1984-08-31` | valider une règle métier unique |
| qualité | `qualite.mesure_qualite_riviere` | CF | 1 | `-0.4` | `dar el arsa` | `2006-12-05` | valider si erreur ou code métier |

## 7. Valeurs extrêmes

### Paramètre `sat`

- min observé : `0`
- max observé : `941.2`
- moyenne indicative : `157.802` sur barrages ; `70.630` sur rivières
- nombre de valeurs extrêmes : à confirmer par seuil métier
- exemples : `sat = 941.2` en barrage, `sat = 930` en rivière

### Paramètre `NO3-`

- min observé : `0`
- max observé : `15 300`
- moyenne indicative : `15.853` en rivière ; `52.279` en nappe
- nombre de valeurs extrêmes : à confirmer par seuil métier
- exemples : `NO3- = 15 300` en rivière

### Paramètre `T_eau`

- min observé : `0`
- max observé : `213`
- moyenne indicative : `20.438` en rivière ; `20.563` en nappe
- nombre de valeurs extrêmes : à confirmer par seuil métier
- exemples : `T_eau = 213` en nappe

### Paramètre `H_G`

- min observé : `0`
- max observé : `377`
- moyenne indicative : `0.718` sur Sebou ; `2.291` en rivière
- nombre de valeurs extrêmes : à confirmer par seuil métier
- exemples : `H_G = 377` sur Sebou

### Paramètre `CF`

- min observé : `-0.4`
- max observé : `120 000 000` en rivière
- moyenne indicative : `588 446.065` en rivière
- nombre de valeurs extrêmes : à confirmer par seuil métier
- exemples : `CF = -0.4`, `CF = 120 000 000`

## 8. Séries temporelles incomplètes

| Variable | Station | Période | Trous détectés | Décision |
|---|---|---|---:|---|
| évaporation | `brg idriss 1er` | 2013-07-06 à 2024-08-31 | 1 468 | préciser si ces périodes restent exploitables |
| évaporation | `brg garde du sebou` | 2013-07-06 à 2022-03-25 | 1 439 | préciser si ces périodes restent exploitables |
| évaporation | `brg el kansera` | 2013-07-06 à 2024-08-06 | 1 416 | préciser si ces périodes restent exploitables |
| précipitation observée manquante avec alternative | `brg idriss 1er` | 1985-09-17 à 2024-08-31 | 5 075 | distinguer observé et valeur alternative |
| précipitation observée manquante avec alternative | `taghzout` | 1998-09-02 à 2024-08-30 | 4 836 | distinguer observé et valeur alternative |
| précipitation observée manquante avec alternative | `beni heitem` | 1992-02-01 à 2024-08-31 | 3 809 | distinguer observé et valeur alternative |

## 9. Questions métier

- Les lignes qualité sans valeur doivent-elles être totalement exclues des synthèses ?
- Les valeurs négatives doivent-elles être lues comme erreurs, codes historiques, ou données à neutraliser ?
- Jusqu'à quel niveau de complétude une série météo reste-t-elle acceptable pour un usage métier ?
- Les valeurs extrêmes observées doivent-elles être systématiquement revues ou seulement signalées ?
- Les données de précipitation alternatives peuvent-elles être utilisées dans les réunions métier au même niveau que l'observé ?

## 10. Points à vérifier manuellement

- confirmer un seuil métier d'extrême pour `sat`, `NO3-`, `T_eau`, `CF`, `H_G`
- vérifier si certaines très fortes valeurs relèvent d'une unité différente
- confirmer la politique ABH sur les lignes nulles : exclusion, trace ou distinction visuelle
- confirmer la source attendue de la température et son calendrier d'injection
