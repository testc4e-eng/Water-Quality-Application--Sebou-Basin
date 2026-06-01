# Rapport integration React/MapLibre - Phase 6

Date execution : 2026-05-18

## Fichiers frontend ajoutes

| Fichier | Role |
|---|---|
| `frontend/src/api/pollutionIdp.ts` | client API type pour `/api/v1/pollution/sites.geojson` |
| `frontend/src/hooks/usePollutionIdp.ts` | hook React Query |
| `frontend/src/components/pollution/PollutionIdpMap.tsx` | carte MapLibre isolee |
| `frontend/src/pages/PollutionIdpDevPage.tsx` | page DEV autonome |

## Route ajoutee

```text
/pollution-idp-dev
```

## Fonctionnalites livrees

- chargement GeoJSON depuis `/api/v1/pollution/sites.geojson`;
- filtre parametre : `DBO5`, `DCO`, `NH4`, `NO3`, `MES`;
- filtre typologie source;
- filtre commune;
- popup : nom site, commune, typologie, statut validation, derniers resultats P0;
- etats loading et erreur;
- limite configurable.

## Backend ajuste

`GET /api/v1/pollution/*` accepte le filtre metier `NO3` et le traduit vers le code canonique DB existant `NO3-`.

## Isolation

Les dashboards existants ne sont pas remplaces. La route est isolee et destinee a la demonstration DEV.
