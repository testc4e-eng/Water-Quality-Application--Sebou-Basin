# Lot D — Reconstruction référentiel paramètres

## Objectif
Préparer la reconstruction des référentiels paramètres et mappings depuis les fichiers validés par l’équipe métier, sans réutiliser les mappings instables existants comme référence finale.

## Sources de reconstruction

| Fichier | Rôle |
|---|---|
| docs/39_inventaire_parametres_metier_REGEN/08_tableau_validation_metier.csv | source de validation ou d’enrichissement |
| docs/39_inventaire_parametres_metier_REGEN/09_tableau_validation_metier.md | source de validation ou d’enrichissement |
| docs/40_enrichissement_normes_seuils_ABH/03_tableau_seuils_ABH.csv | source de validation ou d’enrichissement |
| docs/40_enrichissement_normes_seuils_ABH/07_tableau_validation_metier_enrichi.md | source de validation ou d’enrichissement |
| docs/42_analyse_parametres_valeurs_migration/06_tableau_decision_migration_parametres.csv | source de validation ou d’enrichissement |
| docs/42_analyse_parametres_valeurs_migration/10_regles_qa_migration.md | source de validation ou d’enrichissement |
| docs/retour equipe metier.xlsx | source de validation ou d’enrichissement |

## Référentiels à reconstruire

| Cible | Objet métier | Action proposée | Source principale | Validation |
|---|---|---|---|---|
| `metadata.parametre_master` | référentiel paramètre canonique principal | Reconstruire depuis tableau métier validé | docs/39 + docs/42 + retour equipe metier.xlsx | D3 PENDING VALIDATION |
| `metadata.mapping_parametre_source_new` | nouveau mapping source vers paramètre officiel | Créer une nouvelle table pour éviter d’écraser l’ancien mapping | docs/39/08 + docs/42/06 + retour equipe metier.xlsx | D3 PENDING VALIDATION |
| `metadata.referentiel_parametre` | ancien référentiel paramètre | Conserver en archive/compatibilité, non utilisé comme source officielle de migration | existant DB | VALIDÉ PRINCIPE |
| `metadata.unites` | unités source/référence/conversion | Créer ou alimenter après validation unité | docs/39/06 + docs/42/05 | D3 PENDING VALIDATION |
| `metadata.seuils` | seuils qualité eau et normes | Créer ou alimenter si retenue | docs/40/03 + docs/40/07 | D3 PENDING VALIDATION |

## Règles de décision

- Ne pas valider automatiquement un rapprochement probable.
- Les variantes métier validées priment sur les rapprochements automatiques.
- Les unités absentes restent `à confirmer`.
- Les seuils ABH restent `à valider` tant que l’équipe métier ne les a pas confirmés.
- Les paramètres non mappés ou ambigus bloquent la migration finale correspondante.
- Tout paramètre incomplet est classé `QUARANTAINE` avec flag `PARAMETRE_A_VALIDER`.

## Points bloquants connus

| Indicateur | Valeur | Source |
|---|---|---|
| Paramètres métier retenus | 298 | docs/39_inventaire_parametres_metier_REGEN/00_index.md |
| Variantes probables | 28 | docs/39_inventaire_parametres_metier_REGEN/00_index.md |
| Paramètres ambigus | 117 | docs/39_inventaire_parametres_metier_REGEN/00_index.md |
| Paramètres sans unité | 182 | docs/39_inventaire_parametres_metier_REGEN/00_index.md |
| Paramètres extraits ABH | 92 | docs/40_enrichissement_normes_seuils_ABH/00_index.md |
| Écarts d’unité ABH | 61 | docs/40_enrichissement_normes_seuils_ABH/00_index.md |
| Paramètres nécessitant validation unité | 161 | docs/42_analyse_parametres_valeurs_migration/00_index.md |

## Phase D1 - Structure validée

La structure détaillée est documentée dans :
- `18_lot_D_phase_D1_structure_metadata.md` ;
- `19_sql_lot_D_D1_structure_metadata_propose.sql`.

Statut : `VALIDÉ UTILISATEUR`.

Aucune création ou modification de table metadata n'a été exécutée en D1.

## Phase D2 - Échantillon produit

La Phase D2 a produit un échantillon de 30 paramètres consolidés avec mapping réel depuis les fichiers métier et les tables `staging.raw_*` en lecture seule.

Fichiers :
- `20_lot_D_phase_D2_echantillon_parametres.md` ;
- `21_lot_D_phase_D2_echantillon_parametres.csv` ;
- `22_sql_lot_D_D2_insert_sample_propose.sql`.

Statut : `VALIDÉ UTILISATEUR`.

Aucune table `metadata` n'a été créée ou modifiée en D2. STOP obligatoire avant D3.

## Phase D3 - Référentiel complet produit

La Phase D3 a généré le référentiel complet proposé, les mappings source, les règles QA/parsing et le SQL metadata non exécuté.

Fichiers :
- `23_lot_D_phase_D3_referentiel_complet.md` ;
- `24_lot_D_phase_D3_parametre_master_complet.csv` ;
- `25_lot_D_phase_D3_mapping_source_complet.csv` ;
- `26_lot_D_phase_D3_parametres_quarantaine.md` ;
- `27_lot_D_phase_D3_parametres_ambigus.md` ;
- `28_lot_D_phase_D3_unites_et_attributs.md` ;
- `29_lot_D_phase_D3_regles_parsing_QA.md` ;
- `30_sql_lot_D_D3_metadata_full_propose.sql` ;
- `31_rapport_controle_D3.md`.

Statut : `PENDING VALIDATION`.

Aucune table `metadata` n'a été créée ou modifiée en D3. STOP obligatoire avant exécution metadata ou Lot E.

## Phase D3.1 - Corrections ciblées produites

La Phase D3.1 corrige le référentiel D3 avant validation finale :
- Fe/Mn ne sont plus mis en quarantaine automatiquement pour absence de forme chimique ;
- les variantes météo évidentes sont rattachées à `PRECIPITATION`, `T_AIR` et `EVAPORATION` ;
- les variantes conductivité sont enrichies avec `temperature_reference` ;
- les sorties SWAT/WASP sont isolées dans la famille `modeles` avec action `A_VALIDER_MODELE` ;
- un tableau réduit des arbitrages métier restants est produit.

Fichiers :
- `32_lot_D_phase_D3_1_corrections_ciblees.md` ;
- `33_lot_D_phase_D3_1_parametre_master_corrige.csv` ;
- `34_lot_D_phase_D3_1_mapping_source_corrige.csv` ;
- `35_lot_D_phase_D3_1_reste_a_valider_metier.md` ;
- `36_rapport_controle_D3_1.md` ;
- `37_sql_lot_D_D3_1_metadata_corrige_propose.sql`.

Statut : `PENDING VALIDATION`.

Aucune table `metadata` n'a été créée ou modifiée en D3.1. STOP obligatoire avant exécution metadata ou Lot E.
