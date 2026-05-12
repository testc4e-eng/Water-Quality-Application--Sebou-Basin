# Passage vers ingestion future

## Decision

La suite du projet doit quitter le mode migration historique et passer au chantier :

```text
MODULE_INGESTION_FUTURES_DONNEES
```

## Objectifs

- ingestion incrementalisee des fichiers client ;
- validation referentiel et alias ;
- controle unites ;
- controle FK et GEO ;
- quarantaine des lignes invalides ;
- audit complet ;
- rollback par lot ;
- support SWAT/WASP futurs ;
- validation metier avant exposition dashboard.

## Principe de transition

| Ancien mode | Nouveau mode |
|---|---|
| migration par lots historiques | ingestion par lots audites |
| corrections ponctuelles SQL | pipelines reproductibles |
| staging utilise comme reprise | staging versionne par ingestion |
| erreurs documentees a posteriori | erreurs mises en quarantaine a l'entree |
| SWAT/WASP temporaires | jeux modeles remplaces et versionnes |

## Priorites

1. Construire le modele d'ingestion qualite/referentiel.
2. Ajouter ingestion IDP/GEO client.
3. Ajouter ingestion meteo/hydro incrementale.
4. Ajouter ingestion SWAT/WASP avec scenario/version.
5. Industrialiser dashboards de controle ingestion.
