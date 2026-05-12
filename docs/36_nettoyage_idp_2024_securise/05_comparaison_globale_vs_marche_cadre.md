# Comparaison globale vs marché cadre

## 1. Qualité globale vs qualité marché cadre

| Comparaison | Colonnes communes | Colonnes différentes | Recouvrement dates | Recouvrement points | Recouvrement paramètres | Risque doublon |
|---|---|---|---|---|---|---|
| `mesures_idp_2024_qualite_globale` vs `mesures_idp_2024_qualite_marche_cadre` | 16 | 0 | 26 dates communes | 5 points communs | 20 paramètres communs | élevé |

Constats :

- structure strictement identique ;
- périodes partiellement recouvrantes ;
- `40` lignes identiques sur la clé `point + date + paramètre + valeur` ;
- la fusion est techniquement possible, mais risquée sans colonne d’origine.

## 2. Source pollution globale vs source pollution marché cadre

| Comparaison | Colonnes communes | Colonnes différentes | Recouvrement dates | Recouvrement points | Recouvrement paramètres | Risque doublon |
|---|---|---|---|---|---|---|
| `mesures_idp_2024_src_pollution_globale` vs `mesures_idp_2024_src_pollution_marche_cadre` | 43 | 0 en nom ; 1 différence de type | 26 dates communes | 5 points communs | 1 valeur commune de `parametre` | moyen à élevé |

Constats :

- mêmes colonnes en nom ;
- une différence de type sur `eau_ss_terr_niv_statique_m_sol` :
  - `double precision` dans `globale`
  - `text` dans `marche_cadre`
- `5` lignes de recouvrement confirmées sur `point + date + commune + nature`
- `parametre` est très peu exploitable :
  - `8` valeurs distinctes dans `globale`
  - `0` valeur utile dans `marche_cadre`

## 3. Lecture métier

La fragmentation n’est pas seulement documentaire. Elle est confirmée par la base :

- même structure sur les paires de tables ;
- périodes qui se recouvrent ;
- points qui se recouvrent ;
- risques de doublons si un `UNION ALL` est appliqué sans contrôle.

## 4. Recommandation

- qualité globale + marché cadre :
  - **fusion possible avec colonne `origine_table`**
  - **quarantaine préalable** des `40` lignes de recouvrement
- source pollution globale + marché cadre :
  - **fusion possible avec colonne `origine_table`**
  - **quarantaine préalable** des `5` lignes de recouvrement
  - **harmonisation préalable** du type de `eau_ss_terr_niv_statique_m_sol`

## 5. Verdict

- fusion brute sans contrôle : **non**
- fusion après traçabilité et quarantaine : **oui**
- séparation à conserver pour lecture métier finale : **pas nécessairement**, sauf besoin administratif explicite
