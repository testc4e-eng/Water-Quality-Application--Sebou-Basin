# Decisions a valider par Yassine

| Sujet | Proposition | Pourquoi validation requise |
|---|---|---|
| `T_AIR` | classer en `QUALITE_EAU / terrain` quand issu des tables qualite, `METEO` quand issu du pipeline temperature | eviter de fusionner mesure terrain et serie meteo |
| `T_EAU` | conserver en `QUALITE_EAU / terrain` | mesure terrain station, distincte du module meteo |
| `LARGEUR` / `PROFONDEUR` | sous-domaine `morphometrie`, exposition dans `qualite_terrain` ou future vue hydromorphologie | choix d'ecran frontend a stabiliser |
| `DISQUE_SECCHI` | classer `terrain / transparence`, avec possibilite de restitution barrage | depend de l'ergonomie barrage/qualite |
| `COULEUR` | garder `organoleptique` malgre des valeurs numeriques historiques | eviter de la traiter comme concentration |
| `FM` / `F_M_MES` | maintenir hors restitution | cas deja `CLIENT_REQUIRED` |
| IDP | creer une couche `geo.points_non_resolus_idp` | necessaire pour validation progressive |
| Pollution | separer constat prealable et analyses finales | objets metier differents |
