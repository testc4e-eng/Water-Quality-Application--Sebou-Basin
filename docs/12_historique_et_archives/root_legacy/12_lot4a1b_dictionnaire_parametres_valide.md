# LOT 4A-1B : Validation Métier du Dictionnaire Paramètres

Ce document corrige les faux-positifs de la classification automatique initiale. Le dictionnaire est à présent stabilisé sémantiquement pour garantir une insertion sans "mélange de genres" dans le système de production (WQDSS).

## 1. Revue Critique (Correction des heuristiques)
- L'algorithme initial avait confondu des acronymes (`DCO`, `Conductivite`) avec la chaîne des métaux lourds à cause du "CO" (Cobalt). Ces erreurs grossières de la v1 ont été manuellement corrigées. 
- Les dizaines de redondances chimiques (ex: `NH4`, `NH4+(mgNH4+/l)`, `Ammonium`) ont été associées à un **Code Canonique** dédoublonné prêt pour `qualite.ref_parametre`.

## 2. Top 35 des Paramètres Prioritaires (Validation Métier)
Ce tableau couvre **>95% du volume historique**.

| Alias Brut (Sandbox) | Code Cible | Libellé Canonique | Famille Métier Retenue | Unité Assignée | Statut |
|---|---|---|---|---|---|
| `T_eau` / `T_Air` | `TEMP` / `T_AIR` | Température (Eau/Air) | In situ / Terrain | *°C* | 🟩 Validé Métier |
| `pH` / `ph` | `PH` | Potentiel Hydrogène | In situ / Terrain | *Unité pH* | 🟩 Validé Métier |
| `Conductivite` / `Conductivité` | `COND_20C` | Conductivité à 20°C | In situ / Terrain | *µS/cm* | 🟩 Validé Métier |
| `O2_diss` / `O2_dissous` | `O2_DISS` | Oxygène Dissous | Physico-chimie générale | *mg/L* | 🟩 Validé Métier |
| `DBO5` | `DBO5` | Demande Biochimique Oxygène | Organique | *mg O2/L* | 🟩 Validé Métier |
| `DCO` | `DCO` | Demande Chimique Oxygène | Organique | *mg O2/L* | 🟩 Validé Métier |
| `MES` | `MES` | Matières en Suspension | Physico-chimie générale | *mg/L* | 🟩 Validé Métier |
| `NH4` / `Ammonium` | `NH4` | Ammonium | Nutriments | *mg/L* | 🟩 Validé Métier |
| `NO3-` / `Nitrates` | `NO3` | Nitrates | Nutriments | *mg/L* | 🟩 Validé Métier |
| `NO2-` | `NO2` | Nitrites | Nutriments | *mg/L* | 🟩 Validé Métier |
| `NTK` / `Azote_tot_kjeldhal`| `NTK` | Azote Kjeldahl | Nutriments | *mg/L* | 🟩 Validé Métier |
| `PO4 3-` / `PO43-(mgP/l)` | `PO4` | Orthophosphates | Nutriments | *mg/L* | 🟩 Validé Métier |
| `Phosphore total` / `PT` | `PT` | Phosphore Total | Nutriments | *mg P/L* | 🟩 Validé Métier |
| `SO4` | `SO4` | Sulfates | Ions majeurs | *mg/L* | 🟩 Validé Métier |
| `Cl` | `CL` | Chlorures | Ions majeurs | *mg/L* | 🟩 Validé Métier |
| `Na` | `NA` | Sodium | Ions majeurs | *mg/L* | 🟩 Validé Métier |
| `K` | `K` | Potassium | Ions majeurs | *mg/L* | 🟩 Validé Métier |
| `Ca` | `CA` | Calcium | Ions majeurs | *mg/L* | 🟩 Validé Métier |
| `Mg` | `MG` | Magnésium | Ions majeurs | *mg/L* | 🟩 Validé Métier |
| `HCO3-` / `HCO` | `HCO3` | Bicarbonates | Ions majeurs | *mg/L* | 🟩 Validé Métier |
| `CO3` | `CO3` | Carbonates | Ions majeurs | *mg/L* | 🟩 Validé Métier |
| `TA` / `TAC` / `TH` | `TA` / `TAC` / `TH` | Titres (Alcalimétrique...) | Ions majeurs | *°f* | 🟩 Validé Métier |
| `SF` | `SF` | Streptocoques Fécaux | Microbiologie | *UFC/100mL*| 🟩 Validé Métier |
| `CF` | `CF` | Coliformes Fécaux | Microbiologie | *UFC/100mL*| 🟩 Validé Métier |
| `MO` | `MAT_ORG` | Matière Organique | Organique | *mg/L* | 🟩 Validé Métier |
| `Phenol` | `PHENOLS` | Indice Phénol | Organique | *µg/L* | 🟩 Validé Métier |
| `Fe` / `FeT` / `Fer(mg/l)` | `FE_TOT` | Fer Total | Métaux Lourds | *mg/L* | 🟩 Validé Métier |
| `Mn` | `MN` | Manganèse | Métaux Lourds | *mg/L* | 🟩 Validé Métier |
| `Debit` | `DEBIT_Q` | Débit (Prélèvement) | In situ / Terrain | *m3/s* | 🟩 Validé Métier |
| `sat` | `O2_SAT` | Saturation en Oxygène | Physico-chimie générale | *%* | 🟧 A arbitrer |
| `H_G` | `H_G` | [Inconnu / Hydrocarbures Globaux?] | Organique ? | *?* | 🟧 A arbitrer |

---

## 3. Liste des "Ambiguïtés à Arbitrer" (Équipe Métier/Chimiste)
Les termes suivants subsistent dans d'infimes proportions (ou sous forme litigieuse) dans la Sandbox. **Ils nécessitent une décision stricte de l'ABH** pour ne pas fausser le SI :
- `sat` : S'agit-il de saturation en O2 (%) ?
- `H_G` : S'agit-il d'Hydrocarbures Globaux, d'Huiles et Graisses ou d'une faute de frappe pour Mercure `Hg` ? (Présent >4000 fois, impact majeur).
- `PTD` et `PTP` : Fraction dissoute et particulaire du Phosphore Total ?
- `RS105` et `RS185` : Résidu sec (à 105°C / 185°C) ? À valider si on les intègre.
- `F_M_mes` / `FM` : Filtrable / MES ?
- `Numerotation_GT` / `IP(mgO2/l)` : Termes internes de laboratoires.

---

## 4. Structure Cible Finale de Production WQDSS (`qualite` schema)

Afin de pouvoir entamer les dry-runs spatiaux, le système s'appuiera désormais sur cette cartographie stricte :

### `qualite.ref_parametre`
L'étalon or du système. Si un paramètre n'est pas dedans (ex: "Nitrates"), il n'existe pas en production.
- `id` (int)
- `code_canonique` (varchar) -> Ex: `NO3`
- `nom_usuel` (varchar)
- `famille` (varchar) -> Ex: `Nutriments`
- `unite_mesure` (varchar) -> Ex: `mg/L`

### `qualite.map_parametre_source`
Le dictionnaire de traduction permanent. Il résout les 148 alias historiques.
- `alias_sandbox` (varchar) -> Ex: `NO3-(mg/l)`
- `code_canonique` (varchar) -> FK vers `ref_parametre`.

### Ligne de Tolérance Zéro (Règle d'Ingestion QA)
- ❌ Lors des prochains **LOT 4A-2** et **LOT 4A-3**, si un tuple issu des Rivières / Barrages contient un `parametre_qualite` absent de notre mapping métier certifié, il **basculera en Anomalie Bloquante** (`qa_flag_param_unmapped = TRUE` et exclusion analytique partielle).
- ❌ Les lignes où `valeur_num` < 0 déclencheront `qa_flag_negative = TRUE`.
- ❌ Les lignes `NULL` déclencheront un `WOULD_SKIP` pur pour éviter le ghosting (Conformément à l'anomalie `ANO-LOT4A-002`).
