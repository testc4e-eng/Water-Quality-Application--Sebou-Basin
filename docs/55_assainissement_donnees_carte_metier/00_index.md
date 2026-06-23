# Assainissement des données Carte Métier

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | conception + preuve technique |
| Périmètre | Dashboard Carte Métier Analytique |
| Dernière mise à jour | 2026-06-15 |

## Objectif

Mettre en propre la classification des données utilisées par la Carte Métier Analytique avant de poursuivre le Sprint 3.

Deux séparations sont désormais strictes :

```text
1. Séries temporelles réelles    ≠    Données ponctuelles / campagnes / quelques mesures isolées
2. Stations de mesure Qualité ABH    ≠    Points de prélèvement Pollution IDP
```

## Documents

1. [01_separation_timeseries_vs_ponctuel.md](./01_separation_timeseries_vs_ponctuel.md)
2. [02_separation_qualite_abh_vs_pollution_idp.md](./02_separation_qualite_abh_vs_pollution_idp.md)
3. [03_regles_classification_data_temporality.md](./03_regles_classification_data_temporality.md)
4. [04_impacts_backend_views_api.md](./04_impacts_backend_views_api.md)
5. [05_impacts_frontend_workspace.md](./05_impacts_frontend_workspace.md)
6. [06_tests_validation.md](./06_tests_validation.md)
7. [07_limites_et_arbitrages.md](./07_limites_et_arbitrages.md)
8. [08_validation_metier.md](./08_validation_metier.md)
9. [09_cloture_sprint_2_checklist_e2e.md](./09_cloture_sprint_2_checklist_e2e.md)

## Décision

```text
DATA_CLEANUP_CARTE_METIER = OK
QUALITE_ABH ≠ POLLUTION_IDP
TIME_SERIES ≠ POINT_MEASURE
VALIDATION_METIER = OK
GO_SPRINT_3 = OUI
```
