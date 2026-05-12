# Index — nettoyage IDP 2024 sécurisé

| Fichier | Contenu | Statut |
|---|---|---|
| [01_audit_tables_idp.md](./01_audit_tables_idp.md) | audit détaillé des 4 tables IDP 2024 trouvées | produit |
| [02_conflits_et_doublons_idp.md](./02_conflits_et_doublons_idp.md) | doublons exacts, doublons métier et lignes candidates au nettoyage | produit |
| [03_parametres_idp_problematiques.md](./03_parametres_idp_problematiques.md) | paramètres ambigus, non mappés, unités et valeurs suspectes | produit |
| [04_sources_pollution_idp_problematiques.md](./04_sources_pollution_idp_problematiques.md) | sources pollution, rejets, points vagues et rattachements | produit |
| [05_comparaison_globale_vs_marche_cadre.md](./05_comparaison_globale_vs_marche_cadre.md) | comparaison structurelle et métier entre globale et marché cadre | produit |
| [06_plan_nettoyage_securise.md](./06_plan_nettoyage_securise.md) | plan par phases sans exécution directe | produit |
| [07_scripts_sql_readonly_audit.sql](./07_scripts_sql_readonly_audit.sql) | requêtes d’audit en lecture seule | généré, non exécuté comme script |
| [08_scripts_sql_backup_quarantaine_a_executer_apres_validation.sql](./08_scripts_sql_backup_quarantaine_a_executer_apres_validation.sql) | modèles de backup et quarantaine | généré, non exécuté |
| [09_scripts_sql_nettoyage_a_executer_apres_validation.sql](./09_scripts_sql_nettoyage_a_executer_apres_validation.sql) | modèles prudents de nettoyage post-validation | généré, non exécuté |
| [10_points_validation_metier.md](./10_points_validation_metier.md) | questions et arbitrages à soumettre au métier | produit |

## Synthèse d’accès

- tables trouvées :
  - `public.mesures_idp_2024_qualite_globale` dans `abh_sebou_070426`
  - `public.mesures_idp_2024_qualite_marche_cadre` dans `abh_sebou_070426`
  - `public.mesures_idp_2024_src_pollution_globale` dans `abh_sebou_070426`
  - `public.mesures_idp_2024_src_pollution_marche_cadre` dans `abh_sebou_070426`
- tables non trouvées dans `abh_sad` sous ces noms :
  - `mesures_idp_2024_qualite_globale`
  - `mesures_idp_2024_qualite_marche_cadre`
  - `mesures_idp_2024_src_pollution_globale`
  - `mesures_idp_2024_src_pollution_marche_cadre`
- total lignes analysées : `8 899`
- total problèmes détectés :
  - `DUPLICATE_EXACT = 0`
  - `DUPLICATE_BUSINESS = 0` à l’intérieur de chaque table
  - `PARAM_UNMAPPED = 4 755` lignes qualité IDP non couvertes par le mapping actuel de `abh_sad`
  - `VALUE_NULL = 11` lignes qualité marché cadre avec `val_qual` vide
  - `VALUE_NON_NUMERIC = 2 035` lignes qualité avec valeur texte non directement convertible
  - `VALUE_NEGATIVE = 0` dans `val_qual`
  - `GLOBAL_MARCHE_OVERLAP = 45` lignes de recouvrement confirmées entre globale et marché cadre
  - `SOURCE_UNMAPPED / SOURCE_AMBIGUOUS = 240` points source IDP absents des points déjà intégrés dans `abh_sad`
  - `STRUCTURE_CONFLICT = 1` colonne avec type différent entre les deux tables source pollution
- nombre de lignes candidates à quarantaine :
  - minimum vérifié : `6 835` occurrences de problèmes documentées, non dédupliquées
- nombre de lignes candidates à suppression après validation :
  - `0` confirmé à ce stade

## Lecture importante

- ce dossier correspond à une **phase 1 audit read-only**
- aucun script de backup, quarantaine ou nettoyage n’a été exécuté
- les chiffres de conflits ci-dessus sont des **occurrences de problèmes vérifiées** ; ils peuvent se recouper sur certaines lignes
