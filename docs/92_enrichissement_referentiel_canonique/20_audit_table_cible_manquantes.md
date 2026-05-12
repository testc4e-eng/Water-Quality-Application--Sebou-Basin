# Audit table_cible manquantes

## Statut

`BACKLOG_ARCHITECTURE_REFERENTIEL`

Ces affectations ne creent pas de tables. Elles preparent les vues/API minimales d'exposition.

## Synthese

| Indicateur | Volume |
|---|---:|
| parametres actifs sans `table_cible` | 65 |
| hydro | 1 |
| meteo | 5 |
| qualite | 59 |

## Audit

| Parametre | Domaine | Tables candidates | Vue candidate | API candidate | Front concerne | Priorite |
|---|---|---|---|---|---|---|
| `NIVEAU_EAU` | hydro | hydro.mesure_barrage_param | api.v_barrage_dashboard | /api/hydro/barrages/parametres | Dashboard barrage | P1 |
| `EVAPO` | meteo | meteo.mesure_evaporation | api.v_meteo_dashboard | /api/meteo/dashboard | Dashboard meteo | P2 |
| `PRECIP` | meteo | meteo.mesure_precipitation | api.v_meteo_dashboard | /api/meteo/dashboard | Dashboard meteo | P2 |
| `TEMP_MAX` | meteo | meteo.mesure_temperature | api.v_meteo_dashboard | /api/meteo/dashboard | Dashboard meteo | P1 |
| `TEMP_MIN` | meteo | meteo.mesure_temperature | api.v_meteo_dashboard | /api/meteo/dashboard | Dashboard meteo | P1 |
| `TEMP_MOY` | meteo | meteo.mesure_temperature | api.v_meteo_dashboard | /api/meteo/dashboard | Dashboard meteo | P1 |
| `AG` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `AL` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `AS` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `BA` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `BE` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `CA` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `CD` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `CF` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `CHLA` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `CL` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `CO` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `CO3` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `COULEUR` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `CT` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `CU` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `DCO` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `DETERGENT` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `DISQUE_SECCHI` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `EH` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `F_M_MES` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `FE` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `FE2` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `FET` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `FM` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `HCT` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `IBD` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `IBGN` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `K` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `LARGEUR` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `LI` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `MES` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `MG` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `MN` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `Mo` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `MO` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `NA` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `NI` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `OH` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `PB` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `PH` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `PHENOL` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `PHEOPIGMENT` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `PROFONDEUR` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `S` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `S2` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `SB` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `SE` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `SF` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `SN` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `SO4` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `SR` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `T_AIR` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `T_EAU` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `TA` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `TAC` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `TH` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `TL` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `V` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
| `ZN` | qualite | qualite.* selon support geo | api.v_qualite_dashboard | /api/qualite/dashboard | Dashboard qualite | P2 |
