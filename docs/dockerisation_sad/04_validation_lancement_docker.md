# Validation lancement Docker SAD

## 1. Problème détecté

Le backend FastAPI crashait au démarrage dans le conteneur Docker avec l'erreur :

```text
ModuleNotFoundError: No module named 'jose'
```

Trace de départ observée :

- `app/main.py` importe `app.security.jwt_service`
- `app/security/jwt_service.py` importe `from jose import jwt, JWTError, ExpiredSignatureError`

## 2. Cause

Cause initiale confirmée :

- dépendance Python manquante dans `backend/requirements.txt`
- le package correct n'était pas `jose`, mais `python-jose[cryptography]`

Après correction de cette première dépendance, d'autres imports réellement utilisés au démarrage backend se sont révélés également absents :

- `passlib[bcrypt]`
- `email-validator`
- `networkx`

Ces ajouts ont été faits de manière itérative, uniquement après échec runtime observé dans les logs du conteneur backend.

## 3. Correction appliquée

### Fichiers modifiés

| Fichier | Modification |
|---|---|
| `backend/requirements.txt` | ajout des dépendances manquantes réellement requises au runtime |

### Détail avant / après / raison

#### 1. `backend/requirements.txt`

Avant :

```text
# === Core API ===
fastapi
uvicorn
pydantic
python-dotenv

# === Data science ===
numpy
pandas
scipy

# === Database ===
sqlalchemy
psycopg2-binary

# === Geospatial ===
pyproj
shapely
fiona
geopandas
geojson

# === Utilities ===
requests
click
colorama
```

Après :

```text
# === Core API ===
fastapi
uvicorn
pydantic
python-dotenv
python-jose[cryptography]
passlib[bcrypt]
email-validator

# === Data science ===
numpy
pandas
scipy
networkx

# === Database ===
sqlalchemy
psycopg2-binary

# === Geospatial ===
pyproj
shapely
fiona
geopandas
geojson

# === Utilities ===
requests
click
colorama
```

Raison :

- `python-jose[cryptography]` : requis par `app.security.jwt_service`
- `passlib[bcrypt]` : requis par `app.security.passwords` et `app.core.security`
- `email-validator` : requis par les schémas Pydantic avec validation email
- `networkx` : requis par `app.services.hydrology.routing_service`, `graph_builder` et `topology_qa`

## 4. Commandes exécutées

```powershell
docker compose down
docker compose build --no-cache sad-backend
docker compose up -d
docker compose logs --no-color sad-backend
docker compose build --no-cache sad-backend
docker compose up -d sad-backend sad-frontend
docker compose logs --no-color sad-backend
docker compose build --no-cache sad-backend
docker compose up -d sad-backend
docker compose logs --no-color sad-backend
docker compose build --no-cache sad-backend
docker compose up -d sad-backend
docker compose logs --no-color sad-backend
docker compose ps
docker compose logs --no-color sad-frontend
```

Commandes de test HTTP exécutées :

```powershell
Invoke-WebRequest http://localhost:8011/docs
Invoke-WebRequest http://localhost:8011/openapi.json
Invoke-WebRequest http://localhost:8011/health
Invoke-WebRequest http://localhost:8000/docs
Invoke-WebRequest http://localhost:8000/openapi.json
Invoke-RestMethod http://localhost:8000/health
Invoke-WebRequest http://localhost:8000/api/v1/health
Invoke-WebRequest http://localhost:5173
Invoke-WebRequest http://localhost:5174
```

## 5. Résultat des services

| Service | Statut | Port | Observation |
|---|---|---|---|
| `sad-db` | `UP (healthy)` | `5432` | base Docker démarrée correctement |
| `sad-backend` | `UP` | `8000` | backend démarré, OpenAPI et `/health` disponibles |
| `sad-frontend` | `UP` | `5173` | Vite compilé et exposé correctement |

## 6. Résultat des tests API

| Endpoint | Résultat | Code HTTP | Observation |
|---|---|---|---|
| `http://localhost:8011/docs` | échec | n/a | port non utilisé par la stack Docker actuelle |
| `http://localhost:8011/openapi.json` | échec | n/a | port non utilisé par la stack Docker actuelle |
| `http://localhost:8011/health` | échec | n/a | port non utilisé par la stack Docker actuelle |
| `http://localhost:8000/docs` | OK | `200` | Swagger accessible |
| `http://localhost:8000/openapi.json` | OK | `200` | OpenAPI accessible |
| `http://localhost:8000/health` | OK | `200` | réponse `{\"status\":\"OK\",\"db\":\"OK\"}` |
| `http://localhost:8000/api/v1/health` | échec | `404` | aucun health endpoint sous `/api/v1` |
| `http://localhost:8000/api/v1/stations` | OK | `200` | route GET accessible |
| `http://localhost:8000/api/v1/routing/topology-qa` | OK | `200` | route GET accessible |
| `http://localhost:8000/api/v1/map/catalog` | OK | `200` | route GET accessible |
| `http://localhost:8000/api/v1/barrages` | échec | `500` | erreur runtime côté SQL / données |
| `http://localhost:8000/api/v1/quality/stations` | échec | `500` | erreur runtime côté SQL / données |
| `http://localhost:8000/api/v1/qualite/metaux?limit=5` | échec | `500` | erreur runtime côté SQL / données |
| `http://localhost:8000/api/v1/pollution/sites.geojson` | échec | `500` | vue SQL absente `api.v_pollution_sites` |
| `http://localhost:8000/api/v1/observatory/hierarchy/themes` | échec | `500` | vue SQL absente `api.v_hierarchie_metier_listing` |
| `http://localhost:8000/api/v1/analytics/hydrologie/sites` | échec | `422` | endpoint accessible mais paramètres attendus non fournis |
| `http://localhost:8000/api/v1/geojson/barrages` | échec | `404` | `barrages` n'est pas un `layer_key` valide pour cette route |

## 7. Problèmes restants

- plusieurs routes métier retournent encore `500` car la base Docker lancée est vide ou ne contient pas les vues/objets SQL attendus par l'application
- erreurs confirmées dans les logs backend :
  - `relation "api.v_pollution_sites" does not exist`
  - `relation "api.v_hierarchie_metier_listing" does not exist`
- le backend fonctionne techniquement, mais il n'est pas encore pleinement exploitable fonctionnellement sans stratégie d'initialisation de schéma/données adaptée
- la stack Docker actuelle utilise `8000` pour le backend, pas `8011`
- le frontend Docker est sur `5173`; `5174` répond aussi sur la machine, mais ce port n'est pas publié par cette stack Docker

## 8. Prochaine étape recommandée

1. stabiliser explicitement la convention de ports Docker versus hors Docker (`8000/5173` contre `8011/3001`)
2. ajouter un healthcheck backend Docker explicite, distinct du seul healthcheck PostgreSQL
3. préparer ensuite une variante frontend production `build + nginx`
4. définir plus tard une stratégie d'initialisation/migration DB non destructive, sans import automatique de dump et sans toucher à la base officielle

## Synthèse de diagnostic read-only

### Dépendances vérifiées

| Dépendance | Présence initiale | Observation |
|---|---|---|
| `python-jose[cryptography]` | non | manquante, cause initiale du crash |
| `passlib[bcrypt]` | non | manquante, import réel dans la sécurité |
| `cryptography` | non directement | apportée ensuite par l'extra `python-jose[cryptography]` |
| `bcrypt` | non directement | apportée ensuite par l'extra `passlib[bcrypt]` |
| `python-multipart` | non | pas encore bloquante au démarrage courant, à ajouter seulement si un endpoint multipart est exercé et échoue |
| `pydantic-settings` | non | non utilisé dans le code inspecté |
| `psycopg2-binary` | oui | présent |
| `SQLAlchemy` / `sqlalchemy` | oui | présent |

### Module Python responsable du crash initial

- `backend/app/security/jwt_service.py`

## 9. Mise a jour 2026-06-02 - Backend Docker connecte a la vraie base locale `abh_sad`

### Probleme clarifie

Le blocage SQL ne venait pas du backend Docker lui-meme, mais du fait que `sad-backend` pointait vers `sad-db`, une base PostGIS Docker vide qui ne contenait ni les schemas applicatifs ni les vues metier attendues.

La vraie base SAD utilisee localement sur Windows est :

- base PostgreSQL locale : `abh_sad`

### Cause fonctionnelle des vues absentes

Les vues telles que :

- `api.v_pollution_sites`
- `api.v_hierarchie_metier_listing`
- `analytics.mv_dashboard_hydrologie_menu`

etaient absentes uniquement dans la base Docker vide. Elles existent dans la base locale Windows `abh_sad`, qui est la vraie source metier du projet.

### Correction appliquee

Fichiers modifies :

| Fichier | Modification |
|---|---|
| `docker-compose.yml` | `sad-backend` pointe par defaut vers `host.docker.internal`; `sad-db` devient optionnel via profil `docker-db`; ajout `extra_hosts` |
| `.env.docker.example` | exemple mis a jour pour le mode `backend Docker -> PostgreSQL local Windows` sans secret reel |
| `.env` | fichier local non versionne cree pour les vrais identifiants et le mode local DB |

### Variables utilisees par le backend

Variables detectees dans le code :

| Variable | Usage |
|---|---|
| `DATABASE_URL` | prioritaire dans `backend/app/db_raw.py` si fournie |
| `DB_HOST` | host PostgreSQL principal |
| `DB_PORT` | port PostgreSQL principal |
| `DB_NAME` | base PostgreSQL principale |
| `DB_USER` | utilisateur PostgreSQL principal |
| `DB_PASS` | mot de passe PostgreSQL principal |
| `CLIMATE_DB_HOST` | host SQLAlchemy climat/quality/analytics |
| `CLIMATE_DB_PORT` | port SQLAlchemy climat/quality/analytics |
| `CLIMATE_DB_NAME` | base SQLAlchemy climat/quality/analytics |
| `CLIMATE_DB_USER` | utilisateur SQLAlchemy climat/quality/analytics |
| `CLIMATE_DB_PASS` | mot de passe SQLAlchemy climat/quality/analytics |

Configuration retenue pour le mode local DB :

- `DB_HOST=host.docker.internal`
- `DB_PORT=5432`
- `DB_NAME=abh_sad`
- `CLIMATE_DB_HOST=host.docker.internal`
- `CLIMATE_DB_PORT=5432`
- `CLIMATE_DB_NAME=abh_sad`

Remarque importante :

- `DATABASE_URL` est laissee vide par defaut en mode local DB pour eviter les erreurs de DSN quand le mot de passe contient des caracteres speciaux non URL-encodes
- le backend reconstruit alors correctement ses connexions depuis `DB_*`

### Commandes executees

```powershell
docker compose config
docker compose down
docker compose up --build -d
docker ps
docker compose logs --tail 120 sad-backend
docker compose exec -T sad-backend python -
Invoke-WebRequest http://localhost:8000/health
Invoke-WebRequest http://localhost:8000/docs
Invoke-WebRequest http://localhost:8000/api/v1/barrages
Invoke-WebRequest http://localhost:8000/api/v1/pollution/sites.geojson
Invoke-WebRequest http://localhost:8000/api/v1/observatory/hierarchy/themes
Invoke-WebRequest http://localhost:8000/api/v1/quality/stations
Invoke-WebRequest http://localhost:5173
```

### Test explicite de connexion DB depuis le conteneur backend

Commande executee :

```powershell
@'
import os, psycopg2
conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASS"),
)
cur = conn.cursor()
cur.execute("select current_database(), current_user")
print(cur.fetchone())
conn.close()
'@ | docker compose exec -T sad-backend python -
```

Resultat observe :

```text
('abh_sad', 'postgres')
```

### Resultat des services apres connexion a la base locale

| Service | Statut | Port | Observation |
|---|---|---|---|
| `sad-backend` | `UP` | `8000` | demarre et se connecte a `abh_sad` via `host.docker.internal` |
| `sad-frontend` | `UP` | `5173` | Vite OK |
| `sad-db` | optionnel | `5432` | peut rester disponible en profil `docker-db`, mais n'est plus requis pour le backend local DB |

### Resultat des tests API apres correction

| Endpoint | Resultat | Code HTTP | Observation |
|---|---|---|---|
| `http://localhost:8000/health` | OK | `200` | backend et DB locale OK |
| `http://localhost:8000/docs` | OK | `200` | Swagger OK |
| `http://localhost:8000/api/v1/barrages` | OK | `200` | acces a la vraie table metier locale |
| `http://localhost:8000/api/v1/pollution/sites.geojson` | OK | `200` | vues pollution presentes dans `abh_sad` |
| `http://localhost:8000/api/v1/observatory/hierarchy/themes` | OK | `200` | vue hierarchy presente dans `abh_sad` |
| `http://localhost:8000/api/v1/quality/stations` | OK | `200` | table qualite locale accessible |
| `http://localhost:5173` | OK | `200` | frontend demarre correctement |

### Probleme restant principal

- la stack Docker supporte maintenant deux modes implicites :
  - backend vers base locale Windows
  - backend vers base Docker optionnelle
- si l'utilisateur active le profil `docker-db`, il doit aussi fournir des variables cohérentes (`DB_HOST=sad-db`, etc.) s'il veut vraiment utiliser cette base
