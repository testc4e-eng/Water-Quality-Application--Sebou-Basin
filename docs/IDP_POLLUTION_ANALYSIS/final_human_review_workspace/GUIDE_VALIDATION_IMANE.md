# Guide de validation cartographique - Revue finale

## Objectif

Valider uniquement les cas restants après auto-validation :

- `TRUE_AMBIGUOUS` : 3 cas à arbitrer ;
- `ORPHAN_REVIEW` : 102 objets sans rattachement fiable.

Les doublons certains, très proches et objets différents déjà stabilisés ne sont pas à revoir.

## Ce que tu dois faire

1. Ouvrir `final_human_review.qgz` dans QGIS.
2. Examiner les couches :
   - `TRUE_AMBIGUOUS`
   - `ORPHAN_REVIEW`
3. Pour chaque ligne, renseigner seulement :
   - `reviewer_decision`
   - `reviewer_comment`
4. Enregistrer et renvoyer uniquement :
   - `final_review_decision_template.csv`

## Ce qu’il ne faut pas faire

- Ne pas modifier les géométries.
- Ne pas supprimer des entités.
- Ne pas renommer les couches.
- Ne pas modifier les identifiants.
- Ne pas fusionner des objets.
- Ne pas modifier les champs techniques.

## Colonnes utiles

| Colonne | Signification |
|---|---|
| `review_id` | identifiant de revue, ne pas modifier |
| `source_layer` | couche source de l’objet |
| `source_object_name` | nom de l’objet source |
| `source_type` | type métier source |
| `candidate_site_name` | site maître candidat |
| `distance_m` | distance entre source et candidat |
| `match_score` | score de rapprochement |
| `issue_type` | type de problème détecté |
| `suggested_action` | suggestion système |
| `reviewer_decision` | décision à renseigner |
| `reviewer_comment` | commentaire court à renseigner |

## Décisions autorisées

### Pour `TRUE_AMBIGUOUS`

| Décision | Quand l’utiliser |
|---|---|
| `ACCEPT_MATCH` | le site candidat correspond bien à l’objet source |
| `KEEP_SEPARATE` | l’objet source et le candidat doivent rester séparés |
| `SAME_SITE_DIFFERENT_OBJECT` | même site physique, mais objets métier différents |
| `NEED_FIELD_VALIDATION` | la carte ne suffit pas, besoin de vérification terrain |
| `WAIT_BUSINESS_DECISION` | décision métier à arbitrer plus tard |

### Pour `ORPHAN_REVIEW`

| Décision | Quand l’utiliser |
|---|---|
| `WAIT_SOURCE_FIX` | la source doit être corrigée ou complétée |
| `INVALID_SOURCE_DATA` | donnée source inexploitable |
| `CREATE_NEW_SITE` | objet valide qui doit créer un nouveau site maître plus tard |
| `NOT_USABLE` | objet non utilisable dans le référentiel |
| `REVIEW_LATER` | information insuffisante ou priorité faible |

## Méthode recommandée

### 1. Commencer par TRUE_AMBIGUOUS

Ce sont les cas les plus importants.

Vérifier :

- le nom source ;
- le nom du site candidat ;
- la distance ;
- le type métier ;
- la cohérence visuelle sur la carte.

Décision rapide :

- même objet évident : `ACCEPT_MATCH`
- deux objets proches mais différents : `KEEP_SEPARATE`
- même lieu mais rôles différents : `SAME_SITE_DIFFERENT_OBJECT`
- doute terrain : `NEED_FIELD_VALIDATION`
- doute métier : `WAIT_BUSINESS_DECISION`

### 2. Ensuite traiter ORPHAN_REVIEW

Ce sont des objets sans site maître candidat fiable.

Vérifier :

- l’objet est-il visible sur la carte ?
- la géométrie semble-t-elle correcte ?
- le nom/type paraît-il exploitable ?
- l’objet mérite-t-il un nouveau site ?

Décision rapide :

- géométrie/source à corriger : `WAIT_SOURCE_FIX`
- donnée fausse ou inutilisable : `INVALID_SOURCE_DATA`
- objet valide et autonome : `CREATE_NEW_SITE`
- objet non exploitable pour le SAD : `NOT_USABLE`
- doute non prioritaire : `REVIEW_LATER`

## Comment remplir le commentaire

Le commentaire doit être court et utile.

Exemples :

| Cas | Commentaire recommandé |
|---|---|
| Match accepté | `Même site confirmé visuellement.` |
| Garder séparé | `Objets proches mais fonctions différentes.` |
| Besoin terrain | `Position ou nom à vérifier sur terrain.` |
| Source à corriger | `Objet sans rattachement, source à compléter.` |
| Nouveau site | `Objet valide, aucun master existant identifié.` |

## Fichier à renvoyer

Renvoyer seulement :

```text
final_review_decision_template.csv
```

Ne pas renvoyer les GeoPackage, GeoJSON, QML ou projet QGIS sauf demande spécifique.

## Résultat attendu

À la fin, chaque ligne traitée doit avoir :

- une valeur dans `reviewer_decision` ;
- idéalement un commentaire dans `reviewer_comment`.

Les lignes non traitées peuvent rester vides, mais elles seront considérées comme `à revoir`.
