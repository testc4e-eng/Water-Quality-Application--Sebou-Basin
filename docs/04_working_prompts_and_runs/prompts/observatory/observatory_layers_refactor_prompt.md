# 🎯 PROMPT ENRICHI – Refactorisation du Module "Couches d'Observatoire"
## Projet : SAD_SEBOU — Dashboard Cartographique (MapLibre GL + FastAPI + PostgreSQL/PostGIS)

---

## 📌 CONTEXTE TECHNIQUE RÉEL DU PROJET

### Stack
- **Frontend** : React + TypeScript + Vite + MapLibre GL (via `maplibre-gl`)
- **Backend** : FastAPI (Python), préfixe API `/api/v1`
- **Base de données** : PostgreSQL + PostGIS
- **Style** : TailwindCSS (fichier `tailwind.config.ts` existant)

### Fichiers clés à modifier / créer

#### Frontend (`frontend/src/`)
```
components/Map/
├── InteractiveMap.jsx        ← carte MapLibre, markers custom (à enrichir)
├── LayerControls.jsx         ← STUB vide → REFACTORISER COMPLÈTEMENT
├── MapLegend.jsx             ← STUB vide → CRÉER
├── MapTooltip.jsx            ← STUB minimal → ENRICHIR
└── StationMapPanel.jsx       ← panneau station existant

layers/
└── config.ts                 ← config LAYERS[] + DEFAULT_TOGGLES (à étendre)

pages/
├── Dashboard1.tsx            ← dashboard principal (14 Ko)
└── Dashboard2.tsx            ← dashboard secondaire (27 Ko)
```

#### Backend (`backend/app/`)
```
routers/
├── layers.py                 ← LAYER_MAP complet avec 22 couches
├── geojson.py               ← endpoint /geojson/{layer_key}
├── hydro.py                 ← /hydro/stations, /timeseries, /kpis
├── quality.py               ← /quality/stations, /parameters, /timeseries
├── climate.py               ← /climate/stations, /timeseries, /kpis
└── entities.py              ← /stations, /barrages
```

---

## 🗄️ CARTOGRAPHIE RÉELLE DE LA BASE DE DONNÉES

### Vues GeoJSON exposées (schéma `api`)
Ces vues sont directement consommées par le `LAYER_MAP` dans `layers.py` :

| Vue API                                          | Couche frontend (key)         | Domaine        |
|--------------------------------------------------|-------------------------------|----------------|
| `api.v_bassin_geojson`                           | `bassin_sebou`                | Géo – Bassin   |
| `api.v_sous_bassin_geojson`                      | `sous_bassin_sebou`           | Géo – Bassin   |
| `api.v_sous_bassin_swat_geojson`                 | `sous_bassins_swat`           | Géo – Modèle   |
| `api.v_nappes_geojson`                           | `nappes`                      | Géo – Hydro    |
| `api.v_sources_geojson`                          | `sources`                     | Géo – Infra    |
| `api.v_reseau_hydrographique_geojson`            | `reseau_hydro_abhs`           | Géo – Réseau   |
| `api.v_barrage_dimension`                        | `barrages_abhs`               | Infra          |
| `api.v_station_dimension`                        | `stations_abhs`               | Infra          |
| `api.v_profils_stations`                         | `stations_abhs` (fallback)    | Infra          |
| `api.v_points_eau`                               | `points_eau`                  | Infra – Eau    |
| `api.v_inventaire_pollution_decharges_consolide` | `decharges_abhs`              | Pollution      |
| `api.v_inventaire_pollution_huileries_detail`    | `huileries_abhs`              | Pollution      |
| `api.v_inventaire_pollution_mines_detail`        | `mines_abhs`                  | Pollution      |
| `api.v_inventaire_pollution_rejets_bruts_detail` | `rejets_domestiques_abhs`     | Pollution      |
| `api.v_inventaire_pollution_steps_detail`        | `step_abhs`                   | Pollution      |
| `api.v_inventaire_pollution_steps_industrielles_detail` | `step_industrielles`   | Pollution      |
| `api.v_step_industrielles`                       | `step_industrielles`          | Pollution      |
| `api.v_stm`                                      | `stm`                         | Pollution      |

### Tables administratives (schéma `admin`)
```
admin.regions        → adm_regions_abhs    (simplify 50m)
admin.provinces      → adm_provinces_abhs  (simplify 25m)
admin.cercle         → adm_cercles_abhs    (simplify 10m)
admin.communes       → adm_communes_abhs   (simplify 5m)
admin.localite       → adm_douars_abhs
```

### Tables de mesures temps-réel (schéma `public`)
```
public.mesures_qualite_rivieres   → paramètres: NO3, pH, DBO5, DCO, O2, MES
public.mesures_qualite_barrages   → paramètres qualité barrages
```

### Vues métier (schéma `api`)
```
api.v_hydro_debit_mensuel               → débit mensuel (m³/s), monthly/annual
api.v_meteo_precipitation_annuelle_max  → pluie max et annuelle (mm)
api.v_station_dimension                 → dimension stations (type, coords, code)
```

### Champs clés des vues de mesure

**`api.v_hydro_debit_mensuel`**
```sql
legacy_station_id  -- clé de jointure stations
bucket_month       -- date (agrégation mensuelle)
valeur_moy_m3s     -- débit moyen en m³/s
type_station       -- 'hydrologique'
```

**`api.v_meteo_precipitation_annuelle_max`**
```sql
station_id         -- clé de jointure
annee              -- année (integer)
p_max              -- précipitation max annuelle (mm)
p_annuelle         -- précipitation totale annuelle (mm)
```

**`public.mesures_qualite_rivieres`**
```sql
ire_station        -- code station (TEXT, ex: '1000/23')
date_prelevement   -- date de prélèvement
parametre_qualite  -- nom du paramètre (NO3, pH, DBO5, DCO, O2, MES)
val_qual_riv       -- valeur mesurée
```

**`api.v_points_eau`**
```sql
point_eau_id, nom_pt_eau, code_pt_eau
vol_preleve_m3_an      -- volume prélevé (m3/an)
niv_piezometrique_m    -- niveau piézométrique (m)
profond_tot_m          -- profondeur totale (m)
dist_pt_eau_foyer_pollut_m  -- distance foyer pollution (m)
nature, utilisation, foyer_pollution
```

---

## 🔌 ENDPOINTS FASTAPI EXISTANTS (à réutiliser)

### Couches GeoJSON
```
GET /api/v1/layers/{layer_key}
    ?ids=        (filtre par IDs, virgule-séparés)
    ?bbox=       (minx,miny,maxx,maxy en WGS84)
    ?max_features= (défaut 5000, max 50000)

GET /api/v1/layers/{layer_key}/names
    → retourne [{id, label}] pour les listes de sélection

Clés disponibles (22 couches) :
  bassin_sebou, sous_bassin_sebou, sous_bassins_swat,
  nappes, sources, reseau_hydro_abhs, barrages_abhs, stations_abhs,
  points_eau, decharges_abhs, huileries_abhs, mines_abhs,
  rejets_industriels_abhs, rejets_domestiques_abhs,
  step_abhs, step_industrielles, stm,
  adm_regions_abhs, adm_provinces_abhs, adm_cercles_abhs,
  adm_communes_abhs, adm_villes_abhs, adm_douars_abhs
```

### Données météo/climat
```
GET /api/v1/climate/stations
    → [{station_id, station_code, station_name}]

GET /api/v1/climate/station-stats?station_id=…
    → métadonnées série (ts_id="{id}|p_max" ou "{id}|p_annuelle", dt_min, dt_max)

GET /api/v1/climate/timeseries?ts_id=…&time_step=annual&date_start=…&date_end=…
    → [{datetime, value}] (valeur en mm)

GET /api/v1/climate/kpis?ts_id=…&time_step=annual
    → {min, max, mean}
```

### Données hydrologiques (débit)
```
GET /api/v1/hydro/stations
    → [{station_id, station_code, station_name}] (filtrés type hydrologique)

GET /api/v1/hydro/stats?station_id=…
    → [{ts_id, property_name, time_step, dt_min, dt_max}]

GET /api/v1/hydro/timeseries?ts_id=…&aggregation=monthly|annual&date_start=…&date_end=…
    → [{datetime, value}] (valeur en m³/s)

GET /api/v1/hydro/kpis?ts_id=…&aggregation=…&date_start=…&date_end=…
    → {min, max, mean}

GET /api/v1/hydro/points-eau
    → [{point_id, point_name}]
```

### Données qualité de l'eau
```
GET /api/v1/quality/stations
    → [{station_id, station_name, dt_min, dt_max, n_mesures}]
    Source: public.mesures_qualite_rivieres JOIN api.v_station_dimension

GET /api/v1/quality/parameters?station_id=…
    → [{parameter, n_mesures}]
    Paramètres disponibles: NO3, pH, DBO5, DCO, O2, MES

GET /api/v1/quality/timeseries?station_id=…&date_start=…&date_end=…
    → [{date, no3, ph, dbo5, dco, o2, mes}]

GET /api/v1/quality/inventory/rows
    → inventaire pollution (Points d'eau, STEP industrielles, STM)
```

### Entités simples (format JSON plat)
```
GET /api/v1/stations
    → [{id, name, lat, lon}] depuis public.stations_abhs

GET /api/v1/barrages
    → [{id, ire, nom_barrage, nom_oued, statut, vrn_hm3, hauteur, coord_x, coord_y}]
    depuis api.v_barrage_dimension

GET /api/v1/barrages/{id}/quality-parameters
    → [{parameter, date_min, date_max}]

GET /api/v1/barrages/{id}/quality-series?parameter=pH&aggregation=monthly
    → [{datetime, parameter, value}]
```

### Métadonnées BD
```
GET /api/v1/meta/dictionary?schema=…    → dictionnaire complet (JSON)
GET /api/v1/meta/api-catalog            → liste vues api.* documentées
GET /api/v1/meta/api-column-catalog     → colonnes des vues API
```

---

## 🏗️ OBJECTIF DE REFACTORISATION

### 1. Séparation GÉOGRAPHIQUE vs MÉTIER dans `layers/config.ts`

**Restructurer** le fichier `frontend/src/layers/config.ts` en deux catégories explicites :

```typescript
// CATÉGORIE 1 : Entités géographiques (statiques, toujours visibles)
export const GEO_LAYERS = [
  // Géographie du bassin
  { key: "bassin_sebou",        label: "Bassin du Sebou",        group: "Bassin versant", type: "polygon" },
  { key: "sous_bassin_sebou",   label: "Sous-bassins ABH",       group: "Bassin versant", type: "polygon" },
  { key: "sous_bassins_swat",   label: "Sous-bassins SWAT",      group: "Bassin versant", type: "polygon" },
  { key: "reseau_hydro_abhs",   label: "Réseau hydrographique",  group: "Bassin versant", type: "line" },
  { key: "nappes",              label: "Nappes phréatiques",     group: "Bassin versant", type: "polygon" },
  // Infrastructure
  { key: "stations_abhs",       label: "Stations hydrologiques", group: "Infrastructure", type: "point" },
  { key: "barrages_abhs",       label: "Barrages",               group: "Infrastructure", type: "point" },
  { key: "sources",             label: "Sources",                group: "Infrastructure", type: "point" },
  { key: "points_eau",          label: "Points d'eau",           group: "Infrastructure", type: "point" },
  // Administratif
  { key: "adm_regions_abhs",    label: "Régions",                group: "Administratif",  type: "polygon" },
  { key: "adm_provinces_abhs",  label: "Provinces",              group: "Administratif",  type: "polygon" },
  { key: "adm_communes_abhs",   label: "Communes",               group: "Administratif",  type: "polygon" },
];

// CATÉGORIE 2 : Données métier (dynamiques, pilotées par les données)
export const BUSINESS_LAYERS = [
  // Méteo & Climat → endpoint: /api/v1/climate/
  {
    key: "precip_stations",
    label: "Précipitation",
    group: "Météo & Climat",
    apiEndpoint: "/api/v1/climate/stations",
    dataEndpoint: "/api/v1/climate/timeseries",
    geoLayers: ["stations_abhs"],       // couches geo sous-jacentes avec données
    paramKey: "precipitation",
    unit: "mm",
    colorScale: "Blues",
    renderType: "graduated_point",      // symboles proportionnels
    valueRange: [0, 500],
    classes: [
      { min: 0,   max: 50,  color: "#dbeafe", label: "< 50 mm" },
      { min: 50,  max: 150, color: "#93c5fd", label: "50–150 mm" },
      { min: 150, max: 300, color: "#3b82f6", label: "150–300 mm" },
      { min: 300, max: null, color: "#1e3a8a", label: "> 300 mm" },
    ],
  },
  // Hydrologie → endpoint: /api/v1/hydro/
  {
    key: "debit_stations",
    label: "Débit",
    group: "Hydrologie",
    apiEndpoint: "/api/v1/hydro/stations",
    dataEndpoint: "/api/v1/hydro/timeseries",
    geoLayers: ["stations_abhs"],
    paramKey: "debit",
    unit: "m³/s",
    colorScale: "GnBu",
    renderType: "graduated_point",
    valueRange: [0, 500],
    classes: [
      { min: 0,   max: 5,   color: "#f0fdf4", label: "< 5 m³/s" },
      { min: 5,   max: 50,  color: "#86efac", label: "5–50 m³/s" },
      { min: 50,  max: 200, color: "#22c55e", label: "50–200 m³/s" },
      { min: 200, max: null, color: "#14532d", label: "> 200 m³/s" },
    ],
  },
  // Qualité de l'eau → endpoint: /api/v1/quality/
  {
    key: "quality_ph",
    label: "pH",
    group: "Qualité de l'eau",
    apiEndpoint: "/api/v1/quality/stations",
    dataEndpoint: "/api/v1/quality/timeseries",
    geoLayers: ["stations_abhs"],
    paramKey: "ph",
    unit: "pH",
    colorScale: "RdYlGn",
    renderType: "graduated_point",
    valueRange: [4, 10],
    classes: [
      { min: 0,   max: 6.5, color: "#ef4444", label: "Acide (< 6.5)" },
      { min: 6.5, max: 8.5, color: "#22c55e", label: "Normal (6.5–8.5)" },
      { min: 8.5, max: 14,  color: "#f97316", label: "Basique (> 8.5)" },
    ],
  },
  {
    key: "quality_o2",
    label: "Oxygène dissous",
    group: "Qualité de l'eau",
    apiEndpoint: "/api/v1/quality/stations",
    dataEndpoint: "/api/v1/quality/timeseries",
    geoLayers: ["stations_abhs"],
    paramKey: "o2",
    unit: "mg/L",
    colorScale: "Blues",
    renderType: "graduated_point",
    valueRange: [0, 15],
    classes: [
      { min: 0,  max: 4,  color: "#ef4444", label: "Critique (< 4 mg/L)" },
      { min: 4,  max: 7,  color: "#f97316", label: "Faible (4–7 mg/L)" },
      { min: 7,  max: null, color: "#22c55e", label: "Bon (> 7 mg/L)" },
    ],
  },
  {
    key: "quality_no3",
    label: "Nitrates (NO3)",
    group: "Qualité de l'eau",
    apiEndpoint: "/api/v1/quality/stations",
    dataEndpoint: "/api/v1/quality/timeseries",
    geoLayers: ["stations_abhs"],
    paramKey: "no3",
    unit: "mg/L",
    colorScale: "YlOrRd",
    renderType: "graduated_point",
    valueRange: [0, 100],
  },
  {
    key: "quality_dbo5",
    label: "DBO5",
    group: "Qualité de l'eau",
    apiEndpoint: "/api/v1/quality/stations",
    dataEndpoint: "/api/v1/quality/timeseries",
    geoLayers: ["stations_abhs"],
    paramKey: "dbo5",
    unit: "mg/L",
    colorScale: "YlOrRd",
    renderType: "graduated_point",
    valueRange: [0, 50],
  },
  {
    key: "quality_mes",
    label: "MES",
    group: "Qualité de l'eau",
    apiEndpoint: "/api/v1/quality/stations",
    dataEndpoint: "/api/v1/quality/timeseries",
    geoLayers: ["stations_abhs"],
    paramKey: "mes",
    unit: "mg/L",
    colorScale: "YlOrBr",
    renderType: "graduated_point",
    valueRange: [0, 500],
  },
  // Pollution → endpoint: /api/v1/quality/inventory/rows
  {
    key: "pollution_decharges",
    label: "Décharges",
    group: "Pollution",
    apiEndpoint: "/api/v1/layers/decharges_abhs",
    geoLayers: ["decharges_abhs"],
    paramKey: "decharge",
    unit: "entité",
    renderType: "cluster",
    iconColor: "#dc2626",
  },
  {
    key: "pollution_huileries",
    label: "Huileries",
    group: "Pollution",
    apiEndpoint: "/api/v1/layers/huileries_abhs",
    geoLayers: ["huileries_abhs"],
    paramKey: "huilerie",
    unit: "entité",
    renderType: "cluster",
    iconColor: "#86561a",
  },
  {
    key: "pollution_step",
    label: "STEP",
    group: "Pollution",
    apiEndpoint: "/api/v1/layers/step_abhs",
    geoLayers: ["step_abhs"],
    paramKey: "step",
    unit: "entité",
    renderType: "icon",
    iconColor: "#7c3aed",
  },
  {
    key: "pollution_rejets",
    label: "Rejets domestiques",
    group: "Pollution",
    apiEndpoint: "/api/v1/layers/rejets_domestiques_abhs",
    geoLayers: ["rejets_domestiques_abhs"],
    paramKey: "rejet",
    unit: "entité",
    renderType: "icon",
    iconColor: "#ea580c",
  },
];
```

---

### 2. Refactorisation de `LayerControls.jsx`

**Fichier actuel** : stub vide de 7 lignes (`// SWAT, WASP, IoT (à implémenter)`)

**À créer** : composant structuré en 2 blocs :

```jsx
// frontend/src/components/Map/LayerControls.jsx
// Props attendues :
// - geoToggles: Record<string, boolean>        → état des couches géo
// - onGeoToggle: (key: string) => void
// - activeBusinessLayer: string | null          → couche métier active
// - onBusinessLayerSelect: (key: string) => void
// - selectedPeriod: { start: string, end: string }
// - onPeriodChange: (period) => void

// BLOC 1 : Entités Géographiques
//   Grouper par: "Bassin versant" | "Infrastructure" | "Administratif"
//   Switch toggle par couche, icône colorée par type (polygon/point/line)

// BLOC 2 : Données Métier
//   Grouper par: "Météo & Climat" | "Hydrologie" | "Qualité de l'eau" | "Pollution"
//   Bouton radio (une seule couche métier active à la fois)
//   Badge de comptage données (nb mesures disponibles)
//   Filtre temporel par groupe (date_start / date_end)
```

---

### 3. Composant `MapLegend.jsx` (à créer)

**Fichier actuel** : stub vide de 6 lignes

**À créer** :
```jsx
// Props :
// - businessLayer: BUSINESS_LAYERS[i] | null
// - dataRange: { min: number, max: number } | null  (calculé depuis les données réelles)

// Affiche :
// → Titre du paramètre + unité
// → Palette de couleurs avec 3-5 classes
// → min/max observés dans les données chargées
// → Indicateur de chargement si données en cours
```

---

### 4. Enrichissement `MapTooltip.jsx`

**Fichier actuel** : 320 octets (minimal)

**À enrichir** pour afficher :
```
Station : [station_nom] (source: api.v_station_dimension)
Code    : [code_station]
Paramètre: [label] = [valeur] [unité]
Date    : [date_prelevement] ou [bucket_month]
Qualité : [classe couleur correspondante]
```

---

### 5. Nouveau fichier `LayerManager.js` (logique métier)

```js
// frontend/src/components/Map/LayerManager.js
// Responsabilités :
// 1. fetch() les stations ayant des données pour un paramètre donné
// 2. fetch() les valeurs à afficher (dernière mesure ou agrégat période)
// 3. Calculer la couleur de chaque station selon les classes de BUSINESS_LAYERS
// 4. Retourner un GeoJSON enrichi "stations avec couleur + valeur + tooltip"

// Exemple de flux pour "Précipitation" :
// 1. GET /api/v1/climate/stations → liste stations
// 2. GET /api/v1/layers/stations_abhs → GeoJSON géométries
// 3. Pour chaque station: GET /api/v1/climate/timeseries?ts_id={id}|p_annuelle
//    → filtrer par période sélectionnée, calculer la valeur agrégée
// 4. Joindre géométrie + valeur → GeoJSON enrichi avec propriété "display_value"
// 5. Appliquer colorScale selon les classes définies dans BUSINESS_LAYERS
```

---

## ⚙️ LOGIQUE D'AFFICHAGE MÉTIER

### Règle de filtrage automatique
Quand l'utilisateur active une couche métier :

1. **Identifier les stations avec données** via l'endpoint `apiEndpoint`
2. **Charger les géométries** via `/api/v1/layers/stations_abhs`
3. **Filtrer** : n'afficher que les stations présentes dans la réponse métier
4. **Charger les valeurs** pour la période sélectionnée
5. **Symboliser** : calculer couleur + taille selon les classes `BUSINESS_LAYERS[i].classes[]`

### Exemple concret (Débit)
```
1. GET /api/v1/hydro/stations
   → retourne uniquement les stations de type 'hydrologique' (jointure sur v_hydro_debit_mensuel)
   → ex: [{station_id: 42, station_name: "Azib Soltane"}, ...]

2. GET /api/v1/layers/stations_abhs
   → GeoJSON complet de toutes les stations (géométries)

3. Filtrer le GeoJSON pour ne garder que station_id IN [42, ...]

4. Pour chaque station:
   GET /api/v1/hydro/timeseries?ts_id=42&aggregation=monthly&date_start=…&date_end=…
   → calculer la moyenne sur la période

5. Colorer chaque point selon les classes de renderType="graduated_point"
```

---

## 🎨 SYMBOLOGIE DYNAMIQUE

### Types de rendu par couche

| `renderType`       | Couches concernées              | Implémentation MapLibre       |
|--------------------|---------------------------------|-------------------------------|
| `graduated_point`  | Précipitation, Débit, Qualité   | `circle-radius` ∝ valeur, `circle-color` ∝ classes |
| `choropleth`       | (futur) agrégat sous-bassins    | `fill-color` ∝ valeur agrégée |
| `cluster`          | Décharges, Huileries            | `cluster: true` dans la source |
| `icon`             | STEP, STM, Rejets               | Marker HTML personnalisé      |

### Config MapLibre pour `graduated_point`
```js
// Dans InteractiveMap.jsx — couche dynamique
map.addLayer({
  id: `business-layer-${key}`,
  type: "circle",
  source: `source-${key}`,
  paint: {
    "circle-color": [
      "step",
      ["get", "display_value"],
      classes[0].color,      // couleur défaut (< classes[0].min)
      classes[1].min, classes[1].color,
      classes[2].min, classes[2].color,
      classes[3].min, classes[3].color,
    ],
    "circle-radius": [
      "interpolate", ["linear"],
      ["get", "display_value"],
      valueRange[0], 6,
      valueRange[1], 18,
    ],
    "circle-stroke-width": 1.5,
    "circle-stroke-color": "white",
    "circle-opacity": 0.85,
  },
});
```

---

## 🔄 SYNCHRONISATION GLOBALE

Les 3 éléments suivants doivent être **synchronisés** via un état partagé (Context ou Zustand) :
1. **Paramètre sélectionné** (ex: "precipitation")
2. **Période** (`date_start` / `date_end`)
3. **Zone active** (`bbox` ou sous-bassin sélectionné)

Quand l'un change → tout se met à jour :
- Couches carte (GeoJSON + couleurs)
- Graphiques (timeseries)
- Tableau (données tabulaires)
- Légende (min/max recalculés)

---

## 🔗 JOINTURES BD RÉELLES À CONNAÎTRE

Pour la couche "Stations qualité" → les stations sont identifiées par `ire_station` (TEXT, ex: `'1000/23'`) dans `mesures_qualite_rivieres`, jointure avec `api.v_station_dimension` via `legacy_code_station` ou `code_station`.

```sql
-- Jointure stations qualité ← déjà faite dans quality.py
SELECT DISTINCT mqr.ire_station as station_id,
       COALESCE(sd.station_nom, sd.code_station, mqr.ire_station) as station_name
FROM public.mesures_qualite_rivieres mqr
LEFT JOIN api.v_station_dimension sd
    ON sd.legacy_code_station = mqr.ire_station
    OR sd.code_station = mqr.ire_station;
```

---

## 🚀 ORDRE D'IMPLÉMENTATION SUGGÉRÉ

```
Phase 1 — Config (1h)
  ├── Restructurer layers/config.ts → GEO_LAYERS + BUSINESS_LAYERS
  └── Ajouter types TypeScript

Phase 2 — LayerControls (2h)
  ├── Bloc Géo : groupes pliables avec toggles
  └── Bloc Métier : sélection radio + badge comptage

Phase 3 — LayerManager.js (3h)
  ├── Fetch stations with data
  ├── Fetch geometries + filter
  ├── Fetch values + aggregate
  └── Return enriched GeoJSON with display_value + color

Phase 4 — InteractiveMap.jsx (2h)
  ├── Ajouter source + layer "business" dynamique
  ├── Gestion graduated_point (circle)
  └── Événement hover → MapTooltip

Phase 5 — MapLegend.jsx (1h)
  └── Affichage classes + min/max observés

Phase 6 — MapTooltip.jsx (1h)
  └── Enrichissement données station + valeur + date

Phase 7 — Synchronisation globale (2h)
  ├── Context ou Zustand pour {parameter, dateRange, zone}
  └── Propagation Dashboard1/Dashboard2
```

---

## ⚠️ CONTRAINTES ET POINTS D'ATTENTION

1. **`ire_station` est TEXT** dans `mesures_qualite_rivieres` (ex: `'1000/23'`) — ne pas caster en INT
2. **`legacy_station_id` est INT** dans `v_hydro_debit_mensuel` — utiliser tel quel pour hydro
3. **`ts_id` format spécial** pour le climat : `"{station_id}|p_max"` ou `"{station_id}|p_annuelle"`
4. **Simplification géométrique** déjà configurée côté backend (`SIMPLIFY_TOLERANCE`) — ne pas re-simplifier côté frontend
5. **Couche `stm`** (Stations de Transfert de Matières) : source `api.v_stm`, clé `code_stm`
6. **Couche `step_industrielles`** : deux sources possibles (`api.v_step_industrielles` en priorité)
7. **L'endpoint `/api/v1/layers/{key}`** renvoie déjà du GeoJSON valide avec `ST_Transform(..., 4326)` → directement utilisable par MapLibre

---

## 📋 CRITÈRES DE VALIDATION

- [ ] `LayerControls` affiche 2 blocs distincts (Géo / Métier)
- [ ] Activer "Précipitation" → seules les stations clima s'affichent, colorées
- [ ] Activer "Débit" → seules les stations hydro s'affichent, colorées
- [ ] Activer "pH" → seules les stations qualité s'affichent, colorées
- [ ] `MapLegend` affiche la palette + min/max des données réelles
- [ ] `MapTooltip` affiche station_name + valeur + unité + date
- [ ] Changer la période → carte + graphiques se mettent à jour
- [ ] Couches géo restent disponibles indépendamment des couches métier
- [ ] Performance : `max_features=5000` par défaut, lazy loading par bbox

---

## ✅ MISE À JOUR OPÉRATIONNELLE (Audit schémas + stratégie d’exposition API)

Date de référence audit : 2026-04-06
Source d’audit : `backend/audit_schemas.py` + vérification des dépendances `api.*`

### 1) Priorité d’exposition métier (pour dashboards)

#### P0 — À exposer immédiatement (carto + KPI principaux)
- Hydrologie : `hydro.mesure_barrage`
- Météo : `meteo.mesure_temperature`
- Infrastructure : `infra.fosses_septiques_abhs`
- Modélisation (consommation dashboard) : `modeles.resultat_swat`, `modeles.resultat_wasp`, `modeles.scenario_simulation`

#### P1 — À exposer après P0 (analyse avancée)
- SWAT staging technique utile analyse : `swat_output.stg_swat_qualite_long` (lecture analytique)
- WASP staging technique utile analyse : `wasp_output.stg_wasp_qualite_long` + `wasp_output.ref_segment_modele`

#### P2 — Interne uniquement (ne pas exposer au front)
- `staging.*` (archive / traçabilité)
- `security.*` (auth)
- `metadata.*` tables de mapping unresolved
- `monitoring.*` (ops interne)

### 2) Objets non exposés à ignorer côté front (par design)
- `public.spatial_ref_sys`
- `geo._bak_*`
- Règles QA techniques (`hydro.regle_qualite_*`, `meteo.regle_qualite_*`) : exposer via endpoints métier si besoin, pas en couche carto brute

### 3) Règle VIEW vs MATERIALIZED VIEW

Utiliser une **VIEW** si :
- données changent souvent (quasi temps réel),
- faible coût SQL,
- besoin de fraîcheur immédiate.

Utiliser une **MATERIALIZED VIEW** si :
- données volumineuses et peu éditées,
- jointures/mappings coûteux,
- objectif principal = vitesse d’affichage dashboard.

### 4) Propositions de vues API à créer (SQL base)

```sql
-- 4.1 Température (P0)
CREATE OR REPLACE VIEW api.v_meteo_temperature_journalier AS
SELECT
  m.station_id,
  date_trunc('day', m.bucket_day)::date AS bucket_day,
  m.valeur_c AS valeur,
  m.est_valide,
  m.qa_flags,
  s.station_code,
  s.station_nom
FROM meteo.mesure_temperature m
LEFT JOIN api.v_station_dimension s ON s.station_id = m.station_id;
```

```sql
-- 4.2 Niveau barrage (P0)
CREATE OR REPLACE VIEW api.v_hydro_niveau_barrage_journalier AS
SELECT
  mb.barrage_id,
  date_trunc('day', mb.bucket_day)::date AS bucket_day,
  mb.valeur_niveau_m,
  mb.est_valide,
  mb.qa_flags,
  bd.nom_barrage
FROM hydro.mesure_barrage mb
LEFT JOIN api.v_barrage_dimension bd ON bd.barrage_id = mb.barrage_id;
```

```sql
-- 4.3 Fosses septiques (P0 carto infrastructure)
CREATE OR REPLACE VIEW api.v_infra_fosses_septiques_geojson AS
SELECT
  f.id,
  COALESCE(f.nom, f.code, f.id::text) AS name,
  ST_AsGeoJSON(ST_Transform(f.geom, 4326))::jsonb AS geometry,
  to_jsonb(f) - 'geom' AS properties
FROM infra.fosses_septiques_abhs f
WHERE f.geom IS NOT NULL;
```

### 5) Propositions de vues matérialisées (performance)

```sql
-- 5.1 SWAT consolidé dashboard (P1)
CREATE MATERIALIZED VIEW IF NOT EXISTS api.mv_swat_qualite_subbasin_day AS
SELECT
  r.scenario_id,
  r.bassin_code,
  r.subbasin_id,
  date_trunc('day', r.datetime_utc)::date AS bucket_day,
  r.parametre_code,
  avg(r.valeur) AS valeur_moy,
  count(*) AS n_valeurs
FROM modeles.resultat_swat r
GROUP BY 1,2,3,4,5;

CREATE INDEX IF NOT EXISTS idx_mv_swat_qualite_subbasin_day_key
ON api.mv_swat_qualite_subbasin_day (scenario_id, bassin_code, subbasin_id, bucket_day, parametre_code);
```

```sql
-- 5.2 WASP consolidé dashboard (P1)
CREATE MATERIALIZED VIEW IF NOT EXISTS api.mv_wasp_qualite_segment_day AS
SELECT
  r.scenario_id,
  r.bassin_code,
  r.segment_id,
  date_trunc('day', r.datetime_utc)::date AS bucket_day,
  r.parametre_code,
  avg(r.valeur) AS valeur_moy,
  count(*) AS n_valeurs
FROM modeles.resultat_wasp r
GROUP BY 1,2,3,4,5;

CREATE INDEX IF NOT EXISTS idx_mv_wasp_qualite_segment_day_key
ON api.mv_wasp_qualite_segment_day (scenario_id, bassin_code, segment_id, bucket_day, parametre_code);
```

```sql
-- 5.3 Couches carto modeles prêtes dashboard
CREATE OR REPLACE VIEW api.v_swat_qualite_carto AS
SELECT
  m.scenario_id,
  m.bassin_code,
  m.subbasin_id,
  m.bucket_day,
  m.parametre_code,
  m.valeur_moy,
  ST_AsGeoJSON(ST_Transform(g.geom, 4326))::jsonb AS geometry
FROM api.mv_swat_qualite_subbasin_day m
JOIN geo.sous_bassin_swat_leben_innaouen g
  ON g.subbasin = m.subbasin_id;
```

### 6) Politique de refresh des MV

```sql
-- Refresh périodique (exécution scheduler/cron)
REFRESH MATERIALIZED VIEW CONCURRENTLY api.mv_swat_qualite_subbasin_day;
REFRESH MATERIALIZED VIEW CONCURRENTLY api.mv_wasp_qualite_segment_day;
```

Notes :
- `CONCURRENTLY` requiert un index unique adapté si nécessaire selon le plan de refresh.
- Pour phase initiale: refresh non-concurrent possible en fenêtre batch.

### 7) Convention d’exposition API recommandée

- `api.v_*` : vues métiers fraîches
- `api.mv_*` : agrégats de performance
- `api.v_*_carto` : payload prêt carte (geom en 4326)
- `api.v_*_timeseries` : payload prêt graphe

### 8) Checklist avant mise en prod

1. Index spatiaux présents sur toutes tables `geom` utilisées
2. Index B-Tree sur clés de jointure (station_id, barrage_id, subbasin_id, segment_id, bucket_day)
3. Vérifier volume renvoyé par endpoint (`max_features` + `bbox`)
4. Dictionnaire API mis à jour : `metadata.api_view_catalog` et `metadata.api_view_column_catalog`
5. Plan de refresh matérialisé documenté

---
