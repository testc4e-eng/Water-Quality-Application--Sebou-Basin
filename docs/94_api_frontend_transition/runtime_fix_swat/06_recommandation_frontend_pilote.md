# Recommandation frontend pilote

| Action | Décision |
|---|---|
| Backend global | `GO` |
| OpenAPI | `GO` |
| Frontend pilote Métaux | `GO` |
| Frontend pilote Chimie minérale | `GO` |
| SWAT analysis | `DISABLED_OPTIONAL` |
| Ingestion API | `DISABLED_OPTIONAL` |

## Recommandation

Le backend global est stabilisé pour lancer un pilote frontend sur les endpoints P0 qualité.

Ordre recommandé :

1. Frontend pilote Métaux sur `/api/v1/qualite/metaux`.
2. Frontend pilote Chimie minérale sur `/api/v1/qualite/chimie-minerale`.
3. Garder SWAT analysis et ingestion désactivés tant que l'environnement scientifique `numpy/pandas` n'est pas validé.

## Conditions de passage frontend

- Ne pas consommer les tables métier.
- Ne pas utiliser `/raw`.
- Préserver `MO != Mo`.
- Ne pas exposer `FM`, `F_M_MES`, `MO_METAL`.

Statut : `BACKEND_RUNTIME_STABILIZED_OPTIONAL_SWAT`
