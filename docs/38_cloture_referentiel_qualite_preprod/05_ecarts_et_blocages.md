# Ecarts et blocages restants

## Ecarts constatés
| Blocage | Niveau | Commentaire |
|---|---|---|
| Seuils actifs partiels | WARNING | 177 actifs / 205 chargés. Les 28 seuils inactifs sont à justifier explicitement avant GO complet. |
| Mappings actifs partiels | WARNING | 36 actifs / 41 mappings. Les non classifiables semblent conformes à la décision métier, mais doivent être acceptés pour préprod limitée. |
| Paramètres observationnels | INFO | 5 paramètres réglementaires sont observationnels non classifiables. |
| Contrat payload classify | WARNING | Le champ opérationnel est `type_eau`, pas `water_type`. A corriger dans les clients avant préproduction. |
| Température météo | INFO | `meteo.mesure_temperature` est vide ; les seuils température existent mais leur exploitation dépend des tables qualité/mesures disponibles. |


## Blocages préproduction
Aucun blocage bloquant au sens moteur indisponible. Le blocage restant est une validation de périmètre : accepter une préproduction limitée aux 36 paramètres classifiables et 177 seuils actifs, ou activer/justifier les 28 seuils restants.

## Risque principal
Passer en préproduction sans expliciter le périmètre actif peut créer une incompréhension métier : certains paramètres seront visibles mais non classifiables automatiquement.
