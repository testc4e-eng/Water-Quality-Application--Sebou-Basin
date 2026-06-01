# Statut global projet

## Tableau consolidé
| Chantier | Statut | Risque | Bloquant | Prochaine action |
|---|---|---|---|---|
| Référentiel qualité réglementaire | PREPROD_READY_CONDITIONAL | Moyen | Tests HTTP réels + warnings API/frontend à compléter | Valider contrat `type_eau`, `water_type` deprecated, statuts hors périmètre |
| Température | DONE | Faible | Aucun bloquant ingestion; warning FK directe absente sur hypertable | Brancher dashboards/API climat et vues batch COMMITTED |
| Validation hydraulique | IN_PROGRESS | Élevé | 139 inversions suspectées + 81 segments plats non arbitrés | Créer `qa.hydraulic_direction_validation` et lancer revue QA MNT |
| Dashboard cartographique métier | CONDITIONAL | Moyen | DEV demo OK; préprod bloquée par validation navigateur et statuts réglementaires complets | Tester navigateur avec backend réel et ajouter statuts explicites |
| Préparation ML/analytique | IN_PROGRESS | Moyen | Température prête; hydraulique directionnelle encore non validée | Construire feature store contrôlé après stabilisation dashboards et hydraulique |

## Synthèse exécutive
- Qualité réglementaire : moteur chargé et fonctionnel sur périmètre conditionnel, pas encore `GO_PREPROD_FINAL`.
- Température : ingestion métier contrôlée commitée, dataset exploitable et traçable.
- Hydraulique : MNT principal validé et chantier scientifique lancé; le moteur reste non validé hydrauliquement jusqu'à arbitrage des segments suspects.
- Dashboards : P0.1 cartographique métier prêt démo DEV, préprod à sécuriser par statuts réglementaires et test navigateur réel.
- ML : base météo solide; les features hydrauliques/GNN restent bloquées tant que la direction n'est pas validée.

## Cardinalités DB clés
| Objet | Lignes |
|---|---:|
| infra.stations_mesure | 390 |
| meteo.mesure_temperature | 437889 |
| geo.ref_site_pollution | 1951 |
| qualite.resultat_mesure | 1409 |
| geo_work.reseau_hydro_edges_final | 728 |

## Dernière consolidation hydraulique
| Élément | Statut |
|---|---|
| MNT `seboureproj` | `MNT_VALID` |
| Couverture réseau/MNT | 728/728 segments |
| Direction runtime | topologique uniquement |
| Décision chantier | `GO_HYDRAULIC_VALIDATION_EXECUTION` |
| Statut global hydraulique | `HYDRAULIC_VALIDATION_IN_PROGRESS__MNT_VALID__FLOW_QA_PENDING` |
