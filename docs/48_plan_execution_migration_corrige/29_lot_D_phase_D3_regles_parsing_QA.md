# Lot D3 — Règles parsing et QA

## Règles générales

| Cas | Règle | Action/flag |
|---|---|---|
| Virgule décimale | convertir en point décimal | DECIMAL_COMMA |
| <x | conserver x comme valeur numérique + flag limite inférieure | INFERIEUR |
| >x | conserver x comme valeur numérique + flag limite supérieure | SUPERIEUR |
| Notation x10n ou .10n | convertir en notation scientifique | SCIENTIFIC_NOTATION |
| Texte non convertible | ne pas migrer vers final | QUARANTAINE |
| Valeur négative | quarantaine sauf règle spécifique validée | QUARANTAINE_NEGATIVE |
| NULL qualité / évaporation / précipitation | ne pas migrer | NULL_REJECTED |
| Trous série temporelle | migrer uniquement avec contrôle série | FLAG_GAP_TIME_SERIES |
| Non-respect timestep | flag obligatoire | FLAG_TIMESTEP_IRREGULAR |
| Doublon station/date/timestep | flag obligatoire | FLAG_DUPLICATE_TIMESTEP |

## Règles par famille

| Famille | Règles |
|---|---|
| bactériologie | numeric_microbio + decimal_comma + scientific_notation + limites_detection + quarantine_non_convertible |
| hydrologie | numeric_decimal_comma + null_non_migre_si_applicable + flags_series_temporelles + quarantine_non_convertible \| numeric_decimal_comma + timestep + flags_series_temporelles + quarantine_non_convertible |
| métaux lourds | numeric_decimal_comma + limites_detection + quarantine_non_convertible \| numeric_decimal_comma + forme_chimique_obligatoire + limites_detection + quarantine_si_forme_absente \| numeric_decimal_comma + forme_chimique_si_detectable + limites_detection + quarantine_non_convertible |
| météo | numeric_decimal_comma + null_non_migre + flags_series_temporelles + quarantine_non_convertible \| numeric_decimal_comma + null_non_migre + type_valeur + flags_series_temporelles + quarantine_non_convertible \| numeric_decimal_comma + timestep + quarantine_non_convertible \| numeric_decimal_comma + null_non_migre_si_applicable + flags_series_temporelles + quarantine_non_convertible |
| physico-chimie | numeric_decimal_comma + limites_detection + quarantine_non_convertible \| numeric_decimal_comma + temperature_reference + quarantine_non_convertible \| numeric_decimal_comma + condition_mesure_dec2h + limites_detection + quarantine_non_convertible \| numeric_decimal_comma + condition_mesure_dec2h + qa_DCO_DBO5 + limites_detection + quarantine_non_convertible \| numeric_decimal_comma + normalisation_variante + limites_detection + quarantine_non_convertible \| numeric_decimal_comma + filtre + limites_detection + quarantine_non_convertible \| numeric_decimal_comma + pas_conversion_N_NH4 + limites_detection + quarantine_non_convertible \| numeric_decimal_comma + conversion_ugL_vers_mgL_si_detectee + limites_detection + quarantine_non_convertible \| ... (+3) |
| pollution / physico-chimie | numeric_decimal_comma + limites_detection + quarantine_non_convertible \| numeric_decimal_comma + unite_nettoyee + limites_detection + quarantine_non_convertible |
