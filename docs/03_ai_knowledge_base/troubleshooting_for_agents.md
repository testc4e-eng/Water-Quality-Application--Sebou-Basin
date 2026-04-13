# Troubleshooting - SAD Sebou 2026

## 1. API ne demarre pas
- Verifier `.env`
- Verifier acces PostgreSQL
- Tester `GET /health`

## 2. Frontend n'affiche rien
- Verifier `VITE_API_BASE_URL`
- Verifier CORS dans `backend/app/main.py`
- Verifier l'URL `http://127.0.0.1:8000/api/v1`

## 3. Carte vide
- Verifier que la couche demandee existe dans `LAYER_MAP`
- Verifier la presence de `geom`
- Verifier transformation vers EPSG:4326

## 4. Dashboard climat/hydro vide
- Verifier les vues `api.v_measurements_*`
- Verifier `ts_id`, `station_id`, `time_step`

## 5. Dashboard qualite vide
- Verifier les vues `api.v_quality_*`
- Verifier `station_code`

## 6. CRUD raw dangereux ou instable
- Verifier la cle primaire detectee
- Restreindre les schemas autorises
- Journaliser create/update/delete

## 7. Auth non fonctionnelle
- Verifier `SECRET_KEY`
- Verifier la table users
- Verifier hash et payload login JSON
