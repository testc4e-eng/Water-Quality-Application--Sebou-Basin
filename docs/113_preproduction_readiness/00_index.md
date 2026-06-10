# 113 - Preproduction Readiness

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | dossier de pilotage preproduction |
| Source de verite | Secondaire ; s'appuie sur code et BD verifies |
| Derniere mise a jour | 2026-06-04 |

## Finalite

Ce dossier requalifie le chemin critique du projet SAD en partant prioritairement :

1. de la base `abh_sad` ;
2. du code monte dans `backend` et `frontend` ;
3. des vues et services runtime ;
4. de la documentation seulement comme contexte secondaire.

## Livrables

- [01_public_schema_dependency_report.md](./01_public_schema_dependency_report.md)
- [02_preprod_readiness_report.md](./02_preprod_readiness_report.md)
- [03_swat_integration_contract.md](./03_swat_integration_contract.md)
- [04_wasp_integration_contract.md](./04_wasp_integration_contract.md)
- [05_ingestion_validation_versioning_strategy.md](./05_ingestion_validation_versioning_strategy.md)
- [06_ai_target_architecture.md](./06_ai_target_architecture.md)

## Conclusion directrice

- `IDP` sort du chemin critique projet.
- `SWAT` et `WASP` ne sont plus des blocages techniques internes tant que les resultats scientifiques valides ne sont pas livres.
- Le chemin critique court devient :
  1. purge des dependances `public.*` encore presentes dans le code legacy ;
  2. qualification preproduction backend/frontend/API/DB ;
  3. finalisation du perimetre `C3` reglementaire vers un usage PREPROD ;
  4. contractualisation de l'integration future SWAT/WASP ;
  5. preparation du socle IA/ML.
