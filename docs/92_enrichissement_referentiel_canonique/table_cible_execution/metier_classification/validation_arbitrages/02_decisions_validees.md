# Decisions validees

| Parametre | Decision | Domaine final | Sous-domaine final | Vue/API | Regle |
|---|---|---|---|---|---|
| `T_AIR` | `DOUBLE_CLASSIFICATION` | `QUALITE_EAU` si source qualite ; `METEO` si pipeline meteo | `terrain` si qualite ; `temperature` si meteo | `api.v_qualite_terrain` / `/api/qualite/terrain` et future `api.v_meteo_temperature` / `/api/meteo/temperature` | Ne pas fusionner campagnes qualite et series meteo stationnelles |
| `T_EAU` | `QUALITE_EAU / terrain` | `QUALITE_EAU` | `terrain` | `api.v_qualite_terrain` / `/api/qualite/terrain` | Temperature d'eau associee au prelevement qualite ; afficher avec QA sur valeurs hors plage |
| `LARGEUR` | `HYDROMORPHOLOGIE / contexte station` | `HYDROMORPHOLOGIE` | `contexte station` | Future `api.v_qualite_contexte_station` ou `api.v_hydromorphologie_contexte` | Parametre contextuel, consultation fiche station/campagne, hors dashboard analytique qualite |
| `PROFONDEUR` | `HYDROMORPHOLOGIE / contexte station` | `HYDROMORPHOLOGIE` | `contexte station` | Future `api.v_qualite_contexte_station` ou `api.v_hydromorphologie_contexte` | Parametre contextuel, consultation fiche station/campagne, hors dashboard analytique qualite |
| `DISQUE_SECCHI` | `DOUBLE_CLASSIFICATION selon support` | `QUALITE_BARRAGE` si support barrage ; `QUALITE_EAU` si riviere | `transparence` | `api.v_barrage_qualite` et `api.v_qualite_terrain` | Transparence exposee selon support ; ligne nappe a traiter en QA/legacy review |
| `COULEUR` | `QUALITE_EAU / organoleptique` + `CONSULTATION_ONLY` | `QUALITE_EAU` | `organoleptique` | `api.v_qualite_organoleptique` / `/api/qualite/organoleptique` | Exclure des analytics ; afficher uniquement en detail station/campagne |
| `FM` | `CLIENT_REQUIRED + HORS_RESTITUTION` | `QUALITE_EAU` | `non_classe` | aucune | Ne pas exposer ; conserver en gouvernance client si reapparition en staging |
| `F_M_MES` | `CLIENT_REQUIRED + HORS_RESTITUTION` | `QUALITE_EAU` | `non_classe` | aucune | Ne pas exposer ; conserver en gouvernance client si reapparition en staging |
