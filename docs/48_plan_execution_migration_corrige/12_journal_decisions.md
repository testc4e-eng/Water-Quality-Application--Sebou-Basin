# Journal décisions — plan exécution migration corrigé

Les décisions A1/A2 sont exécutées et validées par l'utilisateur. D1/D2 sont validés pour produire D3. Les lots B, C, exécution metadata D3 et E restent bloqués sans validation explicite.

| Lot | Sujet | Décision attendue | Validateur | Date | Statut |
|---|---|---|---|---|---|
| Lot A | Approche Lot A | Lot A réalisé en deux sous-validations A1 puis A2 | Utilisateur | 2026-04-30 | EXECUTED - VALIDÉ UTILISATEUR |
| Lot A1 | Backup staging | Backup complet `abh_sad` + exports CSV des 35 tables `staging` produits ; preuves validées | Utilisateur | 2026-04-29 | EXECUTED - VALIDÉ UTILISATEUR |
| Lot A2 | Vidage/import staging | 35 tables staging vidées + 46 tables source métier importées, hors `public.spatial_ref_sys` ; contrôles validés par l'utilisateur | Utilisateur | 2026-04-30 | EXECUTED - VALIDÉ UTILISATEUR |
| Lot B | Vidage SWAT/WASP | Valider remplacement/mise à jour des données modèles |  |  | PENDING |
| Lot C | Schémas métier | Valider actions par table métier |  |  | PENDING |
| Lot D1 | Structure référentiel paramètres | Structure `metadata.parametre_master`, `metadata.mapping_parametre_source_new`, `metadata.unites`, `metadata.seuils` validée comme cible de travail ; aucune création DB exécutée | Utilisateur | 2026-04-30 | VALIDÉ UTILISATEUR |
| Lot D2 | Échantillon référentiel paramètres | 30 paramètres consolidés avec mapping réel validés pour généralisation D3 | Utilisateur | 2026-05-04 | VALIDÉ UTILISATEUR |
| Lot D3 | Référentiel paramètres complet | 200 paramètres canonisés + 514 mappings source produits ; non recommandé en bloc, corrigé par D3.1 |  | 2026-05-04 | PRODUIT, REMPLACÉ PAR D3.1 |
| Lot D3.1 | Corrections ciblées référentiel paramètres | Fe/Mn corrigés, météo/conductivité enrichies, modèles isolés ; validation humaine requise avant exécution metadata |  | 2026-05-04 | PENDING VALIDATION |
| Lot E0 | Dry-run migration | Valider la préparation des résultats temporaires, parsing, conversions, flags et contrôles de volumes sans chargement final |  |  | PENDING |
| Lot E | Migration finale | Valider Lot E0, QA, quarantaine et chargement final |  |  | PENDING |

## Décisions détaillées à compléter

| Lot | Table / périmètre | Action proposée | Impact attendu | Statut |
|---|---|---|---|---|
| Lot A1 | 35 tables `staging` | backup complet + exports CSV | staging historique sécurisé avant vidage ; delta exports = 0 | EXECUTED - VALIDÉ UTILISATEUR |
| Lot A2 | 35 tables `staging` | vidage exécuté après validation A1 | total avant 2249330 ; total après 0 | EXECUTED - VALIDÉ UTILISATEUR |
| Lot A2 | 46 tables source métier | import vers `staging.raw_*` exécuté | source 2175895 ; raw 2175895 ; delta 0 | EXECUTED - VALIDÉ UTILISATEUR |
| Lot A2 | `public.spatial_ref_sys` | exclusion de l'import raw | table technique PostGIS non dupliquée en staging métier | VALIDÉ métier, exécution PENDING |
| Lot B | 23 tables SWAT/WASP/modèles | backup puis vidage proposé | anciennes sorties modèles remplacées plus tard | PENDING |
| Lot C | 79 tables métier | revue progressive | schémas finaux préparés | PENDING |
| Lot D1 | structure metadata | SQL DDL proposé non exécuté | aucune table metadata créée ; structure validée pour D2 | VALIDÉ UTILISATEUR |
| Lot D2 | référentiel paramètres échantillon | génération 30 paramètres consolidés | validé pour propagation D3 | VALIDÉ UTILISATEUR |
| Lot D3 | référentiel paramètres complet | génération complète sans exécution DB | 200 paramètres canonisés ; 514 mappings ; SQL actif 0 | PRODUIT, REMPLACÉ PAR D3.1 |
| Lot D3.1 | référentiel paramètres corrigé | corrections ciblées sans exécution DB | 200 paramètres ; 525 mappings ; SQL actif 0 | PENDING VALIDATION |
| Lot E0 | schéma dry-run + résultats temporaires | préparation contrôlée sans chargement final | résultats comparables source / préparé / quarantaine | PENDING |
| Lot E | pipeline final | migration contrôlée avec QA | tables finales propres | PENDING |

| Lot E1 | Migration finale sans IDP | Exécution réelle limitée à `hydro.*`, `meteo.*`, `qualite.*` depuis `qa_dry_run.e0_mesures_preparees`, rollback tracé dans `qa_dry_run.e1_insert_audit` | Utilisateur | 2026-05-05 | EXECUTED |
