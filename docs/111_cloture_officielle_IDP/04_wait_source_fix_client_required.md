# Wait source fix client required

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | anomalie client requise |
| Source de verite | Oui |
| Date | 2026-06-04 |

## Objet

Ce document formalise le bloc :

```text
WAIT_SOURCE_FIX = CLIENT_REQUIRED_DATA_FIX
```

## Preuves BD

### Requetes SQL

```sql
SELECT count(*)
FROM qa.spatial_identity_orphans
WHERE review_status = 'PENDING'
  AND recommended_action = 'WAIT_SOURCE_FIX';

SELECT count(*)
FROM qa.spatial_identity_orphans
WHERE review_status = 'PENDING'
  AND source_geom IS NULL;

SELECT count(*)
FROM qa.spatial_identity_orphans
WHERE review_status = 'PENDING'
  AND COALESCE(source_commune, '') = '';
```

### Resultats

| Controle | Resultat |
|---|---:|
| `WAIT_SOURCE_FIX` | `488` |
| Sans geometrie | `488` |
| Commune absente/vide | `488` |

## Interpretation

Ces objets sont :

- sans geometrie exploitable ;
- sans commune exploitable ;
- non arbitrables spatialement ;
- hors capacite de resolution C4E sans correction source.

## Regles d'exclusion

Ces objets doivent etre exclus de :

- API ;
- dashboards ;
- KPI ;
- analyses ;
- IA ;
- ML ;
- feature store ;
- propagation.

Ils doivent rester uniquement :

- historises ;
- traces ;
- documentes ;
- exportables pour le rapport client.

## Tableau de synthese rapport client

| Bloc | Volume | Geometrie | Commune | Arbitrage spatial | Statut |
|---|---:|---|---|---|---|
| `WAIT_SOURCE_FIX` | `488` | absente | absente/vide | impossible | `CLIENT_REQUIRED_DATA_FIX` |

## Conclusion

Le bloc `WAIT_SOURCE_FIX` ne releve pas d'un arbitrage spatial metier restant. Il releve d'une correction de donnees source cote client.
