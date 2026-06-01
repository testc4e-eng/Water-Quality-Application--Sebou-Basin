# Codes de decision cartographique

| Code | Libelle | Couleur | Criticite | Fusion future | Validation requise |
|---|---|---|---|---|---|
| `ACCEPT_MATCH` | Accepter le rattachement au master candidat | bleu | faible | oui | métier carto |
| `KEEP_SEPARATE` | Garder les objets séparés | gris | moyenne | non | métier carto |
| `SAME_SITE_DIFFERENT_OBJECT` | Même site physique, objets métier distincts | cyan | moyenne | non | métier + data governance |
| `CREATE_NEW_MASTER_SITE` | Créer un nouveau site maître futur | vert | moyenne | non, création contrôlée | métier |
| `REJECT_MATCH` | Rejeter le candidat master | rouge | élevée | non | métier |
| `WAIT_SOURCE_FIX` | Attendre correction source/géométrie | violet | élevée | non | data/source owner |
| `NEED_FIELD_VALIDATION` | Validation terrain requise | orange | élevée | non | terrain |
| `NEED_TOPOLOGY_VALIDATION` | Validation réseau/topologie requise | orange | élevée | non | SIG/hydrologie |
| `DUPLICATE_SOURCE_RECORD` | Doublon strict dans une source | bleu foncé | faible | oui, après trace | data governance |
| `INVALID_GEOMETRY` | Géométrie invalide ou inexploitable | noir | bloquante | non | SIG |
| `NEED_EXPERT_REVIEW` | Expertise métier requise | rouge foncé | élevée | non | expert |
| `ESCALATE_TO_DG` | Arbitrage direction générale | pourpre | critique | non | DG |

## Interprétation

- Les codes autorisant une fusion future ne déclenchent aucune fusion immédiate.
- `SAME_SITE_DIFFERENT_OBJECT` doit produire un lien spatial/metier, pas une fusion d'identité.
- `WAIT_SOURCE_FIX` et `INVALID_GEOMETRY` bloquent la PREPROD pour les objets critiques.
- `ESCALATE_TO_DG` est réservé aux conflits structurants ou politiquement sensibles.

## Champs techniques associés

| Code | `merge_future_allowed` | `validation_needed` | `requires_field_check` | `requires_topology_check` |
|---|---|---|---|---|
| `ACCEPT_MATCH` | true | true | false | false |
| `DUPLICATE_SOURCE_RECORD` | true | true | false | false |
| `KEEP_SEPARATE` | false | true | false | false |
| `SAME_SITE_DIFFERENT_OBJECT` | false | true | false | false |
| `CREATE_NEW_MASTER_SITE` | false | true | false | false |
| `REJECT_MATCH` | false | true | false | false |
| `WAIT_SOURCE_FIX` | false | true | true | false |
| `NEED_FIELD_VALIDATION` | false | true | true | false |
| `NEED_TOPOLOGY_VALIDATION` | false | true | false | true |
| `INVALID_GEOMETRY` | false | true | true | false |
| `NEED_EXPERT_REVIEW` | false | true | false | false |
| `ESCALATE_TO_DG` | false | true | false | false |
