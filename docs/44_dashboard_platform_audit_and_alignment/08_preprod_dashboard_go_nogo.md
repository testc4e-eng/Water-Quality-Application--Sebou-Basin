# GO/NOGO dashboards préproduction

## Décision
`NOGO_DASHBOARD_PREPROD`

## Motif principal
Les données et APIs P0 sont disponibles, mais les dashboards frontend ne sont pas encore alignés de manière fiable avec les contrats métier et réglementaires. La préproduction exposerait des risques d’interprétation, notamment sur la propagation pollution et la classification qualité.

## Conditions GO futures
| Condition | État actuel | Requis |
|---|---|---|
| Backend actif | OK sur port 8000 | Conserver tests HTTP |
| Référentiel qualité | OK conditionnel | Afficher version/type_eau/statuts |
| Température | OK | Construire dashboard exploitant batch |
| Hydraulique | Non validée | Afficher QA, ne pas présenter comme scientifique |
| Dashboard climat | Bloqué | Réparer imports ou retirer |
| Dashboard pollution | Risqué | Marquer topologique non scientifique |
| Dashboard carto métier | Bon socle DEV | Finaliser statuts et test navigateur |

## Dashboards autorisés en DEV
- `/dashboard-carto-metier`
- `/pollution-idp-dev`
- `/qualite/metaux`
- `/decision-dashboard-test`
- `/dashboard-cartographique` pour usage interne contrôlé

## Dashboards non autorisés en préproduction métier tels quels
- `/dashboard-climate`
- `/dashboard-pollution`
- `/dashboard` legacy

## Décision opérationnelle
Passer à un chantier P0 de refactor ciblé, sans refonte massive :
1. stabiliser Dashboard Cartographique Métier ;
2. créer Dashboard Qualité Réglementaire ;
3. créer Dashboard Température ;
4. créer Dashboard Hydraulique QA ;
5. reléguer legacy en interne.
