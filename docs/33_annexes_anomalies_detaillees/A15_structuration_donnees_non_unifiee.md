# [A15] Structuration des données non unifiée

---

## 1. Résumé rapide (lecture 30 sec)

- Type : problème structuration
- Domaine : référentiels transverses
- Priorité : Élevée
- Statut : décision requise
- Décision requise : Oui

Le système rassemble des données utiles, mais leur structuration métier n'est pas encore totalement unifiée. Cela complique la lecture consolidée entre domaines.

---

## 2. Description métier détaillée

Le SAD Sebou doit permettre une lecture cohérente entre qualité, hydrologie, météo, stations, barrages et pollution. Pour cela, les référentiels et règles métier doivent être harmonisés.

Quand chaque domaine avance avec sa propre logique, la vue d'ensemble devient plus difficile à exploiter.

---

## 3. Description du problème

- problème observé : structuration métier incomplètement unifiée
- ce qui est observé : règles différentes selon les domaines, référentiels partiels, cas spécifiques encore ouverts
- ce qui est attendu : une organisation homogène des données et des référentiels

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : qualité
- station : plusieurs domaines
- date : historique
- valeur : paramètres non standardisés
- observation : la logique qualité n'est pas encore totalement harmonisée

Exemple 2 :
- paramètre : pollution
- station : rejets / IDP
- date : 2024-2025
- valeur : prélèvements partiellement rattachés
- observation : structuration pollution encore en cours de stabilisation

Exemple 3 :
- paramètre : stations / barrages
- station : référentiel
- date : actif
- valeur : homonymes et cas non stabilisés
- observation : le socle de référence n'est pas encore complètement unifié

---

## 5. Analyse des cas

Le problème est transversal. Il ne se limite pas à un domaine. Les difficultés de structuration se retrouvent dans plusieurs sujets : paramètres, stations, barrages, rejets et IDP.

Le pattern principal est une convergence inachevée des référentiels métier.

---

## 6. Volume et étendue

- nombre de cas concernés : à confirmer
- zones concernées : ensemble du système
- périodes concernées : historique et données courantes
- fréquence : structurante

---

## 7. Interprétations possibles

- projet encore en phase de convergence
- héritage de sources multiples
- validations métier non encore closes
- structuration différente selon les domaines

---

## 8. Données associées à analyser

- référentiel stations
- référentiel barrages
- référentiel paramètres
- référentiel rejets
- règles de restitution par domaine

---

## 9. Cas particulier : données absentes

### Statut des données
- partielles

Le sujet porte d'abord sur l'unification, mais il croise aussi des manques de données sur certains domaines.

---

## 10. Questions à poser au métier

- Quel référentiel doit faire foi par domaine ?
- Quels objets doivent être considérés comme définitivement validés ?
- Faut-il organiser un atelier spécifique de convergence des référentiels ?

---

## 11. Options de traitement

Option 1 : traiter chaque domaine séparément
Option 2 : lancer une convergence progressive par priorité
Option 3 : geler un cadre métier transverse unique

---

## 12. Recommandation

Mettre en place une convergence progressive mais pilotée, avec validation transverse des référentiels prioritaires avant toute restitution consolidée.

---

## 13. Impact métier (léger)

Sans unification, la lecture globale du système reste morcelée et moins robuste pour la décision.

---

## 14. Actions à prévoir

- action court terme : identifier les référentiels à figer en priorité
- action moyen terme : formaliser un cadre unifié de lecture métier

---

## 15. Niveau de confiance

- moyen

Le constat est très probable et largement appuyé par les autres anomalies, mais il repose sur une synthèse transverse plus que sur un seul indicateur.

---

## 16. Notes complémentaires

- cette fiche synthétise les dépendances entre A01 à A14
- utile pour cadrer un atelier de convergence global
