# [P05] Valeurs non numériques

---

## 1. Résumé rapide

- Bloc : Paramètres
- Type : incohérence
- Volume : 2 035 cas
- Priorité : Critique
- Tables concernées : `public.mesures_idp_2024_qualite_globale`, `public.mesures_idp_2024_qualite_marche_cadre`
- Décision requise : Oui

---

## 2. Description métier

Les valeurs de qualité doivent pouvoir être lues, comparées et agrégées. Quand une valeur est stockée sous forme non numérique, elle peut rester utile métierement, mais elle ne peut pas être utilisée directement dans les calculs.

---

## 3. Description du problème

L’audit confirme :

- `1 361` cas non numériques dans `qualite_globale`
- `674` cas non numériques dans `qualite_marche_cadre`

Ces cas ne sont pas forcément des erreurs. Ils traduisent souvent :

- un seuil de détection (`<0,005`)
- une notation laboratoire
- ou une écriture mixte difficile à convertir

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : `Ag`
- valeur : `<0,010`
- date : `2024-09-13`
- point : `S8 (Aval Ferme Agricole sidi kamel)`
- observation : notation de seuil de détection

Exemple 2 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : `Ag`
- valeur : `<0,0067`
- date : `2025-10-13`
- point : `MERJA FOUARATE`
- observation : valeur exploitable métierement, mais non directement numérique

Exemple 3 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `Arsenic`
- valeur : `<0,005`
- date : `2025-10-08`
- point : `PONT KHENICHET`
- observation : notation labo de seuil

Exemple 4 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `CF`
- valeur : `1,0.102`
- date : à confirmer
- point : à confirmer
- observation : écriture non directement convertible

---

## 5. Analyse

Le problème est important en volume et de nature mixte :

- une partie relève de valeurs labo spéciales
- une autre partie relève de notations difficiles à convertir

Le pattern est donc à double lecture :

- valeurs potentiellement utiles métierement
- mais non exploitables directement pour les calculs

---

## 6. Impact métier

- impact sur analyse qualité : impossibilité d’agréger directement
- impact sur pollution : difficulté à comparer les concentrations
- impact sur dashboard : blocage ou résultats incomplets
- risque décisionnel : exclure à tort des résultats utiles ou les convertir de manière erronée

---

## 7. Options possibles

Option 1 : exclure toutes les valeurs non numériques  
Option 2 : les convertir quand une règle métier existe  
Option 3 : les conserver en quarantaine avec typologie distincte

---

## 8. Recommandation

Conserver ces lignes en quarantaine, distinguer les seuils de détection des écritures corrompues, puis définir une règle métier de conversion ou de conservation.

---

## 9. Questions à poser au métier

- Les valeurs `<0,005` doivent-elles être conservées comme seuil de détection ?
- Les écritures de type `1,0.102` doivent-elles être considérées comme corrompues ou reconstituables ?
- Quels paramètres justifient une conversion métier prioritaire ?

---

## 10. Décision attendue

- Décision : règle officielle de traitement des valeurs non numériques
- Responsable : ABH / métier qualité
- Délai : avant tout chargement consolidé dans SAD

---

## 11. Liens avec autres fiches

- dépend de : `D02`, `D03`
- impacte : `P01`, `S01`, `S03`
