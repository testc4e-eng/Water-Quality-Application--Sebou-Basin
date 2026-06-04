# Phase 2 - Carte Métier

## Base de convergence

Faire évoluer `/dashboard-carto-metier`.

Ne pas reconstruire un nouveau moteur cartographique.

## Statut Sprint 1

- `IMPLEMENTED_FRONTEND_MVP`
- page modifiée : `frontend/src/pages/DashboardCartoMetier.tsx`
- nouveau composant : `frontend/src/components/DashboardMetier/PanneauActionMetier.tsx`

## Objectif

Faire de la carte métier l'écran opérationnel principal de navigation.

## Composants réutilisés

- route `/dashboard-carto-metier`
- client `frontend/src/api/mapBusiness.ts`
- hooks `frontend/src/hooks/useMapBusiness.ts`
- composants `frontend/src/components/DashboardMetier/*`
- backend `/api/v1/map/*`

## Vues à proposer

### Vue Bassin

- synthèse globale
- filtres métier simples
- priorités visibles

### Vue Sous-Bassin

- focus local
- stations, barrages, alertes, pollutions prioritaires

### Vue Station

- fiche décisionnelle
- dernier statut
- tendances
- pression pollution voisine

## Couches visibles

- stations
- barrages
- qualité
- alertes
- pollutions

## Couches masquées au niveau métier

- QA détaillée
- debug
- statuts techniques
- IDs internes

## Nouveau composant à créer

### Panneau d'action métier

- contexte entité
- niveau de risque
- dernières alertes
- actions recommandées
- navigation rapide vers qualité ou pollution

## Intégration réalisée

- sélecteur `Vue Bassin / Vue Sous-Bassin / Vue Station`
- panneau d'action métier branché sur l'entité sélectionnée
- masquage de la lecture QA/debug au niveau métier

## Évolutions UX

- sélecteur de vue métier en haut
- panneau latéral d'action à droite
- légende métier simplifiée
- codes couleur stabilisés DG/métier/expert

## Dépendances

- `/api/v1/map/catalog`
- `/api/v1/map/entities`
- `/api/v1/map/latest-values`
- `/api/v1/map/classification`
- `/api/v1/pollution/sites.geojson`

## Risque principal

L'écran peut régresser vers un navigateur de couches si le niveau DG/métier n'est pas strictement tenu.
