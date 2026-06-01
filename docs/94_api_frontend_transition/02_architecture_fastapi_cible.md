# Architecture FastAPI cible

## Objectif

Créer une couche API métier stable qui consomme exclusivement les vues SQL `api.*` pour la restitution, tout en conservant les routes legacy pendant la transition.

## Structure cible

```text
backend/
  app/
    api/
      api_v1.py
      v1/
        meteo_specialized.py
        hydro_specialized.py
        qualite_specialized.py
        pollution_specialized.py
        idp_specialized.py
    routers/
      legacy/
      observatory/
      admin/
    services/
      exposure/
      qa/
      geo/
    repositories/
      api_views_repository.py
      referentiel_repository.py
    schemas/
      exposure.py
      filters.py
      pagination.py
    db/
      session.py
    core/
      config.py
      logger.py
    utils/
      sql_filters.py
```

## Rôle des couches

| Couche | Role | Regle |
|---|---|---|
| `api/v1/*_specialized.py` | Routes HTTP stables | Pas de SQL complexe inline |
| `services/exposure` | Orchestration metier, validation filtres | Connait les familles metier |
| `repositories/api_views_repository.py` | SELECT parametrés sur vues `api.*` | Seule couche autorisee a interroger les vues |
| `schemas/exposure.py` | Contrats Pydantic | Format commun API |
| `utils/sql_filters.py` | Construction sûre des filtres | Whitelist colonnes, pas de table dynamique libre |

## Règles SQL

- Les nouvelles APIs lisent uniquement les vues `api.*`.
- Aucune nouvelle route frontend ne doit interroger `qualite.*`, `meteo.*`, `hydro.*`, `staging.*` ou `public.*`.
- Les noms de vues sont whitelistes côté repository.
- Les filtres sont paramétrés avec SQLAlchemy `text()` + bind params, jamais concaténés depuis l'utilisateur.
- `FM` et `F_M_MES` sont exclus par les vues et ne doivent pas être re-filtrés côté frontend comme seule barrière.

## Pagination et filtres

Filtres standards :

- `date_start`, `date_end`
- `support_type`, `support_id`
- `code_parametre`
- `station_id` ou `barrage_id` si disponible via `support_id`
- `qa_status`
- `geo_status`
- `limit`, `offset`
- `sort`, limité aux colonnes autorisées

Pagination par défaut :

- `limit = 500`
- `max_limit = 5000`
- `offset = 0`

## Cache futur

- Cache court applicatif pour listes de paramètres et supports : 5 à 15 minutes.
- Pas de cache long sur séries temporelles filtrées avant validation volumétrique.
- Matérialisation future possible pour vues lourdes qualité multi-supports et précipitation.

## Sécurité

- Routes de restitution en lecture seule.
- Routes admin ingestion/quarantaine protégées par rôles.
- `raw` reste réservé admin et ne doit pas être utilisé par les dashboards métier.

## Logs et monitoring

Chaque nouvelle route doit journaliser :

- endpoint
- vue source
- filtres
- durée SQL
- count retourné
- statut erreur

## Règles métier obligatoires

- Préserver `MO` = matières organiques et `Mo` = molybdène.
- Ne jamais exposer `FM` et `F_M_MES`.
- `COULEUR` : consultation only, hors scores et moyennes.
- `LARGEUR` et `PROFONDEUR` : contexte station, hors analytics qualité.
- `T_AIR` : qualité terrain pour les données actuelles ; météo uniquement via pipeline météo futur.
- `DISQUE_SECCHI` : double classification selon support.

## Stratégie de coexistence

- Conserver `/quality`, `/hydro`, `/climate`, `/observatory` existants.
- Ajouter des endpoints spécialisés stables.
- Migrer le frontend par écran.
- Déprécier ensuite les routes legacy avec métriques d'usage.
