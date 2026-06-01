# Changements vs ancienne proposition

## Synthese

L'ancienne proposition regroupait les parametres qualite dans `api.v_qualite_dashboard`. La nouvelle proposition remplace cette logique par des vues specialisees.

| Parametre | Ancienne affectation | Nouvelle affectation | Raison |
|---|---|---|---|
| `T_AIR` | `api.v_qualite_dashboard` | `api.v_qualite_terrain` + future `api.v_meteo_temperature` selon source | Decision Yassine : double classification ; ne pas melanger campagne qualite et serie meteo |
| `T_EAU` | `api.v_qualite_dashboard` | `api.v_qualite_terrain` | Decision Yassine : mesure terrain qualite |
| `LARGEUR` | `api.v_qualite_dashboard` | `api.v_qualite_contexte_station` | Decision Yassine : hydromorphologie / contexte station, hors analytics qualite |
| `PROFONDEUR` | `api.v_qualite_dashboard` | `api.v_qualite_contexte_station` | Decision Yassine : hydromorphologie / contexte station, hors analytics qualite |
| `DISQUE_SECCHI` | `api.v_qualite_dashboard` | `api.v_barrage_qualite` + `api.v_qualite_terrain` selon support | Decision Yassine : double classification support ; usage majoritaire barrage |
| `COULEUR` | `api.v_qualite_dashboard` | `api.v_qualite_organoleptique` | Decision Yassine : organoleptique, consultation only, exclu analytics |
| `FM` | aucune / client required | aucune | Client required + hors restitution confirme |
| `F_M_MES` | aucune / client required | aucune | Client required + hors restitution confirme |
| `NIVEAU_EAU` | `api.v_barrage_dashboard` | `api.v_barrage_parametres` | Aligne sur modele barrage parametrique |
| `EVAPO` | `api.v_meteo_dashboard` | `api.v_meteo_evaporation` | Vue specialisee ; dashboard meteo devient agregateur |
| `PRECIP` | `api.v_meteo_dashboard` | `api.v_meteo_precipitation` | Vue specialisee ; dashboard meteo devient agregateur |
| `TEMP_MAX`, `TEMP_MIN`, `TEMP_MOY` | `api.v_meteo_dashboard` | `api.v_meteo_temperature` | Pipeline temperature dedie |
| Metaux | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | Famille analytique distincte |
| Chimie minerale | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | Ions majeurs / alcalinite / durete separes |
| Pollution organique | `api.v_qualite_dashboard` | `api.v_qualite_pollution_organique` | Charge organique separee des metaux et nutriments |
| Microbiologie | `api.v_qualite_dashboard` | `api.v_qualite_microbiologie` | Unites et usage differents |
| Biologique / indices | `api.v_qualite_dashboard` | `api.v_qualite_biologique` | Indices et biomasse algale separes |

## Decision

- La vue `api.v_qualite_dashboard_global` reste utile comme agregateur frontend.
- Elle ne doit pas etre la `table_cible` primaire des parametres analytiques.
- Les endpoints frontend doivent consommer les vues specialisees puis composer les dashboards.
