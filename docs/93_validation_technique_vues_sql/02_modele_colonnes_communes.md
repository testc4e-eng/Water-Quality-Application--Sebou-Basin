# Modele colonnes communes

## Modele cible

| Colonne | Type | Obligatoire | Description |
|---|---|---|---|
| `source_table` | `text` | oui | Table source logique |
| `support_type` | `text` | oui | Type support : `riviere`, `nappe`, `barrage`, `station_meteo`, `point_pollution` |
| `support_id` | `text` | oui | Identifiant support normalise en texte |
| `support_nom` | `text` | non | Nom si disponible ; souvent absent dans les tables de mesures |
| `date_mesure` | `timestamptz` | oui | Date/temps de mesure ou prelevement |
| `parametre_ref_id` | `uuid` | non | FK referentiel si disponible ; calculable via referentiel canonique si absent |
| `code_parametre` | `text` | oui | Code canonique/metier expose |
| `libelle_parametre` | `text` | oui | Libelle referentiel |
| `unite_reference` | `text` | non | Unite metier standard |
| `valeur_num` | `double precision` | non | Valeur numerique |
| `valeur_raw` | `text` | non | Valeur brute si disponible |
| `qa_status` | `text` | oui | Statut QA calcule depuis flags |
| `geo_status` | `text` | oui | Statut GEO calcule depuis support/geom |
| `source_row_id` | `text` | non | Identifiant ligne source stable |
| `geom` | `geometry` | non | Geometrie si disponible |
| `campagne_id` | `text` | non | Campagne future si disponible |
| `ingestion_batch_id` | `text` | non | Batch ingestion futur |

## Colonnes absentes / incompatibles

| Cas | Constat | Traitement |
|---|---|---|
| `support_nom` | absent des tables de mesures inspectees | exposer `NULL`, enrichir plus tard par jointure GEO |
| `geom` qualite historique | absent des tables qualite | exposer `NULL`, eviter jointures GEO lourdes dans V1 |
| `parametre_ref_id` barrage qualite | absent dans `qualite.mesure_qualite_barrage`, null dans garde hebdo | joindre sur `metadata.referentiel_parametre_canonique.code_parametre = parametre_qualite` |
| `meteo.mesure_precipitation` | valeurs multiples `val_observees`, `val_power_nasa`, `val_remplies` | exposer `valeur_num = coalesce(val_observees, val_remplies, val_power_nasa)`, conserver `valeur_raw` composite |
| `source_pollution_mesure_param` | valeur brute et numerique coexistent | exposer les deux, conserver flags non numerique |
| `campagne_id` | absent | `NULL` en V1, champ reserve ingestion future |
| `ingestion_batch_id` | absent | `NULL` en V1, champ reserve ingestion future |

## QA status propose

| Regle | `qa_status` |
|---|---|
| flag null value / value missing | `QA_NULL_VALUE` |
| flag negative | `QA_NEGATIVE` |
| flag outlier | `QA_OUTLIER` |
| flag param missing/unmapped | `QA_PARAM_UNMAPPED` |
| flag station/nappe/barrage unmapped | `QA_GEO_UNMAPPED` |
| aucune anomalie flaggee | `QA_OK` |

## GEO status propose

| Cas | `geo_status` |
|---|---|
| support_id present | `GEO_LINKED_BY_ID` |
| geom present | `GEO_GEOMETRY_PRESENT` |
| geom absent mais coordonnees presentes | `GEO_XY_PRESENT` |
| flag geometrique absent/manquant | `GEO_UNRESOLVED` |
| support non applicable | `GEO_NOT_APPLICABLE` |
