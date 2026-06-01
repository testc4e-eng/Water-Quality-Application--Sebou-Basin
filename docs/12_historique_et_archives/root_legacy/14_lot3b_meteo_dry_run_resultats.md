# LOT 3B : Bilan du Dry-Run - Métrologie Climatique

> ⚠️ *Simulation Read-Only RAM, appliquant le filtrage stricte des valeurs 100% vides.* 

## 1. Flux A : Pluviométrie Complétée (Obs / Nasa)
- 🟦 `WOULD_INSERT` : 0 chroniques vierges manquantes.
- 🟨 `WOULD_UPDATE` : 0 discordances de source/NASA repérées.
- 🟩 `WOULD_SKIP`   : 546007 jours identiques.
- 🟥 `WOULD_CONFLICT` : 0 orphelins (station mapping failli).
- ⚠️ `IGNORÉS (VIDES)` : 0 jours rejetés (aucun signal).

## 2. Flux B : Crues Anuelles (Maximales)
- 🟦 `WOULD_INSERT` : 0 points.
- 🟨 `WOULD_UPDATE` : 0 points.
- 🟩 `WOULD_SKIP`   : 1915 points.
- 🟥 `WOULD_CONFLICT` : 0 points.
- ⚠️ `IGNORÉS (VIDES)` : 170 années rejetées (aucun signal).

## 3. Flux C : Évaporation Physiques
- 🟦 `WOULD_INSERT` : 0 points.
- 🟨 `WOULD_UPDATE` : 0 points.
- 🟩 `WOULD_SKIP`   : 38592 points.
- 🟥 `WOULD_CONFLICT` : 0 points.
- ⚠️ `IGNORÉS (VIDES)` : 10308 jours rejetés (aucun signal).


🚥 **DIAGNOSTIC : SYNCHRONE**. Les bases sont chimériquement égales sur ce périmètre météo (Abstraction faite de 10478 rejets orphelins filtrés).