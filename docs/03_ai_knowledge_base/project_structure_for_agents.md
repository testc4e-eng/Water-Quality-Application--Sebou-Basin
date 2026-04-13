# Structure Projet - SAD Sebou 2026

```text
repo_git/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   └── schemas/
│   ├── scripts/
│   ├── sql/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── package.json
├── docs/
│   ├── 01_project_reference/
│   ├── 02_contractual_and_reports/
│   ├── 03_ai_knowledge_base/
│   ├── 04_working_prompts_and_runs/
│   └── 99_legacy_archive/
├── README.md
└── requirements.txt
```

## Lecture fonctionnelle

- `backend/app/api` et `backend/app/routers`: exposition API, services métier et couches historiques
- `backend/sql`: industrialisation SQL, vues matérialisées et performance
- `frontend/src/pages`: parcours utilisateurs et écrans métier
- `frontend/src/components`: composants UI, graphiques, cartographie, tables
- `docs/01_project_reference`: documentation maître
- `docs/03_ai_knowledge_base`: mémoire synthétique pour agents

## Règle d’usage documentaire

- lire d’abord `docs/01_project_reference/SOURCE_OF_TRUTH.md`
- utiliser `docs/03_ai_knowledge_base/*` comme aide rapide, pas comme vérité concurrente
- ne consulter `docs/99_legacy_archive/*` qu’en cas de besoin explicite de traçabilité
