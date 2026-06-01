# Priorités d'exécution

## P0 - Blocages critiques
1. Hydraulique : fournir MNT/DEM validé et lancer QA direction.
2. Qualité API : implémenter `TYPE_EAU_NON_OPERATIONNEL` et warning `water_type` deprecated.
3. Documentation maître : corriger statuts température/réglementaire obsolètes.

## P1 - Industrialisation immédiate
1. Brancher `meteo.mesure_temperature` dans APIs/dashboards climat.
2. Valider `/dashboard-carto-metier` en navigateur avec backend réel.
3. Ajouter statuts réglementaires explicites dans UI : `NON_CLASSIFIABLE`, `HORS_PERIMETRE_REGLEMENTAIRE`, `TYPE_EAU_NON_OPERATIONNEL`.
4. Filtrer les vues opérationnelles sur batch `COMMITTED`.

## P2 - Améliorations architecture
1. Vues analytics température par station/sous-bassin.
2. Cache API pour seuils réglementaires et latest-values.
3. Lazy-loading frontend pour réduire le bundle dashboard.
4. Formaliser table/vue de statut des datasets et batchs.

## P3 - ML / IA / prédiction
1. Feature store météo/qualité/pollution versionné.
2. Labels réglementaires reproductibles par `version_reglementaire`.
3. Séries LSTM température/qualité.
4. GNN uniquement après validation hydraulique MNT.
