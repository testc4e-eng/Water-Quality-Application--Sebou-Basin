# Revue humaine finale - Imane

## 1. Ouvrir le projet
Ouvrir `final_human_review.qgz` dans QGIS.

## 2. Couches a utiliser
- `TRUE_AMBIGUOUS` : conflits reels restants.
- `ORPHAN_REVIEW` : objets sans master candidat fiable ou source a corriger.

## 3. Colonnes a modifier uniquement
- `reviewer_decision`
- `reviewer_comment`

## 4. Decisions autorisees
TRUE_AMBIGUOUS : `ACCEPT_MATCH`, `KEEP_SEPARATE`, `SAME_SITE_DIFFERENT_OBJECT`, `NEED_FIELD_VALIDATION`, `WAIT_BUSINESS_DECISION`.

ORPHAN_REVIEW : `WAIT_SOURCE_FIX`, `INVALID_SOURCE_DATA`, `CREATE_NEW_SITE`, `NOT_USABLE`, `REVIEW_LATER`.

## 5. Enregistrer / exporter
Renseigner les decisions dans `final_review_decision_template.csv` ou exporter les couches apres modification des deux champs autorises. Le fichier attendu pour ingestion future est le CSV de decision final.

## 6. A ne pas faire
Ne pas modifier les geometries, supprimer des entites, renommer les couches, modifier les IDs, fusionner les objets ou modifier les champs techniques.

## 7. Objectif
Analyser, decider, commenter. Aucune action destructive n est demandee.
