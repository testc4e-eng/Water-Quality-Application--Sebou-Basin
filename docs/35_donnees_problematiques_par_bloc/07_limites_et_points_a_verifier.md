# Limites et points à vérifier

## Tables non trouvées

- aucune table contenant explicitement `idp` dans son nom n'a été trouvée via `information_schema`
- aucune table métier utile n'a été trouvée dans `public` hors objets PostGIS système
- la table `backend/.env.example` n'existe pas dans le dépôt actif

## Colonnes non trouvées

- aucune colonne d'unité de mesure n'a été trouvée dans les tables qualité métier inspectées
- les unités sont portées par le référentiel `metadata.referentiel_parametre`, mais plusieurs y sont absentes

## Informations documentaires non confirmées en BD

- la fragmentation IDP est bien documentée, mais elle n'apparaît pas sous forme de tables nommées `idp` dans la base active
- plusieurs constats IDP doivent donc être lus à travers les ensembles pollution `staging.*`, `infra.*inventaire_pollution*` et `qualite.source_pollution_*`
- le caractère "extrême" de certaines valeurs est confirmé en base, mais leur caractère réellement aberrant doit être validé métierement

## Points nécessitant validation métier

- signification officielle de `H_G`
- signification officielle de `sat`
- définition métier de `PTD`, `PTP`, `F_M_mes`
- libellé officiel à retenir pour `Conductivite` / `Conductivité`
- règle de traitement des valeurs négatives et extrêmes
- statut métier des 26 prélèvements pollution non rattachés
- référence officielle à retenir pour `Garde Sebou`
- statut exact du doublon `Bouhouda`

## Points nécessitant accès à fichiers sources Excel

- variantes accentuées ou historiques non totalement visibles dans les tables de mapping
- confirmation de certaines unités non portées dans les tables métier
- compréhension fine des codes pollution `DOM`, `PDOM`, `PDS`, `EM`
- validation des paramètres rares ou peu fréquents signalés dans les tables d'écarts

## Points nécessitant validation ABH

- dictionnaire officiel des paramètres
- unités officielles par paramètre prioritaire
- liste officielle des rejets suivis
- politique de fusion ou non des ensembles pollution / IDP 2024
- niveau minimal de complétude acceptable pour la météo
- priorité d'injection de la température
- hiérarchie des référentiels stations / barrages / sources

## Limites méthodologiques

- toutes les requêtes ont été exécutées en lecture seule
- aucune donnée n'a été modifiée
- certains diagnostics sont des signaux de risque métier, pas des verdicts définitifs
- lorsqu'un chiffre n'a pas pu être confirmé directement en base, il est indiqué comme "à confirmer"
