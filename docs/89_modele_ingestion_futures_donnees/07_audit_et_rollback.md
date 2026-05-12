# Audit et rollback

## Audit ingestion

Chaque batch doit enregistrer :

- `batch_id`
- utilisateur
- fichier source
- hash fichier
- domaine
- table cible
- volumes lus, exclus, charges
- statut
- dates debut/fin
- erreurs et warnings

## Rollback

Rollback par batch :

1. identifier `batch_id`
2. verifier tables touchees
3. sauvegarder etat courant si necessaire
4. supprimer uniquement lignes du batch
5. reconstruire vues/MV si besoin
6. auditer rollback

## Interdiction

Pas de rollback par `ctid`.

Utiliser uniquement :

- `batch_id`
- `source_row_hash`
- `target_business_key_hash`
- cles metier stables

