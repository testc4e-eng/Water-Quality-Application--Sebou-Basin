# Dépannage Docker - erreurs fréquentes SAD Sebou

## 1. `docker compose` ne démarre pas

### Symptômes

- `docker: command not found`
- `Cannot connect to the Docker daemon`
- Docker Desktop fermé

### Cause probable

- Docker Desktop n'est pas démarré
- le moteur Docker Linux n'est pas actif

### Correctif

- démarrer Docker Desktop
- attendre que l'état soit `Running`
- relancer la commande `docker compose up --build`

## 2. Le port `5432`, `8000` ou `5173` est déjà utilisé

### Symptômes

- erreur `port is already allocated`
- un ancien PostgreSQL local ou un ancien frontend/backend écoute déjà

### Correctif

1. identifier le processus ou le conteneur déjà actif
2. arrêter ce processus
3. ou changer la variable de port dans `.env`

Exemple :

- `BACKEND_PORT=8001`
- `FRONTEND_PORT=5174`
- `POSTGRES_PORT=5433`

Attention :

- si `BACKEND_PORT` change, mettre aussi à jour les variables frontend `VITE_API_*`

## 3. Le backend démarre mais `/health` retourne `db=DOWN` ou `db=ERROR`

### Cause probable

- la base n'est pas encore prête
- les variables DB sont incohérentes
- le conteneur backend tente de joindre `localhost` au lieu de `sad-db`

### Correctif

Vérifier :

- `docker compose ps`
- `docker compose logs sad-db`
- `docker compose logs sad-backend`

Contrôler les variables :

- `DB_HOST=sad-db`
- `DATABASE_URL=postgresql://...@sad-db:5432/...`

Tester manuellement :

```bash
docker compose exec sad-db pg_isready -U sad_user -d abh_sad
```

## 4. Le frontend s'ouvre mais n'affiche pas de données

### Cause probable

- les appels API du navigateur pointent vers une mauvaise URL
- incohérence entre `VITE_API_BASE_URL`, `VITE_API_BASE` et `VITE_API_PROXY`

### Correctif

Pour cette stack Docker simple, garder :

- `VITE_API_BASE_URL=http://localhost:8000/api/v1`
- `VITE_API_BASE=http://localhost:8000/api/v1`
- `VITE_API_PROXY=http://sad-backend:8000`

Rappel :

- `localhost` est correct pour le navigateur
- `sad-backend` est correct pour la communication interne entre conteneurs

## 5. Les modifications de code ne sont pas détectées depuis Windows/WSL

### Cause probable

- le file watching natif échoue sur montage de volume Docker Desktop

### Correctif

Les variables de polling sont déjà prévues :

- backend : `WATCHFILES_FORCE_POLLING=true`
- frontend : `CHOKIDAR_USEPOLLING=true`
- frontend : `WATCHPACK_POLLING=true`

Si le problème persiste :

1. redémarrer les services
2. vérifier que le code est bien monté dans le conteneur
3. éviter de travailler dans un dossier réseau non local

## 6. Le build backend échoue sur `geopandas`, `fiona` ou `pyproj`

### Cause probable

- dépendances système géospatiales absentes dans l'image

### Correctif

Le `backend/Dockerfile` installe déjà :

- `gdal-bin`
- `libgdal-dev`
- `libgeos-dev`
- `libproj-dev`
- `libpq-dev`

Si le build échoue encore :

1. reconstruire sans cache
2. vérifier l'accès réseau à PyPI
3. figer plus tard des versions Python/librairies si nécessaire

Commande utile :

```bash
docker compose build --no-cache sad-backend
```

## 7. Les données PostgreSQL persistent alors que je pensais repartir de zéro

### Cause probable

- le volume Docker `sad_pgdata` est persistant, ce qui est voulu

### Correctif

Ce comportement est normal.

Ne supprimer le volume qu'après validation explicite.

Commande destructive :

```bash
docker compose down -v
```

## 8. La stack Docker fonctionne mais ne reflète pas exactement l'environnement local historique

### Cause probable

Le projet contient déjà des incohérences historiques de ports :

- backend (obsolète) : `8011`
- frontend documenté en `3001`
- frontend `.env` local pointant en `8000`
- CORS backend acceptant aussi `5173`

### Correctif

Ne pas mélanger les deux conventions.

Convention retenue pour Docker :

- backend : `8000`
- frontend : `5173`
- base : `5432`

Convention historique hors Docker :

- backend (obsolète) : `8011`
- frontend : souvent `3001`

Documenter explicitement quel mode de lancement est utilisé.
