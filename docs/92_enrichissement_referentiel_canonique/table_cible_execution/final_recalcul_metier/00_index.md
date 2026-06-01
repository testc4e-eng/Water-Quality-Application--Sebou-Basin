# Recalcul final metier `table_cible`

## Objet

Recalcul documentaire des valeurs `table_cible` du referentiel canonique selon la classification metier validee.

## Principe

La proposition globale precedente est abandonnee :

- ancien modele : beaucoup de parametres qualite vers `api.v_qualite_dashboard` ;
- nouveau modele : `parametre -> domaine -> sous-domaine -> type mesure -> support -> vue metier specialisee -> API frontend`.

## Fichiers

| Fichier | Role |
|---|---|
| `01_matrice_finale_table_cible.md` | Matrice finale des 65 parametres du backlog |
| `02_changements_vs_ancienne_proposition.md` | Comparaison ancienne affectation / nouvelle affectation |
| `03_sql_update_table_cible_FINAL_VALIDATION_REQUISE.sql` | SQL propose non execute, avec `ROLLBACK` actif |
| `04_sql_validation_post_update_table_cible.sql` | Requetes de validation post-update proposees |
| `05_rapport_decision_final_table_cible.md` | Synthese decisionnelle par classe |
| `06_impact_frontend_api.md` | Impacts frontend / API par ecran |
| `07_backlog_client_et_hors_restitution.md` | Backlog client et exclusions restitution |

## Statut

| Element | Statut |
|---|---|
| Recalcul documentaire | `PRET` |
| SQL update | `PROPOSE_NON_EXECUTE` |
| Modifications base | `AUCUNE` |
| Creation vues/API | `AUCUNE` |
| Decision execution | `HOLD_VALIDATION_TECHNIQUE` |
