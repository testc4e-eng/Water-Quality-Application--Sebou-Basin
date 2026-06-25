# DATA_QUALITY

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | règles de validation, QA, traçabilité et contrôles de données |
| Source de vérité | Oui |
| Documents liés | [DATABASE_SCHEMA](./DATABASE_SCHEMA.md), [DATA_FLOW](./DATA_FLOW.md), [API_DATA_MAPPING](./API_DATA_MAPPING.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Mécanismes de qualité déjà en place

- Indicateurs `est_valide`, `qa_flag_*`, `qa_checked_at` dans les tables de mesures métier.
- Validation structurelle des fichiers avant ingestion.
- Rapport de mapping avant publication.
- Détection de doublons via `audit.ingestion_dataset_signatures`.
- Contrôles de seuils via `qa.variable_thresholds`.
- Journalisation technique et métier dans `audit.ingestion_audit_logs`, `security.activity_logs`, `security.auth_logs`.

## 2. Objets de gouvernance avec comptages réels

| Objet | Comptage |
|---|---|
| `audit.ingestion_audit_logs` | 14 |
| `metadata.popup_rules_config` | 11 |
| `metadata.referentiel_parametre` | 91 |
| `security.activity_logs` | 71717 |
| `security.auth_logs` | 95 |
| `security.permissions` | 10 |
| `security.roles` | 3 |
| `security.users` | 3 |

## 3. Conséquences opérationnelles

- La base ne se limite pas à stocker des mesures ; elle intègre déjà la gouvernance de qualité et de traçabilité nécessaire à un SAD opérationnel.
- Les tables de logs et de paramètres QA sont mobilisables directement pour les annexes de rapport, les preuves de conformité et les tableaux d'exploitation.
