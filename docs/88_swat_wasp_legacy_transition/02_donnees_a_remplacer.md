# Donnees a remplacer

## Objets concernes

| Schema | Objets | Remplacement attendu |
|---|---|---|
| `swat_output` | mesures, staging, references scenario/run | nouveaux exports SWAT client |
| `wasp_output` | mesures, staging, references scenario/run/segment | nouveaux exports WASP client |
| `swat_sebou` | scenarios/resultats historiques si utilises | alignement avec nouveau modele cible |
| `wasp_sebou` | scenarios/resultats historiques si utilises | alignement avec nouveau modele cible |

## Regle

Ne pas supprimer maintenant.

Toute suppression/remplacement futur doit suivre :

- backup complet
- plan SQL explicite
- validation volumetrique
- controle doublons
- controle scenarios
- rollback
- audit ingestion

