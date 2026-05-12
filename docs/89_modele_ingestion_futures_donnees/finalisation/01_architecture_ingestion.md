# Architecture ingestion

## Principe

Le module ingestion remplace les corrections historiques ponctuelles par un workflow auditable, rejouable et reversible.

## Couches

| Couche | Role |
|---|---|
| `landing` | depot fichier brut avec hash, nom, source, lot |
| `staging` | chargement brut typage faible, aucune perte |
| `normalisation` | mapping referentiel, unites, dates, GEO |
| `qa` | controles bloquants et warnings |
| `quarantaine` | lignes invalides ou ambiguës |
| `publication` | insertion tables metier ou vues d'exposition |
| `audit` | journal complet et rollback |

## Tables proposees

| Table | Role |
|---|---|
| `ingestion.batch` | lot d'ingestion |
| `ingestion.file_manifest` | fichiers, hash, source |
| `ingestion.row_audit` | statut ligne par ligne |
| `ingestion.quarantine` | erreurs et anomalies |
| `ingestion.mapping_decision` | decisions de mapping |
| `audit.ingestion_rollback_log` | rollback logique |

## Regle

Aucune ligne ne doit etre publiee sans statut QA explicite.
