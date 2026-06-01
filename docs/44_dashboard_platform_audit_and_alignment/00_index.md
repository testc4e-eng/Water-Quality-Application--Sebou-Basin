# Audit dashboards plateforme — Index

## Statut
`NOGO_DASHBOARD_PREPROD`

## Synthèse
Les données et APIs P0 sont disponibles pour qualité réglementaire, température, pollution IDP et cartographie métier. En revanche, les dashboards frontend restent hétérogènes : coexistence legacy/P0, contrats API partiellement alignés, statuts réglementaires insuffisamment exposés partout, et au moins un dashboard importe des composants absents.

## Livrables
| Fichier | Contenu | Statut |
|---|---|---|
| 01_inventory_existing_dashboards.md | Inventaire routes/pages dashboards | Créé |
| 02_inventory_available_apis_and_views.md | APIs, vues et volumes DB disponibles | Créé |
| 03_gap_analysis_dashboards_vs_data.md | Écarts dashboards vs données réelles | Créé |
| 04_user_profiles_dashboard_needs.md | Besoins par profil utilisateur | Créé |
| 05_target_dashboard_architecture.md | Architecture cible dashboards | Créé |
| 06_dashboard_priority_roadmap.md | Roadmap P0/P1/P2/P3 | Créé |
| 07_api_consumption_corrections.md | Corrections de consommation API | Créé |
| 08_preprod_dashboard_go_nogo.md | Décision GO/NOGO préproduction | Créé |
| 09_implementation_plan.md | Plan d’implémentation incrémental | Créé |

## Artefacts read-only
| Artefact | Usage |
|---|---|
| `_readonly_db_dashboard_audit.json` | Comptages DB et vues inspectées en lecture seule |

## Décision courte
Le chantier dashboard doit passer en refactor P0 contrôlé avant préproduction. Les écrans existants peuvent rester en DEV/démo, mais ne doivent pas être exposés comme préproduction métier.
