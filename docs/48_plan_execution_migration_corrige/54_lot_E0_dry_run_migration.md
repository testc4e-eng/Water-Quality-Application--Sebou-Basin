# Lot E0 - Dry-run migration

## Objectif

Exécuter un dry-run de migration contrôlé sans alimenter les tables finales.

Le Lot E0 doit :

- créer des tables temporaires ou un schéma de simulation ;
- appliquer le mapping consolidé ;
- appliquer le parsing des valeurs ;
- appliquer les conversions d'unités ;
- poser les flags QA et les motifs de quarantaine ;
- comparer les volumes `raw` -> `préparé` -> `quarantaine` ;
- produire un rapport de contrôle avant toute autorisation du Lot E.

## Périmètre

Le dry-run s'appuie sur :

- [50_parametre_master_final.csv](/C:/dev/WQDSS/repo_git/docs/48_plan_execution_migration_corrige/50_parametre_master_final.csv)
- [51_mapping_final_nettoye.csv](/C:/dev/WQDSS/repo_git/docs/48_plan_execution_migration_corrige/51_mapping_final_nettoye.csv)
- [52_donnees_preparees_migration.sql](/C:/dev/WQDSS/repo_git/docs/48_plan_execution_migration_corrige/52_donnees_preparees_migration.sql)
- [53_rapport_pre_migration.md](/C:/dev/WQDSS/repo_git/docs/48_plan_execution_migration_corrige/53_rapport_pre_migration.md)

## Résultats attendus

### Tables de simulation proposées

| Objet proposé | Rôle |
|---|---|
| `qa_dry_run.e0_mapping_scope` | périmètre des lignes à traiter |
| `qa_dry_run.e0_mesures_preparees` | résultat préparé après parsing et conversion |
| `qa_dry_run.e0_mesures_quarantaine` | lignes rejetées ou exclues |
| `qa_dry_run.e0_controle_volumes` | comparaison des volumes et deltas |

### Règles de préparation

- `<x` -> conserver `x` avec flag `INFERIEUR`
- `>x` -> conserver `x` avec flag `SUPERIEUR`
- virgule décimale -> conversion en point
- notation scientifique texte -> conversion numérique
- `L/s` -> `m3/s`
- `°F` -> `meq/L` pour `TA`, `TAC`, `TH`
- `µg/L` -> `mg/L`
- unité absente -> `UNIT_ASSUMED`
- texte non interprétable -> quarantaine
- `FM`, `MD` -> quarantaine d'office selon retour métier

## Volumes cibles du dry-run

### Synthèse issue du mapping consolidé

| Indicateur | Valeur |
|---|---:|
| Lignes `scope_migration = MESURE` | 448 |
| Lignes `MIGRER` | 194 |
| Lignes `MIGRER_AVEC_FLAG` | 254 |
| Volume préparé attendu | 3 729 256 |
| Lignes `QUARANTAINE` hors mesures | 66 |
| Lignes `A_VALIDER_MODELE` | 11 |

### Principales tables source du dry-run

| Table source | Lignes mapping | Volume |
|---|---:|---:|
| `raw_mesures_precipitations_jr_traitees` | 3 | 1 638 021 |
| `raw_mesures_precipitations_jr` | 1 | 669 880 |
| `raw_mesures_debit_jr` | 1 | 521 433 |
| `raw_mesures_niv_eau_barrages` | 5 | 425 830 |
| `raw_bathymetries_barrages_abhs` | 3 | 187 077 |
| `raw_mesures_qualite_nappes` | 70 | 63 087 |
| `raw_mesures_qualite_rivieres` | 93 | 60 085 |
| `raw_suivi_qualite_sebou_jr` | 13 | 59 436 |
| `raw_mesures_evaporation_jr` | 1 | 48 900 |

## Critères de réussite

- aucun delta inexpliqué entre le volume source ciblé et le volume préparé + quarantaine ;
- toutes les conversions d'unités tracées ;
- toutes les lignes exclues documentées ;
- aucune insertion dans les tables finales ;
- log d'exécution et rapport de contrôle complets.

## Statut

`PENDING` - préparation documentaire et SQL proposés uniquement.
