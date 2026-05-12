# Fiche table - qualite.source_pollution_mesure_param

## 1. Identification
- Schéma : `qualite`
- Table : `source_pollution_mesure_param`
- Statut : `PENDING`
- Priorité : `Critique`
- Volume source : `7191` lignes
- Script SQL en attente : `../sql_en_attente/qualite_source_pollution_mesure_param.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `param_code_legacy`
- Colonnes valeurs : `valeur_raw, valeur_num`
- Colonnes dates : `qa_checked_at, created_at`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `51`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| Ag | param_code_legacy | 141 |
| Al | param_code_legacy | 141 |
| As_ | param_code_legacy | 141 |
| Ba | param_code_legacy | 141 |
| Be | param_code_legacy | 141 |
| Ca__ | param_code_legacy | 141 |
| Cd | param_code_legacy | 141 |
| CF | param_code_legacy | 141 |
| Cl_ | param_code_legacy | 141 |
| Co | param_code_legacy | 141 |
| Conduc | param_code_legacy | 141 |
| CrT | param_code_legacy | 141 |
| CT | param_code_legacy | 141 |
| Cu | param_code_legacy | 141 |
| DBO5 | param_code_legacy | 141 |
| DCO | param_code_legacy | 141 |
| Fe | param_code_legacy | 141 |
| Fe2_ | param_code_legacy | 141 |
| Hg | param_code_legacy | 141 |
| Huiles_Gra | param_code_legacy | 141 |
| K_ | param_code_legacy | 141 |
| Li | param_code_legacy | 141 |
| MES | param_code_legacy | 141 |
| Mg__ | param_code_legacy | 141 |
| Mn | param_code_legacy | 141 |
| Mo | param_code_legacy | 141 |
| Na_ | param_code_legacy | 141 |
| NH4_ | param_code_legacy | 141 |
| Ni | param_code_legacy | 141 |
| NO2_ | param_code_legacy | 141 |
| NO3_ | param_code_legacy | 141 |
| NTK | param_code_legacy | 141 |
| O2_Diss | param_code_legacy | 141 |
| Pb | param_code_legacy | 141 |
| pH | param_code_legacy | 141 |
| Phénol | param_code_legacy | 141 |
| PO43_ | param_code_legacy | 141 |
| PT | param_code_legacy | 141 |
| Sb | param_code_legacy | 141 |
| Se | param_code_legacy | 141 |
| SF | param_code_legacy | 141 |
| Sn | param_code_legacy | 141 |
| SO4__ | param_code_legacy | 141 |
| Sr | param_code_legacy | 141 |
| T_air | param_code_legacy | 141 |
| T_eau | param_code_legacy | 141 |
| TH | param_code_legacy | 141 |
| Tl | param_code_legacy | 141 |
| Turbidité | param_code_legacy | 141 |
| V | param_code_legacy | 141 |
| Zn | param_code_legacy | 141 |

## 4. Analyse qualité
- Valeurs nulles détectées : `3447`
- Valeurs non numériques détectées : `3733`
- Valeurs négatives détectées : `0`
- Unités observées : `à confirmer`
- Exemples : `1,8X106 | 4,5X106 | - | 1800000 | 4500000 | 1200000`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `51`
- Lignes décision migration `42` associées par paramètre : `138`
- Cas de validation `44` associés par paramètre : `82`
- Problèmes détectés : `cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs non numériques, valeurs nulles`

## 6. Règles à appliquer
- parsing valeurs : appliquer seulement les règles validées dans `docs/42` et `docs/44`.
- conversion unités : aucune conversion automatique sans validation métier.
- règles métier validées : aucune règle n’est considérée validée tant que le statut de la table reste `PENDING`.
- staging : conservation brute obligatoire.

## 7. Proposition de migration contrôlée
- Action proposée : `valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test`
- Exécution : interdite tant que la table n’est pas `VALIDATED`.
- Test obligatoire : sous-ensemble limité, contrôle volumes, contrôle flags, contrôle rollback.

## 8. Validation
- statut : `PENDING`
- validateur :
- date :
- décision :

## 9. Exécution
- script utilisé : aucun
- volume migré : `0`
- volume en quarantaine : `0`
- résultat : non exécuté
