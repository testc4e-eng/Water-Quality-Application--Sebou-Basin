# Synthese client

## Conclusion

La migration des donnees client est cloturable. Aucun obstacle technique actif ne justifie de maintenir la migration ouverte.

## Anomalies restantes

| Type | Exemples | Statut |
|---|---|---|
| traitables C4E | referentiel qualite, unites, valeurs non numeriques | backlog non bloquant |
| retour client requis | nappes, points eau, profils, coordonnees non fournies a ce stade | decision client requise |
| hors perimetre migration | SWAT/WASP temporaire, scenarios futurs | chantier separe |
| legacy ignore | anciens objets `public.*`, `staging.*` | non production |

## Decision

`MIGRATION_CLIENT_CLOTUREE_AVEC_BACKLOG`

## Lecture de responsabilite

- mission C4E : migrer, controler, qualifier, documenter et transmettre ;
- responsabilite client : arbitrer, confirmer, completer ou corriger les cas residuels.
