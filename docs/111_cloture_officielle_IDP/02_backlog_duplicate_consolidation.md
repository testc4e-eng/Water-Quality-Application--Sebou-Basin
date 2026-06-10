# Backlog IDP duplicate consolidation

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | backlog technique |
| Source de verite | Oui |
| Date | 2026-06-04 |

## Objet

Ce document formalise le backlog :

```text
IDP_DUPLICATE_CONSOLIDATION
```

## Volume verifie

### Requete SQL

```sql
SELECT count(*)
FROM qa.spatial_identity_conflicts
WHERE conflict_type = 'DUPLICATE_EXACT';

SELECT source_schema || '.' || source_table AS source_layer, count(*)
FROM qa.spatial_identity_conflicts
WHERE conflict_type = 'DUPLICATE_EXACT'
GROUP BY source_schema, source_table
ORDER BY count(*) DESC
LIMIT 8;
```

### Resultat

- `14239` lignes `DUPLICATE_EXACT`

Provenance principale :

| Source | Volume |
|---|---:|
| `staging.raw_idp_mesures_qualite_globale_2024` | `4619` |
| `staging.raw_idp_mesures_qualite_marche_cadre_2024` | `3614` |
| `staging.raw_idp_src_pollution_marche_cadre` | `3614` |
| `infra.huilerie_inventaire_pollution` | `585` |
| `infra.huilerie` | `476` |
| `infra.rejet_domestique` | `273` |
| `infra.rejet_inventaire_pollution` | `270` |
| `staging.raw_idp_src_pollution_globale` | `207` |

## Nature du risque

### Risque operationnel immediat

Faible.

Le runtime metier principal ne consomme pas directement `qa.spatial_identity_conflicts`.

### Risque analytique

Reel si ces doublons sont reutilises hors couche maitre :

- doubles comptages ;
- inflation de volumetrie ;
- biais de tendances ;
- bruit dans les analyses spatiales et les reporting internes.

### Risque ML / IA

Reel si ces objets sont injectes sans deduplication dans :

- datasets d'entrainement ;
- feature store ;
- scoring ;
- benchmarks ;
- futures analyses graph.

## Strategie cible

### 1. Fusion logique

- identifier les groupes de doublons exacts ;
- conserver un seul enregistrement de reference ;
- maintenir le lineage source -> pivot.

### 2. Archivage

- conserver les identifiants source historiques ;
- tracer les consolidations dans une table d'historique ou de merge ;
- ne pas detruire la preuve de provenance.

### 3. Deduplication exploitable

- exclure les doublons des couches analytiques et ML ;
- produire une vue dedoublonnee de consommation ;
- garder les tables sources intactes.

## Classification

```text
BACKLOG_TECHNIQUE
```

## Conclusion

`IDP_DUPLICATE_CONSOLIDATION` ne bloque pas la preproduction du lot `C1-B`, mais reste un chantier interne necessaire pour l'hygiene analytique et ML.
