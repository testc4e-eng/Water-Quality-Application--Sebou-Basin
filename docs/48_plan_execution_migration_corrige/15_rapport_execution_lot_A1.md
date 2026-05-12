# Rapport d'exécution Lot A1 — backup et exports staging

## Statut
Lot A1 exécuté uniquement. A2 reste bloqué en attente de validation humaine.

## Backup complet

| Élément | Valeur |
|---|---|
| Dump | `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\backup_abh_sad_20260429_150054.dump` |
| Taille | 114321193 octets (109.03 MB) |
| SHA256 | `9916F7B19A4370A665557102B6F5BCC111CA9B66D8499698A37D3435EAD4E9DF` |
| Vérification lisibilité | `pg_restore --list` OK (70329 lignes) |
| Liste restore | `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\pg_restore_list.txt` |

Note : `pg_dump` a émis des avertissements non bloquants sur des contraintes de clés étrangères circulaires liées aux objets Timescale/PostgreSQL (`hypertable`, `chunk`, `continuous_agg`). Le code retour est OK et le dump est lisible via `pg_restore --list`.

## Exports staging

| Élément | Valeur |
|---|---:|
| Tables exportées | 35 |
| Total COUNT SQL | 2249330 |
| Total lignes CSV | 2249330 |
| Delta total | 0 |
| Taille totale CSV | 111875758 octets |

## Détail tables

| Table | COUNT SQL | Lignes CSV | Delta | Taille octets | SHA256 | Statut |
|---|---:|---:|---:|---:|---|---|
| `staging._legacy_qualite_riviere` | 60097 | 60097 | 0 | 2078760 | `BCD4A25CB8A7C39D650BBA2FE32A637D42A5A301B0DFABCB01405741378F8439` | OK |
| `staging.decharges` | 139 | 139 | 0 | 38997 | `6C53D73EBE53DF366B22E04E204AC4A942AAA3CE36D942A339A33D6C8FF0CAC5` | OK |
| `staging.decharges_Abondonees` | 11 | 11 | 0 | 1423 | `C6D5098E882858B47A51C6FB2056FE4568D329795E14D520EDCD81F99E5DDAE6` | OK |
| `staging.huileries` | 606 | 606 | 0 | 459491 | `A70BCDC3BF931EFE46837A01D5F7D62F5D6E0F5F53F0502D92407B6BF1FF9FF6` | OK |
| `staging.mesure_precipitation_old_model` | 507930 | 507930 | 0 | 33685051 | `13CDD54C6CFD959256A3AAE83F11A94B31FB7F0CCAC6414211E73F177AB81B75` | OK |
| `staging.mesures_debit_jr` | 173251 | 173251 | 0 | 5448549 | `8D9808B5A2269BA997965CF376785ABB8FAB1403C3DE6E0D1C5233B3558D35D5` | OK |
| `staging.mesures_debit_m` | 19316 | 19316 | 0 | 691473 | `B47CB60003C86229E79CC8C7386BFE0C831C15DA4B7568126C41112D86BB9A55` | OK |
| `staging.mesures_debit_sources` | 2816 | 2816 | 0 | 100749 | `7554541E2B82823702CD8F9BD12DA153DCC749FCE82EFFA7D9F233A4F805DF46` | OK |
| `staging.mesures_evaporation_jr` | 48900 | 48900 | 0 | 1477851 | `E198F7B9A3CF540558B533C4CBEA4FD33893CEF1101F04C68488BE7385303BF5` | OK |
| `staging.mesures_niv_eau_barrages` | 85166 | 85166 | 0 | 4534538 | `23847CF3FA4D6FDDD8A1C18E941DE9DAAAAD8B27B5BBDD95A544DA2C77EFF454` | OK |
| `staging.mesures_precip` | 669880 | 669880 | 0 | 24146776 | `26A35A43B65B00A500F8D7B6CE9A8174DC9613C7FF73CAA39A2E69B49AB9E2DE` | OK |
| `staging.mesures_precipitations_jr_max` | 2085 | 2085 | 0 | 139584 | `1F4984B708903335ED1F7CBC1963B1BA7790A942E037295F9FD2F0BFB8E91BDE` | OK |
| `staging.mesures_precipitations_jr_traitees` | 546007 | 546007 | 0 | 22693215 | `0C17500C0F326BCB7A726D1CCFC189C9900B44FDD74413C73BDA07F8EA7F4CD6` | OK |
| `staging.mesures_qualite_barrages` | 8714 | 8714 | 0 | 369743 | `743B7B3641E13224F25F84BAF6A89696A00588C5FC7378E0DCE882D8921E2E31` | OK |
| `staging.mesures_qualite_nappes` | 63088 | 63088 | 0 | 2099979 | `1EA67A569B654A7F602F9BA1900C1D17971E51CBCC853884E1B3A0166903E8A8` | OK |
| `staging.mines` | 39 | 39 | 0 | 5931 | `B24B6E1F31D859E1D0B88F93ED4EFCC0C7C359CAF7C97BE4E2E90A1DDEDF4071` | OK |
| `staging.points_eau_abhs` | 46 | 46 | 0 | 7271 | `224CE92F475A346239625C335C955CBDE0C64820D6B8C0EF8DA7EE3B57223792` | OK |
| `staging.profils_stations` | 1980 | 1980 | 0 | 204566 | `D28501DD87C69AD5E475AA71C79AAFC0EBCE55AD7CEE0C138F1C9AA838B229E7` | OK |
| `staging.rejet_abattoir` | 56 | 56 | 0 | 6242 | `79F4014216B5AFEED9997E501D3DC6F97F9F398A8BF60634AAE7679B7C80DFD7` | OK |
| `staging.rejets_brutes` | 277 | 277 | 0 | 82734 | `573758BBB7F0CD97E7D13F72A891F819569DC81ED28323CFCB2E50BF22CEC3D7` | OK |
| `staging.sources_polution_mesure` | 141 | 141 | 0 | 83219 | `D26BCC64A3259B886804AF1F18E2650A8E7B6D9CC6A9788577D68D0DBF2DEAAC` | OK |
| `staging.sous_bassin_swat_bas_sebou_new` | 29 | 29 | 0 | 1422469 | `BB29CD6ECD1AA98EB11651CA1F5E470C8D3605A7B7AFA2DF5F8E6A0254CD0805` | OK |
| `staging.sous_bassin_swat_bassin_cotier_new` | 23 | 23 | 0 | 1020176 | `EEBF342B627A82C7E27CAAEF42CD4E23061C2E252872F6705B633F539FF84FA3` | OK |
| `staging.sous_bassin_swat_beht_new` | 27 | 27 | 0 | 3133526 | `4B22BD8E475243CF61C029B729CA814E061DD2F53554FAB88C9F6DE94E3418D3` | OK |
| `staging.sous_bassin_swat_haut_sebou_new` | 22 | 22 | 0 | 1473322 | `850504086EEFEA93B0C1DBB2D060D1FA3F4EEF55D0F0FA272432AEC02406F3CE` | OK |
| `staging.sous_bassin_swat_leben_innaouen_new` | 18 | 18 | 0 | 1363008 | `28302353BB9D98D706C41C4A8FC6EF1C732C40CC47055651FFD98B60159EE5C5` | OK |
| `staging.sous_bassin_swat_moyen_sebou_new` | 16 | 16 | 0 | 926748 | `B5DCD1DE2020D0339F3FA636FCEEBCBDFFBA75CEA055D572C816D02205B6A016` | OK |
| `staging.sous_bassin_swat_ouergha_new` | 39 | 39 | 0 | 1862849 | `0B391F26E76E966183C4C29E3F62AC60868065AFC05F994B3D56E9560B308BE8` | OK |
| `staging.step_ind_abhs` | 15 | 15 | 0 | 1729 | `77A755ECEF491554473C648155D1F0BC3DB9EFA1E5063B9DCB2251190EA04D9F` | OK |
| `staging.steps` | 49 | 49 | 0 | 12661 | `D7B407660FA41E3C395B082F13F083A0486D287406072D6530999D2ABC342A8A` | OK |
| `staging.steps_industrielles` | 14 | 14 | 0 | 2196 | `3A8DA67914616C9824998B38A736645D24A0E341DC63D077777E4B649C5FCBF0` | OK |
| `staging.stm_abhs` | 18 | 18 | 0 | 1878 | `E62914692D37AFAFBFBF59EB52CEC41477E3AA1FE8190D1C4F285D6A3910A439` | OK |
| `staging.stms` | 19 | 19 | 0 | 2556 | `898AF4503449CA99301C9DF03559F5DF1353AEF895957D5F054C794AE832610F` | OK |
| `staging.suivi_qualite_brg_garde_hebdo` | 7094 | 7094 | 0 | 294320 | `2C579873A2317595D63E75F0E9FA3970E2187A4954F81D146FF6638C2AE98C13` | OK |
| `staging.suivi_qualite_sebou` | 51402 | 51402 | 0 | 2002178 | `59C242F1B74D4844A6BDA02BCCD548FA789483FD4114FB2E2022FCE6B2792C7F` | OK |

## Garde-fous respectés

- Aucun `TRUNCATE` exécuté.
- Aucun `DELETE` exécuté.
- Aucun `DROP` exécuté.
- Aucun `INSERT` exécuté.
- Aucun import vers `staging.raw_*` exécuté.
- Arrêt obligatoire avant A2.
