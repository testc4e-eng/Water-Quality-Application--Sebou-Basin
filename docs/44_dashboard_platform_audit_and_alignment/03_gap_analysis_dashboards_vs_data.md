# Gap analysis dashboards vs données réelles

## Synthèse des écarts
| Dashboard | Données existent | API existe | Front consomme bonne API | Statuts métier affichés | Classement | Écart principal |
|---|---|---|---|---|---|---|
| `/dashboard` | partiel | partiel | partiel legacy | non | `REFACTOR` | Station-centric legacy non aligné avec contrats P0 |
| `/dashboard-cartographique` | oui | oui | partiel | partiel | `UPDATE` | Trop large, mélange legacy et P0 |
| `/dashboard-carto-metier` | oui | oui | oui | partiel | `UPDATE` | Bon socle P0.1, statuts qualité/hydraulique à renforcer |
| `/dashboard-analytique` | oui | oui | oui | non/partiel | `UPDATE` | N’exploite pas encore température commitée comme axe P0 clair |
| `/dashboard-climate` | oui | oui | bloqué | non | `REMOVE_FROM_PREPROD` | Imports composants absents |
| `/dashboard-pollution` | réseau oui | oui | oui | partiel | `REMOVE_FROM_PREPROD` | Peut faire croire à une propagation scientifique |
| `/pollution-idp-dev` | oui | oui | oui | oui partiel | `KEEP_DEV` | DEV démo, pas préprod |
| `/qualite/metaux` | oui | oui | oui | non réglementaire complet | `KEEP_UPDATE` | Écran spécialisé, pas dashboard qualité global |
| `/decision-dashboard-test` | oui | oui | oui | partiel | `KEEP_DEV` | Test métier non consolidé |
| Admin data scan | oui | oui | oui | n/a | `KEEP` | Utile data/dev |

## Écarts critiques
1. `DashboardClimate.tsx` référence des composants absents : `ClimateModesDashboard`, `HydroDashboardContent`, `QualityDashboardContent`.
2. `router.tsx` diverge de `App.tsx`, alors que `main.tsx` utilise `App.tsx`.
3. Les statuts réglementaires obligatoires ne sont pas affichés de manière systématique dans les dashboards :
   - `NON_CLASSIFIABLE`
   - `HORS_PERIMETRE_REGLEMENTAIRE`
   - `TYPE_EAU_NON_OPERATIONNEL`
   - `PARAMETRE_NON_REGLEMENTAIRE`
4. Le contrat officiel `type_eau=surface_generale` est actif côté backend, mais les dashboards ne l’affichent pas comme contexte réglementaire permanent.
5. `water_type` n’est pas visible côté frontend ; si compatibilité legacy existe ou revient, elle doit afficher un warning explicite.
6. La QA hydraulique n’est pas encore en table DB : `qa.hydraulic_direction_validation` est absente.
7. Le dashboard pollution doit afficher clairement `routage topologique visuel`, pas propagation scientifique.

## Données disponibles non exploitées correctement
| Donnée | État | Dashboard cible |
|---|---|---|
| Température commitée 437889 lignes | Disponible | Dashboard Température / Climat |
| Version réglementaire active | Disponible | Tous dashboards qualité |
| Seuils actifs/inactifs | Disponible | Qualité réglementaire / Admin Data |
| Statuts observationnels non classifiables | Disponible API | Carte métier / qualité |
| MNT et exports QA hydraulique | Disponible fichiers, pas DB | Hydraulique QA |
| Sites pollution IDP classifiés | Disponible DEV | Pollution / carte métier |

## Décision d’alignement
Le socle backend est suffisamment avancé pour refondre les dashboards, mais la préproduction dashboard doit rester bloquée tant que les écrans ne portent pas explicitement le contexte réglementaire, température, hydraulique et QA.
