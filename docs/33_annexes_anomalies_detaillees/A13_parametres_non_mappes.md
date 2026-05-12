# [A13] Paramètres non mappés

---

## 1. Résumé rapide (lecture 30 sec)

- Type : anomalie métier
- Domaine : qualité des eaux
- Priorité : Élevée
- Statut : décision requise
- Décision requise : Oui

Une partie des paramètres qualité présents dans les données n'est pas encore rattachée de façon fiable au référentiel métier. Ces lignes restent difficiles à intégrer dans une lecture consolidée.

---

## 2. Description métier détaillée

Le mapping d'un paramètre permet de relier une écriture historique à un paramètre métier reconnu. C'est indispensable pour comparer les résultats et produire des synthèses par famille de paramètres.

Sans mapping fiable, la donnée existe mais n'entre pas correctement dans la lecture métier.

---

## 3. Description du problème

- anomalie observée : paramètres présents mais non rattachés de façon fiable
- ce qui est observé : lignes qualité portant des paramètres non résolus ou non validés
- ce qui est attendu : chaque paramètre relié à un référentiel métier reconnu

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : H_G
- station : bab merzouka
- date : 2024-11-25
- valeur : 0.377
- observation : paramètre présent mais non clarifié dans la lecture métier

Exemple 2 :
- paramètre : H_G
- station : pt rp1 aval taza
- date : 2024-11-25
- valeur : 2.396
- observation : même situation sur une autre station

Exemple 3 :
- paramètre : Conductivité
- station : dar el arsa
- date : 2025-09-25
- valeur : 1795
- observation : paramètre bien lisible, mais des variantes historiques proches compliquent encore le mapping global

---

## 5. Analyse des cas

Le problème est important sur certains ensembles, notamment là où les paramètres historiques sont les plus variés. Il peut être très concentré sur quelques codes ou plus diffus selon les familles.

Le pattern principal est un écart entre présence de la donnée et reconnaissance métier complète.

---

## 6. Volume et étendue

- nombre de cas concernés : 4 112 cas signalés sur rivière ; 27 678 cas signalés sur Sebou
- zones concernées : surtout rivières et Sebou
- périodes concernées : historique récent et ancien
- fréquence : élevée

---

## 7. Interprétations possibles

- paramètre ambigu
- absence de décision métier
- variante historique non encore validée
- dictionnaire incomplet
- différence entre familles de données

---

## 8. Données associées à analyser

- dictionnaire validé des paramètres
- familles rivière et Sebou
- alias historiques
- unités attendues
- documents de validation client

---

## 9. Cas particulier : données absentes

### Statut des données
- disponibles

Le problème est celui du rattachement métier, pas de l'absence de la donnée.

---

## 10. Questions à poser au métier

- Quels paramètres non mappés doivent être priorisés pour validation ?
- Peut-on exclure certains paramètres rares ou trop ambigus ?
- Faut-il un référentiel unique pour toutes les familles qualité ?

---

## 11. Options de traitement

Option 1 : garder les paramètres non mappés dans les données
Option 2 : les mettre en attente de validation
Option 3 : les exclure de toute synthèse métier

---

## 12. Recommandation

Mettre les paramètres non mappés en attente de validation et ne pas les intégrer aux synthèses métier tant qu'ils ne sont pas clarifiés.

---

## 13. Impact métier (léger)

Risque de lecture partielle ou fausse des résultats qualité si les paramètres non mappés sont intégrés sans cadrage.

---

## 14. Actions à prévoir

- action court terme : prioriser les paramètres les plus fréquents
- action moyen terme : compléter le référentiel et fermer la liste des paramètres validés

---

## 15. Niveau de confiance

- élevé

Les volumes concernés sont significatifs et les documents projet convergent sur ce point.

---

## 16. Notes complémentaires

- très lié à A01, A02 et A11
