# 2. Inventaire des domaines et paramètres

L'audit des tables de faits (`hydro.*`, `meteo.*`, `qualite.*`) a permis de classer les données dans les domaines suivants :

## QUALITE
* **Source** : `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_barrage`, `qualite.mesure_qualite_sebou`.
* **Paramètres fréquents** : `DBO5`, `DCO`, `NH4`, `NO3-`, `O2_DISS`, `pH`, `Cond`.
* **Volumétrie** : > 117 000 mesures actives validées.
* **Seuils** : Près de 177 seuils réglementaires actifs configurés (marocains).

## HYDROLOGIE
* **Source** : `hydro.mesure_debit`, `hydro.mesure_debit_mensuel`, `hydro.mesure_barrage_param`.
* **Paramètres fréquents** : `DEBIT` (m³/s), `VOLUME` (Mm³), `LACHER` (Mm³/j), `APPORT`.
* **Volumétrie** : > 944 000 mesures.
* **Seuils** : Non soumis au même moteur réglementaire qualité (statistiques pures).

## CLIMATOLOGIE
* **Source** : `meteo.mesure_precipitation`, `meteo.mesure_temperature`, `meteo.mesure_evaporation`.
* **Paramètres fréquents** : Précipitations (mm), Température (°C), Évaporation (mm).
* **Volumétrie** : > 1 032 000 mesures.

## POLLUTION
* **Source** : `qualite.source_pollution_mesure_param`, `api.v_pollution_latest_results`.
* **Paramètres fréquents** : Constats IDP (Charge organique, etc.).

## TERRITOIRE & REFERENTIEL
* Découpages administratifs et géographiques (Commune, Province, Bassin).
