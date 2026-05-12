# Plan d'insertion tables finales

## Domaine qualite

- Tables sources : `raw_mesures_qualite_barrages`, `raw_mesures_qualite_nappes`, `raw_mesures_qualite_rivieres`, `raw_suivi_qualite_sebou_jr`, `raw_suivi_qualite_brg_garde_hebdo`, `raw_idp_2024_mesures_qualite_globale`
- Tables cibles : `qualite.mesure_qualite_barrage`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_sebou`, `qualite.suivi_qualite_barrage_garde_hebdo`
- Colonnes de mapping : `source_row_id`, `source_date`, `geo_ref`, `code_parametre_canonique`, `valeur_preparee`, `unite_finale`
- Règles QA : quarantaine deja retiree ; flags `QA_REQUIRED`, `UNIT_ASSUMED`, `UNIT_CONVERTED`, `FLAG_INFERIEUR`, `FLAG_SUPERIEUR`
- Risques : routage final des `776` lignes `raw_idp_2024_mesures_qualite_globale` a confirmer par type d'entite

## Domaine hydro

- Tables sources : `raw_mesures_debit_jr`, `raw_mesures_debit_m`, `raw_mesures_debit_sources`, `raw_mesures_niv_eau_barrages`, `raw_barrages_abhs`, `raw_bathymetries_barrages_abhs`
- Tables cibles : `hydro.mesure_debit`, `hydro.mesure_debit_mensuel`, `hydro.mesure_debit_source`, `hydro.mesure_barrage`, `hydro.barrage_bathymetrie`
- Colonnes de mapping : `geo_ref`, `code_parametre_canonique`, `source_date`, `valeur_preparee`
- Règles QA : debit negatif deja flagge ; parsing decimal/scientifique deja fait
- Risques : fortes quarantaines sur `raw_mesures_niv_eau_barrages` et bathymetrie a verifier avant passage en production

## Domaine meteo

- Tables sources : `raw_mesures_precipitations_jr`, `raw_mesures_precipitations_jr_max`, `raw_mesures_precipitations_jr_traitees`, `raw_mesures_evaporation_jr`
- Tables cibles : `meteo.mesure_precipitation`, `meteo.mesure_precipitation_annuelle_max`, `meteo.mesure_evaporation`
- Colonnes de mapping : `geo_ref`, `source_date`, `valeur_preparee`, `code_parametre_canonique`
- Règles QA : `NULL` exclus, `QA_REQUIRED` pour unités supposées
- Risques : gros volume de quarantaine meteo, notamment precipitation et evaporation

## Domaine infra

- Tables sources potentielles : `raw_points_eau_abhs`, `raw_rejets_domestiques_abhs`, `raw_step_abhs`, `raw_decharges_abhs`, `raw_huileries_abhs`, `raw_nappes_abhs`
- Tables cibles potentielles : `infra.point_eau`, `infra.rejet_domestique`, `infra.step`, `infra.decharge`, `infra.huilerie`, `geo.nappe`
- Statut : hors execution mesure immediate ; a n'activer que si le lot referentiel/infra est explicitement valide
- Risques : ne pas melanger migration mesure et rechargement referentiel dans le meme passage

## Domaine metadata

- Aucune insertion `metadata` prevue dans `E1`
- Les referentiels restent inchanges pendant la migration mesure reelle
