# Points à valider avant exécution

## Décisions bloquantes
- confirmer que `abh_sebou_ismail` est la source brute officielle unique ;
- valider la liste des tables `abh_sad` à sauvegarder puis vider ;
- valider les tables à ne pas toucher : sécurité, logs, géométrie, PostGIS ;
- valider les tables source à importer en staging ;
- valider le référentiel paramètres cible ;
- valider les règles QA et parsing ;
- valider le traitement des valeurs non numériques et limites de détection ;
- valider les unités de référence ;
- confirmer la stratégie des données température ;
- arbitrer l’usage complémentaire de SWAT/WASP.

## Sources complémentaires
| Source | Statut | Décision attendue |
|---|---|---|
| `backend/data/uploads/SWATOutput.mdb` | source complémentaire détectée, à valider | confirmer inclusion ou exclusion du périmètre migration |
| `backend/data/uploads/Data_Results_WASP.xlsx` | source complémentaire détectée, à valider | confirmer inclusion ou exclusion du périmètre migration |
| `CSV température` | non trouvé dans le dépôt hors archives, à fournir ou confirmer | confirmer inclusion ou exclusion du périmètre migration |
