# Plan de nettoyage abh_sad avant migration

## Phase 0 - Backup obligatoire
- réaliser un dump complet de `abh_sad` avant toute action ;
- exporter en CSV chaque table classée `À archiver avant vidage` ;
- enregistrer les volumes avant traitement ;
- produire un hash ou contrôle d’intégrité des exports.

## Phase 1 - Validation des tables à vider
- revue humaine obligatoire de `04_tables_abh_sad_a_vider_ou_conserver.md` ;
- décision explicite table par table ;
- aucune action si la colonne validation reste `PENDING`.

## Phase 2 - Vidage contrôlé
- vidage uniquement après validation ;
- pas de `DROP` ;
- `TRUNCATE` proposé uniquement en script commenté ;
- conserver les structures SQL utiles.

## Phase 3 - Réinitialisation référentiels instables
- réinitialiser uniquement les référentiels et mappings non validés ;
- exemples : `metadata.referentiel_parametre`, `metadata.mapping_parametre_source`, tables unresolved ;
- reconstruire depuis le fichier métier et validation ABH.

## Phase 4 - Préparation staging
- charger le brut depuis `abh_sebou_ismail` vers `staging` ;
- conserver la trace de la table source, date d’import, volume et checksum ;
- ne rien charger directement dans `qualite`, `hydro` ou `meteo` sans QA.
