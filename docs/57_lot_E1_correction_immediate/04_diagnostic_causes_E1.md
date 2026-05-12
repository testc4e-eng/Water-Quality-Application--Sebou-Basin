# Diagnostic causes E1

## 1. Pourquoi `qualite.mesure_qualite_sebou` a doublonne

- l'insertion E1 a utilise `ON CONFLICT DO NOTHING` sur la cle physique `(temps, station_id, parametre_qualite, source_row_id)`
- les lignes historiques deja presentes avaient une autre valeur de `source_row_id`
- la duplication metier sur `(temps, station_id, parametre_qualite)` n'etait donc pas bloquante pour PostgreSQL
- resultat : `49954` nouvelles lignes chargees et `42052` doublons naturels

## 2. Pourquoi le rollback a sur-supprime

- le rollback s'appuyait uniquement sur `ctid`
- pour `qualite.mesure_qualite_sebou`, l'audit contient `49954` lignes mais seulement `1089` `ctid` distincts
- `ctid` n'est pas une cle de rollback fiable ici ; il faut au minimum `tableoid + ctid`, et idealement une cle metier ou un `batch_id`

## 3. Pourquoi plusieurs branches ont insere `0` malgre candidats

- certaines branches etaient deja quasiment chargees dans les tables finales
- d'autres branches utilisaient un couplage incorrect entre `qa_dry_run.e0_mesures_preparees.source_row_id` et la cle metier source
- sur plusieurs tables `E0`, `source_row_id` contient un `ctid` source au lieu d'un identifiant stable

## 4. Tables `E0` ou `source_row_id` utilise `ctid`

- `raw_mesures_debit_jr` : `515978` lignes `ctid-like` sur `515978`
- `raw_mesures_debit_m` : `18993` lignes `ctid-like` sur `18993`
- `raw_mesures_precipitations_jr` : `507930` lignes `ctid-like` sur `507930`

## 5. Alternative de cle stable recommandee

Utiliser une cle de reprise et de rollback de forme :

`source_table + source_row_hash + geo_ref + source_date + code_parametre_canonique + valeur_preparee`

Recommandation minimale :

- `source_row_hash = md5(concat_ws('|', source_table, source_primary_key_ou_ctid_source, source_date, valeur_brute, source_column_valeur))`
- pour rollback physique : stocker aussi `tableoid` si un rollback par tuple est encore necessaire
- pour anti-doublon metier : tester l'existence sur la cle metier cible avant insertion

## 6. Insertions auditees E1

- `hydro.mesure_debit_source` : `1162` lignes auditees
- `qualite.mesure_qualite_sebou` : `49954` lignes auditees
