# Mapping canonique réglementaire

Aucune modification du référentiel canonique n'est réalisée dans cette phase. Ce fichier prépare la table cible `metadata.qualite_mapping_canonique_reglementaire`.

## Mapping final validé pour préparation SQL

| parametre_pdf | code_reglementaire | code_canonique_existant | libelle_canonique | statut_mapping | commentaire | statut_operationnel |
|---|---|---|---|---|---|---|
| Ammonium | NH4 | NH4 | NH4 | match_exact_unite_equivalente | Unité source `mgNH4/l`; moteur accepte normalisation opérationnelle vers `mg/L` après contrôle | REGLEMENTAIRE_CLASSIFIABLE |
| Arsenic (As) | AS | AS | Arsenic | match_exact_unite_normalisee | Source `µg/l`, moteur `mg/L`, facteur 0.001 | REGLEMENTAIRE_CLASSIFIABLE |
| Baryum | BARYUM | BA | Baryum | match_probable | Équivalent canonique vérifié en lecture seule | REGLEMENTAIRE_CLASSIFIABLE |
| Cadmium (Cd) | CD | CD | Cadmium | match_exact_unite_normalisee | Source `µg/l`, moteur `mg/L`, facteur 0.001 | REGLEMENTAIRE_CLASSIFIABLE |
| Chlorophylle a | CHL_A | CHLA | Chla | match_probable | Équivalent canonique vérifié en lecture seule | REGLEMENTAIRE_CLASSIFIABLE |
| Chlorures (Cl-) | CL | CL | Cl | match_exact |  | REGLEMENTAIRE_CLASSIFIABLE |
| Chrome total (Cr) | CR | CRT | Chrome_total | match_probable_fort | Alias canoniques vérifiés : `Chrome`, `Cr`, `CR`, `CrT` | REGLEMENTAIRE_CLASSIFIABLE |
| Coliformes fécaux | CF | CF | CF | match_exact_unite_equivalente | `/100ml` validé équivalent opérationnel à `UFC/100 mL` | REGLEMENTAIRE_CLASSIFIABLE |
| Coliformes totaux | CT | CT | CT | match_exact_unite_equivalente | `/100ml` validé équivalent opérationnel à `UFC/100 mL` | REGLEMENTAIRE_CLASSIFIABLE |
| Conductivité à 20° C | CONDUCTIVITE | CONDUCTIVITE | Conductivite | match_exact |  | REGLEMENTAIRE_CLASSIFIABLE |
| Couleur (échelle Pt) | COULEUR_ECHELLE_PT | COULEUR | Couleur | match_probable | Équivalent canonique vérifié en lecture seule | REGLEMENTAIRE_CLASSIFIABLE |
| Cuivre (Cu) | CU | CU | Cuivre | match_exact |  | REGLEMENTAIRE_CLASSIFIABLE |
| Cyanures (CN-) | CN | CN | Cyanures | match_exact_unite_normalisee | Source `µg/l`, moteur `mg/L`, facteur 0.001 | REGLEMENTAIRE_CLASSIFIABLE |
| DBO 5 | DBO5 | DBO5 | DBO5 | match_exact_unite_equivalente | `mgO2/l` validé équivalent opérationnel à `mg/L` | REGLEMENTAIRE_CLASSIFIABLE |
| DCO | DCO | DCO | DCO | match_exact_unite_equivalente | `mgO2/l` validé équivalent opérationnel à `mg/L` | REGLEMENTAIRE_CLASSIFIABLE |
| Détergents anioniques | DETERGENTS | DETERGENT | Detergent | match_probable | Équivalent canonique vérifié en lecture seule | REGLEMENTAIRE_CLASSIFIABLE |
| Fe total (Fe) | FE | FE | Fe | match_exact |  | REGLEMENTAIRE_CLASSIFIABLE |
| Fluorure (F-) | FLUORURE_F | F- | Fluorures | match_probable | Équivalent canonique vérifié en lecture seule | REGLEMENTAIRE_CLASSIFIABLE |
| H.P.A. totaux | H_P_A_TOTAUX |  |  | absent_non_utilisable | Vrai absent canonique retenu comme non utilisable moteur | OBSERVATIONNEL_NON_CLASSIFIABLE |
| Hydrocarbures | HYDROCARBURES |  |  | absent_non_utilisable | Pas d'assimilation automatique à `HUILES_GRAISSES` ou `HCT` | OBSERVATIONNEL_NON_CLASSIFIABLE |
| MES | MES | MES | MES | match_exact |  | REGLEMENTAIRE_CLASSIFIABLE |
| Manganèse (Mn) | MN | MN | Mn | match_exact |  | REGLEMENTAIRE_CLASSIFIABLE |
| Mercure (Hg) | HG | HG | Mercure | match_exact_unite_normalisee_regle_specifique | Source `µg/l`, moteur `mg/L`; règle validée `<1` moyenne, `>=1` mauvaise | REGLEMENTAIRE_CLASSIFIABLE |
| NTK | NTK | AZOTE_TOT_KJELD | Azote_tot_kjeld | match_probable_fort | Alias canonique vérifié : `NTK` | REGLEMENTAIRE_CLASSIFIABLE |
| Nickel (Ni) | NI | NI | Nickel | match_exact_unite_normalisee | Source `µg/l`, moteur `mg/L`, facteur 0.001 | REGLEMENTAIRE_CLASSIFIABLE |
| Nitrates (NO3-) | NO3 | NO3- | NO3- | alias_reglementaire_valide | `NO3-` canonique, `NO3` alias réglementaire | REGLEMENTAIRE_CLASSIFIABLE |
| O2 dissous | O2_DISSOUS | O2_DISS | O2_diss | alias_reglementaire_valide | `O2_DISS` canonique, `O2_DISSOUS` alias réglementaire | REGLEMENTAIRE_CLASSIFIABLE |
| Odeur (dilu à 25° C) | ODEUR_DILU_A_25_C | ODEUR | Odeur | match_probable | Équivalent canonique vérifié en lecture seule | REGLEMENTAIRE_CLASSIFIABLE |
| Oxydabilité KMnO4 | OXYDABILITE_KMNO4 |  |  | absent_non_utilisable | Vrai absent canonique retenu comme non utilisable moteur | OBSERVATIONNEL_NON_CLASSIFIABLE |
| P total (Pt) | P_TOTAL | PHOSPHORE_TOTAL | Phosphore_Total | match_probable_fort | Alias canoniques vérifiés : `Phosphore total`, `PT` | REGLEMENTAIRE_CLASSIFIABLE |
| PH | PH | PH | ph | match_exact |  | REGLEMENTAIRE_CLASSIFIABLE |
| Pesticides par subst | PESTICIDES_PAR_SUBST |  |  | absent_non_utilisable | Vrai absent canonique retenu comme non utilisable moteur | OBSERVATIONNEL_NON_CLASSIFIABLE |
| Pesticides totaux | PESTICIDES_TOTAUX |  |  | absent_non_utilisable | Vrai absent canonique retenu comme non utilisable moteur | OBSERVATIONNEL_NON_CLASSIFIABLE |
| Phosphates (PO4--) | PO4 | PO4_3- | PO4 3- | match_probable_fort | Alias canonique vérifié : `PO4` | REGLEMENTAIRE_CLASSIFIABLE |
| Phénols | PHENOLS | PHENOL | phenol | match_probable | Équivalent canonique vérifié en lecture seule | REGLEMENTAIRE_CLASSIFIABLE |
| Plomb (Pb) | PB | PB | Plomb | match_exact_unite_normalisee | Source `µg/l`, moteur `mg/L`, facteur 0.001 | REGLEMENTAIRE_CLASSIFIABLE |
| Selenium (Se) | SELENIUM_SE | SE | Selenium | match_probable | Équivalent canonique vérifié en lecture seule | REGLEMENTAIRE_CLASSIFIABLE |
| Streptocoques fécaux | SF | SF | SF | match_exact_unite_equivalente | `/100ml` validé équivalent opérationnel à `UFC/100 mL` | REGLEMENTAIRE_CLASSIFIABLE |
| Sulfates (SO4-) | SO4 | SO4 | SO4 | match_exact |  | REGLEMENTAIRE_CLASSIFIABLE |
| Température | T_EAU | T_EAU | T_eau | match_exact |  | REGLEMENTAIRE_CLASSIFIABLE |
| Zinc (Zn) | ZN | ZN | Zinc | match_exact |  | REGLEMENTAIRE_CLASSIFIABLE |

## Règles de mapping

- `match_exact` : mapping exploitable après contrôle final.
- `match_exact_unite_normalisee` : mapping exploitable avec unité source conservée et unité moteur normalisée.
- `match_exact_unite_equivalente` : mapping exploitable après décision métier d'équivalence unité.
- `match_probable` : mapping trouvé dans le canonique, à tracer comme décision métier validée pour DEV.
- `match_probable_fort` : mapping trouvé avec alias explicite dans le canonique.
- `alias_reglementaire_valide` : le code réglementaire reste alias, le code canonique pilote moteur/API.
- `absent_non_utilisable` : vrai absent canonique, non utilisable et non classifiable automatiquement.

## Protection MO / Mo

Aucune fonction `upper()` ou `lower()` globale ne doit être appliquée aux codes paramètres. Les mappings doivent être faits sur codes explicitement validés.
