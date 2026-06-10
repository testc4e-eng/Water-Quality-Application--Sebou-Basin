# Génération de canevas métier

## Objectif

Remplacer les gabarits statiques par des canevas générés selon :

- classe de données ;
- période ;
- territoire ;
- stations ;
- paramètres ;
- unités ;
- profil utilisateur.

## Source de vérité du canevas

Le générateur doit s’appuyer sur :

- `data_admin.data_class_registry`
- `data_admin.field_registry`
- `metadata.referentiel_parametre_canonique`
- référentiels de stations/sites/bassins
- référentiels d’unités
