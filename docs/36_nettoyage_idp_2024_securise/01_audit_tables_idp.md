# Audit des tables IDP 2024

## Table : public.mesures_idp_2024_qualite_globale

- existe : Oui
- nombre de lignes : `4 894`
- nombre de colonnes : `16`
- colonnes :
  - `id_pts`
  - `id_table`
  - `date_jr_prelevement`
  - `heure_prelevement`
  - `pts_prelevement`
  - `n_enregestrement`
  - `n_ordre`
  - `n_indice`
  - `ire`
  - `commune`
  - `code_commune`
  - `coord_x`
  - `coord_y`
  - `parametre_qualite`
  - `val_qual`
  - `observation`
- colonnes candidates pour identifiant :
  - `id_pts`
  - `id_table`
  - `n_enregestrement`
  - `n_ordre`
  - `n_indice`
- colonnes candidates pour date :
  - `date_jr_prelevement`
  - `heure_prelevement`
- colonnes candidates pour paramètre :
  - `parametre_qualite`
- colonnes candidates pour valeur :
  - `val_qual`
- colonnes candidates pour source / rejet / point :
  - `pts_prelevement`
  - `ire`
- colonnes candidates pour commune / province :
  - `commune`
  - `code_commune`
- période couverte : `2024-09-12` à `2025-12-14`
- paramètres distincts : `57`
- points distincts : `212`
- observations :
  - table qualité en format long
  - valeurs stockées en `text`
  - bon candidat pour audit de paramètres, valeurs et recouvrements

## Table : public.mesures_idp_2024_qualite_marche_cadre

- existe : Oui
- nombre de lignes : `3 614`
- nombre de colonnes : `16`
- colonnes : identiques à `qualite_globale`
- colonnes candidates pour identifiant :
  - `id_pts`
  - `id_table`
  - `n_enregestrement`
  - `n_ordre`
  - `n_indice`
- colonnes candidates pour date :
  - `date_jr_prelevement`
  - `heure_prelevement`
- colonnes candidates pour paramètre :
  - `parametre_qualite`
- colonnes candidates pour valeur :
  - `val_qual`
- colonnes candidates pour source / rejet / point :
  - `pts_prelevement`
  - `ire`
- colonnes candidates pour commune / province :
  - `commune`
  - `code_commune`
- période couverte : `2025-10-06` à `2025-12-01`
- paramètres distincts : `65`
- points distincts : `127`
- observations :
  - structure identique à `qualite_globale`
  - présence de `11` valeurs vides dans `val_qual`
  - forte diversité de libellés analytiques

## Table : public.mesures_idp_2024_src_pollution_globale

- existe : Oui
- nombre de lignes : `243`
- nombre de colonnes : `43`
- colonnes :
  - identifiants et contexte : `id_pts`, `id_table`, `date_jr_prelevement`, `heure_prelevement`, `pts_prelevement`, `ire`
  - localisation : `commune`, `code_commune`, `coord_x`, `coord_y`
  - mesures in situ : `t_air`, `t_eau`, `ph`, `eh_mv`, `cond_20_c`, `turbidite`, `disqu_secchi`, `o2_dissous`, `sat_prc`
  - contexte de prélèvement : `echantillon_preleve_par`, `nature_pts_prelevement`, `conditions_meteologiques`, `but_analyses`, `acces`, `observations`
  - informations eau souterraine / eau de surface
  - colonnes terminales : `nature`, `parametre`
- colonnes candidates pour identifiant :
  - `id_pts`
  - `id_table`
- colonnes candidates pour date :
  - `date_jr_prelevement`
  - `heure_prelevement`
- colonnes candidates pour paramètre :
  - `parametre`
- colonnes candidates pour valeur :
  - mesures in situ multiples ; pas une seule colonne valeur
- colonnes candidates pour source / rejet / point :
  - `pts_prelevement`
  - `nature`
  - `nature_pts_prelevement`
- colonnes candidates pour commune / province :
  - `commune`
  - `code_commune`
- période couverte : `2024-09-12` à `2025-12-15`
- paramètres distincts : `8`
- points distincts : `243`
- observations :
  - table large de contexte pollution
  - `111` lignes sans valeur dans `parametre`
  - aucun doublon exact confirmé

## Table : public.mesures_idp_2024_src_pollution_marche_cadre

- existe : Oui
- nombre de lignes : `148`
- nombre de colonnes : `43`
- colonnes : identiques à `src_pollution_globale`
- colonnes candidates pour identifiant :
  - `id_pts`
  - `id_table`
- colonnes candidates pour date :
  - `date_jr_prelevement`
  - `heure_prelevement`
- colonnes candidates pour paramètre :
  - `parametre`
- colonnes candidates pour valeur :
  - mesures in situ multiples ; pas une seule colonne valeur
- colonnes candidates pour source / rejet / point :
  - `pts_prelevement`
  - `nature`
  - `nature_pts_prelevement`
- colonnes candidates pour commune / province :
  - `commune`
  - `code_commune`
- période couverte : `2025-10-06` à `2025-12-01`
- paramètres distincts : `0` hors valeur vide
- points distincts : `148`
- observations :
  - toutes les lignes ont `parametre` vide
  - même structure que `src_pollution_globale`
  - une colonne a un type différent sur `eau_ss_terr_niv_statique_m_sol`

## Tableau de synthèse

| Table | Lignes | Colonnes | Période min | Période max | Paramètres distincts | Points distincts |
|---|---:|---:|---|---|---:|---:|
| `public.mesures_idp_2024_qualite_globale` | 4 894 | 16 | 2024-09-12 | 2025-12-14 | 57 | 212 |
| `public.mesures_idp_2024_qualite_marche_cadre` | 3 614 | 16 | 2025-10-06 | 2025-12-01 | 65 | 127 |
| `public.mesures_idp_2024_src_pollution_globale` | 243 | 43 | 2024-09-12 | 2025-12-15 | 8 | 243 |
| `public.mesures_idp_2024_src_pollution_marche_cadre` | 148 | 43 | 2025-10-06 | 2025-12-01 | 0 | 148 |
