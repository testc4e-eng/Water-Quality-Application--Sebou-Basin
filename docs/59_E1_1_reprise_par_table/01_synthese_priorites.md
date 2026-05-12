# Synthese priorites E1.1

| Priorité | Table cible | Source | Candidats | Déjà présent | Doublons | Stratégie recommandée | Statut |
|---|---|---|---:|---:|---:|---|---|
| 1 | hydro.mesure_debit | raw_mesures_debit_jr | 515978 | 384965 | 0 | INSERT_ONLY_MISSING | EXECUTE |
| 1 | hydro.mesure_debit_mensuel | raw_mesures_debit_m | 18993 | 18993 | 0 | NE_RIEN_FAIRE | VALIDE_HORS_PERIMETRE |
| 1 | meteo.mesure_precipitation | raw_mesures_precipitations_jr_traitees, raw_mesures_precipitations_jr | 2099557 | 2099192 | 0 | NE_RIEN_FAIRE | VALIDE_HORS_PERIMETRE |
| 2 | hydro.mesure_barrage | raw_mesures_niv_eau_barrages | 264723 | 264447 | 0 | BLOQUE | PENDING |
| 2 | hydro.barrage_bathymetrie | raw_bathymetries_barrages_abhs | 186797 | 0 | 0 | NE_RIEN_FAIRE | VALIDE_HORS_PERIMETRE |
| 2 | meteo.mesure_evaporation | raw_mesures_evaporation_jr | 38592 | 38592 | 0 | NE_RIEN_FAIRE | VALIDE_HORS_PERIMETRE |
| 2 | meteo.mesure_precipitation_annuelle_max | raw_mesures_precipitations_jr_max | 3830 | 3830 | 0 | NE_RIEN_FAIRE | VALIDE_HORS_PERIMETRE |
| 3 | qualite.mesure_qualite_barrage | raw_mesures_qualite_barrages | 8708 | 11310 | 4353 | RESET_AND_RELOAD | EXECUTE |
| 3 | qualite.mesure_qualite_nappe | raw_mesures_qualite_nappes | 63076 | 63086 | 5 | RESET_AND_RELOAD | EXECUTE |
| 3 | qualite.mesure_qualite_riviere | raw_mesures_qualite_rivieres | 60074 | 60118 | 22 | RESET_AND_RELOAD | EXECUTE |
| 3 | qualite.suivi_qualite_barrage_garde_hebdo | raw_suivi_qualite_brg_garde_hebdo | 3511 | 6956 | 3467 | RESET_AND_RELOAD | EXECUTE |

## Regroupement par stratégie / statut

- `PENDING / BLOQUE` : hydro.mesure_barrage
- `VALIDE_HORS_PERIMETRE / NE_RIEN_FAIRE` : hydro.mesure_debit_mensuel, meteo.mesure_precipitation, hydro.barrage_bathymetrie, meteo.mesure_evaporation, meteo.mesure_precipitation_annuelle_max
- `EXECUTE / RESET_AND_RELOAD` : qualite.mesure_qualite_barrage, qualite.mesure_qualite_nappe, qualite.mesure_qualite_riviere, qualite.suivi_qualite_barrage_garde_hebdo
- `EXECUTE / INSERT_ONLY_MISSING` : hydro.mesure_debit

## Décisions validées

- `hydro.mesure_debit_mensuel` : stratégie `NE_RIEN_FAIRE` validée, table sortie du périmètre actif `E1.1`
- `meteo.mesure_precipitation` : stratégie `NE_RIEN_FAIRE` validée, table considérée `METEO_PRECIPITATION_READY`, avec `DASHBOARD_VALUE = val_remplies`
- `hydro.barrage_bathymetrie` : stratégie `NE_RIEN_FAIRE` validée, table sortie du périmètre actif `E1.1`
- `meteo.mesure_evaporation` : stratégie `NE_RIEN_FAIRE` validée, table sortie du périmètre actif `E1.1`
- `meteo.mesure_precipitation_annuelle_max` : stratégie `NE_RIEN_FAIRE` validée, table sortie du périmètre actif `E1.1`
- `hydro.mesure_debit` : mini-lot exécuté avec succès en `INSERT_ONLY_MISSING`
- `qualite.mesure_qualite_barrage` : mini-lot exécuté avec succès en `RESET_AND_RELOAD`
- `qualite.mesure_qualite_nappe` : mini-lot exécuté avec succès en `RESET_AND_RELOAD`
- `qualite.mesure_qualite_riviere` : mini-lot exécuté avec succès en `RESET_AND_RELOAD`
- `qualite.suivi_qualite_barrage_garde_hebdo` : mini-lot exécuté avec succès en `RESET_AND_RELOAD`

## Première table à traiter

- table cible recommandée : `hydro.mesure_barrage`
- stratégie : `BLOQUE` à lever avant exécution
- décision humaine attendue : valider explicitement un mini-lot avec écriture contrôlée, backup ciblé et audit hash
- commande de validation à fournir après résolution du blocage :

`Je valide le mini-lot hydro.mesure_barrage avec la stratégie retenue après diagnostic.`
