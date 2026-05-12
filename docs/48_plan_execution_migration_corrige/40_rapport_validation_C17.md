# Rapport validation C17

## Resume global

- Statut propose : **REFUSE**
- Taux de validation du referentiel : **19.0%** (38/200)
- Couverture migration exploitable du mapping : **53.52%** (281/525)
- Parametres critiques bloquants : **21**
- Lignes critiques de mapping encore en `A_VALIDER` ou `QUARANTAINE` : **91**

## Metriques completes

| Indicateur | Valeur |
|---|---:|
| Parametres inventories | 200 |
| Parametres canonises | 200 |
| VALID | 22 |
| VALID_WITH_QA | 16 |
| A_VALIDER | 96 |
| NON_RECONNU | 65 |
| QUARANTAINE | 1 |
| Mappings totaux | 525 |
| MIGRER | 166 |
| MIGRER_AVEC_FLAG | 115 |
| A_VALIDER | 229 |
| QUARANTAINE | 4 |
| A_VALIDER_MODELE | 11 |

## Parametres critiques

| Bloc | Code | Nom canonique | Statut | Unite | Attributs obligatoires | Verdict C17 |
|---|---|---|---|---|---|---|
| Barrage | APPORTS_HM3 | Apports_hm3 | A_VALIDER | Mm³ | - | BLOQUANT |
| Barrage | NIVEAU_EAU | Niveau_eau | A_VALIDER | m NGM | - | BLOQUANT |
| Barrage | VOLUME | Volume | A_VALIDER | Mm³ | - | BLOQUANT |
| Barrage | RESTITUTION | Restitution | A_VALIDER | Mm³ | - | BLOQUANT |
| Barrage | TRANSFERT | Transfert | A_VALIDER | Mm³ | - | BLOQUANT |
| Hydrologie | DEBIT | Debit | VALID_WITH_QA | m3/s | time_step;unite_source;source_table | OK |
| Physico-chimie | PH | pH | VALID | sans unité | source_mesure | OK |
| Physico-chimie | COND | Conductivite | VALID | µS/cm | temperature_reference | OK |
| Physico-chimie | O2_DISSOUS | Oxygene_dissous | VALID | mg/L | - | OK |
| Physico-chimie | SATURATION_OXYGENE | Saturation_oxygene | VALID_WITH_QA | % | parametre_lie_O2 | OK |
| Physico-chimie | T_EAU | Temperature_eau | VALID | °C | - | OK |
| Physico-chimie | DBO5 | DBO5 | VALID_WITH_QA | mg/L | condition_mesure | OK |
| Physico-chimie | DCO | DCO | VALID_WITH_QA | mg/L | condition_mesure | OK |
| Physico-chimie | MES | MES | VALID_WITH_QA | mg/L | filtre | OK |
| Chimie avancee | TA | TA | A_VALIDER | meq/L | - | BLOQUANT |
| Chimie avancee | TAC | TAC | A_VALIDER | meq/L | - | BLOQUANT |
| Chimie avancee | TH | TH | A_VALIDER | meq/L | - | BLOQUANT |
| Chimie avancee | MO | Mo | A_VALIDER | mg/L | - | BLOQUANT |
| Chimie avancee | RS105 | RS105 | A_VALIDER | mg/L | - | BLOQUANT |
| Bacteriologie | CF | Coliformes_fecaux | VALID_WITH_QA | UFC/100 mL | type_valeur | OK |
| Bacteriologie | CT | Coliformes_totaux | VALID_WITH_QA | UFC/100 mL | type_valeur | OK |
| Bacteriologie | SF | SF | A_VALIDER | UFC/100 mL | - | BLOQUANT |
| Metaux | CU | Cu | A_VALIDER | mg/L | - | BLOQUANT |
| Metaux | ZN | Zn | A_VALIDER | mg/L | - | BLOQUANT |
| Metaux | NI | Ni | A_VALIDER | mg/L | - | BLOQUANT |
| Metaux | CR | Cr | A_VALIDER | mg/L | - | BLOQUANT |
| Metaux | PB | Plomb | VALID | mg/L | - | OK |
| Metaux | CD | Cadmium | VALID | mg/L | - | OK |
| Metaux | HG_MERCURE | Mercure | VALID | mg/L | - | OK |
| Metaux | SE | Se | A_VALIDER | mg/L | - | BLOQUANT |
| Metaux | SN | Sn | A_VALIDER | mg/L | - | BLOQUANT |
| Metaux | SB | Sb | A_VALIDER | mg/L | - | BLOQUANT |
| Metaux | V | V | A_VALIDER | mg/L | - | BLOQUANT |
| Silice | SIO2 | SiO2 | A_VALIDER | mg/L | - | BLOQUANT |
| Silice | SIO3 | SiO3 | A_VALIDER | mg/L | - | BLOQUANT |

## Blocages critiques C17

Les points suivants restent bloquants avant toute execution `metadata` :

- `APPORTS_HM3` (Apports_hm3) : statut `A_VALIDER`
- `NIVEAU_EAU` (Niveau_eau) : statut `A_VALIDER`
- `VOLUME` (Volume) : statut `A_VALIDER`
- `RESTITUTION` (Restitution) : statut `A_VALIDER`
- `TRANSFERT` (Transfert) : statut `A_VALIDER`
- `TA` (TA) : statut `A_VALIDER`
- `TAC` (TAC) : statut `A_VALIDER`
- `TH` (TH) : statut `A_VALIDER`
- `MO` (Mo) : statut `A_VALIDER`
- `RS105` (RS105) : statut `A_VALIDER`
- `SF` (SF) : statut `A_VALIDER`
- `CU` (Cu) : statut `A_VALIDER`
- `ZN` (Zn) : statut `A_VALIDER`
- `NI` (Ni) : statut `A_VALIDER`
- `CR` (Cr) : statut `A_VALIDER`
- `SE` (Se) : statut `A_VALIDER`
- `SN` (Sn) : statut `A_VALIDER`
- `SB` (Sb) : statut `A_VALIDER`
- `V` (V) : statut `A_VALIDER`
- `SIO2` (SiO2) : statut `A_VALIDER`
- `SIO3` (SiO3) : statut `A_VALIDER`

## Qualite des mappings

| Controle | Valeur | Verdict |
|---|---:|---|
| Couverture exploitable (`MIGRER` + `MIGRER_AVEC_FLAG`) | 53.52% | Insuffisant pour C17 |
| Lignes critiques encore `A_VALIDER` / `QUARANTAINE` | 91 | Bloquant |
| Lignes globales `A_VALIDER` | 229 | Bloquant |
| Lignes globales `QUARANTAINE` | 4 | Acceptable seulement hors critique |

## Integrite des regles metier

| Regle | Constat | Verdict |
|---|---|---|
| `<x` -> `INFERIEUR` | Present dans les flags QA | OK |
| `>x` -> `SUPERIEUR` | Present dans les flags QA | OK |
| `Hg` distinct de `H_G` | `HG_MERCURE` et `HG` separes | OK |
| `SiO2` distinct de `SiO3` | Codes distincts mais non valides | Partiel |
| `TA` distinct de `TAC` | Codes distincts mais non valides | Partiel |
| Fusion `Debit` | Canonique unique `DEBIT` avec attributs | OK |
| Fusion `RS` | `RS105` et `RS185` encore a arbitrer | Bloquant |
| Attributs critiques | `time_step`, `unite_source`, `methode_analyse`, `forme_chimique` partiellement couverts | Partiel |

## Parametres restants a valider

- Cas restants critiques identifies dans `35_lot_D_phase_D3_1_reste_a_valider_metier.md` : **35**
- Cas restants non critiques identifies : **25**

| Source | Parametre | Canonique | Volume | Action | Classement |
|---|---|---|---:|---|---|
| raw_mesures_niv_eau_barrages | apports_mm3 | APPORTS_HM3 | 85166 | A_VALIDER | CRITIQUE |
| raw_mesures_niv_eau_barrages | niveau_eau_m_ngm | NIVEAU_EAU | 85166 | A_VALIDER | CRITIQUE |
| raw_mesures_niv_eau_barrages | restitutions_mm3 | RESTITUTION | 85166 | A_VALIDER | CRITIQUE |
| raw_mesures_niv_eau_barrages | transfert_mm3 | TRANSFERT | 85166 | A_VALIDER | CRITIQUE |
| raw_mesures_niv_eau_barrages | volume_mm3 | VOLUME | 85166 | A_VALIDER | CRITIQUE |
| raw_bathymetries_barrages_abhs | volume_mm3 | VOLUME | 62359 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_nappes | SF | SF | 2640 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_nappes | MO | MO | 2625 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_nappes | RS105 | RS105 | 2203 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_nappes | TA | TA | 2027 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_nappes | TAC | TAC | 2027 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_rivieres | SF | SF | 1879 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_nappes | TH | TH | 1608 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_rivieres | TAC | TAC | 1103 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_rivieres | TA | TA | 1100 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_rivieres | TH | TH | 806 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_rivieres | Se | SE | 434 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_rivieres | CrT | CR | 389 | A_VALIDER | CRITIQUE |
| raw_rejets_domestiques_abhs | debit_l_s | DEBIT | 362 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_rivieres | Cu | CU | 272 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_rivieres | Ni | NI | 269 | A_VALIDER | CRITIQUE |
| raw_mesures_qualite_rivieres | Zn | ZN | 233 | A_VALIDER | CRITIQUE |
| raw_idp_2024_mesures_qualite_globale | TH | TH | 189 | A_VALIDER | CRITIQUE |
| raw_idp_2024_mesures_qualite_globale | SF | SF | 184 | A_VALIDER | CRITIQUE |
| raw_suivi_qualite_brg_garde_hebdo | Chrome(mg/l) | CR | 182 | A_VALIDER | CRITIQUE |

## Controle securite

| Controle | Resultat | Verdict |
|---|---|---|
| SQL D1/D2/D3 actif | 0 ligne active detectee | OK |
| Tables metadata cibles creees | 0 | OK |
| Tables `staging.raw_*` presentes | 46 | OK |
| Modification des donnees raw | Aucune execution detectee | OK |
| Tables finales alimentees pendant D | Aucune preuve d execution pendant D | OK |

## Decision finale

```text
C17 REFUSE
Blocages critiques : barrage, chimie avancee, SF, plusieurs metaux, silice, RS.
Execution metadata interdite tant que ces parametres ne sont pas valides metierement et que leurs mappings critiques ne sortent pas de A_VALIDER.
```
