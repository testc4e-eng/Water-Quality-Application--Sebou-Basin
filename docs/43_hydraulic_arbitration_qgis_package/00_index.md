# Package QGIS — Arbitrage hydraulique Sebou

## Statut
`GO_QGIS_HYDRAULIC_ARBITRATION_PACKAGE_READY`

## Objectif
Fournir un dossier prêt à transmettre à la collaboratrice pour valider visuellement les segments hydrauliques à arbitrer dans QGIS.

## Contenu principal
| Fichier | Rôle |
|---|---|
| 01_objectif_validation_hydraulique.md | Cadrage métier et scientifique |
| 02_tutoriel_qgis_collaboratrice.md | Guide pas à pas QGIS |
| 03_grille_arbitrage_hydraulique.md | Dictionnaire de la grille de décision |
| 04_legende_et_styles_qgis.md | Couleurs et styles à utiliser |
| 05_procedure_traitement_segments_suspects.md | Méthode pour les 139 inversions suspectées |
| 06_procedure_traitement_segments_plats.md | Méthode pour les 81 segments plats |
| 07_checklist_validation_finale.md | Checklist de retour |
| 08_questions_metier_a_remonter.md | Questions à escalader |
| 09_rapport_preparation_package.md | Rapport de préparation |

## Dossier QGIS
| Dossier | Contenu |
|---|---|
| qgis/project | Projet QGIS `hydraulic_arbitration_sebou.qgz` |
| qgis/exports | GeoPackage principal, CSV et SQL A_VALIDER |
| qgis/layers | Exports GeoJSON par couche |
| qgis/styles | Styles QGIS `.qml` |
| qgis/hydraulic_arbitration_package_portable | Package portable corrige pour transmission poste a poste |
| qgis/screenshots | Captures éventuelles après revue |

## Volumes à traiter
| Classe | Nombre |
|---|---:|
| Inversions suspectées | 139 |
| Segments plats | 81 |
| Total arbitrage humain | 220 |

## Rappel critique
Le réseau n'est pas hydrauliquement validé. Le moteur reste `hydraulic_direction_validated=false` jusqu'à la fin de la revue et validation des décisions.

## Mise a jour 2026-06-01

Un package portable corrige a ete cree pour eliminer :

- le chemin absolu du MNT ;
- le mauvais etiquetage SCR du GeoPackage source (`EPSG:4326` au lieu du SCR reel des vecteurs) ;
- tout risque de reference a `SebouReproj.ovr`.

Artefacts a transmettre en priorite :

- `qgis/hydraulic_arbitration_package_portable/project/hydraulic_arbitration_sebou_portable.qgz`
- `qgis/hydraulic_arbitration_package_portable/README_OUVERTURE_QGIS.md`
- `qgis/hydraulic_arbitration_package_portable/00_controle_package.md`
