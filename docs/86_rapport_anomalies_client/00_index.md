# Rapport anomalies client

## Objet

Ce dossier separe les anomalies restantes apres cloture technique `FINAL_GO_AVEC_BACKLOG`.

Objectif : distinguer ce qui releve de C4E, ce qui necessite arbitrage client, ce qui est hors perimetre migration, et ce qui doit etre ignore comme legacy.

## Classification

| Classe | Definition |
|---|---|
| `TRAITABLE_C4E` | correction documentaire, referentielle, QA ou mapping realisable par C4E sans nouvel arbitrage metier client |
| `CLIENT_REQUIRED` | donnees, arbitrages ou confirmations attendus du client |
| `HORS_PERIMETRE_MIGRATION` | sujet utile mais non requis pour cloturer la migration client |
| `LEGACY_IGNORE` | objet historique non reference de production |
| `LEGACY_MODELING_TO_REPLACE` | donnees modelisation temporaires a remplacer |
| `BACKLOG_TECHNIQUE` | dette technique non bloquante |

## Livrables

| Fichier | Role |
|---|---|
| `01_anomalies_traitables_C4E.md` | anomalies traitables par C4E |
| `02_anomalies_a_transmettre_client.md` | anomalies necessitant retour client |
| `03_hors_perimetre_migration.md` | anomalies hors perimetre migration client |
| `04_impact_metier.md` | impacts par domaine |
| `05_plan_action.md` | actions, priorites et delais proposes |
| `06_synthese_client.md` | synthese courte client |

## Conclusion

Anomalies bloquantes : aucune.

