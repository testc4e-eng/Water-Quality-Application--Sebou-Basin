# Préparation ingestion température - audit read-only

## 1. Audit source

Fichier prioritaire : `C:\dev\WQDSS\data\donnees temperature\timeseries_temperature_global.csv`.

| Fichier | Lignes | Stations | Début | Fin | Doublons | T_Min > T_Max | Outliers |
|---|---|---|---|---|---|---|---|
| timeseries_temperature_global.csv | 445194 | 37 | 1983-01-01 | 2026-06-10 | 0 | 0 | 0 |
| timeseries_TMAX_par_station.csv | 15867 | 37 | 1983-01-01 | 2026-06-10 | 0 | n/a | n/a |
| timeseries_TMIN_par_station.csv | 15867 | 37 | 1983-01-01 | 2026-06-10 | 0 | n/a | n/a |


Nulls fichier global : `{'Date': 0, 'Sous_Bassin': 0, 'Station': 0, 'T_Max': 0, 'T_Min': 0}`.
Températures observées : T_Min min `-12.41`, T_Max max `49.54`.
Règle outlier audit utilisée : T_Min < -30°C ou T_Max > 60°C ou valeurs inversées. Aucun cas détecté.

## 2. Comparaison global vs fichiers larges

| Contrôle | Valeur |
|---|---|
| Non-null TMAX large | 445194 |
| Non-null TMIN large | 445194 |
| Lignes global sans TMAX large | 0 |
| Lignes global sans TMIN large | 0 |
| TMAX large absentes du global après normalisation | 0 |
| TMIN large absentes du global après normalisation | 0 |
| Différences valeurs TMAX appariées | 0 |
| Différences valeurs TMIN appariées | 0 |
| Doublons de normalisation TMAX | 7305 |
| Doublons de normalisation TMIN | 7305 |


Signal QA : `Bab Ouender` et `Bab_Ouender` sont deux stations source distinctes mais ont la même clé normalisée `babouender`. Elles pointent vers le même candidat DB si on normalise, donc décision métier obligatoire avant chargement final.

## 3. Mapping stations vers infra.stations_mesure

`infra.stations_mesure` contient 390 lignes. `meteo.mesure_temperature` contient 0 ligne.

| Indicateur | Valeur |
|---|---|
| Stations source | 37 |
| Exactement mappables | 26 |
| Ambiguës exactes | 0 |
| Absentes / à valider | 11 |


### Exactement mappables
| Station source | station_id candidat | Nom DB | Code DB | Type |
|---|---|---|---|---|
| Aguelmam_Sidi_Ali | a963a9da-0441-4b33-b6aa-6ffbc1041125 | aguelmam sidi ali | 1652/22 | pluviometrique |
| Ain_aicha | 5776b37c-48c8-41b2-8f3d-afadac7fd12e | ain aicha | 1217/9 | hydrologique |
| Ait_Khabbach | 1b62f3e9-91a7-4c4a-9385-d3aa78eae978 | ait khabbach | 585/22 | hydrologique |
| Azzaba | 68d55282-7106-4a08-a074-0d8c92a609dd | azzaba | 583/22 | hydrologique |
| Bab Chhoub | 1230cd2c-2ca1-483a-8466-d6585fcfbd61 | bab chhoub | 702/16 | hydrologique |
| Bab Merzouka | da925486-bca7-49e3-af60-ea5f2294a77a | bab merzouka | 551/16 | hydrologique |
| Bab Ouender | 517c713a-dda4-4dcb-a033-4143062487fd | bab ouender | 260/9 | hydrologique |
| Bab_Ouender | 517c713a-dda4-4dcb-a033-4143062487fd | bab ouender | 260/9 | hydrologique |
| Bab_taza | 3b477290-57ad-4aff-bf46-9418e450dc8d | bab taza | 1586/600 | pluviometrique |
| Beni Heitem | c9eda862-abf9-4375-b614-2e1b2eb84715 | beni heitem | 672/16 | hydrologique |
| Boufellou | 8672b830-aff8-4fd3-87a7-a43ac966af68 | boufellou | 1749/9 | hydrologique |
| Boured | 7042849a-fb8a-4d37-9c74-94d910553723 | boured | 295/10 | hydrologique |
| Dar_El_Hamra | bc8e6d83-08d3-4bfa-8c78-daa754af79b7 | dar el hamra | 1000/23 | hydrologique |
| El_Malha | fc8e8e8b-494c-46b7-aa72-d634d4c19cd2 | el malha | 323/4 | hydrologique |
| El_Mers | 2ad1ba50-cc7b-456a-8464-0dd4dd9058c7 | el mers | 541/23 | hydrologique |
| Galaz | 6f1bbf08-ce82-4dfe-ae44-6e26c9ef07e4 | galaz | 1216/9 | hydrologique |
| Had_kourt | eecf0ca7-8e8b-45b1-b00c-ae8e75fd60ce | had kourt | 1436/8 | hydrologique |
| Hajria | 0436c345-452d-4239-a3e3-2842fd3ab7b1 | hajria | 1508/9 | hydrologique |
| Jbel_oudka | cfa0fcf9-82d2-4dae-be20-06b36bfe0fd3 | jbel oudka | 4626/600 | pluviometrique |
| Kharrouba | b1ba728c-f39b-4922-9a0c-3581390019e8 | kharrouba | 454/9 | hydrologique |
| Lalla_Mimouna | 343b85cf-030e-46d8-b892-c4ce6cee7bd7 | lalla mimouna | 1815/8 | hydrologique |
| Oulad_yaacoub | 05239150-c8b0-4925-be27-95c3fcd483da | oulad yaacoub | 6153/600 | pluviometrique |
| Ratba | ddd6fea0-22b6-49b3-83c9-7533a1188a86 | ratba | 1708/9 | hydrologique |
| Tabouda | f88b46fe-ff1e-4b06-916d-8f3d465562ca | tabouda | 1215/9 | hydrologique |
| Taghzout | 5b01a831-2781-4d2e-b60a-aaba6238d325 | taghzout | 1707/9 | hydrologique |
| Zrarda | 7e275775-8cc5-4644-8381-87b3b3663f64 | zrarda | 891/16 | hydrologique |


### Absentes ou à arbitrer
| Station source | Clé normalisée | Suggestion lecture seule | Statut |
|---|---|---|---|
| ABHS | abhs | fes (ABHS) (3817/600, pluviometrique, ratio 0.727) | ARBITRAGE_REQUIS |
| Azibe_Soltane | azibesoltane | azib soltane (1540/15, hydrologique, ratio 0.957) | ARBITRAGE_REQUIS |
| Belksiri | belksiri | pont bel ksiri   (3694/8, None, ratio 0.8) | ARBITRAGE_REQUIS |
| Dar_El_Arssa | darelarssa | dar el arsa (2263/15, hydrologique, ratio 0.947); dar el hamra (1000/23, hydrologique, ratio 0.8) | ARBITRAGE_REQUIS |
| ElHamam | elhamam | el hammam (2062/21, hydrologique, ratio 0.933); el hammam (Hammam/14, None, ratio 0.933) | ARBITRAGE_REQUIS |
| Khennichet | khennichet | khenichet (1359/8, hydrologique, ratio 0.947) | ARBITRAGE_REQUIS |
| Moulay_Ali_Cherif | moulayalicherif | my ali cherif (1545/8, hydrologique, ratio 0.846) | ARBITRAGE_REQUIS |
| OuedIfrane | ouedifrane | Aucune suggestion fiable | ARBITRAGE_REQUIS |
| Rdom | rdom | Aucune suggestion fiable | ARBITRAGE_REQUIS |
| Route26 | route26 | Aucune suggestion fiable | ARBITRAGE_REQUIS |
| Tissa | tissa | Aucune suggestion fiable | ARBITRAGE_REQUIS |




## 3.1 Volumétrie par statut de mapping

| Statut | Lignes source | Commentaire |
|---|---:|---|
| Candidat exact disponible | 309281 | À charger en staging, puis validation métier avant insertion cible |
| Station non résolue / à arbitrer | 135913 | Blocage ingestion métier directe |
| Total | 445194 | Cohérent avec fichier global |

Stations bloquées et volumétrie : ABHS 14245, Azibe_Soltane 14245, Belksiri 14245, Dar_El_Arssa 14245, ElHamam 8644, Khennichet 8644, Moulay_Ali_Cherif 14245, OuedIfrane 8644, Rdom 8644, Route26 14245, Tissa 15867.

## 4. Risques

- Les 11 stations non résolues bloquent l'ingestion métier complète sans table d'arbitrage.
- `Bab Ouender` / `Bab_Ouender` doit être traité explicitement : doublon organisationnel possible, mais pas fusion automatique.
- `meteo.mesure_temperature` ne contient que `temps`, `station_id`, `val_min`, `val_max`, `val_moy`; aucun `import_batch_id`. Le rollback logique par batch nécessite donc une table de suivi ou un enrichissement de modèle avant insertion réelle.
- Les fichiers larges confirment le global, mais doivent rester sources de contrôle, pas source prioritaire d'insertion.

## 5. Décision GO/NOGO proposée

`NOGO_INGESTION_METIER_DIRECTE` tant que le mapping des 11 stations non résolues et la stratégie de rollback par `import_batch_id` ne sont pas validés.

`GO_STAGING_PREPARE` possible : création future de `staging.temperature_daily_raw`, chargement staging avec flags QA, puis arbitrage station.

Aucune donnée BD n'a été modifiée pendant cet audit.
