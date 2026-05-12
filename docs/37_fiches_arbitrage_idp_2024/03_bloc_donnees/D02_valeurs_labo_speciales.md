# [D02] Valeurs labo spéciales

---

## 1. Résumé rapide

- Bloc : Données
- Type : ambiguïté
- Volume : plusieurs cas inclus dans les 2 035 valeurs non numériques
- Priorité : Élevée
- Tables concernées : `public.mesures_idp_2024_qualite_globale`, `public.mesures_idp_2024_qualite_marche_cadre`
- Décision requise : Oui

---

## 2. Description métier

Certaines valeurs laboratoire ne sont pas écrites comme des nombres simples, mais comme des seuils de détection ou des notations d’interprétation. Ces valeurs ont un sens métier, mais ne peuvent pas être utilisées directement dans les calculs.

---

## 3. Description du problème

L’audit confirme des valeurs comme :

- `<0,010`
- `<0,0067`
- `<0,005`
- `<0,0005`

Ces écritures ne sont pas des erreurs évidentes. Elles indiquent souvent une valeur inférieure à un seuil de quantification.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : `Ag`
- valeur : `<0,010`
- date : `2024-09-13`
- point : `S8 (Aval Ferme Agricole sidi kamel)`
- observation : valeur sous seuil probable

Exemple 2 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : `Ag`
- valeur : `<0,0067`
- date : `2025-10-13`
- point : `MERJA FOUARATE`
- observation : notation labo spécifique

Exemple 3 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `Cadmium`
- valeur : `<0,0005`
- date : `2025-10-08`
- point : `PONT KHENICHET`
- observation : seuil de détection probable

---

## 5. Analyse

Le problème est répétitif et cohérent avec des pratiques laboratoire. Il ne ressemble pas à une corruption pure de la donnée.

Le pattern principal est une valeur inférieure à un seuil, exprimée textuellement.

---

## 6. Impact métier

- impact sur analyse qualité : difficulté à calculer ou agréger sans règle
- impact sur pollution : lecture imprécise des faibles concentrations
- impact sur dashboard : risque d’exclusion ou de mauvais affichage
- risque décisionnel : surévaluer ou sous-évaluer un paramètre trace

---

## 7. Options possibles

Option 1 : conserver la valeur texte telle quelle  
Option 2 : la convertir selon une règle métier  
Option 3 : la placer en quarantaine jusqu’à décision

---

## 8. Recommandation

Conserver ces valeurs en quarantaine distincte et définir une règle métier spécifique pour les seuils de détection.

---

## 9. Questions à poser au métier

- Comment l’ABH souhaite-t-elle traiter les valeurs sous seuil ?
- Faut-il les conserver textuellement ou les convertir selon une convention ?
- Une même règle doit-elle s’appliquer à tous les paramètres traces ?

---

## 10. Décision attendue

- Décision : règle métier officielle de traitement des seuils de détection
- Responsable : ABH / métier qualité
- Délai : avant intégration analytique des paramètres traces

---

## 11. Liens avec autres fiches

- dépend de : `P05`
- impacte : `D03`, `99_synthese_decision.md`
