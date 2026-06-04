# GO NOGO dashboard strategy

## Ce qui est déjà validé

- réseau hydraulique validé
- backend propagation MVP V1 prêt
- dashboard qualité réglementaire P0 prêt en DEV
- carte métier P0 disponible

## Ce qui ne doit plus être refait

- validation hydraulique
- noding / gap fixing / arbitrages réseau
- backend propagation MVP V1
- audits documentaires déjà clos sur ces sujets

## Dashboards à conserver

- Carte Métier
- Qualité Réglementaire
- Admin data / ingestion / QA

## Dashboards à fusionner

- dashboard cartographique legacy
- observatoire V2
- dashboard analytique actuel
- decision dashboard test

## Dashboards à créer

- Accueil SAD
- Pollution décisionnel
- Analyses décisionnelles
- Expert unifié
- Administration unifiée

## KPI prioritaires

- `IQGB`
- `IQS`
- `IFD`
- `ICD`
- `ICH`
- `IPP`

## Améliorations proposées

- KPI DG supplémentaires : `IAR`, `ISR`, `IPA`
- alertes intelligentes métier
- scores de priorité action
- recommandations actionnables
- workflows de validation métier
- navigation par niveaux DG / expert / admin
- carte orientée décision et non couches
- analyses croisées séparant air / eau
- gouvernance de confiance et fraîcheur

## Roadmap réaliste

1. Accueil SAD
2. Pollution refondu
3. Carte Métier consolidée
4. Analyses
5. Expert
6. Administration consolidée

## Estimation de charge

- DEV utile : `27 à 41 j`
- préprod consolidée : `35 à 55 j`

## Risques

- confusion température air / eau si non gouvernée explicitement
- maintien trop long des dashboards legacy en navigation primaire
- interprétation excessive de la propagation topologique
- hétérogénéité UX si fusion des écrans non cadrée
- fragilité préprod tant que certains sujets métier pollution IDP restent conditionnés

## Décision finale

`GO_DECISION_FIRST_SAD`

Motif :

- les fondations critiques sont déjà acquises ;
- la dette principale est désormais une dette d’orchestration décisionnelle, pas une dette de moteur ;
- la stratégie recommandée est une convergence ciblée et non une refonte générale.
