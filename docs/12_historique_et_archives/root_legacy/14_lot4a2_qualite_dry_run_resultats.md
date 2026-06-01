# LOT 4A-2 : Bilan Dry-Run (Rivières et Nappes)

> Simulation purement spatiale et unitaire. Le paramètre H_G reste bloqué et flagué tant que le métier n'a pas arbitré.

## Flux : `mesures_qualite_rivieres`
- 🟦 `WOULD_INSERT`  : 0
- 🟨 `WOULD_UPDATE`  : 22
- 🟩 `WOULD_SKIP`    : 0 (Rejet via Règle ANO-LOT4A-002: Concentation Vides) + 60075 Synchrone existant
- 🟥 `WOULD_CONFLICT`: 0 (Orphelins Station)
- 🚩 **QA FLAGS LEVÉS À LA VOLÉE** :
     - ⚠️ `qa_flag_negative` = 1
     - ☢️ `qa_flag_param_unmapped` = 1374 (Exclu de l'analytique WQDSS provisoirement)

## Flux : `mesures_qualite_nappes`
- 🟦 `WOULD_INSERT`  : 0
- 🟨 `WOULD_UPDATE`  : 5
- 🟩 `WOULD_SKIP`    : 0 (Rejet via Règle ANO-LOT4A-002: Concentation Vides) + 63083 Synchrone existant
- 🟥 `WOULD_CONFLICT`: 0 (Orphelins Station)
- 🚩 **QA FLAGS LEVÉS À LA VOLÉE** :
     - ⚠️ `qa_flag_negative` = 1
     - ☢️ `qa_flag_param_unmapped` = 2377 (Exclu de l'analytique WQDSS provisoirement)

