# LOT 4A-3 : Bilan Dry-Run (Réseau Lentique et Garde)

## Flux : `mesures_qualite_barrages`
- 🟦 `WOULD_INSERT`  : 0
- 🟨 `WOULD_UPDATE`  : 609
- 🟩 `WOULD_SKIP`    : 0 (Vides Ignorés) + 8105 (Synchrones identifiés)
- 🟥 `WOULD_CONFLICT`: 0 (Orphelins purs rejetés)
- 🚩 **QA IMPRIMTÉS** :
     - ⚠️ `qa_flag_negative` = 0
     - ☢️ `qa_flag_param_unmapped` = 163

## Flux : `mesures_suivi_qualite_brg_garde_hebdo`
- 🟦 `WOULD_INSERT`  : 3515
- 🟨 `WOULD_UPDATE`  : 0
- 🟩 `WOULD_SKIP`    : 3579 (Vides Ignorés) + 0 (Synchrones identifiés)
- 🟥 `WOULD_CONFLICT`: 0 (Orphelins purs rejetés)
- 🚩 **QA IMPRIMTÉS** :
     - ⚠️ `qa_flag_negative` = 0
     - ☢️ `qa_flag_param_unmapped` = 88
     - 🥇 `qa_flag_station_infered` = 3515 (Tous les enregistrements valables ont hérité de la géoloc de Garde Sebou M: 99999)

