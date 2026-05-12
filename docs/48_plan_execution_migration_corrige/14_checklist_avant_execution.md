# Checklist avant exécution

Aucune exécution n'est autorisée tant que tous les contrôles obligatoires du lot concerné ne sont pas validés.

| ID | Contrôle | Statut |
|---|---|---|
| C01 | Validation écrite source officielle `abh_sebou_ismail` | VALIDÉ utilisateur |
| C02 | Validation backup complet `abh_sad` | VALIDÉ utilisateur |
| C03 | Validation exports CSV staging | VALIDÉ utilisateur |
| C04 | Confirmation exclusion `public.spatial_ref_sys` de l'import Lot A | VALIDÉ métier, exécution PENDING |
| C05 | Validation exports CSV SWAT/WASP | PENDING |
| C06 | Validation vidage `staging` | VALIDÉ utilisateur (35 tables, total après 0) |
| C07 | Validation import des 46 tables métier `staging.raw_*` depuis source | VALIDÉ utilisateur (delta source/raw 0) |
| C08 | Validation remplacement SWAT/WASP | PENDING |
| C09 | Validation actions schémas `qualite`, `hydro`, `meteo`, `infra`, `metadata` | PENDING |
| C10 | Validation référentiel paramètres reconstruit | PENDING |
| C11 | Validation règles QA/parsing | PENDING |
| C12 | Validation tables quarantaine/logs | PENDING |
| C13 | Validation dry-run Lot E | VALIDÉ utilisateur |
| C14 | Validation structure Lot D1 `metadata.parametre_master`, `mapping_parametre_source_new`, `unites`, `seuils` | VALIDÉ utilisateur |
| C15 | Validation échantillon Lot D2 30 paramètres consolidés | VALIDÉ utilisateur |
| C16 | Validation référentiel complet Lot D3 avant exécution metadata | NON VALIDÉ EN BLOC - remplacé par D3.1 |
| C17 | Validation corrections ciblées Lot D3.1 avant exécution metadata | PENDING VALIDATION |

## Blocages actuels

- Lot A est exécuté et validé ; Lots B, C, D3 et E restent non autorisés.
- Scripts SQL Lot D uniquement proposés et commentés.
- Référentiel paramètres à reconstruire depuis fichiers validés métier.
- Tables finales non autorisées à recevoir des données avant QA et validation Lot E.
- Lot D3.1 est produit, mais aucune exécution `metadata` ni Lot E n'est autorisé tant que C17 n'est pas validé.
