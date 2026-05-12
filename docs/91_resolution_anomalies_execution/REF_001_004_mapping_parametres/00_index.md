# REF-001 a REF-004 - Mapping parametres qualite

## Mode

Audit initial read-only, puis execution controlee validee par C4E.

## Livrables

| Fichier | Role |
|---|---|
| `01_diagnostic_global.md` | volumes, top parametres, periodes et stations |
| `02_mapping_surs.md` | mappings sûrs proposes |
| `03_mapping_probables_a_valider.md` | mappings probables a valider C4E |
| `04_mapping_ambigus_client_required.md` | mappings ambigus necessitant arbitrage |
| `05_parametres_non_trouves.md` | parametres sans candidat |
| `06_sql_correction_proposee_non_executee.md` | script SQL propose non execute |
| `07_sql_validation_post_correction.md` | controles post-correction proposes |
| `08_rapport_decision.md` | synthese decisionnelle |
| `11_plan_recalcul_apres_enrichissement.md` | recalcul apres decisions C4E |
| `12_sql_mapping_parametres_FINAL_VALIDATION_REQUISE.sql` | script final mapping REF-001 a REF-004 |
| `13_sql_sync_referentiel_parametre_FK_VALIDATION_REQUISE.sql` | script synchronisation FK `metadata.referentiel_parametre` |
| `14_journal_execution_step2.md` | journal execution sync FK + mapping final |
| `15_cas_restants_mo_metal_numerotation/` | extraction et decision des 12 lignes restantes |

## Resume

| Table | Volume NULL initial | Mapping sûr | Mapping probable | Ambigu | Non trouvé | Volume restant estimé |
|---|---:|---:|---:|---:|---:|---:|
| `qualite.mesure_qualite_riviere` | 17287 | 12677 | 864 | 3600 | 146 | 4610 |
| `qualite.mesure_qualite_nappe` | 13270 | 10802 | 2212 | 250 | 6 | 2468 |
| `qualite.mesure_qualite_sebou` | 31277 | 26758 | 0 | 4519 | 0 | 4519 |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 539 | 382 | 11 | 124 | 22 | 157 |
| **Total premiere passe** | **62373** | **50619** | **3087** | **8493** | **174** | **11754** |

## Recalcul apres validation C4E

| Classe | Volume |
|---|---:|
| mapping sur apres enrichissement referentiel | 62361 |
| `MO_METAL` client required | 11 |
| `NUMEROTATION` legacy ignore | 1 |

## Decision de premiere passe

- `GO` correction apres validation explicite pour mappings sûrs.
- `HOLD` pour mappings probables.
- `CLIENT_REQUIRED` pour mappings ambigus et non trouves.

## Decision post-execution

| Indicateur | Valeur |
|---|---:|
| cibles FK synchronisees | 15 |
| lignes qualite corrigees | 62361 |
| FK orphelines restantes | 0 |
| NULL restants attendus | 12 |

REF-001 a REF-004 sont clotures C4E completement. `MO_METAL` a ete corrige vers `Mo` apres creation/synchronisation du referentiel sensible a la casse. `NUMEROTATION` reste le seul reliquat autorise en `LEGACY_IGNORE`.

## Cloture finale post-MO_METAL

| Indicateur | Valeur |
|---|---:|
| `Mo` canonique | 1 |
| `Mo` FK | 1 |
| `MO_METAL` restant | 0 |
| `NUMEROTATION` restant | 1 |
| FK orphelines | 0 |
| `MO_METAL` mappe vers `MO` | 0 |
| `MO_METAL` mappe vers `Mo` | 11 |

Statut : `CLOTURE_C4E_COMPLETE`.
