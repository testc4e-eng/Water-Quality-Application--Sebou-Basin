# Data Sources Reference

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | familles de données alimentant le SAD |
| Source de vérité | Oui |
| Documents liés | [DATABASE_SCHEMA](./DATABASE_SCHEMA.md), [database_architecture](../architecture/database_architecture.md) |
| Dernière mise à jour | 2026-04-17 |

## 1. Familles de données couvertes

| Domaine | Schémas principaux | Description |
|---|---|---|
| Hydrologie | `hydro`, `infra`, `api` | stations, débits, niveaux, barrages et restitution hydrologique |
| Météorologie | `meteo`, `api`, `analytics` | précipitations, évaporation, températures et agrégats climatiques |
| Qualité des eaux | `qualite`, `api`, `metadata` | mesures de qualité, campagnes, paramètres et restitutions thématiques |
| Pollution et infrastructures | `infra`, `monitoring`, `metadata` | STEP, rejets, sources de pollution, ouvrages et suivi associé |
| Référentiels SIG | `geo`, `admin`, `infra` | bassins, sous-bassins, réseau hydrographique, découpages et points géographiques |
| Modèles et scénarios | `swat_output`, `swat_sebou`, `wasp_output`, `wasp_sebou`, `modeles` | résultats de modèles, scénarios et variables associées |
| Gouvernance et sécurité | `security`, `audit`, `metadata`, `qa` | utilisateurs, rôles, logs, mappings, qualité et règles de paramétrage |

## 2. Origines fonctionnelles

Les données prises en charge dans le système proviennent principalement :

- des stations et référentiels métier ;
- des séries historiques hydro-météo ;
- des campagnes de mesure qualité ;
- des inventaires et ouvrages liés aux pressions et infrastructures ;
- des résultats de modélisation SWAT et WASP ;
- des référentiels et mappings construits pour la restitution et la gouvernance.

## 3. Usage applicatif

Ces données alimentent :

- les dashboards analytiques ;
- le dashboard cartographique ;
- les exports et reporting ;
- le data scan ;
- le data viewer ;
- les modules d’ingestion et de contrôle qualité ;
- l’administration et les paramètres d’affichage.
