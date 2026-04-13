# Schema Base de Donnees - SAD Sebou 2026

## Constat
Le code confirme l'existence d'une base PostgreSQL metier riche, mais le schema applicatif versionne dans le repo est incomplet. Le SAD consomme surtout des tables/vues existantes.

## Tables/vues confirmees par le code
- `public.stations_abhs`
- `public.barrages_abhs`
- `public.bassin_sebou`
- `public.sous_bassin_sebou`
- `public.reseau_hydro_abhs`
- `public.adm_regions_abhs`
- `public.adm_provinces_abhs`
- `public.adm_cercles_abhs`
- `public.adm_communes_abhs`
- `public.adm_villes_abhs`
- `public.adm_douars_abhs`
- `api.v_stations_stats`
- `api.v_measurements_latest`
- `api.v_measurements_daily`
- `api.v_measurements_monthly`
- `api.v_measurements_annual`
- `api.v_quality_stations`
- `api.v_quality_kpis`
- `api.v_quality_measurements`

## Lecture metier
- Entites spatiales: bassin, sous-bassin, reseau hydro, barrages, stations, limites administratives
- Entites temporelles: mesures climat/hydro par `ts_id`
- Entites qualite: stations qualite, mesures N/O/P
- Entites modeles: scenarios et sorties SWAT

## Proposition minimale de formalisation
1. Conserver la base metier existante comme source de verite.
2. Versionner un schema logique cible dans Alembic ou SQL.
3. Distinguer:
   - `core`: referentiels geographiques et metier
   - `timeseries`: mesures observees et agregees
   - `models`: sorties SWAT et scenarios
   - `security`: utilisateurs, roles, traces d'acces

## Risques
- Couplage fort aux vues `api.*`
- Absence de dictionnaire versionne des champs
- ORM du repo non representatif du schema reel
