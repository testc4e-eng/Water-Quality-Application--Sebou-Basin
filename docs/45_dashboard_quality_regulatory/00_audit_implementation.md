# Audit implementation dashboard qualité réglementaire P0

## Contexte vérifié

- Routeur frontend actif : `frontend/src/App.tsx`.
- Navigation principale : `frontend/src/components/Layout/Sidebar.tsx`.
- Client HTTP partagé : `frontend/src/api/client.ts`, base `/api/v1`.
- Backend qualité : `backend/app/routers/quality.py`, monté sous `/api/v1/quality`.
- Référentiel actif : `REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19`.

## APIs réutilisées

| Endpoint | Usage P0 |
|---|---|
| `GET /api/v1/quality/regulatory-status` | version, volumes, règles et absents canoniques |
| `GET /api/v1/quality/thresholds?type_eau=surface_generale&active_only=true` | seuils actifs uniquement |
| `GET /api/v1/quality/stations` | stations et volumes de mesures |
| `GET /api/v1/quality/timeseries` | historique après sélection station |
| `POST /api/v1/quality/classify` | classification de la dernière valeur affichée |

## Écarts corrigés

- `/quality/stations` et `/quality/timeseries` contenaient des interpolations SQL incomplètes.
- Les dates des séries utilisaient une syntaxe de cast ambiguë pour SQLAlchemy.
- Les statuts métier attendus n’étaient pas tous exposés explicitement.
- `water_type` est maintenant toléré uniquement comme legacy tracé ; `type_eau` reste le contrat officiel.

## Contraintes conservées

- Aucune écriture base.
- Aucune modification de mesure ou référentiel.
- `MO != Mo`.
- `NO3 -> NO3-` et `O2_DISSOUS -> O2_DISS` restent des alias explicites.
- Les grilles simplifiées restent `DOCUMENTAIRE_NON_OPERATIONNEL`.
