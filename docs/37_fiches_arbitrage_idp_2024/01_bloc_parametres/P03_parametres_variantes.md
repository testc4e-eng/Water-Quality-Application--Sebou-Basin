# [P03] Paramètres à variantes multiples

---

## 1. Résumé rapide

- Bloc : Paramètres
- Type : incohérence
- Volume : plusieurs centaines de lignes selon paramètre
- Priorité : Élevée
- Tables concernées : `public.mesures_idp_2024_qualite_globale`, `public.mesures_idp_2024_qualite_marche_cadre`
- Décision requise : Oui

---

## 2. Description métier

Les variantes correspondent à plusieurs écritures pour une même famille de mesure. Le métier doit pouvoir lire un seul paramètre officiel, même si plusieurs noms historiques existent en source.

---

## 3. Description du problème

Les tables IDP 2024 contiennent plusieurs familles de variantes, par exemple :

- `NO3-`, `NO3-_Spectro`, `NO3-_Réduction Cd`
- `NH4+`, `NH4+ Spect`, `NH4+ Titri`, `NH4+ 2`
- `Cond 25°C ...`, `25°C`
- `Phénol`, `indice de phénol M:A`

Le problème est moins un manque de donnée qu’un manque d’unification.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : `NO3-`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : forme simple du paramètre nitrates

Exemple 2 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `NO3-_Spectro`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : variante méthode du même besoin métier

Exemple 3 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `NH4+ Spect`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : variante de méthode pour ammonium

---

## 5. Analyse

Le pattern est clair :

- la table `globale` utilise davantage des formes chimiques compactes
- la table `marché cadre` utilise plus souvent des variantes de méthode ou de laboratoire

Le sujet est donc central pour la fusion globale / marché cadre.

---

## 6. Impact métier

- impact sur analyse qualité : double lecture d’un même paramètre
- impact sur pollution : difficulté à comparer les campagnes
- impact sur dashboard : multiplication artificielle des séries
- risque décisionnel : croire à plusieurs paramètres alors qu’il s’agit du même indicateur

---

## 7. Options possibles

Option 1 : conserver les variantes séparées  
Option 2 : choisir un libellé officiel et rattacher toutes les variantes  
Option 3 : regrouper uniquement les cas les plus évidents

---

## 8. Recommandation

Choisir un libellé métier officiel par famille de paramètre et conserver les variantes uniquement comme synonymes source.

---

## 9. Questions à poser au métier

- Les variantes `NO3-_Spectro` et `NO3-_Réduction Cd` doivent-elles être regroupées avec `NO3-` ?
- Les variantes `NH4+` doivent-elles être fusionnées en un seul paramètre métier ?
- Les variantes de conductivité avec température et facteur doivent-elles être fusionnées ou conservées à part ?

---

## 10. Décision attendue

- Décision : règle de regroupement des variantes
- Responsable : ABH / métier qualité
- Délai : avant la fusion des tables qualité IDP

---

## 11. Liens avec autres fiches

- dépend de : `P01`, `P02`
- impacte : `P04`, `S01`, `S03`
