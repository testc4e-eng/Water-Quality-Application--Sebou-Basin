# Journal decisions

| ID | Decision cible | Responsable | Commentaire |
|---|---|---|---|
| REF-001 | A_PROPOSER_CORRECTION_C4E | C4E | mapping `parametre_ref_id` riviere |
| REF-002 | A_PROPOSER_CORRECTION_C4E | C4E | mapping `parametre_ref_id` nappe |
| REF-003 | A_PROPOSER_CORRECTION_C4E | C4E | mapping `parametre_ref_id` Sebou |
| REF-004 | A_PROPOSER_CORRECTION_C4E | C4E | mapping `parametre_ref_id` garde |
| REF-005 | A_PROPOSER_CORRECTION_C4E | C4E | unites referentiel |
| REF-006 | A_PROPOSER_CORRECTION_C4E | C4E | table cible referentiel |
| REF-007 | A_PROPOSER_CORRECTION_C4E | C4E | orphelins audit |
| REF-008 | A_PROPOSER_CORRECTION_C4E | C4E | legacy riviere |
| REF-009 | A_PROPOSER_CORRECTION_C4E | C4E | suivi Sebou |
| QA-001 | A_PROPOSER_CORRECTION_C4E | C4E / Client | evaporation nulles |
| QA-002 | A_PROPOSER_CORRECTION_C4E | C4E / Client | pollution `-` |
| QA-003 | CLOTURE_SANS_ACTION | C4E | valeurs negatives debit deja flaggees |
| QA-004 | BACKLOG_TECHNIQUE | C4E | 2 valeurs negatives qualite flaggees |
| QA-005 | CLIENT_REQUIRED | Client | temperature vide |
| GEO-001 | CLIENT_REQUIRED | Client | nappes |
| GEO-002 | CLIENT_REQUIRED | Client | points eau nappe |
| GEO-003 | CLIENT_REQUIRED | Client | points eau station |
| GEO-004 | CLIENT_REQUIRED | Client | profils nappe |
| GEO-005 | CLIENT_REQUIRED | Client | station null I |
| GEO-006 | CLOTURE_SANS_ACTION | C4E | pollution cible avec geom OK |
| MOD-001 | LEGACY_MODELING_TO_REPLACE | C4E / Client | SWAT temporaire |
| MOD-002 | LEGACY_MODELING_TO_REPLACE | C4E / Client | WASP temporaire |
| MOD-003 | HORS_PERIMETRE_MIGRATION | C4E / Client | multi-scenario futur |
| MOD-004 | LEGACY_MODELING_TO_REPLACE | C4E / Client | doublons WASP |
| LEG-001 | LEGACY_IGNORE | C4E | `public.*` |
| LEG-002 | LEGACY_IGNORE | C4E | `staging.*` |
| LEG-003 | BACKLOG_TECHNIQUE | C4E | `hydro.mesure_barrage` lecture seule |

## Regle de suite

Aucune correction reelle ne doit etre executee avant validation explicite.

