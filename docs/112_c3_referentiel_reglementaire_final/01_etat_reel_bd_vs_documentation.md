# Etat reel BD vs documentation

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | constat d'ecart |
| Source de verite | Oui |
| Date | 2026-06-04 |

## Regle

La preuve primaire est la base `abh_sad`. La documentation n'est utilisee ici que pour signaler les ecarts.

## Requetes SQL utilisees

```sql
SELECT count(*) FROM metadata.qualite_source_reglementaire;
SELECT count(*) FROM metadata.qualite_type_eau;
SELECT count(*) FROM metadata.qualite_classe_reglementaire;
SELECT count(*) FROM metadata.qualite_parametre_reglementaire;
SELECT count(*) FROM metadata.qualite_mapping_canonique_reglementaire;
SELECT count(*) FROM metadata.qualite_seuil_reglementaire;
SELECT count(*) FROM metadata.qualite_regle_classification;

SELECT count(*) FROM metadata.qualite_mapping_canonique_reglementaire WHERE actif = true;
SELECT count(*) FROM metadata.qualite_parametre_reglementaire WHERE actif = true AND classifiable IS true;
SELECT count(*) FROM metadata.qualite_parametre_reglementaire WHERE actif = true AND classifiable IS false;
SELECT count(*) FROM metadata.qualite_seuil_reglementaire WHERE actif = true;
SELECT count(*) FROM metadata.qualite_type_eau WHERE actif = true AND statut_operationnel = 'REGLEMENTAIRE_OPERATIONNEL';
```

## Etat BD reel

| Objet | Resultat |
|---|---:|
| Sources reglementaires | `1` |
| Types d'eau | `4` |
| Classes | `5` |
| Parametres reglementaires | `41` |
| Mappings reglementaires | `41` |
| Mappings actifs | `36` |
| Seuils | `205` |
| Seuils actifs | `177` |
| Regles de classification | `5` |
| Parametres classifiables actifs | `36` |
| Parametres non classifiables actifs | `5` |
| Types d'eau operationnels | `1` |

## Ecart majeur avec l'ancienne documentation

L'ancien statut documentaire affirmant `DDL_DEV_APPLIQUE__SEUILS_NON_CHARGES` est faux au regard de la BD reelle.

Le statut reel est :

```text
REFERENTIEL_CHARGE_ET_RUNTIME_ACTIF
```

## Source active verifiee

| Code source | Version | Titre | Statut | Validation |
|---|---|---|---|---|
| `ABH_QUALITE_EAUX_SURFACE_TABLEAU_1` | `REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19` | Tableau n°1 - Grille generale d'evaluation de la qualite des eaux de surface | `REGLEMENTAIRE_OPERATIONNEL` | `VALIDATED_DEV` |
