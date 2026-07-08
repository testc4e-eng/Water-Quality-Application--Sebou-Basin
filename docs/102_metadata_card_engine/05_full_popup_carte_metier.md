# Harmonisation du popup `/dashboard-carto-metier`

## Objectif

Remplacer le popup natif inline de `MapV1` (carte analytique V1) par le moteur de fiche métier `MetadataCard` en mode `variant="full"`, tout en conservant les actions Workspace existantes.

## Fichiers modifiés

- `frontend/src/components/DashboardMetier/V1/MapV1.tsx`
- `frontend/src/components/DashboardMetier/MetadataCard.tsx`
- `frontend/src/components/DashboardMetier/BusinessPopup.tsx`
- `frontend/src/components/DashboardMetier/metadataCardUtils.ts`

## Détails techniques

### Adaptateur V1

`MapV1` manipule des propriétés au format V1 (`object_id`, `object_name`, `object_code`, `support_type`, `latest_values` sous forme d'objet `{ [code]: value }`).
Le moteur `MetadataCard` attend `MapBusinessEntityProperties` avec `latest_values` au format `MapLatestValue[]`.

Un adaptateur local `toMapBusinessEntityProperties` convertit :

- `object_id` → `entity_id`
- `object_name` → `label`
- `object_code` → `station_code` / `code_station`
- `support_type` → `support_type` + `entity_type`
- `bassin_nom` → `bassin`
- `latest_values` objet → `MapLatestValue[]`
- `attributes.data_temporality/data_family/measurement_context` propagés

### Actions personnalisées

`MetadataCard` et `BusinessPopup` acceptent désormais une prop `actions?: React.ReactNode`.
Dans `MapV1`, cette zone est utilisée pour afficher le bouton Workspace selon le contexte :

- Mode thématique : **Ajouter au Workspace** avec le paramètre actif.
- Mode domaine/filtre : **Analyser en graphique** / **Voir les valeurs** selon la temporalité.

### Section Qualité des données / Calendrier

Pour rester pertinent avec les données V1 parfois partielles, les sections *Qualité des données* et *Calendrier* ne s'affichent que si des champs correspondants sont présents.

## Validation

- `npm run build` OK.
- `python -m compileall -q backend/app` OK.
- Tests visuels sur `/dashboard-carto-metier` (preview Vite + mock backend 8011).
