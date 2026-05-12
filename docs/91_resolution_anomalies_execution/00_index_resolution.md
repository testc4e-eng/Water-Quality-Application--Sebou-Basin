# Resolution anomalies - index execution

## Mode

Audit read-only uniquement.

Interdits non executes :

- `INSERT`
- `UPDATE`
- `DELETE`
- `TRUNCATE`
- `DROP`
- migration Alembic
- suppression SWAT/WASP

## Source

Dossier source : `docs/86_rapport_anomalies_client/`

Statut migration client : `MIGRATION_CLIENT_CLOTUREE_AVEC_BACKLOG`

## Blocs traites

| Bloc | Fichier | Statut |
|---|---|---|
| 1 | `01_bloc_referentiel_qualite.md` | analyse read-only terminee |
| 2 | `02_bloc_donnees_QA.md` | analyse read-only terminee |
| 3 | `03_bloc_IDP_GEO_client.md` | analyse read-only terminee |
| 4 | `04_bloc_modelisation_legacy.md` | analyse read-only terminee |

## Synthese premiere passe

| Decision cible | Nombre anomalies |
|---|---:|
| `A_CORRIGER_C4E_IMMEDIAT` | 0 |
| `A_PROPOSER_CORRECTION_C4E` | 11 |
| `CLIENT_REQUIRED` | 6 |
| `HORS_PERIMETRE_MIGRATION` | 1 |
| `LEGACY_IGNORE` | 2 |
| `LEGACY_MODELING_TO_REPLACE` | 3 |
| `BACKLOG_TECHNIQUE` | 2 |
| `CLOTURE_SANS_ACTION` | 2 |

Total anomalies analysees : 27.

## Prochaine anomalie recommandee

`REF-001` a `REF-004` : `parametre_ref_id` null qualite.

Raison : fort volume, correction probablement automatisable par mapping/alias existants, impact direct sur dashboards qualite et analyses IA.
