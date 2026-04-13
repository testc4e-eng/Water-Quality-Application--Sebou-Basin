# 🎨 Documentation Frontend - WQDSS

L'application Frontend est construite avec **React**, propulsée par **Vite**, stylisée via **TailwindCSS** et structurée avec les composants poussés par **shadcn/ui**.
Elle communique avec l'API Backend (FastAPI).

## Principaux Composants / Tableaux de Bord (Dashboards)

L'interface est découpée en 3 grands domaines métiers de surveillance :

### 1. `DashboardQuality.tsx` (Qualité des Eaux)
- **Objectif** : Suivi physico-chimique historique des Oueds (1988-2013).
- **Fonctionnalités** :
    - Sélecteur dynamique de stations hydrologiques (alimenté par `/quality/stations`).
    - KPIs à la volée : Nombre de campagnes, Total Analyses, Décompte Paramètres.
    - Graphique chronologique temporel multidimensionnel (NO3, pH, DBO5, DCO, O2) géré via **Recharts**.
    - Bar chart comparatif de la dernière campagne.
    - Tableau matriciel des mesures exactes de chimie d'eau.

### 2. `DashboardHydro.tsx` (Hydrologie & Infrastructures)
- **Objectif** : Surveillance des puits, sources, forages, stations hydrologiques et suivi de la capacité des barrages.
- **Fonctionnalités** :
    - Recensement global : 390+ stations et leurs sous-bassins rattachés.
    - Filtres visuels interactifs par `type_station` ("Source", "Puits", "Forage").
    - Grille des barrages avec capacité de sécurité (Mm³) et année.
    - Tableau d'inventaire complet des métadonnées (Altitude, Lat/Lon WGS84, Statut).

### 3. `DashboardMeteo.tsx` (Météorologie)
- **Objectif** : Réseau de vigilance pluviométrique.
- **Fonctionnalités** :
    - Recherche de stations par code/nom (Text Search box).
    - Charte de répartition altimétrique (barres progressives en %) montrant la couverture du réseau (ex: 200m-500m, >1000m).
    - Filtre par sous-bassin / type de pluviomètre.

## Service API (`api/client.ts`)
- Le client Axios configuré est la porte d'entrée par défaut (Pointant sur HTTP localhost:8000 en dev).

---

## 🚀 Développement Local (Démarrage)

```bash
cd frontend
npm install
npm run dev
# Lance le serveur sur http://localhost:3001
```

## 📦 Déploiement Production (Build)
```bash
npm run build
# Génère le dossier /dist à servir sur Nginx / Apache
```
