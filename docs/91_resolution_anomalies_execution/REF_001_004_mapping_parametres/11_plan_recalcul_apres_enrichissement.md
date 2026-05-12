# Plan recalcul apres enrichissement referentiel

## Objectif

Recalculer REF-001 a REF-004 apres enrichissement de `metadata.referentiel_parametre_canonique` par le dictionnaire C4E.

## Principe

Le referentiel doit etre enrichi avant correction des mesures. Le recalcul doit utiliser uniquement :

- codes canoniques actifs ;
- alias exacts issus du dictionnaire C4E ;
- decisions metier finales documentees dans `docs/92_enrichissement_referentiel_canonique/15_decisions_metier_finales_parametres.md`.

## Volumetrie initiale

| Table | Volume NULL initial |
|---|---:|
| `qualite.mesure_qualite_riviere` | 17287 |
| `qualite.mesure_qualite_nappe` | 13270 |
| `qualite.mesure_qualite_sebou` | 31277 |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 539 |
| **Total** | **62373** |

## Reclassification apres C4E

| Classe | Volume estime | Decision |
|---|---:|---|
| mapping sur apres enrichissement | 62361 | corrigeable apres validation explicite |
| vrai inconnu `MO_METAL` | 11 | `CLIENT_REQUIRED`, ne pas mapper |
| legacy `NUMEROTATION` | 1 | `LEGACY_IGNORE`, ne pas exposer dashboard |

## Mappings devenus surs

| Source | Cible |
|---|---|
| `NTK` | `AZOTE_TOT_KJELD` |
| `PT` | `PHOSPHORE_TOTAL` |
| `F` | `F-` |
| `CN` | `CN` |
| `CLOSTRI` | `CLOSTRI` |
| `CO2_LIBRE` | `CO2_LIBRE` |
| `H2S` | `H2S` |
| `PSEUDO_AER` | `PSEUDO_AER` |
| `VIBRIO` | `VIBRIO` |
| `GERME_22` | `GERME_22` |
| `GERME_37` | `GERME_37` |
| `CL2_RES` | `CL2_RES` |
| `SIO2` | `SIO2` |
| `SO3` | `SO3` |
| `ODEUR` | `ODEUR` |
| `SAVEUR` | `SAVEUR` |
| `CR` | `CRT` |
| `DBO5_DEC2H` | `DBO5`, methode `DECANTE_2H` |
| `N_TOT` | `AZOTE_TOTAL` |
| `N_ORG` | `AZOTE_ORG` |
| `UNREC_BORE_MG_L` | `BORE` |
| `RESIDUS_SECS` | `RS105` |

Les mappings deja surs de la premiere passe restent valides : `COND`, `O2_DISSOUS`, `NO3`, `NO2`, `PO4`, `HCO3`, `SATURATION_OXYGENE`, `HG_MERCURE`, `Conductivite`, `O2_dissous`, `Nitrates`, `H_G`, `Ammonium`, `Turbidite`.

## Requetes de recalcul read-only

```sql
WITH remaining AS (
    SELECT 'qualite.mesure_qualite_riviere' table_name, parametre_qualite
    FROM qualite.mesure_qualite_riviere
    WHERE parametre_ref_id IS NULL
    UNION ALL
    SELECT 'qualite.mesure_qualite_nappe', parametre_qualite
    FROM qualite.mesure_qualite_nappe
    WHERE parametre_ref_id IS NULL
    UNION ALL
    SELECT 'qualite.mesure_qualite_sebou', parametre_qualite
    FROM qualite.mesure_qualite_sebou
    WHERE parametre_ref_id IS NULL
    UNION ALL
    SELECT 'qualite.suivi_qualite_barrage_garde_hebdo', parametre_qualite
    FROM qualite.suivi_qualite_barrage_garde_hebdo
    WHERE parametre_ref_id IS NULL
), classified AS (
    SELECT
        table_name,
        parametre_qualite,
        CASE
            WHEN upper(parametre_qualite)='MO_METAL' THEN 'CLIENT_REQUIRED'
            WHEN upper(parametre_qualite)='NUMEROTATION' THEN 'LEGACY_IGNORE'
            ELSE 'A_REEVALUER_ALIAS_C4E'
        END AS statut_recalcul
    FROM remaining
)
SELECT table_name, parametre_qualite, statut_recalcul, COUNT(*) AS rows
FROM classified
GROUP BY table_name, parametre_qualite, statut_recalcul
ORDER BY statut_recalcul, rows DESC;
```

## Points de controle avant correction

- toutes les cibles canoniques doivent exister et etre `ACTIF` ;
- chaque source doit pointer vers un seul `parametre_ref_id` ;
- `MO_METAL`, `FM/F_M_mes` et `MD` doivent etre absents du mapping automatique ;
- les libelles sources doivent rester conserves pour tracabilite ;
- `DBO5_DEC2H` et `PT DECANTE` doivent conserver la methode `DECANTE_2H`.

## Decision

Preparer la correction finale, mais ne pas l'executer sans validation explicite.

