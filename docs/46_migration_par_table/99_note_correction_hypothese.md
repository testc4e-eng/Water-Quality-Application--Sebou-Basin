# Note de correction d'hypothese - dossier 46

Le dossier `46_migration_par_table` est conserve comme analyse exploratoire.

Il ne doit pas etre utilise comme plan d'execution de migration.

## Correction de cadrage

La source officielle de migration est la base `abh_sebou_ismail`.

La base `abh_sad` est la base cible a reconstruire proprement. Les donnees actuellement presentes dans `abh_sad` proviennent d'une migration partielle, non structuree et realisee avant stabilisation du referentiel des parametres.

## Consequence

Les tables `qualite`, `hydro`, `meteo` et `staging` de `abh_sad` ne doivent pas etre traitees comme sources officielles.

Elles doivent etre considerees comme :

- structures cibles potentielles ;
- traces d'une ancienne migration ;
- donnees a auditer, sauvegarder, vider ou neutraliser apres validation humaine.

## Nouveau dossier officiel

Le workflow officiel est porte par :

`docs/47_migration_depuis_abh_sebou_ismail/`

Ce dossier partira de `abh_sebou_ismail` vers `abh_sad`, avec conservation brute en staging, referentiels valides en metadata, donnees propres dans `qualite`, `hydro`, `meteo`, et anomalies dans `qa`.
