# [A01] Paramètres non standardisés

---

## 1. Résumé rapide (lecture 30 sec)

- Type : anomalie métier
- Domaine : qualité des eaux
- Priorité : Critique
- Statut : décision requise
- Décision requise : Oui

Les paramètres de qualité sont écrits sous plusieurs formes pour un même sens métier. Cela empêche une lecture homogène entre campagnes, stations et tableaux de bord.

---

## 2. Description métier détaillée

Les paramètres physico-chimiques servent à suivre l'état de l'eau et à comparer les résultats dans le temps et dans l'espace. Ils sont utilisés pour l'analyse de qualité des rivières, nappes, barrages et du Sebou.

Pour être utiles en réunion métier, ces paramètres doivent porter un nom clair, stable et reconnu par tous. Sinon, deux mesures identiques peuvent être lues comme deux informations différentes.

---

## 3. Description du problème

- anomalie observée : plusieurs écritures pour un même paramètre
- ce qui est observé : coexistence d'alias historiques, abrégés ou accentués
- ce qui est attendu : un nom métier unique par paramètre

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : Conductivite
- station : à confirmer
- date : plusieurs périodes
- valeur : plusieurs cas
- observation : même concept que Conductivité, mais écriture différente

Exemple 2 :
- paramètre : NO3-
- station : à confirmer
- date : plusieurs périodes
- valeur : plusieurs cas
- observation : désigne le même besoin métier que Nitrates

Exemple 3 :
- paramètre : T_eau
- station : plusieurs stations
- date : plusieurs périodes
- valeur : plusieurs cas
- observation : paramètre historique pour température eau, mais libellé non uniformisé

---

## 5. Analyse des cas

Le problème est généralisé. Il ne s'agit pas de quelques lignes isolées. Les variantes touchent les paramètres les plus utilisés et concernent plusieurs familles de données qualité.

Le pattern principal est un mélange de :
- variantes d'orthographe
- variantes avec ou sans accent
- abréviations laboratoire
- libellés historiques non harmonisés

---

## 6. Volume et étendue

- nombre de cas concernés : important, plusieurs dizaines d'alias historiques
- zones concernées : rivières, nappes, barrages, Sebou
- périodes concernées : historique multi-annuel
- fréquence : récurrente

---

## 7. Interprétations possibles

- héritage de plusieurs laboratoires ou campagnes
- absence de dictionnaire métier unique
- différence de saisie selon opérateur
- normalisation incomplète
- mélange entre nom analytique et nom d'usage

---

## 8. Données associées à analyser

- dictionnaire des paramètres
- unités associées
- familles qualité rivière, nappe, barrage et Sebou
- référentiel métier des paramètres
- documents de validation ABH

---

## 9. Cas particulier : données absentes

### Statut des données
- disponibles

Ce point concerne surtout la forme des données, pas leur absence.

---

## 10. Questions à poser au métier

- Quelle liste officielle des paramètres doit être retenue comme référence ?
- Quelles variantes historiques doivent être conservées uniquement comme synonymes ?
- Quels paramètres doivent être renommés de façon définitive dans les livrables métier ?

---

## 11. Options de traitement

Option 1 : conserver toutes les écritures historiques
Option 2 : imposer un libellé métier unique et garder les variantes en synonymes
Option 3 : exclure les libellés non validés

---

## 12. Recommandation

Imposer un libellé métier unique pour chaque paramètre et conserver les variantes uniquement comme équivalents de lecture. C'est l'option la plus claire pour l'ABH.

---

## 13. Impact métier (léger)

Risque de mauvaise lecture des résultats et de double comptage conceptuel. Les comparaisons entre stations ou périodes deviennent moins fiables.

---

## 14. Actions à prévoir

- action court terme : valider la liste officielle des libellés
- action moyen terme : aligner tous les rapports et tableaux sur cette liste

---

## 15. Niveau de confiance

- élevé

Ce problème est fortement documenté dans les audits et confirmé par la variété des alias recensés.

---

## 16. Notes complémentaires

- dépend fortement de A11 et A13
- constitue un prérequis pour une lecture métier stable
