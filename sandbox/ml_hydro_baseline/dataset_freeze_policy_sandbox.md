# Dataset Freeze Policy Sandbox

## Objectif

Garantir qu'un run E1 peut être relu et audité, même si la gouvernance complète E.1 n'est pas encore finalisée.

## Champs obligatoires

| Champ | Description |
|---|---|
| `dataset_snapshot_date` | date logique de l'extraction |
| `dataset_hash` | SHA256 du dataset extrait |
| `feature_list_hash` | SHA256 de la liste ordonnée des features |
| `split_config_hash` | SHA256 de la configuration de split |
| `model_config_hash` | SHA256 de la configuration modèle |
| `random_seed` | seed utilisée |
| `extraction_timestamp` | timestamp technique |
| `training_cutoff_date` | limite temporelle anti-leakage |
| `run_id` | identifiant immutable |

## Règles

- un dataset freeze ne doit jamais être modifié ;
- une correction crée un nouveau freeze ;
- les fichiers volumineux peuvent rester hors Git, mais leur hash doit être conservé ;
- les résultats sandbox ne doivent jamais remplacer les sources.

## Hash recommandé

```text
SHA256(file_bytes)
```

Pour les configs:

```text
SHA256(canonical_json_sorted_keys)
```

## Statut

Tous les freezes E1 sont:

```text
ML_SANDBOX_ONLY
```

