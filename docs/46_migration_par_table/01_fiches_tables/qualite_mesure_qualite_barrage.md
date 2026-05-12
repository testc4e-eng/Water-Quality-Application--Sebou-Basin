# Fiche table - qualite.mesure_qualite_barrage

## 1. Identification
- Schéma : `qualite`
- Table : `mesure_qualite_barrage`
- Statut : `PENDING`
- Priorité : `Critique`
- Volume source : `15808` lignes
- Script SQL en attente : `../sql_en_attente/qualite_mesure_qualite_barrage.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `parametre_qualite`
- Colonnes valeurs : `valeur`
- Colonnes dates : `temps, pas_temps, qa_checked_at, created_at`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `98`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| O2_diss | parametre_qualite | 633 |
| T_eau | parametre_qualite | 602 |
| NO3- | parametre_qualite | 596 |
| Phosphore_Total | parametre_qualite | 591 |
| T_Air | parametre_qualite | 420 |
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
| O2dissous(mgd'O2/l) | parametre_qualite | 182 |
| Indicedephénol(mg/l) | parametre_qualite | 182 |
| pH | parametre_qualite | 182 |
| Nickel(mg)/l | parametre_qualite | 182 |
| Litium(mg/l) | parametre_qualite | 182 |
| SiO2(mg/l) | parametre_qualite | 182 |
| Cobalt(mg/l)) | parametre_qualite | 182 |
| Manganèse(mg/l) | parametre_qualite | 182 |
| Fer(mg/l) | parametre_qualite | 182 |
| Bore(mg/l) | parametre_qualite | 182 |
| DisquedeSecchi(m) | parametre_qualite | 182 |
| SO4(mg/l) | parametre_qualite | 182 |
| NO3-(mg/l) | parametre_qualite | 182 |
| Zinc(mg/l) | parametre_qualite | 182 |
| Molybdène(mg/l) | parametre_qualite | 182 |
| Cadmium(mg/l) | parametre_qualite | 182 |
| T_air | parametre_qualite | 182 |
| Plomb(mg/l) | parametre_qualite | 182 |
| Conductivitéà20°C(µs/cm) | parametre_qualite | 182 |
| PO43-(mgP/l) | parametre_qualite | 182 |
| MEST(mg/l) | parametre_qualite | 182 |
| Chl.A(µg/l) | parametre_qualite | 182 |
| IP(mgO2/l) | parametre_qualite | 182 |
| NH4+(mgNH4+/l) | parametre_qualite | 182 |
| Aluminium(mg/l) | parametre_qualite | 182 |
| Beryllium(mg/l) | parametre_qualite | 182 |
| Chrome(mg/l) | parametre_qualite | 182 |
| Sélénium(mg/l) | parametre_qualite | 182 |
| PT(mgP/l) | parametre_qualite | 182 |
| Cl-(mg/l) | parametre_qualite | 182 |
| CF(UFC/100mL) | parametre_qualite | 182 |
| Ferdissous(mg/l) | parametre_qualite | 182 |
| Cuivre(mg/l) | parametre_qualite | 182 |
| Arsenic(mg/l) | parametre_qualite | 182 |
| Vanadium(mg/l) | parametre_qualite | 182 |
| Mercure(mg/l) | parametre_qualite | 182 |
| F-(mg/l) | parametre_qualite | 181 |
| CN(mg/l) | parametre_qualite | 179 |
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
| NA | parametre_qualite | 128 |
| sat | parametre_qualite | 128 |
| HCO3- | parametre_qualite | 128 |
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

## 4. Analyse qualité
- Valeurs nulles détectées : `3579`
- Valeurs non numériques détectées : `0`
- Valeurs négatives détectées : `0`
- Unités observées : `à confirmer`
- Exemples : `0.25 | 0.141 | 1.27`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `98`
- Lignes décision migration `42` associées par paramètre : `300`
- Cas de validation `44` associés par paramètre : `131`
- Problèmes détectés : `cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs nulles`

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
