# Strategie d'initialisation non destructive de la base Docker

## Objectif

Permettre a la stack Docker de demarrer avec une base compatible API sans :

- toucher a la base officielle
- importer automatiquement un dump complet
- executer de script destructif
- melanger demo Docker et donnees metier de reference

## Principe general

La base Docker doit evoluer en trois niveaux distincts.

## Niveau A — Base minimale technique

### Cible

Eviter les 500 dus aux objets SQL absents, meme si aucune donnee metier n'est chargee.

### Contenu

- extensions PostgreSQL/PostGIS requises
- schemas applicatifs vides :
  - `api`
  - `analytics`
  - `geo`
  - `hydro`
  - `infra`
  - `metadata`
  - `meteo`
  - `qualite`
  - `wasp_output`
  - `swat_output`
- vues de compatibilite vides ou mockees :
  - `api.v_station_dimension`
  - `api.v_barrage_dimension`
  - `api.v_points_eau`
  - `api.v_pollution_sites`
  - `api.v_pollution_latest_results`
  - `api.v_hierarchie_metier_listing`
  - `metadata.obs_referentiel_parametre`
  - `metadata.obs_parametre_entite_compat`
  - `metadata.obs_parametre_coverage`
  - `analytics.mv_dashboard_climat_meteo_menu`
  - `analytics.mv_dashboard_hydrologie_menu`
  - `analytics.mv_dashboard_pollution_menu`

### Effet attendu

- les routes qui lisent ces vues ne crashent plus
- elles repondent avec des tableaux vides ou des `FeatureCollection` vides
- le contrat frontend/backend devient testable sans donnees reelles

### Limites

- les routes qui lisent directement des tables metier continueront a echouer si les tables n'existent pas

## Niveau B — Base de demonstration

### Cible

Rendre la demo Docker pedagogique et utile, avec tres peu de donnees fictives.

### Contenu

- tables minimales creees si absentes :
  - `infra.barrages`
  - `infra.stations_mesure`
  - `hydro.mesure_debit`
  - `hydro.mesure_barrage_param`
  - `qualite.mesure_qualite_riviere`
- un petit seed fictif ou anonymise :
  - 1 station
  - 1 barrage
  - 1 mesure hydrologique
  - 1 mesure qualite
  - 1 site pollution demo
- `CREATE OR REPLACE VIEW` des vues `api.*` pour pointer vers ces tables minimales

### Effet attendu

- `/api/v1/barrages` retourne au moins une ligne de demo
- `/api/v1/quality/stations` retourne au moins une station
- `/api/v1/pollution/sites.geojson` retourne une `FeatureCollection` valide
- `/api/v1/observatory/hierarchy/themes` retourne au moins un theme de demonstration
- `/api/v1/analytics/hydrologie/sites?submenu=debit` retourne au moins un site

### Limites

- ce niveau n'est pas une copie de production
- il ne valide pas les volumes, perfs ni les vrais workflows metier

## Niveau C — Base metier complete

### Cible

Approcher le comportement pre-production ou recette.

### Contenu

- import controle depuis dump ou scripts valides
- versionnement clair des scripts d'import
- validation explicite avant execution
- documentation de la provenance, anonymisation et volumetrie

### Conditions prealables

- validation explicite utilisateur
- cadrage du dump autorise
- verification que la cible est bien la base Docker et uniquement elle

## Scripts proposes

Les scripts de proposition non executes sont :

- `database/docker_init/00_extensions.sql`
- `database/docker_init/01_schemas.sql`
- `database/docker_init/02_empty_views_api.sql`
- `database/docker_init/03_minimal_seed_demo.sql`

## Ordre recommande

1. Appliquer Niveau A pour faire disparaitre les 500 de contrat SQL
2. Tester l'API avec `scripts/test_docker_api.ps1`
3. Appliquer Niveau B si l'objectif est une demo fonctionnelle locale
4. Garder Niveau C hors automatisme Docker Compose

## Ce qui peut etre automatise plus tard

### Automatisation possible

- montage conditionnel d'un dossier `docker-entrypoint-initdb.d/` pour une base Docker jetable
- profil Compose dedie `demo`
- variable d'environnement explicite :
  - `SAD_DOCKER_INIT_LEVEL=A|B|C`

### Ce qu'il ne faut pas automatiser maintenant

- import d'un dump complet dans `docker-compose up`
- suppression/recreation de volumes sans validation
- pointage de Docker vers la base officielle

## Commandes futures possibles, mais non executees ici

```powershell
docker compose exec -T sad-db psql -U sad_user -d abh_sad -f database/docker_init/00_extensions.sql
docker compose exec -T sad-db psql -U sad_user -d abh_sad -f database/docker_init/01_schemas.sql
docker compose exec -T sad-db psql -U sad_user -d abh_sad -f database/docker_init/02_empty_views_api.sql
docker compose exec -T sad-db psql -U sad_user -d abh_sad -f database/docker_init/03_minimal_seed_demo.sql
```

Statut de ces commandes :

- techniquement non destructives selon les scripts fournis
- a executer seulement apres validation explicite
