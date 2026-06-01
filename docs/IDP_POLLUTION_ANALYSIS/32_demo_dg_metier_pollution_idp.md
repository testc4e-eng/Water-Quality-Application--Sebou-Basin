# Demo DG / metier - Pollution IDP DEV

## Objectif

Montrer une premiere couche cartographique exploitable des sites pollution IDP, avec filtres P0 et derniers resultats qualite, dans l'interface WQDSS/SAD.

## Messages a afficher clairement

- DEV uniquement.
- Donnees en cours de validation.
- Pas encore pre-production.
- Les doublons et conflits ne sont pas supprimes automatiquement.
- Les arbitrages metier restent obligatoires avant stabilisation officielle.

## Ce qui fonctionne

- Import staging IDP reel.
- Couche canonique `geo.ref_site_pollution` chargee.
- Resultats P0 en format long dans `qualite.resultat_mesure`.
- Vues `api.v_pollution_sites` et `api.v_pollution_latest_results`.
- Endpoint GeoJSON `/api/v1/pollution/sites.geojson`.
- Page React isolee `/pollution-idp-dev`.
- Filtres `DBO5`, `DCO`, `NH4`, `NO3`, `MES`.
- Popup site avec typologie, commune, statut et derniers resultats.

## Limites connues

- 71 mesures restent sans geometrie/site.
- 1316 doublons exacts et 69 doublons proches restent a arbitrer.
- 299 conflits multi-sources restent a qualifier.
- `MEST Filtr` et variantes spectro/titri sont valides en DEV mais a confirmer metier.
- Les unites P0 sont reprises du referentiel canonique, pas d'une colonne unite source explicite.

## Scenario de demonstration

1. Ouvrir `/pollution-idp-dev`.
2. Montrer le bandeau `DEV uniquement`.
3. Filtrer sur `DBO5`.
4. Filtrer sur `DCO`.
5. Filtrer sur `NH4` puis `NO3`.
6. Cliquer un point et afficher la popup.
7. Montrer les derniers resultats P0.
8. Montrer le rapport QA : `29_qa_after_p0_mapping_report.md`.
9. Expliquer la prochaine etape : arbitrage spatial et validation metier avant pre-production.

## Decision proposee pour la demo

GO demo DG/metier en environnement DEV, avec avertissement explicite sur la validation en cours.
