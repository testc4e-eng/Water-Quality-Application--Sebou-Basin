# Données problématiques — Bloc Pollution

## 1. Résumé du bloc

Le bloc pollution montre que les données existent et sont déjà partiellement structurées, mais qu'une partie des points de prélèvement et des rejets ne repose pas encore sur un cadre métier totalement fermé.

Les constats les plus importants sont :

- `141` prélèvements pollution enregistrés ;
- `116` rattachements déjà présents ;
- `26` prélèvements encore non rattachés à une source référencée ;
- aucun nom de table contenant explicitement `idp`, alors que la fragmentation documentaire du sujet IDP est bien signalée ;
- présence de plusieurs ensembles pollution en `infra`, `qualite` et `staging`.

## 2. Méthode d'extraction

Documents utilisés :

- `A05_absence_referentiel_rejets.md`
- `A06_fragmentation_donnees_IDP.md`
- `A07_sources_pollution_non_rattachees.md`
- `docs/34_synthese_strategique_anomalies/02_bloc_pollution.md`
- `docs/34_synthese_strategique_anomalies/05_plan_decision_metier.md`

Tables inspectées :

- `qualite.source_pollution_prelevement`
- `qualite.source_pollution_mesure_param`
- `qualite.source_pollution_prelevement_lien`
- `infra.rejet_domestique`
- `infra.rejet_industriel`
- `infra.rejet_abattoir`
- `infra.rejet_inventaire_pollution`
- `infra.decharge_inventaire_pollution`
- `infra.huilerie_inventaire_pollution`
- `infra.mine_inventaire_pollution`
- `infra.step_inventaire_pollution`
- `infra.rejet_abattoir_inventaire_pollution`
- `staging.rejets_brutes`
- `staging.rejet_abattoir`

Requêtes utilisées :

- comptage des tables de référence et des prélèvements ;
- détection des prélèvements sans lien ;
- lecture des types d'entités rattachées ;
- recherche des ensembles pollution / inventaire / rejet ;
- recherche de tables IDP via `information_schema`.

Limites :

- aucune table contenant `idp` dans son nom n'a été trouvée en base active ;
- le sujet IDP est donc confirmé surtout par la documentation et par les ensembles pollution intermédiaires ;
- plusieurs noms observés sont des codes opérationnels plutôt que des noms métier explicites.

## 3. Tableau global pollution

| Entité observée | Type entité | Problème | Code observé | Nom observé | Commune / zone | Volume BD | Table source | Table cible / référentiel | Anomalie source | Décision attendue | Priorité |
|---|---|---|---|---|---|---:|---|---|---|---|---|
| prélèvements pollution | point de prélèvement | référentiel non totalement fermé | `source_row_id` | `point_prelevement` | multi-communes | 141 | `qualite.source_pollution_prelevement` | `infra.rejet_*` et inventaires pollution | A05 | valider la liste officielle des rejets suivis | Critique |
| prélèvements liés | source pollution | rattachement partiel seulement | `entite_id` | selon le point | multi-communes | 116 | `qualite.source_pollution_prelevement_lien` | entités `rejet_inventaire`, `rejet_abattoir_inventaire`, `step`, `huilerie_inventaire` | A05, A07 | confirmer le périmètre des rattachements acceptés | Élevée |
| prélèvements non rattachés | source non rattachée | absence de lien référentiel | à confirmer | ex. `AVAL REJET INDUSTRIEL MERJA` | multi-communes | 26 | `qualite.source_pollution_prelevement` | aucun lien confirmé | A07 | décider mise en attente, validation manuelle ou exclusion | Critique |
| `REJET MERJA FOUARATE AIN SEBAA` | point de prélèvement | non rattaché | à confirmer | REJET MERJA FOUARATE AIN SEBAA | KENITRA | 1 | `qualite.source_pollution_prelevement` | à confirmer | A05, A07 | rattacher ou classer en attente | Élevée |
| `AVAL REJET INDUSTRIEL MERJA` | point de prélèvement | nom descriptif, source à confirmer | à confirmer | AVAL REJET INDUSTRIEL MERJA | KENITRA | 1 | `qualite.source_pollution_prelevement` | à confirmer | A07 | confirmer s'il s'agit d'un point aval ou d'une source officielle | Élevée |
| `REJET STEP TIFLET` | point de prélèvement | nom fonctionnel à rattacher | à confirmer | REJET STEP TIFLET | AIT BOUYAHYA LAHJAMA | 1 | `qualite.source_pollution_prelevement` | `step` possible | A05, A07 | confirmer le rattachement | Élevée |
| `Rejet Industriel (SMK)` | source pollution | nom d'usage non stabilisé | à confirmer | Rejet Industriel (SMK) | SIDI SLIMANE MOUL KIFANE | 1 | `qualite.source_pollution_prelevement` | `rejet_industriel` possible | A05 | confirmer le nom officiel | Élevée |
| codes `*_DOM_*`, `*_PDOM_*`, `*_PDS_*` | code vague | lecture métier peu explicite | ex. `TAZ_PDOM_R9` | code seul | plusieurs communes | plusieurs cas | `qualite.source_pollution_prelevement` | à confirmer | A05, A07 | décider si ces codes restent visibles en réunion | Élevée |
| `infra.rejet_domestique` | rejet domestique | cadre partiel à harmoniser avec les prélèvements | `code_rejet` | nom non disponible | bassin large | 362 | `infra.rejet_domestique` | référentiel domestique | A05 | confirmer le rôle de cette table comme référence | Élevée |
| `infra.rejet_industriel` | rejet industriel | couverture limitée au regard des points terrain | `code_rejet` | `nom_rejet` | bassin large | 11 | `infra.rejet_industriel` | référentiel industriel | A05 | confirmer si ce référentiel est suffisant | Élevée |
| `infra.rejet_abattoir` | abattoir | couverture partielle | `code_abattoir` | nom absent | bassin large | 61 | `infra.rejet_abattoir` | référentiel abattoirs | A05 | confirmer le périmètre de référence | Élevée |
| `staging.rejets_brutes` | IDP fragmenté | source intermédiaire non clairement portée dans la couche métier | `Code_rejet` | à confirmer | source brute | 277 | `staging.rejets_brutes` | `infra.rejet_inventaire_pollution` | A06 | décider du rôle métier de cet ensemble | Élevée |
| `staging.rejet_abattoir` | IDP fragmenté | source intermédiaire | à confirmer | à confirmer | source brute | 56 | `staging.rejet_abattoir` | `infra.rejet_abattoir_inventaire_pollution` | A06 | décider si cet ensemble reste purement source | Moyenne |

## 4. Rejets non rattachés

| Nom rejet / point | Type supposé | Volume | Exemple date | Problème | Décision |
|---|---|---:|---|---|---|
| AVAL REJET INDUSTRIEL MERJA | rejet industriel / point aval | 1 | 2025-10-13 | point présent sans lien confirmé | confirmer le rattachement |
| REJET MERJA FOUARATE AIN SEBAA | rejet | 1 | 2025-10-13 | nom d'usage sans lien confirmé | rattacher ou laisser en attente |
| REJET STEP TIFLET | STEP | 1 | 2025-10-14 | probable STEP, mais pas de lien confirmé | confirmer le rattachement |
| Rejet Industriel (SMK) | rejet industriel | 1 | 2025-10-21 | nom libre | valider le nom officiel |
| TAZ_PDOM_R9 | code vague | 1 | 2025-10-29 | code peu lisible métierement | relier à un nom métier |
| REJET ABATTOIR MASMOUDA | abattoir | 1 | 2025-12-13 | devrait rejoindre le référentiel abattoir | confirmer le lien |
| REJET ABATTOIR MOULAY DRISS ZRHOUN | abattoir | 1 | 2025-12-13 | devrait rejoindre le référentiel abattoir | confirmer le lien |
| REJET BOULEMANE (EM) | rejet | 1 | 2025-11-20 | nom opérationnel | clarifier le référentiel cible |

## 5. Sources pollution avec nom vague

| Nom observé | Pourquoi vague | Action |
|---|---|---|
| `TAZ_PDOM_R9` | code opérationnel sans signification directe en réunion | relier à un nom métier lisible |
| `ACH_PDS_R5` | code compact non explicite | relier à la commune et au rejet officiel |
| `M_DOM_R1` | code trop court | clarifier le sens métier |
| `LOJ_DOM_R1` | code opérationnel | compléter par nom officiel |
| `REJET` comme nature | nature générique, pas une identité | distinguer type et nom officiel |
| `-` comme nature | nature absente | compléter ou classer comme incomplet |

## 6. Ensembles IDP fragmentés

| Table / ensemble | Volume | Période | Nature supposée | Risque doublon | Décision attendue |
|---|---:|---|---|---|---|
| `staging.rejets_brutes` | 277 | à confirmer | inventaire rejets source | oui | confirmer le rôle source vs métier |
| `infra.rejet_inventaire_pollution` | 277 | à confirmer | inventaire consolidé | oui si usage parallèle avec staging | définir la source de référence |
| `staging.rejet_abattoir` | 56 | à confirmer | source intermédiaire abattoir | oui | confirmer si source pure ou base métier |
| `infra.rejet_abattoir_inventaire_pollution` | 56 | à confirmer | inventaire abattoir consolidé | oui si usage parallèle | définir la référence |
| `infra.huilerie_inventaire_pollution` | 606 | à confirmer | inventaire huileries | à confirmer | définir l'usage métier |
| `infra.mine_inventaire_pollution` | 39 | à confirmer | inventaire mines | à confirmer | définir l'usage métier |
| `infra.step_inventaire_pollution` | 49 | à confirmer | inventaire STEP | à confirmer | définir l'usage métier |

## 7. Mapping pollution proposé à valider

| Source observée | Référentiel cible possible | Confiance | Décision |
|---|---|---|---|
| point de prélèvement avec `ABATTOIR` dans le nom | `infra.rejet_abattoir` / `infra.rejet_abattoir_inventaire_pollution` | élevée | valider |
| point de prélèvement avec `STEP` dans le nom | `infra.step_inventaire_pollution` | moyenne | valider |
| point de prélèvement avec code `*_DOM_*` | `infra.rejet_domestique` ou `infra.rejet_inventaire_pollution` | moyenne | confirmer la règle |
| point de prélèvement avec code `*_PDOM_*` | `infra.rejet_domestique` ou inventaire pollution | moyenne | confirmer la règle |
| point de prélèvement avec `Industriel` | `infra.rejet_industriel` ou inventaire pollution | moyenne | confirmer la règle |
| point de prélèvement `AVAL ...` | aucun rattachement direct sans validation | faible | ne pas l'intégrer sans arbitrage |

## 8. Questions métier

- Quelle table ou quel ensemble doit faire foi pour le référentiel officiel des rejets ?
- Les codes type `TAZ_PDOM_R9` doivent-ils être visibles tels quels dans les restitutions métier ?
- Les points aval doivent-ils être considérés comme des sources, des points de contrôle, ou rester hors référentiel source ?
- Les ensembles `staging.*` restent-ils purement sources ou doivent-ils encore être utilisés dans la lecture métier ?

## 9. Points à vérifier manuellement

- confirmer le statut métier des 26 prélèvements non rattachés
- valider le sens opérationnel des codes `DOM`, `PDOM`, `PDS`, `EM`
- vérifier si certains points non rattachés correspondent en réalité à des entités déjà présentes sous un autre nom
- confirmer si le sujet IDP doit être lu à travers les tables pollution existantes malgré l'absence de tables nommées `idp`
