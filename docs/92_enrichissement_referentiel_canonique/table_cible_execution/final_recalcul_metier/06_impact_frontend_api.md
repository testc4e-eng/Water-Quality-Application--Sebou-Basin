# Impact frontend / API

| Ecran | Vue/API | Parametres principaux | Usage |
|---|---|---|---|
| Observatoire meteo | `api.v_meteo_temperature`, `/api/meteo/temperature` | `TEMP_MAX`, `TEMP_MIN`, `TEMP_MOY`, futur `T_AIR` meteo si cree comme serie meteo | Courbes et cartes temperature |
| Observatoire meteo | `api.v_meteo_precipitation`, `/api/meteo/precipitation` | `PRECIP` | Pluviometrie |
| Observatoire meteo | `api.v_meteo_evaporation`, `/api/meteo/evaporation` | `EVAPO` | Evaporation avec source gap accepte |
| Hydrologie / barrages | `api.v_barrage_parametres`, `/api/hydro/barrages/parametres` | `NIVEAU_EAU` | Niveau barrage parametrique |
| Hydrologie / barrages | `api.v_barrage_qualite`, `/api/hydro/barrages/qualite` | `DISQUE_SECCHI` barrage | Transparence barrage / lac |
| Qualite terrain | `api.v_qualite_terrain`, `/api/qualite/terrain` | `T_AIR`, `T_EAU`, `DISQUE_SECCHI` riviere | Mesures terrain et contexte campagne |
| Physico-chimie | `api.v_qualite_physicochimie`, `/api/qualite/physicochimie` | `PH`, `EH` | Etat in situ analytique |
| Chimie minerale | `api.v_qualite_chimie_minerale`, `/api/qualite/chimie-minerale` | `CA`, `MG`, `NA`, `K`, `CL`, `SO4`, `CO3`, `HCT`, `TA`, `TAC`, `TH`, `S`, `S2`, `OH` | Mineralisation, ions, alcalinite |
| Metaux | `api.v_qualite_metaux`, `/api/qualite/metaux` | `AG`, `AL`, `AS`, `BA`, `BE`, `CD`, `CO`, `CU`, `FE`, `FE2`, `FET`, `LI`, `MN`, `Mo`, `NI`, `PB`, `SB`, `SE`, `SN`, `SR`, `TL`, `V`, `ZN` | Contamination metallique |
| Nutriments | `api.v_qualite_nutriments`, `/api/qualite/nutriments` | Hors lot courant des 65 si deja affectes | Eutrophisation |
| Microbiologie | `api.v_qualite_microbiologie`, `/api/qualite/microbiologie` | `CF`, `CT`, `SF` | Bacteriologie |
| Biologique | `api.v_qualite_biologique`, `/api/qualite/biologique` | `CHLA`, `PHEOPIGMENT`, `IBD`, `IBGN` | Indices biologiques et biomasse |
| Organoleptique | `api.v_qualite_organoleptique`, `/api/qualite/organoleptique` | `COULEUR` | Consultation detail, hors analytics |
| Contexte station | `api.v_qualite_contexte_station`, `/api/qualite/contexte-station` | `LARGEUR`, `PROFONDEUR` | Fiche station/campagne, hydromorphologie |
| Pollution / IDP | `api.v_pollution_sources`, `api.v_pollution_constat_prealable`, `api.v_pollution_analyses_finales`, `api.v_idp_points` | Hors lot courant des 65 | IDP, sources, constats, analyses finales |
| Admin ingestion | vues QA/quarantaine futures | `FM`, `F_M_MES`, valeurs non resolues | Quarantaine et arbitrage client |

## Points frontend critiques

- Ne pas utiliser `api.v_qualite_dashboard_global` comme unique source.
- Les ecrans doivent consommer les vues specialisees puis composer leurs tableaux/cartes.
- `COULEUR` ne doit pas entrer dans moyennes, scores ou comparaisons quantitatives.
- `LARGEUR` et `PROFONDEUR` doivent apparaitre en contexte station, pas en parametre analytique qualite.
- `FM` et `F_M_MES` doivent rester invisibles hors admin/quarantaine.
