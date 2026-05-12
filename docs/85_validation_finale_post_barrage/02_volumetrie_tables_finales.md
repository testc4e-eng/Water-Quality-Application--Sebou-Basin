# Volumetrie tables finales

## Hydro

| Table | Volume | Statut |
|---|---:|---|
| `hydro.barrage_bathymetrie` | 62359 | MIGRE_OK |
| `hydro.mesure_barrage` | 84831 | LEGACY_READ_ONLY |
| `hydro.mesure_barrage_param` | 272652 | MIGRE_OK |
| `hydro.mesure_debit` | 652446 | MIGRE_AVEC_BACKLOG |
| `hydro.mesure_debit_mensuel` | 19316 | MIGRE_OK |
| `hydro.mesure_debit_source` | 3978 | MIGRE_OK |
| `hydro.regle_qualite_debit_source` | 19 | MIGRE_OK |
| `hydro.regle_qualite_debit_station` | 390 | MIGRE_OK |

## Meteo

| Table | Volume | Statut |
|---|---:|---|
| `meteo.mesure_evaporation` | 48900 | MIGRE_AVEC_BACKLOG |
| `meteo.mesure_precipitation` | 546007 | MIGRE_OK |
| `meteo.mesure_precipitation_annuelle_max` | 2085 | MIGRE_OK |
| `meteo.mesure_temperature` | 0 | BACKLOG |
| `meteo.regle_qualite_evaporation_station` | 390 | MIGRE_OK |

## Qualite

| Table | Volume | Statut |
|---|---:|---|
| `qualite.mesure_qualite_barrage` | 7820 | MIGRE_OK |
| `qualite.mesure_qualite_nappe` | 63047 | MIGRE_AVEC_BACKLOG |
| `qualite.mesure_qualite_riviere` | 59534 | MIGRE_AVEC_BACKLOG |
| `qualite.mesure_qualite_sebou` | 49954 | MIGRE_AVEC_BACKLOG |
| `qualite.source_pollution_mesure_param` | 7191 | MIGRE_AVEC_BACKLOG |
| `qualite.source_pollution_prelevement` | 141 | MIGRE_OK |
| `qualite.source_pollution_prelevement_lien` | 116 | MIGRE_OK |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 1780 | MIGRE_AVEC_BACKLOG |

## Modeles

| Table | Volume | Statut |
|---|---:|---|
| `swat_output.mesure_qualite_subbasin_ts` | 745110 | MIGRE_OK |
| `swat_output.ref_bassin` | 1 | MIGRE_OK |
| `swat_output.ref_parametre_qualite` | 5 | MIGRE_OK |
| `swat_output.ref_run_modele` | 1 | MIGRE_OK |
| `swat_output.ref_scenario` | 1 | MIGRE_AVEC_BACKLOG |
| `swat_output.ref_subbasin` | 18 | MIGRE_OK |
| `wasp_output.mesure_qualite_segment_ts` | 931770 | MIGRE_AVEC_BACKLOG |
| `wasp_output.ref_parametre_qualite` | 12 | MIGRE_OK |
| `wasp_output.ref_run_modele` | 1 | MIGRE_AVEC_BACKLOG |
| `wasp_output.ref_segment_modele` | 22 | MIGRE_OK |

## Exposition

| Objet | Volume |
|---|---:|
| `api.v_hydro_barrage_param_journalier` | 272652 |
| `api.v_hydro_barrage_param_compat_wide` | 84831 |
| `api.v_hierarchie_metier_listing` | 219 |
| `analytics.mv_dashboard_climat_meteo_menu` | 110344 |
| `analytics.mv_dashboard_hydrologie_menu` | 816081 |
| `analytics.mv_dashboard_pollution_menu` | 165684 |
| `metadata.mv_obs_referentiel_parametre` | 18 |
| `metadata.mv_obs_parametre_entite_compat` | 18 |
| `metadata.mv_obs_parametre_coverage` | 16 |

