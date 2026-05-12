# Perimetre migre

## Tables metier migrees

| Domaine | Objets |
|---|---|
| Hydro | `hydro.mesure_debit`, `hydro.mesure_debit_mensuel`, `hydro.mesure_debit_source`, `hydro.mesure_barrage_param`, `hydro.barrage_bathymetrie` |
| Meteo | `meteo.mesure_precipitation`, `meteo.mesure_precipitation_annuelle_max`, `meteo.mesure_evaporation` |
| Qualite | `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_barrage`, `qualite.mesure_qualite_sebou`, `qualite.suivi_qualite_barrage_garde_hebdo` |
| Pollution / IDP | `qualite.source_pollution_prelevement`, `qualite.source_pollution_mesure_param`, `qualite.source_pollution_prelevement_lien` |
| Metadata | referentiels, mappings, catalogues API |
| Exposition | vues `api.*` et MV `analytics.*` |

## Barrage

Le modele officiel est `hydro.mesure_barrage_param`.

| Parametre | Unite |
|---|---|
| `NIVEAU_EAU` | `m` |
| `VOLUME` | `Mm3` |
| `LACHER` | `Mm3/j` |
| `APPORT` | `Mm3/j` |
| `TRANSFERT` | `Mm3/j` |

## Hors perimetre definitif client

SWAT/WASP actuellement en base ne sont pas le referentiel final de modelisation client.

