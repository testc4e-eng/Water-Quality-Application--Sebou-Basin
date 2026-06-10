# Source de vérité consolidée SAD/WQDSS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | source de vérité consolidée |
| Source de vérité | Oui |
| Dernière mise à jour | 2026-06-04 |
| Snapshot | 2026-06-04 |

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
| Données | hydro/météo/qualité consolidés avec QA ; température intégrée (437 889 lignes) ; `C1-B` IDP clôturé en DEV avec résiduel global séparé |
| API | FastAPI `/api/v1`, coexistence legacy/P0, modules SWAT analysis/ingestion optionnels |
| Frontend | dashboards legacy conservés, P0 isolés, URL API centralisée via `frontend/src/config/api.ts` |
| Pipelines | IDP/topologie/réglementaire en DEV ; `C1-B` fermé, backlog global IDP gouverné séparément ; chemin critique recentré sur PREPROD, `C3` et industrialisation administration/ingestion métier |
| Modèles | SWAT/WASP sandbox legacy, non décisionnels, hors blocage technique court |

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

## Rebaselining chemin critique 2026-06-04

- `IDP_FINAL_STATUS = CLOSED_WITH_GOVERNED_BACKLOG`
- `SWAT` et `WASP` deviennent des dependances metier externes
- `PREPROD_READY` doit etre atteint avant reception des resultats SWAT/WASP valides
- les anciens routeurs backend non montes ciblant `public.*` sont places en quarantaine dans `backend/app/routers_legacy_public/`
- la source de verite frontend pour l'URL API est `VITE_API_BASE_URL`, avec fallback central `http://127.0.0.1:8000/api/v1`

Chemin critique court :

1. qualification PREPROD backend/frontend/API/DB ;
2. stabilisation `C3` reglementaire ;
3. industrialisation du module `114_data_admin_ingestion` ;
4. contractualisation SWAT/WASP ;
5. preparation IA/ML.

Mise a jour 2026-06-05 :

- le chantier `114_data_admin_ingestion` devient le centre cible de gouvernance operationnelle des donnees ;
- l'audit existant, l'architecture cible et la roadmap MVP sont documentes dans `docs/114_data_admin_ingestion/` ;
- le `data viewer` `/data` reste hors flux officiel de modification metier ;
- l'existant `/admin/data-scan` et `/admin/ingestion` doit etre encapsule puis remplace progressivement par `/admin/data-governance`.
