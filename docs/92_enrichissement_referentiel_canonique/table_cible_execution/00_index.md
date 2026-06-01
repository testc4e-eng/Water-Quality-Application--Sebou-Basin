# Execution table_cible - index

## Statut

`TABLE_CIBLE_ARCHITECTURE_PREPAREE`

## Principe

- aucune table physique nouvelle a creer ;
- les `table_cible` manquantes doivent pointer vers des vues d'exposition logiques ;
- aucune mise a jour referentiel n'est executee dans cette phase ;
- `FM`, `F_M_MES` restent `CLIENT_REQUIRED` ;
- `MD` reste suivi comme cas client hors lot des `65`.

## Fichiers

| Fichier | Role |
|---|---|
| `01_audit_final_65_table_cible.md` | audit parametre par parametre |
| `02_mapping_parametres_vers_vues.md` | regroupement par vue logique |
| `03_sql_vues_exposition_VALIDATION_REQUISE.sql` | propositions de vues SQL non executees |
| `04_sql_update_table_cible_VALIDATION_REQUISE.sql` | proposition d'update referentiel non executee |
| `05_api_frontend_spec.md` | endpoints candidats FastAPI/frontend |
| `06_sql_validation_table_cible.sql` | controles post-update proposes |
| `07_rapport_decision_table_cible.md` | synthese decisionnelle |

## Synthese

| Classe | Volume |
|---|---:|
| Affectables a une vue qualite | 57 |
| Affectables a une vue meteo | 5 |
| Affectables a une vue hydro | 1 |
| Client required | 2 |
| Total audite | 65 |
