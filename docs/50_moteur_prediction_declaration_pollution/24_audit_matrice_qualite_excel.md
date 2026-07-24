# 24  Audit matrice qualité Excel

Date audit : 2026-07-13T18:13:12.213Z

## 1. Fichier lu

`C:\dev\WQDSS\data\matrice qualité.xlsx`

Lecture seule. Le fichier original n'a pas ete modifie.

## 2. Feuilles detectees

| Feuille | Lignes | Colonnes | Cachee | Ligne en-tete | Variables reconnues | Scenarios | Formules | Fusions |
|---|---:|---:|---:|---:|---|---:|---:|---:|
| tableau_scenarios_colonnes_dema | 1576 | 10 | false | 1 | scenario_id, Segment_rejet, Crejet_mg_L, QRejet_m3_s, QSebou_m3_s, QInnaouen_m3_s, QOuergha_m3_s, C_SidiAllalTazi_mg_L, C_BgGarde_mg_L, Statut | 1575 | 0 | 0 |

## 3. Colonnes métier reconnues

Toutes les colonnes MVP attendues sont presentes dans la feuille candidate :

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

Exports :

- `C:\dev\WQDSS\data\audit_matrice_qualite\matrix_columns.csv`
- `C:\dev\WQDSS\data\audit_matrice_qualite\matrix_domain_summary.csv`

## 4. Domaine de validité observé

| Variable | Valeurs distinctes | Min | Max |
|---|---:|---:|---:|
| Crejet_mg_L | 5 | 100 | 300 |
| QRejet_m3_s | 5 | 0.055555556 | 2.222222222 |
| QSebou_m3_s | 3 | 7.5 | 30 |
| QInnaouen_m3_s | 3 | 10 | 50 |
| QOuergha_m3_s | 7 | 10 | 400 |
| C_SidiAllalTazi_mg_L | 1575 | 0.001254186 | 4.926435471 |
| C_BgGarde_mg_L | 1575 | 0.001789953 | 4.813912392 |

## 5. Statuts

| Statut | Nombre |
|---|---:|
| SUFFISANT | 1188 |
| INSUFFISANT | 387 |

## 6. Scénarios exacts lisibles dans Excel

### Scénario suffisant exemple

```json
{
  "scenario_id": "SC_QR01_C01_QS01_QI01_QO01",
  "Segment_rejet": "Segment_Pollution_base",
  "Crejet_mg_L": 100,
  "QRejet_m3_s": "0.055555556",
  "QSebou_m3_s": "7.5",
  "QInnaouen_m3_s": 10,
  "QOuergha_m3_s": 10,
  "C_SidiAllalTazi_mg_L": "0.035751168",
  "C_BgGarde_mg_L": "0.046694335",
  "Statut": "SUFFISANT"
}
```

### Scénario insuffisant exemple

```json
{
  "scenario_id": "SC_QR02_C04_QS01_QI01_QO01",
  "Segment_rejet": "Segment_Pollution_base",
  "Crejet_mg_L": 250,
  "QRejet_m3_s": "0.277777778",
  "QSebou_m3_s": "7.5",
  "QInnaouen_m3_s": 10,
  "QOuergha_m3_s": 10,
  "C_SidiAllalTazi_mg_L": "0.420350283",
  "C_BgGarde_mg_L": "0.563962579",
  "Statut": "INSUFFISANT"
}
```

## 7. Compatibilité avec le preset frontend actuel

Le preset frontend historique `Crejet=1.2`, `QRejet=0.5`, `QSebou=15`, `QInnaouen=6`, `QOuergha=9` n'existe pas comme ligne exacte dans cette matrice. Il doit donc rester marque comme scenario technique de demonstration tant que le frontend/backend ne sont pas alignes sur les valeurs Excel.

Resultat exact preset actuel : non trouve

## 8. Décision recommandée

La matrice Excel peut remplacer le stub apres adaptation controlee du moteur matrice : lecture en format controle CSV/JSON/SQL, recherche exacte ou nearest-neighbor validee, conservation de `scenario_id`, `matrix_version` et `exact_match`. Ne pas brancher directement le fichier Excel brut a chaque evaluation.

## 9. Limites

- Audit structurel et statistique en lecture seule.
- La ligne source geographique exacte n'est pas fournie par cette feuille.
- Le seuil utilise pour produire `Statut` doit etre confirme avec l'equipe metier.
- Les unites doivent etre confirmees, notamment `QRejet_m3_s` dont les valeurs sont decimales.