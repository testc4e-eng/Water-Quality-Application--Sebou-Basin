# Decision finale GEO

**Decision : `GEO_BACKLOG_RESTANT`**

## Lecture
- Les cas `sans ref geo` sont convertis en propositions d'entites candidates, non executees.
- Les cas `sans XY` sont sortis en anomalie client finale.
- Les ambiguities resolvables sont documentees avec rattachement recommande ; les autres restent en backlog.

## Blocages restants
- `hydro.mesure_debit_source` : conflit referentiel sur `geo.source` necessitant arbitrage.
- Une partie des ambiguities IDP reste en validation metier requise.
