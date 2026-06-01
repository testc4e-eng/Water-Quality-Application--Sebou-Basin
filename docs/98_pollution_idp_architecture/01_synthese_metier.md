# Synthèse métier pollution / IDP

## Chaîne métier

1. constat préalable terrain ;
2. localisation XY ;
3. rattachement éventuel à station / barrage / nappe / point connu ;
4. qualification `geo_status` ;
5. prélèvement ;
6. analyses finales ;
7. validation QA et restitution.

## Objets métier

| Objet | Source principale | Géométrie | Rôle métier | Statut |
|---|---|---|---|---|
| Constat préalable | `qualite.source_pollution_prelevement` / fichiers Excel inventaire | parfois | signal faible initial | existant observé |
| Point prélèvement | `qualite.source_pollution_prelevement` | oui si XY valides | support analytique | existant observé |
| Analyse finale | `qualite.source_pollution_mesure_param` | via prélèvement | mesure labo | existant observé |
| Point non résolu | couche dédiée future | oui si XY | validation GEO progressive | cible |
| Source pollution | vue source dédiée future / historique Excel | parfois | diagnostic / classement | cible |

## Règles absolues

- ne pas fusionner constat préalable et analyse finale ;
- exposer `geo_status` et `qa_status` ;
- ne pas bloquer le workflow sur les points non résolus ;
- séparer la carte opérationnelle pollution de la qualité analytique courante.
