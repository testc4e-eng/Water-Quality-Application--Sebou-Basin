# LOT 4A-3 : Audit Métrologique des Retenues (Barrages et Hebdo)

> Focus A/B exclusif sur l'hydro-accumulation. La qualité des barrages permet de valider le potentiel d'eutrophisation du périmètre Sebou.

## 1. Bilan Volumétrique par Faisceau Hydraulique

### Dôme Géo-Chimique : `mesures_qualite_barrages` ➔ `qualite.mesure_qualite_barrage`
- **Périmètre Temporel (Sandbox)** : 1988-10-14 au 2024-11-29
- **Volume Sandbox** : 8714 mesures.
- **Volume Prod. Actuelle** : 15808 mesures. *(Delta Structurel: **-7094**)*
- **Mesures Isolées Vides (NULL)** : 0 
- **Valeurs Labo Négatives (<0)** : 0
- **Conflits Identité Spatiale (Orphelins)** : 0
- **Variables Distinctes Relevées** : 60 paramètres `['Ca', 'Fe', 'Mg', 'T_eau', 'OH']...`

### Dôme Géo-Chimique : `mesures_suivi_qualite_brg_garde_hebdo` ➔ `qualite.suivi_qualite_barrage_garde_hebdo`
- **Périmètre Temporel (Sandbox)** : 2023-01-03 au 2025-09-22
- **Volume Sandbox** : 7094 mesures.
- **Volume Prod. Actuelle** : 7094 mesures. *(Delta Structurel: **0**)*
- **Mesures Isolées Vides (NULL)** : 3579 
- **Valeurs Labo Négatives (<0)** : 0
- **Conflits Identité Spatiale (Orphelins)** : 0 (7 094 lignes bypassées par Inférence Métier 'Barrage Garde Sebou')
- **Variables Distinctes Relevées** : 39 paramètres `['PO43-(mgP/l)', 'MEST(mg/l)', 'Chl.A(µg/l)', 'Indicedephénol(mg/l)', 'PT(mgP/l)']...`

## 2. Analyse du Processus d'Inférence Spatiale (Barrage Garde)
Grâce à la dérogation métier enregistrée au Registre (`CAS_METIER_IMPLICITE`), l'univers `mesures_suivi_qualite_brg_garde_hebdo` jouira techniquement d'un passeport illimité lors de l'Upsert. L'algorithme se moquera de l'absence physique d'un `ire_station` dans le tableur brut :
- Règle assignée : Écriture forcée sur l'ID exclusif du Réservoir Garde Sebou.
- Validation croisée : Flag d'intégrité `qa_flag_station_infered = TRUE` gravé sur le marbre avec l'empreinte de la source `REGLE_FIXE...`.

## 3. Recommandations Pré-Upsert (Dry-Run)
1. **Prise en charge des NULLs (`ANO-LOT4A-002`)** : Les vides identifiés par cet audit devront mourir à l'Ingestion (exclusion `WOULD_SKIP`).
2. **Filtre Paramètre (`QA_UNMAPPED`)** : Comme pour les fleuves, notre liste `ambiguous_list` bloquera `sat` ou `RS105` s'ils rodent autour des barrages.
3. **Attention au Delta Structurel** : La table Barrage de production actuelle héberge un nombre différent de mesures que la Sandbox. Le Dry-run de la phase prochaine diagnostiquera cette disparité (S'agit-il d'updates post-Sandbox ? De lignes supprimées dans le bloc source ?).
