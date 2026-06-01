# LOT 3A : Audit A/B détaillé — Chroniques de Débits (Hydro)

## 1. Résumé Global et Périmètre
Ce lot concerne uniquement les données quantitatives des cours d'eau en domaine superficiel hydrologique, segmentées en deux grains temporels.

### Tables Cibles et Sources visées
- **Sandbox (Source) -> Prod (Cible)**
  - `abh_sebou_070426.public.mesures_debit_jr` ➔ `abh_sad.hydro.mesure_debit` (Valeurs Infrajournalières ou Journalières)
  - `abh_sebou_070426.public.mesures_debit_m` ➔ `abh_sad.hydro.mesure_debit_mensuel` (Valeurs Mensuelles Agrégées)

## 2. Volumétrie et Profil Temporel
### A. Grain Journalier (`mesures_debit_jr`)
- **Volume Sandbox** : 521433 lignes
- Plage Temporelle Source : Période s'étendant du 1956-09-01 au 2025-08-31
- *Volume actuel en Cible (`hydro.mesure_debit`)* : 521433 lignes (du 1956-09-01 00:00:00+00:00 au 2025-08-31 01:00:00+00:00)

### B. Grain Mensuel (`mesures_debit_m`)
- **Volume Sandbox** : 19316 lignes
- Plage Temporelle Source : Période s'étendant du 1935 au 2024
- *Volume actuel en Cible (`hydro.mesure_debit_mensuel`)* : 19316 lignes (du 1935-02-01 au 2024-08-01)

## 3. Analyse des Failles Métier et Dépendance aux Stations
**La dépendance au Référentiel (Lot 2) est absolue :** Les tables brutes stockent la clé `ire_station` sous format String, tandis que la production exige la clé étrangère entière `station_id`.

### Relevé des Anomalies Sources (Brutes)
- 🔴 Valeurs Négatives Incohérentes : 1931 lignes (jr), 0 lignes (mensuelles).

## 4. Stratégie Proposée de Clef et Alignement (Avant Dry-Run)
1. **Clé Primaire Upsert** : La contrainte temporelle est forte. La combinaison **`(Mapping(ire_station -> station_id), date_mesure)`** constituera l'indice UNIQUE d'évitement des doublons.
2. **Gestion des Nulls Critiques** : Si un champ `valeur_m3s` est null, la source de l'événement sera rejetée (`WOULD_SKIP`) ou flaggée, la valeur chronologique vide n'ayant aucune valeur hydrologique opérationnelle sur le Sad.
3. **Mécanique Idempotente** : Les 521k lignes déjà en `abh_sad` (M2/M3 legacy) exigeront la prudence absolue de ne rajouter que le delta qualifié issu de `abh_sebou_070426`.
