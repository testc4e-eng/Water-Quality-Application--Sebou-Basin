# [A06] Fragmentation des données IDP

---

## 1. Résumé rapide (lecture 30 sec)

- Type : problème structuration
- Domaine : pollution / IDP
- Priorité : Critique
- Statut : décision requise
- Décision requise : Oui

Les données IDP 2024 sont réparties dans plusieurs ensembles qui semblent proches. Cette fragmentation complique la lecture métier et crée un risque de doublon.

---

## 2. Description métier détaillée

Les données IDP servent à suivre les sources de pollution et leurs analyses. Elles doivent permettre une lecture simple : qui rejette, où, quand et avec quels résultats.

Si les données sont réparties en plusieurs ensembles de même nature, la lecture métier devient difficile.

---

## 3. Description du problème

- problème observé : fragmentation de données proches dans plusieurs ensembles
- ce qui est observé : séparation entre "qualité globale" et "marché cadre", ainsi que leurs sources associées
- ce qui est attendu : une organisation claire, avec séparation justifiée ou fusion assumée

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : ensemble de données
- station : IDP 2024 qualité globale
- date : 2024
- valeur : lot distinct
- observation : semble porter le même besoin métier qu'un autre ensemble IDP

Exemple 2 :
- paramètre : ensemble de données
- station : IDP 2024 marché cadre
- date : 2024
- valeur : lot distinct
- observation : séparation à justifier métierement

Exemple 3 :
- paramètre : source de pollution
- station : version globale / version marché cadre
- date : 2024
- valeur : périmètres proches
- observation : risque de recouvrement

---

## 5. Analyse des cas

Le problème semble généralisé au lot IDP 2024. Il ne s'agit pas d'un cas isolé. La fragmentation paraît surtout organisationnelle et non forcément métier.

Le point critique est le risque de double lecture d'un même rejet.

---

## 6. Volume et étendue

- nombre de cas concernés : à confirmer précisément
- zones concernées : périmètre pollution IDP
- périodes concernées : année 2024
- fréquence : structurante

---

## 7. Interprétations possibles

- découpage contractuel plutôt que métier
- séparation utile pour la traçabilité administrative
- duplication partielle d'un même périmètre
- différence réelle de campagne à confirmer

---

## 8. Données associées à analyser

- tableaux IDP 2024
- liste des rejets suivis
- dates de prélèvement
- marchés ou campagnes associés
- règles de restitution attendues par l'ABH

---

## 9. Cas particulier : données absentes

### Statut des données
- disponibles

Le problème porte sur l'organisation des données disponibles.

---

## 10. Questions à poser au métier

- La séparation entre "globale" et "marché cadre" a-t-elle un sens métier réel ?
- Peut-on fusionner les deux ensembles dans les analyses métier ?
- Faut-il conserver la trace du marché uniquement comme information secondaire ?

---

## 11. Options de traitement

Option 1 : conserver les ensembles séparés
Option 2 : fusionner pour la lecture métier
Option 3 : fusion partielle avec maintien d'une trace administrative

---

## 12. Recommandation

Fusionner les ensembles pour la lecture métier, tout en conservant si besoin une information secondaire sur l'origine administrative.

---

## 13. Impact métier (léger)

La fragmentation nuit à la lisibilité des résultats pollution et peut créer des doublons de discussion.

---

## 14. Actions à prévoir

- action court terme : faire valider le principe de fusion
- action moyen terme : définir la restitution métier cible des données IDP

---

## 15. Niveau de confiance

- élevé

La fragmentation est explicitement documentée dans les documents IDP.

---

## 16. Notes complémentaires

- dépend fortement de A05 et A07
- point central pour le cadrage pollution 2024
