# [A04] Doublons stations et barrages

---

## 1. Résumé rapide (lecture 30 sec)

- Type : anomalie métier
- Domaine : stations et barrages
- Priorité : Élevée
- Statut : décision requise
- Décision requise : Oui

Le référentiel contient des noms identiques pour plusieurs objets. Cela crée un doute sur l'identité réelle du point suivi ou du barrage concerné.

---

## 2. Description métier détaillée

Les stations et barrages structurent toute la lecture du système. Ils permettent d'associer correctement les mesures, de comparer les zones et de comprendre les tendances.

Si un même nom désigne plusieurs objets, la discussion métier devient fragile.

---

## 3. Description du problème

- anomalie observée : homonymes et doublons de référentiel
- ce qui est observé : plusieurs objets avec le même nom
- ce qui est attendu : un nom métier suffisamment distinct pour chaque objet

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : station
- station : puits à captage cuvelé
- date : référentiel
- valeur : 17 occurrences
- observation : nom générique réutilisé pour plusieurs objets

Exemple 2 :
- paramètre : station
- station : forage
- date : référentiel
- valeur : 12 occurrences
- observation : nom trop générique pour distinguer les stations

Exemple 3 :
- paramètre : barrage
- station : bouhouda
- date : référentiel
- valeur : 2 occurrences
- observation : même nom pour plusieurs entrées barrage

---

## 5. Analyse des cas

Le problème est généralisé pour les stations et plus ciblé mais critique pour certains barrages. Il traduit un référentiel partiellement descriptif au lieu d'être pleinement identifiant.

Les noms génériques sont les plus sensibles.

---

## 6. Volume et étendue

- nombre de cas concernés : 13 noms de stations dupliqués ; 1 nom de barrage dupliqué confirmé
- zones concernées : plusieurs zones
- périodes concernées : référentiel actif
- fréquence : récurrente

---

## 7. Interprétations possibles

- noms trop génériques
- absence d'identifiant métier visible
- fusion incomplète de référentiels historiques
- distinction locale connue oralement mais non écrite

---

## 8. Données associées à analyser

- codes station
- nom local ou nom d'usage
- rattachement territorial
- campagnes de mesure liées
- historique des barrages et stations

---

## 9. Cas particulier : données absentes

### Statut des données
- partielles

Certaines stations restent aussi incomplètes ou sans nom stabilisé.

---

## 10. Questions à poser au métier

- Quels éléments doivent officiellement distinguer deux stations de même nom ?
- Faut-il conserver les noms génériques ou les renommer métierement ?
- Bouhouda correspond-il à un seul barrage ou à plusieurs réalités distinctes ?

---

## 11. Options de traitement

Option 1 : conserver les noms existants
Option 2 : ajouter un identifiant métier visible
Option 3 : renommer les objets homonymes

---

## 12. Recommandation

Conserver le nom d'usage mais ajouter une distinction métier officielle visible pour chaque station et barrage homonyme.

---

## 13. Impact métier (léger)

Risque de confusion dans les cartes, tableaux et discussions sur les tendances locales.

---

## 14. Actions à prévoir

- action court terme : lister les homonymes à arbitrer
- action moyen terme : publier un référentiel gelé et validé

---

## 15. Niveau de confiance

- élevé

Les doublons sont objectivement observés dans le référentiel actif.

---

## 16. Notes complémentaires

- à rapprocher de A12 et A15
- le cas Garde Sebou reste un sous-sujet critique associé
