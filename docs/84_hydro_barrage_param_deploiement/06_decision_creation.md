# Decision creation Phase 2

## Context

La Phase 2 devait creer uniquement la structure de `hydro.mesure_barrage_param`.

Contraintes d'execution :

- aucune insertion
- aucun chargement
- aucun `TRUNCATE`
- aucun `DELETE`
- aucun `UPDATE` metier
- aucune modification de `hydro.mesure_barrage`
- aucune modification de `hydro.mesure_debit`
- aucune modification de `qualite.*`
- aucune modification de `meteo.*`
- aucune modification de `staging.*`

## Analysis

Execution realisee :

- `CREATE TABLE IF NOT EXISTS hydro.mesure_barrage_param`
- creation des contraintes cible
- creation des index cible
- creation des commentaires cible

Resultats :

| Statut | Resultat |
|---|---|
| table creee | oui |
| volume initial | 0 |
| contraintes creees | 8 |
| index crees | 6 |
| donnees inserees | non |
| legacy `hydro.mesure_barrage` touche | non |
| tables metier hors cible touchees | non |

## Solution

Decision :

- `PARAM_TABLE_CREATED`

Motif :

- la table cible existe avec la structure minimale demandee
- les contraintes bloquent les codes hors referentiel barrage
- les contraintes bloquent les unites incoherentes
- `target_business_key_hash` est unique
- `valeur` est contrainte a `>= 0`
- les index requis sont presents
- le volume cible reste `0`

Rollback documente, non execute :

```sql
-- A utiliser uniquement avant Phase 3 si la creation structurelle doit etre annulee.
-- Ne pas executer apres chargement sans backup et validation explicite.
DROP TABLE IF EXISTS hydro.mesure_barrage_param;
```

## Optional improvements

Phase suivante possible apres validation :

- Phase 3 : preparation de la normalisation depuis `staging.raw_mesures_niv_eau_barrages`
- aucune insertion reelle tant que la sortie Phase 3 n'est pas `NORMALISATION_OK`
