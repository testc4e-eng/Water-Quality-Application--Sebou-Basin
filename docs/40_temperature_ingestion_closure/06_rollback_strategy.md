# Stratégie rollback température

## Principe
Rollback logique versionné par `import_batch_id`, sans suppression massive.

## Règles
- Ne pas faire de `TRUNCATE`.
- Ne pas faire de `DELETE` massif sans procédure validée.
- Désactiver ou marquer le batch comme `ROLLED_BACK_LOGICAL`.
- Conserver `metadata.import_batch_lineage` pour audit.

## Procédure recommandée
1. Marquer le batch `ROLLED_BACK_LOGICAL` dans `metadata.import_batch`.
2. Exclure ce batch des vues/API opérationnelles via filtre `batch_status='COMMITTED'` ou `qa_status` actif.
3. Garder les lignes cible consultables audit si le modèle le permet.
4. Si retrait physique requis en DEV uniquement, utiliser une procédure séparée, signée, jamais par défaut.

## Point critique
Sans colonne `import_batch_id` dans `meteo.mesure_temperature`, le rollback logique fiable n'est pas possible. Cette colonne est donc bloquante avant insertion finale.
