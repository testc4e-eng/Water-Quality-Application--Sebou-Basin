# Dashboard décisionnel ABH

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | index |
| Périmètre | vision métier cartographique décisionnelle ABH + dashboard frontend test |
| Source de vérité | Oui pour ce chantier |
| Dernière mise à jour | 2026-05-14 |

## Objectif

Structurer une première version test de dashboard décisionnel pour validation métier ABH, sans remplacement du frontend existant.

## Documents

1. [01_vision_metier_carto_decisionnelle](./01_vision_metier_carto_decisionnelle.md)
2. [02_typologie_donnees_et_fraicheur](./02_typologie_donnees_et_fraicheur.md)
3. [03_organisation_par_campagne](./03_organisation_par_campagne.md)
4. [04_organisation_par_support_spatial](./04_organisation_par_support_spatial.md)
5. [05_modes_affichage_carte_tableau_graphique](./05_modes_affichage_carte_tableau_graphique.md)
6. [06_regles_performance_et_lazy_loading](./06_regles_performance_et_lazy_loading.md)
7. [07_personas_et_besoins_abh](./07_personas_et_besoins_abh.md)
8. [08_spec_dashboard_test](./08_spec_dashboard_test.md)
9. [09_checklist_validation_metier](./09_checklist_validation_metier.md)
10. [10_backlog_evolution_dashboard_decisionnel](./10_backlog_evolution_dashboard_decisionnel.md)

## Références amont

- `docs/94_api_frontend_transition/observatory_menu_v2/*`
- `docs/94_api_frontend_transition/frontend_pilote_metaux/*`
- `docs/94_api_frontend_transition/05_audit_frontend_react.md`
- `docs/94_api_frontend_transition/06_architecture_frontend_cible.md`
- `docs/94_api_frontend_transition/07_ecrans_frontend_cibles.md`
- `docs/03_ai_knowledge_base/api_for_agents.md`
- `docs/03_ai_knowledge_base/architecture_for_agents.md`
- `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`

## Décision de cadrage

- Aucun changement backend.
- Aucun changement base ou vues SQL.
- Aucun remplacement de `Dashboard2`.
- Route test dédiée : `/decision-dashboard-test`.
- Source API P0 unique : `/api/v1/qualite/*`.
