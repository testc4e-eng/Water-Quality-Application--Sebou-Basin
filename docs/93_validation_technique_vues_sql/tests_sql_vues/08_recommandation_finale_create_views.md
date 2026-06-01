# Recommandation finale create views

| Action | Decision |
|---|---|
| `CREATE VIEW` reel | `GO_TECHNIQUE_SOUS_VALIDATION_EXPLICITE` |
| `UPDATE table_cible` | `HOLD_APRES_CREATE_VIEW` |
| API FastAPI | `HOLD` |
| Frontend | `HOLD` |

## Justification

- Les 19 vues compilent en transaction.
- Les counts sont coherents.
- Les colonnes communes obligatoires sont presentes.
- Les regles metier critiques sont respectees apres correction du mapping FK/canonique.
- Le rollback a ete execute.
- Aucune creation durable n'a ete faite.

## Conditions avant execution durable

1. Executer uniquement le script corrige `06_sql_vues_corrigees_VALIDATION_REQUISE.sql`.
2. Garder `UPDATE table_cible` en `HOLD`.
3. Rejouer les validations post-creation.
4. Ne pas modifier les tables de mesures.
5. Ne pas modifier le referentiel.

## Statut final

`SQL_VUES_SPECIALISEES_VALIDE_TECHNIQUEMENT_ROLLBACK`
