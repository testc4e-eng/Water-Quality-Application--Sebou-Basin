# Limites et points à vérifier

- le schéma `public` n’est conservé dans l’inventaire principal que pour les tables legacy clairement métier de `abh_sebou_070426`
- les schémas `staging`, `raw`, `raw_import`, `tmp`, `temp`, `backup`, `audit`, `quarantine` et `logs` sont exclus du principal et analysés en annexe
- les colonnes techniques de `metadata` comme `column_name`, `source_column`, `object_type`, `duplicate_count`, `grain` et `legacy_code_pt_eau` ont été exclues
- les paramètres détectés avec qualité faible ont été exclus du principal et documentés ici ou en annexe
- certains libellés complexes restent à valider métier malgré leur conservation complète dans `parametre_observe`
