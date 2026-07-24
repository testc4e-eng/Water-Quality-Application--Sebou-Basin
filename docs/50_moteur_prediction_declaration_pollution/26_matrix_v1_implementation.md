# 26  Matrix V1 Implementation

## 1. Statut

Statut : `MATRIX_V1_READY_AVEC_RESERVES`

La matrice NH4 v1 est integree comme ressource versionnee backend. Le stub de calcul n'est plus utilise par le workflow Declaration Pollution.

## 2. Source

Fichier source :

```text
C:\dev\WQDSS\data\matrice qualité.xlsx
```

Feuille :

```text
tableau_scenarios_colonnes_dema
```

Colonnes utilisees :

- `scenario_id`
- `Segment_rejet`
- `Crejet_mg_L`
- `QRejet_m3_s`
- `QSebou_m3_s`
- `QInnaouen_m3_s`
- `QOuergha_m3_s`
- `C_SidiAllalTazi_mg_L`
- `C_BgGarde_mg_L`
- `Statut`

## 3. Ressource generee

Fichiers :

- `backend/app/resources/matrices/nh4_dar_el_arssa_v1.csv`
- `backend/app/resources/matrices/nh4_dar_el_arssa_v1.metadata.json`
- `backend/app/resources/matrices/nh4_dar_el_arssa_v1.sha256`
- `backend/app/resources/matrices/nh4_dar_el_arssa_v1.validation_report.json`

Checksum :

```text
52e0cdc65f20a079dc3dd444abdf758812ca890084e2ae920ff6f79aef38ce31
```

## 4. Metadonnees

```text
matrix_id = NH4_DAR_EL_ARSSA
matrix_version = 1.0.0
scenario_count = 1575
sufficient_count = 1188
insufficient_count = 387
```

Point source :

```text
Point source matrice NH4 - secteur Dar El Arssa, localisation exacte a valider
```

L'Excel ne fournit pas de coordonnees scientifiques exactes pour ce point source.

## 5. Methode

Ordre d'evaluation :

1. validation des variables ;
2. controle du domaine min/max ;
3. recherche `EXACT_MATCH` ;
4. fallback `NEAREST_NEIGHBOR` controle si aucune ligne exacte n'existe ;
5. rejet `MATRIX_OUT_OF_DOMAIN` si une entree sort du domaine.

Le frontend ne calcule aucune concentration.

## 6. Scenarios de demonstration

### Scenario suffisant

```text
scenario_id = SC_QR01_C01_QS01_QI01_QO01
method_used = EXACT_MATCH
exact_match = true
C_SidiAllalTazi_mg_L = 0.035751168
C_BgGarde_mg_L = 0.046694335
Statut = SUFFISANT
```

### Scenario insuffisant

```text
scenario_id = SC_QR02_C04_QS01_QI01_QO01
method_used = EXACT_MATCH
exact_match = true
C_SidiAllalTazi_mg_L = 0.420350283
C_BgGarde_mg_L = 0.563962579
Statut = INSUFFISANT
```

## 7. Recommandations

Pour un scenario insuffisant, les strategies mono-axe sont recherchees dans les lignes reelles de la matrice.

Resultat sur le scenario insuffisant de demonstration :

| Axe | Scenario cible | Delta |
|---|---|---:|
| INNAOUEN | `SC_QR02_C04_QS01_QI02_QO01` | +15.0 m3/s |
| OUERGHA | `SC_QR02_C04_QS01_QI01_QO02` | +15.0 m3/s |
| SEBOU | `SC_QR02_C04_QS03_QI01_QO01` | +22.5 m3/s |

Methode :

```text
MATRIX_SEARCH
```

## 8. Tests

Backend :

```text
18 passed
```

Frontend :

```text
29 passed
```

Build :

```text
npm run build OK
```

Reserve : warning Vite sur la taille du bundle, sans impact fonctionnel immediat.

## 9. Recette API

Scenario suffisant :

```text
create 200
submit 200
evaluate 200
report 200
status = RISQUE_FAIBLE
```

Scenario insuffisant :

```text
create 200
submit 200
evaluate 200
report 200
status = RECOMMANDATION_PROPOSEE
recommendations = 3
```

## 10. Limites restantes

- Les statuts individuels P29/Garde restent `A_VALIDER`, car l'Excel fournit seulement un statut global.
- Le fallback `NEAREST_NEIGHBOR` n'est pas une interpolation scientifique.
- L'interpolation multidimensionnelle doit etre validee avec l'equipe metier avant industrialisation.
- La localisation exacte du point source matrice reste a valider.

