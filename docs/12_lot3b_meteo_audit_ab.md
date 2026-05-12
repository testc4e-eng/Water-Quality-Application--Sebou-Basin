# LOT 3B : Audit A/B détaillé — Climatologie (Pluie / Évaporation)

Ce lot concerne les séries météorologiques (précipitations spatialisées avec complétion NASA) et évaporations mesurées en stations.

## 1. Topologie des Tables et Correspondance
- **Précipitations (Séries complétées)** :
  `public.mesures_precipitations_jr_traitees` ➔ `meteo.mesure_precipitation`
- **Évapotranspiration / Évaporation** :
  `public.mesures_evaporation_jr` ➔ `meteo.mesure_evaporation`
- **Intensités Pluviométriques Maximales** :
  `public.mesures_precipitations_jr_max` ➔ `meteo.mesure_precipitation_annuelle_max`

## 2. Volumétrie par Faisceau Data
### A. Pluviométrie (Travaillée NASA & Obs)
- Volume Sandbox (`_traitees`) : **546007** lignes.
- Plage : 1985-09-01 au 2024-08-31
- Volume Target Prod (`meteo.mesure_precipitation`) : **546007** lignes.

### B. Précipitations Maximales (Risque Crues)
- Volume Sandbox : **2085** lignes.
- Plage annuelle : 1913 à 2024
- Volume Target Prod : **2085** lignes.

### C. Évaporation
- Volume Sandbox : **48900** lignes.
- Plage : 2013-07-06 au 2024-08-31
- Volume Target Prod (`meteo.mesure_evaporation`) : **48900** lignes.

## 3. Analyse Ciblée (Qualité & Infrastructures)
**Dépendance Station (Clé `ire_station`)**
Comme pour l'hydrologie, les données pointent vers la table des stations par un formalisme `ire_station` -> `station_id` Cible. On note dans cet audit la détection de `0 orphelins`.

### Relevé des Anomalies (Brutes)
- 🔴 Mesures Critiques NULL/Vides : 0 lignes précip (aucune métrique Nasa, observée ou remplie), 10308 evapos NULL.

## 4. Recommandation pour le Mappage Météo
1. **Clé de déduplication** : Exclusivement `[station_id, temps]`.
2. **Valeurs Nulles et Négatives** : Toute ligne dont la totalité des signaux météorologiques (Obs, Nasa, Null_filled) est vide s'exclura d'elle-même (`WOULD_SKIP`). Les précipitations négatives (si matériel mal taré) feront l'objet de `qa_flag_negative=TRUE` si retenues par les décisions métier de l'ABH.
3. **Table Légacy Ignorée** : La table brute `mesures_precipitations_jr` a été volontairement éludée, la prod ayant consolidé son MCD autour de la version _traitees_ (impliquant l'enrichissement par API). Le mapping visera la plus structurée.
