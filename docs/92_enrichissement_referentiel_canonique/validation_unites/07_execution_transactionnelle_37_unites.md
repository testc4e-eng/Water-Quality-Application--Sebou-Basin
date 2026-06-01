# Execution transactionnelle - 37 unites validees

## Statut

`UNITES_REFERENTIEL_37_VALIDEES_APPLIQUEES`

## Execution

| Element | Resultat |
|---|---|
| Date | `2026-05-12` |
| Table cible | `metadata.referentiel_parametre_canonique` |
| Champ modifie | `unite_reference` uniquement |
| Lignes mises a jour | `37` |
| Backup logique | `audit.bkp_ref_unites_37_validees_20260512` |
| Lignes backup | `37` |
| Commit | oui |

## Controles post-commit

| Controle | Resultat |
|---|---|
| Parametres valides encore sans unite | `0` |
| Doublons `code_parametre` crees | `0` |
| `FM` modifie | non |
| `F_M_MES` modifie | non |
| `MD` modifie | non |
| Tables qualite modifiees par le script | non |

## Residuel

- `FM` : `CLIENT_REQUIRED`
- `F_M_MES` : `CLIENT_REQUIRED`
- `MD` : `CLIENT_REQUIRED` documentaire ; aucune ligne active retrouvee dans le controle canonique de cette execution.
