# Frontend design alignment report

## Objet

Aligner le Home opérationnel V2 sur la maquette institutionnelle cible sans toucher au backend ni recréer les moteurs existants.

## Fichiers modifiés

- `frontend/src/components/Layout/Header.tsx`
- `frontend/src/components/Layout/Sidebar.tsx`
- `frontend/src/components/Layout/Footer.tsx`
- `frontend/src/pages/DashboardHomeV2.tsx`
- `frontend/src/components/home-v2/HeroSection.tsx`
- `frontend/src/components/home-v2/OperationalMap.tsx`
- `frontend/src/components/home-v2/BasinStatus.tsx`
- `frontend/src/components/home-v2/AlertsPanel.tsx`
- `frontend/src/components/home-v2/RecommendedActionsPanel.tsx`
- `frontend/src/components/home-v2/TrendPanel.tsx`
- `frontend/src/components/home-v2/SecondaryKpiPanel.tsx`
- `frontend/src/components/home-v2/DataFreshnessBadge.tsx`
- `docs/97_dashboard_home_v2_contract/06_plan_frontend_implementation.md`
- `docs/03_ai_knowledge_base/architecture_for_agents.md`
- `docs/03_ai_knowledge_base/project_structure_for_agents.md`

## Composants ajustés

- `Header`
  - mode sombre opérationnel sur `/` et `/accueil-sad`
  - slogan central DG
  - date/heure, météo placeholder, badge DG
- `Sidebar`
  - fond bleu nuit
  - entrée active bleue lumineuse
  - bloc bas `Données actualisées` + bloc ABH
- `DashboardHomeV2`
  - nouvelle grille en quatre lignes denses
- `SecondaryKpiPanel`
  - bande compacte `État global du bassin`
- `OperationalMap`
  - carte centrale dominante
  - panneaux `Stations critiques` et `Pollutions prioritaires`
- `BasinStatus`
  - bloc qualité mis en avant
  - synthèses hydrologie / pluvio / barrages intégrées
- `AlertsPanel`
  - carte sombre inspirée de la maquette
- `RecommendedActionsPanel`
  - style opérationnel immédiat
- `TrendPanel`
  - séparation `Prévisions` / `Historique récent`

## Composants réutilisés

- `BusinessMap`
- `DashboardCartoMetier`
- `PanneauActionMetier` indirectement conservé dans l’architecture métier globale
- endpoint unique `GET /api/v1/dashboard/home`

## Différence avant / après

### Avant

- home trop simple et encore lisible comme un écran KPI-first
- header et sidebar trop neutres
- hiérarchie visuelle trop légère
- carte métier pas assez dominante visuellement

### Après

- shell institutionnel sombre cohérent avec la maquette
- bande KPI compacte en tête pour l’état global
- carte métier dominante au centre de la page
- alertes, stations critiques, pollutions prioritaires et recommandations visibles immédiatement
- zone confiance des données dédiée
- zone prévisions / historique distincte

## Validation réalisée

- `npm run build` : `OK`
- `http://localhost:3000/` : `200`
- `http://localhost:3000/accueil-sad` : `200`
- `http://localhost:5173/` : `200`
- `http://localhost:5173/accueil-sad` : `200`
- `http://localhost:8000/api/v1/dashboard/home` : `200`

## Limites restantes

- le détail station par station des 6 sentinelles n’est pas fourni par le contrat `/api/v1/dashboard/home`; le frontend utilise donc une représentation réseau cohérente mais non nominative
- la carte Home V2 réutilise `BusinessMap`, mais le rendu multicouche métier complet reste encore plus riche dans `/dashboard-carto-metier`
- l’endpoint backend Home V2 reste lent ; la perception UX dépendra fortement d’un futur travail de performance
- la capture automatisée headless locale n’a pas donné un rendu exploitable dans cet environnement ; une capture manuelle navigateur est recommandée pour recette métier finale

## Captures recommandées

Pour validation métier finale, capturer au minimum :

1. vue complète `/accueil-sad`
2. focus ligne KPI + alertes
3. focus carte métier + stations critiques + pollutions prioritaires
4. focus qualité + recommandations + confiance

## Résultat npm build

Statut : `OK`

Remarque :

- warning Vite existant sur la taille de certains chunks, non bloquant pour cette étape

## Prochaine étape

- recette métier visuelle avec captures navigateur réelles
- si validée, itération suivante centrée sur :
  - enrichissement carte Home
  - exposition backend détaillée des stations sentinelles
  - optimisation temps de réponse `/api/v1/dashboard/home`

## Décision

`GO_HOME_V2_DESIGN_ALIGNED`
