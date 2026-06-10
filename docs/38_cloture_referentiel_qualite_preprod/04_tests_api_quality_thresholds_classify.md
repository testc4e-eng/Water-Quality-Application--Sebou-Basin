# Tests API quality thresholds/classify

Méthode : tests FastAPI `TestClient`, sans écriture base et sans migration. Backend non modifié.

## Résultats
| Test | HTTP | Statut métier | Commentaire |
|---|---|---|---|
| GET /health | 200 | OK |  |
| GET /api/v1/quality/regulatory-status | 200 | OK | thresholds_active=177 |
| GET /api/v1/quality/thresholds | 200 | OK | count=177 |
| POST classify DBO5 | 200 | CLASSIFIED | DBO5 -> DBO5; classe bonne |
| POST classify NO3 | 200 | CLASSIFIED | NO3 -> NO3-; classe bonne |
| POST classify Mo | 200 | PARAMETRE_NON_REGLEMENTAIRE | Paramètre absent du référentiel réglementaire actif. |
| POST classify MO | 200 | PARAMETRE_NON_REGLEMENTAIRE | Paramètre absent du référentiel réglementaire actif. |
| POST classify DBO5 | 200 | CLASSIFIED | DBO5 -> DBO5; classe bonne |
| POST classify NO3 | 200 | CLASSIFIED | NO3 -> NO3-; classe bonne |
| POST classify Mo | 200 | PARAMETRE_NON_REGLEMENTAIRE | Paramètre absent du référentiel réglementaire actif. |
| POST classify MO | 200 | PARAMETRE_NON_REGLEMENTAIRE | Paramètre absent du référentiel réglementaire actif. |


## Points vérifiés
- `/api/v1/quality/regulatory-status` retourne `OK` avec version active `REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19`.
- `/api/v1/quality/thresholds` retourne 177 seuils actifs pour `surface_generale`.
- `DBO5` à 4.2 mg/L est classé `bonne`.
- `NO3` à 20 mg/L est résolu vers le canonique `NO3-` et classé `bonne`.
- `Mo` et `MO` retournent `PARAMETRE_NON_REGLEMENTAIRE`, ce qui confirme l'absence de fusion abusive entre molybdène et matières organiques.

## Remarque contrat API
Le modèle backend utilise `type_eau` avec valeur par défaut `surface_generale`. Les payloads historiques utilisent parfois `water_type`. Le test n'a pas échoué car le backend ignore le champ extra et applique le défaut, mais le contrat à documenter pour préproduction doit utiliser `type_eau`.


## Disponibilité HTTP DEV
Le serveur HTTP `127.0.0.1:8000` n'était pas démarré au moment du contrôle final (`connection refused`) — le port officiel est désormais `8000` (`8011` est obsolète). Les tests ci-dessus ont été réalisés via FastAPI `TestClient`, donc ils valident les routes et la logique backend en lecture seule, mais pas le binding réseau local.
