# Lot D - Phase D1 - Structure du référentiel paramètres

## Statut

Phase D1 exécutée en mode préparation uniquement, puis validée par l'utilisateur pour lancement D2.

Aucune table n'a été créée ou modifiée en base. Aucune donnée `staging.raw_*` n'a été transformée. Aucun chargement vers les tables finales n'a été exécuté.

## Objectif D1

Proposer la structure cible du référentiel paramètre nécessaire avant toute migration finale.

Le référentiel doit permettre de décider, pour chaque paramètre source :
- son nom canonique ;
- son symbole ;
- son unité standard ;
- son type métier ;
- sa règle de parsing ;
- son statut de migration ;
- sa mise en quarantaine si une information obligatoire manque.

## Sources utilisées

| Source | Usage |
|---|---|
| `docs/39_inventaire_parametres_metier_REGEN/08_tableau_validation_metier.csv` | inventaire propre des paramètres et unités détectées |
| `docs/40_enrichissement_normes_seuils_ABH/03_tableau_seuils_ABH.csv` | seuils et normes ABH proposés, non validés automatiquement |
| `docs/42_analyse_parametres_valeurs_migration/06_tableau_decision_migration_parametres.csv` | statut mapping, unités, valeurs et décision migration |
| `docs/retour equipe metier.xlsx` | variantes et noms standards métier |
| `abh_sad.staging.raw_*` | lecture seule pour confirmer les paramètres sources, volumes et exemples |

## Etat actuel metadata

Lecture catalogue réalisée en read-only.

| Objet | Etat constaté | Décision D1 |
|---|---|---|
| `metadata.parametre_master` | absent | créer comme référentiel canonique cible |
| `metadata.unites` | absent | créer comme référentiel unités et conversions |
| `metadata.seuils` | absent | créer comme référentiel seuils/normes |
| `metadata.mapping_parametre_source` | existe, ancien modèle | conserver jusqu'à validation finale, ne pas écraser |
| `metadata.mapping_parametre_source_new` | absent | créer comme nouveau mapping de travail |
| `metadata.referentiel_parametre` | existe, ancien modèle | conserver en archive/compatibilité, non source officielle de migration |

## Règle métier obligatoire

Chaque paramètre doit avoir :
- `nom_canonique` ;
- `symbole` ;
- `unite_standard` ;
- `type_metier` ;
- `regle_parsing`.

Si une information obligatoire manque :
- `statut_validation = QUARANTAINE` ;
- `flag = PARAMETRE_A_VALIDER` ;
- aucune migration finale autorisée pour les lignes concernées.

## Structure proposée

### 1. `metadata.unites`

Rôle : référentiel des unités, unités sources, unités standards et règles de conversion.

| Colonne | Rôle |
|---|---|
| `id_unite` | identifiant technique |
| `code_unite` | code unique normalisé, ex. `MG_L`, `UG_L`, `UFC_100ML` |
| `libelle_unite` | libellé lisible, ex. `mg/L` |
| `dimension_unite` | concentration, température, microbiologie, débit, volume, sans_unite |
| `unite_standard` | unité de référence pour la dimension |
| `facteur_conversion` | facteur multiplicatif vers l'unité standard si connu |
| `offset_conversion` | offset éventuel, ex. température |
| `expression_conversion` | règle lisible si conversion non simple |
| `statut_validation` | `A_VALIDER`, `VALIDEE`, `QUARANTAINE` |
| `source_validation` | fichier ou décision métier |

### 2. `metadata.parametre_master`

Rôle : référentiel canonique unique des paramètres métier.

| Colonne | Rôle |
|---|---|
| `id_parametre` | identifiant technique |
| `code_parametre` | code canonique unique |
| `nom_canonique` | nom métier officiel |
| `symbole` | symbole court, ex. `NH4+`, `NO3-`, `pH` |
| `type_metier` | qualité eau, hydrologie, pollution, bactério, physico-chimique, météo, modèle |
| `theme` | famille métier |
| `sous_theme` | sous-famille métier |
| `id_unite_standard` | lien vers `metadata.unites` |
| `unite_standard` | copie lisible de l'unité validée |
| `regle_parsing` | règle principale de parsing |
| `variantes_associees` | variantes métier connues |
| `statut_validation` | `OK`, `AMBIGU`, `NON_RECONNU`, `QUARANTAINE`, `A_VALIDER` |
| `flag` | `VALID`, `PARAMETRE_A_VALIDER`, `UNITE_A_VALIDER`, `PARAMETRE_AMBIGU` |
| `niveau_confiance` | élevé, moyen, faible |
| `source_decision` | fichier ou décision ABH |

### 3. `metadata.mapping_parametre_source_new`

Rôle : rattacher chaque paramètre observé dans une table source ou raw au paramètre canonique, sans écraser l'ancien `metadata.mapping_parametre_source`.

| Colonne | Rôle |
|---|---|
| `id_mapping` | identifiant technique |
| `source_base` | base source, ex. `abh_sebou_ismail` |
| `source_schema` | schéma source ou raw |
| `source_table` | table source |
| `source_column_parametre` | colonne contenant le paramètre si table longue |
| `source_column_valeur` | colonne contenant la valeur |
| `parametre_source` | libellé exact observé |
| `parametre_source_normalise` | normalisation automatique |
| `id_parametre` | lien vers `metadata.parametre_master` |
| `id_unite_source` | unité source si détectée |
| `unite_source_libelle` | unité source brute |
| `mapping_status` | `MAPPED`, `AMBIGUOUS`, `UNMAPPED`, `QUARANTINE` |
| `mapping_confidence` | confiance du rattachement |
| `regle_parsing_appliquee` | règle de parsing proposée |
| `qa_flags` | flags qualité associés |
| `volume_total` | volume concerné |
| `nb_non_numerique` | volume de valeurs non numériques |
| `exemples_valeurs` | exemples pour audit |

### 4. `metadata.seuils`

Rôle : stocker les seuils ABH ou autres normes, sans validation automatique.

| Colonne | Rôle |
|---|---|
| `id_seuil` | identifiant technique |
| `id_parametre` | paramètre concerné |
| `type_eau` | eaux de surface, rivières, lacs, souterraines |
| `source_norme` | document source |
| `page_norme` | page PDF ou référence |
| `classe_qualite` | excellente, bonne, moyenne, mauvaise, très mauvaise |
| `seuil_min` | borne minimale si applicable |
| `seuil_max` | borne maximale si applicable |
| `id_unite` | unité du seuil |
| `sens_interpretation` | plus petit = meilleur, plus grand = meilleur, intervalle optimal |
| `statut_validation` | `A_VALIDER`, `VALIDEE`, `REJETEE` |

## Règles de parsing proposées

| Cas | Règle | Flag |
|---|---|---|
| Virgule décimale | convertir `,` en `.` | `DECIMAL_COMMA_CONVERTED` |
| Notation `x10n` | convertir en notation scientifique | `SCIENTIFIC_NOTATION_CONVERTED` |
| Notation `.10n` | convertir en notation scientifique | `SCIENTIFIC_NOTATION_CONVERTED` |
| `<x` | valeur numérique `x` + limite basse | `BELOW_DETECTION_LIMIT` |
| `>x` | valeur numérique `x` + limite haute | `ABOVE_DETECTION_LIMIT` |
| Texte non interprétable | quarantaine | `NON_NUMERIC_QUARANTINE` |
| Unité absente | quarantaine ou validation unité | `UNIT_MISSING` |
| Paramètre sans champ obligatoire | quarantaine | `PARAMETRE_A_VALIDER` |

## Statuts de décision

| Statut | Signification | Migration finale |
|---|---|---|
| `OK` | paramètre complet et validé | autorisée |
| `AMBIGU` | plusieurs interprétations possibles | bloquée |
| `NON_RECONNU` | non présent dans référentiel métier | bloquée |
| `QUARANTAINE` | information obligatoire manquante | bloquée |
| `A_VALIDER` | décision métier attendue | bloquée |

## Points bloquants avant D2

- Valider la structure proposée.
- Confirmer si `metadata.referentiel_parametre` doit être remplacée, conservée en archive, ou synchronisée avec `metadata.parametre_master`.
- Confirmer la liste fermée des `type_metier`.
- Confirmer les règles de conversion d'unités critiques : `mg/L`, `µg/L`, `UFC/100 mL`, `mgO2/L`, `mgN/L`, `mgP/L`.
- Confirmer que les paramètres incomplets doivent bien être automatiquement classés `QUARANTAINE`.

## Prochaine étape après validation

Phase D2 : générer un échantillon de 20 à 30 paramètres consolidés avec mapping réel depuis les fichiers métier et les tables `staging.raw_*`, puis STOP pour validation humaine.
