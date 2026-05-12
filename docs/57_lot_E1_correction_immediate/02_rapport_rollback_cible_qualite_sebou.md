# Rapport rollback cible qualite sebour

## Execution

- rollback cible execute : `oui`
- table touchee : `qualite.mesure_qualite_sebou`
- run_id reference : `f0f2a858-1c90-4b15-a6af-cc172bece071`
- lignes attendues a supprimer : `49954`
- lignes effectivement supprimees : `90401`

## Conclusion

Le rollback a bien retire les lignes E1 de `qualite.mesure_qualite_sebou`, mais il a egalement supprime des lignes historiques non ciblees.

## Cause racine immediate

L'audit `qa_dry_run.e1_insert_audit` stockait uniquement `ctid`.
Sur `qualite.mesure_qualite_sebou`, `ctid` n'etait pas un identifiant globalement fiable pour un rollback, car :

- `49954` lignes auditees ne representent que `1089` `ctid` distincts ;
- plusieurs `ctid` sont repetes massivement dans l'audit ;
- un `DELETE ... WHERE t.ctid = a.row_ctid::tid` a donc supprime plus que le sous-ensemble voulu.

## Preuve

Le nombre de `ctid` distincts dans l'audit est insuffisant pour identifier univoquement les lignes chargees.
