# Lire en premier

1. Ouvrir QGIS.
2. Ouvrir `01_PROJET_QGIS/spatial_identity_cartographic_review.qgz`.
3. Lire `NOTE_DE_DELEGATION_REVIEW_CARTO.md`.
4. Traiter seulement le pilote :
   - 10 `EXACT_0M`
   - 20 `VERY_CLOSE_2M`
   - 10 `DIFFERENT_OBJECT`
   - 10 `ORPHAN`
5. Verifier ou modifier `business_decision`.
6. Ajouter un commentaire court dans `comments` si necessaire.
7. Renvoyer uniquement `03_FICHIERS_DECISION/cartographic_review_decision_template_light.csv` complete.

Ne pas modifier les sources. Ne pas lancer de script. Ne pas manipuler SQL/PostGIS.
