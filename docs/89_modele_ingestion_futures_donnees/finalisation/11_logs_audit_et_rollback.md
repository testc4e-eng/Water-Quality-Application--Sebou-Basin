# Logs audit et rollback

## Audit obligatoire

| Objet | Donnees |
|---|---|
| batch | id, source, horodatage, operateur |
| fichier | nom, hash, taille, format |
| ligne | hash, statut, erreurs |
| mapping | ancien code, cible, methode |
| publication | table, volume, periode |
| rollback | sauvegarde, motif, operateur |

## Rollback

Chaque publication doit etre reversible par :

- `batch_id` ;
- `source_row_hash` ;
- `target_business_key_hash` ;
- backup logique avant update ;
- journal des FK impactees.

## Interdits

- pas de suppression sans backup ;
- pas de correction sans journal ;
- pas de rollback par `ctid` ;
- pas de mutation destructive SWAT/WASP legacy sans decision separee.
