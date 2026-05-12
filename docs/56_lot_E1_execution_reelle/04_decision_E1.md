# Decision E1

## Statut

**E1 EXECUTE - CORRECTION REQUISE**

## Regles respectees

- aucune insertion dans `infra.*`
- aucune insertion dans `geo.*`
- aucune insertion dans `metadata.*`
- aucune insertion dans les 4 tables `IDP 2024`
- rollback possible par `run_id` via `qa_dry_run.e1_insert_audit`

## Point critique

L'execution a introduit `49954` lignes dans `qualite.mesure_qualite_sebou`, ce qui cree `42052` doublons naturels sur la cle metier `(temps, station_id, parametre_qualite)` par rapport au contenu historique deja present.

## Recommandation immediate

- ne pas poursuivre `E1.1` ni un lot aval avant arbitrage
- decider soit un rollback cible de `qualite.mesure_qualite_sebou`, soit une strategie de dedoublonnage metier
- corriger la logique de relecture `E0` pour les tables ou `source_row_id` reference le `ctid` source
