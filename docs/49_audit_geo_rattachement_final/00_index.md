# Index - audit geo rattachement final

## Synthese globale

| Indicateur | Valeur |
|---|---:|
| Entites geographiques | 79140 |
| Classes geographiques | 16 |
| Mesures/inventaires audites | 2169287 |
| Lignes rattachables | 2152678 |
| Lignes orphelines | 16609 |
| Taux global de rattachement | 99.23% |

## Decision

**GEO_BLOCKED**

## Fichiers

| Fichier | Contenu |
|---|---|
| `01_inventaire_entites_geographiques.md` | inventaire des tables geo et attributs minimaux |
| `02_classes_geographiques.csv` | synthese par classe geo |
| `03_rattachement_mesures_par_table.csv` | taux de rattachement par table source |
| `04_mesures_orphelines_detaillees.csv` | extrait detaille des lignes orphelines (jusqu'a 100 cas par table) |
| `05_doublons_et_ambiguites_geo.md` | doublons, homonymes et proximites suspectes |
| `06_controle_spatial.md` | invalidites geometriques et coherence spatiale |
| `07_regles_rattachement_geo_proposees.md` | regles proposees avant Lot E0/Lot E |
| `08_decision_go_no_go_geo.md` | conclusion geo ready / blocked |
