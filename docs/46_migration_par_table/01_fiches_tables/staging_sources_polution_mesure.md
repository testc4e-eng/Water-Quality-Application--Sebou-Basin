# Fiche table - staging.sources_polution_mesure

## 1. Identification
- Schéma : `staging`
- Table : `sources_polution_mesure`
- Statut : `PENDING`
- Priorité : `Moyenne`
- Volume source : `141` lignes
- Script SQL en attente : `../sql_en_attente/staging_sources_polution_mesure.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `Parametre`
- Colonnes valeurs : `T_eau, pH, O2_Diss, DCO, DBO5`
- Colonnes dates : `Date_Recep, Date_de__p`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `6`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| - | Parametre | 82 |
| Rejet | Parametre | 31 |
| A-B-C-D | Parametre | 12 |
| ABCDHE | Parametre | 6 |
| A-B-C-D-H-E | Parametre | 6 |
| REJET | Parametre | 4 |

## 4. Analyse qualité
- Valeurs nulles détectées : `0`
- Valeurs non numériques détectées : `0`
- Valeurs négatives détectées : `0`
- Unités observées : `à confirmer`
- Exemples : `26.00000000000 | 0.00000000000 | 7.75000000000 | 0.11000000000 | 948.48000000000 | 341.62000000000`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `0`
- Lignes décision migration `42` associées par paramètre : `0`
- Cas de validation `44` associés par paramètre : `0`
- Problèmes détectés : `aucun problème critique détecté automatiquement`

## 6. Règles à appliquer
- parsing valeurs : appliquer seulement les règles validées dans `docs/42` et `docs/44`.
- conversion unités : aucune conversion automatique sans validation métier.
- règles métier validées : aucune règle n’est considérée validée tant que le statut de la table reste `PENDING`.
- staging : conservation brute obligatoire.

## 7. Proposition de migration contrôlée
- Action proposée : `valider la structure, exécuter un dry-run, puis migrer avec journalisation`
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
