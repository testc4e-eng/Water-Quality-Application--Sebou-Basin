# VERROUS TECHNIQUES INTERNES — DATA ENGINEERING

> DOCUMENT DE GOUVERNANCE N°21 
> Liste des problématiques décisionnelles de l'équipe WQDSS qui impliquent un changement de conception ou des scripts complexes avant l'Ingestion Prod SQL.

## 🟡 Blocage 1 : La Stratégie d'Overwrite sur les 609 Updates (Barrages)
- **Le problème** : L'audit du Lot 4A-3 a révélé 609 occurrences où la Production diverge lourdement de la Sandbox historisée (avec des écarts colossaux, ex: un pH réduit de 17.1 (Sandbox) à 8.5 (Prod)). Rejouer simplement le module d'Upsert depuis la Sandbox écrasera purement nos données nettes en Prod avec les erreurs Sandbox passées.
- **Formulaire de résolution interne** : Instruire l'algorithme SQL du prochain Dry-Run (Etape Ingestion) à lever un bouclier spécial `WOULD_SKIP_NO_OVERWRITE` lorsque l'écart entre la valeur Prod et Source dépasse 10%, ou figer complètement les UPDATES sur cette table spécifique.

## 🟡 Blocage 2 : Modélisation des Exceptions (QA_FLAG_PARAM_UNMAPPED)
- **Le problème** : Si lors de l'intégration Prod nous laissons la valeur `NULL` dans la colonne `valeur_num` (pour contourner le paramètre inconnu) tout en inscrivant le label brut dans le json ou dans `parametre_sandbox`, WQDSS l'ignorera. 
- **Formulaire de résolution interne** : Confirmer la validité de cette approche (Mettre `valeur_num` à Null) comme design pattern défensif ou concevoir une table d'Isoloir/Quarantaine temporaire.

## 🔴 Blocage 3 : Identités Géospatiales Inconnues (IDP) - `qa_flag_missing_source`
- **Le problème** : Pour le lot 4A-4 (IDP), si l'usine polluante n'existe pas en Prod (`infra.rejet_*`), injecter une qualité orpheline plantera le système analytique qui requiert `fk_rejet`.
- **Formulaire de résolution interne** : Décider de la création du Flag interne `qa_flag_missing_source` => Cette balise devra soit refouler l'entrée en `WOULD_CONFLICT` létal, SOIT engager une fonction d'auto-création d'entreprise `auto_setup_infra_factory()` fonctionnant avec un identifiant virtuel. À préparer.
