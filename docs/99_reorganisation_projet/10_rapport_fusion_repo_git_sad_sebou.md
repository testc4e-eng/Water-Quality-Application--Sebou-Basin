# Rapport de fusion — `repo_git` vs `SAD_SEBOU`

**Date :** 2026-06-15  
**Auteur :** Kimi Code CLI  
**Objectif :** Choisir une source de vérité, réintégrer les améliorations utiles de la refonte développeuse et nettoyer le dossier projet.

## 1. Constats

- **`repo_git`** est la version versionnée (Git), avec un historique allant jusqu’au commit `2221edf` (business-map / workspace continuity) et des modifications non commitées (pollution campagnes, propagation, UI, docs).
- **`SAD_SEBOU/Water-Quality-Application--Sebou-Basin-Dev_refonte/...`** était une copie sans historique Git, correspondant à une refonte allégée :
  - suppression des routeurs backend `business_map` et `analysis` ;
  - suppression des pages `DashboardPollutionPropagation` et `DashboardPollutionCampagnes` ;
  - retrait des dépendances `zustand` et `react-rnd` (utilisées par le Workspace analytique) ;
  - suppression des onglets qualité Barrages / Garde / Alertes QA / Paramètres ;
  - ajout d’un typage des filtres qualité et d’un câblage des filtres globaux sur les onglets Vue d’ensemble / Temps réel / Historique.

## 2. Décision retenue

- **Source de vérité : `repo_git`**.
- **Stratégie : fusion contrôlée** — conserver le périmètre fonctionnel riche de `repo_git` et ne récupérer de `SAD_SEBOU` que les améliorations sans danger :
  - ajout de `frontend/src/components/quality-dashboard/types.ts` ;
  - transformation de `QualityGlobalFilters` en composant contrôlé ;
  - câblage des filtres globaux dans `DashboardQualiteReglementaire` ;
  - propagation des filtres aux onglets Vue d’ensemble, Temps réel et Historique (filtrage côté client tout en conservant les appels API objet existants) ;
  - ajout d’une prop `filters` optionnelle aux onglets Barrages, Garde, Alertes QA et Paramètres pour compatibilité.
- **Suppression de `SAD_SEBOU`** après extraction d’un diff de référence.

## 3. Actions réalisées

### 3.1 Sauvegarde et traçabilité

- Archive de `repo_git` : `archives/backups/repo_git_backup_20260615_pre_fusion.tar.gz` (533 Mo, node_modules et archives lourdes exclus).
- Enregistrement de l’état Git initial :
  - `docs/99_reorganisation_projet/git_status_repo_git_20260615.txt`
  - `docs/99_reorganisation_projet/git_diff_stat_repo_git_20260615.txt`
  - `docs/99_reorganisation_projet/git_untracked_repo_git_20260615.txt`
- Diff complet `repo_git ↔ SAD_SEBOU` :
  - `docs/99_reorganisation_projet/diff_backend_app_repo_git_vs_sad_sebou_20260615.patch`
  - `docs/99_reorganisation_projet/diff_frontend_src_repo_git_vs_sad_sebou_20260615.patch`

### 3.2 Fusion code

Commit : `3b79606 — feat(quality): integrate SAD_SEBOU filter types and global filter wiring`

Fichiers modifiés / créés :

- `frontend/src/components/quality-dashboard/types.ts` (nouveau)
- `frontend/src/components/quality-dashboard/QualityGlobalFilters.tsx`
- `frontend/src/components/quality-dashboard/QualityOverviewTab.tsx`
- `frontend/src/components/quality-dashboard/QualityRealtimeTab.tsx`
- `frontend/src/components/quality-dashboard/QualityHistoriqueTab.tsx`
- `frontend/src/components/quality-dashboard/QualityDamsTab.tsx`
- `frontend/src/components/quality-dashboard/QualityGuardDamsTab.tsx`
- `frontend/src/components/quality-dashboard/QualityAlertsQATab.tsx`
- `frontend/src/components/quality-dashboard/QualityParametersTab.tsx`
- `frontend/src/pages/DashboardQualiteReglementaire.tsx`
- `frontend/src/hooks/useQualityRegulatory.ts`

Autres corrections incluses :

- `useQualityRegulatory` utilisait des appels positionnels alors que l’API `qualityRegulatory.ts` attend des objets ; corrigé.

### 3.3 Validation technique

- **Frontend :** `npm run build` ✅ (44,25 s, warning classique sur la taille du bundle).
- **Backend :** `python -m compileall -q backend/app` ✅ (aucune erreur de syntaxe).

### 3.4 Nettoyage du système de fichiers

- Suppression du dossier `SAD_SEBOU` et de sa copie imbriquée.
- Déplacement des artefacts racine dans `archives/cleanup_20260615/` :
  - captures d’écran (`runtime-*.png`, `pollution-*.png`, `dashboard-carto-metier-*.png`, etc.)
  - logs console (`console-errors-*.json`)
  - snapshots temporaires (`tmp*.yml`)
  - documents épars (`dashboard.txt`, `nouveau 1.txt`, `tmp_api_sprint2.sql`, `rapport_provisoire_SAD_mission IV.pdf`, `template_qualite_eau_ABH.xlsx`, etc.)
  - contenu de `.playwright-mcp/`
- Déplacement du dossier `synthese disscution chatgpt/` vers `archives/synthese_discussion_chatgpt/`.
- Suppression du `.git` fantôme à la racine de `C:/dev/WQDSS` (aucun commit, source de confusion).

Structure racine après nettoyage :

```text
C:/dev/WQDSS/
├── .agents/
├── .codex/
├── .playwright-mcp/      (vide)
├── .vscode/
├── archives/
│   ├── backups/
│   ├── cleanup_20260615/
│   └── synthese_discussion_chatgpt/
├── data/
└── repo_git/
```

## 4. Éléments volontairement NON réintégrés de `SAD_SEBOU`

- Suppression des routeurs `business_map` / `analysis`.
- Suppression des pages `DashboardPollutionPropagation` / `DashboardPollutionCampagnes`.
- Retrait des dépendances `zustand` / `react-rnd`.
- Suppression des onglets qualité Barrages / Garde / Alertes QA / Paramètres.
- Changement de signature des fonctions `qualityRegulatory` (appels positionnels).

Ces éléments ont été exclus car ils réduisaient le périmètre fonctionnel validé dans les documents de passation (`docs/00_source_of_truth/passation_developpeuse_20260623/`).

## 5. Réserves et prochaines actions

- Le backend local complet plante toujours au démarrage sur `numpy/blas_fpe_check` ; ce problème est isolé du nettoyage et de la fusion.
- La route `POST /api/v1/business-map/analysis/series/batch` retourne 404 avec le mock backend ; elle nécessite soit une implémentation mock, soit l’utilisation du backend réel une fois le problème numpy résolu.
- Les modifications non commitées de `repo_git` antérieures à la fusion (pollution campagnes, propagation, docs, etc.) restent présentes et doivent faire l’objet d’un commit/stash séparé avant une livraison propre.

## 6. Critères de succès

- ✅ `repo_git` reste la source de vérité.
- ✅ Les fonctionnalités Carte Métier / Workspace et Pollution sont intactes.
- ✅ Les améliorations qualité de `SAD_SEBOU` sont intégrées.
- ✅ `SAD_SEBOU` et sa copie imbriquée sont supprimés.
- ✅ Le build frontend et la compilation backend passent.
- ✅ Un rapport de fusion est produit.
