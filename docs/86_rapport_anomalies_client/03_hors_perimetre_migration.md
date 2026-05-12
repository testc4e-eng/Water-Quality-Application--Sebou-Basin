# Hors perimetre migration

## Modelisation SWAT/WASP

| Objet | Classe | Justification |
|---|---|---|
| `swat_output.*` existant | LEGACY_MODELING_TO_REPLACE | donnees temporaires de modelisation, non referentiel final client |
| `wasp_output.*` existant | LEGACY_MODELING_TO_REPLACE | donnees temporaires de modelisation, non referentiel final client |
| scenarios `normal` uniquement | HORS_PERIMETRE_MIGRATION | construction multi-scenario a traiter dans chantier modelisation |
| doublons WASP | LEGACY_MODELING_TO_REPLACE | a resoudre par remplacement du jeu de donnees modele |

## Legacy technique

| Objet | Classe | Justification |
|---|---|---|
| `public.*` historiques | LEGACY_IGNORE | non reference de production |
| `staging.*` | LEGACY_IGNORE | audit/reprise uniquement |
| `hydro.mesure_barrage` | LEGACY_READ_ONLY | conserve temporairement apres bascule parametrique |

## Chantier futur

Le futur module `MODULE_INGESTION_FUTURES_DONNEES` portera l'integration des nouveaux fichiers client et des nouveaux jeux SWAT/WASP.

