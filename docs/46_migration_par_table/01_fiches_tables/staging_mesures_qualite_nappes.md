# Fiche table - staging.mesures_qualite_nappes

## 1. Identification
- Schéma : `staging`
- Table : `mesures_qualite_nappes`
- Statut : `PENDING`
- Priorité : `Critique`
- Volume source : `63088` lignes
- Script SQL en attente : `../sql_en_attente/staging_mesures_qualite_nappes.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `parametre_qualite`
- Colonnes valeurs : `val_qual_nap`
- Colonnes dates : `date_prelevement`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `71`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| Conductivite | parametre_qualite | 2659 |
| T_eau | parametre_qualite | 2658 |
| ph | parametre_qualite | 2651 |
| CF | parametre_qualite | 2643 |
| SF | parametre_qualite | 2640 |
| K | parametre_qualite | 2637 |
| NA | parametre_qualite | 2637 |
| HCO3- | parametre_qualite | 2636 |
| NO3- | parametre_qualite | 2632 |
| MO | parametre_qualite | 2625 |
| Cl | parametre_qualite | 2624 |
| Mg | parametre_qualite | 2619 |
| SO4 | parametre_qualite | 2618 |
| T_Air | parametre_qualite | 2617 |
| NO2- | parametre_qualite | 2609 |
| NH4 | parametre_qualite | 2590 |
| CT | parametre_qualite | 2560 |
| CO3 | parametre_qualite | 2552 |
| Ca | parametre_qualite | 2550 |
| RS105 | parametre_qualite | 2203 |
| Mn | parametre_qualite | 2199 |
| TAC | parametre_qualite | 2027 |
| TA | parametre_qualite | 2027 |
| TH | parametre_qualite | 1608 |
| FeT | parametre_qualite | 1560 |
| Fe | parametre_qualite | 689 |
| O2_diss | parametre_qualite | 207 |
| Azote_tot_kjeldhal | parametre_qualite | 206 |
| DCO | parametre_qualite | 179 |
| PTD | parametre_qualite | 73 |
| PTP | parametre_qualite | 73 |
| PO4 3- | parametre_qualite | 40 |
| Phosphore_Total | parametre_qualite | 39 |
| Turbidite | parametre_qualite | 31 |
| MES | parametre_qualite | 25 |
| sat | parametre_qualite | 18 |
| S2 | parametre_qualite | 16 |
| DBO5 | parametre_qualite | 10 |
| RS185 | parametre_qualite | 7 |
| Chla | parametre_qualite | 7 |
| Pb | parametre_qualite | 6 |
| Ph�nol | parametre_qualite | 5 |
| Cd | parametre_qualite | 5 |
| Cu | parametre_qualite | 5 |
| Debit | parametre_qualite | 5 |
| F | parametre_qualite | 5 |
| Zn | parametre_qualite | 5 |
| Se | parametre_qualite | 5 |
| S | parametre_qualite | 4 |
| Al | parametre_qualite | 4 |
| Hg | parametre_qualite | 3 |
| Eh | parametre_qualite | 3 |
| SiO3 | parametre_qualite | 3 |
| Cr | parametre_qualite | 3 |
| CN | parametre_qualite | 3 |
| As | parametre_qualite | 3 |
| CrT | parametre_qualite | 2 |
| H2S | parametre_qualite | 2 |
| Profondeur | parametre_qualite | 2 |
| Co | parametre_qualite | 2 |
| Ni | parametre_qualite | 2 |
| CO32 | parametre_qualite | 1 |
| Couleur | parametre_qualite | 1 |
| F_M_mes | parametre_qualite | 1 |
| Disque_secchi | parametre_qualite | 1 |
| Azote_Org | parametre_qualite | 1 |
| Numerotation_GT | parametre_qualite | 1 |
| Detergent | parametre_qualite | 1 |
| HCO | parametre_qualite | 1 |
| Temperature_Ambiante | parametre_qualite | 1 |
| H_G | parametre_qualite | 1 |

## 4. Analyse qualité
- Valeurs nulles détectées : `0`
- Valeurs non numériques détectées : `0`
- Valeurs négatives détectées : `1`
- Unités observées : `à confirmer`
- Exemples : `67.3 | 2 | 227.1`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `0`
- Lignes décision migration `42` associées par paramètre : `287`
- Cas de validation `44` associés par paramètre : `117`
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
