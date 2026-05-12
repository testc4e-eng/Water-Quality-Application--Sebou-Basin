# Decision cloture

## Decision

`MIGRATION_CLIENT_CLOTUREE_AVEC_BACKLOG`

## Justification

- barrage parametrique valide
- `APPORT` harmonise
- aucune incoherence unite barrage
- aucune anomalie BLOQUANT restante
- API/dashboard SQL operationnels
- backlogs restants classes et documentes
- SWAT/WASP sortis du perimetre client definitif

## Regles d'usage

- utiliser `hydro.mesure_barrage_param` pour le barrage
- ne jamais utiliser `lacher_m3s` comme flux metier
- traiter `APPORT`, `LACHER`, `TRANSFERT` comme volumes journaliers en `Mm3/j`
- filtrer ou signaler les lignes qualite sans `parametre_ref_id` pour analyses avancees
- ne pas presenter SWAT/WASP courant comme referentiel final

