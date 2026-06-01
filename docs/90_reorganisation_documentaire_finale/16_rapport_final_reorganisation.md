# Rapport final de réorganisation

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport de réorganisation documentaire |
| Source de vérité | Non - rapport d'audit et de consolidation |
| Date | 2026-05-22 |

## Synthèse

| Indicateur | Valeur |
|---|---|
| Documents analysés | 2144 |
| Documents textuels analysés | 2014 |
| Fichiers code/config analysés | 524 |
| Liens Markdown internes | 491 |
| Liens cassés détectés avant déplacement | 88 |
| Tables/vues BD inspectées | 339 |
| Colonnes BD inspectées | 4554 |
| Objets documentés mais absents | 579 |
| Objets présents mais peu/non référencés | 1 |
| Contradictions candidates | 5590 |
| Déplacements proposés | 97 |
| Déplacements exécutés lot A | 50 |
| Références mises à jour lot A | 216 |
| Documents historiques archivés lot A | 50 |
| Liens Markdown vérifiés après correction | 459 |
| Liens cassés résiduels | 61 |

## Confirmation sécurité

- Inspection BD en session read-only.
- Aucun `INSERT`, `UPDATE`, `DELETE`, `ALTER` ou `DROP`.
- Le lot A a été exécuté avec mapping et rapport de traçabilité.
- Les liens cassés liés aux fichiers déplacés ont été corrigés ; les 61 liens résiduels sont principalement des liens absolus historiques, `file:///` ou chemins externes conservés comme preuves.
- Les autres déplacements doivent être faits par lots avec mapping.

## Prochaine action recommandée

Traiter les contradictions critiques `public.*` et décider si le lot B des dossiers historiques doit être exécuté ou conservé en place avec index de redirection.
