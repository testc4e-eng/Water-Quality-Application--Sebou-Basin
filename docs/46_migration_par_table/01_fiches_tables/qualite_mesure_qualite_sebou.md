# Fiche table - qualite.mesure_qualite_sebou

## 1. Identification
- Schéma : `qualite`
- Table : `mesure_qualite_sebou`
- Statut : `PENDING`
- Priorité : `Critique`
- Volume source : `51402` lignes
- Script SQL en attente : `../sql_en_attente/qualite_mesure_qualite_sebou.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `parametre_qualite`
- Colonnes valeurs : `valeur`
- Colonnes dates : `temps, pas_temps, qa_checked_at, created_at`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `13`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| Conductivité | parametre_qualite | 3954 |
| Turbidité | parametre_qualite | 3954 |
| Nitrates | parametre_qualite | 3954 |
| pH | parametre_qualite | 3954 |
| T_air | parametre_qualite | 3954 |
| NTK | parametre_qualite | 3954 |
| Ammonium | parametre_qualite | 3954 |
| H_G | parametre_qualite | 3954 |
| Phenol | parametre_qualite | 3954 |
| T_eau | parametre_qualite | 3954 |
| DBO5 | parametre_qualite | 3954 |
| DCO | parametre_qualite | 3954 |
| O2_dissous | parametre_qualite | 3954 |

## 4. Analyse qualité
- Valeurs nulles détectées : `9645`
- Valeurs non numériques détectées : `0`
- Valeurs négatives détectées : `0`
- Unités observées : `à confirmer`
- Exemples : `18.6 | 18.5 | 18.3`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `13`
- Lignes décision migration `42` associées par paramètre : `52`
- Cas de validation `44` associés par paramètre : `24`
- Problèmes détectés : `mapping ambigu ou absent, unités à valider, valeurs nulles`

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
