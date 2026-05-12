# Pipeline meteo

## Entrees

- precipitation ;
- evaporation ;
- temperature si fournie.

## Regles

| Donnee | Regle |
|---|---|
| precipitation | publier si station/date/valeur valides |
| evaporation | accepter null source comme lacune QA, pas interpolation |
| temperature | `DONNEE_NON_FOURNIE` tant que source brute vide |

## QA

- station obligatoire ;
- date obligatoire ;
- valeur numerique si mesure fournie ;
- null evaporation = warning, pas correction ;
- temperature absente = rapport client, pas table artificielle.
