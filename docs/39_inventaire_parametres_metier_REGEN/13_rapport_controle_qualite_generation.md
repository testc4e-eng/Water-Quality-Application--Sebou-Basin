# Rapport de contrôle qualité — inventaire paramètres

## 1. Contrôle colonne base

| Valeur distincte dans base | Statut |
|---|---|
| abh_sad | OK |
| abh_sebou_070426 | OK |

## 2. Contrôle colonne schema

| Schéma | Autorisé dans inventaire principal | Statut |
|---|---|---|
| hydro | Oui | OK |
| infra | Oui | OK |
| metadata | Oui | OK |
| meteo | Oui | OK |
| public | Oui (public métier source) | OK |
| qualite | Oui | OK |
| swat_sebou | Oui | OK |
| wasp_output | Oui | OK |

## 3. Contrôle colonne table

| Base | Schéma | Table | Existe dans information_schema | Statut |
|---|---|---|---|---|
| abh_sad | hydro | barrage_bathymetrie | Oui | OK |
| abh_sad | hydro | mesure_barrage | Oui | OK |
| abh_sad | infra | barrages | Oui | OK |
| abh_sad | infra | decharge | Oui | OK |
| abh_sad | infra | point_eau | Oui | OK |
| abh_sad | infra | rejet_domestique | Oui | OK |
| abh_sad | infra | rejet_inventaire_pollution | Oui | OK |
| abh_sad | infra | step | Oui | OK |
| abh_sad | metadata | mapping_parametre_source | Oui | OK |
| abh_sad | metadata | mapping_parametre_unresolved_legacy_qualite_riviere | Oui | OK |
| abh_sad | metadata | mapping_parametre_unresolved_suivi_qualite_sebou | Oui | OK |
| abh_sad | metadata | obs_referentiel_parametre | Oui | OK |
| abh_sad | metadata | referentiel_parametre | Oui | OK |
| abh_sad | meteo | mesure_precipitation_annuelle_max | Oui | OK |
| abh_sad | qualite | mesure_qualite_barrage | Oui | OK |
| abh_sad | qualite | mesure_qualite_nappe | Oui | OK |
| abh_sad | qualite | mesure_qualite_riviere | Oui | OK |
| abh_sad | qualite | mesure_qualite_sebou | Oui | OK |
| abh_sad | qualite | source_pollution_mesure_param | Oui | OK |
| abh_sad | qualite | suivi_qualite_barrage_garde_hebdo | Oui | OK |
| abh_sad | swat_sebou | swat_reach_results | Oui | OK |
| abh_sad | swat_sebou | swat_subbasin_results | Oui | OK |
| abh_sad | wasp_output | mesure_qualite_segment_ts | Oui | OK |
| abh_sad | wasp_output | ref_parametre_qualite | Oui | OK |
| abh_sebou_070426 | public | infra_barrages_abhs | Oui | OK |
| abh_sebou_070426 | public | inv_decharges_abhs | Oui | OK |
| abh_sebou_070426 | public | inv_rejets_domestiques_abhs | Oui | OK |
| abh_sebou_070426 | public | inv_step_abhs | Oui | OK |
| abh_sebou_070426 | public | mesures_bathymetries_barrages_abhs | Oui | OK |
| abh_sebou_070426 | public | mesures_debit_jr | Oui | OK |
| abh_sebou_070426 | public | mesures_debit_m | Oui | OK |
| abh_sebou_070426 | public | mesures_debit_sources | Oui | OK |
| abh_sebou_070426 | public | mesures_evaporation_jr | Oui | OK |
| abh_sebou_070426 | public | mesures_idp_2024_qualite_globale | Oui | OK |
| abh_sebou_070426 | public | mesures_idp_2024_qualite_marche_cadre | Oui | OK |
| abh_sebou_070426 | public | mesures_idp_2024_src_pollution_globale | Oui | OK |
| abh_sebou_070426 | public | mesures_niv_eau_barrages | Oui | OK |
| abh_sebou_070426 | public | mesures_precipitations_jr | Oui | OK |
| abh_sebou_070426 | public | mesures_qualite_barrages | Oui | OK |
| abh_sebou_070426 | public | mesures_qualite_nappes | Oui | OK |
| abh_sebou_070426 | public | mesures_qualite_rivieres | Oui | OK |
| abh_sebou_070426 | public | mesures_suivi_qualite_brg_garde_hebdo | Oui | OK |
| abh_sebou_070426 | public | mesures_suivi_qualite_sebou_jr_6stations | Oui | OK |
| abh_sebou_070426 | public | ref_types_mesures | Oui | OK |
| abh_sebou_070426 | qualite | audit_integration_qualite | Oui | OK |

## 4. Contrôle valeurs interdites dans colonnes techniques

Aucune valeur interdite détectée dans les colonnes techniques.

## 5. Contrôle schémas exclus

| Schéma exclu | Présent dans inventaire principal | Statut |
|---|---|---|
| staging | Non | OK |
| raw | Non | OK |
| raw_import | Non | OK |
| tmp | Non | OK |
| backup | Non | OK |

## 6. Contrôle faux paramètres techniques

| Faux paramètre technique | Nombre exclusions |
|---|---|
| id | 107 |
| geom | 73 |
| created_at | 58 |
| updated_at | 33 |
| observation | 26 |
| description | 15 |
| etat | 10 |
| X | 9 |
| Y | 9 |
| lat | 6 |
| Date | 5 |
| Nom | 5 |
| libelle | 4 |
| nom | 4 |
| y | 4 |
| Etat | 3 |
| commentaire | 3 |
| date | 3 |
| duplicate_count | 3 |
| source_column | 3 |
| Code | 2 |
| Lat | 2 |
| column_name | 2 |
| sheet_name | 2 |
| statut | 2 |
| ID | 1 |
| code | 1 |
| description_metier | 1 |
| grain | 1 |
| legacy_code_pt_eau | 1 |
| object_type | 1 |
| path | 1 |
| schema_name | 1 |
| table_name | 1 |
| x | 1 |

## 7. Comparaison avec ancien inventaire

| Indicateur | Valeur |
|---|---|
| Ancien nombre de paramètres | 339 |
| Nouveau nombre de paramètres | 298 |
| Paramètres supprimés car bruit | 102 |
| Paramètres conservés | 256 |
| Paramètres déplacés vers annexe technique | 8 |

## 8. Conclusion

L’inventaire régénéré est : **exploitable**.
