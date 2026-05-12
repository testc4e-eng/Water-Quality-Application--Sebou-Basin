# [A07] Sources pollution non rattachées

---

## 1. Résumé rapide (lecture 30 sec)

- Type : anomalie métier
- Domaine : pollution / IDP
- Priorité : Critique
- Statut : à analyser
- Décision requise : Oui

Une partie des prélèvements pollution n'est pas reliée à une source métier reconnue. Cela empêche une lecture consolidée par rejet.

---

## 2. Description métier détaillée

Dans le domaine pollution, chaque prélèvement doit pouvoir être rattaché à une source ou à un rejet identifié. Ce rattachement est essentiel pour comprendre d'où vient l'impact observé.

Sans ce lien, les mesures existent mais restent difficiles à interpréter métierement.

---

## 3. Description du problème

- anomalie observée : prélèvements sans rattachement fiable
- ce qui est observé : certains prélèvements existent sans lien confirmé avec une source reconnue
- ce qui est attendu : chaque prélèvement rattaché à une source unique ou clairement qualifiée

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : point de prélèvement
- station : REJET MERJA FOUARATE AIN SEBAA
- date : 2025-10-13
- valeur : REJET
- observation : prélèvement présent sans rattachement confirmé à une source référencée

Exemple 2 :
- paramètre : point de prélèvement
- station : AVAL REJET INDUSTRIEL MERJA
- date : 2025-10-13
- valeur : REJET
- observation : source probable, mais rattachement métier à confirmer

Exemple 3 :
- paramètre : point de prélèvement
- station : TAZ_PDOM_R9
- date : 2025-10-29
- valeur : REJET
- observation : nom opérationnel, mais identité métier finale non garantie

---

## 5. Analyse des cas

Le problème est réel mais partiel. Tous les prélèvements pollution ne sont pas concernés. Une partie est bien rattachée, une autre reste en attente.

Le pattern montre un besoin de rapprochement métier plus qu'un manque total de données.

---

## 6. Volume et étendue

- nombre de cas concernés : 26 prélèvements non rattachés confirmés
- zones concernées : plusieurs communes
- périodes concernées : historique récent disponible
- fréquence : significative

---

## 7. Interprétations possibles

- rejet absent du référentiel
- nom différent entre source et référentiel
- point de prélèvement distinct de la source réelle
- besoin de validation manuelle

---

## 8. Données associées à analyser

- liste des points de prélèvement
- liste officielle des rejets
- commune et province
- nature du prélèvement
- campagnes pollution associées

---

## 9. Cas particulier : données absentes

### Statut des données
- partielles

Les prélèvements existent, mais le rattachement à la source est incomplet.

---

## 10. Questions à poser au métier

- Faut-il conserver ces prélèvements sans source confirmée dans les ateliers métier ?
- Peut-on rattacher certains cas manuellement avec validation ABH ?
- Un point aval peut-il être utilisé comme substitut de la source de rejet ?

---

## 11. Options de traitement

Option 1 : exclure les prélèvements non rattachés
Option 2 : les garder dans une catégorie "en attente"
Option 3 : lancer une validation manuelle ciblée

---

## 12. Recommandation

Conserver ces cas dans une catégorie "en attente de validation métier" sans les intégrer aux synthèses consolidées par source.

---

## 13. Impact métier (léger)

Sans rattachement clair, l'analyse par source de pollution reste incomplète et potentiellement trompeuse.

---

## 14. Actions à prévoir

- action court terme : lister les 26 cas non rattachés pour atelier
- action moyen terme : valider leur rattachement ou leur exclusion

---

## 15. Niveau de confiance

- élevé

Le volume des cas non rattachés est confirmé par les données disponibles.

---

## 16. Notes complémentaires

- lié à A05 et A06
- sujet prioritaire pour les ateliers pollution
