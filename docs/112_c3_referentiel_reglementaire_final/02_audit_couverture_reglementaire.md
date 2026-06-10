# Audit couverture reglementaire

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | audit BD |
| Source de verite | Oui |
| Date | 2026-06-04 |

## Requetes SQL utilisees

```sql
SELECT count(*) FROM metadata.qualite_parametre_reglementaire WHERE actif = true AND classifiable IS true;
SELECT count(*) FROM metadata.qualite_parametre_reglementaire WHERE actif = true AND classifiable IS false;
SELECT count(*) FROM metadata.qualite_mapping_canonique_reglementaire WHERE actif = true;
SELECT count(*) FROM metadata.qualite_seuil_reglementaire WHERE actif = true;

SELECT code_type_eau, count(*)
FROM metadata.qualite_type_eau
WHERE actif = true
GROUP BY code_type_eau
ORDER BY code_type_eau;
```

## Couverture constatee

| Indicateur | Resultat |
|---|---:|
| Parametres reglementaires actifs | `41` |
| Parametres classifiables actifs | `36` |
| Parametres non classifiables actifs | `5` |
| Mappings actifs | `36` |
| Seuils actifs | `177` |

## Lecture

- la couverture classifiante active repose sur `36` parametres ;
- `5` parametres sont explicitement observationnels/non classifiables ;
- le referentiel est donc charge et exploitable, mais pas exhaustif sur tous les types d'eau documentaires ;
- un seul type d'eau est operationnel au runtime PREPROD : `surface_generale`.

## Conclusion

Le chantier `C3` couvre reellement le socle operationnel du Tableau n°1 pour `surface_generale`, avec un moteur actif et un perimetre volontairement borne.
