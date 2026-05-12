# Decisions metier finales - parametres qualite

## 1. Ambiguites levees

| Parametre source | Decision metier | Cible canonique | Statut |
|---|---|---|---|
| `NTK` | Azote total Kjeldahl | `AZOTE_TOT_KJELD` | mapping sur |
| `PT` | Phosphore total | `PHOSPHORE_TOTAL` | mapping sur |
| `F` | Fluorures | `F-` | mapping sur apres creation cible |
| `CN` | Cyanures | `CN` | mapping sur apres creation cible |
| `Clostri` | Clostridium sulfito-reducteurs | `CLOSTRI` | mapping sur apres creation cible |
| `CO2_libre` | Dioxyde de carbone libre | `CO2_LIBRE` | mapping sur apres creation cible |
| `H2S` | Hydrogene sulfure | `H2S` | mapping sur apres creation cible |
| `Pseudo_aer` | Pseudomonas aeruginosa | `PSEUDO_AER` | mapping sur apres creation cible |
| `Vibrio` | Vibrion cholerique | `VIBRIO` | mapping sur apres creation cible |
| `Germe_22` | Germes totaux a 22 C | `GERME_22` | mapping sur apres creation cible |
| `Germe_37` | Germes totaux a 37 C | `GERME_37` | mapping sur apres creation cible |
| `Cl2_res` | Chlore residuel | `CL2_RES` | mapping sur apres creation cible |
| `SiO2` | Silice | `SIO2` | mapping sur apres creation cible |
| `SiO3` | Silicates | `SIO3` | mapping sur, cible existante a enrichir |
| `H_G` | Huiles et graisses | `HUILES_GRAISSES` | mapping sur |
| `CR` / `CrT` | Chrome total | `CRT` | mapping sur |
| `N_TOT` | Azote total | `AZOTE_TOTAL` | mapping sur |
| `N_ORG` | Azote organique | `AZOTE_ORG` | mapping sur |
| `RESIDUS_SECS` | Residu sec a 105 C | `RS105` | mapping sur, alias legacy a ajouter |
| `UNREC_BORE_MG_L` | Bore | `BORE` | mapping sur apres creation cible |
| `SO3` | Sulfites | `SO3` | mapping sur apres creation cible |
| `ODEUR` | Odeur | `ODEUR` | mapping sur apres creation cible |
| `SAVEUR` | Saveur | `SAVEUR` | mapping sur apres creation cible |

## 2. Methodes analytiques a conserver

| Parametre source | Cible canonique | Attribut methode | Decision |
|---|---|---|---|
| `DBO5_dec2h` / `DBO5_DEC2H` | `DBO5` | `DECANTE_2H` | mapper vers `DBO5`, conserver le libelle source et alias analytique |
| `PT decant. 2h` / `PT DECANTE` | `PHOSPHORE_TOTAL` | `DECANTE_2H` | mapper vers `PHOSPHORE_TOTAL`, conserver le libelle source et alias analytique |

## 3. Ambiguites restantes

| Parametre | Statut | Action |
|---|---|---|
| `MO_METAL` | vrai inconnu a investiguer | ne pas mapper, transferer client/C4E avec contexte BD |
| `FM/F_M_mes` | validation client | exclure dashboard, garder en quarantaine tant que non arbitre |
| `MD` | validation client | confirmer unite, usage et table cible avant creation/mapping |

## 4. Impact sur REF-001 a REF-004

Le volume initial `parametre_ref_id IS NULL` reste de 62373 lignes. Apres enrichissement du referentiel et application des mappings exacts valides C4E :

| Classe apres recalcul | Volume estime |
|---|---:|
| mapping sur apres enrichissement | 62361 |
| vrai inconnu `MO_METAL` | 11 |
| legacy ignore `NUMEROTATION` | 1 |

Les corrections des mesures doivent venir apres enrichissement referentiel. Aucun mapping de `MO_METAL`, `FM/F_M_mes` ou `MD` ne doit etre execute automatiquement.

