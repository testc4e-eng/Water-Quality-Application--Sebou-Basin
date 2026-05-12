# Index — données problématiques par bloc

| Bloc | Fichier | Anomalies sources | Entités détectées | Données BD inspectées | Priorité | Décision principale |
|---|---|---|---:|---|---|---|
| Paramètres | [01_donnees_problematiques_parametres.md](./01_donnees_problematiques_parametres.md) | A01, A02, A11, A13 | 19 | `qualite.*`, `metadata.referentiel_parametre`, `metadata.mapping_parametre_source`, `metadata.mapping_parametre_unresolved_*`, `staging.*qualite*` | Critique | figer le dictionnaire officiel des paramètres |
| Pollution | [02_donnees_problematiques_pollution.md](./02_donnees_problematiques_pollution.md) | A05, A06, A07 | 13 | `qualite.source_pollution_*`, `infra.rejet_*`, `infra.*inventaire_pollution*`, `staging.rejets_brutes`, `staging.rejet_abattoir` | Critique | valider le référentiel officiel des rejets et le traitement des cas non rattachés |
| Données | [03_donnees_problematiques_donnees.md](./03_donnees_problematiques_donnees.md) | A08, A09, A10, A14 | 13 | `qualite.*`, `meteo.*`, `hydro.mesure_debit`, `hydro.mesure_debit_mensuel` | Critique | décider quelles données sont exploitables, partielles ou à exclure |
| Référentiels | [04_donnees_problematiques_referentiels.md](./04_donnees_problematiques_referentiels.md) | A04, A12, A15 | 12 | `infra.stations_mesure`, `infra.barrages`, `metadata.mapping_*`, `staging.*` | Élevée | figer les référentiels stations / barrages et la hiérarchie des sources |

## Synthèse des extractions

| Catégorie | Nombre |
|---|---:|
| Paramètres ambigus | 2 |
| Paramètres non standardisés | 7 |
| Paramètres non mappés | 31 |
| Unités absentes / incohérentes | 7 |
| Rejets problématiques | 26 |
| Sources pollution non rattachées | 26 |
| Données nulles | 27 111 |
| Valeurs extrêmes / négatives | 1 933 |
| Stations / barrages problématiques | 22 |
| Données absentes | 1 |

## Notes de lecture

- Tous les chiffres ci-dessus proviennent soit d'une requête SQL en lecture seule, soit d'une fiche documentaire citée.
- La catégorie "paramètres non mappés" regroupe les paramètres présents dans les tables d'écarts `metadata.mapping_parametre_unresolved_*`.
- La catégorie "données absentes" correspond ici à la température, confirmée à `0` ligne dans `meteo.mesure_temperature`.
