# [S03] Fragmentation des données IDP

---

## 1. Résumé rapide

- Bloc : Structure
- Type : problème structure
- Volume : 8 899 lignes sur 4 tables
- Priorité : Critique
- Tables concernées : les 4 tables IDP 2024 source
- Décision requise : Oui

---

## 2. Description métier

Les données IDP doivent permettre une lecture simple du suivi des points de pollution et de leurs analyses. Quand elles sont éclatées en plusieurs tables proches, la lecture métier devient plus difficile.

---

## 3. Description du problème

Les données IDP 2024 sont réparties entre :

- qualité globale
- qualité marché cadre
- source pollution globale
- source pollution marché cadre

La fragmentation est confirmée par :

- des structures très proches
- des périodes partiellement recouvrantes
- des recouvrements de lignes confirmés

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : ensemble qualité
- valeur : 4 894 lignes
- date : 2024-09-12 à 2025-12-14
- point : 212 points
- observation : premier bloc qualité

Exemple 2 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : ensemble qualité
- valeur : 3 614 lignes
- date : 2025-10-06 à 2025-12-01
- point : 127 points
- observation : second bloc qualité, même structure

Exemple 3 :
- table : `public.mesures_idp_2024_src_pollution_globale`
- paramètre / source : ensemble source pollution
- valeur : 243 lignes
- date : 2024-09-12 à 2025-12-15
- point : 243 points
- observation : bloc source pollution

Exemple 4 :
- table : `public.mesures_idp_2024_src_pollution_marche_cadre`
- paramètre / source : ensemble source pollution
- valeur : 148 lignes
- date : 2025-10-06 à 2025-12-01
- point : 148 points
- observation : même structure globale, mais séparée

---

## 5. Analyse

Le problème est structurel et confirmé :

- `40` recouvrements qualité globale / marché cadre
- `5` recouvrements source pollution globale / marché cadre

La fragmentation n’est donc pas théorique. Elle a déjà un effet réel sur la donnée.

---

## 6. Impact métier

- impact sur analyse qualité : risque de recouvrement et de double lecture
- impact sur pollution : difficulté à savoir quel ensemble fait foi
- impact sur dashboard : duplication ou sous-lecture selon la règle retenue
- risque décisionnel : mauvaise fusion ou mauvaise priorisation de la source

---

## 7. Options possibles

Option 1 : maintenir les 4 tables séparées  
Option 2 : fusionner par domaine avec traçabilité  
Option 3 : choisir une table de référence par domaine

---

## 8. Recommandation

Fusionner par domaine avec une colonne `origine_table`, après quarantaine des recouvrements et validation métier.

---

## 9. Questions à poser au métier

- Le découpage globale / marché cadre a-t-il un sens métier réel ?
- Faut-il conserver l’origine administrative après fusion ?
- Quelle règle de priorité faut-il appliquer en cas de recouvrement ?

---

## 10. Décision attendue

- Décision : principe officiel de structuration finale des données IDP
- Responsable : ABH / chef projet métier
- Délai : avant toute intégration dans `abh_sad`

---

## 11. Liens avec autres fiches

- dépend de : `S01`, `S02`, `PL04`
- impacte : toutes les autres fiches IDP
