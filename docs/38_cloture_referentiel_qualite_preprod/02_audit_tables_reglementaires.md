# Audit tables réglementaires

## Tables réglementaires
| Table | Existe | Lignes | Statut |
|---|---|---|---|
| metadata.qualite_source_reglementaire | Oui | 1 | OK |
| metadata.qualite_type_eau | Oui | 4 | OK |
| metadata.qualite_classe_reglementaire | Oui | 5 | OK |
| metadata.qualite_parametre_reglementaire | Oui | 41 | OK |
| metadata.qualite_mapping_canonique_reglementaire | Oui | 41 | OK |
| metadata.qualite_seuil_reglementaire | Oui | 205 | OK |
| metadata.qualite_regle_classification | Oui | 5 | OK |


## Tables de contexte inspectées
| Table | Lignes |
|---|---|
| metadata.referentiel_parametre | 107 |
| metadata.referentiel_parametre_canonique | 108 |
| metadata.mapping_parametre_source | 205 |
| qualite.mesure_qualite_riviere | 59534 |
| qualite.mesure_qualite_nappe | 63047 |
| qualite.mesure_qualite_barrage | 7820 |
| qualite.mesure_qualite_sebou | 49954 |
| qualite.suivi_qualite_barrage_garde_hebdo | 1780 |
| meteo.mesure_temperature | 0 |


## Couverture de la version active
Version : `REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19`

| Element | Total |
|---|---|
| sources | 1 |
| types_eau | 4 |
| classes | 5 |
| parameters | 41 |
| parameters_classifiable | 36 |
| mappings_active | 36 |
| thresholds | 205 |
| thresholds_active | 177 |
| rules | 5 |


## Statut paramètres
| Classifiable | Statut opérationnel | Actif | Validation | Nombre |
|---|---|---|---|---|
| True | REGLEMENTAIRE_CLASSIFIABLE | True | VALIDATED_DEV | 36 |
| False | OBSERVATIONNEL_NON_CLASSIFIABLE | True | VALIDATED_DEV | 5 |


## Statut seuils
| Actif | Validation | Nombre |
|---|---|---|
| True | VALIDATED_DEV | 177 |
| False | A_VALIDER | 25 |
| False | REJECTED | 3 |


## Intégrité référentielle contrôlée
- Paramètres réglementaires sans mapping canonique : 0.
- Seuils sans paramètre réglementaire : 0.
- FK critiques : pas d'anomalie détectée par les contrôles de jointure.
