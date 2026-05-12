# [PL04] Recouvrement sources globale / marché

---

## 1. Résumé rapide

- Bloc : Pollution
- Type : conflit inter-table
- Volume : 5 cas
- Priorité : Critique
- Tables concernées : `public.mesures_idp_2024_src_pollution_globale`, `public.mesures_idp_2024_src_pollution_marche_cadre`
- Décision requise : Oui

---

## 2. Description métier

Les tables source pollution `globale` et `marché cadre` semblent couvrir des périmètres proches. Quand une même ligne apparaît dans les deux, il faut savoir si l’on a :

- un doublon ;
- une traçabilité administrative ;
- ou deux périmètres à conserver séparés.

---

## 3. Description du problème

L’audit confirme `5` recouvrements sur la clé :

- point ;
- date ;
- commune ;
- nature.

Le problème ne peut pas être tranché sans décision métier sur la table de référence.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `src_pollution_globale` et `src_pollution_marche_cadre`
- paramètre / source : même point
- valeur : même contexte métier
- date : même date
- point : recouvrement sur la clé métier retenue
- observation : cas candidat à quarantaine

Exemple 2 :
- table : `src_pollution_globale` et `src_pollution_marche_cadre`
- paramètre / source : même commune et même nature
- valeur : même contexte métier
- date : même date
- point : recouvrement confirmé
- observation : risque de doublon si fusion brute

---

## 5. Analyse

Le volume est limité (`5` cas) mais très sensible, car il concerne la logique de fusion entre deux tables censées porter le même domaine métier.

Le pattern est un recouvrement faible mais réel.

---

## 6. Impact métier

- impact sur analyse qualité : faible direct
- impact sur pollution : doublon possible sur les sources
- impact sur dashboard : risque de double comptage des points
- risque décisionnel : fusion sans règle de priorité

---

## 7. Options possibles

Option 1 : garder les deux tables séparées  
Option 2 : fusionner en conservant `origine_table`  
Option 3 : choisir une table de référence et exclure les recouvrements de l’autre

---

## 8. Recommandation

Mettre les 5 cas en quarantaine et décider d’abord de la règle de fusion ou de priorité entre `globale` et `marché cadre`.

---

## 9. Questions à poser au métier

- Les deux tables décrivent-elles le même périmètre métier ?
- Si oui, laquelle doit faire foi en cas de recouvrement ?
- Faut-il conserver une traçabilité de l’origine administrative ?

---

## 10. Décision attendue

- Décision : règle officielle de fusion ou de priorité entre les deux tables source pollution
- Responsable : ABH / chef projet métier
- Délai : avant toute intégration consolidée

---

## 11. Liens avec autres fiches

- dépend de : `PL01`, `S03`
- impacte : `S02`, `99_synthese_decision.md`
