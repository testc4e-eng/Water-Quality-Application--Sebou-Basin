# Decisions finales

| Decision | Statut |
|---|---|
| migration client | `MIGRATION_CLIENT_CLOTUREE_AVEC_BACKLOG` |
| anomalies remettant en cause la cloture technique | aucune |
| barrage | production-ready |
| legacy barrage | lecture seule |
| SWAT/WASP actuels | `LEGACY_MODELING_TO_REPLACE` |
| futurs imports | via module ingestion dedie |
| suppression donnees | aucune dans cette cloture |

## Regle structurante

La cloture migration client est separee du chantier futur de modelisation SWAT/WASP.
Les ecarts residuels documentes relevent de backlog trace, d'arbitrages client ou de chantiers distincts, pas d'un echec de migration.
