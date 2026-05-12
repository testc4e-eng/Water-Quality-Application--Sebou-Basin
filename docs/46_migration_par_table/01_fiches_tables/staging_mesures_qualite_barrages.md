# Fiche table - staging.mesures_qualite_barrages

## 1. Identification
- Schéma : `staging`
- Table : `mesures_qualite_barrages`
- Statut : `PENDING`
- Priorité : `Critique`
- Volume source : `8714` lignes
- Script SQL en attente : `../sql_en_attente/staging_mesures_qualite_barrages.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `parametre_qualite`
- Colonnes valeurs : `val_qual_barr`
- Colonnes dates : `date_prelevement`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `60`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| O2_diss | parametre_qualite | 633 |
| NO3- | parametre_qualite | 596 |
| Phosphore_Total | parametre_qualite | 591 |
| T_Air | parametre_qualite | 420 |
| T_eau | parametre_qualite | 420 |
| ph | parametre_qualite | 420 |
| Conductivite | parametre_qualite | 420 |
| Chla | parametre_qualite | 417 |
| MES | parametre_qualite | 414 |
| PO4 3- | parametre_qualite | 389 |
| SO4 | parametre_qualite | 387 |
| Mn | parametre_qualite | 290 |
| Disque_secchi | parametre_qualite | 279 |
| NH4 | parametre_qualite | 232 |
| Fe | parametre_qualite | 186 |
| Cl | parametre_qualite | 153 |
| Azote_tot_kjeldhal | parametre_qualite | 147 |
| Turbidite | parametre_qualite | 143 |
| CF | parametre_qualite | 139 |
| DBO5 | parametre_qualite | 138 |
| DCO | parametre_qualite | 137 |
| CT | parametre_qualite | 135 |
| NO2- | parametre_qualite | 134 |
| SF | parametre_qualite | 134 |
| Mg | parametre_qualite | 130 |
| K | parametre_qualite | 129 |
| sat | parametre_qualite | 128 |
| HCO3- | parametre_qualite | 128 |
| NA | parametre_qualite | 128 |
| Ca | parametre_qualite | 126 |
| CO3 | parametre_qualite | 120 |
| FeT | parametre_qualite | 94 |
| TAC | parametre_qualite | 71 |
| TA | parametre_qualite | 70 |
| TH | parametre_qualite | 50 |
| SiO3 | parametre_qualite | 37 |
| Pheopigment | parametre_qualite | 37 |
| PTD | parametre_qualite | 15 |
| PTP | parametre_qualite | 15 |
| Profondeur | parametre_qualite | 13 |
| IBD | parametre_qualite | 13 |
| Azote_Total | parametre_qualite | 11 |
| Debit | parametre_qualite | 8 |
| Eh | parametre_qualite | 6 |
| MO | parametre_qualite | 6 |
| Largeur | parametre_qualite | 5 |
| F_M_mes | parametre_qualite | 3 |
| IBGN | parametre_qualite | 3 |
| S2 | parametre_qualite | 2 |
| phenol | parametre_qualite | 2 |
| FM | parametre_qualite | 1 |
| Couleur | parametre_qualite | 1 |
| Azote_Org | parametre_qualite | 1 |
| HCT | parametre_qualite | 1 |
| RS105 | parametre_qualite | 1 |
| Detergent | parametre_qualite | 1 |
| OH | parametre_qualite | 1 |
| S | parametre_qualite | 1 |
| DCO_dec2h | parametre_qualite | 1 |
| Azote_tot_kjeld | parametre_qualite | 1 |

## 4. Analyse qualité
- Valeurs nulles détectées : `0`
- Valeurs non numériques détectées : `0`
- Valeurs négatives détectées : `0`
- Unités observées : `à confirmer`
- Exemples : `0.25 | 0.371 | 12.95`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `0`
- Lignes décision migration `42` associées par paramètre : `264`
- Cas de validation `44` associés par paramètre : `94`
- Problèmes détectés : `cas de quarantaine associés, mapping ambigu ou absent, unités à valider`

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
