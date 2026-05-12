# Plan de validation humaine par lot

## Principe
Chaque lot est bloquant. Aucun lot ne passe au statut exécuté sans validation explicite, signée et horodatée.

| Lot | Décision attendue | Responsable | Preuve requise | Statut |
|---|---|---|---|---|
| Lot A1 | Valider backup complet + exports CSV staging | Chef projet + DBA | dump complet, exports CSV des 35 tables staging, checksums, volumes avant traitement | EXECUTED - VALIDÉ UTILISATEUR |
| Lot A2 | Valider vidage staging + import source métier | Chef projet + DBA | 35 tables staging vidées, 46 tables raw importées, delta source/raw 0 | EXECUTED - VALIDÉ UTILISATEUR |
| Lot B | Valider vidage SWAT/WASP | Métier modèle + DBA | backup tables modèles, décision remplacement | PENDING |
| Lot C | Valider schéma métier par schéma | ABH + équipe technique | tableau actions par table | PENDING |
| Lot D1 | Valider structure référentiel paramètres | ABH métier + DBA | structure `parametre_master`, `mapping_parametre_source_new`, `unites`, `seuils` | VALIDÉ UTILISATEUR |
| Lot D2 | Valider échantillon paramètres consolidés | ABH métier | 30 paramètres consolidés, mapping réel, règles parsing, SQL proposé non exécuté | VALIDÉ UTILISATEUR |
| Lot D3 | Généraliser à tout l'inventaire | ABH métier + équipe data | couverture complète, paramètres en quarantaine, SQL proposé | PRODUIT, remplacé par D3.1 |
| Lot D3.1 | Valider corrections ciblées du référentiel complet | ABH métier + équipe data | Fe/Mn corrigés, météo/conductivité enrichies, modèles isolés, SQL proposé | PENDING VALIDATION |
| Lot E0 | Valider le dry-run de migration | ABH + DBA + équipe data | schéma temporaire, résultats préparés, volumes comparés, rapport dry-run | PENDING |
| Lot E | Valider migration finale progressive | ABH + DBA + équipe data | Lot E0 validé, QA, quarantaine, rapport de contrôle | PENDING |

## Règle de passage

- `PENDING` : aucune exécution autorisée.
- `VALIDATED` : script exécutable à préparer pour le lot uniquement.
- `EXECUTED` : exécution tracée dans un log séparé après validation.
- `BLOCKED` : anomalie ou décision manquante.

## Journalisation obligatoire

Chaque décision doit renseigner : lot, table ou périmètre, décision, validateur, date, justification, preuve backup, impact attendu.
