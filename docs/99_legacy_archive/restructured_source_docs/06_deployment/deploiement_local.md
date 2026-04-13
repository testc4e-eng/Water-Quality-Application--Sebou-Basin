# Guide de Déploiement Local & Configuration

Ce guide décrit les étapes pour récupérer le code source et configurer la connexion à la base de données PostgreSQL/TimescaleDB.

## 1. Clonage du Projet

Assurez-vous d'être dans le dossier `repo/` de votre structure de travail :

```bash
# Se placer dans le dossier repo
cd C:\dev\WQDSS\repo

# Cloner le dépôt
git clone https://github.com/testc4e-eng/Water-Quality-Application--Sebou-Basin.git .
```

> [!TIP]
> Si vous obtenez une erreur "Repository not found", vérifiez que vous avez bien les droits d'accès ou utilisez un jeton d'accès (PAT) GitHub.

## 2. Préparation de l'Environnement (Python)

```bash
# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement (Windows)
.\venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

## 3. Connexion à la Base de Données (Postgres/TimescaleDB)

Le projet utilise **PostgreSQL** avec les extensions **PostGIS** et **TimescaleDB**.

### Configuration du fichier `.env`
Créez un fichier `.env` à la racine du dossier `repo/` (basé sur `.env.example`) :

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=waterqual_sebou
DB_USER=votre_utilisateur
DB_PASS=votre_mot_de_passe
DB_SCHEMA=api
```

## 4. Lancement de l'Application

```bash
# Pour FastAPI (exemple probable)
uvicorn main:app --reload

# Alternative Docker (si disponible)
docker-compose up -d
```

---
*Assurez-vous de vérifier les logs en cas de problème : `docker-compose logs -f`*

