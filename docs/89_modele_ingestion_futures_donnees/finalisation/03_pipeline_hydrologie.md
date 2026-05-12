# Pipeline hydrologie

## Entrees

- debits journaliers/mensuels ;
- barrage journalier ;
- niveaux, volumes, apports, lachers, transferts.

## Regles barrage

| Parametre | Nature | Unite |
|---|---|---|
| `DEBIT` | debit instantane | m3/s |
| `LACHER` | volume journalier | Mm3/j |
| `APPORT` | volume journalier entrant | Mm3/j |
| `TRANSFERT` | volume journalier transfere | Mm3/j |
| `VOLUME` | stockage | Mm3 |
| `NIVEAU_EAU` | niveau | m |

## Interdits

- ne pas exposer `lacher_m3s` comme metier ;
- ne pas convertir volume journalier en debit sans regle hydraulique validee ;
- ne pas fusionner `APPORT` et `TRANSFERT` ;
- ne pas utiliser `hm3` comme code parametre.

## Publication

Le barrage doit publier dans `hydro.mesure_barrage_param`.
