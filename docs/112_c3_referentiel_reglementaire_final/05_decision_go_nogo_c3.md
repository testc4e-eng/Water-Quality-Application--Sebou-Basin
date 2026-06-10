# Decision go no-go C3

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | decision de gouvernance |
| Source de verite | Oui |
| Date | 2026-06-04 |

## Preuves primaires utilisees

### Requetes SQL

```sql
SELECT count(*) FROM metadata.qualite_parametre_reglementaire;
SELECT count(*) FROM metadata.qualite_mapping_canonique_reglementaire;
SELECT count(*) FROM metadata.qualite_seuil_reglementaire;
SELECT count(*) FROM metadata.qualite_seuil_reglementaire WHERE actif = true;
SELECT count(*) FROM metadata.qualite_parametre_reglementaire WHERE actif = true AND classifiable IS true;
SELECT count(*) FROM metadata.qualite_parametre_reglementaire WHERE actif = true AND classifiable IS false;
SELECT count(*) FROM metadata.qualite_type_eau WHERE actif = true AND statut_operationnel = 'REGLEMENTAIRE_OPERATIONNEL';
```

### Fichiers backend/frontend inspectes

- `backend/app/services/regulatory_quality.py`
- `backend/app/routers/quality.py`
- `backend/app/api/v1/pollution.py`
- `backend/app/api/v1/map.py`
- `backend/app/services/map_business_service.py`
- `backend/app/services/kpi/engine.py`
- `backend/app/services/dashboard/home_service.py`
- `frontend/src/api/qualityRegulatory.ts`
- `frontend/src/App.tsx`

## Resultat factuel

| Indicateur | Resultat |
|---|---:|
| Parametres reglementaires | `41` |
| Mappings reglementaires | `41` |
| Mappings actifs | `36` |
| Seuils | `205` |
| Seuils actifs | `177` |
| Parametres classifiables actifs | `36` |
| Parametres non classifiables actifs | `5` |
| Types d'eau operationnels | `1` |

## Interpretation

- le referentiel est charge en base ;
- le moteur de classification est branche et utilise au runtime ;
- les endpoints frontend/backend dedies existent et sont consommes ;
- le perimetre operationnel est borne au Tableau n°1 pour `surface_generale` ;
- des ecarts restent avant de parler de couverture totale multi-types d'eau ou de purge legacy complete.

## Decision

```text
C3_STATUS = GO_PREPROD_CONDITIONNEL
```

## Justification

Le statut `GO_PREPROD_CONDITIONNEL` est retenu parce que :

- la BD prouve que le referentiel est charge ;
- le code prouve qu'il est reellement utilise par les routes, KPI et dashboards ;
- le perimetre actif est coherent et borne ;
- mais le runtime n'est pas encore un `GO_PREPROD` complet tous types d'eau / tous usages / sans dette legacy.

## Ecarts restants avant preproduction pleine

- un seul type d'eau operationnel ;
- perimetre classeur borne a `36` parametres classifiables ;
- coexistence avec des endpoints qualite legacy ;
- besoin de ne pas sur-promettre un perimetre reglementaire plus large que le noyau actif verifie.
