# Lot D3 — Rapport de contrôle

## 1. Contrôles obligatoires

| Contrôle | Résultat | Statut |
|---|---|---|
| Nombre total de paramètres inventoriés | 298 | OK |
| Nombre paramètres canonisés D3 | 200 | OK |
| Nombre paramètres validés | 38 | OK |
| Nombre variantes mappées docs/42 | 265 | OK |
| Nombre paramètres en quarantaine | 1 | OK |
| Nombre paramètres ambigus | 0 | OK |
| 30 paramètres D2 restent validés | OK | OK |
| Aucune table finale métier alimentée par D3 | aucune commande INSERT/UPDATE/DELETE/TRUNCATE exécutée en D3 | OK |
| Aucune donnée raw modifiée par D3 | lecture seule SELECT uniquement | OK |
| SQL actif dans 30_sql | 0 | OK |
| Tables metadata D3 présentes | aucune | OK |

## 2. Répartition master

| Statut | Nombre |
|---|---|
| VALID | 22 |
| VALID_WITH_QA | 16 |
| QUARANTAINE | 1 |
| AMBIGU | 0 |
| NON_RECONNU | 76 |
| A_VALIDER | 85 |

## 3. Répartition mapping

| Action migration | Nombre |
|---|---|
| MIGRER | 166 |
| MIGRER_AVEC_FLAG | 101 |
| QUARANTAINE | 18 |
| NE_PAS_MIGRER | 0 |
| A_VALIDER | 229 |

## 4. Top 20 paramètres bloquants

| Source | Paramètre | Canonique | Volume | Action | Raison |
|---|---|---|---|---|---|
| raw_mesures_niv_eau_barrages | apports_mm3 | APPORTS_HM3 | 85166 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_OK |
| raw_mesures_niv_eau_barrages | niveau_eau_m_ngm | NIVEAU_EAU | 85166 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_MISSING |
| raw_mesures_niv_eau_barrages | restitutions_mm3 | RESTITUTION | 85166 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_OK |
| raw_mesures_niv_eau_barrages | transfert_mm3 | TRANSFERT | 85166 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_OK |
| raw_mesures_niv_eau_barrages | volume_mm3 | VOLUME | 85166 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_OK |
| raw_bathymetries_barrages_abhs | hauteur_m | HAUTEUR | 62359 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_OK |
| raw_bathymetries_barrages_abhs | surface_km2 | SUPERFICIE_KM2 | 62359 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_OK |
| raw_bathymetries_barrages_abhs | volume_mm3 | VOLUME | 62359 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_OK |
| raw_mesures_qualite_nappes | SF | SF | 2640 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_CONFLICT |
| raw_mesures_qualite_nappes | MO | MO | 2625 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_UNKNOWN |
| raw_mesures_qualite_nappes | RS105 | RS105 | 2203 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_MISSING |
| raw_mesures_qualite_nappes | Mn | MN | 2199 | QUARANTAINE | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| FORME_CHIMIQUE_REQUIRED \| UNIT_OK |
| raw_mesures_qualite_nappes | TA | TA | 2027 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_CONFLICT |
| raw_mesures_qualite_nappes | TAC | TAC | 2027 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_CONFLICT |
| raw_mesures_qualite_rivieres | SF | SF | 1879 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_CONFLICT |
| raw_mesures_qualite_nappes | TH | TH | 1608 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_CONFLICT |
| raw_mesures_qualite_rivieres | TAC | TAC | 1103 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_CONFLICT |
| raw_mesures_qualite_rivieres | TA | TA | 1100 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_CONFLICT |
| raw_mesures_qualite_rivieres | TH | TH | 806 | A_VALIDER | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| UNIT_CONFLICT |
| raw_mesures_qualite_nappes | Fe | FE | 689 | QUARANTAINE | INFERIEUR \| SUPERIEUR \| DECIMAL_COMMA \| SCIENTIFIC_NOTATION \| NON_NUMERIC_QUARANTINE \| FORME_CHIMIQUE_REQUIRED \| UNIT_OK |
