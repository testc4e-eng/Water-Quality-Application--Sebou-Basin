# Lot E — Migration staging vers tables finales

## Objectif
Décrire le pipeline de migration finale depuis le brut `staging.raw_*` vers les tables propres `qualite`, `hydro`, `meteo`, `infra` et `metadata`.

## Pipeline cible

```text
staging.raw_*
  -> mapping paramètres / stations / pollution
  -> parsing valeurs
  -> validation unités
  -> QA
  -> quarantaine si anomalie
  -> tables finales propres
  -> rapport de contrôle
```

## Règles QA intégrées

| Cas | Règle | Flag |
|---|---|---|
| virgule décimale | convertir virgule en point | DECIMAL_COMMA_CONVERTED |
| notation `x10n` | convertir en notation scientifique numérique | SCIENTIFIC_NOTATION_CONVERTED |
| notation `.10n` | convertir en notation scientifique numérique | SCIENTIFIC_NOTATION_CONVERTED |
| `<x` | valeur numérique `x` + conservation limite basse | BELOW_DETECTION_LIMIT |
| `>x` | valeur numérique `x` + conservation limite haute | ABOVE_DETECTION_LIMIT |
| NULL qualité/évaporation/précipitation | ne pas migrer | NULL_REJECTED |
| débit négatif | accepter avec flag si validé métier | NEGATIVE_ACCEPTED |
| texte non interprétable | quarantaine | NON_NUMERIC_QUARANTINE |

## Conditions de migration finale

- Lot A validé et staging reconstruit.
- Lot C validé pour le schéma cible concerné.
- Lot D validé pour les paramètres concernés.
- Lot E0 dry-run validé : tables temporaires de résultat créées, parsing/conversions/flags appliqués, volumes contrôlés.
- Règles QA validées pour chaque type de valeur.
- Tables de quarantaine prêtes.
- Dry-run validé avant migration réelle.

## Pré-requis immédiat : Lot E0

Avant tout chargement des tables finales, exécuter un dry-run contrôlé dans un schéma ou des tables temporaires dédiées.

Objectifs du Lot E0 :

- créer les tables de résultat temporaires ;
- appliquer les règles de parsing ;
- appliquer les conversions d'unités ;
- poser les flags QA et quarantaine ;
- comparer les volumes source / préparé / quarantaine ;
- interdire toute insertion dans `qualite`, `hydro`, `meteo`, `infra` et `metadata`.

## Sorties attendues par table finale

| Destination | Entrée principale | Validation requise | Statut |
|---|---|---|---|
| `qualite.*` | sources qualité et pollution depuis `staging.raw_*` | mapping paramètres + unités + QA | PENDING |
| `hydro.*` | débits, barrages, bathymétries | stations + unités + règles débit négatif | PENDING |
| `meteo.*` | précipitation, évaporation, température | NULL rules + source température | PENDING |
| `infra.*` | stations, barrages, pollution, points d’eau | référentiels et rattachements validés | PENDING |
| `metadata.*` | paramètres, mappings, normes | référentiel paramètres validé | PENDING |
