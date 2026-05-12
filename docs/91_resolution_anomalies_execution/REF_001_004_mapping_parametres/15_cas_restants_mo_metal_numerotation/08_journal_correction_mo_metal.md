# Journal correction MO_METAL

## Statut

`CORRECTION_EXECUTEE_COMMIT`

## Script

```text
docs/91_resolution_anomalies_execution/REF_001_004_mapping_parametres/15_cas_restants_mo_metal_numerotation/07_sql_correction_mo_metal_VALIDATION_REQUISE.sql
```

## Decision metier appliquee

| Code | Signification |
|---|---|
| `MO` | Matieres organiques |
| `Mo` | Molybdene |

La casse est volontaire et metier. `MO_METAL` a ete mappe vers `Mo`, jamais vers `MO`.

## Incident controle

Un premier passage a ete bloque avant commit par une erreur SQL dans l'`UPDATE FROM`. La session a ete fermee sans commit ; les controles ont confirme ensuite :

| Controle apres echec | Resultat |
|---|---:|
| `Mo` canonique | 0 |
| `Mo` FK | 0 |
| `MO_METAL` restant | 11 |

Le script a ete corrige puis relance.

## Execution validee

| Action | Resultat |
|---|---:|
| backup referentiel `MO` / `Mo` | 2 lignes |
| backup lignes `MO_METAL` candidates | 11 lignes |
| creation `Mo` canonique | 1 |
| synchronisation `Mo` FK | 1 |
| lignes `MO_METAL` mises a jour | 11 |
| commit | oui |

Backups :

```text
audit.bkp_ref_param_mo_case_resolution_20260508
audit.bkp_qualite_mo_metal_to_mo_case_20260508
```

## Controles post-commit

| Controle | Resultat |
|---|---:|
| `Mo` dans `metadata.referentiel_parametre_canonique` | 1 |
| `Mo` dans `metadata.referentiel_parametre` | 1 |
| `MO` conserve dans `metadata.referentiel_parametre_canonique` | 1 |
| `MO` conserve dans `metadata.referentiel_parametre` | 1 |
| `MO_METAL` restant | 0 |
| `NUMEROTATION` restant | 1 |
| FK orphelines qualite | 0 |
| lignes `MO_METAL` mappees vers `MO` | 0 |
| lignes `MO_METAL` mappees vers `Mo` | 11 |

## Resultat

`MO_METAL` est cloture C4E. Le seul reste REF-001 a REF-004 est `NUMEROTATION = LEGACY_IGNORE`.
