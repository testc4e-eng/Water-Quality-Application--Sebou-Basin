# Bloc 1 - Referentiel qualite / parametres

## 1. Resume executif

Le bloc referentiel qualite contient les anomalies les plus actionnables par C4E. Aucune correction n'a ete executee. Les volumes confirment un besoin de mapping parametre et d'enrichissement referentiel.

## 2. Tableau des anomalies du bloc

| ID | Anomalie | Volume | Classe actuelle | Diagnostic | Decision cible | Action |
|---|---|---:|---|---|---|---|
| REF-001 | `parametre_ref_id` null riviere | 17287 | TRAITABLE_C4E | top codes : `COND`, `O2_DISSOUS`, `PT`, `NO3`, `PO4` | A_PROPOSER_CORRECTION_C4E | proposer mapping alias vers canonique |
| REF-002 | `parametre_ref_id` null nappe | 13270 | TRAITABLE_C4E | top codes : `COND`, `HCO3`, `NO3`, `NO2`, `RESIDUS_SECS` | A_PROPOSER_CORRECTION_C4E | proposer mapping alias vers canonique |
| REF-003 | `parametre_ref_id` null Sebou | 31277 | TRAITABLE_C4E | volume confirme | A_PROPOSER_CORRECTION_C4E | diagnostiquer codes dominants puis mapping |
| REF-004 | `parametre_ref_id` null garde hebdo | 539 | TRAITABLE_C4E | volume confirme | A_PROPOSER_CORRECTION_C4E | mapping parametre barrage/garde |
| REF-005 | unites manquantes referentiel canonique | 59 | TRAITABLE_C4E | exemples : `AZOTE_ORG`, `CA`, `COND`, `DBO5` | A_PROPOSER_CORRECTION_C4E | enrichir `unite_reference` par dictionnaire |
| REF-006 | `table_cible` manquante referentiel canonique | 87 | TRAITABLE_C4E | volume confirme | A_PROPOSER_CORRECTION_C4E | renseigner table cible ou classer hors restitution |
| REF-007 | mappings parametres orphelins audit | 5 | TRAITABLE_C4E | volume confirme | A_PROPOSER_CORRECTION_C4E | arbitrage technique par alias |
| REF-008 | parametres legacy riviere non resolus | 39 | TRAITABLE_C4E | volume confirme | A_PROPOSER_CORRECTION_C4E | fusion/alias |
| REF-009 | parametres suivi Sebou non resolus | 7 | TRAITABLE_C4E | volume confirme | A_PROPOSER_CORRECTION_C4E | fusion/alias |

## 3. Cas traitables immediatement

Aucun cas ne doit etre corrige immediatement sans validation, car les corrections toucheraient le referentiel ou des FK metier. Les cas sont cependant fortement candidats a correction C4E.

## 4. Cas necessitant validation client

Aucun cas client obligatoire identifie a ce stade. Si un code parametre reste ambigu apres rapprochement par alias, il devra basculer en `CLIENT_REQUIRED`.

## 5. Cas hors perimetre / legacy

Aucun dans ce bloc.

## 6. Requetes SELECT utilisees

```sql
SELECT COUNT(*) FROM qualite.mesure_qualite_riviere WHERE parametre_ref_id IS NULL;
SELECT COUNT(*) FROM qualite.mesure_qualite_nappe WHERE parametre_ref_id IS NULL;
SELECT COUNT(*) FROM qualite.mesure_qualite_sebou WHERE parametre_ref_id IS NULL;
SELECT COUNT(*) FROM qualite.suivi_qualite_barrage_garde_hebdo WHERE parametre_ref_id IS NULL;
SELECT COUNT(*) FROM metadata.referentiel_parametre_canonique WHERE statut='ACTIF' AND NULLIF(TRIM(unite_reference),'') IS NULL;
SELECT COUNT(*) FROM metadata.referentiel_parametre_canonique WHERE statut='ACTIF' AND NULLIF(TRIM(table_cible),'') IS NULL;
```

## 7. Corrections proposees mais non executees

Voir `06_actions_correctives_proposees.md`, propositions `SQL-PROP-REF-001` a `SQL-PROP-REF-003`.

## 8. Points a valider avant execution

- confirmer dictionnaire d'alias qualite
- confirmer unites de reference
- backup tables qualite et referentiel
- script idempotent par cles metier, sans `ctid`
- controle post-update des volumes `parametre_ref_id IS NULL`

