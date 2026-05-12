# Proposition modele referentiel v2

## Objectif v2

Faire du referentiel canonique la source centrale pour :

- normalisation ingestion
- mapping parametre
- QA
- dashboards
- IA/LLM
- analyses qualite
- interop SWAT/WASP future

## Source metier prioritaire

Le fichier `parametre_standariser.csv` fourni par C4E doit etre reference comme dictionnaire metier prioritaire.

Implications :

- les variantes observees deviennent des alias historises ;
- les resolutions C4E priment sur le matching textuel SQL ;
- les cas `NTK`, `PT`, `F`, `CN`, `Clostri`, `CO2_libre`, `H2S`, `Pseudo_aer`, `Vibrio`, `Germe_22`, `Germe_37`, `Cl2_res`, `SiO2`, `SiO3`, `H_G`, `DBO5_dec2h`, `PT decante` et `CR/CrT` sortent du statut ambigu ;
- seuls `MO_METAL`, `FM/F_M_mes` et `MD` restent sous validation client/C4E.

## Colonnes a ajouter ou formaliser

| Colonne | Type propose | Role |
|---|---|---|
| `type_parametre` | text | physicochimie, microbiologie, organoleptique, hydrologie, meteo, pollution |
| `unite_si` | text | unite SI si conversion possible |
| `unite_affichage` | text | unite dashboard |
| `alias_normalized` | generated/index ou table secondaire | recherche robuste |
| `critique_dashboard` | boolean | affichage prioritaire |
| `critique_ia` | boolean | usage IA |
| `ingestion_required` | boolean | obligatoire ingestion |
| `legacy_compatible` | boolean | accepte aliases legacy |
| `validation_status` | text | `VALIDE`, `A_VALIDER_C4E`, `CLIENT_REQUIRED`, `LEGACY` |
| `version_ref` | integer | version referentiel |
| `updated_at` | timestamptz | audit |
| `updated_by` | text | audit |
| `source_metier_prioritaire` | text | reference du dictionnaire ayant arbitre le parametre |
| `decision_mapping` | text | mapping sur, alias a ajouter, nouveau parametre, ambigu confirme |
| `exposition_dashboard` | text | expose, masque, quarantaine |
| `exposition_ia` | text | utilisable, utilisable avec avertissement, exclu |

## Tables secondaires proposees

| Table | Role |
|---|---|
| `metadata.referentiel_parametre_alias` | alias historises et types alias |
| `metadata.referentiel_parametre_unite_conversion` | conversions explicites |
| `metadata.referentiel_parametre_validation_log` | journal decisions metier |
| `metadata.referentiel_parametre_source_metier` | dictionnaires sources, versions, proprietaires |

## Index proposes

```sql
CREATE INDEX idx_ref_param_canonique_aliases_gin
ON metadata.referentiel_parametre_canonique
USING gin (aliases);

CREATE INDEX idx_ref_param_canonique_dashboard
ON metadata.referentiel_parametre_canonique (categorie_dashboard, statut);
```

## Contraintes proposees

- `validation_status IN ('VALIDE','A_VALIDER_C4E','CLIENT_REQUIRED','LEGACY','INACTIF')`
- `type_parametre IN ('physicochimie','microbiologie','organoleptique','hydrologie','meteo','pollution','indicateur biologique','infrastructure','geometrie','analytique','calcule','QA')`
- alias unique par parametre dans table secondaire, avec detection collision globale.
- `decision_mapping IN ('MAPPING_SUR','ALIAS_A_AJOUTER','NOUVEAU_PARAMETRE','AMBIGU_CONFIRME','LEGACY','EXCLUSION_DASHBOARD')`
- `exposition_dashboard IN ('EXPOSE','MASQUE','QUARANTAINE')`

## Regle de reconciliation

Quand une variante C4E correspond a un parametre existant :

- ne pas creer de doublon ;
- enrichir `aliases`, `unite_reference`, `sous_domaine`, `famille`, `description_metier` ;
- journaliser la source `parametre_standariser.csv`.

Quand le parametre C4E n'existe pas :

- creer un nouveau code canonique ;
- conserver toutes les variantes comme alias ;
- mettre `source_origine = dictionnaire_metier_C4E` ;
- classer dashboard/IA selon criticite.

Quand le dictionnaire C4E signale une validation client :

- ne pas exposer dashboard ;
- ne pas corriger automatiquement les mesures ;
- conserver en quarantaine ou backlog metier.
