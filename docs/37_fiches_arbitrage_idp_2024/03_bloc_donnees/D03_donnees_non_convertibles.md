# [D03] Données non convertibles

---

## 1. Résumé rapide

- Bloc : Données
- Type : incohérence
- Volume : 2 035 cas
- Priorité : Critique
- Tables concernées : `public.mesures_idp_2024_qualite_globale`, `public.mesures_idp_2024_qualite_marche_cadre`
- Décision requise : Oui

---

## 2. Description métier

Les données non convertibles sont des valeurs qui ne peuvent pas être lues directement comme des nombres. Certaines peuvent rester utiles métierement, d’autres peuvent être des écritures corrompues.

---

## 3. Description du problème

L’audit a confirmé :

- `1 361` cas non convertibles dans `qualite_globale`
- `674` cas non convertibles dans `qualite_marche_cadre`

Le problème regroupe à la fois :

- des valeurs labo spéciales ;
- des notations douteuses ;
- des formats hétérogènes.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : `Ag`
- valeur : `<0,010`
- date : `2024-09-13`
- point : `S8 (Aval Ferme Agricole sidi kamel)`
- observation : non convertible directement

Exemple 2 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `Arsenic`
- valeur : `<0,005`
- date : `2025-10-08`
- point : `PONT KHENICHET`
- observation : valeur sous seuil

Exemple 3 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `CF`
- valeur : `1,0.102`
- date : à confirmer
- point : à confirmer
- observation : écriture inhabituelle, potentiellement corrompue

---

## 5. Analyse

Le volume est élevé. Le problème ne peut pas être traité comme un cas marginal.

Le pattern mélange :

- cas métier légitimes mais non numériques ;
- cas possiblement mal saisis ;
- cas exigeant une règle de conversion distincte.

---

## 6. Impact métier

- impact sur analyse qualité : blocage partiel des calculs
- impact sur pollution : comparaison limitée entre campagnes
- impact sur dashboard : données invisibles ou mal comptées
- risque décisionnel : pertes d’information ou mauvaise conversion

---

## 7. Options possibles

Option 1 : convertir automatiquement tous les cas  
Option 2 : séparer les seuils de détection des valeurs corrompues  
Option 3 : mettre tout en quarantaine

---

## 8. Recommandation

Séparer les cas métier légitimes des cas douteux, puis conserver les deux groupes en quarantaine tant qu’une règle officielle n’est pas validée.

---

## 9. Questions à poser au métier

- Quels formats sont considérés comme acceptables malgré leur forme textuelle ?
- Quels formats doivent être considérés comme corrompus ?
- Une règle de conversion automatique est-elle acceptable pour certains paramètres seulement ?

---

## 10. Décision attendue

- Décision : typologie officielle des valeurs non convertibles
- Responsable : ABH / métier qualité
- Délai : avant tout traitement de nettoyage définitif

---

## 11. Liens avec autres fiches

- dépend de : `D02`, `P05`
- impacte : `D01`, `S01`
