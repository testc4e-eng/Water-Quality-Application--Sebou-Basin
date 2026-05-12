# Decision IDP-GEO

## Statut

**IDP_READY_AS_SEPARATE_LAYERS**

## Justification

- les 4 tables `IDP 2024` sont geographiquement exploitables comme couches ponctuelles dediees
- les attributs bruts peuvent etre conserves sans forcer un schema `qualite.*`
- les `311` lignes sans `X/Y` restent hors couche et doivent etre gardees en backlog QA
- la semantique `pts_prelevement` peut etre proposee automatiquement mais doit rester a validation metier

## Points de vigilance

- SRID source propose : `26191`, a confirmer avant creation physique
- les correspondances inter-tables `<= 2m`, `<= 5m` et `<= 10m` doivent etre revues si elles servent plus tard a une fusion
- aucune couche ne doit etre creee sans validation humaine explicite
