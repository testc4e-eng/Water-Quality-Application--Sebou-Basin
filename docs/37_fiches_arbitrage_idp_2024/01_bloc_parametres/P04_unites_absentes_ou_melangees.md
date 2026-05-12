# [P04] Unités absentes ou mélangées

---

## 1. Résumé rapide

- Bloc : Paramètres
- Type : incohérence
- Volume : plusieurs familles concernées
- Priorité : Élevée
- Tables concernées : `public.mesures_idp_2024_qualite_globale`, `public.mesures_idp_2024_qualite_marche_cadre`
- Décision requise : Oui

---

## 2. Description métier

Une donnée n’est correctement interprétable que si son unité est claire. Quand l’unité est absente, intégrée dans le nom, ou mélangée à une notation de méthode, la lecture devient fragile.

---

## 3. Description du problème

L’audit confirme plusieurs cas où l’unité ou la condition de mesure est mélangée au paramètre :

- `Cond 25°C *0,9*0,01`
- `TA_°F`
- `TA_meq/l`
- `TAC_°F`
- `TAC_meq/l`

Le risque est de traiter comme deux paramètres différents ce qui relève seulement d’une différence d’unité ou d’écriture.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `Cond 25°C *0,9*0,01`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : unité ou facteur intégré dans le nom

Exemple 2 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : `TA_°F`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : unité intégrée dans le libellé

Exemple 3 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : `TA_meq/l`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : même famille mais autre unité

---

## 5. Analyse

Le problème est récurrent dans plusieurs familles :

- alcalinité
- conductivité
- paramètres calculés ou dérivés

Le pattern dominant est une écriture qui mélange concept, unité et parfois facteur correctif.

---

## 6. Impact métier

- impact sur analyse qualité : mauvaise comparaison des résultats
- impact sur pollution : interprétation imprécise des charges ou états
- impact sur dashboard : multiplication artificielle des séries
- risque décisionnel : comparer des données qui ne sont pas dans la même unité

---

## 7. Options possibles

Option 1 : conserver ces libellés tels quels  
Option 2 : séparer le paramètre et l’unité  
Option 3 : regrouper sous un seul paramètre métier avec unité officielle

---

## 8. Recommandation

Séparer systématiquement le paramètre métier et l’unité, puis figer une unité officielle par paramètre pour les synthèses SAD.

---

## 9. Questions à poser au métier

- Quelle unité officielle faut-il retenir pour la conductivité ?
- Les formes `TA_°F` et `TA_meq/l` doivent-elles être converties ou maintenues séparées ?
- Les facteurs dans les noms de conductivité doivent-ils être conservés comme méthode ou supprimés du libellé métier ?

---

## 10. Décision attendue

- Décision : règle officielle de séparation paramètre / unité
- Responsable : ABH / métier qualité
- Délai : avant harmonisation définitive des paramètres IDP

---

## 11. Liens avec autres fiches

- dépend de : `P03`
- impacte : `P01`, `P05`, `S03`
