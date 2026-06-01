# État global projet SAD/WQDSS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | document maître |
| Périmètre | cockpit projet global, MVP, avancement, blocages et risques |
| Source de vérité | Oui, pour le statut décisionnel projet |
| Snapshot | audit documentaire + BD read-only du 2026-05-22 |

## Synthèse exécutive

Le projet est en phase de consolidation stratégique. La migration historique est clôturée avec backlog, les dashboards P0 existent en DEV, les référentiels qualité/pollution sont partiellement opérationnels, et les modèles SWAT/WASP restent sandbox tant que les validations scientifiques ne sont pas obtenues.

La base réelle `abh_sad` inspectée en lecture seule contient 339 objets tables/vues dans les schémas ciblés, 31 vues matérialisées et 4 554 colonnes. La documentation historique reste conservée, mais le pilotage courant passe par les documents maîtres de gouvernance.

## Modules et statut réel

| Module | Statut réel | Avancement | Fiabilité | Blocages | Priorité |
|---|---|---:|---|---|---|
| Gouvernance documentaire | `ACTIF_RESTRUCTURE` | 80% | Élevée | liens historiques et contradictions à réduire | P0 |
| Migration historique | `CLOTUREE_AVEC_BACKLOG` | 90% | Élevée | QA résiduelle et références historiques | P1 |
| Base métier hydro | `STABLE_AVEC_QA` | 85% | Élevée | flags débits et règles analytiques | P1 |
| Base métier météo | `PARTIEL_STABLE` | 75% | Moyenne | température absente | P1 |
| Base qualité historique | `STABLE_AVEC_FLAGS` | 75% | Moyenne | paramètres et QA résiduels | P0 |
| Pollution IDP DEV | `GO_DEV__NOGO_PREPROD` | 60% | Moyenne | arbitrages spatiaux, doublons, orphelins | P0 |
| Référentiel paramètres | `PARTIEL_VALIDÉ` | 70% | Moyenne | alias et unités restants | P0 |
| Référentiel réglementaire qualité | `DEV_PARTIAL` | 55% | Moyenne | version active/seuils à valider | P0 |
| Backend FastAPI | `STABLE_DEV` | 75% | Moyenne | coexistence legacy/P0 et routeurs `public.*` | P0 |
| API cartographique métier | `P0_DEV_READY` | 70% | Moyenne | séries temporelles partielles | P1 |
| Frontend dashboards | `DEV_READY_PARTIAL` | 70% | Moyenne | coexistence legacy/P0 | P1 |
| Ingestion V1 | `SPECIFIEE_OPTIONNELLE` | 45% | Moyenne | industrialisation, rollback, QA blocking | P1 |
| SWAT | `SANDBOX_LEGACY` | 35% | Faible pour décisionnel | validation Reda | P0 |
| WASP | `SANDBOX_LEGACY` | 35% | Faible pour décisionnel | validation Anas | P0 |
| Feature Store / Model Build | `SPECIFICATION_ONLY` | 40% | Conceptuelle | pas de DDL officiel | P2 |
| Graph AI / Deep Learning | `NON_OFFICIEL` | 15% | Conceptuelle | topologie et hydraulique non validées | P2 |

## Cardinalités critiques BD observées

| Objet | Cardinalité |
|---|---:|
| `infra.stations_mesure` | 390 |
| `infra.barrages` | 33 |
| `hydro.mesure_debit` | 652446 |
| `hydro.mesure_debit_mensuel` | 19316 |
| `hydro.mesure_barrage_param` | 272652 |
| `meteo.mesure_precipitation` | 546007 |
| `meteo.mesure_evaporation` | 48900 |
| `meteo.mesure_temperature` | 0 |
| `qualite.mesure_qualite_riviere` | 59534 |
| `qualite.mesure_qualite_nappe` | 63047 |
| `qualite.mesure_qualite_barrage` | 7820 |
| `qualite.mesure_qualite_sebou` | 49954 |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 1780 |
| `qualite.source_pollution_prelevement` | 141 |
| `qualite.source_pollution_mesure_param` | 7191 |
| `geo.ref_site_pollution` | 1951 |
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

## Risques critiques

| Risque | Niveau | Action |
|---|---|---|
| Objets documentés mais absents ou renommés | Critique | traiter `docs/90_reorganisation_documentaire_finale/07_ecarts_documentation_vs_bd.md` |
| Références `public.*` encore actives | Critique | purger ou marquer legacy explicitement |
| IDP préproduction sans arbitrage spatial | Critique | maintenir `NOGO_PREPROD` |
| SWAT/WASP utilisés comme décisionnels | Critique | bloquer hors validation Reda/Anas |
| Confusion DEV/P0/officiel | Majeur | appliquer statuts documentaires partout |

