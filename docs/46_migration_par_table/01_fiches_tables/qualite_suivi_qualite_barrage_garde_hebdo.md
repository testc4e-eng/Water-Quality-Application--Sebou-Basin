# Fiche table - qualite.suivi_qualite_barrage_garde_hebdo

## 1. Identification
- Schéma : `qualite`
- Table : `suivi_qualite_barrage_garde_hebdo`
- Statut : `PENDING`
- Priorité : `Critique`
- Volume source : `7094` lignes
- Script SQL en attente : `../sql_en_attente/qualite_suivi_qualite_barrage_garde_hebdo.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `parametre_qualite`
- Colonnes valeurs : `valeur`
- Colonnes dates : `temps, pas_temps, qa_checked_at, created_at`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `39`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| PO43-(mgP/l) | parametre_qualite | 182 |
| MEST(mg/l) | parametre_qualite | 182 |
| Chl.A(µg/l) | parametre_qualite | 182 |
| Indicedephénol(mg/l) | parametre_qualite | 182 |
| PT(mgP/l) | parametre_qualite | 182 |
| pH | parametre_qualite | 182 |
| IP(mgO2/l) | parametre_qualite | 182 |
| Nickel(mg)/l | parametre_qualite | 182 |
| T_eau | parametre_qualite | 182 |
| Litium(mg/l) | parametre_qualite | 182 |
| NH4+(mgNH4+/l) | parametre_qualite | 182 |
| Cobalt(mg/l)) | parametre_qualite | 182 |
| SiO2(mg/l) | parametre_qualite | 182 |
| Aluminium(mg/l) | parametre_qualite | 182 |
| Manganèse(mg/l) | parametre_qualite | 182 |
| Fer(mg/l) | parametre_qualite | 182 |
| Beryllium(mg/l) | parametre_qualite | 182 |
| Bore(mg/l) | parametre_qualite | 182 |
| Chrome(mg/l) | parametre_qualite | 182 |
| Plomb(mg/l) | parametre_qualite | 182 |
| Conductivitéà20°C(µs/cm) | parametre_qualite | 182 |
| DisquedeSecchi(m) | parametre_qualite | 182 |
| Sélénium(mg/l) | parametre_qualite | 182 |
| O2dissous(mgd'O2/l) | parametre_qualite | 182 |
| Cl-(mg/l) | parametre_qualite | 182 |
| SO4(mg/l) | parametre_qualite | 182 |
| NO3-(mg/l) | parametre_qualite | 182 |
| CF(UFC/100mL) | parametre_qualite | 182 |
| Ferdissous(mg/l) | parametre_qualite | 182 |
| Cuivre(mg/l) | parametre_qualite | 182 |
| Zinc(mg/l) | parametre_qualite | 182 |
| Cadmium(mg/l) | parametre_qualite | 182 |
| Molybdène(mg/l) | parametre_qualite | 182 |
| Arsenic(mg/l) | parametre_qualite | 182 |
| T_air | parametre_qualite | 182 |
| Mercure(mg/l) | parametre_qualite | 182 |
| Vanadium(mg/l) | parametre_qualite | 182 |
| F-(mg/l) | parametre_qualite | 181 |
| CN(mg/l) | parametre_qualite | 179 |

## 4. Analyse qualité
- Valeurs nulles détectées : `3579`
- Valeurs non numériques détectées : `0`
- Valeurs négatives détectées : `0`
- Unités observées : `à confirmer`
- Exemples : `13 | 13.7 | 8.6`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `39`
- Lignes décision migration `42` associées par paramètre : `60`
- Cas de validation `44` associés par paramètre : `44`
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
