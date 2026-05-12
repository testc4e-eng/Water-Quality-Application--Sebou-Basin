# Fiche table - qualite.mesure_qualite_riviere

## 1. Identification
- Schéma : `qualite`
- Table : `mesure_qualite_riviere`
- Statut : `PENDING`
- Priorité : `Critique`
- Volume source : `60097` lignes
- Script SQL en attente : `../sql_en_attente/qualite_mesure_qualite_riviere.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `parametre_qualite`
- Colonnes valeurs : `valeur`
- Colonnes dates : `temps, pas_temps, qa_checked_at, created_at`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `96`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| T_eau | parametre_qualite | 1995 |
| T_Air | parametre_qualite | 1995 |
| ph | parametre_qualite | 1994 |
| Conductivite | parametre_qualite | 1992 |
| Phosphore total | parametre_qualite | 1972 |
| O2_diss | parametre_qualite | 1971 |
| MES | parametre_qualite | 1961 |
| DBO5 | parametre_qualite | 1961 |
| NH4 | parametre_qualite | 1953 |
| CF | parametre_qualite | 1953 |
| DCO | parametre_qualite | 1932 |
| NO3- | parametre_qualite | 1930 |
| PO4 3- | parametre_qualite | 1891 |
| Cl | parametre_qualite | 1889 |
| SF | parametre_qualite | 1879 |
| Turbidite | parametre_qualite | 1822 |
| HCO3- | parametre_qualite | 1799 |
| NO2- | parametre_qualite | 1791 |
| NA | parametre_qualite | 1790 |
| K | parametre_qualite | 1789 |
| SO4 | parametre_qualite | 1788 |
| Mg | parametre_qualite | 1783 |
| CT | parametre_qualite | 1756 |
| Ca | parametre_qualite | 1741 |
| CO3 | parametre_qualite | 1715 |
| Azote_tot_kjeldhal | parametre_qualite | 1580 |
| TAC | parametre_qualite | 1103 |
| TA | parametre_qualite | 1100 |
| sat | parametre_qualite | 1074 |
| TH | parametre_qualite | 806 |
| Ph�nol | parametre_qualite | 682 |
| HCT | parametre_qualite | 490 |
| Pb | parametre_qualite | 436 |
| Se | parametre_qualite | 434 |
| FeT | parametre_qualite | 417 |
| CrT | parametre_qualite | 389 |
| Azote_Total | parametre_qualite | 358 |
| Fe | parametre_qualite | 300 |
| Cd | parametre_qualite | 274 |
| Cu | parametre_qualite | 272 |
| Ni | parametre_qualite | 269 |
| As | parametre_qualite | 240 |
| Zn | parametre_qualite | 233 |
| Hg | parametre_qualite | 227 |
| Largeur | parametre_qualite | 191 |
| Detergent | parametre_qualite | 189 |
| Chla | parametre_qualite | 180 |
| Debit | parametre_qualite | 162 |
| H_G | parametre_qualite | 153 |
| SiO3 | parametre_qualite | 150 |
| Mn | parametre_qualite | 136 |
| IBD | parametre_qualite | 128 |
| CN | parametre_qualite | 124 |
| Co | parametre_qualite | 110 |
| Profondeur | parametre_qualite | 108 |
| Disque_secchi | parametre_qualite | 87 |
| Eh | parametre_qualite | 86 |
| DCO_dec2h | parametre_qualite | 57 |
| F | parametre_qualite | 56 |
| Cr | parametre_qualite | 54 |
| Al | parametre_qualite | 54 |
| PTD | parametre_qualite | 48 |
| PTP | parametre_qualite | 48 |
| IBGN | parametre_qualite | 43 |
| RS105 | parametre_qualite | 39 |
| MO | parametre_qualite | 26 |
| DBO5_dec2h | parametre_qualite | 24 |
| Ba | parametre_qualite | 18 |
| Pheopigment | parametre_qualite | 17 |
| Li | parametre_qualite | 16 |
| Ag | parametre_qualite | 9 |
| F_M_mes | parametre_qualite | 7 |
| S | parametre_qualite | 4 |
| Germe_tt_22 | parametre_qualite | 4 |
| SO3 | parametre_qualite | 3 |
| Sb | parametre_qualite | 3 |
| FM | parametre_qualite | 3 |
| Chl | parametre_qualite | 2 |
| Carbone_org | parametre_qualite | 2 |
| MD | parametre_qualite | 2 |

## 4. Analyse qualité
- Valeurs nulles détectées : `0`
- Valeurs non numériques détectées : `0`
- Valeurs négatives détectées : `1`
- Unités observées : `à confirmer`
- Exemples : `6000000 | 1500 | 55000000`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `96`
- Lignes décision migration `42` associées par paramètre : `330`
- Cas de validation `44` associés par paramètre : `146`
- Problèmes détectés : `cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs négatives`

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
