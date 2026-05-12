# Index — validation migration par cas

## Synthèse
| Indicateur | Valeur |
|---|---:|
| Nombre total de cas identifiés | 382 |
| Cas en attente validation | 382 |
| Cas validés | 0 |
| Cas rejetés | 0 |
| Cas exécutés | 0 |
| Volume migré | 0 |
| Volume proposé en quarantaine | 32875 |
| Volume restant | 4288121 |

Note : les volumes affichés dans ce dossier sont des volumes cumulés par cas. Une même ligne peut apparaître dans plusieurs cas si elle cumule plusieurs problèmes.

## Livrables
| Fichier / dossier | Rôle |
|---|---|
| `01_liste_cas_identifies.csv` | registre central des cas à valider |
| `02_fiches_cas/` | une fiche unitaire par cas |
| `03_journal_decisions.md` | journal des validations humaines |
| `04_log_execution.md` | log d’exécution, vide tant qu’aucun cas n’est validé |
| `05_sql_valides/` | scripts exécutables seulement après validation |
| `06_sql_en_attente/` | propositions SQL non exécutées |
| `07_historique_migration.md` | historique global du processus |
| `08_dashboard_suivi.md` | vue de pilotage de la migration par cas |

## Cas critiques initiaux
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
