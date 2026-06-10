# Decision de cloture officielle IDP

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | decision de gouvernance |
| Source de verite | Oui |
| Date | 2026-06-04 |

## Contexte

Le chantier IDP a fait l'objet de plusieurs cycles d'audit, de revue cartographique, de consolidation QA et de verification sur la base `abh_sad`.

La decision presente ne repose pas sur la seule documentation historique. Elle s'appuie prioritairement sur :

- la base PostgreSQL/PostGIS `abh_sad` ;
- les tables QA `qa.spatial_identity_*` ;
- les tables metier `geo.ref_site_pollution*` ;
- les vues et APIs runtime `api.v_pollution_*` ;
- les services backend et ecrans frontend consommateurs.

## Historique C1

Le lot `C1-B` correspond au perimetre final d'arbitrage spatial IDP necessaire pour materialiser un pivot spatial maitre exploitable sans fusion destructive.

Le chantier a abouti a :

- des decisions cartographiques chargees en base ;
- la creation de nouveaux sites maitres `IDP-C1B-*` ;
- la creation de liens actifs source -> site ;
- l'absence de regression sur les APIs pollution, les dashboards pollution, les KPI metier et la propagation.

## Preuves BD verifiees

### Requetes SQL utilisees

```sql
SELECT count(*) FROM qa.spatial_identity_decisions_cartographic;

SELECT decision_code, count(*)
FROM qa.spatial_identity_decisions_cartographic
GROUP BY decision_code
ORDER BY decision_code;

SELECT count(*)
FROM geo.ref_site_pollution
WHERE site_code LIKE 'IDP-C1B-%';

SELECT count(*) FROM geo.ref_site_pollution_source_link;

SELECT count(*)
FROM geo.ref_site_pollution_source_link
WHERE active = true
  AND decision_status = 'VALIDATED';
```

### Resultats

| Preuve | Resultat |
|---|---:|
| Decisions cartographiques | `105` |
| `CREATE_NEW_MASTER_SITE` | `102` |
| `ACCEPT_MATCH` | `3` |
| Sites maitres `IDP-C1B-*` | `75` |
| Liens source -> site | `105` |
| Liens actifs/valides | `105` |

## Preuves code et runtime verifiees

### Fichiers inspectes

- [pollution.py](C:/dev/WQDSS/repo_git/backend/app/api/v1/pollution.py)
- [map.py](C:/dev/WQDSS/repo_git/backend/app/api/v1/map.py)
- [map_business_service.py](C:/dev/WQDSS/repo_git/backend/app/services/map_business_service.py)
- [engine.py](C:/dev/WQDSS/repo_git/backend/app/services/kpi/engine.py)
- [propagation_pollution_service.py](C:/dev/WQDSS/repo_git/backend/app/services/propagation/propagation_pollution_service.py)
- [DashboardPollution.tsx](C:/dev/WQDSS/repo_git/frontend/src/pages/DashboardPollution.tsx)
- [PollutionIdpDevPage.tsx](C:/dev/WQDSS/repo_git/frontend/src/pages/PollutionIdpDevPage.tsx)

### Constats

- les endpoints `/api/v1/pollution/*` lisent `api.v_pollution_sites` et `api.v_pollution_latest_results` ;
- le dashboard pollution et la couche IDP DEV consomment ces vues runtime ;
- le moteur de propagation resolve la source a partir de `api.v_pollution_sites` ;
- les tables QA brutes residuelles ne sont pas consommees directement par le runtime frontend/backend operationnel.

## Absence d'impact preproduction

Les verifications finales ont confirme :

- aucune regression API pollution ;
- aucune regression dashboard pollution ;
- aucun impact propagation ;
- aucun impact KPI metier ;
- aucun blocage preproduction imputable au lot `C1-B`.

## Decision officielle

```text
C1-B = COMPLETED_DEV_DB_CONFIRMED
```

et

```text
IDP_FINAL_STATUS = CLOSED_WITH_GOVERNED_BACKLOG
```

Le residuel global IDP est reclassifie en backlog gouverne et ne remet pas en cause la cloture du lot `C1-B`.

## Conclusion

```text
Le chantier IDP sort officiellement du chemin critique du projet.
```
