# Controles QA

## Controles obligatoires

| Controle | Niveau |
|---|---|
| fichier deja ingere par hash | bloquant |
| date absente | bloquant |
| support GEO absent | bloquant ou quarantaine |
| parametre inconnu | quarantaine |
| unite incoherente | bloquant |
| valeur non numerique attendue | quarantaine/warning selon parametre |
| doublon cle metier | bloquant |
| FK orpheline | bloquant |
| geometrie invalide | bloquant |

## Controles metier

- `LACHER`, `APPORT`, `TRANSFERT` jamais en `m3/s` ;
- `MO` et `Mo` jamais normalises par casse ;
- `-` pollution jamais converti en zero ;
- evaporation null jamais interpolee automatiquement.

## Sortie QA

Chaque batch produit :

- volume brut ;
- volume publie ;
- volume quarantaine ;
- volume warning ;
- anomalies client ;
- anomalies C4E ;
- rollback possible.
