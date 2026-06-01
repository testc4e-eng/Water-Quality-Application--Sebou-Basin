# Rapport GO/NOGO - Référentiel Qualité Préproduction

## 1. Résumé exécutif
- Statut actuel : `DEV_PARTIAL_CHARGE` avec version active `REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19`.
- Décision proposée : `GO_PREPROD_CONDITIONNEL`.
- Raison principale : le moteur réglementaire fonctionne et les seuils sont chargés, mais le périmètre actif est limité à 36 paramètres classifiables et 177 seuils actifs sur 205 seuils chargés.

## 2. Tables réglementaires
| Table | Existe | Lignes | Statut |
|---|---|---|---|
| metadata.qualite_source_reglementaire | Oui | 1 | OK |
| metadata.qualite_type_eau | Oui | 4 | OK |
| metadata.qualite_classe_reglementaire | Oui | 5 | OK |
| metadata.qualite_parametre_reglementaire | Oui | 41 | OK |
| metadata.qualite_mapping_canonique_reglementaire | Oui | 41 | OK |
| metadata.qualite_seuil_reglementaire | Oui | 205 | OK |
| metadata.qualite_regle_classification | Oui | 5 | OK |


## 3. Couverture réglementaire
| Element | Statut | Commentaire |
|---|---|---|
| version active | OK | REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19 |
| types eau | OK | 4 |
| classes qualite | OK | 5 |
| parametres reglementaires | OK | 41 dont 36 classifiables |
| seuils | OK partiel | 177 actifs / 205 charges |
| mappings canonique | OK partiel | 36 actifs / 41 mappings |
| regles classification | OK | 5 |


## 4. Tests API
| Endpoint | Résultat HTTP | Résultat métier | Commentaire |
|---|---|---|---|
| GET /health | 200 | OK |  |
| GET /api/v1/quality/regulatory-status | 200 | OK | thresholds_active=177 |
| GET /api/v1/quality/thresholds | 200 | OK | count=177 |
| POST classify DBO5 | 200 | CLASSIFIED | DBO5 -> DBO5; classe bonne |
| POST classify NO3 | 200 | CLASSIFIED | NO3 -> NO3-; classe bonne |
| POST classify Mo | 200 | PARAMETRE_NON_REGLEMENTAIRE | Paramètre absent du référentiel réglementaire actif. |
| POST classify MO | 200 | PARAMETRE_NON_REGLEMENTAIRE | Paramètre absent du référentiel réglementaire actif. |
| POST classify DBO5 | 200 | CLASSIFIED | DBO5 -> DBO5; classe bonne |
| POST classify NO3 | 200 | CLASSIFIED | NO3 -> NO3-; classe bonne |
| POST classify Mo | 200 | PARAMETRE_NON_REGLEMENTAIRE | Paramètre absent du référentiel réglementaire actif. |
| POST classify MO | 200 | PARAMETRE_NON_REGLEMENTAIRE | Paramètre absent du référentiel réglementaire actif. |


## 5. Blocages restants
| Blocage | Niveau | Décision attendue |
|---|---|---|
| Validation du périmètre actif 177/205 seuils | WARNING | Confirmer que les seuils inactifs restent exclus en préproduction. |
| 5 paramètres observationnels non classifiables | WARNING | Confirmer qu ils restent visibles mais exclus du moteur et de la qualité globale. |
| Contrat `type_eau` vs `water_type` | WARNING | Aligner clients et documentation API sur `type_eau=surface_generale`. |
| Température dédiée meteo vide | INFO | Sans impact moteur si les mesures qualité portent `T_EAU`; à documenter côté données. |


## 6. Décision proposée
`GO_PREPROD_CONDITIONNEL`

Le passage préproduction est acceptable pour un périmètre limité au Tableau n°1, `surface_generale`, paramètres classifiables actifs, et endpoints lecture/classification. Le GO complet doit attendre la validation métier des seuils inactifs et du statut observationnel des vrais absents canonique.

## 7. Conditions de clôture
- Valider par métier le périmètre : 36 paramètres classifiables, 177 seuils actifs.
- Confirmer que les grilles simplifiées restent documentaires.
- Confirmer que `MO` et `Mo` restent séparés et non réglementaires dans le moteur actuel.
- Mettre à jour la documentation API pour `type_eau`.
- Rejouer `07_scripts_sql_readonly_verification.sql` après déploiement préproduction.
- Démarrer le serveur DEV/PREPROD et rejouer les tests HTTP réels en plus des tests `TestClient`.
- Exécuter le chargement préprod uniquement via script validé, avec backup et rollback logique.
