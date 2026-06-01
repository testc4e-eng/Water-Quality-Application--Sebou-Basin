# Plan de déblocage préproduction

## Objectif
Passer de `DEV_PARTIAL` à `PREPROD_READY_CONDITIONNEL`, puis à `PREPROD_READY` après validation du périmètre actif.

## Etapes recommandées
1. Valider métier que seuls les 36 paramètres classifiables actifs alimentent le moteur en préproduction.
2. Valider que les 5 vrais absents canonique restent observationnels et non utilisables moteur.
3. Justifier les 28 seuils inactifs : documentaire, rejeté, ou à activer après contrôle source.
4. Aligner le contrat API : utiliser `type_eau=surface_generale` dans les clients, conserver éventuellement une compatibilité `water_type` si souhaitée.
5. Rejouer le script `07_scripts_sql_readonly_verification.sql` en préproduction candidate.
6. Exécuter le script de chargement uniquement si la préproduction ne contient pas déjà la version active.
7. Refaire les tests API minimaux : regulatory-status, thresholds, classify DBO5/NO3/MO/Mo.

## Rollback logique recommandé
Ne pas supprimer les données réglementaires. En cas de problème, désactiver la version réglementaire concernée (`actif=false`) via script validé séparé, puis restaurer la version précédente.
