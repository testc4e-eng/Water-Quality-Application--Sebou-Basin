# Plan de traitement des valeurs avant migration

## Phase 1 — Validation métier paramètres
- objectif : figer le nom standard, la variante source et le périmètre des paramètres à migrer
- entrée : `retour equipe metier.xlsx`, mapping par variantes, paramètres ambigus
- sortie : liste validée des paramètres standards et paramètres exclus
- responsable : équipe métier ABH + chef de projet
- preuve de validation : tableau de décision signé / annoté

## Phase 2 — Validation unités
- objectif : confirmer l’unité de référence par paramètre
- entrée : comparaison unités source / métier / ABH
- sortie : dictionnaire unité validée
- responsable : équipe métier + référent qualité eau
- preuve de validation : version figée du tableau unités

## Phase 3 — Traitement valeurs non numériques
- objectif : appliquer les règles de parsing autorisées
- entrée : cas `<x`, `>x`, virgule décimale, texte, vide
- sortie : règles de normalisation et cas mis en quarantaine
- responsable : équipe data + validation métier
- preuve de validation : règle QA approuvée

## Phase 4 — Détection valeurs suspectes
- objectif : isoler les paramètres dont les min/max sortent des plages de référence
- entrée : stats source + seuils ABH + bibliographie fiable
- sortie : liste `SUSPECT_OUTLIER` / `OK_WITH_FLAG`
- responsable : équipe data + référent métier
- preuve de validation : revue paramètre par paramètre

## Phase 5 — Quarantaine
- objectif : sortir du flux de migration tous les cas non décidés
- entrée : paramètres ambigus, non mappés, unités en conflit, valeurs non interprétables
- sortie : lot quarantaine documenté
- responsable : équipe data
- preuve de validation : inventaire de quarantaine

## Phase 6 — Migration test
- objectif : exécuter un dry-run sur les paramètres validés
- entrée : mapping validé, règles QA validées, unités validées
- sortie : rapport de migration test
- responsable : équipe technique
- preuve de validation : rapport dry-run

## Phase 7 — Migration globale
- objectif : lancer la migration globale des mesures vers `abh_sad`
- entrée : lot validé après test
- sortie : charges migrées + journal de contrôle
- responsable : équipe technique + validation ABH
- preuve de validation : procès-verbal de recette / contrôle post-migration
