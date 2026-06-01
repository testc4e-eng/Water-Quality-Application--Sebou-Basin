# Specification API frontend - table_cible

| Endpoint | Vue source | Usage | Parametres query | Pagination | Cache | Priorite |
|---|---|---|---|---|---|---|
| `GET /api/qualite/dashboard` | `api.v_qualite_dashboard` | Series qualite multi-supports | `support_type`, `support_id`, `code_parametre`, `date_from`, `date_to`, `qa_status`, `geo_status` | oui | 5 min | P1 |
| `GET /api/qualite/parametres` | `metadata.referentiel_parametre_canonique` | Catalogue filtres dashboard | `domaine`, `table_cible`, `statut`, `q` | non | 1 h | P1 |
| `GET /api/meteo/dashboard` | `api.v_meteo_dashboard` | Precipitation, evaporation, temperature | `support_id`, `code_parametre`, `date_from`, `date_to`, `qa_status` | oui | 15 min | P1 |
| `GET /api/hydro/barrages/parametres` | `api.v_barrage_dashboard` | Barrage parametrique | `barrage_id`, `code_parametre`, `scenario`, `date_from`, `date_to` | oui | 15 min | P1 |
| `GET /api/idp/points` | `api.v_idp_points` | Carte IDP progressive | `geo_status`, `bbox`, `source_table` | oui | 15 min | P2 |
| `GET /api/pollution/dashboard` | `api.v_pollution_dashboard` | Pollution et QA valeurs | `code_parametre`, `qa_status`, `support_id`, `date_from`, `date_to` | oui | 15 min | P2 |

## Regles de restitution

- `FM`, `F_M_MES`, `MD` exclus des APIs fiables tant que `CLIENT_REQUIRED`.
- `MO` et `Mo` restent distincts dans toutes les recherches et facettes.
- `qa_status` doit etre expose sans masquage.
- `geo_status` doit rester visible pour IDP et qualite nappe.
- aucune vue SWAT/WASP n'est incluse dans l'affectation des `65 table_cible`; ces vues restent dans la strategie modeling separee.
