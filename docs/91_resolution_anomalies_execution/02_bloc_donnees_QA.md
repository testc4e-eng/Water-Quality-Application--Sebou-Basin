# Bloc 2 - Donnees et QA

## 1. Resume executif

Les anomalies QA ne bloquent pas la migration. Les valeurs negatives debit/qualite sont deja flaggees. Les valeurs evaporation nulles et pollution non numerique doivent etre documentees ou filtrees, avec retour client si une valeur numerique est attendue.

## 2. Tableau des anomalies du bloc

| ID | Anomalie | Volume | Classe actuelle | Diagnostic | Decision cible | Action |
|---|---|---:|---|---|---|---|
| QA-001 | valeurs nulles evaporation | 10308 | TRAITABLE_C4E / CLIENT_REQUIRED | reparties sur stations, dates 2013-2024 | A_PROPOSER_CORRECTION_C4E | flag QA + filtrage dashboard propose |
| QA-002 | pollution `valeur_num` null/non numerique | 3447 | TRAITABLE_C4E / CLIENT_REQUIRED | `valeur_raw = '-'` pour 3447 lignes | A_PROPOSER_CORRECTION_C4E | classer comme valeur manquante explicite |
| QA-003 | valeurs negatives debit | 2087 | BACKLOG_TECHNIQUE | 2087/2087 deja flaggees | CLOTURE_SANS_ACTION | conserver QA flag, filtrer selon usage |
| QA-004 | valeurs negatives qualite | 2 | BACKLOG_TECHNIQUE | 2/2 deja flaggees | BACKLOG_TECHNIQUE | revue metier ponctuelle |
| QA-005 | temperature vide | 0 | CLIENT_REQUIRED | table cible vide | CLIENT_REQUIRED | demander donnees ou confirmation absence |

## 3. Cas traitables immediatement

Aucun sans validation. Les traitements recommandes sont non destructifs : ajout de classification QA ou vues de filtrage.

## 4. Cas necessitant validation client

- `QA-005` : confirmer absence de temperature ou fournir fichiers.
- `QA-001` : si le client possede evaporation manquante, transmettre source.
- `QA-002` : confirmer que `-` signifie donnees absentes et non zero.

## 5. Cas hors perimetre / legacy

Aucun.

## 6. Requetes SELECT utilisees

```sql
SELECT COUNT(*) FROM meteo.mesure_evaporation WHERE valeur IS NULL;
SELECT valeur_raw, valeur_qualifier, COUNT(*) FROM qualite.source_pollution_mesure_param WHERE valeur_num IS NULL GROUP BY valeur_raw, valeur_qualifier;
SELECT COUNT(*) FROM hydro.mesure_debit WHERE valeur < 0;
SELECT COUNT(*) FROM meteo.mesure_temperature;
```

## 7. Corrections proposees mais non executees

Voir `06_actions_correctives_proposees.md`, propositions `SQL-PROP-QA-001` et `SQL-PROP-QA-002`.

## 8. Points a valider avant execution

- confirmer statut de `-` en pollution
- choisir entre update QA flags ou vue de filtrage
- obtenir retour client sur temperature et evaporation

