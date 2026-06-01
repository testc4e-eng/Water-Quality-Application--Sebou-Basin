# Impact vues / API

## `T_AIR` - decision validee

| Axe | Impact propose |
|---|---|
| Vue qualite | Exposer les mesures `T_AIR` issues des tables qualite dans `api.v_qualite_terrain` |
| Vue meteo | Reserver `api.v_meteo_temperature` aux series meteo issues du pipeline temperature |
| API | Maintenir `/api/qualite/terrain` pour le contexte station/prelevement, et `/api/meteo/temperature` pour les series climatologiques |
| Frontend | Afficher `T_AIR` qualite sur les fiches station / campagnes qualite ; afficher les futures temperatures meteo dans l'observatoire meteo |
| Ingestion | Router selon table/source : qualite terrain vers qualite, fichier temperature meteo vers meteo |

Decision Yassine : `VALIDER DOUBLE_CLASSIFICATION`.

Regle finale :

- `T_AIR` issu des tables qualite reste expose dans `api.v_qualite_terrain`.
- Les futures temperatures air issues du pipeline meteo seront exposees dans `api.v_meteo_temperature`.
- Les deux familles ne doivent pas etre fusionnees automatiquement.

## `DISQUE_SECCHI` - decision validee

Decision Yassine : `VALIDER DOUBLE_CLASSIFICATION selon support`.

Regle finale :

- Support barrage / garde hebdo barrage : exposer comme `QUALITE_BARRAGE / transparence`.
- Support riviere : exposer comme `QUALITE_EAU / transparence`.
- Support nappe : conserver en QA/legacy review, sans promotion analytique par defaut.
- Les vues/API doivent filtrer par support pour eviter de melanger transparence lacustre et contexte riviere.

## `COULEUR` - decision validee

Decision Yassine : `QUALITE_EAU / organoleptique` avec restitution `CONSULTATION_ONLY` et exclusion des analytics.

Regle finale :

- Exposer dans `api.v_qualite_organoleptique`.
- Afficher uniquement en fiche station / detail campagne.
- Ne pas inclure dans les graphiques analytiques, scores, moyennes ou comparaisons quantitatives.
- Conserver les valeurs historiques numeriques comme information brute/contextuelle.

## `FM` - decision validee

Decision Yassine : `CLIENT_REQUIRED + HORS_RESTITUTION`.

Regle finale :

- Aucune vue cible.
- Aucune API cible.
- Aucun affichage frontend.
- Si le code reapparait en ingestion, le router en quarantaine/staging jusqu'a arbitrage client.

## `F_M_MES` - decision validee

Decision Yassine : `CLIENT_REQUIRED + HORS_RESTITUTION`.

Regle finale :

- Aucune vue cible.
- Aucune API cible.
- Aucun affichage frontend.
- Ne pas assimiler automatiquement a `FM`, `MES`, fluorures ou un autre parametre.
- Si le code reapparait en ingestion, le router en quarantaine/staging jusqu'a arbitrage client.
