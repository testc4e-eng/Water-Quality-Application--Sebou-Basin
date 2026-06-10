# MVP2-A Generation intelligente de canevas metier

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport d'implementation |
| Source de vérité | Oui pour MVP2-A |
| Date | 2026-06-05 |

## Objectif

Activer la generation de canevas metier par classe de donnees, sans upload, sans staging et sans ecriture dans les tables metier.

## Perimetre implemente

### Backend

- `GET /api/v1/data-admin/classes/{class_code}/template/spec`
- `POST /api/v1/data-admin/classes/{class_code}/template/generate`

Nouveaux fichiers :

- `backend/app/api/v1/data_admin/templates.py`
- `backend/app/services/data_admin/template_generation_service.py`
- `backend/app/schemas/data_admin/templates.py`
- `backend/sql/2026_06_data_admin_template_fields.sql`

### Frontend

- nouvel onglet `Canevas` dans `/admin/data-governance/audit`
- nouveau client : `frontend/src/api/dataAdminTemplates.ts`
- nouveau composant : `frontend/src/components/data-governance/TemplateGeneratorPanel.tsx`

## Règles respectées

- aucune ecriture dans `geo`, `infra`, `hydro`, `meteo`, `qualite`, `metadata`
- aucune promotion
- aucun staging
- aucun workflow `change_request`
- consommation frontend exclusivement via l'API `data-admin`

## Contrat fonctionnel

Le spec endpoint retourne :

- metadonnees de classe
- source des champs
- statut `FIELD_REGISTRY_INCOMPLETE` si le registre de champs n'est pas encore alimente
- liste des champs enrichis
- feuilles attendues :
  - `DONNEES`
  - `INSTRUCTIONS`
  - `DICTIONNAIRE_CHAMPS`
  - `METADATA`

Le generate endpoint produit :

- `.xlsx` par defaut
- `.csv` en fallback simple

## Source des champs

Priorite :

1. `data_admin.field_registry`
2. introspection de la vue d'exposition ou de la table cible
3. fallback controle par surcharge metier par classe

Constat runtime :

- `data_admin.field_registry` existe mais contient `0` lignes
- les colonnes enrichies `example_value`, `unit_expected`, `allowed_values_source`, `description` ne sont pas encore materialisees
- un script idempotent est prepare :
  - `backend/sql/2026_06_data_admin_template_fields.sql`

Ce script n'a pas ete execute dans MVP2-A.

## Classes prioritaires traitees

- `INFRA_STATION`
- `HYDRO_DEBIT`
- `METEO_PRECIPITATION`
- `QUALITE_RIVIERE`
- `POLLUTION_SITE`

Les autres classes restent accessibles via le meme mecanisme.

## Validation technique

### Backend

- `python -m compileall backend/app` : succes
- tests `FastAPI TestClient` :
  - `GET /api/v1/data-admin/classes/HYDRO_DEBIT/template/spec` : `200`
  - `POST /api/v1/data-admin/classes/HYDRO_DEBIT/template/generate` : `200`
  - `GET /api/v1/data-admin/classes/QUALITE_RIVIERE/template/spec` : `200`
  - `POST /api/v1/data-admin/classes/QUALITE_RIVIERE/template/generate` : `200`

Controle du `.xlsx` genere :

- presence de `xl/workbook.xml`
- presence de `xl/worksheets/sheet1.xml`
- presence de `xl/worksheets/sheet2.xml`
- presence de `xl/worksheets/sheet3.xml`
- presence de `xl/worksheets/sheet4.xml`

### Frontend

- `npm run build` : succes
- l'onglet `Canevas` est ajoute au portail `/admin/data-governance/audit`

## Exemples generes

- `hydro_debit_template_20260605_084241.xlsx`
- `qualite_riviere_template_20260605_084245.xlsx`
- `hydro_debit_template_20260605_084249.csv`

## Limites connues

- `FIELD_REGISTRY_INCOMPLETE` reste vrai tant que `data_admin.field_registry` n'est pas seede finement
- les listes de valeurs autorisees sont actuellement documentaires / heuristiques et non encore pilotees par un registre riche
- le `.xlsx` est genere par writer OOXML minimal sans styles avances ni validations Excel natives
- les commentaires Excel cellule par cellule ne sont pas encore ajoutes

## Verdict

```text
114_MVP2_A_STATUS = TEMPLATE_GENERATION_ACTIVE
DATA_ADMIN_TEMPLATE_SPEC = ACTIVE
DATA_ADMIN_TEMPLATE_DOWNLOAD = ACTIVE
FIELD_REGISTRY_INCOMPLETE = TRUE
```

## Etape suivante

```text
114_MVP2_B_FIELD_REGISTRY_ENRICHMENT
```

puis :

```text
114_MVP2_C_UPLOAD_VALIDATION_STAGING
```
