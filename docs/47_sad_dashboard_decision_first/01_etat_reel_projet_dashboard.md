# État réel projet dashboard

## VALIDE

- `HYDRO_NETWORK_VALIDATED`
  - réseau métier validé, noding, gap fixing et clôture hydrologique terminés
  - référence validée : `geo_work.reseau_hydro_edges_final_candidate_20260602`
- `BACKEND_MVP_V1_READY`
  - endpoints disponibles :
    - `source-to-garde`
    - `snap-diagnostic`
    - `source-to-stations`
    - `source-to-barrages`
    - `source-to-exutoires`
- dashboard qualité réglementaire P0 existant et connecté
  - route : `/dashboard-qualite-reglementaire`
  - statut : `GO_DEV_DEMO_DASHBOARD_QUALITY_REGULATORY_P0`
- dashboard cartographique métier P0 existant
  - route : `/dashboard-carto-metier`
  - statut : `KEEP_UPDATE`
- routeur frontend actif confirmé
  - `frontend/src/App.tsx`
- catalogue métier data/affichage déjà structuré
  - priorisation décisionnelle, règles d’affichage, catalogue vues/tables

## EN_COURS

- transition des dashboards legacy vers des écrans métier plus lisibles
- consolidation du dashboard cartographique métier pour un usage décisionnel plus large
- stabilisation préproduction des lectures pollution IDP
- clarification des écrans analytiques mélangeant climat / hydro / pollution
- gouvernance de température
  - `AIR_TEMPERATURE`
    - source cible : `meteo.mesure_temperature`, `api.v_meteo_temperature`
    - contradiction documentaire existante : certains audits anciens annoncent des lignes, la source consolidée active rappelle un état incomplet / pipeline non stabilisé
    - conclusion opérationnelle : à traiter comme domaine météo distinct, non fusionné avec qualité eau
  - `WATER_TEMPERATURE`
    - source qualité terrain : `api.v_qualite_terrain`
    - paramètres : `T_EAU`, `T_AIR`, `DISQUE_SECCHI`
    - conclusion opérationnelle : `T_EAU` appartient au dashboard qualité / analyses eau, `T_AIR` à la météo ou au terrain qualité selon support, jamais confondre avec la météo stationnelle

## A_CONSTRUIRE

- accueil SAD DG unifié
- hiérarchie d’information unique DG / métier / expert / administration
- dashboard pollution refondu en mode décisionnel
  - onglet propagation branché sur le backend MVP V1 existant
- dashboard analyses croisé décisionnel
- dashboard expert unifié
- architecture de navigation unifiée SAD
- catalogue KPI DG/métier
  - `IQGB`
  - `IQS`
  - `IFD`
  - `ICD`
  - `ICH`
  - `IPP`
- centre d’alertes transverses
- recommandations actionnables et workflows de validation métier

## Dashboards existants à classer

### À conserver

- `/dashboard-carto-metier`
- `/dashboard-qualite-reglementaire`
- `/admin/data-scan`
- `/admin/ingestion`
- `/admin/popup-rules`
- `/admin/gestion-users`

### À conserver mais refondre

- `/dashboard-pollution`
- `/dashboard-analytique`
- `/decision-dashboard-test`
- `/qualite/metaux`

### À fusionner

- `Dashboard2` / `/dashboard-cartographique`
- `DashboardCartographique`
- `Observatoire V2`
- `DecisionDashboardTest`

### À reléguer

- `/dashboard` legacy
- `/dashboard-climate`
- `/pollution-idp-dev` comme écran DEV isolé
- `/dashboard-scenarios` comme navigation modèles, pas dashboard DG

## Conclusion

Le socle technique utile au pilotage existe déjà en grande partie. Ce qui manque n’est pas un nouveau moteur SIG, ni un nouveau chantier hydraulique, ni un nouveau backend propagation. Ce qui manque est une réorganisation décisionnelle des écrans, des KPI et de la hiérarchie d’information.
