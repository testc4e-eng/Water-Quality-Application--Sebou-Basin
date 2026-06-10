# MVP1-B Frontend Audit du module `data_admin`

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport d'implementation |
| Source de vérité | Oui pour MVP1-B frontend |
| Date | 2026-06-05 |

## Objectif

Activer le premier portail metier de gouvernance des donnees du SAD en lecture seule, branche exclusivement sur les endpoints `/api/v1/data-admin/*`.

## Perimetre implemente

- route frontend : `/admin/data-governance/audit`
- client API dedie : `frontend/src/api/dataAdmin.ts`
- hook React Query : `frontend/src/hooks/useDataAdmin.ts`
- types metier : `frontend/src/types/dataAdmin.ts`
- composants reutilisables :
  - `DataClassCard`
  - `DataClassTable`
  - `DataHealthBadge`
  - `DataSchemaViewer`
  - `DataRecordGrid`

## Contrat runtime consomme

Le frontend n'utilise que :

- `GET /api/v1/data-admin/classes`
- `GET /api/v1/data-admin/classes/{class_code}`
- `GET /api/v1/data-admin/classes/{class_code}/schema`
- `GET /api/v1/data-admin/classes/{class_code}/count`
- `GET /api/v1/data-admin/classes/{class_code}/records`

Aucune connexion directe a PostgreSQL n'est ajoutee cote frontend.

## Fonctionnalites actives

### 1. Catalogue des classes

- affichage des `8` classes enregistrees ;
- colonnes : domaine, classe, description, schema cible, table cible, vue d'exposition, statut, nombre d'enregistrements, sante ;
- recherche locale sur le catalogue ;
- selection d'une classe pour audit detaille.

### 2. Tableau de bord de gouvernance

- KPI globaux :
  - classes enregistrees ;
  - classes actives ;
  - total d'enregistrements exposes ;
  - classes vides ;
  - classes en erreur ;
- cartes de synthese par domaines :
  - `INFRA`
  - `HYDRO`
  - `METEO`
  - `QUALITE`
  - `POLLUTION`

### 3. Audit detaille

- metadonnees de la classe ;
- schema des champs ;
- compteur reel de la source ;
- 20 premiers enregistrements via pagination backend ;
- recherche et tri locaux sur la page courante.

### 4. Sante des donnees

Statuts calcules cote frontend :

- `ACTIVE` : classe exposee et alimentee ;
- `EMPTY` : classe enregistree sans lignes ;
- `WARNING` : classe sans vue d'exposition dediee ;
- `MISSING` : execution DB indisponible.

Severites restituees :

- `HEALTHY`
- `WARNING`
- `CRITICAL`

## Navigation et securite

- `/administration` redirige maintenant vers `/admin/data-governance/audit` ;
- la route `/admin/data-governance/audit` exige une session authentifiee ;
- le shell navigation (`Sidebar`, `Header`) expose l'entree `Gouvernance donnees`.

## Preuves techniques

### API active

- `GET /api/v1/data-admin/classes` retourne `status=OK` et `count=8`
- compteurs verifies sur runtime actif :
  - `INFRA_STATION = 390`
  - `HYDRO_DEBIT = 652446`
  - `POLLUTION_SITE = 2026`

### Validation frontend

- `npm run build` : succes
- smoke test navigateur local :
  - route non authentifiee redirige vers `/login`
  - shell UI compile et se charge sans erreur de build

## Limites connues

- la date de derniere mise a jour n'est pas exposee par l'API `data-admin` et reste donc `non exposee` dans MVP1-B ;
- la recherche et le tri des enregistrements portent sur la page courante retournee par `/records`, pas sur l'integralite de la source ;
- les modules `canevas`, `upload`, `validation`, `staging`, `promotion` et `change_request` restent inactifs a ce stade.

## Verdict

```text
114_MVP1_B_STATUS = FRONTEND_AUDIT_ACTIVE
DATA_ADMIN_UI = ACTIVE
DATA_ADMIN_API = ACTIVE
NO_FRONTEND_REGRESSION = CONFIRMED
```

## Etape suivante

```text
114_MVP2_INGESTION_INTELLIGENTE
```

avec :

- generation automatique des canevas metier ;
- upload Excel/CSV/Shapefile ;
- validation metier ;
- staging ;
- rapport d'erreurs ;
- promotion controlee.
