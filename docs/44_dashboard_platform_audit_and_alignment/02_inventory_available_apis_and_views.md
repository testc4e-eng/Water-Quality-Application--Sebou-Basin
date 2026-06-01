# Inventaire APIs et vues disponibles

## Tests HTTP read-only
| Endpoint | Résultat | Commentaire |
|---|---|---|
| `GET /health` sur `127.0.0.1:8000` | HTTP 200 | Backend DEV actif |
| `GET /api/v1/quality/regulatory-status` | OK | Version active et volumes réglementaires confirmés |
| `GET /api/v1/map/catalog` | OK | Catalogue métier P0 disponible |
| `GET /api/v1/map/entities?group_code=stations&support_code=barrage&limit=5` | OK | GeoJSON barrages disponible |
| `GET /api/v1/pollution/sites.geojson?parameter_code=DBO5&limit=5` | OK | Classification réglementaire intégrée |
| `GET /health` sur `127.0.0.1:8011` | non accessible | Port 8011 non démarré au moment de l’audit |

## Objets DB critiques
| API/Vue/Table | Rôle | Données | Statut | Dashboard cible |
|---|---|---:|---|---|
| `meteo.mesure_temperature` | Température journalière | 437889 lignes | `READY` | Température / climat |
| `metadata.qualite_source_reglementaire` | Version réglementaire | 1 | `READY` | Qualité réglementaire / admin |
| `metadata.qualite_type_eau` | Types d’eau | 4 | `READY_CONSTRAINED` | Qualité réglementaire |
| `metadata.qualite_classe_reglementaire` | Classes qualité | 5 | `READY` | Légendes qualité |
| `metadata.qualite_parametre_reglementaire` | Paramètres Tableau n°1 | 41 | `READY` | Qualité réglementaire |
| `metadata.qualite_mapping_canonique_reglementaire` | Mapping canonique | 41 | `READY` | API qualité |
| `metadata.qualite_seuil_reglementaire` | Seuils | 205 dont 177 actifs | `READY_CONDITIONAL` | Classification |
| `metadata.qualite_regle_classification` | Règles moteur | 5 | `READY` | Moteur qualité |
| `api.v_pollution_sites` | Sites pollution IDP | 1951 | `DEV_READY` | Pollution / carte métier |
| `api.v_pollution_latest_results` | Derniers résultats pollution | 1259 | `DEV_READY` | Pollution / carte métier |
| `api.v_barrage_dimension` | Barrages exposés | 11 | `READY_PARTIAL` | Stations / barrages |
| `api.v_station_dimension` | Stations exposées | 390 | `READY` | Stations |
| `api.v_qualite_metaux` | Qualité métaux | 8565 | `READY` | Qualité spécialisée |
| `api.v_qualite_chimie_minerale` | Chimie minérale | 40933 | `READY` | Qualité spécialisée |
| `api.v_qualite_physicochimie` | Physicochimie | 9806 | `READY` | Qualité spécialisée |
| `api.v_qualite_pollution_organique` | Pollution organique | 11481 | `READY` | Qualité spécialisée |
| `geo_work.reseau_hydro_edges_final` | Réseau runtime | 728 | `TOPOLOGY_ONLY` | Hydraulique QA / pollution |
| `qa.hydraulic_direction_validation` | QA hydraulique cible | absente | `NOT_CREATED` | Hydraulique QA |

## Référentiel réglementaire réel
| Élément | Volume |
|---|---:|
| Version active | `REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19` |
| Paramètres réglementaires | 41 |
| Paramètres classifiables | 36 |
| Seuils totaux | 205 |
| Seuils actifs | 177 |
| Seuils inactifs | 28 |
| Seuils inactifs `A_VALIDER` | 25 |
| Seuils inactifs `REJECTED` | 3 |

## Température réelle
| Élément | Valeur |
|---|---|
| Batch | `2d67f599-7714-4712-ba1f-5f3584c4c961` |
| Lignes | 437889 |
| Période | 1983-01-01 à 2026-06-10 |
| Stations métier distinctes | 36 |

Note : les 37 stations source initiales ont été consolidées avec l’alias `Bab Ouender` / `Bab_Ouender`; la table métier contient 36 stations distinctes après déduplication canonique.
