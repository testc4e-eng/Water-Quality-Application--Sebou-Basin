# Données problématiques — Bloc Référentiels

## 1. Résumé du bloc

Le bloc référentiels confirme que les données de référence existent, mais qu'elles ne sont pas encore totalement stabilisées pour un usage métier simple.

Constats confirmés :

- `13` noms de stations dupliqués ;
- `7` stations sans nom exploitable ;
- `1` nom de barrage dupliqué (`Bouhouda`) ;
- `1` barrage sans nom ;
- `22` barrages sans `ire` ;
- `Garde Sebou` est bien présent en base, à la fois dans les stations et dans les barrages, ce qui réduit l'incertitude documentaire mais ne supprime pas le besoin de référence officielle.

## 2. Méthode d'extraction

Documents utilisés :

- `A04_doublons_stations_barrages.md`
- `A12_incoherence_sources_donnees.md`
- `A15_structuration_donnees_non_unifiee.md`
- `docs/34_synthese_strategique_anomalies/04_bloc_referentiels.md`

Tables inspectées :

- `infra.stations_mesure`
- `infra.barrages`
- `metadata.mapping_station_unresolved_*`
- `metadata.mapping_barrage_unresolved_*`
- `staging.*`

Requêtes utilisées :

- détection des homonymes ;
- détection des noms absents ;
- détection des codes absents ;
- recherche ciblée `Garde Sebou` et `Bouhouda`.

Limites :

- le diagnostic de "nom générique" reste ici une lecture métier, pas une règle technique stricte ;
- l'absence de code sur certaines entités est surtout critique quand elle gêne la distinction entre homonymes.

## 3. Tableau global référentiels

| Entité observée | Type entité | Code observé | Nom observé | Problème | Volume BD | Table | Anomalie source | Décision attendue | Priorité |
|---|---|---|---|---|---:|---|---|---|---|
| `puits à captage cuvelé` | station ; nom générique | plusieurs codes station | puits à captage cuvelé | nom trop générique pour distinguer les objets | 17 | `infra.stations_mesure` | A04, A15 | ajouter une distinction métier visible | Critique |
| `forage` | station ; nom générique | plusieurs codes station | forage | nom trop générique | 12 | `infra.stations_mesure` | A04, A15 | ajouter une distinction métier visible | Critique |
| `piézomètre` | station ; homonyme | plusieurs codes station | piézomètre | même nom pour plusieurs objets | 4 | `infra.stations_mesure` | A04 | distinguer les objets | Élevée |
| `piezomètre` | station ; homonyme | plusieurs codes station | piezomètre | variante sans accent ; même problème | 4 | `infra.stations_mesure` | A04, A12 | harmoniser et distinguer | Élevée |
| `ain skhounate` | station ; homonyme | plusieurs codes station | ain skhounate | plusieurs occurrences | 3 | `infra.stations_mesure` | A04 | valider la différenciation officielle | Élevée |
| stations sans nom | station ; nom absent | code présent | `[nom absent]` | impossible à lire métierement | 7 | `infra.stations_mesure` | A04, A15 | compléter les noms | Critique |
| `Bouhouda` | barrage ; homonyme | `1699/9` | bouhouda | deux occurrences du même barrage apparent | 2 | `infra.barrages` | A04, A12 | confirmer s'il s'agit d'un doublon ou d'un cas distinct | Critique |
| barrage sans nom | barrage ; nom absent | `[ire absent]` | `[nom absent]` | entité inutilisable en lecture métier | 1 | `infra.barrages` | A04 | compléter ou écarter | Critique |
| barrages sans `ire` | barrage ; code absent | `[ire absent]` | plusieurs noms | codification incomplète | 22 | `infra.barrages` | A15 | préciser si l'`ire` est obligatoire | Élevée |
| `garde du sebou` | barrage | `3323/8` | garde du sebou | référence présente mais à figer officiellement | 1 | `infra.barrages` | A12, A15 | confirmer la référence officielle | Critique |
| `brg de garde / sebou` | station | `3323/8` | brg de garde / sebou | présence en station, à aligner avec barrage | 1 | `infra.stations_mesure` | A12 | décider de la référence principale | Critique |
| `amont barrage de garde` | station | `3738/8` | amont barrage de garde | station liée au même sujet métier | 1 | `infra.stations_mesure` | A12 | clarifier le rôle exact de la station | Élevée |

## 4. Doublons et homonymes

| Nom | Type | Nombre occurrences | Codes associés | Décision |
|---|---|---:|---|---|
| puits à captage cuvelé | station | 17 | plusieurs `code_station` | distinguer officiellement |
| forage | station | 12 | plusieurs `code_station` | distinguer officiellement |
| piézomètre | station | 4 | plusieurs `code_station` | distinguer officiellement |
| piezomètre | station | 4 | plusieurs `code_station` | harmoniser et distinguer |
| ain skhounate | station | 3 | plusieurs `code_station` | valider la différenciation |
| puit sodea | station | 3 | plusieurs `code_station` | valider la différenciation |
| bouhouda | barrage | 2 | `1699/9`, `1699/9` | confirmer doublon ou cas particulier |

## 5. Entités sans nom ou code

| Table | ID | Code | Nom | Problème | Décision |
|---|---|---|---|---|---|
| `infra.stations_mesure` | `346e234c-23f0-478b-b592-14898492ce2e` | `2003/3` | `[nom absent]` | station non lisible | compléter le nom |
| `infra.stations_mesure` | `396ee989-2fdf-49c9-8b0f-5cc4857be975` | `1253/15` | `[nom absent]` | station non lisible | compléter le nom |
| `infra.stations_mesure` | `3c2ce9ef-ef17-4f50-b38f-d75af8fa261f` | `R1095/15` | `[nom absent]` | station non lisible | compléter le nom |
| `infra.stations_mesure` | `735c58dc-1119-4095-b0c2-f54b8d5a735e` | `R3265/14` | `[nom absent]` | station non lisible | compléter le nom |
| `infra.stations_mesure` | `a5ae4751-ca13-4235-bd87-fbe4f92147ad` | `3106/8` | `[nom absent]` | station non lisible | compléter le nom |
| `infra.stations_mesure` | `d8edea2e-2f15-4963-90ea-1cc79e8b7009` | `237/8` | `[nom absent]` | station non lisible | compléter le nom |
| `infra.stations_mesure` | `e4b55a91-d864-4db7-9adc-998e32fd6151` | `1817/18` | `[nom absent]` | station non lisible | compléter le nom |
| `infra.barrages` | `34` | `[ire absent]` | `[nom absent]` | barrage non exploitable | compléter ou écarter |

## 6. Entités recherchées mais absentes

### Garde Sebou

- recherché dans : `infra.stations_mesure`, `infra.barrages`
- résultat : trouvé dans les deux référentiels
- statut : présent mais non totalement stabilisé comme référence unique
- décision attendue : confirmer quelle entité fait foi dans les restitutions métier

## 7. Noms génériques ou vagues

| Nom observé | Nombre occurrences | Pourquoi problématique | Action |
|---|---:|---|---|
| puits à captage cuvelé | 17 | trop générique | ajouter une distinction métier |
| forage | 12 | trop générique | ajouter une distinction métier |
| piézomètre / piezomètre | 8 au total | générique et orthographe multiple | harmoniser puis distinguer |
| puits à captage non cuvelé | 2 | nom trop générique | distinguer |
| puit souk tnin bouhlou | 2 | répétition nominale | valider si doublon ou deux objets |

## 8. Sources divergentes

| Sujet | Source 1 | Source 2 | Écart | Décision |
|---|---|---|---|---|
| Garde Sebou | `infra.barrages` | `infra.stations_mesure` | présent dans les deux référentiels | définir la référence principale |
| Bouhouda | `infra.barrages` | documentation anomalies | deux occurrences en base, cas critique signalé en doc | arbitrer le statut exact |
| paramètres Sebou | `qualite.mesure_qualite_sebou` | `metadata.mapping_parametre_unresolved_suivi_qualite_sebou` | plusieurs paramètres encore non résolus | figer la source métier de référence |
| legacy qualité rivière | `metadata.mapping_parametre_unresolved_legacy_qualite_riviere` | tables qualité consolidées | plusieurs paramètres encore en écart source / métier | décider du traitement des écarts |

## 9. Questions métier

- Quel référentiel doit faire foi pour les stations homonymes ?
- Faut-il renommer certains noms génériques dans les restitutions métier ?
- Quel objet doit faire référence pour `Garde Sebou` : barrage, station, ou couple barrage + stations associées ?
- Le barrage sans nom doit-il être complété ou exclu du périmètre métier ?

## 10. Points à vérifier manuellement

- confirmer le statut réel des 2 occurrences `Bouhouda`
- vérifier si certains homonymes correspondent à des objets distincts mais mal nommés
- préciser si l'absence d'`ire` sur `22` barrages est acceptable ou doit être corrigée après validation
- confirmer la hiérarchie de référence entre barrage et station pour `Garde Sebou`
