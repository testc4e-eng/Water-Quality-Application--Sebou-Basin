# [PL01] Sources non rattachées

---

## 1. Résumé rapide

- Bloc : Pollution
- Type : problème mapping
- Volume : 240 points
- Priorité : Critique
- Tables concernées : `public.mesures_idp_2024_src_pollution_globale`, `public.mesures_idp_2024_src_pollution_marche_cadre`, `qualite.source_pollution_prelevement`
- Décision requise : Oui

---

## 2. Description métier

Chaque point source pollution doit pouvoir être rattaché à une source ou à un référentiel de rejet reconnu. Sinon, la donnée existe mais reste difficile à exploiter dans une analyse consolidée.

---

## 3. Description du problème

L’audit confirme que 240 points distincts présents dans les tables IDP source pollution ne sont pas retrouvés parmi les points déjà intégrés dans `abh_sad`.

Ce point ne signifie pas qu’ils sont faux. Il signifie qu’ils ne sont pas encore rattachés ou intégrés de manière cohérente.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_src_pollution_globale`
- paramètre / source : `amont barrage de garde`
- valeur : à confirmer
- date : plusieurs dates
- point : `amont barrage de garde`
- observation : point identifié dans la source, non retrouvé tel quel parmi les points déjà intégrés

Exemple 2 :
- table : `public.mesures_idp_2024_src_pollution_globale`
- paramètre / source : `aval rejet meknes`
- valeur : à confirmer
- date : plusieurs dates
- point : `aval rejet meknes`
- observation : point aval potentiellement distinct de la source officielle

Exemple 3 :
- table : `public.mesures_idp_2024_src_pollution_globale`
- paramètre / source : `amont step taounate`
- valeur : à confirmer
- date : plusieurs dates
- point : `amont step taounate`
- observation : point source / contrôle à clarifier

---

## 5. Analyse

Le volume est important : `240` points distincts.

Le pattern principal est le suivant :

- beaucoup de points décrivent une position (`amont`, `aval`)
- d’autres portent un nom de source potentiellement connu sous une autre forme
- la comparaison avec `abh_sad` montre un écart substantiel entre source et cible

---

## 6. Impact métier

- impact sur analyse qualité : lien incomplet entre résultat et source réelle
- impact sur pollution : consolidation incomplète des rejets
- impact sur dashboard : carte pollution partiellement incohérente
- risque décisionnel : attribuer à tort un résultat à la mauvaise source ou ne pas l’attribuer du tout

---

## 7. Options possibles

Option 1 : exclure ces points des synthèses  
Option 2 : les conserver en quarantaine en attente de rattachement  
Option 3 : lancer un rapprochement manuel avec validation métier

---

## 8. Recommandation

Conserver les 240 points en quarantaine métier et lancer un rapprochement progressif avec le référentiel pollution de `abh_sad`.

---

## 9. Questions à poser au métier

- Quels points doivent être considérés comme de vraies sources et non comme des points de contrôle ?
- Certains points doivent-ils être rattachés à des rejets déjà connus sous un autre nom ?
- Le référentiel `abh_sad` doit-il être enrichi avant intégration IDP ?

---

## 10. Décision attendue

- Décision : politique officielle de rattachement des points non intégrés
- Responsable : ABH / métier pollution
- Délai : avant toute réintégration IDP dans SAD

---

## 11. Liens avec autres fiches

- dépend de : `PL02`, `PL03`
- impacte : `PL04`, `S03`, `S04`
