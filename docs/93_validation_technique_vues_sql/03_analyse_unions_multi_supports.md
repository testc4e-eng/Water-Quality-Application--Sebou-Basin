# Analyse unions multi-supports

## Synthese

Les vues qualite specialisees reposent sur une union commune entre :

- `qualite.mesure_qualite_riviere`
- `qualite.mesure_qualite_nappe`
- `qualite.mesure_qualite_barrage`
- `qualite.mesure_qualite_sebou`
- `qualite.suivi_qualite_barrage_garde_hebdo`

Les tables ont des colonnes proches mais pas identiques : nappe a `nappe_id`, garde a `barrage_id`, Sebou a `observation`, barrage n'a pas `parametre_ref_id`.

## Analyse par vue

| Vue | UNION necessaire | Risque type | Risque QA | Support dominant | Recommendation |
|---|---|---|---|---|---|
| `api.v_qualite_metaux` | oui | faible, valeurs numeriques homogenes | valeurs extremes metaux | multi-support | union avec filtre `parametre_qualite IN (...)` dans chaque branche |
| `api.v_qualite_chimie_minerale` | oui | moyen, alcalinite en `meq/L`, ions en `mg/L` dans meme vue | extremes `TA/TAC/TH/CO3` | multi-support | garder `unite_reference`, ne pas agreger sans unite |
| `api.v_qualite_pollution_organique` | oui | moyen, `MO` sensible a la casse | outliers `DETERGENT`, `MES` | Sebou/riviere/nappe | filtre exact, ne pas confondre `MO` et `Mo` |
| `api.v_qualite_microbiologie` | oui | faible | outliers UFC | multi-support | vue dediee obligatoire, pas melange avec mg/L |
| `api.v_qualite_biologique` | oui | moyen, indices et µg/L | interpretation differente | surtout riviere | separer par `code_parametre` cote front |
| `api.v_qualite_terrain` | oui | moyen, double classification | extremes temperature/secchi | multi-support | exclure `FM/F_M_MES`, inclure `T_AIR`, `T_EAU`, `DISQUE_SECCHI` riviere |
| `api.v_qualite_contexte_station` | oui | faible | null/0 a interpreter | riviere | consultation only |
| `api.v_qualite_organoleptique` | oui | faible volumetrie | valeur numerique historique mais unite qualitative | multi-support faible | consultation only |
| `api.v_barrage_qualite` | oui limitee barrage/garde | moyen, `parametre_ref_id` absent/null | extremes Secchi | barrage | joindre referentiel par code, filtrer support barrage |

## Points critiques

- Les vues ne doivent pas faire une union globale puis filtrer ensuite si cela empeche l'optimiseur de pousser les predicates.
- Chaque branche de l'union doit filtrer les `parametre_qualite` concernes.
- `FM` et `F_M_MES` doivent etre exclus explicitement.
- `COULEUR` ne doit apparaitre que dans `api.v_qualite_organoleptique`.
- `DISQUE_SECCHI` doit etre expose cote barrage dans `api.v_barrage_qualite`, et cote riviere dans `api.v_qualite_terrain` si necessaire.

## Recommendation technique

Pour V1, creer des vues specialisees simples. Pour dashboards lourds, prevoir ensuite des materialized views par famille avec refresh controle, surtout pour meteo precipitation et qualite multi-supports.
