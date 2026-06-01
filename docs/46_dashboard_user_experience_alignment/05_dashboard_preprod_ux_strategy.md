# Stratégie UX dashboards préproduction

## Objectif

Préparer une préproduction où l’utilisateur métier voit des écrans utiles et stables, sans bruit technique, tout en gardant une transparence complète pour expert et administration.

## Principes préprod

- afficher par défaut les données validées ou explicitement bornées ;
- ne jamais masquer les limites scientifiques ;
- ne jamais exposer les structures techniques comme contenu métier ;
- réserver l’audit détaillé aux espaces admin/dev.

## Roadmap

## P0

- officialiser `dashboard-qualite-reglementaire` comme entrée qualité métier.
- nettoyer la carte métier pour masquer les détails API/debug.
- ajouter un bandeau standard pollution :
  `Routage basé sur le réseau actuel – validation hydraulique scientifique en cours.`
- sortir `QA Mode` de la vue métier pollution.
- garder les routes DEV/test hors navigation métier primaire.

## P1

- créer un vrai dashboard température/climat dédié, basé sur `meteo.mesure_temperature`.
- enrichir les dashboards qualité avec couverture et alertes agrégées.
- introduire des modes d’affichage `Métier` / `Expert` sur les écrans mixtes.
- séparer davantage `DashboardAnalytique` en thèmes lisibles.

## P2

- dashboard hydraulique double niveau : métier / expert.
- centre admin data unifié : QA, scan, lineage, import batch.
- convergence de la navigation avec profils et permissions explicites.

## Décision par route

| Route | Statut UX préprod |
|---|---|
| `/dashboard-qualite-reglementaire` | `PREPROD_CANDIDATE_PRIMARY` |
| `/dashboard-carto-metier` | `PREPROD_CANDIDATE_AFTER_CLEANUP` |
| `/dashboard-analytique` | `PREPROD_CANDIDATE_AFTER_REFRAMING` |
| `/dashboard-pollution` | `EXPERT_ONLY_UNTIL_HYDRAULIC_VALIDATION` |
| `/pollution-idp-dev` | `DEV_ONLY` |
| `/decision-dashboard-test` | `DEV_ONLY` |
| `/qualite/metaux` | `EXPERT_SPECIALIZED` |
| `/admin/data-scan` | `ADMIN_ONLY` |

## Décision globale

Statut recommandé : `GO_DASHBOARD_REFACTOR_REQUIRED`

Justification :

- les briques P0 existent ;
- un dashboard métier officiel qualité existe ;
- la cartographie métier existe ;
- mais plusieurs écrans exposent encore trop de détails techniques ou mélangent des statuts scientifiques non stabilisés avec une lecture métier.

## Prochaine action prioritaire

1. simplifier l’affichage de `/dashboard-carto-metier` par rôle ;
2. recadrer `/dashboard-pollution` en expert tant que l’hydraulique n’est pas validée ;
3. lancer un dashboard température métier dédié à partir du batch `GO_TEMPERATURE_INGESTION_COMMITTED`.
