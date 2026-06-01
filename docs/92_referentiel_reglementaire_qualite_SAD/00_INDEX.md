# Référentiel réglementaire qualité SAD - Index

| Champ | Valeur |
|---|---|
| Statut | DDL_REGLEMENTAIRE_DEV_APPLIQUE__SEUILS_NON_CHARGES |
| Génération | 2026-05-19 09:15:57 |
| Source documentaire | `docs/40_enrichissement_normes_seuils_ABH/` |
| Source réglementaire opérationnelle | Tableau n°1 - Grille générale d'évaluation de la qualité des eaux de surface |
| Schéma cible | `metadata` |
| Dictionnaire canonique cible | `metadata.referentiel_parametre_canonique` |
| Paramètres réglementaires retenus | 41 |
| Seuils opérationnels Tableau n°1 | 205 |
| Paramètres exclus de la classification automatique | 18 |
| Seuils Tableau n°1 à vérifier | 0 - cas `Hg` arbitré métier |
| SQL exécuté | Oui - DDL DEV uniquement |
| Migration lancée | Non |
| Chargement seuils | Non |

| Fichier | Contenu | Statut |
|---|---|---|
| 00_INDEX.md | Index du référentiel réglementaire qualité SAD | créé |
| 01_DECISIONS_REGLEMENTAIRES.md | Décisions métier et périmètre officiel | créé |
| 02_PERIMETRE_PARAMETRES_REGLEMENTAIRES.md | Paramètres retenus et exclus | créé |
| 03_MAPPING_CANONIQUE_REGLEMENTAIRE.md | Correspondance canonique/réglementaire | créé |
| 04_REGLES_CLASSIFICATION_OFFICIELLES.md | Règles du moteur qualité | créé |
| 05_GESTION_PARAMETRES_NON_CLASSIFIABLES.md | Stratégie des paramètres non classifiables | créé |
| 06_ARCHITECTURE_SQL_REGLEMENTAIRE.md | Architecture SQL metadata | créé |
| 07_STRATEGIE_API_CLASSIFICATION.md | Contrats API cibles | créé |
| 08_STRATEGIE_INTEGRATION_PREDICTION_POLLUTION.md | Intégration prédiction pollution | créé |
| 09_PLAN_MIGRATION_CONTROLEE.md | Plan migration contrôlée | créé |
| 10_VALIDATIONS_METIER_RESTANTES.md | Validations restantes | créé |
| 11_SQL_DRY_RUN_PREPARATION.sql | SQL de contrôle dry-run | créé |
| 12_SQL_FINAL_A_VALIDER.sql | DDL final à valider | créé |
| 13_RAPPORT_IMPACTS_REFERENTIEL.md | Impacts référentiel | créé |
| 14_RAPPORT_POST_DDL_DEV.md | Rapport post-DDL DEV sans chargement seuils | créé |
| 15_SQL_LOAD_REGLEMENTAIRE_DEV.sql | Script de chargement DEV idempotent non exécuté | créé |
| 16_RAPPORT_CHARGEMENT_DEV_A_EXECUTER.md | Rapport d'exécution préparatoire du chargement DEV | créé |

## Décision structurante

Le moteur SAD utilise exclusivement le Tableau n°1 officiel. Les grilles simplifiées restent documentaires et doivent être taguées `DOCUMENTAIRE_NON_OPERATIONNEL`.

## Clôture métier du 2026-05-19

Les blocages métier ont été arbitrés : unités métaux, microbiologie, DBO5/DCO, alias `NO3`/`NO3-`, alias `O2_DISSOUS`/`O2_DISS`, mappings canoniques retrouvés, paramètres réellement absents du canonique, règle spécifique `Hg`, palette qualité et verrou final du périmètre Tableau n°1.

Statut restant : chargement contrôlé des référentiels et seuils. Le DDL DEV a été appliqué le 2026-05-19 ; aucune donnée réglementaire n'a encore été chargée.
