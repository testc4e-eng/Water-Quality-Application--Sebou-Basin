# Phase 2 - Referentiel canonique final

## Contexte

Objectif : converger vers un dictionnaire unique, stable et exploitable par la base, l'API, les dashboards et l'IA.

## Contraintes

- 0 parametre ambigu actif dans les tables finales
- 1 code canonique = 1 definition metier + 1 unite de reference
- toute variante source doit etre traçable en alias
- tout parametre actif doit etre rattache a un type GEO compatible

## Constats verifies

- `metadata.referentiel_parametre` contient `91` lignes actives
- `metadata.referentiel_parametre_canonique` a ete cree et charge le `2026-05-07` avec `92` lignes
- collision historique detectee sur `DEBIT` dans `metadata.referentiel_parametre`, resolue dans le canonique
- domaine hydro actuel :
  - `DEBIT`
  - `LACHER`
  - `NIVEAU_EAU`
  - `VOLUME_BARRAGE`
- gaps hydro pour la cloture :
  - alias `VOLUME -> VOLUME_BARRAGE`
  - unites barrage a verrouiller par type metier
- nombreuses mesures qualite finales sans `parametre_ref_id`

## Livrables

- `01_inventaire_global_parametres.csv`
- `02_mapping_canonique.csv`
- `03_synonymes_et_alias.csv`
- `04_parametres_ambigus.csv`
- `05_parametres_sans_geo.csv`
- `06_parametres_sans_unite.csv`
- `07_sql_create_referentiel.sql`
- `08_sql_insert_referentiel.sql`
- `09_regles_metier.md`
- `10_decision_finale.md`
