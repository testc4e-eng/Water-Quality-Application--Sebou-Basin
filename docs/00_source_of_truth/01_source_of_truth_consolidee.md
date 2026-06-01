# Source de vérité consolidée SAD/WQDSS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | source de vérité consolidée |
| Source de vérité | Oui |
| Snapshot | 2026-05-22 |

## Règle de priorité

1. Base réelle `abh_sad`, inspectée en lecture seule.
2. Code réellement présent dans `backend`, `frontend`, `database`, `scripts`.
3. Documents maîtres de gouvernance.
4. Documents techniques actifs.
5. Rapports d'audit et historiques.
6. Archives legacy.

## État consolidé

| Domaine | Vérité consolidée |
|---|---|
| Documentation | 2 144 documents analysés, 50 fichiers historiques racine déplacés, aucun contenu supprimé |
| BD | 339 objets tables/vues, 31 vues matérialisées, 4 554 colonnes inspectées |
| Données | hydro/météo/qualité consolidés avec QA ; température absente ; IDP DEV non préproduction |
| API | FastAPI `/api/v1`, coexistence legacy/P0, modules SWAT/ingestion optionnels |
| Frontend | dashboards legacy conservés, P0 isolés |
| Pipelines | IDP/topologie/réglementaire en DEV, ingestion et model build en spécification |
| Modèles | SWAT/WASP sandbox legacy, non décisionnels |

## Documents maîtres

- `docs/04_etat_avancement/00_project_global_status.md`
- `docs/01_contexte_projet/01_mvp_scope.md`
- `docs/05_blocages_et_risques/00_problemes_racines.md`
- `docs/02_gouvernance_et_decisions/00_registre_decisions.md`
- `docs/07_donnees_et_referentiels/00_data_landscape.md`
- `docs/90_reorganisation_documentaire_finale/16_rapport_final_reorganisation.md`

## Garde-fous

- Aucun document historique n'est supprimé.
- Les documents historiques déplacés restent traçables via le rapport `17_execution_deplacement_lot_a.md`.
- Les dossiers historiques complets ne sont pas déplacés tant que les liens croisés ne sont pas validés.
- Toute contradiction doit être documentée, pas corrigée silencieusement.

