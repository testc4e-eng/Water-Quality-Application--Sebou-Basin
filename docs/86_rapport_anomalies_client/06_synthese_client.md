# Synthese client

## Conclusion

La migration des donnees client est cloturable. Aucun bloquant technique actif ne subsiste.

## Anomalies restantes

| Type | Exemples | Statut |
|---|---|---|
| traitables C4E | referentiel qualite, unites, valeurs non numeriques | backlog non bloquant |
| retour client requis | nappes, points eau, profils, coordonnees manquantes | demande arbitrage client |
| hors perimetre migration | SWAT/WASP temporaire, scenarios futurs | chantier separe |
| legacy ignore | anciens objets `public.*`, `staging.*` | non production |

## Decision

`MIGRATION_CLIENT_CLOTUREE_AVEC_BACKLOG`

