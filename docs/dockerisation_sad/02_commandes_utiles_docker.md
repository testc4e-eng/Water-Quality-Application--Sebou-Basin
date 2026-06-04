# Commandes utiles Docker - SAD Sebou

## Démarrer

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

## Démarrer en arrière-plan

### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose up --build -d
```

### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose up --build -d
```

## Arrêter sans supprimer les volumes

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

## Reconstruire une image

### Backend

#### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose build sad-backend
docker compose up -d sad-backend
```

#### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose build sad-backend
docker compose up -d sad-backend
```

### Frontend

#### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose build sad-frontend
docker compose up -d sad-frontend
```

#### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose build sad-frontend
docker compose up -d sad-frontend
```

## Voir l'état des services

### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose ps
```

### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose ps
```

## Voir les logs

### Tous les services

#### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose logs -f
```

#### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose logs -f
```

### Un seul service

#### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose logs -f sad-backend
```

#### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose logs -f sad-backend
```

## Entrer dans un conteneur

### Backend

#### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose exec sad-backend sh
```

#### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose exec sad-backend sh
```

### Frontend

#### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose exec sad-frontend sh
```

#### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose exec sad-frontend sh
```

### Base PostgreSQL

#### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose exec sad-db bash
```

#### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose exec sad-db bash
```

## Tester PostgreSQL

### Vérifier la connexion

#### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose exec sad-db pg_isready -U sad_user -d abh_sad
```

#### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose exec sad-db pg_isready -U sad_user -d abh_sad
```

### Ouvrir `psql`

#### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose exec sad-db psql -U sad_user -d abh_sad
```

#### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose exec sad-db psql -U sad_user -d abh_sad
```

### Vérifier PostGIS

#### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose exec sad-db psql -U sad_user -d abh_sad -c "SELECT postgis_version();"
```

#### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose exec sad-db psql -U sad_user -d abh_sad -c "SELECT postgis_version();"
```

## Vérifier l'API

### Windows PowerShell

```powershell
curl http://localhost:8000/health
curl http://localhost:8000/docs
```

### WSL

```bash
curl http://localhost:8000/health
curl http://localhost:8000/docs
```

## Supprimer les volumes

Action volontairement sensible.

Ne l'exécuter qu'après validation explicite, car cela supprime les données PostgreSQL du volume Docker local.

### Windows PowerShell

```powershell
cd C:\dev\WQDSS\repo_git
docker compose down -v
```

### WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
docker compose down -v
```
