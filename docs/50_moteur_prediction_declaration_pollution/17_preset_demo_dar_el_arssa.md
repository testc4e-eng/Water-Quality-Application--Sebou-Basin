# 17  Preset demo - point source matrice NH4

## Objectif

Documenter le point cartographique de demonstration et les scenarios exacts Matrix V1 utilises par le cockpit Pollution integre.

## Statut

`MATRIX_V1_READY_AVEC_RESERVES`

Le preset permet de demontrer le workflow :

- creation declaration ;
- soumission ;
- evaluation ;
- snap topologique ;
- parcours vers Garde ;
- detection SAT via alias ;
- evaluation NH4 par matrice versionnee ;
- recommandations par recherche de scenarios reels ;
- rapport.

## Point source utilise

Libelle officiel :

```text
Point source matrice NH4 - secteur Dar El Arssa, localisation exacte a valider
```

Coordonnees techniques de demonstration :

- longitude : `-6.30540031`
- latitude : `34.515619453`

Reserve : l'Excel fournit le segment `Segment_Pollution_base`, mais ne fournit pas de coordonnees scientifiques exactes du point source.

## Matrice source

Fichier :

```text
C:\dev\WQDSS\data\matrice qualité.xlsx
```

Feuille :

```text
tableau_scenarios_colonnes_dema
```

Ressource runtime :

```text
backend/app/resources/matrices/nh4_dar_el_arssa_v1.csv
```

Metadonnees :

```text
matrix_id = NH4_DAR_EL_ARSSA
matrix_version = 1.0.0
scenario_count = 1575
sufficient_count = 1188
insufficient_count = 387
```

## Scenarios exacts utilises

### Scenario suffisant

```text
scenario_id = SC_QR01_C01_QS01_QI01_QO01
Crejet_mg_L = 100
QRejet_m3_s = 0.055555556
QSebou_m3_s = 7.5
QInnaouen_m3_s = 10
QOuergha_m3_s = 10
C_SidiAllalTazi_mg_L = 0.035751168
C_BgGarde_mg_L = 0.046694335
Statut = SUFFISANT
```

### Scenario a risque

```text
scenario_id = SC_QR02_C04_QS01_QI01_QO01
Crejet_mg_L = 250
QRejet_m3_s = 0.277777778
QSebou_m3_s = 7.5
QInnaouen_m3_s = 10
QOuergha_m3_s = 10
C_SidiAllalTazi_mg_L = 0.420350283
C_BgGarde_mg_L = 0.563962579
Statut = INSUFFISANT
```

## Validation runtime

Resultat attendu :

```text
method_used = EXACT_MATCH
exact_match = true
matrix_version = 1.0.0
```

Pour le scenario insuffisant, les recommandations doivent provenir de lignes `SUFFISANT` reelles de la matrice.

