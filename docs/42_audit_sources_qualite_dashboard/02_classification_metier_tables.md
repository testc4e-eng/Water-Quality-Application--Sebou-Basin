# Classification Métier des Tables

| Schéma | Table | Catégorie métier | À utiliser dans Dashboard Qualité ? | Justification |
| ------ | ----- | ---------------- | ----------------------------------- | ------------- |
| qualite | mesure_qualite_sebou | QUALITE_TEMPS_REEL_SENTINELLE | Oui | Table consolidée contenant les données actives des 6 IRE du Dash DG. |
| qualite | mesure_qualite_riviere | QUALITE_HISTORIQUE_RIVIERE_SOURCE | Oui | Contient l'historique complet pour affichage des tendances passées sur toutes les rivières. |
| qualite | mesure_qualite_barrage | QUALITE_HISTORIQUE_BARRAGE | Non (Onglet séparé) | La qualité des barrages suit des dynamiques et seuils différents des rivières. |
| qualite | mesure_qualite_nappe | QUALITE_HISTORIQUE_NAPPE | Non (Onglet séparé) | L'hydrologie souterraine (nappes) ne doit pas être mélangée aux eaux de surface. |
| qualite | suivi_qualite_barrage_garde_hebdo | QUALITE_BARRAGE_GARDE | Non (Onglet séparé) | Suivi spécifique à un ouvrage précis. |
| qualite | source_pollution_prelevement | POLLUTION_CAMPAGNE | Non | Ces prélèvements mesurent la pollution à la source, pas la qualité de l'eau ambiante. |
| qualite | source_pollution_mesure_param | POLLUTION_CAMPAGNE | Non | Détail des pollutions, fausserait les agrégats de la qualité réglementaire. |
| staging | raw_mesures_qualite_rivieres | HORS_PERIMETRE_QUALITE_DASHBOARD | Non | Données brutes non validées. |
| metadata | qualite_parametre_reglementaire | QUALITE_REFERENTIEL | Oui | Indispensable pour classifier (Bon/Moyen/Critique). |
