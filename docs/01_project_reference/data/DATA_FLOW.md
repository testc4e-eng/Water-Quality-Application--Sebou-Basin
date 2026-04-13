# DATA_FLOW

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | flux de données depuis les sources et l'ingestion jusqu'à la restitution web |
| Source de vérité | Oui |
| Documents liés | [DATABASE_SCHEMA](./DATABASE_SCHEMA.md), [DATA_MODELS](./DATA_MODELS.md), [DATA_QUALITY](./DATA_QUALITY.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Flux principal

```text
Sources historiques / fichiers SWAT-WASP / référentiels admin-geo-infra
        ↓
Staging et normalisation
        ↓
Tables métier hydro / meteo / qualite / modeles
        ↓
Mappings, dictionnaires et couverture observatoire (metadata)
        ↓
Vues d'exposition et d'optimisation (api, analytics)
        ↓
Backend FastAPI
        ↓
Frontend React : dashboards, cartographie, administration, data viewer
```

## 2. Flux ingestion modèles

- Les fichiers sont uploadés puis contrôlés structurellement avant simulation dry-run.
- Les signatures d'import sont enregistrées dans `audit.ingestion_dataset_signatures` pour la détection de doublons.
- Les résultats validés alimentent `swat_sebou` et `wasp_sebou`.
- Les contrôles QA exploitent `qa.variable_thresholds`, `swat_sebou.*` et `wasp_sebou.*`.

## 3. Flux cartographie et observatoire

- Les référentiels `geo`, `admin` et `infra` alimentent les vues `api.viz_carto_layers` et `api.mv_*_geojson`.
- Les règles d'affichage sont administrées dans `metadata.popup_rules_config`.
- L'observatoire repose sur `metadata.mv_obs_*`, `metadata.referentiel_parametre` et `api.mv_hierarchie_metier_listing`.
