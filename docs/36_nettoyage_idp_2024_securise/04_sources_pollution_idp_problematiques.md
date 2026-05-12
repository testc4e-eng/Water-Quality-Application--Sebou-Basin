# Sources pollution IDP problématiques

## Sources, rejets et points à risque

| Source / rejet | Table | Code | Nom | Problème | Volume | Décision attendue |
|---|---|---|---|---|---:|---|
| points IDP source non retrouvés dans `abh_sad` | `src_pollution_globale` + `src_pollution_marche_cadre` | à confirmer | ensemble des points source non intégrés | `SOURCE_UNMAPPED` | 240 points distincts | décider quarantaine ou complément de rattachement |
| points déjà présents dans `qualite.source_pollution_prelevement` | mêmes tables | à confirmer | points communs avec `abh_sad` | recouvrement partiel avec données déjà intégrées | 141 points distincts | vérifier si la réintégration créerait des doublons |
| recouvrements source globale / marché cadre | `src_pollution_globale` vs `src_pollution_marche_cadre` | à confirmer | mêmes points mêmes dates mêmes natures | `GLOBAL_MARCHE_OVERLAP` | 5 lignes | quarantaine avant toute fusion |
| `AVAL ...` / `AMONT ...` | toutes tables IDP | à confirmer | ex. `AVAL REJET TIFELT`, `AMONT STEP TAOUNATE` | point aval / amont non assimilable directement à une source | 55 lignes source pollution, 1 751 lignes qualité | valider si point de contrôle ou source métier |
| `Rejet Industriel (SMK)` | qualité globale | à confirmer | Rejet Industriel (SMK) | nom libre à stabiliser | 43 lignes qualité | confirmer le référentiel cible |
| `MERJA FOUARATE` / `AVAL REJET INDUSTRIEL MERJA` | qualité globale | à confirmer | points proches en zone Kénitra | risque de confusion entre source et point aval | 84 lignes qualité | distinguer source vs point de contrôle |
| `REJET ABATTOIR ...` | qualité globale / source pollution | à confirmer | plusieurs abattoirs | rapprochement probable avec `infra.rejet_abattoir_inventaire_pollution` | plusieurs cas | valider les rattachements |
| `STEP ...` | qualité marché cadre / source pollution | à confirmer | plusieurs STEP | rapprochement probable avec `infra.step_inventaire_pollution` | plusieurs cas | valider les rattachements |

## Sources non rattachées

| Source / rejet | Table | Code | Nom | Problème | Volume | Décision attendue |
|---|---|---|---|---|---:|---|
| ensemble de points source non présents dans `abh_sad` | `src_pollution_globale` + `src_pollution_marche_cadre` | à confirmer | 240 points distincts | non retrouvés parmi les points déjà intégrés dans `qualite.source_pollution_prelevement` | 240 | garder en quarantaine et analyser les correspondances |
| points déjà intégrés mais non liés dans `abh_sad` | `qualite.source_pollution_prelevement` côté cible | à confirmer | 26 prélèvements non liés | rattachement métier incomplet confirmé | 26 | conserver en attente de validation |

## Codes vagues

| Nom observé | Pourquoi vague | Action |
|---|---|---|
| `AAZ_DOM1_R1` et variantes | code opérationnel non lisible seul | compléter par le nom métier |
| `PDOM`, `PDS`, `DOM` | codification interne source | documenter la signification avant fusion |
| `REJET R1`, `REJET R10`, etc. | numérotation non explicite | relier au référentiel officiel |

## Noms génériques

| Nom observé | Pourquoi générique | Action |
|---|---|---|
| `AMONT ...` | point de contrôle, pas nécessairement source | ne pas rattacher automatiquement |
| `AVAL ...` | point aval, pas nécessairement source | ne pas rattacher automatiquement |
| `SOURCE ABATTOIR` | description incomplète | compléter avant intégration métier |
| `PUITS ...` / `FORAGE ...` dans contexte source pollution | nom générique sans source explicite | clarifier le statut métier |

## Sources probablement existantes sous autre nom

| Source observée | Référentiel cible possible | Confiance | Décision |
|---|---|---|---|
| `REJET ABATTOIR ...` | `infra.rejet_abattoir_inventaire_pollution` | élevée | valider le rattachement |
| `STEP ...` | `infra.step_inventaire_pollution` | élevée | valider le rattachement |
| `Rejet Industriel (SMK)` | `infra.rejet_industriel` ou inventaire pollution | moyenne | confirmer le nom officiel |
| codes `*_DOM_*` | `infra.rejet_inventaire_pollution` | moyenne | confirmer la règle |

## Recommandation de traitement

- quarantaine obligatoire pour :
  - les `240` points source absents des points déjà intégrés dans `abh_sad`
  - les `5` recouvrements source globale / marché cadre
  - les points `amont` / `aval` non qualifiés
- pas de suppression automatique :
  - les cas ambigus restent potentiellement utiles
  - les rattachements doivent être validés métierement
