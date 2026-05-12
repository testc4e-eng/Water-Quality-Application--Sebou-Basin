# Harmonisation APPORT - Audit

## Objectif

Renommer le parametre barrage `APPORTS_HM3` en `APPORT` sans modifier les valeurs numeriques.

## Audit unite et valeurs

| Controle | Resultat |
|---|---:|
| lignes source ciblees `APPORTS_HM3` | 84820 |
| unite avant migration | `Mm3/j` |
| valeur min | 0 |
| valeur max | 290.4521378 |
| valeur moyenne | 1.1710364993238046 |
| lignes comparees source/cible | 84820 |
| lignes avec valeur identique source/cible | 84820 |
| delta numerique max source/cible | 0 |

## Decision conversion

`1 Hm3 = 1 Mm3`.

Les valeurs chargees etaient deja coherentes avec `Mm3/j`. Aucune conversion numerique n'a ete appliquee pendant l'harmonisation.

## Risque double conversion

| Risque | Statut |
|---|---|
| double conversion `Hm3 -> Mm3` | exclu |
| multiplication/division numerique | non executee |
| changement unite | non, reste `Mm3/j` |
| changement code parametre | `APPORTS_HM3 -> APPORT` |

## Backup et audit

| Objet | Valeur |
|---|---|
| table audit | `audit.hydro_barrage_param_apport_harmonisation_audit` |
| dernier `run_id` | `6e1f667f-a4f6-4f72-b1c1-110776bbf286` |
| backup lignes hydro | `audit.bkp_hydro_mesure_barrage_param_apport_20260508_075857_164913` |
| backup referentiel | `audit.bkp_metadata_referentiel_parametre_canonique_apport_20260508_07` |
| statut audit | `SUCCESS` |
