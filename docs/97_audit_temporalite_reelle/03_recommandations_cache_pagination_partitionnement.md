# Recommandations cache / pagination / partitionnement

## Cache frontend

| Domaine | Règle recommandée |
|---|---|
| météo volumétrique | cache court `5-15 min`, invalider par station + période |
| hydro barrage | cache court `5-15 min`, invalider par barrage + paramètre + période |
| qualité récente | cache court `1-5 min` si écran décisionnel, `15-60 min` si analytique |
| qualité historique | cache plus long `30-60 min` |
| pollution / IDP | cache court par campagne et `geo_status` |
| SWAT / WASP | cache long par scénario / run |

## Pagination API

- conserver `limit` obligatoire ;
- défaut `100` ;
- `250` max recommandé pour tableaux standards ;
- pagination serveur obligatoire pour pollution analyses finales, qualité multi-support et séries larges ;
- géométrie uniquement si mode carte.

## Partitionnement futur

- Timescale / partitionnement temporel à conserver pour météo et hydro ;
- partitionnement logique futur par campagne ou année pour pollution / IDP si volume croît ;
- pour SWAT/WASP, partitionnement par `scenario_id` et temps recommandé si extension volumique.

## Recommandations de densité

- ne jamais charger toutes les séries météo ou hydro sans fenêtre de temps ;
- sur carte, charger d'abord `récent`, puis permettre l'élargissement volontaire ;
- pour qualité multi-support, imposer `période + famille + support` avant requête lourde.

## Roadmap

1. exécuter les requêtes read-only d'audit temporel ;
2. renseigner les bornes réelles dans le catalogue 96 ;
3. brancher la fraîcheur réelle dans les métadonnées API futures ;
4. ajuster cache et pagination frontend selon les résultats mesurés.
