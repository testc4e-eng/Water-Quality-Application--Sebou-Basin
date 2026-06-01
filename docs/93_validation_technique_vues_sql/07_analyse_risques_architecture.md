# Analyse risques architecture

| Risque | Impact | Gravite | Recommendation |
|---|---|---|---|
| Union multi-support trop large | latence dashboards qualite | elevee | vues specialisees par famille + filtres temps/support obligatoires |
| Vue globale comme source primaire | couplage frontend fort et pertes semantiques | elevee | `api.v_qualite_dashboard_global` seulement agregateur |
| `parametre_ref_id` absent/null dans certaines tables | libelle/unite non resolus | moyenne | joindre referentiel canonique par code exact dans vues |
| `Mo` / `MO` confusion | erreur analytique metal vs organique | elevee | filtres exacts sensibles a la casse |
| `DISQUE_SECCHI` double support | melange barrage/riviere/nappe | moyenne | cible principale barrage, support riviere dans terrain, nappe QA review |
| `T_AIR` qualite vs meteo | melange campagne terrain et station meteo | elevee | double classification par source |
| `COULEUR` numerique historique | moyenne/score faux | moyenne | consultation only, exclude analytics |
| Pollution non numerique | perte d'information si cast force | moyenne | conserver `valeur_raw` et `qa_status` |
| GEO non resolu IDP | carte incomplete | moyenne | exposer points avec `GEO_UNRESOLVED`, ne pas bloquer |
| Absence materialisation | performance degradee si gros usages | moyenne | materialized views futures par famille |
| Vues trop couplees API | refactor difficile | moyenne | API lit vues specialisees, frontend compose |
| Table future `geo.points_non_resolus_idp` absente | vue non executable si reference directe | faible | V1 filtre depuis prelevements ; table dediee future |

## Risques bloquants avant execution

- Le SQL propose introduit une vue technique commune `api.v_qualite_base_multi_support` utilisee par les vues qualite specialisees ; valider que cette dependance supplementaire est acceptable.
- Valider le type PostGIS `geometry` disponible dans le schema cible.
- Valider l'existence du schema `api`.
- Valider les droits de creation de vues.

## Position

Architecture faisable, mais execution a maintenir en `HOLD` tant que le SQL complet n'est pas relu, teste par vue, et valide avec les contrats API.
