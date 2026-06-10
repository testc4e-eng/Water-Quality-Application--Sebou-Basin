# Workflow modification contrôlée

## Règle centrale

Le frontend ne modifie jamais directement une table métier.

## Workflow cible

```text
DRAFT
-> SUBMITTED
-> AUTO_VALIDATED
-> NEED_FIX | APPROVED | REJECTED
-> APPLIED
-> ROLLED_BACK
```

## Séquence

1. l’utilisateur propose une correction ;
2. le système crée une `change_request` ;
3. les validations automatiques s’exécutent ;
4. un rôle autorisé révise ;
5. l’application contrôlée exécute le changement ;
6. l’audit log capture avant/après ;
7. un rollback logique reste possible.
