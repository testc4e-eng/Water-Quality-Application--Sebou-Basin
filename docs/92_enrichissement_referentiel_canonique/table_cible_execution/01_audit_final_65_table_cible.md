# Audit final des 65 `table_cible`

## Synthese

| Indicateur | Volume |
|---|---:|
| Parametres actifs sans `table_cible` | 65 |
| Hydro | 1 |
| Meteo | 5 |
| Qualite | 59 |
| Affectation directe recommandee | 63 |
| Client required | 2 |

## Audit

| Parametre | Domaine | Usage actuel | Table source reelle | Vue cible proposee | API cible proposee | Front concerne | Priorite | Decision |
|---|---|---|---|---|---|---|---|---|
| `NIVEAU_EAU` | hydro | actif | `hydro.mesure_barrage_param` | `api.v_barrage_dashboard` | `/api/hydro/barrages/parametres` | Dashboard barrage | P1 | `AFFECTER_VUE_HYDRO` |
| `EVAPO` | meteo | actif | `meteo.mesure_evaporation` | `api.v_meteo_dashboard` | `/api/meteo/dashboard` | Dashboard meteo | P2 | `AFFECTER_VUE_METEO` |
| `PRECIP` | meteo | actif | `meteo.mesure_precipitation` | `api.v_meteo_dashboard` | `/api/meteo/dashboard` | Dashboard meteo | P1 | `AFFECTER_VUE_METEO` |
| `TEMP_MAX` | meteo | pipeline a implementer | `meteo.mesure_temperature` | `api.v_meteo_dashboard` | `/api/meteo/dashboard` | Dashboard meteo | P1 | `AFFECTER_VUE_METEO` |
| `TEMP_MIN` | meteo | pipeline a implementer | `meteo.mesure_temperature` | `api.v_meteo_dashboard` | `/api/meteo/dashboard` | Dashboard meteo | P1 | `AFFECTER_VUE_METEO` |
| `TEMP_MOY` | meteo | pipeline a implementer | `meteo.mesure_temperature` | `api.v_meteo_dashboard` | `/api/meteo/dashboard` | Dashboard meteo | P1 | `AFFECTER_VUE_METEO` |
| `AG` | qualite | actif | `qualite.mesure_qualite_riviere` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `AL` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `AS` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `BA` | qualite | actif | `qualite.mesure_qualite_riviere` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `BE` | qualite | actif | `qualite.suivi_qualite_barrage_garde_hebdo` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `CA` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `CD` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `CF` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `CHLA` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `CL` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `CO` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `CO3` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `COULEUR` | qualite | actif mais historique | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `CT` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `CU` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `DCO` | qualite | actif | `qualite.mesure_qualite_sebou` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `DETERGENT` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `DISQUE_SECCHI` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `EH` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `F_M_MES` | qualite | aucun usage final | staging historique uniquement | aucune | aucune | hors restitution | P3 | `CLIENT_REQUIRED` |
| `FE` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `FE2` | qualite | referentiel exposeable | support qualite futur | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `FET` | qualite | non publie aujourd'hui | staging historique | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `FM` | qualite | aucun usage final | staging historique uniquement | aucune | aucune | hors restitution | P3 | `CLIENT_REQUIRED` |
| `HCT` | qualite | non publie aujourd'hui | staging historique | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `IBD` | qualite | actif | `qualite.mesure_qualite_riviere` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `IBGN` | qualite | actif | `qualite.mesure_qualite_riviere` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `K` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `LARGEUR` | qualite | actif | `qualite.mesure_qualite_riviere` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `LI` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `MES` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `MG` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `MN` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `Mo` | qualite | actif | `qualite.suivi_qualite_barrage_garde_hebdo` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `MO` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `NA` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `NI` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `OH` | qualite | referentiel futur | ingestion qualite future | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `PB` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `PH` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `PHENOL` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `PHEOPIGMENT` | qualite | actif mais rare | `qualite.mesure_qualite_riviere` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `PROFONDEUR` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `S` | qualite | gouverne | staging historique / referentiel | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `S2` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `SB` | qualite | actif | `qualite.mesure_qualite_riviere` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `SE` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `SF` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `SN` | qualite | referentiel exposeable | support qualite futur | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `SO4` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P1 | `AFFECTER_VUE_QUALITE` |
| `SR` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `T_AIR` | qualite | actif historique | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `T_EAU` | qualite | actif historique | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `TA` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `TAC` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `TH` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |
| `TL` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `V` | qualite | actif | `qualite.suivi_qualite_barrage_garde_hebdo` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P3 | `AFFECTER_VUE_QUALITE` |
| `ZN` | qualite | actif | `qualite.*` | `api.v_qualite_dashboard` | `/api/qualite/dashboard` | Dashboard qualite | P2 | `AFFECTER_VUE_QUALITE` |

## Decision

- `63` affectations de `table_cible` sont techniquement proposees.
- `FM` et `F_M_MES` ne doivent pas etre exposes avant arbitrage client.
- `MD` reste client required, mais n'appartient pas au lot courant des `65`.
