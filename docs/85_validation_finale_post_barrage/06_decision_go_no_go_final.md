# Decision GO / NO GO finale

## Decision

`FINAL_GO_AVEC_BACKLOG`

## Justification

| Axe | Statut | Commentaire |
|---|---|---|
| Barrage parametrique | OK | 272652 lignes, `APPORT` harmonise, 0 incoherence unite |
| API/dashboard barrage | OK | vues et MV alignees sur `hydro.mesure_barrage_param` |
| Hydro hors barrage | OK avec backlog | valeurs negatives debit toutes flaggees |
| Meteo | OK avec backlog | precipitation OK, evaporation avec valeurs nulles, temperature vide |
| Qualite | GO avec backlog | donnees exploitables, referentiel incomplet |
| SWAT | OK avec backlog | donnees coherentes, multi-scenario a enrichir |
| WASP | GO avec backlog | donnees exploitables, doublons a arbitrer |
| Metadata | GO avec backlog | barrage OK, referentiel global incomplet |
| Legacy | isole | legacy conserve ou ignore selon classe |

## Bloquants

Aucun bloquant restant.

## Conditions post-GO

- ne pas supprimer `hydro.mesure_barrage` avant stabilisation longue API/dashboard
- traiter le backlog referentiel qualite avant exposition IA avancee
- arbitrer les mappings IDP/GEO client
- dedoublonner WASP si les analyses de scenario en dependent
- enrichir les scenarios SWAT/WASP avant usage multi-scenario

