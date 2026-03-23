# Environnements - SAD Sebou 2026

## Local dev
- Backend: Python 3.11+, env `sad_backend`
- Frontend: Node + Vite
- DB: PostgreSQL accessible via `.env`

## Variables cles backend
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `DATABASE_URL` si usage DSN direct
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `BACKEND_CORS_ORIGINS`

## Lancement recommande
```bash
micromamba create -f sad_backend.yml
micromamba activate sad_backend
cd backend
uvicorn app.main:app --reload --port 8000
```

```bash
cd frontend
npm install
npm run dev -- --port 3001
```

## URLs locales
- API: `http://127.0.0.1:8000`
- OpenAPI: `http://127.0.0.1:8000/docs`
- Frontend: `http://127.0.0.1:3001`

## Manques actuels
- `.env.example` complet
- separation dev/staging/prod
- strategie de secrets
- procedure de seed et migration metier
