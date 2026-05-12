# Fiche table - hydro.barrage_bathymetrie

## 1. Identification
- Schéma : `hydro`
- Table : `barrage_bathymetrie`
- Statut : `PENDING`
- Priorité : `Moyenne`
- Volume source : `62359` lignes
- Script SQL en attente : `../sql_en_attente/hydro_barrage_bathymetrie.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `aucune`
- Colonnes valeurs : `volume_mm3`
- Colonnes dates : `aucune`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `1`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| volume_mm3 | colonne_large | 62359 |

## 4. Analyse qualité
- Valeurs nulles détectées : `0`
- Valeurs non numériques détectées : `0`
- Valeurs négatives détectées : `0`
- Unités observées : `à confirmer`
- Exemples : `0 | 0.01274 | 0.02548`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `2`
- Lignes décision migration `42` associées par paramètre : `2`
- Cas de validation `44` associés par paramètre : `1`
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
