# GO / NOGO dashboard qualité réglementaire P0

## Décision

`GO_DEV_DEMO_DASHBOARD_QUALITY_REGULATORY_P0`

`NOGO_PREPROD_FINAL` tant que les conditions transversales PREPROD ne sont pas clôturées.

## Fonctionnel

- Route et menu principal disponibles.
- Référentiel actif, `type_eau`, seuils actifs et exclus visibles.
- KPI stations et mesures alimentés par API réelle.
- Sélection station, période et paramètre.
- Historique et classification de la dernière valeur.
- Paramètres observationnels séparés et marqués `NON_CLASSIFIABLE`.
- Codes sensibles et alias explicites visibles.

## Limites P0

- KPI alertes agrégé non branché : affiché `N/D`.
- Sous-bassin et support station non exposés par l’API qualité actuelle.
- Comparaisons multi-stations et historique des classes différés en P1.
- Encodage historique de certains libellés source à corriger dans un chantier data dédié.

## Prochaines actions

1. Ajouter endpoint résumé alertes réglementaires lecture seule.
2. Enrichir `/quality/stations` avec sous-bassin et support.
3. Ajouter comparaison multi-stations et évolution des classes.
4. Réduire le bundle frontend par chargement différé des dashboards lourds.
