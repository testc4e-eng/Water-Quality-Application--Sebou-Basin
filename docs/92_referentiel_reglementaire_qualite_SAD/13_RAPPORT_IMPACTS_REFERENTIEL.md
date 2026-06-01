# Rapport d'impacts référentiel

## Impacts techniques

- Création future de 7 tables dans `metadata`.
- Aucun remplacement du référentiel canonique existant.
- Ajout d'une couche réglementaire reliée au canonique par mapping explicite.
- Les APIs qualité devront lire les seuils actifs et validés, pas les fichiers CSV.

## Impacts métier

- 41 paramètres Tableau n°1 deviennent candidats à la classification réglementaire.
- Les paramètres hors Tableau n°1 restent visibles mais non classifiables.
- La qualité globale devient auditée par la classe la plus pénalisante.
- Les décisions métier du 2026-05-19 lèvent les blocages d'unités et d'alias, mais les vrais absents du canonique restent non utilisables moteur.

## Impacts réglementaires

- La traçabilité `source_document`, `version_reglementaire`, `page/tableau`, `validation_metier` devient obligatoire.
- Les grilles simplifiées sont explicitement `DOCUMENTAIRE_NON_OPERATIONNEL`.
- Les conflits d'unités doivent être validés avant tout usage production.

## Risques

| Risque | Niveau | Mitigation |
|---|---|---|
| Mauvaise conversion d'unité | Haut | Validation métier + tests unitaires de classification |
| Mapping canonique ambigu | Haut | Table de mapping à statut, pas de classification si ambigu |
| Utilisation accidentelle des grilles simplifiées | Moyen | Statut `DOCUMENTAIRE_NON_OPERATIONNEL` et filtres API |
| Confusion `MO`/`Mo` | Haut | Pas de normalisation globale de casse |
| Seuil PDF mal lu | Moyen | Cas `Hg` arbitré métier; conserver la trace de la règle spécifique |
| Paramètre absent du canonique classé par erreur | Haut | Statut `absent_non_utilisable` et exclusion du moteur |

## Prochaines étapes production

1. Exécution dry-run en DEV.
2. Application DDL en DEV seulement.
3. Chargement contrôlé des données réglementaires.
4. Tests unitaires du moteur qualité, incluant conversions unités et règle `Hg`.
5. Tests API et dashboards sur palette SAD normalisée.
6. Go/No-Go pré-production.
