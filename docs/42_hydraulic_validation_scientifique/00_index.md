# Validation hydraulique scientifique — Index

## Statut du chantier
`GO_HYDRAULIC_VALIDATION_EXECUTION`

Le MNT principal a été retrouvé et lu correctement. Le moteur reste topologique tant que les candidats d'inversion et les segments plats ne sont pas arbitrés.

| Fichier | Contenu | Statut |
|---|---|---|
| 01_mnt_audit.md | Audit raster MNT Sebou | Créé |
| 02_network_runtime_status.md | Etat réseau runtime et topologie | Créé |
| 03_hydraulic_validation_strategy.md | Stratégie de validation altimétrique | Créé |
| 04_flow_direction_qa_rules.md | Règles QA direction hydraulique | Créé |
| 05_candidate_reversed_edges.md | Synthèse candidats inversion | Créé |
| 06_mnt_limitations.md | Limites MNT et précautions | Créé |
| 07_execution_plan.md | Plan d'exécution contrôlé | Créé |
| 08_go_nogo_hydraulic_validation.md | Décision GO/NOGO | Créé |
| 09_future_pollution_routing_impact.md | Impacts pollution/GNN/IA | Créé |

## Artefacts read-only produits
| Artefact | Usage |
|---|---|
| _readonly_db_network_audit.json | Audit DB réseau en SELECT uniquement |
| _edge_endpoints_32630.csv | Coordonnées début/fin transformées pour échantillonnage MNT |
| _readonly_hydraulic_sample_edges.csv | Premier échantillonnage altimétrique read-only |
| _readonly_hydraulic_sample_summary.txt | Comptage des statuts candidats |

## Résumé court
- MNT principal : `C:\dev\WQDSS\data\MNT SEBOU 30N 30M\seboureproj`.
- Fichier `.ovr` fourni : lisible comme overview, mais non suffisant seul pour validation scientifique.
- Réseau runtime : 728 segments, 740 sommets pgRouting, aucune géométrie invalide.
- Première QA altimétrique read-only : 508 segments confirmés, 139 inversions suspectées, 81 segments plats.
- Aucune inversion automatique n'a été appliquée.
