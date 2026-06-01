# Rapport final arbitrages

Rapport a finaliser apres validation des 8 cas.

## Etat courant

| Cas | Statut |
|---|---|
| `T_AIR` | `VALIDE_YASSINE` - `DOUBLE_CLASSIFICATION` |
| `T_EAU` | `VALIDE_YASSINE` - `QUALITE_EAU / terrain` |
| `LARGEUR` | `VALIDE_YASSINE` - `HYDROMORPHOLOGIE / contexte station` |
| `PROFONDEUR` | `VALIDE_YASSINE` - `HYDROMORPHOLOGIE / contexte station` |
| `DISQUE_SECCHI` | `VALIDE_YASSINE` - `DOUBLE_CLASSIFICATION selon support` |
| `COULEUR` | `VALIDE_YASSINE` - `QUALITE_EAU / organoleptique`, `CONSULTATION_ONLY`, exclusion analytics |
| `FM` | `VALIDE_YASSINE` - `CLIENT_REQUIRED + HORS_RESTITUTION` |
| `F_M_MES` | `VALIDE_YASSINE` - `CLIENT_REQUIRED + HORS_RESTITUTION` |

## Synthese decisions

| Classe | Parametres |
|---|---|
| Double classification | `T_AIR`, `DISQUE_SECCHI` |
| Qualite terrain | `T_EAU` |
| Hydromorphologie / contexte station | `LARGEUR`, `PROFONDEUR` |
| Organoleptique consultation only | `COULEUR` |
| Client required hors restitution | `FM`, `F_M_MES` |

## Vues metier finales impactees

| Vue | Role | Parametres concernes |
|---|---|---|
| `api.v_qualite_terrain` | Mesures terrain qualite | `T_AIR` qualite, `T_EAU`, `DISQUE_SECCHI` riviere |
| `api.v_meteo_temperature` | Temperature meteo future | `T_AIR` issu du futur pipeline meteo |
| `api.v_qualite_contexte_station` | Contexte station / hydromorphologie | `LARGEUR`, `PROFONDEUR` |
| `api.v_barrage_qualite` | Qualite barrage / transparence | `DISQUE_SECCHI` barrage |
| `api.v_qualite_organoleptique` | Parametres organoleptiques | `COULEUR` |

## APIs finales impactees

| API | Usage |
|---|---|
| `/api/qualite/terrain` | Mesures terrain qualite |
| `/api/meteo/temperature` | Series temperature meteo futures |
| `/api/qualite/contexte-station` | Consultation contexte station |
| `/api/hydro/barrages/qualite` | Qualite barrage / transparence |
| `/api/qualite/organoleptique` | Consultation organoleptique |

## Parametres exclus / consultation only / client

| Statut | Parametres |
|---|---|
| `CONSULTATION_ONLY` | `LARGEUR`, `PROFONDEUR`, `COULEUR` |
| `EXCLUDE_ANALYTICS` | `COULEUR`, `FM`, `F_M_MES` |
| `CLIENT_REQUIRED` | `FM`, `F_M_MES` |
| `HORS_RESTITUTION` | `FM`, `F_M_MES` |

## Recommandation

- `GO` pour figer la classification documentaire et preparer le recalcul `table_cible`.
- `HOLD` pour execution SQL tant que les vues physiques/API ne sont pas validees techniquement.
- Ne pas exposer `FM` et `F_M_MES`.
