# Validation arbitrages metier

## Objet

Session de validation manuelle des arbitrages restants avant figement des vues metier, API et valeurs `table_cible`.

## Fichiers

| Fichier | Role |
|---|---|
| `01_journal_validation_arbitrages.md` | Journal des decisions Yassine, une ligne par parametre |
| `02_decisions_validees.md` | Decisions validees et impacts metier |
| `03_decisions_rejetees_ou_backlog.md` | Decisions rejetees, backlogs ou client required |
| `04_impact_vues_api.md` | Impacts consolides sur vues, API et frontend |
| `05_sql_update_classification_VALIDATION_REQUISE.sql` | SQL propose non execute pour figer `table_cible` / classification |
| `06_rapport_final_arbitrages.md` | Rapport final apres validation des 8 cas |

## Cas a valider

| Ordre | Parametre | Statut |
|---:|---|---|
| 1 | `T_AIR` | `EN_ATTENTE_VALIDATION_YASSINE` |
| 2 | `T_EAU` | `A_TRAITER` |
| 3 | `LARGEUR` | `A_TRAITER` |
| 4 | `PROFONDEUR` | `A_TRAITER` |
| 5 | `DISQUE_SECCHI` | `A_TRAITER` |
| 6 | `COULEUR` | `A_TRAITER` |
| 7 | `FM` | `A_TRAITER` |
| 8 | `F_M_MES` | `A_TRAITER` |

## Regles

- Une decision a la fois.
- Aucune modification base.
- Aucune creation reelle de vue ou API.
- `MO` et `Mo` restent distincts.
- `FM` et `F_M_MES` restent hors restitution tant que non valides.
