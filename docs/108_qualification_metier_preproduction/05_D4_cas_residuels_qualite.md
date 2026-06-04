# D4 - Cas résiduels qualité

## 1. Objet

Présenter les cas résiduels qualité déjà identifiés, leur impact réel et la recommandation associée.

## 2. Cas résiduels

| Cas | Justification | Impact réel | Niveau | Recommandation |
|---|---|---|---|---|
| Lignes qualité sans valeur | cas connus et documentés | limité sur les synthèses si filtrage appliqué | `FAIBLE` | conserver traçabilité, exclure des agrégations métier |
| Valeurs extrêmes / aberrantes | contrôle qualité déjà effectué | influence possible sur lecture métier si non signalée | `ELEVE` | valider une règle métier de traitement |
| Paramètres non mappés | déjà identifiés dans les rapports | couverture analytique partielle | `MOYEN` | mise en attente traçable puis mapping validé |
| Variantes de libellés / unités | déjà documentées | ambiguïté d’interprétation ou d’affichage | `MOYEN` | figer dictionnaire et unité officielle |
| Cas résiduels barrage hors mapping | cas documentés dans les synthèses | impact ciblé sur certaines restitutions | `MOYEN` | confirmer maintien, correction ou exclusion |

## 3. Lecture de qualification

Ces cas ne remettent pas en cause le socle SAD ni la migration.

Ils représentent :

- des résultats du contrôle qualité ;
- des cas résiduels de qualification métier ;
- des sujets de validation pour sécuriser la préproduction.

## 4. Recommandation C4E

- qualifier les cas résiduels par règle explicite plutôt que par correction implicite ;
- signaler les cas exclus ou en attente dans la restitution métier ;
- ne pas confondre résiduel qualité et indisponibilité du système.
