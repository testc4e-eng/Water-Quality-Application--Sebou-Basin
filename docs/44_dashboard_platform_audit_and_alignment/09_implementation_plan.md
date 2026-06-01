# Plan d’implémentation

## Phase P0.0 — Sécurisation préprod
1. Corriger ou désactiver `/dashboard-climate`.
2. Ajouter bandeau global “DEV / données en validation” sur dashboards P0.
3. Ajouter affichage `version_reglementaire` et `type_eau`.
4. Ajouter badges statuts réglementaires.
5. Ajouter avertissement hydraulique non validée dans `/dashboard-pollution`.

## Phase P0.1 — Dashboard Cartographique Métier
1. Garder `/dashboard-carto-metier` comme écran principal métier.
2. Renforcer popup :
   - classe réglementaire ;
   - statut non classifiable ;
   - version réglementaire ;
   - source backend ;
   - statut data.
3. Tester supports :
   - `stations.barrage`
   - `inventaire_source_pollution.point_mesures`
   - `inventaire_mesures_pollution.point_prelevement`

## Phase P0.2 — Dashboard Qualité Réglementaire
1. Créer route dédiée.
2. Consommer `/api/v1/quality/regulatory-status`.
3. Consommer `/api/v1/quality/thresholds`.
4. Réutiliser `/api/v1/qualite/*` pour les données métier.
5. Afficher paramètres classifiables/non classifiables.

## Phase P0.3 — Dashboard Température
1. Exposer une API claire si nécessaire depuis `meteo.mesure_temperature`.
2. Afficher T_Min, T_Max, T_Moy.
3. Filtres station/période.
4. Afficher batch `2d67f599-7714-4712-ba1f-5f3584c4c961`.
5. Préparer export ML.

## Phase P0.4 — Dashboard Hydraulique QA
1. Créer table QA ou endpoint depuis package QGIS.
2. Afficher 508 confirmés, 139 suspects, 81 plats.
3. Afficher MNT et réseau.
4. Interdire tout wording “validé scientifiquement” avant arbitrage.

## Phase P1 — Rationalisation
1. Fusionner Observatoire V2 et DecisionDashboardTest.
2. Retirer les routes legacy de la navigation principale.
3. Centraliser la symbologie qualité/hydraulique.
4. Mettre à jour `api_for_agents.md`, `architecture_for_agents.md`, `DATABASE_SCHEMA_SUMMARY.md` après implémentation.

## Phase P2/P3 — Analytics et IA
1. Feature store météo/qualité.
2. Readiness ML.
3. Propagation pollution seulement après hydraulique validée.
4. GNN/LSTM après traçabilité complète.
