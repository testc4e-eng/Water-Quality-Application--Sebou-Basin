# Validation unites - index

## Statut

`UNITES_REFERENTIEL_37_VALIDEES_APPLIQUEES`

## Principe

- une unite a la fois ;
- aucune mise a jour BD automatique ;
- SQL propose non execute ;
- decisions Yassine journalisees.

## Fichiers

| Fichier | Role |
|---|---|
| `01_parametres_valides.md` | parametres valides par Yassine |
| `02_parametres_rejetes.md` | parametres rejetes |
| `03_parametres_ambigus.md` | parametres a arbitrer |
| `04_sql_unites_VALIDATION_REQUISE.sql` | SQL propose non execute |
| `05_sql_validation_post_update.sql` | controles post-update proposes |
| `06_journal_decisions.md` | journal detaille |

## Cloture

- `37` unites validees appliquees par transaction committee le `2026-05-12` ;
- `FM` = `CLIENT_REQUIRED` ;
- `F_M_MES` = `CLIENT_REQUIRED` ;
- `MD` conserve en backlog client documentaire, non modifie pendant ce run.
