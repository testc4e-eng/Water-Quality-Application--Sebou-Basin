# [A12] Incohérence entre sources de données

---

## 1. Résumé rapide (lecture 30 sec)

- Type : incohérence
- Domaine : référentiels et sources
- Priorité : Élevée
- Statut : à valider
- Décision requise : Oui

Certaines informations ne sont pas alignées entre sources historiques, référentiels métier et données consolidées. Cela crée des écarts de lecture.

---

## 2. Description métier détaillée

Le SAD consolide des données venant de plusieurs origines : laboratoires, historiques qualité, référentiels stations, barrages, météo et pollution.

La cohérence entre ces sources est essentielle pour produire une lecture métier crédible.

---

## 3. Description du problème

- incohérence observée : divergence entre sources ou référentiels
- ce qui est observé : même information portée différemment selon la source
- ce qui est attendu : une lecture consolidée avec une source métier de référence

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : Garde Sebou
- station : suivi barrage
- date : historique hebdomadaire
- valeur : ensemble dédié
- observation : présence forte dans les données, mais référence métier à figer

Exemple 2 :
- paramètre : Bouhouda
- station : barrage
- date : référentiel
- valeur : 2 occurrences
- observation : même nom, plusieurs entrées possibles selon la source

Exemple 3 :
- paramètre : Conductivité
- station : dar el arsa
- date : 2025-09-25
- valeur : 1795
- observation : paramètre consolidé, mais historique d'écriture multiple selon les sources

---

## 5. Analyse des cas

Le problème est transversal. Il ne touche pas un seul domaine mais l'alignement général entre historique, référentiel et consolidation actuelle.

Le pattern principal est un manque de hiérarchie claire entre les sources.

---

## 6. Volume et étendue

- nombre de cas concernés : à confirmer
- zones concernées : qualité, barrages, stations, pollution
- périodes concernées : historique et données récentes
- fréquence : récurrente

---

## 7. Interprétations possibles

- plusieurs sources historiques non fusionnées totalement
- priorités différentes selon les domaines
- absence de source métier unique par sujet
- arbitrages non encore formalisés

---

## 8. Données associées à analyser

- référentiel stations
- référentiel barrages
- dictionnaire paramètres
- données IDP
- documentation de validation métier

---

## 9. Cas particulier : données absentes

### Statut des données
- partielles

Certaines incohérences se cumulent avec des manques de données selon les sujets.

---

## 10. Questions à poser au métier

- Quelle source doit faire foi en cas de divergence ?
- Existe-t-il un ordre de priorité entre historique, référentiel et consolidation récente ?
- Quelles sources doivent être considérées comme purement informatives et non décisionnelles ?

---

## 11. Options de traitement

Option 1 : traiter au cas par cas
Option 2 : définir une hiérarchie officielle des sources
Option 3 : geler un référentiel métier unique

---

## 12. Recommandation

Définir une hiérarchie officielle des sources par domaine métier, puis geler la source de référence pour chaque sujet.

---

## 13. Impact métier (léger)

Risque de discussion contradictoire en réunion et de décisions prises sur des sources non alignées.

---

## 14. Actions à prévoir

- action court terme : établir la source de référence par domaine
- action moyen terme : documenter et diffuser cette hiérarchie

---

## 15. Niveau de confiance

- moyen

Le besoin est clair, mais l'ampleur exacte par domaine doit encore être précisée avec les métiers.

---

## 16. Notes complémentaires

- sujet transverse lié à presque toutes les autres fiches
