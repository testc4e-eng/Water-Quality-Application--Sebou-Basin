# Dashboard suivi

## Synthèse
| Indicateur | Valeur |
|---|---:|
| Cas identifiés | 382 |
| Cas en attente validation | 382 |
| Cas validés | 0 |
| Cas rejetés | 0 |
| Cas exécutés | 0 |
| Volume migré | 0 |
| Volume proposé en quarantaine | 32875 |
| Volume restant | 4288121 |

Note : les volumes sont cumulés par cas et non dédupliqués ligne à ligne.

## Répartition par catégorie
| Catégorie | Nombre de cas |
|---|---:|
| PARAMETER_MAPPING | 73 |
| UNIT_VALIDATION | 178 |
| VALUE_PARSING | 92 |
| VALUE_ABERRANT | 19 |
| NON_NUMERIC | 8 |
| AMBIGUOUS_PARAMETER | 9 |
| UNMAPPED_PARAMETER | 3 |

## Répartition par action proposée
| Action proposée | Nombre de cas |
|---|---:|
| MIGRATE | 8 |
| MIGRATE_WITH_FLAG | 92 |
| QUARANTINE | 27 |
| STAGING_ONLY | 255 |

## Cas critiques prioritaires
| ID CAS | Paramètre | Type | Volume | Action proposée |
|---|---|---|---:|---|
| CAS-001 | debit_jr | AMBIGUOUS_PARAMETER | 521433 | STAGING_ONLY |
| CAS-002 | debit_m | AMBIGUOUS_PARAMETER | 19316 | STAGING_ONLY |
| CAS-017 | NO3- | VALUE_ABERRANT | 5158 | QUARANTINE |
| CAS-018 | SO4 | VALUE_ABERRANT | 4793 | QUARANTINE |
| CAS-019 | CF | VALUE_ABERRANT | 4735 | QUARANTINE |
| CAS-003 | H_G | AMBIGUOUS_PARAMETER | 4726 | STAGING_ONLY |
| CAS-020 | Cl | VALUE_ABERRANT | 4666 | QUARANTINE |
| CAS-021 | NO2- | VALUE_ABERRANT | 4534 | QUARANTINE |
| CAS-004 | debit | AMBIGUOUS_PARAMETER | 2816 | STAGING_ONLY |
| CAS-005 | MO | AMBIGUOUS_PARAMETER | 2658 | STAGING_ONLY |
| CAS-022 | Mn | VALUE_ABERRANT | 2625 | QUARANTINE |
| CAS-023 | FeT | VALUE_ABERRANT | 2071 | QUARANTINE |
| CAS-024 | Fe | VALUE_ABERRANT | 1175 | QUARANTINE |
| CAS-006 | debit_l_s | AMBIGUOUS_PARAMETER | 362 | STAGING_ONLY |
| CAS-013 | CF | NON_NUMERIC | 273 | QUARANTINE |
| CAS-014 | CT | NON_NUMERIC | 273 | QUARANTINE |
| CAS-015 | SF | NON_NUMERIC | 273 | QUARANTINE |
| CAS-007 | Hg | AMBIGUOUS_PARAMETER | 261 | STAGING_ONLY |
| CAS-025 | Arsenic(mg/l) | VALUE_ABERRANT | 182 | QUARANTINE |
| CAS-010 | Bore(mg/l) | UNMAPPED_PARAMETER | 182 | STAGING_ONLY |
