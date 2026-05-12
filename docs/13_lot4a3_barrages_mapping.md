# LOT 4A-3 : Plan de Mappage Qualité (Barrages et Suivi Hebdo)

## 1. Topologie des Ingestions Lentiques
Ce lot ambitionne de structurer les flux analytiques vers le dôme central de rétention des eaux. Deux sources Sandbox sont déversées dans la Production SAD.

### Flux 1 : `mesures_qualite_barrages` ➔ `qualite.mesure_qualite_barrage`
- **Clé Idempotente** : `[station_id, temps, parametre_ref_id]`
- **Moteur de validation** : 
  - 🟥 `WOULD_SKIP` si `val_qual_barr` est `NULL` (Règle ANO-LOT4A-002).
  - 🟥 `WOULD_CONFLICT` si le `ire_station` d'origine n'a aucune station physique mappable en Prod.
  - ⚠️ `qa_flag_negative = TRUE` si `val_qual_barr` < 0.
  - ☢️ `qa_flag_param_unmapped = TRUE` si le paramètre textuel n'a pas été formellement validé (Présent dans liste ambigue: `H_G`, `sat`, etc.).

### Flux 2 : `mesures_suivi_qualite_brg_garde_hebdo` ➔ `qualite.suivi_qualite_barrage_garde_hebdo`
- **Hypothèse Majeure Validée (`CAS_METIER_IMPLICITE`)** : Cette table s'affranchit du dictionnaire topographique WQDSS car son essence est liée exclusivement au Barrage Garde Sebou. Son insertion se fera sous contrainte algorithmique "Hardcoded".
- **Comportement exclusif assigné** :
  - `station_id` = **ID de la station nominale "Barrage Garde Sebou"** peu importe la colonne `ire_station`.
  - 🥇 `qa_flag_station_infered = TRUE` gravé par l'Upsert.
  - 🎖️ `source_mapping_rule = 'REGLE_FIXE_BARRAGE_GARDE_SEBOU'` gravé par l'Upsert.
- **Règles Sanitaires** :
  - Identiques au Flux 1 (Skip des NULLs, Tag négatif, ☢️ `qa_flag_param_unmapped` pour alias non-résolu).

## 2. Révélation et Diagnostic sur le Delta Structurel de Production
Dans l'audit A/B (Doc 12_lot4a3), il a été pointé que la `qualite.mesure_qualite_barrage` en Prod contenait **15 808 lignes** alors que la Sandbox ne présente que **8 714 lignes**. 
L'explication mathématique saute aux yeux d'un Data Engineer : **8 714 + 7 094 = 15 808**.
L'ancienne phase V1 de l'agence ABH a vraisemblablement **concaténé les deux tables analytiques** (`qualite_barrages` et `qualite_brg_garde_hebdo` qui contient bien 7094 tuples !) en une seule table globale dans le SI WQDSS de production ! 
Dès lors, le Dry-Run sur la table native `qualite_barrages` crachera très probablement un niveau `WOULD_SKIP/UPDATE` sur ses 8,7K lignes, mais dévoilera un excédent de prod qui lui est abstrait. La dissociation cible requise aujourd'hui (Flux 1 & Flux 2) cassera ces poupées russes pour restaurer un schéma sain.
