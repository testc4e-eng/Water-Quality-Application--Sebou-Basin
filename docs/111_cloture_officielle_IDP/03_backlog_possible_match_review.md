# Backlog IDP possible match review

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | backlog de revue |
| Source de verite | Oui |
| Date | 2026-06-04 |

## Objet

Ce document formalise le backlog :

```text
IDP_POSSIBLE_MATCH_REVIEW
```

## Volume verifie

### Requetes SQL

```sql
SELECT count(*)
FROM qa.spatial_identity_conflicts
WHERE conflict_type = 'POSSIBLE_MATCH';

SELECT
  CASE
    WHEN match_score >= 0.95 THEN '>=0.95'
    WHEN match_score >= 0.90 THEN '0.90-0.949'
    WHEN match_score >= 0.80 THEN '0.80-0.899'
    WHEN match_score >= 0.70 THEN '0.70-0.799'
    ELSE '<0.70'
  END AS score_bucket,
  count(*)
FROM qa.spatial_identity_conflicts
WHERE conflict_type = 'POSSIBLE_MATCH'
GROUP BY score_bucket
ORDER BY score_bucket;
```

### Resultats

- `124` lignes `POSSIBLE_MATCH`
- distribution de confiance observee :

| Bucket | Volume |
|---|---:|
| `0.70-0.799` | `124` |

## Interpretation

- niveau de confiance moyen ;
- besoin de revue complementaire ;
- pas de preuve que ce bloc remonte dans `qa.v_true_ambiguous_cases` comme residuel bloquant ;
- pas d'impact runtime direct sur les APIs pollution et les dashboards metier operationnels.

## Strategie de traitement

### 1. Echantillonnage

- tirer un echantillon representatif par source ;
- verifier la precision des scores ;
- ajuster la priorisation si un pattern source se confirme.

### 2. Revue metier

- traiter d'abord les groupes avec meilleure proximite et meilleur score ;
- documenter les decisions `ACCEPT_MATCH` ou `REJECT_MATCH` ;
- maintenir la reversibilite des choix.

### 3. Seuils de confiance

Seuils proposes pour gouvernance :

- `< 0.70` : rejet par defaut ou hold ;
- `0.70-0.85` : revue metier obligatoire ;
- `> 0.85` : priorite haute pour arbitrage rapide.

## Classification

```text
REVUE_COMPLEMENTAIRE
```

## Conclusion

```text
NON BLOQUANT PREPRODUCTION
```

Le backlog `IDP_POSSIBLE_MATCH_REVIEW` reste ouvert mais ne remet pas en cause la cloture du lot `C1-B`.
