# État global projet SAD/WQDSS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | document maître |
| Périmètre | cockpit projet global, MVP, avancement, blocages et risques |
| Source de vérité | Oui, pour le statut décisionnel projet |
| Snapshot | audit documentaire + BD/code read-only actualisés au 2026-06-04 |

## Synthèse exécutive

Le projet est en phase de consolidation stratégique. La migration historique est clôturée avec backlog, les dashboards P0 existent en DEV, le périmètre `C1-B` IDP est clôturé en DEV avec un résiduel global désormais séparé du lot métier fermé, les référentiels qualité/pollution sont partiellement opérationnels, et les modèles SWAT/WASP ne sont plus traités comme blocages techniques internes tant que les validations scientifiques ne sont pas obtenues.

La base réelle `abh_sad` inspectée en lecture seule contient 339 objets tables/vues dans les schémas ciblés, 31 vues matérialisées et 4 554 colonnes. La documentation historique reste conservée, mais le pilotage courant passe par les documents maîtres de gouvernance.

## Modules et statut réel

| Module | Statut réel | Avancement | Fiabilité | Blocages | Priorité |
|---|---|---:|---|---|---|
| Gouvernance documentaire | `ACTIF_RESTRUCTURE` | 80% | Élevée | liens historiques et contradictions à réduire | P0 |
| Migration historique | `CLOTUREE_AVEC_BACKLOG` | 90% | Élevée | QA résiduelle et références historiques | P1 |
| Base métier hydro | `STABLE_AVEC_QA` | 85% | Élevée | flags débits et règles analytiques | P1 |
| Base métier météo | `PARTIEL_STABLE` | 85% | Moyenne | complétude historique à valider | P1 |
| Base qualité historique | `STABLE_AVEC_FLAGS` | 75% | Moyenne | paramètres et QA résiduels | P0 |
| Pollution IDP DEV | `C1B_CLOSED__GLOBAL_RESIDUAL_OPEN` | 78% | Moyenne | doublons exacts historiques, `POSSIBLE_MATCH`, `WAIT_SOURCE_FIX` | P0 |
| Référentiel paramètres | `PARTIEL_VALIDÉ` | 70% | Moyenne | alias et unités restants | P0 |
| Référentiel réglementaire qualité | `DEV_PARTIAL` | 55% | Moyenne | version active/seuils à valider | P0 |
| Backend FastAPI | `STABLE_DEV` | 75% | Moyenne | coexistence legacy/P0 et dette `public.*` non purgée du dépôt | P0 |
| API cartographique métier | `P0_DEV_READY` | 70% | Moyenne | séries temporelles partielles | P1 |
| Frontend dashboards | `DEV_READY_PARTIAL` | 70% | Moyenne | coexistence legacy/P0 | P1 |
| Ingestion V1 | `REFOCALISEE_VERS_MODULE_114` | 50% | Moyenne | registre des classes, workflow controle, staging/promotion | P0 |
| SWAT | `EXTERNAL_BUSINESS_DEPENDENCY` | 35% | Faible pour décisionnel | validation Reda | P1 |
| WASP | `EXTERNAL_BUSINESS_DEPENDENCY` | 35% | Faible pour décisionnel | validation Anas | P1 |
| Feature Store / Model Build | `SPECIFICATION_ONLY` | 40% | Conceptuelle | pas de DDL officiel | P2 |
| Graph AI / Deep Learning | `NON_OFFICIEL` | 15% | Conceptuelle | topologie et hydraulique non validées | P2 |

## Cardinalités critiques BD observées

| Objet | Cardinalité |
|---|---:|
| `infra.stations_mesure` | 390 |
| `infra.barrages` | 33 |
| `hydro.mesure_debit` | 652451 |
| `hydro.mesure_debit_mensuel` | 19316 |
| `hydro.mesure_barrage_param` | 272652 |
| `meteo.mesure_precipitation` | 546008 |
| `meteo.mesure_evaporation` | 48900 |
| `meteo.mesure_temperature` | 437889 |
| `qualite.mesure_qualite_riviere` | 59535 |
| `qualite.mesure_qualite_nappe` | 63047 |
| `qualite.mesure_qualite_barrage` | 7820 |
| `qualite.mesure_qualite_sebou` | 49954 |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 1780 |
| `qualite.source_pollution_prelevement` | 141 |
| `qualite.source_pollution_mesure_param` | 7191 |
| `geo.ref_site_pollution` | 2026 |
| `qualite.resultat_mesure` | 1409 |
| `wasp_sebou.wasp_results` | 931770 |

## Décisions majeures validées

| ID | Décision | Impact |
|---|---|---|
| DEC-001 | La migration historique est clôturée avec backlog | bascule vers gouvernance continue |
| DEC-002 | Les documents historiques sont déplacés/conservés comme preuves | réduction du bruit en racine docs |
| DEC-003 | Les outputs SWAT/WASP actuels restent sandbox legacy | pas d'usage officiel |
| DEC-004 | Le routage pollution reste topologique visuel | pas d'interprétation hydraulique scientifique |
| DEC-005 | Aucune fusion IDP destructive automatique | lineage et arbitrage préservés |
| DEC-006 | Les nouveaux dashboards P0 restent isolés | réduction des régressions legacy |
| DEC-007 | SWAT/WASP sortent du chemin critique technique court | la preproduction plateforme avance avant les résultats validés |

## Risques critiques

| Risque | Niveau | Action |
|---|---|---|
| Objets documentés mais absents ou renommés | Critique | traiter `docs/90_reorganisation_documentaire_finale/07_ecarts_documentation_vs_bd.md` |
| Références `public.*` encore actives | Critique | purger ou marquer legacy explicitement |
| Résiduel IDP global mal interprété comme blocage C1-B | Critique | distinguer `C1-B` fermé du backlog `IDP_DUPLICATE_CONSOLIDATION` / `IDP_POSSIBLE_MATCH_REVIEW` / `CLIENT_REQUIRED_DATA_FIX` |
| SWAT/WASP utilisés comme décisionnels | Critique | bloquer hors validation Reda/Anas |
| Confusion DEV/P0/officiel | Majeur | appliquer statuts documentaires partout |

Mise a jour P0-1 :

- les routeurs backend non montes ciblant `public.*` ont ete deplaces en quarantaine dans `backend/app/routers_legacy_public/` ;
- le risque `public.*` est desormais un risque legacy sous controle, et non une dependance runtime active.

## Nouveau chemin critique projet

```text
1. Qualification PREPROD backend/frontend/API/DB
2. Consolidation C3 reglementaire
3. Module 114 Administration & Ingestion Metier des Donnees
4. Validation environnement PREPROD
5. Raccordement ulterieur SWAT/WASP par contrat d'integration
```

## Decision de pilotage

```text
IDP_FINAL_STATUS = CLOSED_WITH_GOVERNED_BACKLOG
SWAT = EXTERNAL_BUSINESS_DEPENDENCY
WASP = EXTERNAL_BUSINESS_DEPENDENCY
PREPROD_TARGET = PREPROD_READY_BEFORE_SWAT_WASP_RESULTS
```

## Mise a jour 2026-06-05

- `P0-1 public.*` est traite a l'echelle runtime ;
- `P0-2 URL frontend/backend` est aligne ;
- le prochain chantier structurant est `114_data_admin_ingestion` ;
- objectif : industrialiser administration, audit, canevas, ingestion, validation, promotion et tracabilite sans ecriture directe frontend -> tables metier ;
- resultat attendu : remplacer progressivement corrections SQL manuelles, imports non traces, scripts ponctuels et rapports d'anomalies disperses.
- statut courant :
  - `114_MVP1_A_STATUS = DEV_DB_ACTIVE`
  - `114_MVP1_B_STATUS = FRONTEND_AUDIT_ACTIVE`
  - `114_MVP2_A_STATUS = TEMPLATE_GENERATION_ACTIVE`
  - `114_MVP2_B_STATUS = FIELD_REGISTRY_ENRICHED`
  - `114_MVP2_C_STATUS = UPLOAD_VALIDATION_STAGING_ACTIVE`
  - `114_MVP2_D_STATUS = DYNAMIC_REFERENTIAL_VALIDATION_ACTIVE`
  - `114_MVP3_STATUS = CHANGE_REQUEST_PROMOTION_ACTIVE`
  - `114_MVP3_B_STATUS = RBAC_PROMOTION_HARDENED`
  - `114_MVP3_C_STATUS = ROLLBACK_LOGIQUE_ACTIVE`
  - `114_MVP3_D_STATUS = INFRA_POLLUTION_EXTENSION_ACTIVE`
  - `114_MVP4_STATUS = RBAC_REAL_ACTIVE`
  - routeur `/api/v1/data-admin` actif ;
  - `data_admin.data_class_registry` et `data_admin.field_registry` crees dans la base runtime ;
  - `8` classes seedees ;
  - route `/admin/data-governance/audit` active en lecture seule ;
  - `DATA_ADMIN_UI = ACTIVE` ;
  - generation de canevas `.xlsx` / `.csv` active via `template/spec` et `template/generate` ;
  - `41` champs seedes dans `data_admin.field_registry` ;
  - `FIELD_REGISTRY_INCOMPLETE = FALSE` sur les classes prioritaires ;
  - `data_admin.ingestion_run`, `data_admin.ingestion_file`, `data_admin.ingestion_validation_error`, `data_admin.ingestion_staging_row` sont actifs ;
  - `data_admin.validation_rule_registry` est actif avec `24` regles seedes ;
  - les classes actives `HYDRO_DEBIT`, `METEO_PRECIPITATION`, `QUALITE_RIVIERE`, `INFRA_STATION`, `POLLUTION_SITE` supportent `upload -> validation -> staging` ;
  - la validation dynamique couvre references, doublons potentiels, plages raisonnables et coherence temporelle ;
  - l'onglet frontend `Ingestion` est actif dans `/admin/data-governance/audit` ;
  - `data_admin.change_request`, `data_admin.change_request_item`, `data_admin.promotion_audit_log` sont actifs ;
  - la promotion controlee `INSERT_ONLY` est active sur les classes pilotes avec revue/approbation/audit ;
  - les routes `data-admin` sont protegees par capacites derivees des roles authentifies existants ;
  - `RBAC_MODE = RBAC_REAL` sur les routes `data-admin` ;
  - l'acteur n'est plus `data_admin_ui` par defaut ; les traces HTTP utilisent `user:{id}:{email}` ;
  - les transitions invalides `DRAFT -> APPROVED`, `SUBMITTED -> APPLIED`, `REJECTED -> APPLIED`, `APPLIED -> APPLIED` sont refusees explicitement ;
  - `METEO_PRECIPITATION` et `QUALITE_RIVIERE` ont maintenant des campagnes E2E `APPLIED` validees ;
  - le rollback logique `INSERT_ONLY` est actif sur les promotions tracees ;
  - une campagne `HYDRO_DEBIT` a valide `+2` puis `-2` avec `request_status = APPLIED`, `rollback_status = APPLIED` et delta net nul ;
  - `INFRA_STATION` et `POLLUTION_SITE` sont maintenant actifs en geostaging et promotion `INSERT_ONLY` ;
  - les roles de demonstration DEV sont materialises :
    - `ROLE_DECIDEUR`
    - `ROLE_EXPERT`
    - `ROLE_CONSULTANT`
    - `ROLE_DATA_ADMIN`
    - `ROLE_SYS_ADMIN`
    - `ROLE_AI_AGENT` ;
  - les permissions reelles pilotent desormais l'interface et les endpoints sensibles ;
  - la demonstration client peut etre jouee avec comptes traces et separation des responsabilites ;
  - preuve runtime :
    - `HYDRO_DEBIT_valid.csv` applique `+2` lignes dans `hydro.mesure_debit` ;
    - `METEO_valid_*.csv` applique `+1` ligne dans `meteo.mesure_precipitation` ;
    - `QUALITE_valid_*.csv` applique `+1` ligne dans `qualite.mesure_qualite_riviere` ;
    - `INFRA_STATION` valide `390 -> 392 -> 390` ;
    - `POLLUTION_SITE` valide `2026 -> 2028 -> 2026` ;
    - `HYDRO_DEBIT_invalid.csv` refuse la creation de demande ;
    - `HYDRO_DEBIT_duplicate_candidate.csv` echoue proprement sans nouvelle ecriture metier ;
    - `INFRA_STATION_invalid_geom.csv` refuse la geometie invalide ;
    - `POLLUTION_SITE_invalid_srid.csv` refuse le SRID invalide ;
    - `POLLUTION_SITE_duplicate_geom.csv` passe en `VALIDATED_WITH_WARNINGS` ;
    - `geo.ref_site_pollution_source_link` reste a `105` ;
    - `site_code LIKE 'IDP-C1B-%'` reste a `75` ;
    - `rollback` refuse sans preparation, sans approbation, en double et sur cible non unique ;
  - prochaine etape : stabilisation de demonstration puis extension controlee `INFRA_BARRAGE` ou contrats operateurs.
