# Cas restants MO_METAL / NUMEROTATION

## Objet

Documenter les deux cas restants apres cloture C4E de REF-001 a REF-004.

## Mode

Audit read-only. Aucune correction SQL executee.

## Livrables

| Fichier | Role |
|---|---|
| `01_extraction_lignes_restantes.md` | extraction des 12 lignes restantes |
| `02_analyse_mo_metal.md` | analyse detaillee `MO_METAL` |
| `03_analyse_numerotation.md` | analyse detaillee `NUMEROTATION` |
| `04_decision_finale.md` | decision finale et statut cible |
| `05_formulation_rapport_client.md` | formulation pour rapport client final |
| `06_sql_readonly_extraction.md` | requetes SELECT utilisees |

## Synthese

| Cas | Table | Volume | Diagnostic | Decision |
|---|---|---:|---|---|
| `MO_METAL` | `qualite.suivi_qualite_barrage_garde_hebdo` | 11 | source staging = `Molybdene(mg/l)`, valeur constante 0.01 avec observation `<0.010` | corrige vers `Mo` apres creation/synchronisation referentiel |
| `NUMEROTATION` | `qualite.mesure_qualite_nappe` | 1 | identifiant legacy `Numerotation_GT`, non parametre qualite | `LEGACY_IGNORE` |

## Decision courte

`MO_METAL` ne doit plus etre transfere au client comme inconnu : les 11 lignes pointent vers une source brute explicite `Molybdene(mg/l)`. La cible correcte est `Mo` et non `MO`. La correction a ete executee apres creation/synchronisation de `Mo` dans les deux referentiels.

`NUMEROTATION` reste hors referentiel qualite et doit etre conserve comme legacy ignore, non expose dashboard.

## Statut final

`REF-001` a `REF-004` : `CLOTURE_C4E_COMPLETE`

Seul reste autorise : `NUMEROTATION = LEGACY_IGNORE`.
