# [P01] Paramètres non mappés

---

## 1. Résumé rapide

- Bloc : Paramètres
- Type : problème mapping
- Volume : 4 755 lignes
- Priorité : Critique
- Tables concernées : `public.mesures_idp_2024_qualite_globale`, `public.mesures_idp_2024_qualite_marche_cadre`, `metadata.mapping_parametre_source`
- Décision requise : Oui

---

## 2. Description métier

Les paramètres servent à lire les résultats qualité et à comparer les points de prélèvement entre eux. Pour être exploitables dans le SAD, ils doivent être reliés à un dictionnaire métier stable.

Sans mapping officiel, une donnée existe mais ne peut pas être intégrée proprement dans les analyses consolidées.

---

## 3. Description du problème

L’audit montre que 4 755 lignes des tables qualité IDP 2024 portent des paramètres non couverts par le mapping actuel de `abh_sad`.

Le problème ne signifie pas que ces données sont fausses. Il signifie qu’elles ne sont pas encore reliées de manière fiable au référentiel métier cible.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : `NH4+`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : paramètre présent en source mais non couvert directement par le mapping cible

Exemple 2 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : `Ca++`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : notation historique non harmonisée avec le référentiel cible

Exemple 3 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `NO3-_Spectro`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : variante analytique non couverte directement par le mapping actuel

Exemple 4 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : `NTK Spectr`
- valeur : à confirmer
- date : plusieurs dates
- point : plusieurs points
- observation : libellé méthode inclus dans le nom du paramètre

---

## 5. Analyse

Le problème est massif et structurant :

- volume confirmé : `4 755` lignes
- il touche à la fois la table `globale` et la table `marché cadre`
- les cas relèvent surtout de variantes historiques, analytiques ou de notation

Le pattern dominant est un écart entre la nomenclature source et la nomenclature métier cible.

---

## 6. Impact métier

- impact sur analyse qualité : des résultats utiles risquent de sortir des synthèses
- impact sur pollution : les interprétations par paramètre peuvent être incomplètes
- impact sur dashboard : certains résultats ne pourront pas être classés correctement
- risque décisionnel : sous-estimer des résultats existants parce qu’ils ne sont pas reliés au bon paramètre

---

## 7. Options possibles

Option 1 : exclure provisoirement tous les paramètres non mappés  
Option 2 : les conserver en quarantaine en attente d’arbitrage  
Option 3 : les remapper manuellement après validation métier

---

## 8. Recommandation

Conserver toutes les lignes non mappées en quarantaine métier, sans suppression, puis compléter le mapping après validation ABH.

---

## 9. Questions à poser au métier

- Quels paramètres non mappés doivent être traités en priorité ?
- Peut-on regrouper certaines variantes sous un même paramètre officiel ?
- Quels paramètres doivent être exclus s’ils ne sont pas validés rapidement ?

---

## 10. Décision attendue

- Décision : politique officielle de traitement des paramètres non mappés
- Responsable : ABH / métier qualité
- Délai : avant toute fusion ou intégration définitive IDP

---

## 11. Liens avec autres fiches

- dépend de : `P02`, `P03`, `P04`
- impacte : `S03`, `99_synthese_decision.md`
