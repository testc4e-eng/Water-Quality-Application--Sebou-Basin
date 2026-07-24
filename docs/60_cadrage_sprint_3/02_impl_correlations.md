# Sprint 3 — Implémentation des corrélations multi-domaines

## 1. Objectif

Permettre à l'utilisateur du **Dashboard Carte Métier Analytique** de sélectionner deux séries temporelles dans son workspace et d'afficher leur corrélation (scatter plot + régression linéaire + coefficient R²).

**Contraintes respectées :**
- TIME_SERIES uniquement ; les POINT_MEASURE sont exclus.
- Minimum 2 séries, maximum 5 pour la matrice (bonus).
- Pas de mock.
- Dashboard DG et Dashboard Qualité non impactés.

---

## 2. Architecture

```
DashboardCartoMetier.tsx
└── AnalysisWorkspace.tsx
    ├── Toolbar ("Corrélations")
    ├── CorrelationPanel.tsx
    └── widgets (chart / table / correlation)
        └── WidgetCorrelation.tsx
```

---

## 3. Backend

### 3.1 Modèles (`backend/app/models/analysis_models.py`)

- `CorrelationRequest` : 2 à 5 séries + période + agrégation.
- `CorrelationResponse` : résultat ou erreur métier.
- `CorrelationMatrixRequest/Response` : matrice N×N de Pearson r.

### 3.2 Service (`backend/app/services/analysis_service.py`)

- `calculate_correlation(db, request)` :
  1. Réutilise `process_batch_series` pour récupérer les séries.
  2. Vérifie `series_type == "TIME_SERIES"`.
  3. Aligne les dates par resampling pandas à la fréquence effective (raw → daily).
  4. Calcule Pearson r, R², p-value, slope/intercept via `scipy.stats.linregress`.
  5. Génère la ligne de régression sur `[min(x), max(x)]`.
  6. Retourne une erreur métier si :
     - moins de 2 points communs → `NO_OVERLAP`
     - série ponctuelle → `NOT_TIME_SERIES`
     - variance nulle → `NO_CORRELATION`

- `calculate_correlation_matrix(db, request)` :
  - Calcule une matrice symétrique de Pearson r entre 3 et 5 séries.
  - Retourne `null` pour les paires dégénérées.

### 3.3 Routes (`backend/app/routers/analysis.py`)

- `POST /api/v1/business-map/analysis/correlation`
- `POST /api/v1/business-map/analysis/correlation/matrix`

---

## 4. Frontend

### 4.1 Types & API (`frontend/src/api/analysis.ts`)

- Ajout des interfaces `CorrelationRequest`, `CorrelationResponse`, `CorrelationStats`, etc.
- `fetchCorrelation` et `fetchCorrelationMatrix` appelant les nouveaux endpoints.

### 4.2 Store (`frontend/src/store/workspaceStore.ts`)

- Ajout du type de widget `'correlation'`.
- Ajout de `correlationData?: CorrelationResponse` sur `AnalysisWidgetState`.
- Ajout des états/actions du panneau de corrélation :
  - `isCorrelationPanelOpen`, `correlationSeriesX/Y`, `correlationResult`
  - `open/closeCorrelationPanel`, `setCorrelationSeriesX/Y`, `setCorrelationResult`, `resetCorrelation`
  - `addCorrelationWidget(data)`

### 4.3 Hook (`frontend/src/hooks/useCorrelation.ts`)

- `useMutation` déclenchée manuellement par le bouton **Calculer**.
- Période et agrégation lues depuis le store global.

### 4.4 Panneau (`frontend/src/components/analysis-workspace/CorrelationPanel.tsx`)

- Liste filtrée des séries TIME_SERIES actuellement dans le workspace.
- Sélection Série X / Série Y.
- Bouton "Calculer la corrélation".
- Affichage des métriques (R², Pearson r, n points, p-value) ou des erreurs (`NO_OVERLAP`, `NOT_TIME_SERIES`, `NO_CORRELATION`).
- Bouton "Ajouter au workspace".

### 4.5 Widget (`frontend/src/components/analysis-workspace/WidgetCorrelation.tsx`)

- Scatter plot (`ComposedChart` Recharts) + ligne de régression orange.
- Barre de métriques violette (R², r, n).
- Export PNG via `html2canvas`.
- Bordure violette distinctive.

### 4.6 Intégration

- `AnalysisWorkspace.tsx` : bouton "Corrélations" (désactivé si < 2 séries temporelles) + rendu conditionnel du panneau.
- `AnalysisWidget.tsx` : dispatch du type `'correlation'` vers `WidgetCorrelation`.

---

## 5. Gestion des erreurs

| Erreur backend | Cas | Affichage frontend |
|---|---|---|
| `NOT_TIME_SERIES` | Une série est POINT_MEASURE | Message explicite dans le panneau |
| `NO_OVERLAP` | Pas de période commune | Message explicite + invite à changer la période |
| `NO_CORRELATION` | Série constante sur la période commune | Message explicite |

Le panneau gère aussi localement le cas où le backend retourne un résultat sans objet `correlation`.

---

## 6. Matrice de corrélation (bonus)

- Endpoint backend `/correlation/matrix` implémenté.
- Pas d'interface dédiée dans cette itération ; peut être ajoutée dans une US suivante.

---

## 7. Fichiers modifiés / créés

**Backend**
- `backend/app/models/analysis_models.py`
- `backend/app/services/analysis_service.py`
- `backend/app/routers/analysis.py`

**Frontend**
- `frontend/src/api/analysis.ts`
- `frontend/src/store/workspaceStore.ts`
- `frontend/src/hooks/useCorrelation.ts` (créé)
- `frontend/src/components/analysis-workspace/CorrelationPanel.tsx` (créé)
- `frontend/src/components/analysis-workspace/WidgetCorrelation.tsx` (créé)
- `frontend/src/components/analysis-workspace/AnalysisWorkspace.tsx`
- `frontend/src/components/analysis-workspace/AnalysisWidget.tsx`
