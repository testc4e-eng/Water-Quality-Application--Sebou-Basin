# Modele parametrique propose

## Context

Le flux barrage journalier actif est aujourd'hui porte par un modele multi-colonnes. Cette structure ne supporte ni l'extension metier ni la traçabilite demandee pour la cloture.

## Analysis

- Cle actuelle : `(barrage_id, temps)`
- Cle cible recommandee : `(barrage_id, temps, parametre_code, scenario)`
- Source stable : `staging.raw_mesures_niv_eau_barrages.id`
- Mapping barrage stable : `metadata.mapping_barrage.legacy_ire_barrage -> barrage_id`
- Parametres sources verifies :
  - `niveau_eau_m_ngm` -> `NIVEAU_EAU`
  - `volume_mm3` -> `VOLUME`
  - `restitutions_mm3` -> `LACHER`
  - `apports_mm3` -> `APPORTS_HM3`
  - `transfert_mm3` -> `TRANSFERT`

## Solution

Table cible :

- `id uuid`
- `barrage_id uuid`
- `temps timestamptz`
- `parametre_code text`
- `parametre_ref_id uuid`
- `valeur numeric`
- `unite text`
- `source_donnee text`
- `scenario text`
- `scenario_id uuid`
- `metadata_json jsonb`
- `created_at timestamptz`
- `source_table text`
- `source_row_hash text`
- `target_business_key_hash text`

Contraintes recommandees :

- `PRIMARY KEY (id)`
- `UNIQUE (target_business_key_hash)`
- index `(barrage_id, temps desc, parametre_code)`
- index `(parametre_code, temps desc)`
- FK `barrage_id -> api.v_barrage_dimension.barrage_id` impossible en direct sur une vue, donc FK pratique vers table physique ou controle SQL explicite
- `temps NOT NULL` dans le modele final

Regles de transformation :

- `RESTITUTION` est officiellement reclassee en `LACHER`
- `LACHER` represente un volume journalier et non un debit
- l'unite de reference de `LACHER` est `Mm3/j`
- l'unite de reference de `APPORTS_HM3` est `Mm3/j`
- l'unite de reference de `TRANSFERT` est `Mm3/j`
- `VOLUME_BARRAGE` est traite comme alias legacy de `VOLUME`
- `scenario` est initialise a `ACTUEL`
- toute variante d'ecriture `HM3`, `Hm3`, `hm3` est harmonisee en `Mm3` dans la trace source puis exposee en `Mm3/j` pour les volumes journaliers

Controle metier obligatoire :

- aucun `LACHER` en `m3/s`
- aucun `APPORTS_HM3` en `m3/s`
- aucun `TRANSFERT` en `m3/s`
- aucun melange `debit instantane` / `volume journalier`

## Optional improvements

- ajouter une vue de compatibilite `api.v_hydro_niveau_barrage_journalier_v2`
- conserver `hydro.mesure_barrage` en lecture seule le temps d'une transition frontend/backend
- ajouter une table d'audit de recharge par lot
