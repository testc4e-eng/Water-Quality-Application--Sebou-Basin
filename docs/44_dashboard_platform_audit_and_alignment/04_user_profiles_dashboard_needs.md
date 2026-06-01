# Profils utilisateurs et besoins dashboards

## DG / Direction
| Besoin | Dashboard cible | Indicateurs |
|---|---|---|
| Vision synthétique bassin | Dashboard Direction | qualité globale, alertes, stations à risque |
| Risques majeurs | Dashboard Direction | dépassements actifs, zones sensibles |
| État du projet | Dashboard Direction | qualité PREPROD conditionnelle, température commitée, hydraulique non validée |
| Arbitrages bloquants | Dashboard Direction | hydraulique, identité spatiale, statuts QA |

## Équipe métier qualité eau
| Besoin | Dashboard cible | Indicateurs |
|---|---|---|
| Classification réglementaire | Qualité Réglementaire | classe par paramètre/station |
| Paramètres classifiables | Qualité Réglementaire | 36 actifs |
| Paramètres non classifiables | Qualité Réglementaire | statuts explicites |
| Seuils actifs/inactifs | Référentiel/Admin | 177 actifs, 28 exclus |
| Historique qualité | Qualité / Observatoire | séries par station et paramètre |

## Équipe hydrologie
| Besoin | Dashboard cible | Indicateurs |
|---|---|---|
| Réseau topologique | Hydraulique QA | 728 segments |
| Validation direction | Hydraulique QA | 508 confirmés, 139 suspects, 81 plats |
| MNT | Hydraulique QA | raster `seboureproj` |
| Routage | Pollution/Hydraulique | marqué topologique tant que non validé |

## Équipe data / dev
| Besoin | Dashboard cible | Indicateurs |
|---|---|---|
| Batchs et lineage | Admin Data | batch température, import IDP |
| API health | Admin Data | health, endpoints clés |
| QA | Admin Data | anomalies, tables vides, vues coûteuses |
| Référentiels | Admin Data | version réglementaire, seuils actifs/inactifs |

## Utilisateur simple / consultation
| Besoin | Dashboard cible | Indicateurs |
|---|---|---|
| Carte claire | Dashboard Cartographique Métier | supports métier, filtres limités |
| Légende simple | Dashboard Cartographique Métier | classes qualité + non classifiable |
| Popup compréhensible | Dashboard Cartographique Métier | valeur, date, classe, statut |
| Pas de jargon QA | Dashboard Consultation | uniquement statuts vulgarisés |
