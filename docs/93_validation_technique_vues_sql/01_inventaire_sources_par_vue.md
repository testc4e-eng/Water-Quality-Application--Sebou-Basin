# Inventaire sources par vue

## Volumetrie source inspectee

| Table | Volume |
|---|---:|
| `meteo.mesure_temperature` | 0 |
| `meteo.mesure_precipitation` | 546007 |
| `meteo.mesure_evaporation` | 48900 |
| `hydro.mesure_barrage_param` | 272652 |
| `qualite.mesure_qualite_riviere` | 59534 |
| `qualite.mesure_qualite_nappe` | 63047 |
| `qualite.mesure_qualite_barrage` | 7820 |
| `qualite.mesure_qualite_sebou` | 49954 |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 1780 |
| `qualite.source_pollution_prelevement` | 141 |
| `qualite.source_pollution_mesure_param` | 7191 |

## Inventaire par vue

| Vue | Tables sources | Supports | Parametres | Volumetrie estimee | Type donnees | Risque |
|---|---|---|---|---:|---|---|
| `api.v_meteo_temperature` | `meteo.mesure_temperature` | station meteo | `TEMP_MIN`, `TEMP_MAX`, `TEMP_MOY` | 0 actuellement | serie meteo future | vue vide acceptable, pipeline a implementer |
| `api.v_meteo_precipitation` | `meteo.mesure_precipitation` | station meteo | `PRECIP` | 546007 | serie temporelle | volumetrie elevee, filtre temps requis |
| `api.v_meteo_evaporation` | `meteo.mesure_evaporation` | station meteo | `EVAPO` | 48900 | serie temporelle avec nulls source | valeurs nulles acceptees, QA explicite |
| `api.v_barrage_parametres` | `hydro.mesure_barrage_param` | barrage | `NIVEAU_EAU`, `VOLUME`, `LACHER`, `APPORT`, `TRANSFERT` | 272652 | parametrique barrage | deja indexe, attention filtre parametre/support |
| `api.v_barrage_qualite` | `qualite.mesure_qualite_barrage`, `qualite.suivi_qualite_barrage_garde_hebdo` | barrage | `DISQUE_SECCHI` prioritaire, autres qualite barrage possibles | 9600 max source | qualite barrage / transparence | `parametre_ref_id` absent/null dans sources, joindre par code |
| `api.v_qualite_physicochimie` | tables qualite multi-supports | riviere, nappe, barrage, Sebou, garde | `PH`, `EH` | ~182k filtrables | qualite analytique | union multi-support |
| `api.v_qualite_chimie_minerale` | tables qualite multi-supports | riviere, nappe, barrage, Sebou, garde | `CA`, `MG`, `NA`, `K`, `CL`, `SO4`, `CO3`, `HCT`, `OH`, `S`, `S2`, `TA`, `TAC`, `TH` | ~182k filtrables | qualite analytique | famille large, QA extremes |
| `api.v_qualite_metaux` | tables qualite multi-supports | riviere, nappe, barrage, Sebou, garde | metaux et elements traces, `Mo` distinct de `MO` | ~182k filtrables | qualite analytique | respecter casse `Mo` / `MO` |
| `api.v_qualite_pollution_organique` | tables qualite multi-supports | riviere, nappe, barrage, Sebou, garde | `DCO`, `DETERGENT`, `MES`, `MO`, `PHENOL` | ~182k filtrables | pollution organique qualite | ne pas confondre avec IDP |
| `api.v_qualite_microbiologie` | tables qualite multi-supports | riviere, nappe, barrage, garde | `CF`, `CT`, `SF` | ~182k filtrables | microbiologie | unites et outliers specifiques |
| `api.v_qualite_biologique` | tables qualite multi-supports | surtout riviere, garde | `CHLA`, `PHEOPIGMENT`, `IBD`, `IBGN` | ~182k filtrables | biologique / indices | indices et concentrations melanges dans meme vue |
| `api.v_qualite_terrain` | tables qualite multi-supports | riviere, nappe, barrage, Sebou, garde | `T_AIR`, `T_EAU`, `DISQUE_SECCHI` riviere | ~182k filtrables | terrain | double classification `T_AIR` et `DISQUE_SECCHI` |
| `api.v_qualite_contexte_station` | tables qualite multi-supports | station/campagne | `LARGEUR`, `PROFONDEUR` | faible | contexte station | consultation only, hors analytics |
| `api.v_qualite_organoleptique` | tables qualite multi-supports | multi-support | `COULEUR` | tres faible | organoleptique | consultation only, exclu analytics |
| `api.v_pollution_constat_prealable` | `qualite.source_pollution_prelevement` | point X/Y pollution | observations, nature, debit_raw | 141 | constat IDP | GEO parfois manquant |
| `api.v_pollution_analyses_finales` | `qualite.source_pollution_prelevement`, `qualite.source_pollution_mesure_param` | point pollution | mesures finales pollution | 7191 mesures | analyses IDP | non numeriques/nulls a conserver avec QA |
| `api.v_idp_points` | `qualite.source_pollution_prelevement`, liens futurs | point X/Y | points prelevement | 141 | couche point | mapping GEO progressif |
| `api.v_idp_points_non_resolus` | vue filtree depuis prelevement ou future `geo.points_non_resolus_idp` | point X/Y non resolu | points sans rattachement | a calculer | couche validation | table future non creee |

## Conclusion

Les vues sont techniquement faisables en lecture. Les vues qualite doivent etre filtrees par famille de parametres pour beneficier des index `(parametre_qualite, temps desc)`. Les vues globales doivent rester des agregateurs ou materialisations futures, pas des sources primaires non filtrees.
