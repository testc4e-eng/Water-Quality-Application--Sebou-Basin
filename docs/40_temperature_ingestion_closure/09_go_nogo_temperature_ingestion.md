# GO/NOGO température ingestion

## Décision finale proposée
`GO_CONTROLLED_METEO_INSERT`

## Justification
- Source scientifiquement contrôlée.
- 37/37 stations résolues ou validées.
- Cas `Bab Ouender/Bab_Ouender` tranché comme `SAME_STATION_DIFFERENT_PERIODS` avec source alias conservé.
- La cible est vide : 0 ligne.
- La PK `(temps, station_id)` et la FK station existent.

## Condition obligatoire avant exécution
Appliquer d'abord le modèle lineage/rollback proposé et le valider. Sans `import_batch_id` en cible, le statut doit rester `GO_STAGING_ONLY`.

## Alternatives
- Option A : `GO_CONTROLLED_METEO_INSERT` après DDL lineage validé.
- Option B : `GO_STAGING_ONLY` si l'équipe refuse l'enrichissement cible.
- Option C : `NOGO_TEMPERATURE_INGESTION` uniquement si le modèle lineage est refusé et qu'aucune table de liaison batch n'est acceptée.

## Statut recommandé
`GO_CONTROLLED_METEO_INSERT_READY_AFTER_LINEAGE_DDL`.
