# Journal validation arbitrages

| Parametre | Decision Yassine | Domaine final | Sous-domaine final | Vue cible | API cible | Front cible | Statut |
|---|---|---|---|---|---|---|---|
| `T_AIR` | `VALIDER DOUBLE_CLASSIFICATION` | `QUALITE_EAU` si source qualite ; `METEO` si pipeline meteo | `terrain` si qualite ; `temperature` si meteo | `api.v_qualite_terrain` et future `api.v_meteo_temperature` | `/api/qualite/terrain` et future `/api/meteo/temperature` | Qualite station / Observatoire meteo futur | `VALIDE_YASSINE` |
| `T_EAU` | `VALIDER QUALITE_EAU / terrain` | `QUALITE_EAU` | `terrain` | `api.v_qualite_terrain` | `/api/qualite/terrain` | Qualite station / suivi terrain | `VALIDE_YASSINE` |
| `LARGEUR` | `VALIDER HYDROMORPHOLOGIE / contexte station` | `HYDROMORPHOLOGIE` | `contexte station` | Future `api.v_qualite_contexte_station` ou `api.v_hydromorphologie_contexte` | `/api/qualite/contexte-station` | Fiche station / detail campagne | `VALIDE_YASSINE` |
| `PROFONDEUR` | `VALIDER HYDROMORPHOLOGIE / contexte station` | `HYDROMORPHOLOGIE` | `contexte station` | Future `api.v_qualite_contexte_station` ou `api.v_hydromorphologie_contexte` | `/api/qualite/contexte-station` | Fiche station / detail campagne | `VALIDE_YASSINE` |
| `DISQUE_SECCHI` | `VALIDER DOUBLE_CLASSIFICATION selon support` | `QUALITE_BARRAGE` si barrage ; `QUALITE_EAU` si riviere | `transparence` | `api.v_barrage_qualite` / `api.v_qualite_terrain` | `/api/hydro/barrages/qualite` / `/api/qualite/terrain` | Qualite barrage / fiche station | `VALIDE_YASSINE` |
| `COULEUR` | `VALIDER QUALITE_EAU / organoleptique avec restitution CONSULTATION_ONLY et exclusion des analytics` | `QUALITE_EAU` | `organoleptique` | `api.v_qualite_organoleptique` | `/api/qualite/organoleptique` | Fiche station / detail campagne | `VALIDE_YASSINE` |
| `FM` | `VALIDER CLIENT_REQUIRED + HORS_RESTITUTION` | `QUALITE_EAU` | `non_classe` | aucune | aucune | aucun | `CLIENT_REQUIRED_HORS_RESTITUTION` |
| `F_M_MES` | `VALIDER CLIENT_REQUIRED + HORS_RESTITUTION` | `QUALITE_EAU` | `non_classe` | aucune | aucune | aucun | `CLIENT_REQUIRED_HORS_RESTITUTION` |
