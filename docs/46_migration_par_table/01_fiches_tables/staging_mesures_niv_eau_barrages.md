# Fiche table - staging.mesures_niv_eau_barrages

## 1. Identification
- Schéma : `staging`
- Table : `mesures_niv_eau_barrages`
- Statut : `PENDING`
- Priorité : `Élevée`
- Volume source : `85166` lignes
- Script SQL en attente : `../sql_en_attente/staging_mesures_niv_eau_barrages.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `aucune`
- Colonnes valeurs : `niveau_eau_m_ngm, volume_mm3, restitutions_mm3, transfert_mm3, apports_mm3`
- Colonnes dates : `date_jr`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `5`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| niveau_eau_m_ngm | colonne_large | 85166 |
| volume_mm3 | colonne_large | 85166 |
| restitutions_mm3 | colonne_large | 85166 |
| transfert_mm3 | colonne_large | 85166 |
| apports_mm3 | colonne_large | 85166 |

## 4. Analyse qualité
- Valeurs nulles détectées : `151930`
- Valeurs non numériques détectées : `0`
- Valeurs négatives détectées : `0`
- Unités observées : `à confirmer`
- Exemples : `111.8 | 111.89 | 111.95 | 0 | 1.3886 | 0.9316 | 0.9416 | 1.16`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `0`
- Lignes décision migration `42` associées par paramètre : `6`
- Cas de validation `44` associés par paramètre : `5`
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
