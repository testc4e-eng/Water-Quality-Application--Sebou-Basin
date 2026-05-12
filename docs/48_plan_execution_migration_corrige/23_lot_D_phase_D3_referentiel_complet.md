# Lot D3 — Référentiel paramètres complet

## 1. Statut

- Statut : `PENDING VALIDATION`.
- Mode : génération documentaire + SQL proposé non exécuté.
- Base consultée : `abh_sad.staging.raw_*` en lecture seule.
- Aucun chargement vers `qualite`, `hydro`, `meteo`, `infra` ou tables finales.
- Aucune table `metadata` créée ou alimentée pendant D3.

## 2. Synthèse

| Indicateur | Valeur |
|---|---|
| Paramètres observés inventaire docs/39 | 298 |
| Paramètres canonisés D3 | 200 |
| Mappings source générés docs/42 | 514 |
| Couverture variantes inventaire | 74.2% |
| Paramètres VALID | 22 |
| Paramètres VALID_WITH_QA | 16 |
| Paramètres QUARANTAINE | 1 |
| Paramètres AMBIGUS | 0 |
| Paramètres NON_RECONNUS | 76 |
| Paramètres A_VALIDER | 85 |
| Tables raw disponibles | 46 |
| Tables metadata D3 présentes en base | aucune |

## 3. Lecture métier

- Les variantes métier exactes sont regroupées sous un seul paramètre canonique.
- `H_G` est rattaché à `HG` (huiles et graisses) et `Hg` reste le mercure.
- `Debit_jr`, `debit_m` et variantes débit sont fusionnés sous `DEBIT` avec attribut `time_step`.
- Les mappings `A_VALIDER` ou `QUARANTAINE` ne doivent pas alimenter Lot E.
