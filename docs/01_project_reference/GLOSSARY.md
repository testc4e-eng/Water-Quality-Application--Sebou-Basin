# GLOSSARY

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | vocabulaire métier, technique et documentaire |
| Source de vérité | Oui |
| Documents liés | [project_vision](./overview/project_vision.md), [CPS_MAPPING_PROJECT](../02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md) |
| Dernière mise à jour | 2026-04-10 |

## Abréviations

| Terme | Signification | Usage dans le projet |
|---|---|---|
| ABHS | Agence du Bassin Hydraulique du Sebou | Maître d’ouvrage et référentiel métier |
| SAD | Système d’Aide à la Décision | Plateforme cible de la Mission IV |
| SIG | Système d’Information Géographique | Cartographie, couches, emprises et visualisation spatiale |
| API | Application Programming Interface | Couche d’exposition backend consommée par le frontend |
| QA | Quality Assurance | Contrôle de qualité, conformité, anomalies, seuils |
| KPI | Key Performance Indicator | Indicateurs de synthèse affichés dans les dashboards |
| RBAC | Role-Based Access Control | Gestion des habilitations par rôles |
| MV | Materialized View | Vue matérialisée utilisée pour la performance applicative |
| SWAT | Soil and Water Assessment Tool | Modèle hydrologique et de qualité intégré à la plateforme |
| WASP | Water Quality Analysis Simulation Program | Modèle qualité des eaux intégré aux scénarios |
| CRUD | Create, Read, Update, Delete | Opérations d’administration sur les données brutes |

## Vocabulaire métier

| Terme | Définition projet |
|---|---|
| Observatoire | Couche fonctionnelle qui organise les hiérarchies métier, paramètres, dernières valeurs et séries utilisées par les tableaux de bord |
| Station | Point de mesure ou d’observation utilisé pour l’hydrologie, la météo, la qualité ou les suivis spécifiques |
| Sous-bassin | Unité spatiale de lecture et de restitution territoriale |
| Réseau hydrographique | Couche SIG des cours d’eau et du linéaire hydrographique |
| Point d’eau | Entité métier regroupant certaines occurrences d’ouvrages ou d’observations hydrauliques |
| Source de pollution | Entité métier représentant un rejet, une infrastructure ou une activité contributive à la pollution |
| Popup rules | Règles de paramétrage contrôlant les attributs visibles dans les popups cartographiques |
| Data scan | Module de contrôle de disponibilité et de couverture des données par source, variable ou entité |
| Data viewer / raw | Module d’exploration et de gestion de tables brutes ou techniques |
| Ingestion | Chaîne de chargement, de validation et de traçabilité des fichiers de scénarios ou de données structurées |

## Vocabulaire de données

| Terme | Définition projet |
|---|---|
| Schéma métier | Schéma PostgreSQL spécialisé par domaine (`hydro`, `qualite`, `meteo`, `infra`, `geo`, etc.) |
| Schéma `staging` | Zone de conservation et de transition des structures historiques ou intermédiaires |
| Schéma `api` | Couche d’exposition SQL composée de vues et de vues matérialisées dédiées à l’application |
| Schéma `metadata` | Référentiels de mapping, dictionnaires, couverture, popups et suivi des refresh |
| Série temporelle | Donnée datée utilisée pour les graphiques, indicateurs et comparaisons |
| Compatibilité legacy | Maintien contrôlé d’objets ou de conventions antérieures pour assurer la continuité du système |

## Vocabulaire documentaire

| Terme | Définition documentaire |
|---|---|
| Document maître | Document faisant autorité sur un sujet donné |
| Document dérivé | Résumé ou vue spécialisée d’un document maître |
| Generated export | Export bureautique ou format de restitution produit depuis une source Markdown |
| Working note | Note de travail liée à un run, un prompt ou une intervention ponctuelle |
| Legacy archive | Historique conservé pour mémoire et traçabilité, mais non utilisé comme référence courante |
