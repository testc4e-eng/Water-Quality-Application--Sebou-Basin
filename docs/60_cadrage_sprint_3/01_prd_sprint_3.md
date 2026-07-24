# PRD Sprint 3 — Carte Métier Analytique

| Champ | Valeur |
|---|---|
| Version | 1.0 |
| Date | 2026-06-15 |
| Statut | `DRAFT` → à valider en kick-off Sprint 3 |
| Dépendance | Clôture Sprint 2 (`VALIDATION_METIER = OK`) |

---

## 1. Objectifs Sprint 3

Transformer la Carte Métier Analytique d'un outil de visualisation en un outil d'analyse et de restitution décisionnelle :

1. **Corrélations** : croiser qualité, hydrologie, météo et pollution sur un même espace-temps.
2. **Exports** : produire des rapports PDF et tableaux CSV exploitables par la DG/ABH.
3. **Multi-cartes** : comparer plusieurs scénarios, périodes ou paramètres côte à côte.
4. **Indicateurs DG** : consolider les KPI réglementaires et opérationnels dans une vue synthétique.

---

## 2. Périmètre fonctionnel

### 2.1 Corrélations multi-domaines

- Sélectionner jusqu'à 5 séries de domaines différents dans le workspace.
- Affichage synchrone des séries sur un même axe temporel.
- Calcul automatique de coefficients de corrélation (Pearson/Spearman) entre séries compatibles.
- Mise en évidence visuelle des pics et anomalies coïncidentes.

### 2.2 Exports

- **Export CSV** : toutes les séries du workspace + métadonnées.
- **Export PDF** : rapport A4 avec carte, graphiques et tableaux.
- **Export image** : PNG du graphique ou de la carte.
- Modèles de rapport préconfigurés : `Fiche station`, `Bilan qualité`, `Analyse événement`.

### 2.3 Multi-cartes

- Mode split-screen : 2 cartes côte à côte.
- Comparaison de périodes : même zone, paramètre et support, dates différentes.
- Comparaison de paramètres : même zone et période, paramètres différents.
- Synchronisation du zoom et du déplacement entre les deux cartes.

### 2.4 Indicateurs DG

- Widgets récapitulatifs dans le workspace :
  - nombre de stations actives par famille
  - derniers dépassements réglementaires
  - cumuls hydrologiques et pluviométriques
  - tendance qualité sur 30 jours

---

## 3. Architecture cible

### Backend

- Réutilisation de `/api/v1/business-map/analysis/series/batch`.
- Nouveau endpoint `/api/v1/business-map/analysis/correlation`.
- Nouveau endpoint `/api/v1/business-map/reports/pdf` (génération côté serveur).
- Nouveau endpoint `/api/v1/business-map/reports/csv`.

### Frontend

- Extension du workspace avec onglets `Graphiques`, `Corrélations`, `Exports`, `Indicateurs`.
- Nouveau composant `CorrelationMatrix.tsx`.
- Nouveau composant `ReportBuilder.tsx`.
- Nouveau composant `SplitMapView.tsx`.

### Base de données

- Pas de modification schéma requise.
- Éventuel ajout d'index sur `api.mv_business_map_last_values` si les exports massifs sont lents.

---

## 4. Critères d'acceptation

### US-301 Corrélations

- [ ] Deux séries de domaines différents peuvent être ajoutées au même workspace.
- [ ] Le coefficient de corrélation s'affiche si les séries partagent une période commune ≥ 10 points.
- [ ] Le graphique met en évidence les dates communes.

### US-302 Export CSV

- [ ] Le bouton `Exporter CSV` est disponible dans le workspace.
- [ ] Le fichier généré contient une feuille par série avec dates, valeurs, unités, sources.
- [ ] Le fichier est nommé `sad_export_YYYYMMDD_HHMMSS.csv`.

### US-303 Export PDF

- [ ] Le bouton `Exporter PDF` est disponible dans le workspace.
- [ ] Le PDF contient titre, date, graphiques, carte miniature et tableaux.
- [ ] Le PDF utilise la charte graphique SAD.

### US-304 Multi-cartes

- [ ] Le mode split-screen est accessible depuis la toolbar.
- [ ] Les deux cartes synchronisent zoom et centre.
- [ ] Chaque carte a ses propres filtres support/paramètre/période.

### US-305 Indicateurs DG

- [ ] Un panneau `Indicateurs` liste au moins 4 KPI clés.
- [ ] Les KPI se mettent à jour quand les filtres globaux changent.
- [ ] Les KPI sont exportables dans le PDF.

---

## 5. Maquettes / UX

À préciser avec l'équipe UX/UI lors du kick-off Sprint 3.

### Principes directeurs

- Écran unique sans scroll vertical pour les indicateurs DG.
- Workspace dockable à droite, cartographie au centre.
- Couleurs cohérentes avec la légende existante.

---

## 6. Planning indicatif

| Semaine | Thème |
|---|---|
| S3-W1 | Corrélations backend + frontend |
| S3-W2 | Exports CSV et PDF |
| S3-W3 | Multi-cartes et synchronisation |
| S3-W4 | Indicateurs DG, recette, documentation |

---

## 7. Risques

| Risque | Mitigation |
|---|---|
| Génération PDF lourde | Limitation à 5 séries par rapport, pagination côté serveur |
| Corrélations peu fiables sur données hétérogènes | Affichage d'un score de confiance et warning métier |
| Complexité multi-cartes | Commencer par un split-screen 50/50 simple |

---

## 8. Dépendances

- Clôture officielle Sprint 2 : `docs/54_validation_sprint_2_final/21_bilan_final_sprint_2.md`
- Assainissement données : `docs/55_assainissement_donnees_carte_metier/`
- Module 114 data admin : à ne pas interfacer directement dans le Sprint 3

---

*PRD Sprint 3 — généré le 2026-06-15. À valider en réunion de cadrage.*
