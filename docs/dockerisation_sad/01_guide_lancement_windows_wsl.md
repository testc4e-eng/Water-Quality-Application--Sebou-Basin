# Guide de lancement Docker SAD depuis Windows et WSL

## Contexte

Ce guide couvre le premier socle Docker du SAD Sebou :

- `sad-db` : PostgreSQL/PostGIS
- `sad-backend` : FastAPI
- `sad-frontend` : React/Vite en mode développement

Cette version est volontairement simple :

- pas d'import automatique de dump
- pas de suppression de données existantes
- pas de frontend Nginx de production à ce stade

## Préparation

### 1. Prérequis

- Docker Desktop installé et démarré
- mode Linux containers actif
- Docker Compose v2 disponible via `docker compose`

### 2. Préparer le fichier d'environnement

Depuis le dossier `repo_git`, créer un fichier `.env` à partir de l'exemple :

#### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
Copy-Item .env.docker.example .env
```

#### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
cp .env.docker.example .env
```

Remarque :

- `docker-compose.yml` prévoit aussi des valeurs par défaut.
- La copie vers `.env` est néanmoins recommandée pour rendre les paramètres visibles et modifiables proprement.

## Lancement

### Depuis Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose up --build
```

### Depuis WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose up --build
```

## Vérifications

### Backend

Tester la santé :

#### Windows PowerShell

```powershell
curl http://localhost:8000/health
```

#### WSL

```bash
curl http://localhost:8000/health
```

Tester la documentation OpenAPI :

#### Windows PowerShell

```powershell
curl http://localhost:8000/docs
```

#### WSL

```bash
curl http://localhost:8000/docs
```

Accès navigateur :

- [Backend health](http://localhost:8000/health)
- [Swagger UI](http://localhost:8000/docs)

### Frontend

Ouvrir :

- [Frontend Vite](http://localhost:5173)

## Arrêt

### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose down
```

### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose down
```

## Analyse pédagogique rapide

### Ce que fait Docker Compose ici

- il démarre une base PostGIS isolée
- il démarre le backend en lui injectant les variables de connexion vers `sad-db`
- il démarre le frontend Vite et publie son port vers l'hôte
- il crée un réseau privé Docker pour que les conteneurs se parlent par nom de service

### Pourquoi `sad-db` dans `DATABASE_URL`

Dans Docker Compose, les conteneurs ne se parlent pas via `localhost`, mais via le nom du service :

- correct en conteneur : `sad-db:5432`
- incorrect en conteneur : `localhost:5432`

### Pourquoi garder `localhost` pour `VITE_API_BASE_URL`

Le navigateur de l'utilisateur tourne sur la machine hôte, pas dans le conteneur frontend.
Il doit donc appeler l'API publiée par Docker sur l'hôte :

- `http://localhost:8000/api/v1`

## Limites de cette première version

- pas de chargement automatique des données métier
- pas d'image frontend de production avec Nginx
- pas de stratégie de migration base au démarrage
- pas de profil Docker séparé pour les modules lourds SWAT/WASP
- backend géospatial dépendant des bibliothèques système installées dans l'image

## Étape suivante recommandée

Après validation de ce socle :

1. ajouter un mode frontend production `build + nginx`
2. ajouter des `Dockerfile` multi-stage
3. documenter un profil optionnel pour ingestion/SWAT/WASP
4. prévoir une stratégie d'initialisation de base non destructive et explicitement validée
