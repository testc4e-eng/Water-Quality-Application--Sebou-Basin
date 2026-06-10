# Module Administration & Ingestion Métier des Données

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | dossier de conception et de démarrage |
| Source de vérité | Oui pour le chantier 114 |
| Dernière mise à jour | 2026-06-05 |

## Objectif

Industrialiser l'administration, l'audit, l'ingestion, la validation et la traçabilité des données SAD sans intervention directe en base depuis le frontend.

## Positionnement projet

- `IDP` est sorti du chemin critique avec backlog gouverné.
- `public.*` n'est plus une dépendance runtime critique.
- `SWAT` et `WASP` sont désormais des dépendances métier externes.
- Le socle PREPROD est suffisamment stabilisé pour ouvrir un chantier de gouvernance opérationnelle de la donnée.

## Livrables

1. [01_audit_existant.md](./01_audit_existant.md)
2. [02_architecture_cible.md](./02_architecture_cible.md)
3. [03_data_class_registry.md](./03_data_class_registry.md)
4. [04_workflow_modification_controlee.md](./04_workflow_modification_controlee.md)
5. [05_workflow_ingestion_intelligente.md](./05_workflow_ingestion_intelligente.md)
6. [06_generation_canevas_metier.md](./06_generation_canevas_metier.md)
7. [07_realtime_data_reception_strategy.md](./07_realtime_data_reception_strategy.md)
8. [08_security_roles_permissions.md](./08_security_roles_permissions.md)
9. [09_implementation_roadmap.md](./09_implementation_roadmap.md)
10. [10_mvp1a_db_activation_report.md](./10_mvp1a_db_activation_report.md)
11. [11_mvp1b_frontend_audit_report.md](./11_mvp1b_frontend_audit_report.md)
12. [12_mvp2a_template_generation_report.md](./12_mvp2a_template_generation_report.md)
13. [13_mvp2b_field_registry_enrichment_report.md](./13_mvp2b_field_registry_enrichment_report.md)
14. [14_mvp2c_upload_validation_staging_report.md](./14_mvp2c_upload_validation_staging_report.md)
15. [15_mvp2d_dynamic_referential_validation_report.md](./15_mvp2d_dynamic_referential_validation_report.md)
16. [16_mvp3_change_request_promotion_report.md](./16_mvp3_change_request_promotion_report.md)
17. [17_mvp3b_rbac_promotion_hardening_report.md](./17_mvp3b_rbac_promotion_hardening_report.md)
18. [17_mvp3b_rollback_design.md](./17_mvp3b_rollback_design.md)
19. [18_mvp3c_rollback_logique_report.md](./18_mvp3c_rollback_logique_report.md)
20. [19_mvp3d_extend_infra_pollution_report.md](./19_mvp3d_extend_infra_pollution_report.md)
21. [20_rbac_audit.md](./20_rbac_audit.md)
22. [21_rbac_target_architecture.md](./21_rbac_target_architecture.md)
23. [22_rbac_implementation_report.md](./22_rbac_implementation_report.md)
24. [DEMO_ACCOUNTS.md](./DEMO_ACCOUNTS.md)

## Décision de cadrage

Le module 114 devient le centre cible de gouvernance opérationnelle des données.

Il ne remplace pas immédiatement :

- le `data viewer` CRUD générique `/data` ;
- le scan `/admin/data-scan` ;
- l'ingestion SWAT/WASP existante ;
- les scripts d'import historiques.

Il doit d'abord les encapsuler, les qualifier, puis les remplacer progressivement par :

- un registre de classes métier ;
- des workflows contrôlés ;
- des validations explicites ;
- une auditabilité complète.

## Références amont

- [../113_preproduction_readiness/02_preprod_readiness_report.md](../113_preproduction_readiness/02_preprod_readiness_report.md)
- [../113_preproduction_readiness/05_ingestion_validation_versioning_strategy.md](../113_preproduction_readiness/05_ingestion_validation_versioning_strategy.md)
- [../00_SOURCE_OF_TRUTH_MASTER.md](../00_SOURCE_OF_TRUTH_MASTER.md)

## Statut implementation

```text
114_MVP1_A_STATUS = DEV_DB_ACTIVE
114_MVP1_B_STATUS = FRONTEND_AUDIT_ACTIVE
114_MVP2_A_STATUS = TEMPLATE_GENERATION_ACTIVE
114_MVP2_B_STATUS = FIELD_REGISTRY_ENRICHED
114_MVP2_C_STATUS = UPLOAD_VALIDATION_STAGING_ACTIVE
114_MVP2_D_STATUS = DYNAMIC_REFERENTIAL_VALIDATION_ACTIVE
114_MVP3_STATUS = CHANGE_REQUEST_PROMOTION_ACTIVE
114_MVP3_B_STATUS = RBAC_PROMOTION_HARDENED
114_MVP3_C_STATUS = ROLLBACK_LOGIQUE_ACTIVE
114_MVP3_D_STATUS = INFRA_POLLUTION_EXTENSION_ACTIVE
114_MVP4_STATUS = RBAC_REAL_ACTIVE
```

Etat courant :

- le code backend lecture seule est implemente ;
- le schema `data_admin` est active dans la base runtime `abh_sad` ;
- le seed `8` classes est applique ;
- l'API `/api/v1/data-admin/*` repond en `status=OK` sur le runtime actif ;
- la route frontend `/admin/data-governance/audit` est active en lecture seule ;
- le frontend consomme exclusivement `/api/v1/data-admin/*` ;
- les endpoints `template/spec` et `template/generate` sont actifs ;
- `data_admin.field_registry` est enrichi pour les classes MVP2 prioritaires ;
- `FIELD_REGISTRY_INCOMPLETE = FALSE` sur les specs prioritaires ;
- les endpoints ingestion `upload/runs/errors/staging-preview` sont actifs pour `HYDRO_DEBIT`, `METEO_PRECIPITATION`, `QUALITE_RIVIERE`, `INFRA_STATION`, `POLLUTION_SITE` ;
- `data_admin.validation_rule_registry` est actif avec `24` regles dynamiques ;
- les endpoints `validation-rules` sont actifs ;
- l'onglet frontend `Ingestion` est actif dans `/admin/data-governance/audit` ;
- les endpoints `change-request` et `audit-log` sont actifs ;
- la promotion controlee `INSERT_ONLY` est active pour `HYDRO_DEBIT`, `METEO_PRECIPITATION`, `QUALITE_RIVIERE` ;
- aucune promotion automatique n'est autorisee ;
- le cas warning doublon peut etre approuve mais echoue proprement a l'apply si la ligne existe deja en cible ;
- les routes `data-admin` sont maintenant protegees par capacites derivees des roles authentifies existants ;
- les acteurs traces sont de type `user:{id}:{email}` ;
- `METEO_PRECIPITATION` et `QUALITE_RIVIERE` ont ete promues avec succes en campagne E2E controlee ;
- le rollback logique `INSERT_ONLY` est maintenant actif avec approbation dediee ;
- la campagne `HYDRO_DEBIT` valide bien `+2` puis `-2` avec delta net nul ;
- `INFRA_STATION` supporte maintenant `upload -> validation geospatiale -> staging -> change_request -> apply -> rollback` ;
- `POLLUTION_SITE` supporte maintenant `upload -> validation geospatiale -> staging -> change_request -> apply -> rollback` ;
- les garde-fous IDP sont actifs :
  - refus `site_code LIKE 'IDP-C1B-%'`
  - aucune creation de `geo.ref_site_pollution_source_link`
  - aucune fusion automatique ;
- la campagne `INFRA_STATION` valide `+2` puis `-2` avec delta net nul ;
- la campagne `POLLUTION_SITE` valide `+2` puis `-2` avec delta net nul ;
- les routes `data-admin` sont maintenant protegees par permissions reelles lues depuis `security.role_permissions` ;
- les roles cibles de demonstration actifs sont :
  - `ROLE_DECIDEUR`
  - `ROLE_EXPERT`
  - `ROLE_CONSULTANT`
  - `ROLE_DATA_ADMIN`
  - `ROLE_SYS_ADMIN`
  - `ROLE_AI_AGENT` ;
- les comptes de demonstration DEV sont materialises en base avec mots de passe hashés ;
- le prochain lot recommande devient `114_MVP4_RBAC_REEL_ET_CONTRATS_OPERATEURS` si la demonstration n'est pas encore jouee, sinon une extension controlee vers `INFRA_BARRAGE`.
