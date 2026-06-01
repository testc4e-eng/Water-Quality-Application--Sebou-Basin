# Audit couverture paramètres

## Paramètres réglementaires
- Total réglementaire chargé : 41.
- Classifiables actifs : 36.
- Observationnels non classifiables : 5.
- Mappings canonique actifs : 36.
- Paramètres sans mapping technique : 0.

## Vrais absents canonique non utilisables moteur
| Code réglementaire | Paramètre PDF | Commentaire |
|---|---|---|
| H_P_A_TOTAUX | H.P.A. totaux | Vrai absent canonique, non utilisable moteur. |
| HYDROCARBURES | Hydrocarbures | Vrai absent canonique, pas dâ€™assimilation automatique Ã  HCT/HUILES_GRAISSES. |
| OXYDABILITE_KMNO4 | OxydabilitÃ© KMnO4 | Vrai absent canonique, non utilisable moteur. |
| PESTICIDES_PAR_SUBST | Pesticides par subst | Vrai absent canonique, non utilisable moteur. |
| PESTICIDES_TOTAUX | Pesticides totaux | Vrai absent canonique, non utilisable moteur. |


## Paramètres sensibles contrôlés
| Code canonique | Nom | Alias | Unité |
|---|---|---|---|
| HG | Mercure | ['Hg', 'HG_MERCURE', 'Mercure', 'Mercure(mg/l)'] | mg/L |
| Mo | Molybdene | ['Molybdene(mg/l)', 'Molybdene(mg/L)', 'MO_METAL'] | mg/L |
| MO | MO | [] | mg/L |
| NO3- | NO3- | ['Nitrates', 'NO3', 'NO3-(mg/l)', 'NO3_Spectro'] | mg/L |
| O2_DISS | O2_diss | ['O2_diss', 'O2_dissous', 'O2_DISSOUS', 'O2dissous(mgO2/l)'] | mg/L |


Conclusion : `NO3` est résolu vers `NO3-`, `O2_DISSOUS` est disponible comme alias de `O2_DISS`, et `MO`/`Mo` restent séparés. `Mo` et `MO` ne sont pas réglementaires actifs dans les tests de classification.

## Paramètres qualité présents en rivière - top 15
| Paramètre | Nombre mesures |
|---|---|
| T_EAU | 1995 |
| T_AIR | 1995 |
| PH | 1994 |
| COND | 1992 |
| DCO_DEC2H | 1973 |
| O2_DISSOUS | 1970 |
| PT | 1964 |
| DBO5 | 1961 |
| MES | 1961 |
| CF | 1950 |
| NH4 | 1941 |
| NO3 | 1930 |
| PO4 | 1892 |
| CL | 1889 |
| SF | 1879 |


## Paramètres rivière sans `parametre_ref_id`
Nombre détecté : 0. Aucun cas dans l'échantillon audité.

## Température
`meteo.mesure_temperature` contient 0 ligne. La température réglementaire existe dans les seuils, mais la table météo dédiée est vide à ce stade.
