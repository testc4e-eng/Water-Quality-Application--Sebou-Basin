# Synthèse temporalité réelle

## Contexte

La documentation actuelle consolide les volumétriques et les familles métier, mais pas encore les bornes temporelles réelles table par table. Cette phase prépare le calcul automatique sans modification de la base.

## Tables cibles à auditer

| Table | Domaine | Volume observé | Date min | Date max | Fréquence attendue | Trous attendus | Dernière valeur | Fraîcheur réelle | Volumétrie récente | Statut |
|---|---|---:|---|---|---|---|---|---|---|---|
| `meteo.mesure_precipitation` | météo | 546007 | à calculer | à calculer | journalière / station | oui possible | à calculer | à calculer | à calculer sur 30/90/365 jours | audit prioritaire |
| `meteo.mesure_evaporation` | météo | 48900 | à calculer | à calculer | journalière / station | oui possible | à calculer | à calculer | à calculer | audit prioritaire |
| `meteo.mesure_temperature` | météo | 0 | vide | vide | future | n/a | n/a | `PIPELINE_TO_IMPLEMENT` | 0 | source vide |
| `hydro.mesure_debit` | hydro | 521433 | à calculer | à calculer | journalière / sub-journalière selon station | oui possible | à calculer | à calculer | à calculer | audit prioritaire |
| `hydro.mesure_barrage_param` | hydro barrage | 272652 | à calculer | à calculer | journalière | oui possible par barrage / paramètre | à calculer | à calculer | à calculer | audit prioritaire |
| `qualite.mesure_qualite_riviere` | qualité | 60097 | à calculer | à calculer | campagne / séries irrégulières | oui | à calculer | à calculer | à calculer | audit prioritaire |
| `qualite.mesure_qualite_nappe` | qualité | 63088 | à calculer | à calculer | campagne / séries irrégulières | oui | à calculer | à calculer | à calculer | audit prioritaire |
| `qualite.mesure_qualite_barrage` | qualité barrage | 15808 | à calculer | à calculer | campagne / historique | oui | à calculer | à calculer | à calculer | audit prioritaire |
| `qualite.mesure_qualite_sebou` | qualité | 51402 | à calculer | à calculer | campagne / suivi | oui | à calculer | à calculer | à calculer | audit prioritaire |
| `qualite.suivi_qualite_barrage_garde_hebdo` | qualité barrage | 7094 | à calculer | à calculer | hebdomadaire | oui | à calculer | à calculer | à calculer | audit prioritaire |
| `qualite.source_pollution_prelevement` | pollution / IDP | 141 | à calculer via `date_reception` / date métier | à calculer | ponctuelle | n/a | à calculer | à calculer | à calculer | audit métier |
| `qualite.source_pollution_mesure_param` | pollution / IDP | 7191 | à calculer via jointure prélèvement | à calculer | ponctuelle | n/a | à calculer | à calculer | à calculer | audit métier |
| `swat_output.*` | SWAT | non consolidé ici | à calculer | à calculer | par run / scénario | n/a | à calculer | à calculer | à calculer | audit architecture |
| `wasp_output.*` / `wasp_sebou.wasp_results` | WASP | 931770 | à calculer | à calculer | par run / scénario / temps | oui possible | à calculer | à calculer | à calculer | audit prioritaire |

## Histogrammes temporels à produire

- par mois pour météo et hydro ;
- par année + trimestre pour qualité historique ;
- par campagne / lot pour pollution / IDP ;
- par scénario / run / pas de temps pour SWAT/WASP.

## Recommandation métier

- différencier `fraîcheur réelle observée` et `classe métier de fraîcheur` ;
- exposer la fraîcheur réelle au frontend sous forme de métadonnée de source ;
- calculer la volumétrie récente sur `30`, `90` et `365` jours ;
- identifier les tables réellement actives vs archives dormantes.
