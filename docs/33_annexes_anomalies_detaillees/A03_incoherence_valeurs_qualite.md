# [A03] Incohérence des valeurs qualité

---

## 1. Résumé rapide (lecture 30 sec)

- Type : incohérence
- Domaine : qualité des eaux
- Priorité : Élevée
- Statut : à valider
- Décision requise : Oui

Certaines valeurs de qualité ne sont pas cohérentes avec une lecture métier normale. Elles doivent être qualifiées avant d'être utilisées dans les analyses ou les échanges avec l'ABH.

---

## 2. Description métier détaillée

Les valeurs qualité servent à évaluer l'état de l'eau, comparer les stations et suivre les évolutions dans le temps. Elles sont utilisées pour la compréhension métier des milieux aquatiques.

Une valeur incohérente peut conduire à une conclusion fausse sur l'état réel d'une station ou sur une tendance.

---

## 3. Description du problème

- incohérence observée : valeurs incompatibles avec une lecture métier simple
- ce qui est observé : valeurs négatives ou non interprétables
- ce qui est attendu : valeurs cohérentes avec les paramètres suivis

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : CF
- station : dar el arsa
- date : 2006-12-05
- valeur : -0.4
- observation : valeur négative difficilement acceptable en lecture métier

Exemple 2 :
- paramètre : à confirmer
- station : ait khabbach
- date : 1984-08-31
- valeur : -1
- observation : semble correspondre à une convention de saisie plutôt qu'à une mesure réelle

Exemple 3 :
- paramètre : à confirmer
- station : my ali cherif
- date : 1985-04-11
- valeur : -1
- observation : répétition du même schéma sur une autre station

---

## 5. Analyse des cas

Les cas observés restent peu nombreux en volume, mais ils ont un fort impact symbolique car ils remettent en cause la confiance dans la lecture métier.

Le pattern principal suggère soit :
- une convention historique de laboratoire ;
- une valeur de substitution ;
- une erreur de saisie.

---

## 6. Volume et étendue

- nombre de cas concernés : 2 cas négatifs confirmés sur les tables qualité consolidées, avec historique documentaire signalant d'autres conventions proches
- zones concernées : plusieurs stations
- périodes concernées : historique ancien et récent
- fréquence : faible mais sensible

---

## 7. Interprétations possibles

- erreur de saisie
- valeur codée pour "sous seuil"
- convention laboratoire
- problème d'unité ou de conversion
- paramètre mal interprété

---

## 8. Données associées à analyser

- paramètres qualité concernés
- fiches laboratoire
- campagnes de mesure associées
- paramètres voisins le même jour
- règles métier de traitement des valeurs sous seuil

---

## 9. Cas particulier : données absentes

### Statut des données
- disponibles

Le sujet porte sur la cohérence des valeurs disponibles.

---

## 10. Questions à poser au métier

- Une valeur négative doit-elle être lue comme erreur ou comme code métier ?
- Existe-t-il une convention ABH pour les mesures sous seuil ?
- Ces cas doivent-ils être exclus des synthèses métier ?

---

## 11. Options de traitement

Option 1 : exclure toutes les valeurs incohérentes
Option 2 : les requalifier comme "sous seuil" si le métier le confirme
Option 3 : les conserver avec mention explicite

---

## 12. Recommandation

Faire valider une règle unique de traitement des valeurs incohérentes, puis exclure par défaut les cas non clarifiés des analyses métier.

---

## 13. Impact métier (léger)

Risque de mauvaise conclusion sur l'état de l'eau et d'incompréhension en atelier si ces valeurs apparaissent sans explication.

---

## 14. Actions à prévoir

- action court terme : lister précisément les paramètres concernés
- action moyen terme : formaliser la règle métier de traitement

---

## 15. Niveau de confiance

- moyen

Le problème est réel, mais l'interprétation exacte de chaque cas demande validation métier.

---

## 16. Notes complémentaires

- proche de A14
- à relier aux règles de traitement des valeurs extrêmes
