# Tableau global des entités problématiques

| ID | Bloc | Entité | Type entité | Problème | Volume BD | Exemple | Source anomalie | Table / fichier | Décision attendue | Priorité |
|---|---|---|---|---|---:|---|---|---|---|---|
| PARAM-001 | Paramètres | H_G | paramètre | ambigu ; non mappé ; sens non figé | 4 108 | `H_G = 2.396` à `pt rp1 aval taza` | A02, A13 | `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_sebou` | définir la signification officielle | Critique |
| PARAM-002 | Paramètres | sat | paramètre | ambigu ; unité absente | 1 220 | `sat = 941.2` | A02, A11 | tables qualité | confirmer le sens et l'unité | Critique |
| PARAM-003 | Paramètres | Conductivite / Conductivité | paramètre | variante de nom ; unité absente ; non mappé partiel | 9 025 | `1795`, `2200` | A01, A11, A13 | tables qualité + tables d'écarts | figer un libellé officiel | Élevée |
| PARAM-004 | Paramètres | NO3- / Nitrates | paramètre | variante de nom ; unité absente | 9 112 | `15300` | A01, A11, A13 | tables qualité + tables d'écarts | figer un libellé officiel | Élevée |
| PARAM-005 | Paramètres | T_eau | paramètre | libellé historique ; unité absente ; valeurs extrêmes à confirmer | 9 391 | `213` | A01, A11, A14 | tables qualité | fixer le libellé et l'unité | Élevée |
| PARAM-006 | Paramètres | PTD | paramètre | ambigu ; unité absente | 136 | `88` | A02, A11 | tables qualité | confirmer la définition | Élevée |
| PARAM-007 | Paramètres | PTP | paramètre | ambigu ; unité absente | 136 | `88` | A02, A11 | tables qualité | confirmer la définition | Élevée |
| PARAM-008 | Paramètres | F_M_mes | paramètre | code flou ; unité absente | 11 | `301` | A02, A11 | tables qualité | confirmer le sens métier | Élevée |
| PARAM-009 | Paramètres | paramètres non mappés Sebou | paramètre | plusieurs paramètres encore en écart | 27 678 lignes signalées | `Conductivité`, `Nitrates`, `H_G` | A13 | `metadata.mapping_parametre_unresolved_suivi_qualite_sebou` | valider l'intégration ou l'exclusion | Critique |
| POLL-001 | Pollution | prélèvements non rattachés | point de prélèvement | absence de lien référentiel | 26 | `AVAL REJET INDUSTRIEL MERJA` | A07 | `qualite.source_pollution_prelevement` | décider mise en attente ou rattachement | Critique |
| POLL-002 | Pollution | référentiel rejets | référentiel pollution | référentiel non totalement fermé | 141 prélèvements concernés | plusieurs communes | A05 | `qualite.source_pollution_prelevement`, `infra.rejet_*` | valider la liste officielle des rejets | Critique |
| POLL-003 | Pollution | codes `DOM/PDOM/PDS` | code rejet | code vague | plusieurs cas | `TAZ_PDOM_R9` | A05, A07 | `qualite.source_pollution_prelevement` | décider s'ils restent visibles métierement | Élevée |
| POLL-004 | Pollution | ensembles pollution source / inventaire | ensemble | fragmentation source / cible | 277 + 56 + autres inventaires | `staging.rejets_brutes` vs `infra.rejet_inventaire_pollution` | A06 | `staging.*`, `infra.*inventaire_pollution*` | définir la source de référence | Critique |
| DATA-001 | Données | valeurs qualité nulles | donnée qualité | lignes incomplètes | 16 803 | valeur `[vide]` | A08 | tables `qualite.*` | décider exclusion ou conservation comme trace | Élevée |
| DATA-002 | Données | évaporation manquante | série météo | série partielle | 10 308 | `valeur = [vide]` | A09 | `meteo.mesure_evaporation` | définir le niveau de complétude acceptable | Élevée |
| DATA-003 | Données | précipitation observée manquante avec alternative | série météo | observé absent mais alternative disponible | 45 702 | observé `[vide]`, NASA `0.62` | A09 | `meteo.mesure_precipitation` | distinguer observé et alternative | Élevée |
| DATA-004 | Données | température | variable | non injectée en base | 0 | aucune ligne | A10 | `meteo.mesure_temperature` | confirmer la source et la priorité d'injection | Critique |
| DATA-005 | Données | débits négatifs | série hydro | valeurs incohérentes | 1 931 | `-2` à `ait khabbach` | A14 | `hydro.mesure_debit` | valider la règle de traitement | Critique |
| DATA-006 | Données | CF négatif | valeur qualité | valeur incohérente | 1 | `-0.4` à `dar el arsa` | A03, A14 | `qualite.mesure_qualite_riviere` | valider la règle de traitement | Élevée |
| DATA-007 | Données | valeurs extrêmes `sat`, `NO3-`, `T_eau`, `H_G` | valeurs qualité | interprétation incertaine | à confirmer par seuil | `sat = 941.2`, `NO3- = 15300`, `T_eau = 213`, `H_G = 377` | A02, A14 | tables qualité | confirmer l'unité et les seuils métier | Critique |
| REF-001 | Référentiels | puits à captage cuvelé | station | nom générique et homonyme | 17 | plusieurs codes | A04, A15 | `infra.stations_mesure` | distinguer officiellement les entités | Critique |
| REF-002 | Référentiels | forage | station | nom générique et homonyme | 12 | plusieurs codes | A04, A15 | `infra.stations_mesure` | distinguer officiellement les entités | Critique |
| REF-003 | Référentiels | stations sans nom | station | nom absent | 7 | plusieurs UUID | A04 | `infra.stations_mesure` | compléter les noms | Critique |
| REF-004 | Référentiels | Bouhouda | barrage | homonyme / doublon | 2 | `1699/9` | A04, A12 | `infra.barrages` | arbitrer le statut exact | Critique |
| REF-005 | Référentiels | barrage sans nom | barrage | nom et `ire` absents | 1 | `id = 34` | A04 | `infra.barrages` | compléter ou exclure | Critique |
| REF-006 | Référentiels | Garde Sebou | station / barrage | référence présente mais non hiérarchisée | 3 entités principales repérées | `garde du sebou`, `brg de garde / sebou`, `amont barrage de garde` | A12, A15 | `infra.barrages`, `infra.stations_mesure` | définir la référence principale | Critique |

## Top 10 entités critiques

1. `H_G`
2. `sat`
3. prélèvements pollution non rattachés
4. référentiel officiel des rejets
5. fragmentation source / inventaire pollution
6. température absente
7. débits négatifs
8. `Garde Sebou`
9. `Bouhouda`
10. stations génériques `puits à captage cuvelé` / `forage`

## Entités nécessitant arbitrage ABH

- `H_G`
- `sat`
- `PTD`
- `PTP`
- référentiel des rejets
- cas `Garde Sebou`
- cas `Bouhouda`
- paramètres non mappés du Sebou

## Entités nécessitant traitement technique après validation

- paramètres non mappés validés par l'ABH
- prélèvements pollution à rattacher après arbitrage
- homonymes stations à distinguer visuellement
- températures à injecter après confirmation de la source

## Entités à exclure temporairement des synthèses

- paramètres au sens non validé comme `H_G`
- valeurs négatives non requalifiées
- prélèvements pollution non rattachés
- lignes qualité sans valeur

## Entités à compléter par nouvelle donnée

- température
- séries d'évaporation incomplètes
- noms de stations absents
- nom et identité du barrage sans nom
