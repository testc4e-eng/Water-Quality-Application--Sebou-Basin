# Workflow ingestion client

## Etapes

1. reception fichier
2. creation `batch_id`
3. stockage metadata fichier
4. parsing vers staging
5. controle structure colonnes
6. mapping parametres
7. mapping GEO
8. controle valeurs et unites
9. simulation chargement
10. validation humaine si anomalies
11. insertion cible
12. audit et publication

## Donnees client couvertes

| Type | Controles specifiques |
|---|---|
| qualite | parametre, unite, norme, station, date, valeur |
| IDP / pollution | point prelevement, geom, commune, debit, valeur non numerique |
| hydro/meteo | station/barrage, temps, unite, doublons metier |

## Exclusions

Toute ligne exclue doit conserver :

- raison exclusion
- donnees source minimales
- hash source
- suggestion correction si possible

