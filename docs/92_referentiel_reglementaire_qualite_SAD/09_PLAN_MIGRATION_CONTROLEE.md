# Plan de migration contrôlée

## Phase 1 - Préparation

- Périmètre Tableau n°1 validé.
- Grilles simplifiées verrouillées `DOCUMENTAIRE_NON_OPERATIONNEL`.
- Décisions unités/mappings/Hg/palette reportées dans le référentiel documentaire.
- Geler la version réglementaire initiale.

## Phase 2 - Dry-run

- Exécuter les contrôles de `11_SQL_DRY_RUN_PREPARATION.sql` en lecture seule.
- Vérifier doublons, seuils incomplets, mappings manquants, unités conflictuelles.
- Vérifier la présence de `metadata.referentiel_parametre_canonique(parametre_ref_id)`.
- Vérifier les codes canoniques nécessaires : `BA`, `CHLA`, `CRT`, `AZOTE_TOT_KJELD`, `PHOSPHORE_TOTAL`, `PO4_3-`, `PHENOL`, `SE`, `O2_DISS`, `NO3-`.
- Produire un rapport Go/No-Go.

## Phase 3 - Migration contrôlée

- Appliquer le DDL validé en environnement DEV.
- Charger les classes, types d'eau, sources et seuils par script versionné.
- Journaliser batch, opérateur, source_document et version_reglementaire.
- Charger les vrais absents du canonique comme `OBSERVATIONNEL_NON_CLASSIFIABLE`, sans seuil moteur actif.

## Phase 4 - Validation fonctionnelle

- Tester `/quality/thresholds`, `/quality/classify`, `/quality/global-index`.
- Tester cas non classables.
- Vérifier la règle du paramètre le plus pénalisant.

## Phase 5 - Passage production

- Backup préalable.
- Migration transactionnelle.
- Rapport post-migration.
- Monitoring QA et rollback logique par version réglementaire inactive.
