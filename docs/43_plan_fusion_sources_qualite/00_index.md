# Audit & Plan de Fusion des Sources Qualité

- **Objectif** : Évaluer la faisabilité et proposer une stratégie de fusion pour 4 tables majeures de qualité (Sebou sentinelles, Rivières, Barrage, Garde).
- **Périmètre** : Audit DB `abh_sad` en lecture seule (Phase 1).
- **Tables cibles** :
  1. `qualite.mesure_qualite_sebou`
  2. `qualite.mesure_qualite_riviere`
  3. `qualite.mesure_qualite_barrage`
  4. `qualite.suivi_qualite_barrage_garde_hebdo`
- **Recommandation finale** : Création d'une table cible `qualite.mesure_qualite_unifiee` précédée d'un plan de staging strict, d'une phase de Dry-Run via des vues, et de validations fonctionnelles (aucun écrasement immédiat).
