# [P02] Paramètres ambigus

---

## 1. Résumé rapide

- Bloc : Paramètres
- Type : ambiguïté
- Volume : 27 cas explicites pour `Huiles Graisses (H G T)` + plusieurs cas proches
- Priorité : Critique
- Tables concernées : `public.mesures_idp_2024_qualite_globale`, `public.mesures_idp_2024_qualite_marche_cadre`
- Décision requise : Oui

---

## 2. Description métier

Un paramètre ambigu est un paramètre dont le sens exact n’est pas suffisamment clair pour être interprété sans risque. Il peut désigner plusieurs réalités chimiques ou plusieurs manières de mesurer la même réalité.

Ces paramètres sont sensibles car ils peuvent changer complètement la lecture métier d’un point de prélèvement.

---

## 3. Description du problème

L’audit confirme la présence de paramètres ambigus ou difficiles à interpréter, notamment :

- `Huiles Graisses (H G T)`
- `PT DECANTE`
- `DCO 2h décant.`
- libellés combinant paramètre, méthode et condition de mesure

Le problème est que le métier ne peut pas décider correctement tant que le sens officiel n’est pas figé.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `Huiles Graisses (H G T)`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : rapprochement probable avec `H_G`, mais sens officiel non confirmé

Exemple 2 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `PT DECANTE`
- valeur : `[null]`
- date : `2025-10-08`
- point : `AMONT STEP MECHRAA BEL KSIRI`
- observation : paramètre à signification métier non stabilisée

Exemple 3 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : `DCO  D  2h`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : le nom mélange paramètre et condition de mesure

---

## 5. Analyse

Le problème n’est pas le plus volumineux du bloc paramètres, mais il est parmi les plus critiques. Il bloque la capacité à décider si la donnée doit être :

- intégrée telle quelle ;
- regroupée avec un autre paramètre ;
- conservée en attente.

Le pattern principal est la présence d’un libellé qui mélange :

- le nom du paramètre ;
- la méthode ;
- parfois l’état de l’échantillon.

---

## 6. Impact métier

- impact sur analyse qualité : risque de mauvaise lecture d’un paramètre
- impact sur pollution : interprétation fausse d’une charge polluante
- impact sur dashboard : regroupement erroné des séries
- risque décisionnel : prendre une décision sur un paramètre mal compris

---

## 7. Options possibles

Option 1 : exclure les paramètres ambigus des synthèses  
Option 2 : les conserver en quarantaine jusqu’à validation  
Option 3 : les rattacher immédiatement à un paramètre cible

---

## 8. Recommandation

Conserver les paramètres ambigus en quarantaine et exiger une validation métier explicite avant toute intégration dans les synthèses SAD.

---

## 9. Questions à poser au métier

- `Huiles Graisses (H G T)` doit-il être rattaché à `H_G` ?
- `PT DECANTE` représente-t-il un paramètre métier autonome ou une variante de `PT` ?
- Les libellés avec `2h décant.` doivent-ils rester distincts ou être regroupés ?

---

## 10. Décision attendue

- Décision : liste officielle des paramètres ambigus à conserver, fusionner ou exclure
- Responsable : ABH / métier qualité
- Délai : avant tout nettoyage logique des tables IDP

---

## 11. Liens avec autres fiches

- dépend de : `P01`, `P04`
- impacte : `P03`, `S03`
