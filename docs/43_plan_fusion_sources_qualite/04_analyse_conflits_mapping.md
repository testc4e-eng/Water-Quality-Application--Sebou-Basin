# Analyse des Conflits & Mapping

Lors du rapprochement des tables, les conflits suivants émergent :

- **Même station avec noms différents** : 
  - Ex: `aval rejet sucrerie bel ksiri` (dans `riviere`) vs `aval bel ksiri` (alias métier). Résolu par l'usage exclusif de `api.v_station_dimension`.
- **Même IRE dans plusieurs tables** :
  - 3695/8 présent à la fois dans `sebou` et `riviere`. Risque de doublonnage sévère si jointure UNION non dédoublonnée.
- **Paramètres avec codes différents** :
  - `NO3` vs `Nitrates` vs `NO3-`. Nécessite l'appui strict sur `metadata.qualite_parametre_reglementaire` pour standardisation lors de l'insertion dans la table unifiée.
- **Unités divergentes** :
  - `mg/l` vs `mg/L` vs `mgO2/L`. 
- **Station présente dans les mesures mais absente du référentiel** :
  - Historique ancien (années 80/90) de `riviere`.
- **Valeurs suspectes** :
  - Valeurs négatives (ex: -9999 pour marquer l'absence). Doivent être nullifiées lors de la fusion.
