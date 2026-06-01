# Référentiel qualité réglementaire

## Statut
`GO_PREPROD_READY_CONDITIONNEL`

## État réel DB
Version active : `REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19`

| Élément | Valeur |
|---|---|
| sources | 1 |
| types_eau | 4 |
| classes | 5 |
| paramètres | 41 |
| paramètres classifiables | 36 |
| seuils chargés | 205 |
| seuils actifs | 177 |
| règles | 5 |


## Tests endpoint via TestClient
| Endpoint | HTTP | Statut métier | Détail |
|---|---|---|---|
| GET /health | 200 | OK |  |
| GET /api/v1/quality/regulatory-status | 200 | OK |  |
| GET /api/v1/quality/thresholds | 200 | OK | 177 |
| POST classify DBO5 | 200 | CLASSIFIED | DBO5 |
| POST classify NO3 | 200 | CLASSIFIED | NO3- |
| POST classify MO | 200 | PARAMETRE_NON_REGLEMENTAIRE |  |
| POST classify Mo | 200 | PARAMETRE_NON_REGLEMENTAIRE |  |


## Décisions gouvernance actives
- Tableau n°1 eaux de surface uniquement.
- `type_eau=surface_generale` contrat officiel.
- 36 paramètres classifiables / 177 seuils actifs.
- 28 seuils inactifs exclus du moteur.
- 5 paramètres observationnels non classifiables.
- `MO != Mo` strict.
- Alias autorisés uniquement : `NO3 -> NO3-`, `O2_DISSOUS -> O2_DISS`.

## Écarts à corriger avant GO final
- `water_type` deprecated : aucune implémentation trouvée de warning `WARNING_API_DEPRECATED_FIELD` ou `type_eau_resolved` dans `backend/app`.
- `TYPE_EAU_NON_OPERATIONNEL` : aucun marqueur trouvé dans le code; à implémenter si un type documentaire est demandé.
- Les docs `docs/07_donnees_et_referentiels/00_data_landscape.md` indiquent encore `DEV_PARTIAL`, à remplacer par `GO_PREPROD_READY_CONDITIONNEL`.
