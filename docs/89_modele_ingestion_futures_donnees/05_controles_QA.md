# Controles QA

## Controles obligatoires

| Controle | Domaine |
|---|---|
| schema fichier attendu | tous |
| nulls critiques | tous |
| doublons metier | tous |
| valeur numerique | mesures |
| valeur negative | hydro/meteo/qualite selon parametre |
| unite coherente | tous |
| parametre mappe | tous |
| GEO rattache | donnees spatiales |
| scenario valide | SWAT/WASP |
| hash source unique | tous |
| hash metier collision | tous |

## Statuts ligne

| Statut | Usage |
|---|---|
| `READY` | ligne chargeable |
| `EXCLUDED` | ligne rejetee |
| `BACKLOG` | ligne conservable mais a arbitrer |
| `CLIENT_REQUIRED` | information client requise |
| `DUPLICATE` | doublon detecte |
| `INVALID_UNIT` | unite incoherente |
| `INVALID_GEO` | GEO non rattache |

