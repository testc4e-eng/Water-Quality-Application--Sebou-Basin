# Audit temporalité réelle

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | audit documentaire + SQL read-only |
| Périmètre | météo, hydro, qualité, pollution, SWAT, WASP |
| Source de vérité | Oui pour la phase temporalité |
| Dernière mise à jour | 2026-05-14 |

## Objectif

Préparer un audit réel de temporalité et de fraîcheur permettant de calculer automatiquement :

| Table | date_min | date_max | fréquence | trous | dernière valeur | fraîcheur réelle | volumétrie récente |
|---|---|---|---|---|---|---|---|

## Livrables

1. [01_synthese_temporalite.md](./01_synthese_temporalite.md)
2. [02_sql_read_only_audit_temporalite.md](./02_sql_read_only_audit_temporalite.md)
3. [03_recommandations_cache_pagination_partitionnement.md](./03_recommandations_cache_pagination_partitionnement.md)
4. [04_risques_readiness_checklist.md](./04_risques_readiness_checklist.md)

## Contraintes

- aucune modification BD ;
- aucune vue créée ;
- aucune exécution DML ;
- SQL fourni à titre read-only uniquement.
