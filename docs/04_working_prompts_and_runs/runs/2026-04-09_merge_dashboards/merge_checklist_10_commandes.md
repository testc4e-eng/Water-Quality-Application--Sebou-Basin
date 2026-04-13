# Checklist courte - 10 commandes (équipe)

Date: 2026-04-09  
Branches utilisées: `dev_merge_test`, `origin/dev_v1`, `origin/dev_v2`

## Pré-requis

- Working tree propre (`git status` sans changement local non commité).
- Freeze temporaire des pushes sur `dev_merge_test`, `dev_v1`, `dev_v2` pendant l'intégration.
- Être dans le dossier racine du repo.

## Les 10 commandes (copier/coller)

```bash
git fetch --all --prune
git status
git checkout dev_merge_test
git pull --ff-only origin dev_merge_test
git checkout -b merge/dashboards_2026-04-09
git merge --no-ff origin/dev_v1 -m "merge: integration dashboard analytique (dev_v1)"
git merge --no-ff origin/dev_v2 -m "merge: integration dashboard cartographique (dev_v2)"
npm --prefix frontend run build
micromamba run -n sad_backend python -m py_compile backend/app/main.py backend/app/routers/layers.py
git push -u origin merge/dashboards_2026-04-09
```

## Explication commande par commande

### 1) `git fetch --all --prune`

Pourquoi:
- Récupère toutes les mises à jour distantes.
- Supprime les références locales de branches distantes supprimées.

Cas d'utilisation:
- Toujours en début d'intégration multi-branches.

Point d'attention:
- Cette commande ne modifie pas tes fichiers de travail, elle met à jour les références.

### 2) `git status`

Pourquoi:
- Vérifie que l'arbre local est propre.

Cas d'utilisation:
- Avant `checkout`, `pull`, `merge`.

Point d'attention:
- Si des fichiers modifiés apparaissent, committer ou stasher avant de continuer.

### 3) `git checkout dev_merge_test`

Pourquoi:
- Se positionner sur la branche de base d'intégration.

Cas d'utilisation:
- Point de départ unique pour préparer la branche de merge.

Point d'attention:
- Vérifier que `dev_merge_test` locale existe. Sinon: `git checkout -b dev_merge_test origin/dev_merge_test`.

### 4) `git pull --ff-only origin dev_merge_test`

Pourquoi:
- Aligner ta base locale avec le remote sans créer de merge parasite.

Cas d'utilisation:
- Synchronisation stricte de la branche de base.

Point d'attention:
- Si `--ff-only` échoue, c'est qu'il y a divergence locale: corriger avant de poursuivre.

### 5) `git checkout -b merge/dashboards_2026-04-09`

Pourquoi:
- Créer une branche dédiée à la session de fusion.

Cas d'utilisation:
- Travailler le merge sans impacter immédiatement `dev_merge_test`.

Point d'attention:
- Nommer la branche avec date/version pour traçabilité.

### 6) `git merge --no-ff origin/dev_v1 -m "merge: integration dashboard analytique (dev_v1)"`

Pourquoi:
- Intégrer les changements de l'intégratrice analytique avec un commit de merge explicite.

Cas d'utilisation:
- Première fusion fonctionnelle (domaine analytique).

Point d'attention:
- Si conflit: résoudre, puis `git add <fichier>` et `git commit`.

### 7) `git merge --no-ff origin/dev_v2 -m "merge: integration dashboard cartographique (dev_v2)"`

Pourquoi:
- Intégrer les changements cartographiques après `dev_v1`.

Cas d'utilisation:
- Deuxième fusion fonctionnelle (domaine carto/map).

Point d'attention:
- Revalider les zones partagées (`api`, `routes`, composants communs) en priorité.

### 8) `npm --prefix frontend run build`

Pourquoi:
- Vérifier la compilation front après fusion.

Cas d'utilisation:
- Validation technique obligatoire avant push.

Point d'attention:
- Si build KO: corriger avant push. Ne pas ouvrir de PR avec build cassé.

### 9) `micromamba run -n sad_backend python -m py_compile backend/app/main.py backend/app/routers/layers.py`

Pourquoi:
- Vérifier rapidement la validité syntaxique Python backend sur fichiers sensibles.

Cas d'utilisation:
- Contrôle backend minimal en l'absence de tests automatiques complets.

Point d'attention:
- Si erreur de syntaxe, ne pas pousser tant que non corrigé.

### 10) `git push -u origin merge/dashboards_2026-04-09`

Pourquoi:
- Publier la branche d'intégration pour revue/PR.

Cas d'utilisation:
- Fin de session de merge locale validée.

Point d'attention:
- Ouvrir ensuite une PR vers `dev_merge_test` (ou `dev` selon process).

## À faire

- Geler les pushes pendant l'intégration.
- Garder des commits de merge lisibles et explicites.
- Tester au minimum les 2 dashboards (`/dashboard-analytique` et `/dashboard-2`) après merge.
- Résoudre les conflits par logique métier, pas au hasard.
- Documenter dans la PR les conflits traités et les arbitrages.

## À ne pas faire

- Ne pas utiliser `git reset --hard` sur branches partagées.
- Ne pas forcer un push (`--force`) sur branches d'équipe sauf procédure exceptionnelle validée.
- Ne pas mélanger corrections non liées au merge dans la même PR.
- Ne pas ignorer un build cassé.
- Ne pas merger directement sur `main` sans validation de `dev_merge_test`/`dev`.

## Procédure rapide en cas de conflit

```bash
git status
git diff --name-only --diff-filter=U
```

Puis:
- corriger les fichiers en conflit,
- `git add <fichier>`,
- `git commit`,
- reprendre la checklist.
