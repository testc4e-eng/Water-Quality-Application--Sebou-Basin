# Strategie d'ingestion, validation et versionning SWAT/WASP

| Champ | Valeur |
|---|---|
| Statut | Cible |
| Type | strategie |
| Snapshot | 2026-06-04 |

## Principe

L'integration SWAT/WASP ne doit pas passer directement des fichiers scientifiques vers les dashboards.

La chaine cible est :

```text
package scientifique -> staging brut -> controle structurel -> controle metier -> validation scientifique -> vues d'exposition -> frontend/API
```

## Etapes

### 1. Ingestion brute

- depot des fichiers sources dans un emplacement versionne ;
- enregistrement d'un `run_id`, `scenario_code`, `model_code`, `model_version`, `source_package_uri`, `lineage_hash` ;
- chargement dans des tables brutes dediees par modele.

### 2. Validation structurelle

Controles minimaux :

- presence des colonnes obligatoires ;
- types compatibles ;
- unicite minimale `(run_id, spatial_id, variable_code, date)` ;
- couverture spatiale attendue ;
- unites non nulles ;
- dates parseables.

### 3. Validation metier

Controles minimaux :

- scenario reconnu ;
- variable connue dans `metadata.ref_parametre_modele` ;
- coherence unite/variable ;
- coherences d'intervalles basiques ;
- coherence spatiale avec le referentiel geometrique cible.

### 4. Validation scientifique

Gate explicite :

```text
PENDING_SCIENTIFIC_VALIDATION -> VALIDATED_SCIENTIFIC
```

Tant que cette transition n'est pas franchie :

- aucun mapping n'est active ;
- aucune restitution officielle n'est autorisee ;
- aucune feature ML officielle n'est construite.

## Versionning

### Niveaux

| Niveau | Portee |
|---|---|
| `model_version` | version du moteur scientifique |
| `scenario_code` | scenario metier |
| `run_id` | execution unique |
| `lineage_hash` | signature technique du lot |
| `validation_status` | etat de promotion |

### Regles

- ne jamais ecraser un run valide ;
- ajouter un nouveau `run_id` a chaque livraison ;
- garder les runs rejetes avec statut explicite ;
- exposer un seul run actif par couple `(model_code, scenario_code, spatial_scope)` dans les vues applicatives.

## Points de branchement cibles

- referentiel modele : `metadata.ref_modele`, `metadata.ref_parametre_modele`, `metadata.ref_parametre_modele_mapping`
- vues applicatives futures : `api.v_swat_*`, `api.v_wasp_*`
- contrats frontend : routes dediees, separees des routes sandbox legacy

## Decision

```text
INGESTION_STRATEGY = SCIENCE_GATE_BEFORE_RUNTIME_EXPOSURE
```
