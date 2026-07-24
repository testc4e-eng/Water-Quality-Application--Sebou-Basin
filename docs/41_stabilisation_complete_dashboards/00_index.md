# 41  Stabilisation complète dashboards

## Objectif

Stabiliser la plateforme WQDSS dashboard par dashboard avant démonstration client.

La règle de travail est :

```text
un dashboard -> audit -> test options -> correction minimale -> retest -> capture -> validation
```

## Ordre de traitement

| Ordre | Dashboard | Route | Statut |
|---:|---|---|---|
| 1 | Accueil DG | `/` | `HOME_READY_AVEC_RESERVES` |
| 2 | Qualité des eaux | `/dashboard-qualite-reglementaire` | À traiter |
| 3 | Carte Métier | `/dashboard-carto-metier` | À traiter |
| 4 | Pollution - Surveillance | `/dashboard-pollution` | À traiter |
| 5 | Pollution - Déclaration d'incident | `/dashboard-pollution?view=declaration` | Déjà validé Matrix V1, à intégrer dans recette globale |
| 6 | Pollution - Campagnes | `/dashboard-pollution-campagnes` | À traiter |
| 7 | Données / QA | `/dashboard-data-qa` | À traiter |
| 8 | Administration | `/administration` | À traiter |

## Runtime constaté

| Élément | Valeur |
|---|---|
| Backend | `http://127.0.0.1:8010` |
| Frontend | `http://127.0.0.1:5174` |
| DB runtime | PostgreSQL local `host.docker.internal:5432/abh_sad` |
| Conteneurs | `sad-backend`, `sad-frontend`, `sad-db` actifs |

## Jalon courant

`STAB-01 - Accueil DG` est validé avec réserves :

- le Home s'affiche au premier accès ;
- l'erreur secondaire sur les stations qualité Home est corrigée sans modification DB ;
- le cold start backend reste lent mais ne tombe plus en erreur visible ;
- captures disponibles sous `frontend/test-results/platform-stabilization/01-home/`.

