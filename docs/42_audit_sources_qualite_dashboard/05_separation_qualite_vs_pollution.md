# Séparation Qualité vs Pollution

### Tables à inclure dans le périmètre Qualité

| Table | Pourquoi |
| ----- | -------- |
| `qualite.mesure_qualite_sebou` | Contient les données des 6 stations sentinelles. Est la référence pour le Dashboard Accueil. |
| `qualite.mesure_qualite_riviere` | Source pour l'historique étendu des rivières. |
| `qualite.mesure_qualite_barrage` | Source pour l'historique des barrages. |
| `qualite.mesure_qualite_nappe` | Source pour l'historique des nappes. |
| `qualite.suivi_qualite_barrage_garde_hebdo` | Source pour le suivi spécifique du barrage de garde. |

### Tables à exclure du Dashboard Qualité réglementaire

| Table | Raison exclusion | Dashboard cible |
| ----- | ---------------- | --------------- |
| `qualite.source_pollution_prelevement` | Prélèvements à la source (rejets), fausse l'état global de la qualité du milieu naturel. | Dashboard Pollution |
| `qualite.source_pollution_mesure_param` | Mesures de polluants concentrés à la source de rejet. | Dashboard Pollution |
| `qualite.source_pollution_prelevement_lien` | Données de traçabilité des rejets liés à l'IDP. | Dashboard Pollution / QA Data |
| `staging.raw_idp_2024_mesures_qualite_globale` | Inventaire pollution IDP 2024 (données brutes). | Dashboard Pollution |
| `staging.raw_rejets_ind_abhs` | Référentiel des rejets industriels. | Dashboard Pollution |
