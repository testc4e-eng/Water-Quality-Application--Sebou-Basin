# Checklist GO create views

| Controle | Statut |
|---|---|
| SQL compile en transaction | `OK` |
| `ROLLBACK` teste | `OK` |
| Counts coherents | `OK` |
| Colonnes communes OK | `OK` |
| `FM` exclu | `OK` |
| `F_M_MES` exclu | `OK` |
| `MO` et `Mo` preserves | `OK_APRES_CORRECTION` |
| `COULEUR` seulement organoleptique | `OK` |
| `T_AIR` qualite dans terrain | `OK` |
| Temperature meteo separee | `OK` |
| `DISQUE_SECCHI` barrage dans barrage qualite | `OK` |
| `DISQUE_SECCHI` riviere dans terrain | `OK` |
| Performance V1 acceptable | `OK_SOUS_FILTRES_API` |
| Vues dependantes ordonnees | `OK` |
| SQL final corrige produit | `OK` |
| Validation humaine pour creation durable | `REQUIS` |

## Condition d'execution

Le `CREATE VIEW` durable peut etre envisage uniquement apres validation explicite. L'execution doit rester separee de l'`UPDATE table_cible`.
