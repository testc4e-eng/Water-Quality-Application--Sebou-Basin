# Regles metier

## Context

Le referentiel final doit eliminer les collisions entre codes, unites et supports geo.

## Analysis

- un code canonique ne doit pas porter plusieurs definitions
- les alias sources restent traçables mais ne doivent plus etre actifs comme codes finaux
- les tables finales doivent pointer vers le referentiel canonique ou un hash metier stable

## Solution

Regles :

1. `VOLUME_BARRAGE` devient un alias de `VOLUME`.
2. `RESTITUTION` devient un alias source de `LACHER`.
3. `LACHER` est un `volume_journalier` de reference en `Mm3/j`.
4. `APPORTS_HM3` et `TRANSFERT` sont des `volume_journalier` de reference en `Mm3/j`.
5. `DEBIT` ne doit exister qu'une seule fois en canonique et reste en `m3/s`.
6. Toute variante `HM3`, `Hm3`, `hm3` doit etre harmonisee vers `Mm3` dans la trace source.
7. Toute variante de casse, accent, abreviation ou ponctuation doit etre traitee en alias.
8. Un parametre actif sans unite de reference reste `BACKLOG`.
9. Un parametre actif sans support geo compatible reste `BACKLOG`.
10. Un parametre actif sans mapping referentiel dans une table finale reste `BLOQUANT` si son volume est significatif.

## Optional improvements

- ajouter une table `metadata.referentiel_alias_parametre`
- versionner le referentiel canonique par date d'effet
