# Fiche table - meteo.mesure_precipitation_annuelle_max

## 1. Identification
- Schéma : `meteo`
- Table : `mesure_precipitation_annuelle_max`
- Statut : `PENDING`
- Priorité : `Moyenne`
- Volume source : `2085` lignes
- Script SQL en attente : `../sql_en_attente/meteo_mesure_precipitation_annuelle_max.sql`

## 2. Colonnes détectées
- Colonnes paramètres : `aucune`
- Colonnes valeurs : `aucune`
- Colonnes dates : `annee, date_jr, nb_mois, created_at, annee_civile, annee_hydrologique_calculee, annee_hydrologique_debut_mois`
- Colonnes unités : `aucune`

## 3. Paramètres distincts
- Nombre détecté : `0`

| Paramètre / variable | Source détection | Volume indicatif |
|---|---|---:|
| à confirmer | aucune colonne paramètre détectée | 0 |

## 4. Analyse qualité
- Valeurs nulles détectées : `0`
- Valeurs non numériques détectées : `0`
- Valeurs négatives détectées : `0`
- Unités observées : `à confirmer`
- Exemples : `à confirmer`

## 5. Croisement avec les audits existants
- Lignes inventaire `39` associées : `2`
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
