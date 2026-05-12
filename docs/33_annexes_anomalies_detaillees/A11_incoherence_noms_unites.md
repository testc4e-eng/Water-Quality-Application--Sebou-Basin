# [A11] Incohérence noms et unités

---

## 1. Résumé rapide (lecture 30 sec)

- Type : incohérence
- Domaine : paramètres physico-chimiques
- Priorité : Élevée
- Statut : décision requise
- Décision requise : Oui

Certains paramètres n'ont pas encore un couple nom + unité officiellement stabilisé. Cela gêne la comparaison des résultats et la lecture métier.

---

## 2. Description métier détaillée

Un paramètre n'est compréhensible que si son nom et son unité sont clairs. C'est nécessaire pour comparer les résultats entre campagnes, sites et années.

Une même valeur ne signifie pas la même chose si l'unité ou le libellé n'est pas maîtrisé.

---

## 3. Description du problème

- incohérence observée : nom ou unité non stabilisés
- ce qui est observé : libellés multiples, unités non explicites ou à confirmer
- ce qui est attendu : nom unique et unité officielle par paramètre

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : Conductivite / Conductivité
- station : plusieurs stations
- date : plusieurs périodes
- valeur : plusieurs cas
- observation : même concept, écriture différente

Exemple 2 :
- paramètre : H_G
- station : plusieurs stations
- date : plusieurs périodes
- valeur : plusieurs cas
- observation : signification et unité non confirmées

Exemple 3 :
- paramètre : sat
- station : plusieurs stations
- date : plusieurs périodes
- valeur : plusieurs cas
- observation : unité probable en pourcentage, mais validation requise

---

## 5. Analyse des cas

Le problème touche d'abord les paramètres historiques ou ambigus, mais aussi des paramètres fréquents avec des variantes d'écriture.

Ce n'est pas seulement un sujet de forme. Sans unité officielle, la lecture métier peut changer.

---

## 6. Volume et étendue

- nombre de cas concernés : important, à confirmer paramètre par paramètre
- zones concernées : ensembles qualité
- périodes concernées : historique multi-annuel
- fréquence : récurrente

---

## 7. Interprétations possibles

- différences entre laboratoires
- évolution des normes de saisie
- absence de validation finale
- unités connues oralement mais non formalisées

---

## 8. Données associées à analyser

- dictionnaire des paramètres
- unités de référence
- documents de validation client
- familles analytiques
- campagnes laboratoire

---

## 9. Cas particulier : données absentes

### Statut des données
- disponibles

Le problème concerne la cohérence métier des libellés et unités.

---

## 10. Questions à poser au métier

- Quelle unité officielle retenir pour chaque paramètre prioritaire ?
- Faut-il afficher le nom scientifique, le nom usuel ou les deux ?
- Quels paramètres doivent être validés en priorité avant présentation ABH ?

---

## 11. Options de traitement

Option 1 : garder les noms et unités historiques
Option 2 : normaliser les noms seulement
Option 3 : normaliser les noms et unités de façon complète

---

## 12. Recommandation

Normaliser conjointement les noms et les unités, car l'un sans l'autre reste insuffisant pour une lecture métier fiable.

---

## 13. Impact métier (léger)

Risque de confusion lors des comparaisons et des arbitrages sur la qualité de l'eau.

---

## 14. Actions à prévoir

- action court terme : valider les paramètres prioritaires
- action moyen terme : publier un référentiel nom + unité

---

## 15. Niveau de confiance

- élevé

Les documents de validation et d'audit confirment la nécessité d'un cadrage métier sur ce point.

---

## 16. Notes complémentaires

- très lié à A01 et A02
- peut être traité en atelier dédié paramétrage métier
