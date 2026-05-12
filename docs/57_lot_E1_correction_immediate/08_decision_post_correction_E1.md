# Decision post correction E1

## Statut

**E1_BLOQUE**

## Justification

- rollback `qualite.mesure_qualite_sebou` execute : `oui`
- lignes supprimees : `90401`
- volume `qualite.mesure_qualite_sebou` apres rollback : `10955`
- volume attendu : `51402`
- `hydro.mesure_debit_source` conserve : `oui`
- volume `hydro.mesure_debit_source` : `3978`

## Conclusion

Le rollback cible a corrige la duplication E1 mais a supprime au-dela du perimetre attendu.
Le systeme n'est donc pas pret pour `E1.1` tant que :

1. `qualite.mesure_qualite_sebou` n'est pas restauree ou reconstituee correctement ;
2. l'audit de chargement n'est pas re-concu autour d'une cle stable ;
3. les branches `ctid-based` ne sont pas rejouees avec une cle source metier.
