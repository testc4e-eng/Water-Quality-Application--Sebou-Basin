# Flags spatiaux a signaler

## Regle retenue

- Un probleme spatial ne bloque pas automatiquement Lot E0 si un rattachement geo unique existe.
- Les controles spatiaux sont donc convertis en flags QA documentaires : `GEOM_INVALID`, `OUTSIDE_BASIN`, `FAR_FROM_NETWORK`, `GEOM_NULL`, `SRID_UNKNOWN`.

## Tables a flagger

| Table | Flags proposes | Commentaire |
|---|---|---|
| infra.step | FAR_FROM_NETWORK x31 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.step_industrielle | FAR_FROM_NETWORK x12 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.step_inventaire_pollution | OUTSIDE_BASIN x14 ; FAR_FROM_NETWORK x40 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_step_abhs | FAR_FROM_NETWORK x31 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_step_ind_abhs | FAR_FROM_NETWORK x12 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.rejet_abattoir | OUTSIDE_BASIN x1 ; FAR_FROM_NETWORK x41 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.rejet_abattoir_inventaire_pollution | OUTSIDE_BASIN x2 ; FAR_FROM_NETWORK x38 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_rejets_abattoirs_abhs | OUTSIDE_BASIN x1 ; FAR_FROM_NETWORK x41 | signalement QA seulement tant qu'un rattachement geo unique existe |
| geo.nappe | GEOM_INVALID x1 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_adm_regions_abhs | GEOM_INVALID x1 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_mesures_evaporation_jr | GEOM_NULL x48900 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_nappes_abhs | GEOM_INVALID x1 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_points_eau_abhs | GEOM_NULL x4 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_rejets_domestiques_abhs | GEOM_NULL x78 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_sous_bassin_sebou | GEOM_INVALID x6 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.decharge | GEOM_NULL x86 ; OUTSIDE_BASIN x3 ; FAR_FROM_NETWORK x107 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.decharge_inventaire_pollution | OUTSIDE_BASIN x5 ; FAR_FROM_NETWORK x10 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.decharge_inventaire_pollution_general | OUTSIDE_BASIN x2 ; FAR_FROM_NETWORK x100 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_decharges_abhs | GEOM_NULL x86 ; OUTSIDE_BASIN x3 ; FAR_FROM_NETWORK x107 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.huilerie | GEOM_NULL x13 ; OUTSIDE_BASIN x3 ; FAR_FROM_NETWORK x497 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.huilerie_inventaire_pollution | OUTSIDE_BASIN x19 ; FAR_FROM_NETWORK x504 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_huileries_abhs | GEOM_NULL x13 ; OUTSIDE_BASIN x3 ; FAR_FROM_NETWORK x497 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.mine | FAR_FROM_NETWORK x31 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.mine_inventaire_pollution | FAR_FROM_NETWORK x28 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_mines_abhs | FAR_FROM_NETWORK x31 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.point_eau | GEOM_NULL x4 | signalement QA seulement tant qu'un rattachement geo unique existe |
| qualite.source_pollution_prelevement | OUTSIDE_BASIN x2 ; FAR_FROM_NETWORK x75 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.rejet_domestique | GEOM_NULL x78 ; OUTSIDE_BASIN x3 ; FAR_FROM_NETWORK x141 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.rejet_industriel | FAR_FROM_NETWORK x8 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_rejets_ind_abhs | FAR_FROM_NETWORK x8 | signalement QA seulement tant qu'un rattachement geo unique existe |
| geo.source | OUTSIDE_BASIN x1 ; FAR_FROM_NETWORK x94 | signalement QA seulement tant qu'un rattachement geo unique existe |
| geo.sous_bassin_abh | GEOM_INVALID x6 | signalement QA seulement tant qu'un rattachement geo unique existe |
| geo.sous_bassin_swat_beht | GEOM_INVALID x5 | signalement QA seulement tant qu'un rattachement geo unique existe |
| geo.sous_bassin_swat_moyen_sebou | GEOM_INVALID x3 | signalement QA seulement tant qu'un rattachement geo unique existe |
| geo.sous_bassin_swat_ouergha | GEOM_INVALID x1 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.stations | OUTSIDE_BASIN x4 | signalement QA seulement tant qu'un rattachement geo unique existe |
| infra.stations_mesure | OUTSIDE_BASIN x4 | signalement QA seulement tant qu'un rattachement geo unique existe |
| staging.raw_stations_abhs | OUTSIDE_BASIN x4 | signalement QA seulement tant qu'un rattachement geo unique existe |
