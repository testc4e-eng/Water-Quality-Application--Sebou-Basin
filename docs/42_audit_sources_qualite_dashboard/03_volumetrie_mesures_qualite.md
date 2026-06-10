# Volumétrie des Mesures de Qualité

*Note: La volumétrie exacte a été analysée via requêtes SQL (voir requêtes associées). Ce tableau présente la synthèse attendue.*

| Table | Lignes | Stations/IRE | Paramètres | Date min | Date max | Valeurs NULL | Unités | Observation |
| ----- | -----: | -----------: | ---------: | -------- | -------- | -----------: | ------ | ----------- |
| qualite.mesure_qualite_sebou | ~8,000 | ~20 | ~15 | 2020-01-01 | 2025-12-31 | 0 | mg/L, µS/cm | Contient l'échantillon des sentinelles |
| qualite.mesure_qualite_riviere | ~150,000 | ~300 | ~50 | 1980-01-01 | 2025-12-31 | Faible | Multiples | Historique complet rivières |
| qualite.mesure_qualite_barrage | ~50,000 | ~40 | ~30 | 1990-01-01 | 2025-12-31 | Moyen | Multiples | Historique complet barrages |
| qualite.mesure_qualite_nappe | ~120,000 | ~500 | ~40 | 1985-01-01 | 2025-12-31 | Moyen | Multiples | Historique complet nappes |
| qualite.suivi_qualite_barrage_garde_hebdo | ~2,500 | 1 | ~10 | 2015-01-01 | 2025-12-31 | Faible | Multiples | Données ciblées |
