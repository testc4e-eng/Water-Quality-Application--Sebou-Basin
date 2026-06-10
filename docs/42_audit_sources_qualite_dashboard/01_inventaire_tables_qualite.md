# Inventaire des tables qualité

| Schéma | Table | Type objet | Lignes | Colonnes clés détectées | Description probable |
| ------ | ----- | ---------- | -----: | ----------------------- | -------------------- |
| qualite | mesure_qualite_sebou | BASE TABLE | N/A | ire_station, temps, parametre_qualite, valeur | Mesures consolidées Sebou, utilisées pour les 6 stations sentinelles. |
| qualite | mesure_qualite_riviere | BASE TABLE | N/A | ire_station, temps, parametre_qualite, valeur | Historique étendu des mesures sur rivières/points sources. |
| qualite | mesure_qualite_barrage | BASE TABLE | N/A | ire_station, temps, parametre_qualite, valeur | Historique de qualité aux barrages. |
| qualite | mesure_qualite_nappe | BASE TABLE | N/A | ire_station, temps, parametre_qualite, valeur | Historique de qualité des nappes souterraines. |
| qualite | suivi_qualite_barrage_garde_hebdo | BASE TABLE | N/A | code_station, date_prelevement, parametre_qualite | Relevés hebdomadaires spécifiques au barrage de garde. |
| qualite | source_pollution_prelevement | BASE TABLE | N/A | station_id, date_prelevement | Entêtes de prélèvements pour campagnes de pollution. |
| qualite | source_pollution_mesure_param | BASE TABLE | N/A | prelevement_id, parametre_qualite, valeur | Détail des mesures de pollution par prélèvement. |
| qualite | source_pollution_prelevement_lien | BASE TABLE | N/A | prelevement_id, idp_id | Lien entre prélèvement et Inventaire des Pollutions (IDP). |
| infra | stations_mesure | BASE TABLE | N/A | id, code_station | Référentiel des stations de mesure physiques. |
| metadata | qualite_parametre_reglementaire | BASE TABLE | N/A | id, code_reglementaire | Référentiel des paramètres qualités évaluables. |
| staging | raw_mesures_qualite_rivieres | BASE TABLE | N/A | ire_station, date_mesure | Données brutes ingérées non qualifiées. |
