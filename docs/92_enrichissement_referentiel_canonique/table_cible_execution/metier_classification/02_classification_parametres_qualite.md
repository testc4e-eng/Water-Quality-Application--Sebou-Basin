# Classification des parametres qualite

| Parametre | Libelle metier | Domaine | Sous-domaine | Unite | Table(s) source | Type mesure | Vue cible | API cible | Front cible | Statut |
|---|---|---|---|---|---|---|---|---|---|---|
| `PH` | Potentiel hydrogene | `QUALITE_EAU` | physico-chimie | sans unite | qualite multi-support | historiques + suivis | `api.v_qualite_physicochimie` | `/api/qualite/physicochimie` | Qualite globale / station | `PRODUCTION_READY` |
| `EH` | Potentiel redox | `QUALITE_EAU` | physico-chimie | mV | riviere, nappe | historiques | `api.v_qualite_physicochimie` | `/api/qualite/physicochimie` | Qualite globale | `PRODUCTION_READY` |
| `T_EAU` | Temperature eau | `QUALITE_EAU` | terrain | °C | qualite multi-support | historiques + suivis | `api.v_qualite_terrain` | `/api/qualite/terrain` | Qualite station | `A_VALIDER_VISION_METIER` |
| `T_AIR` | Temperature air | `QUALITE_EAU` | terrain | °C | qualite multi-support | historiques + suivis | `api.v_qualite_terrain` | `/api/qualite/terrain` | Qualite station | `A_VALIDER_VISION_METIER` |
| `CA`,`MG`,`NA`,`K`,`CL`,`SO4`,`HCT`,`CO3` | Ions majeurs | `QUALITE_EAU` | chimie minerale | mg/L | riviere, nappe, garde selon code | historiques + garde | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY` |
| `NO3`,`NO2`,`NH4`,`NTK`,`PT`,`PO4` | Nutriments | `QUALITE_EAU` | nutriments | mg/L | qualite multi-support | historiques + suivis | `api.v_qualite_nutriments` | `/api/qualite/nutriments` | Nutriments | `PRODUCTION_READY` |
| `FE`,`MN`,`Mo`,`PB`,`ZN`,`CU`,`CD`,`NI`,`AG`,`AL`,`AS`,`BA`,`BE`,`CO`,`LI`,`SB`,`SE`,`SN`,`SR`,`TL`,`V`,`FE2`,`FET` | Metaux et elements traces | `QUALITE_EAU` | metaux | mg/L | qualite multi-support / futur | historiques + suivis | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY_OU_REFERENTIEL_FUTUR` |
| `DCO`,`DETERGENT`,`MES`,`MO`,`PHENOL` | Pollution organique | `QUALITE_EAU` | pollution organique | mg/L | qualite multi-support | historiques + suivis | `api.v_qualite_pollution_organique` | `/api/qualite/pollution-organique` | Pollution organique | `PRODUCTION_READY` |
| `CT`,`CF`,`SF` | Microbiologie | `QUALITE_EAU` | microbiologie | UFC/100 mL | riviere, nappe, garde | historiques + garde | `api.v_qualite_microbiologie` | `/api/qualite/microbiologie` | Microbiologie | `PRODUCTION_READY` |
| `IBD`,`IBGN` | Indices biologiques | `QUALITE_EAU` | biologique / indices | indice /20 | riviere | historique riviere | `api.v_qualite_biologique` | `/api/qualite/biologique` | Biologique | `PRODUCTION_READY` |
| `CHLA`,`PHEOPIGMENT` | Biomasse algale | `QUALITE_EAU` | biologique / indices | µg/L | riviere, garde | historiques + garde | `api.v_qualite_biologique` | `/api/qualite/biologique` | Biologique | `PRODUCTION_READY` |
| `COULEUR` | Couleur de l'eau | `QUALITE_EAU` | organoleptique | qualitatif | riviere, nappe | historique | `api.v_qualite_organoleptique` | `/api/qualite/organoleptique` | Organoleptique | `A_VALIDER_RESTITUTION` |
| `DISQUE_SECCHI` | Transparence / Secchi | `QUALITE_EAU` | terrain | m | riviere, nappe, garde | historiques + barrage | `api.v_qualite_terrain` | `/api/qualite/terrain` | Terrain / barrage | `A_VALIDER_VISION_METIER` |
| `LARGEUR`,`PROFONDEUR` | Dimensions physiques | `QUALITE_EAU` | morphometrie | m | riviere, nappe | historiques | `api.v_qualite_terrain` | `/api/qualite/terrain` | Profil station | `A_VALIDER_VISION_METIER` |
| `S`,`S2` | Sulfures | `QUALITE_EAU` | chimie minerale / pollution specifique | mg/L | staging / faible usage + historique | gouverne | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Qualite specialisee | `VALIDATION_YASSINE_ACQUISE` |
| `FM`,`F_M_MES` | Code metier non resolu | `QUALITE_EAU` | non classe | a arbitrer | staging historique | non publie | aucune | aucune | aucun | `CLIENT_REQUIRED` |

## Regles de lecture

- `MO` = matieres organiques.
- `Mo` = molybdene.
- `MO` et `Mo` ne doivent jamais etre fusionnes.
- Les lignes ci-dessus couvrent les regroupements du backlog `table_cible`, pas l'inventaire exhaustif de tous les parametres qualite existants.
