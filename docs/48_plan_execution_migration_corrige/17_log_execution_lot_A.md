# Log d'exécution Lot A

## Synthèse

| Lot | Action | Résultat | Statut |
|---|---|---|---|
| A1 | Backup complet + exports staging | dump OK, 35 exports CSV, delta SQL/CSV 0 | VALIDÉ PUIS EXÉCUTÉ |
| A2.1 | Vidage staging | 35 tables, 2249330 lignes supprimées de staging, total après 0 | OK |
| A2.2 | Import raw source métier | 46 tables, 2175895 lignes raw | OK |
| A2.3 | Contrôle source/raw | delta total 0 | OK |
| STOP | Arrêt avant autres lots | B/C/D/E non exécutés | STOP |
