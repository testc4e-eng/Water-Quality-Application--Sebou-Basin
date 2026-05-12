# Plan de migration depuis la source officielle

## Workflow cible
1. Backup complet de `abh_sad`.
2. Vidage contrôlé des données instables après validation.
3. Import brut depuis `abh_sebou_ismail` vers `staging` de `abh_sad`.
4. Mapping paramètres depuis référentiel validé.
5. Parsing des valeurs.
6. Validation des unités.
7. Contrôles QA.
8. Mise en quarantaine des anomalies.
9. Migration vers tables finales `qualite`, `hydro`, `meteo`.
10. Rapport de contrôle et journalisation.

## Règles de séparation
- `staging` garde les données brutes client.
- `metadata` porte les référentiels validés.
- `qualite`, `hydro`, `meteo` ne reçoivent que les données validées.
- `qa` garde les anomalies, quarantaines, logs et décisions.

## Interdictions
- aucune migration globale ;
- aucune écriture sans validation humaine ;
- aucun `DROP` ;
- aucun `DELETE` direct.
