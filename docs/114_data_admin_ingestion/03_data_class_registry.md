# Data Class Registry

## Rôle

Le registre des classes devient la clé d’orchestration du module 114.

Il permet de décrire :

- quelles familles de données existent ;
- où elles vivent ;
- quelles validations s’appliquent ;
- si elles sont éditables ;
- si elles sont ingestables ;
- si elles sont compatibles temps réel.

## Table cible

```text
data_admin.data_class_registry
```

## Colonnes minimales

| Colonne | Rôle |
|---|---|
| `class_code` | identifiant stable |
| `class_label` | libellé métier |
| `domain` | macro-domaine |
| `target_schema` | schéma cible |
| `target_table` | table cible |
| `exposure_view` | vue de lecture |
| `staging_schema` | schéma staging |
| `staging_table` | table staging |
| `geometry_required` | booléen |
| `temporal_required` | booléen |
| `validation_level` | niveau de validation |
| `editable` | booléen |
| `ingestable` | booléen |
| `realtime_capable` | booléen |
| `owner_role` | rôle responsable |

## Premières classes à instancier

| `class_code` | Domaine | Cible principale | Statut MVP |
|---|---|---|---|
| `INFRA_STATION` | `INFRA` | `infra.stations_mesure` / `api.v_station_dimension` | `MVP1` |
| `INFRA_BARRAGE` | `INFRA` | `infra.barrages` / `api.v_barrage_dimension` | `MVP1` |
| `HYDRO_DEBIT` | `HYDRO` | `hydro.mesure_debit` | `MVP1` |
| `METEO_PRECIPITATION` | `METEO` | `meteo.mesure_precipitation` | `MVP1` |
| `QUALITE_RIVIERE` | `QUALITE` | `qualite.mesure_qualite_riviere` | `MVP1` |
| `QUALITE_NAPPE` | `QUALITE` | `qualite.mesure_qualite_nappe` | `MVP1` |
| `QUALITE_BARRAGE` | `QUALITE` | `qualite.mesure_qualite_barrage` | `MVP1` |
| `POLLUTION_SITE` | `POLLUTION` | `geo.ref_site_pollution` / `api.v_pollution_sites` | `MVP1` |
| `POLLUTION_RESULTAT` | `POLLUTION` | `qualite.resultat_mesure` / `api.v_pollution_latest_results` | `MVP2` |
| `REFERENTIEL_PARAMETRE` | `REFERENTIEL` | `metadata.referentiel_parametre_canonique` | `MVP2` |
| `REGLEMENTAIRE_QUALITE` | `REFERENTIEL` | `metadata.qualite_*_reglementaire` | `MVP2` |
| `SWAT_RESULT` | `MODELES` | `swat_output.*` / `swat_sebou.*` | `MVP3` |
| `WASP_RESULT` | `MODELES` | `wasp_output.*` / `wasp_sebou.*` | `MVP3` |
