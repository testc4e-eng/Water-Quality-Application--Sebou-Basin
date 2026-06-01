# Inventaire opérationnel des couches spatiales pollution existantes

Source : SHP locaux `C:\dev\WQDSS\data\Qualité & pollution shp` + documentation DB active `infra.*`, `qualite.*`, `metadata.*`.

| Couche | Source locale / table existante | Rôle métier | Entités | Géométrie / CRS | Champs clés | Relation IDP | Aptitude référentiel stable |
|---|---|---:|---:|---|---|---|---|
| STEP | `Sources_de_pollution_Inventaire/STEPS/STEP.shp`, `infra.step`, `infra.step_inventaire_pollution` | Station d'épuration domestique | 49 SHP | Point, Lambert Nord Maroc métrique | `Code_STEP`, `Commune`, `X`, `Y`, `Etat`, `Niveau__d_` | Match spatial avec IDP sources/mesures ; source stable prioritaire si code présent | Élevée |
| STEP industrielles | `STEP_industrielles/STEP_industielles.shp`, `infra.step_industrielle` | STEP industrielle | 14 SHP | Point, Lambert Nord Maroc métrique | `Nom`, `Secteur`, `Commune`, `X`, `Y`, `DBO5_mgO2_`, `DCO_mgO2_l` | Match spatial et type pollution industriel | Élevée |
| STM | `STMs/STMs.shp`, `infra.stm` | Station de traitement / monitoring pollution | 19 SHP | Point, Lambert Nord Maroc métrique | `Nom`, `Commune`, `Province`, `Etat`, `X`, `Y` | Candidat site canonique existant | Élevée |
| Huileries | `Huileries/Huileries.shp`, `infra.huilerie`, `infra.huilerie_inventaire_pollution` | Activité huilerie / rejet agro-industriel | 606 SHP | Point, Lambert Nord Maroc ; extent min aberrant signalé par GDAL | `Code`, `Nom`, `Commune`, `Type`, `X`, `Y`, charges pollution | Match IDP par distance et nom ; QA géométrie obligatoire | Moyenne après QA géométrique |
| Mines | `Mines/Mines.shp`, `infra.mine`, `infra.mine_inventaire_pollution` | Site minier | 39 SHP | Point, Lambert Nord Maroc métrique | `Nom`, `N°_Licenc`, `Commune`, `Nat_des_mi`, `X`, `Y` | Match IDP type mine/source pollution | Élevée |
| Décharges | `Décharges/Décharges.shp`, `infra.decharge`, `infra.decharge_inventaire_pollution` | Décharge active / site de déchets | 139 SHP | Point, Lambert Nord Maroc métrique | `Code`, `nom`, `Commune`, `Type`, `X`, `Y` | Match IDP décharge / pression polluante | Élevée |
| Décharges abandonnées | `Décharges_Abondonées/Décharges_Abondonées.shp`, `infra.decharge_inventaire_pollution_general` | Décharge abandonnée / historique | 11 SHP | Point, Lambert Nord Maroc métrique | `Nom`, `Commune`, `x`, `y` | À conserver comme source distincte avec statut historique | Moyenne |
| Rejets bruts | `Rejets_Brutes/Rejets_Brutes.shp`, `infra.rejet_domestique`, `infra.rejet_inventaire_pollution` | Rejet domestique brut | 277 SHP | Point, Lambert Nord Maroc métrique | `Code_rejet`, `Commune`, `X`, `Y`, `Q__l_s_`, `Milieu_ré` | Forte relation avec IDP source/mesure | Élevée |
| Rejets abattoirs | `Rejets_Abattoirs/Rejet_Abattoir.shp`, `infra.rejet_abattoir` | Rejet abattoir | 56 SHP | Point, Lambert Nord Maroc métrique | `Province`, `Commune`, `X`, `Y` | Match par géométrie/commune ; manque code source | Moyenne |
| Fosses septiques | `finale_shp/fosse_septique_abhs.shp`, `infra.fosses_septiques_abhs` | Fosse septique / pression assainissement | 20 SHP | Point, EPSG:26191 | `id`, `code_commu`, `province_f`, `commune_fr`, `coord_x`, `coord_y` | Complément pression polluante ; match spatial IDP possible | Élevée |
| LPEE pollution | `Shapefile_Sources_de_Pollution/Pollution_LPEE.shp`, `qualite.source_pollution_prelevement`, `qualite.source_pollution_mesure_param` | Prélèvements et analyses pollution | 141 SHP | Point, Lambert Nord Maroc métrique | `Point_de_p`, `Date_Recep`, `Commune`, `Nature`, paramètres qualité | Pont principal vers résultats analytiques historiques | Élevée comme couche mesure |

## Décision opérationnelle

- Construire `geo.ref_site_pollution` comme référentiel spatial canonique.
- Charger les couches `infra.*` existantes comme sources prioritaires de sites stables.
- Charger IDP comme `staging.raw_idp_*`, puis consolider par distance, nom, commune et type.
- Ne pas remplacer `metadata.referentiel_parametre` : les résultats qualité IDP doivent utiliser `metadata.mapping_parametre_source -> metadata.referentiel_parametre`.
- Mettre les conflits dans `qa.v_spatial_site_candidates` / tables d'arbitrage avant tout chargement métier.
