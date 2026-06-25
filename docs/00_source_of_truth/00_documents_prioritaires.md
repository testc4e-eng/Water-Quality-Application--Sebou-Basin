# Source de vérité documentaire SAD/WQDSS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | gouvernance documentaire |
| Périmètre | orientation des humains et agents IA vers les documents qui font foi |
| Source de vérité | Oui, pour la priorisation documentaire |
| Dernière mise à jour | 2026-05-22 |

## Rôle

Ce dossier sépare les documents maîtres, les preuves historiques et les documents expérimentaux. Il ne remplace pas les documents techniques existants ; il indique dans quel ordre les lire et comment arbitrer les divergences.

## Documents prioritaires

| Priorité | Document | Usage |
|---:|---|---|
| 1 | `docs/04_etat_avancement/00_project_global_status.md` | cockpit projet DG, métier, chef projet et IA |
| 2 | `docs/01_contexte_projet/01_mvp_scope.md` | périmètre officiel, expérimental, exclu ou en attente |
| 3 | `docs/05_blocages_et_risques/00_problemes_racines.md` | problèmes racines à arbitrer |
| 4 | `docs/02_gouvernance_et_decisions/00_registre_decisions.md` | décisions validées ou attendues |
| 5 | `docs/07_donnees_et_referentiels/00_data_landscape.md` | cartographie des sources, référentiels et niveaux de fiabilité |
| 6 | `docs/00_source_of_truth/01_source_of_truth_consolidee.md` | synthèse consolidée post-réorganisation 2026-05-22 |
| 7 | `docs/90_reorganisation_documentaire_finale/16_rapport_final_reorganisation.md` | rapport d'audit, contradictions, mapping et sécurité |
| 8 | `docs/00_SOURCE_OF_TRUTH_MASTER.md` | vérité technique vérifiée DB, backend, frontend et lots |
| 9 | `docs/03_ai_knowledge_base/MEMORY_CORE.md` | mémoire courte des agents IA |

## Documents techniques de référence

| Domaine | Document |
|---|---|
| Architecture | `docs/03_ai_knowledge_base/architecture_for_agents.md` |
| API | `docs/03_ai_knowledge_base/api_for_agents.md` |
| Base de données | `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md` |
| Structure projet | `docs/03_ai_knowledge_base/project_structure_for_agents.md` |
| Règles agents | `docs/03_ai_knowledge_base/AGENT_RULES.md` |

## Documents historiques

Les dossiers numérotés `32_*` à `99_*`, ainsi que les dossiers d'audits et de lots, conservent les preuves d'analyse, dry-run, décisions intermédiaires et rapports. Ils sont consultables comme preuves, mais ne doivent plus piloter directement les arbitrages projet.

## Documents expérimentaux

| Dossier | Statut |
|---|---|
| `docs/102_preparation_model_build_feature_store/` | préparation conceptuelle Model Build, Feature Store, QA et ML |
| `docs/IDP_POLLUTION_ANALYSIS/` | chantier DEV IDP pollution, non préproduction tant que les arbitrages spatiaux ne sont pas validés |
| `docs/dashboard_metier_p0/` | chantier dashboard cartographique métier P0 isolé |
| `docs/pollution_dashboard/` | chantier hydrologie/topologie visuelle pollution |

## Documents obsolètes ou à ne pas utiliser comme vérité

| Zone | Règle |
|---|---|
| `docs/99_legacy_archive/` | archive uniquement |
| `docs/04_working_prompts_and_runs/` | mémoire d'exécution, pas source de vérité |
| exports `.docx`, `.xlsx`, `.rar` | artefacts de diffusion ou preuve, pas contrat maître |
| références `public.*` historiques | legacy, sauf preuve contraire dans la DB réelle |

## Règle de résolution des divergences

1. Lire les cinq documents maîtres de gouvernance.
2. Vérifier `docs/00_SOURCE_OF_TRUTH_MASTER.md`.
3. Vérifier la DB ou le code si une divergence persiste.
4. Mettre à jour le document maître concerné puis les résumés IA.
