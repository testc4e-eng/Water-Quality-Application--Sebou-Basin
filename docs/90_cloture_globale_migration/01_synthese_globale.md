# Synthese globale

## Decision finale

`MIGRATION_HISTORIQUE_CLOTUREE_AVEC_BACKLOG`

La base consolidee `abh_sad` est exploitable pour les domaines client deja migres. Aucun blocage technique actif ne justifie de maintenir la migration historique ouverte.

## Volumetrie finale verifiee

| Domaine | Table | Volume | Statut |
|---|---|---:|---|
| Hydro | `hydro.mesure_barrage_param` | 272652 | `CLOTURE_C4E` |
| Hydro legacy | `hydro.mesure_barrage` | 84831 | `LEGACY_READ_ONLY` |
| Hydro | `hydro.mesure_debit` | 652446 | `MIGRE_AVEC_BACKLOG_QA` |
| Meteo | `meteo.mesure_precipitation` | 546007 | `MIGRE_OK` |
| Meteo | `meteo.mesure_evaporation` | 48900 | `MIGRE_AVEC_BACKLOG_QA` |
| Meteo | `meteo.mesure_temperature` | 0 | `DONNEE_NON_FOURNIE` |
| Qualite | `qualite.mesure_qualite_riviere` | 59534 | `CLOTURE_C4E` |
| Qualite | `qualite.mesure_qualite_nappe` | 63047 | `MIGRE_AVEC_LEGACY_IGNORE` |
| Qualite | `qualite.mesure_qualite_barrage` | 7820 | `MIGRE_OK` |
| Qualite | `qualite.mesure_qualite_sebou` | 49954 | `CLOTURE_C4E` |
| Qualite | `qualite.suivi_qualite_barrage_garde_hebdo` | 1780 | `CLOTURE_C4E` |
| Pollution | `qualite.source_pollution_prelevement` | 141 | `MIGRE_OK` |
| Pollution | `qualite.source_pollution_mesure_param` | 7191 | `MIGRE_AVEC_BACKLOG_QA` |
| Metadata | `metadata.referentiel_parametre_canonique` | 108 | `MIGRE_AVEC_BACKLOG` |
| Metadata | `metadata.referentiel_parametre` | 107 | `MIGRE_AVEC_BACKLOG` |

## Lecture strategique

La migration historique est terminee. Les restes ne sont pas des blocages de migration :

- les gaps referentiels restants sont de la gouvernance continue ;
- les lacunes meteo/pollution sont des lacunes source ou QA ;
- les sujets GEO/IDP demandent un retour client ;
- SWAT/WASP actuels sont des jeux temporaires a remplacer ;
- les schemas `public` et `staging` restent hors couche production.
