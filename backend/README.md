# FastAPI + PostgreSQL (sans Docker)

## Installation
1. Créer un environnement virtuel et installer les dépendances :
```bash

# SUPPRIMER le venv existant s’il a été partiellement créé :
Remove-Item -Recurse -Force .\venv -ErrorAction SilentlyContinue

python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

2. Copier `.env.example` en `.env` et configurer si besoin.

3. Créer la base PostgreSQL :
```sql
CREATE DATABASE appdb;
```

4. Lancer les migrations :
```bash
alembic upgrade head
```

5. Démarrer le serveur :
```bash
uvicorn app.main:app --reload
```

## API Docs
http://localhost:8000/docs


 

# Commande pour creer l environement :
micromamba create -f sad_backend.yml

# Commande pour activer l environement :
micromamba activate "C:\micromba_envs\sad_backend"
micromamba activate sad_backend

# Commande pour excuter le backend :
micromamba activate "C:\micromba_envs\sad_backend"
micromamba activate sad_backend
cd backend
uvicorn app.main:app --reload --port 8000

# Commande pour activer l environement :
micromamba activate "C:\micromba_envs\sad_backend"
micromamba activate sad_backend
cd frontend
npm run dev -- --port 3001







le dernier commende pour lancer le backend :

# micromamba activate sad_backend
# cd backend
# uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
