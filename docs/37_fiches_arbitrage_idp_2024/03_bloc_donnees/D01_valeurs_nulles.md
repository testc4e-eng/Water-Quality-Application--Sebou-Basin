# [D01] Valeurs nulles

---

## 1. Résumé rapide

- Bloc : Données
- Type : manque de données
- Volume : 11 cas
- Priorité : Moyenne
- Tables concernées : `public.mesures_idp_2024_qualite_marche_cadre`
- Décision requise : Oui

---

## 2. Description métier

Une ligne sans valeur ne permet pas de tirer une conclusion analytique. Elle peut néanmoins représenter une trace de prélèvement ou une tentative de mesure.

---

## 3. Description du problème

L’audit a confirmé `11` lignes avec `val_qual` vide dans la table `qualite_marche_cadre`.

Le problème est limité en volume, mais il doit être tranché : garder ces lignes en trace ou les sortir du périmètre exploitable.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `PT DECANTE`
- valeur : `[null]`
- date : `2025-10-08`
- point : `AMONT STEP MECHRAA BEL KSIRI`
- observation : ligne présente sans résultat

Exemple 2 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `pH au laboratoire`
- valeur : `[null]`
- date : `2025-10-08`
- point : `PONT KHENICHET`
- observation : mesure incomplète

Exemple 3 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `Bilan_Ionique`
- valeur : `[null]`
- date : `2025-10-21`
- point : `PUITS DOUAR BEL KOURA`
- observation : ligne non exploitable telle quelle

---

## 5. Analyse

Le volume est faible (`11` cas), mais les lignes concernent plusieurs paramètres et plusieurs points.

Le pattern est celui d’une donnée présente dans la structure, mais sans résultat exploitable.

---

## 6. Impact métier

- impact sur analyse qualité : mesure non exploitable
- impact sur pollution : faible direct
- impact sur dashboard : ligne potentiellement vide ou trompeuse
- risque décisionnel : croire qu’une mesure existe alors que le résultat manque

---

## 7. Options possibles

Option 1 : exclure ces lignes des analyses  
Option 2 : les conserver comme trace de prélèvement  
Option 3 : les mettre en quarantaine en attente d’arbitrage

---

## 8. Recommandation

Mettre ces lignes en quarantaine et ne pas les intégrer aux synthèses analytiques.

---

## 9. Questions à poser au métier

- Une ligne sans valeur doit-elle être conservée comme preuve de prélèvement ?
- Ces cas doivent-ils apparaître dans les restitutions ?
- Peut-on les exclure sans perte métier significative ?

---

## 10. Décision attendue

- Décision : conserver en trace ou exclure des analyses
- Responsable : ABH / métier qualité
- Délai : avant fusion finale des tables qualité

---

## 11. Liens avec autres fiches

- dépend de : `D03`
- impacte : `S01`, `S03`
