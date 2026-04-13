# Guide de Merge des 3 Avancements (Toi + 2 Intégratrices)

Date: 2026-04-09  
Contexte repo: `origin/dev_v1`, `origin/dev_v2`, `origin/dev_merge_test`, `origin/main`

## 1) Objectif métier

Fusionner proprement les 3 flux de travail:
- Toi: branche d'intégration actuelle (`dev_merge_test`)
- Intégratrice 1: dashboard analytique (`dev_v1`)
- Intégratrice 2: dashboard cartographique / map (`dev_v2`)

Résultat attendu:
- Une seule branche d'intégration stable, testée, prête pour PR vers `dev` ou `main`.

## 2) Règles d'équipe avant merge

1. Freeze temporaire des pushes sur `dev_v1`, `dev_v2`, `dev_merge_test` pendant l'intégration.
2. Chaque membre pousse ses derniers commits avant le freeze.
3. Aucun `git reset --hard` ni réécriture d'historique sur les branches partagées.
4. Résolution de conflit guidée par domaine métier (section 6).

## 3) Préparation technique

Exécuter dans le repo local:

```bash
git fetch --all --prune
git status
git branch -a
```

Si `git status` n'est pas propre, committer d'abord:

```bash
git add -A
git commit -m "WIP: sauvegarde avant integration multi-branches"
git push
```

## 4) Créer une branche d'intégration dédiée (recommandé)

On garde `dev_merge_test` comme base, puis on crée une branche de session:

```bash
git checkout dev_merge_test
git pull --ff-only origin dev_merge_test
git checkout -b merge/dashboards_2026-04-09
```

## 5) Ordre de merge recommandé

Ordre recommandé ici:
1. Merge `origin/dev_v1` (analytique)
2. Merge `origin/dev_v2` (cartographique)

Commandes:

```bash
git merge --no-ff origin/dev_v1 -m "merge: integration dashboard analytique (dev_v1)"
git merge --no-ff origin/dev_v2 -m "merge: integration dashboard cartographique (dev_v2)"
```

Pourquoi `--no-ff`:
- Conserver explicitement l'historique des contributions de chaque intégratrice.

## 6) Logique métier de résolution des conflits

Quand conflit, prioriser par zone fonctionnelle:

1. Dashboard Analytique (`dev_v1` prioritaire):
- `frontend/src/components/Climate/**`
- `frontend/src/pages/DashboardAnalytique*`
- composants KPI / séries / filtres analytiques

2. Dashboard Cartographique (`dev_v2` prioritaire):
- `frontend/src/pages/Dashboard2*`
- `frontend/src/components/Map/**`
- couches, styles map, interactions maplibre

3. Zones partagées (fusion manuelle obligatoire):
- `frontend/src/api/**`
- `frontend/src/router*`, `frontend/src/App.tsx`
- `backend/app/**` endpoints utilisés par les 2 dashboards

Commandes utiles en conflit:

```bash
git status
git diff --name-only --diff-filter=U
```

Pour choisir une version fichier (à utiliser avec prudence):

```bash
git checkout --ours <fichier>
git checkout --theirs <fichier>
```

Puis finaliser:

```bash
git add <fichier>
git commit
```

## 7) Validation obligatoire après merge

### Frontend
```bash
npm --prefix frontend install
npm --prefix frontend run build
```

### Backend (minimum)
```bash
micromamba run -n sad_backend python -m py_compile backend/app/main.py backend/app/routers/layers.py
```

### Contrôles fonctionnels à faire
1. `/dashboard-analytique`: mode simple et multiple chargent bien valeurs + dates.
2. `/dashboard-2` (carto): couches se chargent, filtres fonctionnent, pas d'erreur console bloquante.
3. Navigation globale: sidebar / routes intactes.

## 8) Publication de la branche intégrée

```bash
git push -u origin merge/dashboards_2026-04-09
```

Puis ouvrir PR:
- Source: `merge/dashboards_2026-04-09`
- Cible: `dev_merge_test` (ou `dev`, selon ton process interne)

## 9) Finalisation vers branche cible

Après validation PR:

```bash
git checkout dev_merge_test
git pull --ff-only origin dev_merge_test
git merge --ff-only merge/dashboards_2026-04-09
git push origin dev_merge_test
```

Puis PR finale vers `main` quand QA/recette validée.

## 10) Plan de rollback (si incident)

1. Identifier le commit avant intégration:
```bash
git log --oneline --decorate -n 20
```

2. Créer un correctif de rollback sans casser l'historique partagé:
```bash
git revert -m 1 <merge_commit_sha>
git push origin <branche_cible>
```

## 11) Recommandations d'organisation (à garder)

1. Une branche par domaine (`feature/analytics-*`, `feature/map-*`) au lieu de pousser directement sur `dev_v1/dev_v2`.
2. PR obligatoire + revue croisée avant merge.
3. Convention de commit claire (ex: `feat(analytics): ...`, `fix(map): ...`).
4. Fichier `CODEOWNERS` pour imposer reviewer analytique/carto sur dossiers clés.
5. Check CI minimal (build frontend + tests backend) bloquant avant merge.

---

## Checklist rapide (copier/coller)

```bash
git fetch --all --prune
git checkout dev_merge_test
git pull --ff-only origin dev_merge_test
git checkout -b merge/dashboards_2026-04-09
git merge --no-ff origin/dev_v1 -m "merge: integration dashboard analytique (dev_v1)"
git merge --no-ff origin/dev_v2 -m "merge: integration dashboard cartographique (dev_v2)"
npm --prefix frontend run build
micromamba run -n sad_backend python -m py_compile backend/app/main.py backend/app/routers/layers.py
git push -u origin merge/dashboards_2026-04-09
```
