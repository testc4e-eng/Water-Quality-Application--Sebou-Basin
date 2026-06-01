# Plan de migration ETL

1. Import brut SHP vers `staging.raw_*` après validation.
2. Conservation stricte des champs originaux.
3. Ajout des métadonnées : `source_layer`, `source_file`, `import_batch_id`, `imported_at`, `geom_original`, `geom_4326`.
4. Profiling des champs.
5. Normalisation des libellés dans tables de travail, sans écraser le brut.
6. Création des référentiels.
7. Déduplication assistée via `qa.qa_anomalie_pollution`.
8. Rapprochement inventaire/mesures.
9. Chargement vers tables métier après arbitrage.
10. Génération de vues `api`.
11. Génération de vues/MVs `analytics`.
12. Rapports QA.

## Garde-fous

- Pas de suppression automatique.
- Pas de fusion sans table d'arbitrage.
- Traçabilité source → staging → modèle métier.
- SQL de ce dossier propositionnel uniquement.
