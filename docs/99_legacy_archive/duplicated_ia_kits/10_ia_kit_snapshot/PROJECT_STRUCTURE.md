# Structure Projet - SAD Sebou 2026

```text
sad_sebou0210/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   └── schemas/
│   ├── alembic/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── package.json
├── docs/
│   └── kit_documentation_ia/
├── README.md
├── sad_backend.yml
└── requirements.txt
```

## Lecture fonctionnelle
- `backend/app/routers`: logique metier dashboard et SIG
- `backend/app/api/v1`: auth, raw, swat, services API
- `frontend/src/pages`: parcours utilisateurs
- `frontend/src/api`: couche d'integration

## Recommandation
Unifier progressivement l'architecture backend autour d'un seul style de routeurs et d'un seul contrat de donnees.
