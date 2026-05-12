# Regles future ingestion modeles

## Regles communes

- chaque ingestion a un `run_id`
- chaque scenario a un `scenario_code` stable
- chaque fichier source est audite
- chaque ligne chargee conserve source file, source row/hash et horodatage
- chaque mesure est rattachee a un parametre canonique ou reference modele
- chaque entite modele est rattachee a un support GEO

## SWAT

| Element | Regle |
|---|---|
| subbasin | rattachement obligatoire a `geo.sous_bassin` ou table support equivalente |
| parametre | mapping obligatoire vers referentiel SWAT |
| scenario | `normal` ne suffit pas pour multi-scenario |
| doublons | interdiction sur `(run_id, subbasin_uid, temps, param_code)` |

## WASP

| Element | Regle |
|---|---|
| segment | rattachement obligatoire au reseau hydrographique |
| parametre | mapping obligatoire vers referentiel WASP |
| scenario | `normal` ne suffit pas pour multi-scenario |
| doublons | interdiction sur `(run_id, reseau_id, bucket_day, code_parametre)` |

