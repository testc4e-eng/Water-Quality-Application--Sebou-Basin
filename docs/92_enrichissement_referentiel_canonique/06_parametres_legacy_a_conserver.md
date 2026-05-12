# Parametres legacy a conserver

## Regle

Ne jamais supprimer les anciens codes. Les conserver comme alias, avec type `legacy`, `historique`, `laboratoire` ou `dashboard`.

| Code legacy | Canonique cible | Raison conservation |
|---|---|---|
| `COND` | `CONDUCTIVITE` | historique laboratoire |
| `O2_DISSOUS` | `O2_DISS` | historique qualite |
| `O2_dissous` | `O2_DISS` | variante Sebou |
| `NO3` | `NO3-` | notation sans charge |
| `Nitrates` | `NO3-` | libelle Sebou |
| `NO2` | `NO2-` | notation sans charge |
| `PO4` | `PO4_3-` | notation sans charge |
| `HCO3` | `HCO3-` | notation sans charge |
| `HG_MERCURE` | `HG` | historique laboratoire |
| `H_G` | `HUILES_GRAISSES` | abbreviation Sebou |
| `RESIDUS_SECS` | `RS105` | variante metier |
| `DBO5_DEC2H` | `DBO5` | variante analytique |
| `APPORTS_HM3` | `APPORT` | legacy barrage |
| `RESTITUTION` | `LACHER` | legacy barrage |
| `lacher_m3s` | aucun canonique actif | legacy technique rejete |

## Compatibilite ingestion

Ces alias doivent etre utilises par le futur module d'ingestion pour normaliser les fichiers historiques sans perdre la trace source.

