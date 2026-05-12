# Impact metier

## Synthese impact

| Domaine | Impact | Niveau |
|---|---|---|
| Barrage | modele parametrique valide, unites physiques corrigees | faible |
| Hydrologie debit | valeurs negatives flaggees, filtrage QA recommande | moyen |
| Meteo | precipitation exploitable, evaporation avec lacunes | moyen |
| Qualite | exploitation possible, referentiel parametre incomplet | moyen |
| Pollution / IDP | valeurs non numeriques et mappings client a confirmer | moyen |
| GEO client | rattachements incomplets sur nappes/points/profils | moyen |
| SWAT/WASP | donnees temporaires a remplacer | hors perimetre client |

## Impacts dashboard

- Barrage : exploitable en production avec `NIVEAU_EAU`, `VOLUME`, `LACHER`, `APPORT`, `TRANSFERT`.
- Qualite : filtrer ou signaler les lignes sans `parametre_ref_id` pour les analyses fines.
- Meteo evaporation : filtrer les valeurs nulles ou afficher la couverture.
- Modeles : ne pas presenter SWAT/WASP actuels comme scenario final.

## Impacts IA/LLM

- Ne pas inferer de normes qualite sur parametres non rattaches.
- Ne pas deduire de tendances sur points GEO non resolus.
- Ne pas utiliser SWAT/WASP actuels pour conclusions client definitives.

