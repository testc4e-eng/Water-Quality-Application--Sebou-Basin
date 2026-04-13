# Deployment - SAD Sebou 2026

## Etat actuel
Le projet est demarrable localement, mais la chaine de deploiement n'est pas encore industrialisee.

## Cible minimale
1. Backend FastAPI publie derriere reverse proxy.
2. Frontend Vite build puis servi statiquement.
3. PostgreSQL heberge sur serveur maitrise.
4. Variables d'environnement gerees hors repo.

## Pipeline recommande
- lint backend/frontend
- tests API critiques
- build frontend
- smoke test `/health`
- deploiement staging
- validation ABHS
- deploiement production

## Pre-requis mission 4
- procedure d'installation
- procedure de sauvegarde BD
- plan de formation utilisateur
- plan de maintenance corrective et evolutive
