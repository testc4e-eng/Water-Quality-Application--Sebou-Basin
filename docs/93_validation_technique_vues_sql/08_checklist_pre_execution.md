# Checklist pre-execution

## Avant `CREATE VIEW` reel

| Controle | Statut attendu |
|---|---|
| Validation metier des classifications | `OK` |
| Liste des vues a creer validee | `OK` |
| Colonnes communes harmonisees | `OK` |
| Schema `api` existe | `A_VERIFIER` |
| Extension PostGIS disponible | `A_VERIFIER` |
| SQL complet par vue, sans template partiel | `PROPOSE_A_RELIRE` |
| `FM` et `F_M_MES` exclus | `OK` |
| `COULEUR` consultation only | `OK` |
| `T_AIR` double classification documentee | `OK` |
| `DISQUE_SECCHI` double support documente | `OK` |
| Tests `SELECT count(*)` par vue prepares | `A_PREPARER` |
| Tests `EXPLAIN` par vue prepares | `A_PREPARER` |
| Rollback operationnel | `OK` |

## Avant `UPDATE table_cible`

| Controle | Statut attendu |
|---|---|
| Vues physiques creees et testees | `REQUIS` |
| Colonnes minimales disponibles dans chaque vue | `REQUIS` |
| API non encore necessaire mais contrats connus | `OK` |
| Backup referentiel pret | `OK` |
| SQL update relu | `OK` |
| Validation post-update prete | `OK` |
| Aucun changement unite/alias/statut | `REQUIS` |
| Aucun changement mesures | `REQUIS` |

## Tests minimum apres creation vues

```sql
SELECT count(*) FROM api.v_qualite_metaux;
EXPLAIN SELECT * FROM api.v_qualite_metaux WHERE code_parametre = 'FE' AND date_mesure >= now() - interval '5 years';
SELECT code_parametre, count(*) FROM api.v_qualite_metaux GROUP BY code_parametre ORDER BY code_parametre;
SELECT * FROM api.v_idp_points_non_resolus LIMIT 20;
```

## Decision checklist

La checklist n'autorise pas encore l'execution : les vues doivent etre relues, testees une par une, et la dependance `api.v_qualite_base_multi_support` doit etre acceptee.
