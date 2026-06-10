# Contrat d'integration WASP

| Champ | Valeur |
|---|---|
| Statut | Cible |
| Type | contrat d'integration |
| Snapshot | 2026-06-04 |

## Positionnement

Au 2026-06-04, la plateforme expose encore un runtime `swat`/`swat_analysis` qui s'appuie en pratique sur `wasp_sebou.*` pour des usages sandbox et de comparaison.

Cela ne constitue pas un socle officiel de preproduction.

Le chantier WASP devient donc une dependance metier externe a contractualiser avec Anas.

## Contrat minimal attendu

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `model_code` | texte | oui | `WASP` |
| `model_version` | texte | oui | version du moteur |
| `run_id` | texte | oui | identifiant unique du run |
| `scenario_code` | texte | oui | scenario stable |
| `scenario_label` | texte | oui | libelle lisible |
| `calibration_status` | texte | oui | `DRAFT`, `CALIBRATED`, `VALIDATED_SCIENTIFIC` |
| `validation_owner` | texte | oui | responsable scientifique |
| `segment_id` | texte | oui | identifiant segment WASP |
| `date` | date | oui | date de simulation |
| `variable_code` | texte | oui | variable WASP |
| `value` | numerique | oui | valeur simulee |
| `unit` | texte | oui | unite scientifique verifiee |
| `qa_status` | texte | oui | `RAW`, `CHECKED`, `VALIDATED_SCIENTIFIC`, `REJECTED` |
| `lineage_hash` | texte | oui | hash du lot |
| `source_package_uri` | texte | non | emplacement du package source |

## Regles d'acceptation

1. un scenario WASP ne devient officiel qu'apres validation scientifique explicite ;
2. chaque `segment_id` doit etre raccorde a une geometrie de reference versionnee ;
3. les unites et la granularite temporelle doivent etre normalisees avant exposition ;
4. les routes sandbox existantes ne valent pas validation de contrat.

## Strategie de raccordement

- ingestion brute dans un schema de staging/resultats versionne ;
- controle de completude par scenario, segment, variable et date ;
- validation scientifique hors runtime applicatif ;
- exposition applicative via vues dediees distinctes des tables brutes.

## Relation avec le referentiel modele

Le referentiel C2-C doit etre le point d'ancrage des variables et mappings :

- `metadata.ref_modele`
- `metadata.ref_parametre_modele`
- `metadata.ref_parametre_modele_mapping`

Tous les mappings modele -> canonique doivent rester inactifs tant qu'ils n'ont pas ete valides scientifiquement.

## Verdict d'integration

```text
WASP_INTEGRATION_MODE = CONTRACT_FIRST_EXTERNAL_DEPENDENCY
```
