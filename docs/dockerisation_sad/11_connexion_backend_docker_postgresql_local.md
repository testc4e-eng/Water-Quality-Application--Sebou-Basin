# Connexion du backend Docker a PostgreSQL local Windows

## Objectif

Permettre au conteneur `sad-backend` de consommer directement la vraie base locale Windows `abh_sad`, sans dump, sans migration destructive et sans dupliquer les donnees metier dans `sad-db`.

## Pourquoi `sad-db` etait vide

Le service `sad-db` de `docker-compose.yml` cree une base PostgreSQL/PostGIS propre avec un volume Docker local.

Sans script d'initialisation metier ni import de dump :

- seuls les objets techniques PostgreSQL/PostGIS existent
- les schemas applicatifs SAD n'existent pas
- les vues `api.*`, `metadata.*`, `analytics.*` n'existent pas

Donc `sad-db` etait techniquement saine, mais fonctionnellement vide pour le SAD.

## Pourquoi les vues SQL etaient absentes

Le backend attendait des objets comme :

- `api.v_pollution_sites`
- `api.v_hierarchie_metier_listing`
- `analytics.mv_dashboard_hydrologie_menu`
- `qualite.mesure_qualite_riviere`
- `infra.barrages`

Ces objets sont dans la vraie base locale Windows `abh_sad`, pas dans la base Docker vide.

Les erreurs 500 observees apres la premiere dockerisation venaient donc d'un mauvais pointage de la connexion DB, pas d'un bug Python.

## Pourquoi `host.docker.internal` est utilise

Depuis un conteneur Docker, `localhost` designe le conteneur lui-meme, pas la machine Windows hote.

`host.docker.internal` est le nom special fourni par Docker Desktop pour joindre la machine hote depuis le conteneur.

Dans ce projet, il permet a `sad-backend` de se connecter a :

- PostgreSQL local Windows
- base `abh_sad`
- port `5432`

Pour compatibilite Docker Desktop + WSL, `docker-compose.yml` ajoute aussi :

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

## Variables a configurer

Le backend lit les variables suivantes :

| Variable | Role |
|---|---|
| `DATABASE_URL` | DSN complet optionnel, prioritaire dans `db_raw.py` |
| `DB_HOST` | connexion principale |
| `DB_PORT` | connexion principale |
| `DB_NAME` | connexion principale |
| `DB_USER` | connexion principale |
| `DB_PASS` | connexion principale |
| `CLIMATE_DB_HOST` | connexion SQLAlchemy secondaire |
| `CLIMATE_DB_PORT` | connexion SQLAlchemy secondaire |
| `CLIMATE_DB_NAME` | connexion SQLAlchemy secondaire |
| `CLIMATE_DB_USER` | connexion SQLAlchemy secondaire |
| `CLIMATE_DB_PASS` | connexion SQLAlchemy secondaire |

Configuration recommandee pour le mode local Windows :

```env
DB_HOST=host.docker.internal
DB_PORT=5432
DB_NAME=abh_sad
DB_USER=postgres
DB_PASS=...

CLIMATE_DB_HOST=host.docker.internal
CLIMATE_DB_PORT=5432
CLIMATE_DB_NAME=abh_sad
CLIMATE_DB_USER=postgres
CLIMATE_DB_PASS=...

DATABASE_URL=
```

## Pourquoi `DATABASE_URL` est laissee vide par defaut

Dans ce projet :

- `backend/app/db_raw.py` donne priorite a `DATABASE_URL`
- `backend/app/db/session.py` et `backend/app/db/climate_database.py` reconstruisent un DSN depuis `DB_*` et `CLIMATE_DB_*`

Si le mot de passe PostgreSQL contient des caracteres speciaux comme `@`, `:`, `/` :

- un `DATABASE_URL` non URL-encode peut casser la connexion

Pour limiter ce risque, le mode local DB recommande :

- `DATABASE_URL` vide
- `DB_*` et `CLIMATE_DB_*` renseignes explicitement

## Fichiers concernes

### Versionnes

- `docker-compose.yml`
- `.env.docker.example`
- `docs/dockerisation_sad/04_validation_lancement_docker.md`
- `docs/dockerisation_sad/11_connexion_backend_docker_postgresql_local.md`

### Non versionnes

- `.env`

Le fichier `.env` est ignore par git et doit contenir les vrais identifiants locaux.

## Commandes de lancement

### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose up --build
```

### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose up --build
```

## Commande de test de connexion DB depuis le conteneur

### PowerShell

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

Resultat attendu :

```text
('abh_sad', 'postgres')
```

## Endpoints de validation

```text
http://localhost:8000/health
http://localhost:8000/docs
http://localhost:8000/api/v1/barrages
http://localhost:8000/api/v1/pollution/sites.geojson
http://localhost:8000/api/v1/observatory/hierarchy/themes
http://localhost:8000/api/v1/quality/stations
http://localhost:5173
```

## Profil Docker optionnel `docker-db`

Le service `sad-db` est maintenant optionnel via le profil Compose :

```powershell
docker compose --profile docker-db up --build
```

Attention :

- lancer le profil `docker-db` ne suffit pas a lui seul
- si vous voulez que `sad-backend` utilise cette base Docker, il faut aussi adapter les variables :
  - `DB_HOST=sad-db`
  - `CLIMATE_DB_HOST=sad-db`
  - et eventuellement `DATABASE_URL`

## Limites de securite

- ne jamais versionner les vrais mots de passe dans `.env.docker.example`
- ne jamais recopier des secrets reels dans la documentation
- `host.docker.internal` ouvre un acces reseau du conteneur vers la machine hote : cela doit rester limite a un usage local de developpement
- verifier que PostgreSQL local accepte la connexion depuis Docker Desktop et que `pg_hba.conf`/`listen_addresses` sont coherents

## Conclusion

Le mode le plus utile pour le SAD n'est pas une base Docker vide, mais :

- frontend Docker
- backend Docker
- vraie base PostgreSQL locale Windows `abh_sad`

Cette approche preserve les donnees existantes et supprime les 500 lies aux vues SQL absentes dans `sad-db`.
