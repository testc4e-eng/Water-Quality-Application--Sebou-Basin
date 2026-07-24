# Sprint 3 — Tests des corrélations multi-domaines

## 1. Tests backend

### 1.1 Endpoint `/correlation` — succès

```bash
curl -s -X POST http://localhost:8010/api/v1/business-map/analysis/correlation \
  -H "Content-Type: application/json" \
  -d '{
    "series": [
      {"object_id": "01f1a32a-f424-4f5b-ab26-6cb57a601d81", "parameter_code": "PH", "domain": "QUALITE", "support_type": "STATION_QUALITE"},
      {"object_id": "01f1a32a-f424-4f5b-ab26-6cb57a601d81", "parameter_code": "DBO5", "domain": "QUALITE", "support_type": "STATION_QUALITE"}
    ],
    "date_from": "1990-01-01",
    "date_to": "2025-12-31",
    "aggregation": "monthly"
  }' | python -m json.tool
```

**Résultat attendu :**
- `error: null`
- `correlation.pearson_r` et `correlation.r_squared` entre 0 et 1
- `correlation.n_points >= 2`
- `regression_line` contient 2 points

**Observé :**
```json
{
  "correlation": {
    "pearson_r": 0.1927729286255922,
    "r_squared": 0.03716140201088766,
    "slope": 3.031922851827405,
    "intercept": -21.72822550219243,
    "p_value": 0.8072270713744079,
    "n_points": 4
  }
}
```

### 1.2 Endpoint `/correlation` — NO_OVERLAP

```bash
curl -s -X POST http://localhost:8010/api/v1/business-map/analysis/correlation \
  -H "Content-Type: application/json" \
  -d '{
    "series": [
      {"object_id": "01f1a32a-f424-4f5b-ab26-6cb57a601d81", "parameter_code": "PH", "domain": "QUALITE", "support_type": "STATION_QUALITE"},
      {"object_id": "01f1a32a-f424-4f5b-ab26-6cb57a601d81", "parameter_code": "DBO5", "domain": "QUALITE", "support_type": "STATION_QUALITE"}
    ],
    "date_from": "2020-01-01",
    "date_to": "2025-12-31",
    "aggregation": "monthly"
  }' | python -m json.tool
```

**Résultat attendu :** `{"error": "NO_OVERLAP", ...}`

### 1.3 Endpoint `/correlation` — NOT_TIME_SERIES

```bash
curl -s -X POST http://localhost:8010/api/v1/business-map/analysis/correlation \
  -H "Content-Type: application/json" \
  -d '{
    "series": [
      {"object_id": "01f1a32a-f424-4f5b-ab26-6cb57a601d81", "parameter_code": "PH", "domain": "QUALITE", "support_type": "STATION_QUALITE"},
      {"object_id": "0436c345-452d-4239-a3e3-2842fd3ab7b1", "parameter_code": "CD", "domain": "POLLUTION", "support_type": "POINT_PRELEVEMENT_POLLUTION"}
    ],
    "date_from": "1990-01-01",
    "date_to": "2025-12-31",
    "aggregation": "monthly"
  }' | python -m json.tool
```

**Résultat attendu :** `{"error": "NOT_TIME_SERIES", ...}`

### 1.4 Endpoint `/correlation` — NO_CORRELATION (série constante)

```bash
curl -s -X POST http://localhost:8010/api/v1/business-map/analysis/correlation \
  -H "Content-Type: application/json" \
  -d '{
    "series": [
      {"object_id": "0436c345-452d-4239-a3e3-2842fd3ab7b1", "parameter_code": "AS", "domain": "QUALITE", "support_type": "STATION_QUALITE"},
      {"object_id": "0436c345-452d-4239-a3e3-2842fd3ab7b1", "parameter_code": "DBO5", "domain": "QUALITE", "support_type": "STATION_QUALITE"}
    ],
    "date_from": "1990-01-01",
    "date_to": "2025-12-31",
    "aggregation": "monthly"
  }' | python -m json.tool
```

**Résultat attendu :** `{"error": "NO_CORRELATION", ...}`

### 1.5 Endpoint `/correlation/matrix` — succès

```bash
curl -s -X POST http://localhost:8010/api/v1/business-map/analysis/correlation/matrix \
  -H "Content-Type: application/json" \
  -d '{
    "series": [
      {"object_id": "0436c345-452d-4239-a3e3-2842fd3ab7b1", "parameter_code": "PH", "domain": "QUALITE", "support_type": "STATION_QUALITE"},
      {"object_id": "0436c345-452d-4239-a3e3-2842fd3ab7b1", "parameter_code": "AS", "domain": "QUALITE", "support_type": "STATION_QUALITE"},
      {"object_id": "0436c345-452d-4239-a3e3-2842fd3ab7b1", "parameter_code": "DBO5", "domain": "QUALITE", "support_type": "STATION_QUALITE"}
    ],
    "date_from": "1990-01-01",
    "date_to": "2025-12-31",
    "aggregation": "monthly"
  }' | python -m json.tool
```

**Résultat attendu :** matrice 3×3 avec `1.0` sur la diagonale.

---

## 2. Tests frontend E2E

### 2.1 Scénario nominal

1. Ouvrir `/dashboard-carto-metier`.
2. Ajouter au workspace :
   - `PH — P29 a allal tazi (QUALITE)`
   - `DBO5 — P29 a allal tazi (QUALITE)`
3. Synchroniser la période sur `1990-01-01 → 2025-12-31`.
4. Cliquer **Corrélations**.
5. Sélectionner Série X = PH, Série Y = DBO5.
6. Cliquer **Calculer**.

**Résultat attendu :**
- R² affiché (ex: 0.04)
- Pearson r affiché (ex: 0.19)
- n points > 0 (ex: 4)
- p-value affichée

### 2.2 Ajout du widget

1. Cliquer **Ajouter au workspace**.
2. Fermer le panneau de corrélation.

**Résultat attendu :**
- Un widget `PH × DBO5 — Corrélation` apparaît.
- Il affiche la barre violette `R² = ... / r = ... / n = ...`.
- Le widget est déplaçable et redimensionnable.

### 2.3 Bouton désactivé

1. Vider le workspace ou n'y laisser qu'une seule série temporelle.

**Résultat attendu :**
- Le bouton **Corrélations** est grisé.
- Tooltip : "Sélectionnez au moins 2 séries temporelles..."

### 2.4 Gestion des erreurs

- Sélectionner deux séries sans chevauchement temporel → message `NO_OVERLAP`.
- Sélectionner une série POINT_MEASURE → elle n'apparaît pas dans la liste (filtrée).

### 2.5 Build

```bash
cd frontend
npm run build
```

**Résultat :** ✅ build réussi (warnings de chunk size uniquement).

---

## 3. Preuves

- Capture : [`correlation_panel_no_overlap.png`](./correlation_panel_no_overlap.png) — panneau ouvert avec erreur `NO_OVERLAP`.
- Capture : [`correlation_widget_scatter.png`](./correlation_widget_scatter.png) — widget de corrélation avec scatter plot, ligne de régression orange et métriques R² / r / n.
- Logs backend : endpoint `/correlation` actif sur `localhost:8010`.
