# Backlog accepte

## Backlog accepte pour cloture client

| Domaine | Backlog | Classe |
|---|---|---|
| Referentiel | unites/table cible manquantes hors barrage | TRAITABLE_C4E |
| Qualite | `parametre_ref_id` null | TRAITABLE_C4E |
| Pollution | valeurs non numeriques | TRAITABLE_C4E / CLIENT_REQUIRED selon interpretation |
| Meteo | evaporation valeurs nulles | TRAITABLE_C4E / CLIENT_REQUIRED si source disponible |
| IDP/GEO | nappes/points/profils non resolus | CLIENT_REQUIRED |
| Temperature | donnees absentes | CLIENT_REQUIRED |
| SWAT/WASP | jeux temporaires a remplacer | LEGACY_MODELING_TO_REPLACE |
| Legacy | `public.*`, `staging.*` | LEGACY_IGNORE |

## Raison d'acceptation

Ces backlogs ne remettent pas en cause la migration client car :

- aucun obstacle technique actif n'est detecte sur la mission de migration
- les donnees migrees principales sont consultables
- les dashboards/API prioritaires sont alignes
- le barrage, ancien sujet de stabilisation principal, est stabilise

## Lecture de pilotage

Les cas residuels ne traduisent pas un retard de migration. Ils correspondent soit :

- a des actions de finition C4E deja identifiees ;
- a des donnees non fournies a ce stade ;
- a des arbitrages metier client explicitement prepares.
