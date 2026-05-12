# Cloture migration donnees client

## Objet

Figer la cloture officielle de la migration client vers `abh_sad`.

## Statut

`MIGRATION_CLIENT_CLOTUREE_AVEC_BACKLOG`

## Perimetre

Inclus :

- hydro, meteo, qualite, pollution/IDP migres dans `abh_sad`
- modele barrage parametrique
- referentiel canonique utilise pour barrage et base qualite
- vues API et MV dashboards

Exclus :

- SWAT/WASP temporaires, classes `LEGACY_MODELING_TO_REPLACE`
- nouveaux fichiers client futurs
- nouveaux scenarios de modelisation

## Livrables

| Fichier | Role |
|---|---|
| `01_perimetre_migre.md` | perimetre officiellement migre |
| `02_volumetrie_finale.md` | volumes finaux |
| `03_tables_legacy.md` | legacy conserve ou ignore |
| `04_backlog_accepte.md` | backlog accepte |
| `05_decision_cloture.md` | decision de cloture |
| `06_rapport_executif.md` | synthese executive |

