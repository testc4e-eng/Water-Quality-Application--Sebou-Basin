# Journal execution etape 2

## Statut final

`REF_001_004_CLOTURE_C4E`

## Synthese execution

| Etape | Action | Statut |
|---|---|---|
| A | synchronisation FK `metadata.referentiel_parametre` | `COMMIT` |
| A | backup logique FK | cree |
| A | controle cibles FK | conforme |
| B | mapping final REF-001 a REF-004 | `COMMIT` |
| B | backup logique lignes qualite modifiees | cree |
| B | controles post-mapping | conformes |

## Etape A - Synchronisation FK referentiel

Script execute :

```text
docs/91_resolution_anomalies_execution/REF_001_004_mapping_parametres/13_sql_sync_referentiel_parametre_FK_VALIDATION_REQUISE.sql
```

### Cibles synchronisees

| Code |
|---|
| `F-` |
| `CN` |
| `CLOSTRI` |
| `CO2_LIBRE` |
| `H2S` |
| `PSEUDO_AER` |
| `VIBRIO` |
| `GERME_22` |
| `GERME_37` |
| `CL2_RES` |
| `SIO2` |
| `SO3` |
| `ODEUR` |
| `SAVEUR` |
| `BORE` |

### Resultats

| Controle | Resultat |
|---|---:|
| parametres synchronises dans `metadata.referentiel_parametre` | 15 |
| cibles manquantes apres sync | 0 |
| doublons sur cibles synchronisees | 0 |
| `MO_METAL` / `MD` actifs crees | 0 |
| lignes backup preexistantes | 0 |

Backup :

```text
audit.bkp_referentiel_parametre_sync_fk_20260508
```

Journal :

```text
audit.referentiel_parametre_sync_fk_journal
```

Note : un doublon global preexistant `DEBIT` existe dans `metadata.referentiel_parametre` hors perimetre REF-001 a REF-004. Il n'a pas ete modifie.

## Etape B - Mapping final REF-001 a REF-004

Script execute :

```text
docs/91_resolution_anomalies_execution/REF_001_004_mapping_parametres/12_sql_mapping_parametres_FINAL_VALIDATION_REQUISE.sql
```

### Lignes corrigees par table

| Table | Lignes corrigees |
|---|---:|
| `qualite.mesure_qualite_riviere` | 17287 |
| `qualite.mesure_qualite_nappe` | 13269 |
| `qualite.mesure_qualite_sebou` | 31277 |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 528 |
| **Total** | **62361** |

Backup :

```text
audit.bkp_qualite_ref001_004_mapping_final_20260508
```

Journal :

```text
audit.qualite_ref001_004_mapping_journal
```

## Volumes NULL restants

| Table | `parametre_ref_id IS NULL` restant |
|---|---:|
| `qualite.mesure_qualite_riviere` | 0 |
| `qualite.mesure_qualite_nappe` | 1 |
| `qualite.mesure_qualite_sebou` | 0 |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 11 |
| **Total** | **12** |

## Parametres restants

| Table | Parametre | Volume | Statut |
|---|---|---:|---|
| `qualite.mesure_qualite_nappe` | `NUMEROTATION` | 1 | `LEGACY_IGNORE` |
| `qualite.suivi_qualite_barrage_garde_hebdo` | `MO_METAL` | 11 | `CLIENT_REQUIRED` |

## Controles post-commit

| Controle | Resultat |
|---|---:|
| FK orphelines qualite vers `metadata.referentiel_parametre(id)` | 0 |
| parametres restants inattendus | 0 |
| `MO_METAL` mappe | 0 |
| `NUMEROTATION` mappe | 0 |
| utilisation de `ctid` | 0 |

## Decision unite `hm3`

La decision `hm3` / `Hm3` / `HM3` vers unite standard `Mm3` a ete appliquee uniquement au referentiel unite/alias.

| Controle | Resultat |
|---|---|
| `APPORT` et `TRANSFERT` fusionnes | non |
| valeurs numeriques modifiees | non |
| tables qualite REF-001 a REF-004 modifiees par la regle unite | non |
| variantes `hm3` conservees comme unite legacy | oui, via journal de decision |

## Statut final

REF-001 a REF-004 : `CLOTURE_C4E`

Restent uniquement :

| Parametre | Statut |
|---|---|
| `MO_METAL` | `CLIENT_REQUIRED` |
| `NUMEROTATION` | `LEGACY_IGNORE` |
