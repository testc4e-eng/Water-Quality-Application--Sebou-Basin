# [S01] Recouvrement qualité globale / marché

---

## 1. Résumé rapide

- Bloc : Structure
- Type : conflit inter-table
- Volume : 40 cas
- Priorité : Critique
- Tables concernées : `public.mesures_idp_2024_qualite_globale`, `public.mesures_idp_2024_qualite_marche_cadre`
- Décision requise : Oui

---

## 2. Description métier

Quand une même mesure qualité apparaît à la fois dans `globale` et dans `marché cadre`, il faut savoir s’il s’agit :

- d’un doublon ;
- d’une double traçabilité ;
- ou d’un cas où une table doit faire foi.

---

## 3. Description du problème

L’audit confirme `40` recouvrements sur la clé :

- point ;
- date ;
- paramètre ;
- valeur.

Ces cas ne peuvent pas être supprimés automatiquement sans arbitrage métier.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `qualite_globale` et `qualite_marche_cadre`
- paramètre / source : même paramètre
- valeur : même valeur
- date : même date
- point : même point
- observation : recouvrement confirmé entre les deux ensembles

Exemple 2 :
- table : `qualite_globale` et `qualite_marche_cadre`
- paramètre / source : même combinaison métier
- valeur : même résultat
- date : même date
- point : même point
- observation : risque de doublon si fusion directe

---

## 5. Analyse

Le volume (`40`) est limité mais central. Il traduit un recouvrement réel entre les deux tables, alors que leur fusion est envisagée.

Le pattern est celui d’un recouvrement partiel, pas d’une duplication totale.

---

## 6. Impact métier

- impact sur analyse qualité : double comptage possible
- impact sur pollution : faible direct
- impact sur dashboard : risque de doublon dans les séries
- risque décisionnel : comparer deux fois la même mesure

---

## 7. Options possibles

Option 1 : garder les deux tables séparées  
Option 2 : fusionner avec colonne `origine_table`  
Option 3 : choisir une table de référence et écarter les recouvrements de l’autre

---

## 8. Recommandation

Mettre les 40 recouvrements en quarantaine et décider ensuite d’une règle de priorité ou de fusion avec traçabilité.

---

## 9. Questions à poser au métier

- En cas de recouvrement, quelle table doit faire foi ?
- Faut-il garder la traçabilité du marché dans les données finales ?
- Le métier accepte-t-il une fusion avec colonne d’origine ?

---

## 10. Décision attendue

- Décision : règle officielle de gestion des recouvrements qualité
- Responsable : ABH / chef projet métier
- Délai : avant toute fusion des tables qualité IDP

---

## 11. Liens avec autres fiches

- dépend de : `S03`
- impacte : `P03`, `D01`, `99_synthese_decision.md`
