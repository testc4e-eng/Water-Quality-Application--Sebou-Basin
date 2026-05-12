# LOT 4A : Audit du Cœur Métier Qualititatif

Ce lot concerne le pilotage du bloc 4 (Ingénierie de la Qualité des Eaux), visant à intégrer l'ensemble des réseaux de mesures physiques, chimiques et biologiques (rivières, nappes, barrages).

## 1. Topologie Structurelle

### Mouvement : `mesures_qualite_rivieres` ➔ `qualite.mesure_qualite_riviere`
- **Volume Sandbox** : 60097 lignes. Plage d'analyse : 1988-09-20 au 2024-11-28
- **Volume Prod existant** : 60097 lignes.
- **Orphelins Station** : 0
- **Vides (NULLs)** : 0
- **Valeurs Négatives** : 1

### Mouvement : `mesures_qualite_nappes` ➔ `qualite.mesure_qualite_nappe`
- **Volume Sandbox** : 63088 lignes. Plage d'analyse : 1988-10-03 au 2024-11-29
- **Volume Prod existant** : 63088 lignes.
- **Orphelins Station** : 0
- **Vides (NULLs)** : 0
- **Valeurs Négatives** : 1

### Mouvement : `mesures_qualite_barrages` ➔ `qualite.mesure_qualite_barrage`
- **Volume Sandbox** : 8714 lignes. Plage d'analyse : 1988-10-14 au 2024-11-29
- **Volume Prod existant** : 15808 lignes.
- **Orphelins Station** : 0
- **Vides (NULLs)** : 0
- **Valeurs Négatives** : 0

### Mouvement : `mesures_suivi_qualite_sebou_jr_6stations` ➔ `qualite.mesure_qualite_sebou`
- **Volume Sandbox** : 59436 lignes. Plage d'analyse : 2023-12-07 au 2026-01-06
- **Volume Prod existant** : 51402 lignes.
- **Orphelins Station** : 0
- **Vides (NULLs)** : 0
- **Valeurs Négatives** : 0

### Mouvement : `mesures_suivi_qualite_brg_garde_hebdo` ➔ `qualite.suivi_qualite_barrage_garde_hebdo`
- **Volume Sandbox** : 7094 lignes. Plage d'analyse : 2023-01-03 au 2025-09-22
- **Volume Prod existant** : 7094 lignes.
- **Orphelins Station** : 0 *(7094 absorbés par station métier implicite)*
- **Vides (NULLs)** : 3579
- **Valeurs Négatives** : 0

## 2. Radiologie Globale (Paramètres et Unités)
Total des métriques qualitatives : **198429** relevés
- Nombre unique de codes `parametre_qualite` distincts croisés: **148**
### Liste exhaustive des paramètres textuels découverts (Sandbox):
```text
Ag, Al, Aluminium(mg/l), Ammonium, Arsenic(mg/l), As, Azote_Org, Azote_Total, Azote_tot_kjeld, Azote_tot_kjeldhal, Ba, Beryllium(mg/l), Bore(mg/l), CF, CF(UFC/100mL), CN, CN(mg/l), CO2_libre, CO3, CO32, CT, Ca, Cadmium(mg/l), Carbone_org, Cd, Chl, Chl.A(µg/l), Chla, Chrome(mg/l), Cl, Cl-(mg/l), Cl2_res, Clostri_sul_redu, Co, Cobalt(mg/l)), Conductivite, Conductivité, Conductivitéà20°C(µs/cm), Couleur, Cr, CrT, Cu, Cuivre(mg/l), DBO5, DBO5_dec2h, DCO, DCO_dec2h, Debit, Detergent, Detergent_non_ionique, Disque_secchi, DisquedeSecchi(m), Eh, F, F-(mg/l), FM, F_M_mes, Fe, FeT, Fer(mg/l), Ferdissous(mg/l), Germe_tt_22, Germe_tt_37, H2S, HCO, HCO3-, HCT, H_G, Hg, IBD, IBGN, IP(mgO2/l), Indicedephénol(mg/l), K, Largeur, Li, Litium(mg/l), MD, MES, MEST(mg/l), MO, Manganèse(mg/l), Mercure(mg/l), Mg, Mn, Molybdène(mg/l), NA, NH4, NH4+(mgNH4+/l), NO2-, NO3-, NO3-(mg/l), NTK, Ni, Nickel(mg)/l, Nitrates, Numerotation_GT, O2_diss, O2_dissous, O2dissous(mgd'O2/l), OH, Odeur, PO3, PO4 3-, PO43-(mgP/l), PT(mgP/l), PTD, PTP, Pb, Phenol, Pheopigment, Phosphore total, Phosphore_Total, Ph�nol, Plomb(mg/l), Profondeur, Pseudo_aer, RS105, RS185, S, S2, SF, SO3, SO4, SO4(mg/l), Saveur, Sb, Se, SiO2(mg/l), SiO3, Sélénium(mg/l), TA, TAC, TH, T_Air, T_air, T_eau, Temperature_Ambiante, Turbidite, Turbidité, Vanadium(mg/l), Vibrion_Cholerique, Zinc(mg/l), Zn, pH, ph, phenol, sat
```

> ⚠️ *Dans l'architecture de données de ce bloc, aucun champ Unité `unite` n'a été repéré nativement dans les tables brutes, signifiant que le sémantisme de l'unité est induit et rattaché au Référentiel Paramètres et non pas à la ligne.* 

## 3. Détection des Anomalies (Bloquantes ou Soumises à Décision)
- ✅ **[STATION IMPLICITE CONNUE]** : L'audit initial repérait 7,094 relèves sans ire_station direct. Il s'agit en réalité d'une implication métier absolue pour la table `mesures_suivi_qualite_brg_garde_hebdo` qui pointe nativement sur le "Barrage Garde Sebou". Ces données seront insérées avec un mapping fixe et `qa_flag_station_infered=TRUE`.
- 🔴 **[ANOMALIE VALEUR NULL]** : 3579 lignes remontent sans ancrage quantitatif (champ val_qual_... est NULL). Ces lignes morts (`ANO-LOT4-001`) doivent-elles être ignorées à l'Ingestion ? (Oui recommandé)
- 🔴 **[VALEURS NEGATIVES]** : 2 paramètres (qui doivent exiger C > 0 mg/L) sont négatifs. Ceci indique une corruption ou des codes de censure (ex: -99) du laboratoire ! (`ANO-LOT4-002`)
- 🔴 **[ORPHELINS PARAMETRES]** : Le schéma paramètre de la Prod devant lier `parametre_qualite` (varchar) et un `parametre_ref_id` absolu, une concordance stricte du dictionnaire NASA/SandBox vs WQDSS devra être menée. Les fautes de frappe de laboratoire lèveront des rejets.

## 4. Recommandations de Découpage de Convergence (Sous-Lots)
Au vu des paramètres et de l'hétérogénéité des mesures de laboratoire, la masse d'import Lot 4 devrait être phasées comme suit :
- **LOT 4A-1** : Consolidation du Dictionnaire Paramètres `qualite.parametre` (Unification sémantique DBO5, O2, NH4, Traces métaliques etc).
- **LOT 4A-2** : Eaux Superficielles et Profondes (Rivières + Nappes).
- **LOT 4A-3** : Lentiques et Barrages (Y compris Suivis Hebdo de crise).
- **LOT 4A-4** : Faisceau IDP et Marche Cadre Qualité (Sources ponctuelles tierces ou polluantes).
