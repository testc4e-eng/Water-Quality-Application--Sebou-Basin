# Home V2 performance audit

## Endpoint audité

- `GET /api/v1/dashboard/home`

## Profil par section

| Section | Temps | Impact |
| --- | ---: | --- |
| `data_freshness` | `~5.1 s` | élevé |
| `hero` | `~3.9 s` | moyen |
| `map` | `~0 s` | négligeable |
| `basin_status` | `~8.3 s` | élevé |
| `alerts` | `~16.7 s` | critique |
| `recommended_actions` | `~0 s` direct | dépend d’`alerts`/`kpi` |
| `trends` | `~4.5 s` | moyen |
| `secondary_kpis` | `~0 s` direct | dépend du moteur KPI déjà calculé |
| `metadata` | `~0 s` | négligeable |

## Mesures globales

### Service direct dans le process applicatif

- premier calcul : `~38.8 s`
- second appel avec cache mémoire : `~0.001 s`

### HTTP dans le container backend

- premier appel : `~35.5 s`
- second appel : `~0.013 s`

### HTTP après ajout du prewarm startup

- premier appel observé après reload applicatif : `~23.2 s`
- second appel : `~0.113 s`

## Causes principales

### 1. `alerts`

Cause :

- `list_alerts()` déclenche indirectement le moteur KPI complet ;
- `get_pollution_kpis()` exécute plusieurs propagations MVP par site ;
- c’est aujourd’hui le point de coût dominant.

### 2. `basin_status`

Cause :

- plusieurs agrégations SQL lourdes sur hydro, pluie, barrages et qualité ;
- pas de vue matérialisée ni d’agrégats prêts à l’emploi.

### 3. `data_freshness` + `hero` + `trends`

Cause :

- agrégations SQL simples mais encore coûteuses sur le runtime réel.

## Optimisations appliquées

- cache mémoire backend du payload complet déjà en place ;
- prewarm automatique du cache Home au démarrage applicatif ;
- conservation stricte du contrat JSON ;
- aucune modification des moteurs métier ni des routes.

## Recommandations

### Gain rapide

- conserver et fiabiliser le prewarm startup ;
- monitorer le hit ratio du cache Home ;
- éviter les premiers chargements DG sur container froid.

### Gain moyen

- mettre en cache séparément le résultat `alerts` / `pollution_kpis` au runtime applicatif ;
- réduire le coût cold-start de `get_pollution_kpis()` ;
- créer un résumé pollution opérationnel home-ready déjà agrégé.

### Refonte nécessaire

- si la cible stricte reste `< 2 s` à froid :
  - revoir la chaîne `alerts -> kpi -> pollution -> propagation MVP` ;
  - introduire des agrégats BD ou vues spécialisées pour le Home ;
  - dissocier le calcul lourd de l’exposition Home temps quasi réel.

## Conclusion

- objectif `< 2 s` atteint en cache chaud ;
- objectif `< 2 s` non atteint à froid ;
- statut réaliste actuel : `FAST_AFTER_WARMUP`
