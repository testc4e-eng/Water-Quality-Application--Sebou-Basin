# Contrat d'integration SWAT

| Champ | Valeur |
|---|---|
| Statut | Cible |
| Type | contrat d'integration |
| Snapshot | 2026-06-04 |

## Positionnement

Au 2026-06-04, aucun resultat SWAT valide pour usage officiel n'est disponible dans la plateforme.

Le chantier SWAT ne bloque donc plus techniquement la preproduction du SAD.

Il devient une dependance metier externe, a raccorder via contrat explicite lorsque Reda livre un lot valide.

## Contrat minimal attendu

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `model_code` | texte | oui | `SWAT` |
| `model_version` | texte | oui | version du moteur ou package scientifique |
| `run_id` | texte | oui | identifiant unique du run |
| `scenario_code` | texte | oui | scenario stable cote metier |
| `scenario_label` | texte | oui | libelle lisible |
| `calibration_status` | texte | oui | `DRAFT`, `CALIBRATED`, `VALIDATED_SCIENTIFIC` |
| `validation_owner` | texte | oui | responsable scientifique |
| `validation_date` | date | non | date de validation |
| `spatial_granularity` | texte | oui | `SUBBASIN`, `REACH`, `STATION_PROXY` |
| `subbasin_id` | texte | oui si `SUBBASIN` | identifiant spatial SWAT |
| `reach_id` | texte | oui si `REACH` | identifiant reach |
| `date` | date | oui | pas de temps journalier ou mensuel |
| `variable_code` | texte | oui | code variable SWAT |
| `value` | numerique | oui | valeur simulee |
| `unit` | texte | oui | unite scientifique verifiee |
| `qa_status` | texte | oui | `RAW`, `CHECKED`, `VALIDATED_SCIENTIFIC`, `REJECTED` |
| `lineage_hash` | texte | oui | hash de lineage du lot |
| `source_package_uri` | texte | non | chemin ou URI du paquet source |

## Regles d'acceptation

1. aucun run SWAT ne devient officiel sans `calibration_status = VALIDATED_SCIENTIFIC` ;
2. aucune variable n'est mappee vers le canonique sans unite verifiee ;
3. aucun segment/subbasin n'est consomme sans table de correspondance spatiale versionnee ;
4. les resultats restent hors KPI officiels et hors dashboards DG tant que `qa_status != VALIDATED_SCIENTIFIC`.

## Point d'atterrissage cible

Les metadonnees de modele doivent s'appuyer sur :

- `metadata.ref_modele`
- `metadata.ref_parametre_modele`
- `metadata.ref_parametre_modele_mapping`

Les resultats de run doivent etre isoles dans un schema de staging ou de sorties modele versionne, puis promus vers des vues `api.*` dediees uniquement apres validation.

## Strategie d'exposition

- niveau 1 : staging brut, lecture reservee data/science ;
- niveau 2 : QA technique ;
- niveau 3 : validation scientifique ;
- niveau 4 : vues d'exposition appliquees au frontend et aux analyses.

## Verdict d'integration

```text
SWAT_INTEGRATION_MODE = CONTRACT_FIRST_EXTERNAL_DEPENDENCY
```
