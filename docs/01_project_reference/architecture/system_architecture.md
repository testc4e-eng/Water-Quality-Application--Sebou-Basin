# System Architecture

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | architecture générale de la solution SAD |
| Source de vérité | Oui |
| Documents liés | [database_architecture](./database_architecture.md), [backend_overview](../backend/backend_overview.md), [frontend_reference](../frontend/frontend_reference.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Finalité de la solution

Le système développé constitue une plateforme web décisionnelle dédiée à la gestion de la qualité des eaux de surface du bassin du Sebou. Il articule :

- la centralisation des données hydrologiques, météorologiques, qualité, pollution et SIG ;
- l’intégration des résultats de modèles et de scénarios ;
- la restitution cartographique et analytique via des dashboards ;
- les fonctions d’administration, de gouvernance et de traçabilité.

## 2. Stack structurante

| Couche | Technologies principales | Rôle |
|---|---|---|
| Frontend | React, Vite, TypeScript, React Query | Dashboards, cartographie, administration |
| Backend | FastAPI, Python, services métier et routes REST | Exposition des données, sécurité, ingestion, analytics |
| Base de données | PostgreSQL, PostGIS, TimescaleDB | Persistance, spatial, séries temporelles, vues d’exposition |
| Restitution | composants graphiques, export PDF/CSV/XLSX, GeoJSON | Analyse, comparaison, partage |

## 3. Organisation en couches

### Couche données

La base de données est sectorisée par schémas métier. Les schémas `geo`, `infra`, `hydro`, `meteo`, `qualite`, `metadata`, `security`, `staging`, `swat_*` et `wasp_*` organisent la donnée source, les référentiels, les sorties de modèles et la gouvernance.

### Couche exposition backend

Le backend agrège plusieurs familles de routes :

- authentification et comptes ;
- routes analytiques et observatoire ;
- couches cartographiques ;
- administration, raw data et scan ;
- ingestion des scénarios et contrôle qualité ;
- sécurité, logs et audit.

### Couche restitution frontend

Le frontend orchestre :

- une page d’accueil ;
- un dashboard cartographique ;
- un dashboard analytique ;
- un module scénarios ;
- des écrans d’administration et de paramétrage ;
- des parcours d’authentification.

## 4. Flux fonctionnel principal

```text
Sources de données métier
(hydro, météo, qualité, pollution, référentiels SIG, résultats SWAT/WASP)
        ↓
Base PostgreSQL / PostGIS / TimescaleDB
(schémas métier + staging + metadata + security + api)
        ↓
Services backend FastAPI
(auth, analytics, observatory, layers, ingestion, raw, admin, audit)
        ↓
Interface web React
(dashboards, cartographie, administration, exploration des données)
        ↓
Fonctions décisionnelles
(analyse, comparaison, suivi, contrôle qualité, export, aide à la décision)
```

## 5. Modules structurants

| Module | Description |
|---|---|
| Collecte et intégration | intégration des données métier, tables techniques, scan et exploration |
| Dashboards analytiques | climat, hydrologie, qualité, pollution, multi-séries |
| Dashboard cartographique | couches observatoire, filtres, popups, légendes, emprises |
| Modèles et scénarios | intégration SWAT/WASP, validation, QA, restitution dédiée |
| Administration | comptes, audit, popup rules, raw data, data scan |
| Gouvernance | rôles, logs, référentiels, dictionnaire et suivi des refresh |

## 6. Principes d’architecture retenus

- séparation claire entre persistance, exposition API et restitution UI ;
- exposition métier via vues SQL et endpoints spécialisés ;
- usage des vues matérialisées pour sécuriser la performance des dashboards ;
- maintien d’une couche de gouvernance documentaire et technique indépendante des notes de travail ;
- capacité d’évolution modulaire sans remise à plat de l’ensemble.

## 7. Points opérationnels

- le système est exploitable en local par démarrage indépendant du backend et du frontend ;
- le backend expose également les fonctions de refresh de vues matérialisées ;
- la documentation active du projet est désormais séparée des prompts et archives, ce qui réduit le risque de divergence entre code et documentation.
