# Récapitulatif d'Exécution — BLOC 3 (Corrections & Migrations)
**Date :** 15 Avril 2026

## Contexte
Ce document archive l'état d'avancement des migrations et corrections réalisées dans le cadre de la consolidation de la base de données WQDSS / SAD Sebou.

## État des Lieux du BLOC 3
Le bloc 3 a été exécuté en suivant une politique stricte d'audit préalable (Read-Only) avant de lancer d'éventuelles insertions.

### 1. M1 + M5 : Audit et complétion Précipitation
- **Constat** : 123 873 lignes manquantes de la base `staging.mesures_precip` vers `meteo.mesure_precipitation`.
- **Résultat de l’audit** : 123 508 sur les 123 873 ne contiennent aucune donnée (valeur `NULL`). Seules 365 lignes utiles sont absentes sur une vaste durée.
- **Décision (M5)** : Complétion massive annulée car non justifiée métier. 

### 2. M2 : Migration Évaporation Journalière
- **Source** : `staging.mesures_evaporation_jr` (48 900 lignes).
- **Cible** : `meteo.mesure_evaporation`.
- **Résultat** : Migration entièrement validée idempotente. Toutes les lignes pertinentes étaient déjà correctement insérées. (0 action requise).

### 3. M3 : Migration Garde Hebdo (Qualité)
- **Source** : `staging.suivi_qualite_brg_garde_hebdo` (7 094 lignes concernées).
- **Cible** : `qualite.mesure_qualite_barrage`.
- **Action retenue** : Malgré le fait que le code station (`ire_station`) soit `NULL` pour tout le fichier, l'origine a été inférée métierement sur la station "brg garde du sebou" (UUID assigné explicitement). 
- **Résultat** : Les 7 094 lignes ont été injectées avec succès avec un marqueur traçable `qa_flag_station_unmapped` = true.

### 4. M4 : Audit Débit Source
- **Source étudiée** : `staging.mesures_debit_sources` en mode strict READ-ONLY.
- **Constat** : 2 816 lignes, 19 stations source dont 14 orphelines (introuvables dans l'infrastructure de réference). Aucune valeur nulle de débit localisée mais 105 mesures "aberrantes" (≤ 0).
- **Décision** : Le volume global ne représentant que 0.5% du référentiel hydrologique (`hydro.mesure_debit` qui contient 521 433 lignes) associé au coût d'intégration (créer 14 stations factices sur 25 ans d'historique). Laissé en statut Legacy. Migration annulée.

## Synthèse Finale
Les consolidations hydriques des modèles wasps et flux réels ont été clôturées avec une attention maximale sur la cohérence structurelle (absence de doublons / mappage complet). Les tables orphelines dans `staging` restantes pour ce cycle sont dorénavant assumées "legacy".
