# Roadmap priorisée dashboards

## P0 — Blocages critiques
| Action | Raison | Sortie attendue |
|---|---|---|
| Retirer `/dashboard-climate` de la préprod ou réparer les imports absents | Risque build/runtime | Dashboard climat exploitable ou désactivé |
| Marquer `/dashboard-pollution` comme topologique non scientifique | Risque métier fort | Badge permanent + texte popup |
| Afficher version réglementaire et `type_eau=surface_generale` | Traçabilité réglementaire | Header commun qualité |
| Afficher statuts non classifiables partout | Éviter faux classements | Badges UI standardisés |
| Créer Dashboard Hydraulique QA ou page QA P0 | Chantiers hydrauliques actifs | Carte segments suspects/plats |

## P1 — Industrialisation immédiate
| Action | Raison | Sortie attendue |
|---|---|---|
| Refondre dashboard température sur `meteo.mesure_temperature` | Donnée commitée ML-ready | Séries station/période |
| Consolider `/dashboard-carto-metier` | Bon socle métier | Carte P0 préprodable |
| Remplacer vues legacy par `/api/v1/map/*` et `/api/v1/quality/*` | Contrats récents | Moins de dette frontend |
| Ajouter Dashboard Qualité Réglementaire | Référentiel validé conditionnel | Vue métier complète |

## P2 — Améliorations architecture
| Action | Raison |
|---|---|
| Centraliser symbologie qualité/hydraulique | Cohérence UI |
| Créer client API dashboard unifié | Éviter duplication clients |
| Fusionner observatoire V2 et décisionnel test | Réduire écrans concurrents |
| Documenter routeur actif et supprimer divergence `router.tsx` / `App.tsx` | Maintenabilité |

## P3 — ML / IA / prédiction
| Action | Précondition |
|---|---|
| Dashboard readiness ML | Température + qualité + hydraulique QA |
| Features pollution/hydrologie | Direction hydraulique validée |
| Prédiction pollution | Pas avant arbitrage hydraulique |
| Alertes intelligentes | Labels réglementaires + routage validé |
