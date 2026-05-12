# Comparaison source / cible

## Source traitée vs cible

Résultat exact :

- volume source traitée : `546 007`
- lignes manquantes en cible : `0`
- lignes présentes en cible : `546 007`
- correspondance exacte sur les trois valeurs :
  - `val_observees`
  - `val_power_nasa`
  - `val_remplies`
- conflits de valeur : `0`

## Source brute vs cible

- volume source brute : `669 880`
- lignes présentes en cible : `64 529`
- parmi elles, `64 529` portent exactement la même valeur que `val_observees`
- lignes absentes de la cible : `605 351`

## Lecture

La cible contient déjà **100 %** de la source traitée.

Les `605 351` lignes absentes viennent exclusivement de la source brute `raw_mesures_precipitations_jr`. Elles ne doivent pas être chargées automatiquement dans le modèle cible actuel sans arbitrage métier, car ce modèle a été conçu pour le flux traité à trois colonnes de valeur.
