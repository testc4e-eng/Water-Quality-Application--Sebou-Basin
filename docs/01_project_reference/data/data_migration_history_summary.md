# Data Migration History Summary

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | summary |
| Périmètre | synthèse des phases de migration et d’industrialisation data |
| Source de vérité | Oui sur le résumé courant |
| Documents liés | [database_architecture](../architecture/database_architecture.md), [EVIDENCE_REGISTER](../EVIDENCE_REGISTER.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Objet

Ce document résume les étapes structurantes ayant permis de faire évoluer la base vers une organisation métier exploitable par le SAD. Les comptes rendus détaillés de chantier sont conservés en archive dans `docs/99_legacy_archive/data_migration_history/`.

## 2. Phase A - Assainissement structurel

Objectifs principaux :

- clarifier les structures historiques ;
- stabiliser les correspondances entre tables sources et schémas métier ;
- préparer la sortie progressive du schéma `public` comme zone de référence métier.

## 3. Phase B - Migration contrôlée

Objectifs principaux :

- déplacer les structures métier vers les schémas spécialisés ;
- limiter la rupture applicative ;
- préparer les vues de compatibilité et la couche d’exposition.

## 4. Phase C - Qualité et sécurisation des données

Objectifs principaux :

- corriger les incohérences résiduelles ;
- qualifier les mappings de paramètres, stations, barrages et points d’eau ;
- renforcer la traçabilité des opérations ;
- consolider la base documentaire de qualité.

## 5. Industrialisation

Les travaux ont ensuite porté sur :

- l’idempotence des scripts ;
- la journalisation des migrations ;
- les procédures de rollback et de sauvegarde ;
- la gouvernance des permissions ;
- la montée en qualité des vues d’exposition et des mécanismes de refresh.

## 6. Position actuelle

À date, la trajectoire de migration a permis :

- une organisation de la base par schémas métier ;
- la séparation entre objets de travail historiques (`staging`) et objets d’exposition (`api`, `analytics`) ;
- une meilleure lisibilité pour le backend, le frontend et les futurs livrables ;
- la conservation des historiques détaillés sans concurrence avec la documentation active.
