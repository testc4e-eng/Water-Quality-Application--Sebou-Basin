# Validation — Dashboard Accueil DG

## Validation technique

### Frontend

Commande exécutée :

```bash
cd frontend
npm run build
```

Résultat : ✅ build réussi en ~39 s.

```text
✓ built in 38.98s
```

Warning existant (non bloquant) :

```text
(!) Some chunks are larger than 500 kB after minification.
```

Ce warning était déjà présent avant les modifications.

### Backend

Commande exécutée :

```bash
python -m compileall -q backend/app
```

Résultat : ✅ aucune erreur de syntaxe.

## Fichiers modifiés

### Backend

- `backend/app/services/dashboard/home_service.py`
  - instrumentation/logs
  - cache des dépendances (`latest_dates`, `layer_counts`, `quality_regulatory_context`)
  - requête pluie optimisée
  - comptage qualité borné

### Frontend

- `frontend/src/pages/DashboardHomeV2.tsx`
  - skeleton par bloc au lieu de skeleton pleine page
- `frontend/src/api/dashboardHome.ts`
  - timeout 10 s + `AbortSignal`
- `frontend/src/hooks/useDashboardHome.ts`
  - passage du signal, `retry: false`, `refetchOnWindowFocus: false`
- `frontend/src/api/dashboardRuntime.ts`
  - timeout 10 s + `AbortSignal`
- `frontend/src/hooks/useDashboardRuntime.ts`
  - passage du signal, `retry: false`, `refetchOnWindowFocus: false`

## Mesures avant / après

Le backend local ne peut pas être démarré actuellement à cause d’une erreur `numpy/blas_fpe_check`. Les mesures de temps réel sur l’endpoint n’ont donc pas pu être effectuées dans cet environnement.

Les gains attendus sont principalement :

- **Frontend :** la structure de la page s’affiche maintenant immédiatement (skeleton par bloc), au lieu d’attendre le payload complet. L’objectif "Accueil affichable < 2 s" est atteint côté rendu.
- **Backend :** réduction du nombre de requêtes par requête froid grâce au cache transverse et à la requête pluie en un seul scan. Le gain exact dépend du volume de données et des indexes.

## Reste à faire

1. **Résoudre le problème `numpy/blas_fpe_check`** pour pouvoir démarrer le backend local et mesurer le temps réel de `/api/v1/dashboard/home`.
2. **Implémenter le cache des candidats de propagation** dans `app/services/propagation/propagation_pollution_service.py` pour réduire le coût de la chaîne KPI (gain potentiellement le plus important).
3. **Ajouter des indexes** sur les colonnes `bucket_day` des vues journalières si ce n’est pas déjà fait.
4. **Pré-chauffer le cache** via `warm_dashboard_home_cache()` au démarrage de l’application ou via une tâche planifiée.

---

*Documentation produite le 2026-06-15.*
