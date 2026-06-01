# Matrice de décision d'arbitrage

| Règle proposée | Exemple de décision | Action cible PostGIS | Impact pollution.site_pollution | Impact qualite.point_mesure | Impact qualite.resultat_mesure | Impact qa.qa_anomalie_pollution |
| --- | --- | --- | --- | --- | --- | --- |
| Score >= 0.95, distance vide ou <= 5 m, commune cohérente | VALIDATED_MATCH | Créer/relier un site consolidé | Créer ou réutiliser `site_pollution` | Renseigner `site_id`, `match_status=MATCHED` | Conserver les résultats rattachés au point | Tracer décision validée |
| Même géométrie mais nom/commune divergent | CONFLICT_TO_RESOLVE | Bloquer chargement métier automatique | Pas de fusion avant arbitrage | Point en `TO_VALIDATE` | Résultats en attente | Créer anomalie critique |
| Même site, paramètres différents | KEEP_MULTIPLE_MEASUREMENTS | Conserver un point et plusieurs résultats | Un seul site consolidé | Un ou plusieurs points selon campagne | Plusieurs lignes `resultat_mesure` | Tracer consolidation |
| Distance <= 25 m sans preuve attributaire | REVIEW_REQUIRED | Arbitrage manuel | Aucun changement automatique | Aucun rattachement automatique | Aucun chargement automatique | Candidat QA |
| Géométrie manquante | GEOMETRY_MISSING | Quarantaine ou géocodage validé | Ne pas créer site géométrique | Créer point sans rattachement ou exclure | Résultats conservés avec flag | Anomalie obligatoire |
| Fusion globale/marche_cadre non tranchée | PENDING_REVIEW | Reporter pré-migration | Pas de contrainte unique finale | Pas de rattachement final | Prévisualisation seulement | Risque bloquant |

Les décisions automatiques sont des recommandations. La validation métier reste obligatoire avant toute écriture en base.
