# Regles d'arbitrage cartographique identite spatiale

## Objectif

Permettre a l'equipe metier/cartographie de valider les rattachements source -> site maitre sans fusion automatique. Chaque decision doit rester reversible et auditable.

## Principes

- Ne jamais modifier les SHP sources.
- Ne jamais supprimer un objet source.
- Ne jamais fusionner automatiquement un conflit ambigu.
- Une decision cartographique n'est pas encore une fusion : elle autorise ou bloque une fusion future.
- `geo.ref_site_pollution` reste le pivot, mais les arbitrages sont stockes dans `qa.spatial_identity_decisions_cartographic`.

## CAS 1 - HIGH_CONFIDENCE

Conditions :

- distance = 0 m ou tres faible, typiquement <= 5 m;
- meme type metier ou type compatible;
- meme commune ou commune source absente mais contexte coherent;
- nom identique/similaire ou contexte metier clair.

Decision recommandee :

- `ACCEPT_MATCH` si le rattachement au master est evident;
- `DUPLICATE_SOURCE_RECORD` si la source est un doublon strict.

Fusion future :

- autorisable, apres validation metier.

## CAS 2 - MEDIUM_CONFIDENCE

Conditions :

- distance faible, typiquement <= 10 m;
- nom similaire ou incomplet;
- type compatible mais pas strictement identique;
- commune coherente ou proche.

Decision recommandee :

- validation cartographique obligatoire;
- `ACCEPT_MATCH` si la carte confirme le meme objet;
- `KEEP_SEPARATE` si la superposition masque deux objets distincts.

Fusion future :

- possible uniquement si `geometry_checked=true` et `merge_future_allowed=true`.

## CAS 3 - HIGH_RISK

Conditions :

- types incompatibles;
- conflit entre couche metier officielle et couche inventaire;
- noms divergents;
- distance proche mais contexte metier contradictoire;
- source prioritaire incertaine.

Decision recommandee :

- `NEED_EXPERT_REVIEW`;
- `NEED_FIELD_VALIDATION`;
- `REJECT_MATCH` si le candidat est manifestement faux.

Fusion future :

- interdite sans arbitrage expert ou terrain.

## CAS 4 - SAME_SITE_DIFFERENT_OBJECT

Exemples :

- STEP, point de mesure et rejet au meme emplacement;
- huilerie et point de prelevement associe;
- station qualite et source pollution voisine.

Decision recommandee :

- `SAME_SITE_DIFFERENT_OBJECT`.

Regle :

- garder les objets separes;
- creer un lien spatial/metier;
- ne pas fusionner les identites si les roles metier sont distincts.

## CAS 5 - ORPHAN

Conditions :

- geometrie absente;
- coordonnees aberrantes;
- source incomplete;
- aucun master site candidat dans la tolerance.

Decision recommandee :

- `WAIT_SOURCE_FIX` si geometrie manquante ou douteuse;
- `CREATE_NEW_MASTER_SITE` si la source est valide et autonome;
- `INVALID_GEOMETRY` si la geometrie est exploitable ni en carte ni en calcul.

## Règles opérationnelles

| Situation | Decision | Fusion future |
|---|---|---|
| meme objet evident | `ACCEPT_MATCH` | oui |
| deux objets proches mais roles differents | `SAME_SITE_DIFFERENT_OBJECT` | non, lien seulement |
| source doublon strict | `DUPLICATE_SOURCE_RECORD` | oui, avec conservation source |
| candidat faux | `REJECT_MATCH` | non |
| source valide sans master | `CREATE_NEW_MASTER_SITE` | creation future controlee |
| geometrie absente | `WAIT_SOURCE_FIX` | non |
| doute terrain | `NEED_FIELD_VALIDATION` | non avant terrain |
| doute reseau/propagation | `NEED_TOPOLOGY_VALIDATION` | non avant validation topo |

## Champs minimaux a renseigner

- `business_decision`
- `reviewer`
- `confidence_level`
- `comments`
- `requires_field_validation`
- `requires_topology_validation`
- `future_merge_allowed`
- `future_master_site`
- `final_status`
