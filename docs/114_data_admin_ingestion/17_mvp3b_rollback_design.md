# Design MVP3-B — Rollback logique prepare, non active

| Champ | Valeur |
|---|---|
| Statut | Preparation |
| Type | design |
| Perimetre | rollback logique module 114 |
| Date | 2026-06-05 |

## Objectif

Preparer un rollback logique des promotions `data_admin` sans activer de suppression, `UPSERT`, `UPDATE_EXISTING` ou rollback automatique sur les tables metier.

Le design doit permettre de :

- savoir si une demande est techniquement reversionnable ;
- relier une promotion appliquee a ses preuves d'ecriture ;
- preparer un futur rollback gouverne sans casser la traçabilite.

## Portee

Le design cible uniquement :

- `data_admin.change_request`
- `data_admin.change_request_item`
- `data_admin.promotion_audit_log`

Il n'introduit pas encore :

- suppression automatique des lignes metier ;
- annulation transactionnelle tardive ;
- rollback massique multi-runs ;
- support `UPDATE_EXISTING` ou `UPSERT`.

## Colonnes recommandees

Preparation pour une future evolution SQL idempotente :

### `data_admin.change_request`

- `rollback_available boolean`
- `rollback_status text`
- `rollback_reference jsonb`

### Semantique

- `rollback_available`
  - `true` si toutes les lignes appliquees peuvent etre identifiees de maniere univoque
  - `false` sinon
- `rollback_status`
  - `NOT_PREPARED`
  - `READY`
  - `REQUESTED`
  - `APPROVED`
  - `APPLIED`
  - `FAILED`
- `rollback_reference`
  - clefs appliquees
  - preuves d'audit
  - classe cible
  - mode de reversion prevu

## Regle de gouvernance

Un rollback futur ne devra etre autorise que si :

1. `change_request.request_status = APPLIED`
2. `promotion_mode = INSERT_ONLY`
3. chaque `change_request_item` applique porte une cle metier re-identifiable
4. l'audit log contient la preuve complete de l'insertion
5. une approbation dediee de rollback est obtenue

## Strategie recommandee

Pour `INSERT_ONLY`, la strategie la plus sure reste :

1. identifier les lignes metier appliquees par les cles capturees dans `target_pk`
2. verifier qu'aucune ecriture ulterieure legitime ne depend de ces lignes
3. executer un rollback gouverne et audite
4. marquer la demande et son rollback dans `promotion_audit_log`

## Limites connues

- une cle logique faible peut rendre le rollback risqué ;
- un doublon historique ou une modification externe post-promotion peut rendre la reversion non deterministe ;
- sans RBAC cible complet, un rollback automatique serait premature.

## Decision

```text
ROLLBACK_LOGIQUE = DESIGN_READY_NOT_ACTIVE
```
