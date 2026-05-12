# Fiche table - staging.mesures_evaporation_jr

## 1. Identification
- Schéma : `staging`
- Table : `mesures_evaporation_jr`
- Statut : `PENDING`
- Priorité : `Élevée`
- Volume source : `48900` lignes
- Script SQL en attente : `../sql_en_attente/staging_mesures_evaporation_jr.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `aucune`
- Colonnes valeurs : `val_evaporation`
- Colonnes dates : `date_mesure`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `1`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| val_evaporation | colonne_large | 48900 |

## 4. Analyse qualité
- Valeurs nulles détectées : `10308`
- Valeurs non numériques détectées : `0`
- Valeurs négatives détectées : `0`
- Unités observées : `à confirmer`
- Exemples : `1.73 | 4.78 | 4.61`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `0`
- Lignes décision migration `42` associées par paramètre : `1`
- Cas de validation `44` associés par paramètre : `1`
- Problèmes détectés : `unités à valider, valeurs nulles`

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
