# Cartographie des données SAD/WQDSS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | document maître |
| Source de vérité | Oui, pour la lecture data landscape |
| Snapshot | BD `abh_sad` inspectée en lecture seule le 2026-05-22 |

## Vue globale

```text
Sources brutes
  -> staging/raw
  -> QA, validation, quarantaine
  -> référentiels canoniques
  -> tables métier
  -> vues api/analytics
  -> FastAPI
  -> dashboards, cartes, exports
```

## Structure BD réelle

| Schéma | Objets tables/vues |
|---|---:|
| `admin` | 5 |
| `api` | 77 |
| `audit` | 17 |
| `geo` | 18 |
| `geo_work` | 7 |
| `hydro` | 8 |
| `infra` | 22 |
| `metadata` | 49 |
| `meteo` | 5 |
| `modeles` | 3 |
| `monitoring` | 3 |
| `public` | 3 |
| `qa` | 31 |
| `qualite` | 9 |
| `security` | 11 |
| `staging` | 51 |
| `swat_output` | 8 |
| `swat_sebou` | 4 |
| `wasp_output` | 5 |
| `wasp_sebou` | 3 |

## Data landscape opérationnel

| Domaine | Source | Staging | Métier | API | Dashboard | Statut |
|---|---|---|---|---|---|---|
| Stations | historiques ABH | `staging.*` | `infra.stations_mesure` | `api.mv_station_dimension`, `/api/v1/map/entities` | cartes, observatoire | `STABILISE` |
| Barrages | historiques ABH | `staging.*` | `infra.barrages`, `hydro.mesure_barrage_param` | vues `api.v_hydro_barrage_param_*` | hydrologie, carto métier | `STABILISE_AVEC_REGLES` |
| Débits | mesures journalières/mensuelles | `staging.*` | `hydro.mesure_debit`, `hydro.mesure_debit_mensuel` | hydro/observatory/analytics | hydro | `STABLE_AVEC_QA` |
| Météo pluie | mesures historiques | `staging.*` | `meteo.mesure_precipitation` | climate/analytics | climat | `STABILISE` |
| Météo évaporation | mesures historiques | `staging.*` | `meteo.mesure_evaporation` | climate/analytics | climat | `STABLE_AVEC_QA` |
| Météo température | `timeseries_temperature_global.csv` | `staging.temperature_daily_raw` | `meteo.mesure_temperature` | climate | température air | `COMMITTED` |
| Qualité historique | campagnes ABH | `staging.*` | `qualite.mesure_qualite_*` | `/api/v1/qualite/*`, vues `api.v_qualite_*` | qualité P0, observatoire | `STABLE_AVEC_FLAGS` |
| Pollution historique | inventaires pollution | `staging.*` | `qualite.source_pollution_prelevement`, `qualite.source_pollution_mesure_param` | pollution/map | pollution | `PARTIEL_QA` |
| Pollution IDP DEV | SHP / inventaires IDP | `staging.*`, `qa.*` | `geo.ref_site_pollution`, `qualite.resultat_mesure` | `/api/v1/pollution/*`, `/api/v1/map/*` | `/pollution-idp-dev`, `/dashboard-carto-metier` | `GO_DEV__NOGO_PREPROD` |
| Référentiel paramètres | inventaires et validations | metadata | `metadata.referentiel_parametre_canonique`, mappings source | filtres API, vues spécialisées | qualité, carto métier | `PARTIEL_VALIDÉ` |
| Référentiel réglementaire | Tableau n°1 / normes | metadata | `metadata.qualite_*_reglementaire` | `/api/v1/quality/thresholds`, `/classify` | symbologie qualité | `DEV_PARTIAL` |
| Topologie pollution | réseau hydrographique | `geo_work.*` | `geo_work.reseau_hydro_edges_final` | `/api/v1/routing/*` | dashboard pollution | `VISUEL_NON_HYDRAULIQUE` |
| SWAT | outputs legacy | `swat_*` | `swat_output`, `swat_sebou` | `/api/v1/swat/*` optionnel | scénarios | `SANDBOX_LEGACY` |
| WASP | outputs legacy | `wasp_*` | `wasp_output`, `wasp_sebou` | endpoints modèles/scénarios | scénarios | `SANDBOX_LEGACY` |

## Référentiels réels prioritaires

| Référentiel | Objet | Statut | Règle |
|---|---|---|---|
| paramètres canoniques | `metadata.referentiel_parametre_canonique` | actif partiel | pivot pour API spécialisée et ingestion |
| réglementation qualité | `metadata.qualite_*_reglementaire` | DEV partiel | dépend version active et seuils |
| sites pollution | `geo.ref_site_pollution` | canonique DEV | préproduction bloquée par arbitrage |
| QA identité spatiale | `qa.spatial_identity_*` | actif DEV | aucune fusion destructive |
| runtime topologique | `geo_work.reseau_hydro_edges_final` | actif DEV | visuel uniquement |

## Règles de statut data

| Statut | Signification |
|---|---|
| `STABILISE` | utilisable dans le MVP documenté |
| `STABLE_AVEC_QA` | utilisable avec flags et limites |
| `PARTIEL_VALIDÉ` | utilisable sur périmètre restreint |
| `GO_DEV__NOGO_PREPROD` | démonstration DEV seulement |
| `SANDBOX_LEGACY` | test, non décisionnel |
| `DONNEE_ABSENTE` | non fournie ou non injectée |

