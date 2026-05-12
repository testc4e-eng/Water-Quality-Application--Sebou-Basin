# Décisions métier intégrées

## Décisions validées

| ID | Décision | Conséquence opérationnelle | Statut |
|---|---|---|---|
| D01 | Les données SWAT/WASP actuellement stockées dans `abh_sad` seront remplacées ou mises à jour. | Classer les schémas SWAT/WASP/modèles en backup puis vidage proposé. | PENDING exécution |
| D02 | Les données SWAT/WASP peuvent être supprimées après backup. | Générer `10_sql_vidage_swat_wasp_propose.sql` avec TRUNCATE commentés. | PENDING exécution |
| D03 | Le schéma `staging` de `abh_sad` doit être vidé puis reconstruit depuis `abh_sebou_ismail`. | Lot A prioritaire avant toute migration finale. | PENDING exécution |
| D04 | La migration se poursuit par validation progressive des schémas métier. | Lots C puis E, aucun passage automatique. | PENDING validation |
| D05 | Les référentiels paramètres doivent être reconstruits depuis les fichiers validés métier. | Lot D obligatoire avant chargement final qualité/pollution. | PENDING validation |
| D06 | Aucune modification BD sans validation humaine explicite. | Tous les scripts restent proposés, commentés, non exécutés. | PENDING global |
| D07 | `public.spatial_ref_sys` est une table technique PostGIS, pas une donnée client métier. | Exclure cette table de l'import Lot A vers `staging.raw_*`. | VALIDÉ métier, exécution PENDING |
| D08 | Le Lot A doit être validé en deux sous-validations. | A1 = backup complet + exports CSV staging ; A2 = vidage staging + import des 46 tables source métier. | VALIDÉ principe, exécution PENDING |

## Sources utilisées

| Source | Usage dans le plan |
|---|---|
| docs/47_migration_depuis_abh_sebou_ismail/ | Tables cible, tables source, règles QA, journalisation |
| docs/39_inventaire_parametres_metier_REGEN/ | Inventaire propre des paramètres et tableau métier |
| docs/40_enrichissement_normes_seuils_ABH/ | Seuils/normes ABH et écarts d’unités |
| docs/42_analyse_parametres_valeurs_migration/ | Statuts de migration paramètres, valeurs non numériques, règles QA |
| docs/retour equipe metier.xlsx | Validation métier paramètres si utilisée comme référence finale |

## Contraintes maintenues

- Backup obligatoire avant toute future exécution.
- Chaque lot reste `PENDING` tant qu’il n’est pas validé.
- Aucune commande destructive active dans les scripts.
- Les structures SQL sont conservées sauf décision DBA explicite ultérieure.
- `public.spatial_ref_sys` reste hors périmètre d'import métier du Lot A.
