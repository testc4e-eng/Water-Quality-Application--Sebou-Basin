# Methode de Validation QGIS

## 1. Ce que vous devez faire

Vous devez examiner chaque objet restant et prendre une decision simple.

Le travail attendu n'est pas technique :

- verifier visuellement ;
- comparer source et candidat ;
- choisir une decision ;
- ajouter un commentaire court.

## 2. Fichiers a ouvrir

Dans QGIS :

- ouvrir `01_WORKSPACE/final_human_review.qgz`

Couches utiles :

- `TRUE_AMBIGUOUS`
- `ORPHAN_REVIEW`

Fichier de saisie :

- `final_review_decision_template.csv`
- `final_review_decision_template_enriched.csv`

## 3. Quel CSV utiliser

Utiliser de preference :

- `final_review_decision_template_enriched.csv`

Cette version ajoute :

- `wkt_geom`
- `x`
- `y`
- `fid`
- `geometry_status`

Elle sert uniquement a aider la lecture. Les deux seuls champs a modifier restent identiques.

## 4. Champs autorises a modifier

Seulement :

- `reviewer_decision`
- `reviewer_comment`

Tout le reste doit rester intact.

## 5. Methode pour TRUE_AMBIGUOUS

Question a se poser :

`le site candidat correspond-il vraiment a l'objet source ?`

Verifier :

- nom source ;
- nom candidat ;
- distance ;
- type metier ;
- coherence visuelle sur la carte.

Decisions :

- `ACCEPT_MATCH` : le candidat est le bon site
- `KEEP_SEPARATE` : objets proches mais distincts
- `SAME_SITE_DIFFERENT_OBJECT` : meme site physique, objet metier different
- `NEED_FIELD_VALIDATION` : la carte ne suffit pas
- `WAIT_BUSINESS_DECISION` : arbitrage metier necessaire

## 6. Methode pour ORPHAN_REVIEW

Question a se poser :

`cet objet est-il exploitable sans inventer un rattachement ?`

Verifier :

- objet visible et bien place ;
- nom exploitable ;
- type exploitable ;
- besoin de correction source ;
- besoin de creer un nouveau site plus tard.

Decisions :

- `WAIT_SOURCE_FIX` : la source doit etre corrigee
- `INVALID_SOURCE_DATA` : la donnee est inexploitable
- `CREATE_NEW_SITE` : objet valide mais sans master existant
- `NOT_USABLE` : objet a exclure des usages operationnels
- `REVIEW_LATER` : information insuffisante

## 7. Comment ecrire le commentaire

Le commentaire doit etre court et factuel.

Exemples :

- `Meme site confirme visuellement.`
- `Objets proches mais fonctions differentes.`
- `Nom ou position a verifier terrain.`
- `Source incomplete, correction client necessaire.`
- `Objet autonome, futur nouveau site.`

## 8. Ce qu'il ne faut pas faire

- ne pas deplacer les objets ;
- ne pas corriger les geometries ;
- ne pas supprimer des lignes ;
- ne pas renommer les couches ;
- ne pas modifier les IDs ;
- ne pas fusionner manuellement les objets.

## 9. Fin de traitement

Quand tous les cas sont saisis :

1. lancer `03_TOOLS/01_compter_cas_restants.ps1`
2. verifier qu'il reste `0` cas vides
3. lancer `03_TOOLS/02_verifier_csv_dry_run.ps1`
4. transmettre uniquement `final_review_decision_template.csv`
