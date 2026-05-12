# [A02] Paramètres ambigus H_G et sat

---

## 1. Résumé rapide (lecture 30 sec)

- Type : ambiguïté
- Domaine : paramètres physico-chimiques
- Priorité : Critique
- Statut : décision requise
- Décision requise : Oui

Deux paramètres historiques restent trop ambigus pour être interprétés sans validation métier. Ils sont fréquents et influencent directement la lecture des résultats qualité.

---

## 2. Description métier détaillée

Les paramètres H_G et sat sont utilisés dans les analyses qualité. Ils peuvent porter des sens différents selon les usages laboratoire ou les habitudes historiques.

Comme ils sont présents dans les mesures, leur définition officielle est indispensable pour éviter une mauvaise interprétation des résultats en réunion.

---

## 3. Description du problème

- anomalie observée : ambiguïté de définition
- ce qui est observé : présence de codes abrégés non suffisamment explicites
- ce qui est attendu : définition métier officielle, unique et partagée

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : H_G
- station : bab merzouka
- date : 2024-11-25
- valeur : 0.377
- observation : valeur présente, mais signification métier non confirmée

Exemple 2 :
- paramètre : H_G
- station : pt rp1 aval taza
- date : 2024-11-25
- valeur : 2.396
- observation : même code, même ambiguïté, impact sur lecture pollution

Exemple 3 :
- paramètre : sat
- station : khenichet
- date : 2017-09-27
- valeur : 0
- observation : peut correspondre à une saturation, mais le sens doit être validé

Exemple 4 :
- paramètre : sat
- station : azib soltane
- date : 2009-10-22
- valeur : 15.68
- observation : valeur exploitable seulement si la définition officielle est connue

---

## 5. Analyse des cas

Le problème est récurrent et non marginal. H_G apparaît à fort volume. sat est aussi largement présent. Les cas sont répartis sur plusieurs stations et périodes.

Le risque principal n'est pas l'absence de valeur, mais l'absence de sens officiel.

---

## 6. Volume et étendue

- nombre de cas concernés : H_G environ 4 108 cas ; sat environ 1 220 cas
- zones concernées : plusieurs stations qualité
- périodes concernées : historique multi-annuel
- fréquence : élevée

---

## 7. Interprétations possibles

- H_G = hydrocarbures globaux
- H_G = huiles et graisses
- H_G = autre code historique
- sat = saturation en oxygène
- sat = autre notion de saturation

---

## 8. Données associées à analyser

- paramètres proches de pollution organique
- oxygène dissous
- conductivité
- phénols
- dictionnaire validé des paramètres

---

## 9. Cas particulier : données absentes

### Statut des données
- disponibles

Le problème ne vient pas d'une absence de données, mais d'une absence de définition officielle.

---

## 10. Questions à poser au métier

- Que signifie officiellement H_G dans le contexte ABH Sebou ?
- sat doit-il être interprété comme saturation en oxygène ?
- Quelle unité officielle doit être associée à ces paramètres ?

---

## 11. Options de traitement

Option 1 : bloquer toute utilisation en réunion tant que la définition n'est pas validée
Option 2 : proposer une interprétation provisoire
Option 3 : valider officiellement ces paramètres et les réintégrer dans le référentiel

---

## 12. Recommandation

Ne pas interpréter H_G et sat sans validation ABH. La meilleure option est une décision officielle avant toute lecture métier consolidée.

---

## 13. Impact métier (léger)

Ces paramètres peuvent fausser l'analyse de pollution et de qualité générale si leur sens est mal compris.

---

## 14. Actions à prévoir

- action court terme : soumettre H_G et sat à validation métier
- action moyen terme : publier leur définition officielle dans le dictionnaire validé

---

## 15. Niveau de confiance

- élevé

Les occurrences sont nombreuses et la documentation existante signale explicitement leur ambiguïté.

---

## 16. Notes complémentaires

- lié à A01, A11 et A13
- point prioritaire pour les ateliers ABH
