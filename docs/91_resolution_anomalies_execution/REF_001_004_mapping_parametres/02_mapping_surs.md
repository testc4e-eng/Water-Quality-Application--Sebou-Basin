# Mappings sûrs

Definition : correspondance metier directe et un seul `parametre_ref_id` candidat dans le referentiel canonique actif. Ces mappings ne sont pas encore executes.

> Mise a jour : apres validation C4E, le volume sûr passe de 50619 a 62361 lignes, sous reserve d'executer d'abord l'enrichissement referentiel final.

| Table | Parametre source | Parametre canonique | parametre_ref_id | Volume | Type matching | Confiance |
|---|---|---|---|---:|---|---|
| `qualite.mesure_qualite_riviere` | `COND` | `CONDUCTIVITE` | `56405b90-6dce-4350-bc08-9392cb96f4d6` | 1992 | abreviation controlee | haute |
| `qualite.mesure_qualite_riviere` | `O2_DISSOUS` | `O2_DISS` | `c3b88b3a-ad2c-4ebc-93cb-cf39ff134244` | 1970 | abreviation controlee | haute |
| `qualite.mesure_qualite_riviere` | `NO3` | `NO3-` | `666ff9f4-dc95-4cd1-973c-9d4ef75918b4` | 1930 | ion sans charge | haute |
| `qualite.mesure_qualite_riviere` | `PO4` | `PO4_3-` | `5793f72d-65f1-4c35-a863-9903b1aa1b71` | 1892 | ion sans charge | haute |
| `qualite.mesure_qualite_riviere` | `HCO3` | `HCO3-` | `f868fca5-95fa-4e6a-a3fc-1ebc90db3f67` | 1801 | ion sans charge | haute |
| `qualite.mesure_qualite_riviere` | `NO2` | `NO2-` | `5344dd5c-5f54-41b9-b8b0-c5166cf409ef` | 1791 | ion sans charge | haute |
| `qualite.mesure_qualite_riviere` | `SATURATION_OXYGENE` | `SAT` | `3757aa6f-6fc0-4383-b9fd-459ef3bad218` | 1074 | libelle abrege | haute |
| `qualite.mesure_qualite_riviere` | `HG_MERCURE` | `HG` | `d46f1c59-8936-491d-8cb1-2da7fdae9eb6` | 227 | nom metal | haute |
| `qualite.mesure_qualite_nappe` | `COND` | `CONDUCTIVITE` | `56405b90-6dce-4350-bc08-9392cb96f4d6` | 2658 | abreviation controlee | haute |
| `qualite.mesure_qualite_nappe` | `HCO3` | `HCO3-` | `f868fca5-95fa-4e6a-a3fc-1ebc90db3f67` | 2636 | ion sans charge | haute |
| `qualite.mesure_qualite_nappe` | `NO3` | `NO3-` | `666ff9f4-dc95-4cd1-973c-9d4ef75918b4` | 2631 | ion sans charge | haute |
| `qualite.mesure_qualite_nappe` | `NO2` | `NO2-` | `5344dd5c-5f54-41b9-b8b0-c5166cf409ef` | 2609 | ion sans charge | haute |
| `qualite.mesure_qualite_nappe` | `O2_DISSOUS` | `O2_DISS` | `c3b88b3a-ad2c-4ebc-93cb-cf39ff134244` | 207 | abreviation controlee | haute |
| `qualite.mesure_qualite_nappe` | `PO4` | `PO4_3-` | `5793f72d-65f1-4c35-a863-9903b1aa1b71` | 40 | ion sans charge | haute |
| `qualite.mesure_qualite_nappe` | `SATURATION_OXYGENE` | `SAT` | `3757aa6f-6fc0-4383-b9fd-459ef3bad218` | 18 | libelle abrege | haute |
| `qualite.mesure_qualite_nappe` | `HG_MERCURE` | `HG` | `d46f1c59-8936-491d-8cb1-2da7fdae9eb6` | 3 | nom metal | haute |
| `qualite.mesure_qualite_sebou` | `Conductivité` | `CONDUCTIVITE` | `56405b90-6dce-4350-bc08-9392cb96f4d6` | 4553 | libelle accentue | haute |
| `qualite.mesure_qualite_sebou` | `O2_dissous` | `O2_DISS` | `c3b88b3a-ad2c-4ebc-93cb-cf39ff134244` | 4553 | libelle | haute |
| `qualite.mesure_qualite_sebou` | `Nitrates` | `NO3-` | `666ff9f4-dc95-4cd1-973c-9d4ef75918b4` | 4537 | libelle | haute |
| `qualite.mesure_qualite_sebou` | `H_G` | `HUILES_GRAISSES` | `e9673f14-771e-45f1-a39f-007c39468be6` | 4536 | abreviation huiles/graisses | haute |
| `qualite.mesure_qualite_sebou` | `Ammonium` | `NH4` | `4351fe58-8eee-4e46-af45-9b2df88ef2eb` | 4534 | libelle | haute |
| `qualite.mesure_qualite_sebou` | `Turbidité` | `TURBIDITE` | `656f03a0-9dba-49f8-86d8-722773298c53` | 4045 | libelle accentue | haute |
| `qualite.suivi_qualite_barrage_garde_hebdo` | `COND` | `CONDUCTIVITE` | `56405b90-6dce-4350-bc08-9392cb96f4d6` | 93 | abreviation controlee | haute |
| `qualite.suivi_qualite_barrage_garde_hebdo` | `O2_DISSOUS` | `O2_DISS` | `c3b88b3a-ad2c-4ebc-93cb-cf39ff134244` | 93 | abreviation controlee | haute |
| `qualite.suivi_qualite_barrage_garde_hebdo` | `PO4` | `PO4_3-` | `5793f72d-65f1-4c35-a863-9903b1aa1b71` | 93 | ion sans charge | haute |
| `qualite.suivi_qualite_barrage_garde_hebdo` | `NO3` | `NO3-` | `666ff9f4-dc95-4cd1-973c-9d4ef75918b4` | 92 | ion sans charge | haute |
| `qualite.suivi_qualite_barrage_garde_hebdo` | `HG_MERCURE` | `HG` | `d46f1c59-8936-491d-8cb1-2da7fdae9eb6` | 11 | nom metal | haute |

Volume sûr total : 50619 lignes.
