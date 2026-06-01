# Décisions gouvernance consolidées

## Qualité réglementaire
- Statut : `GO_PREPROD_READY_CONDITIONNEL`.
- Périmètre : Tableau n°1 eaux de surface uniquement.
- `type_eau=surface_generale` seul opérationnel.
- 36 paramètres / 177 seuils actifs.
- 28 seuils inactifs exclus.
- 5 paramètres observationnels non classifiables.
- `MO != Mo` strict.
- Alias validés : `NO3 -> NO3-`, `O2_DISSOUS -> O2_DISS`.
- Rollback : logique versionné.

## Température
- Statut : `GO_TEMPERATURE_INGESTION_COMMITTED`.
- Batch : `2d67f599-7714-4712-ba1f-5f3584c4c961`.
- Règle : `DEDUP_CANONICAL_ONLY`.
- Cible : 437889 lignes, 0 doublon, lineage présent.

## Hydraulique
- Statut : `NOGO_HYDRAULIC_VALIDATION_PENDING_MNT`.
- Aucune inversion automatique autorisée.
- MNT/DEM requis avant graphe hydraulique décisionnel.

## Dashboards
- Statut : `GO_DEV_DEMO_P0_1`, préproduction non validée.
- Doit afficher périmètre, version réglementaire, statuts hors périmètre et non classifiables.

## Documentation
- La DB réelle et les scripts `_EXECUTED` priment sur les anciennes docs.
- Les documents maîtres à synchroniser en priorité : `docs/07_donnees_et_referentiels/00_data_landscape.md`, `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`, `docs/03_ai_knowledge_base/api_for_agents.md`.
