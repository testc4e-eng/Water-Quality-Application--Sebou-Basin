# Incoherences geo a traiter une par une

## Regle de traitement

- Aucun cas n'est corrige automatiquement.
- Chaque cas reste a arbitrer individuellement avant migration finale.
- Les problemes purement spatiaux deviennent des flags QA tant qu'un rattachement geo unique existe.

## Priorite 1 - homonymes et doubles codes sur stations

| Cas | Observation | Action attendue |
|---|---|---|
| puits à captage cuvelé | 17 IRE differents : 1062/8 | arbitrage metier + choix du referentiel unique |
| forage | 12 IRE differents : 1025/14 | arbitrage metier + choix du referentiel unique |
|  | 7 IRE differents : 1253/15 | arbitrage metier + choix du referentiel unique |
| piézomètre | 4 IRE differents : 1780/8 | arbitrage metier + choix du referentiel unique |
| piezomètre | 3 IRE differents : 1026/14 | arbitrage metier + choix du referentiel unique |
| ain aghbal | 2 IRE differents : 131/22 | arbitrage metier + choix du referentiel unique |
| ain skhounate | 2 IRE differents : 2528/15 | arbitrage metier + choix du referentiel unique |
| el hammam | 2 IRE differents : 2062/21 | arbitrage metier + choix du referentiel unique |
| my yaacoub | 2 IRE differents : 2043/15 | arbitrage metier + choix du referentiel unique |
| puit sodea | 2 IRE differents : 693/14 | arbitrage metier + choix du referentiel unique |
| puit souk tnin bouhlou | 2 IRE differents : 853/16 | arbitrage metier + choix du referentiel unique |
| puits à captage non cuvelé | 2 IRE differents : 1210/15 | arbitrage metier + choix du referentiel unique |

## Priorite 2 - memes coordonnees avec codes differents

| Coordonnees | Observation | Action attendue |
|---|---|---|
| 537340.00, 372500.00 | 3 codes/IRE : 1164/15 | verifier doublon ou multi-capteurs legitime |
| 387780.00, 386360.00 | 2 codes/IRE : 1151/13 | verifier doublon ou multi-capteurs legitime |
| 387780.00, 386370.00 | 2 codes/IRE : 1190/13 | verifier doublon ou multi-capteurs legitime |
| 392182.00, 392448.00 | 2 codes/IRE : 4258/14 | verifier doublon ou multi-capteurs legitime |
| 397070.00, 425200.00 | 2 codes/IRE : 911/8 | verifier doublon ou multi-capteurs legitime |
| 403900.00, 410550.00 | 2 codes/IRE : 994/14 | verifier doublon ou multi-capteurs legitime |
| 406835.00, 432501.00 | 2 codes/IRE : 3546/8 | verifier doublon ou multi-capteurs legitime |
| 414770.00, 435800.00 | 2 codes/IRE : 1355/8 | verifier doublon ou multi-capteurs legitime |
| 415450.00, 411750.00 | 2 codes/IRE : 1817/18 | verifier doublon ou multi-capteurs legitime |
| 416100.00, 386360.00 | 2 codes/IRE : 3249/14 | verifier doublon ou multi-capteurs legitime |
| 421700.00, 403900.00 | 2 codes/IRE : 2659/14 | verifier doublon ou multi-capteurs legitime |
| 425829.00, 395427.00 | 2 codes/IRE : 2713/14 | verifier doublon ou multi-capteurs legitime |

## Priorite 3 - stations proches < 20 m

- Le rapport 49 detecte `49` paires de stations a moins de `20 m`.
- Ces cas ne bloquent pas automatiquement si le rattachement reste unique, mais doivent etre qualifies avant migration definitive.

## Priorite 4 - points pollution proches / homonymes

- `qualite.source_pollution_prelevement` presente des flags de proximite reseau et de localisation hors bassin a surveiller.

## Cas metier a verifier separement

| Cas | Observation | Pourquoi a verifier |
|---|---|---|
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S2 (Barrage de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
| S3 (Station Pompage Ferme (Amont Bge de garde) | staging.raw_idp_2024_mesures_qualite_globale / statut GEO_ORPHAN_XY_2M / candidats 0 | verifier separation Garde Sebou / P29 / Allal Tazi |
