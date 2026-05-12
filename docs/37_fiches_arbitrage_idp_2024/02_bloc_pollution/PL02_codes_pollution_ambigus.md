# [PL02] Codes pollution ambigus

---

## 1. Résumé rapide

- Bloc : Pollution
- Type : ambiguïté
- Volume : plusieurs codes opérationnels
- Priorité : Élevée
- Tables concernées : `public.mesures_idp_2024_src_pollution_globale`, `public.mesures_idp_2024_qualite_globale`
- Décision requise : Oui

---

## 2. Description métier

Les codes pollution servent à identifier rapidement un rejet ou un point. Ils sont utiles en exploitation interne, mais insuffisants s’ils ne sont pas rattachés à un nom métier clair.

---

## 3. Description du problème

L’audit fait apparaître de nombreux codes comme :

- `AAZ_DOM1_R1`
- `ACH_PDS_R5`
- `TAZ_PDOM_R9`
- `REJET R10`

Ces codes sont probablement parlants pour l’équipe source, mais pas pour une lecture métier ou une réunion ABH.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_src_pollution_globale`
- paramètre / source : `AAZ_DOM1_R1`
- valeur : à confirmer
- date : à confirmer
- point : `AAZ_DOM1_R1`
- observation : code compact non explicite

Exemple 2 :
- table : `public.mesures_idp_2024_src_pollution_globale`
- paramètre / source : `TAZ_PDOM_R9`
- valeur : à confirmer
- date : à confirmer
- point : `TAZ_PDOM_R9`
- observation : code difficile à interpréter sans dictionnaire

Exemple 3 :
- table : `public.mesures_idp_2024_src_pollution_globale`
- paramètre / source : `REJET R10 (R10: KNH-DOM-R1)`
- valeur : à confirmer
- date : à confirmer
- point : `REJET R10`
- observation : code interne non utilisable directement en réunion

---

## 5. Analyse

Le problème est diffus mais structurant. Il ne porte pas sur quelques cas isolés, mais sur une manière de nommer les points source.

Le pattern principal est un codage opérationnel interne non traduit en vocabulaire métier lisible.

---

## 6. Impact métier

- impact sur analyse qualité : compréhension limitée des points suivis
- impact sur pollution : difficulté à relier le code à une source réelle
- impact sur dashboard : affichage peu lisible pour les non-techniciens
- risque décisionnel : discussions bloquées sur le sens d’un code

---

## 7. Options possibles

Option 1 : conserver les codes tels quels  
Option 2 : les compléter par un nom métier lisible  
Option 3 : les remplacer par un référentiel officiel unique

---

## 8. Recommandation

Conserver les codes comme identifiants internes, mais imposer un libellé métier lisible pour toute restitution ABH.

---

## 9. Questions à poser au métier

- Quelle nomenclature pollution doit être affichée en réunion ?
- Les codes internes doivent-ils rester visibles ou être masqués derrière un nom métier ?
- Existe-t-il déjà un dictionnaire officiel de ces codes ?

---

## 10. Décision attendue

- Décision : règle officielle d’affichage et de référence des codes pollution
- Responsable : ABH / métier pollution
- Délai : avant toute restitution consolidée

---

## 11. Liens avec autres fiches

- dépend de : `PL01`
- impacte : `PL03`, `PL04`
