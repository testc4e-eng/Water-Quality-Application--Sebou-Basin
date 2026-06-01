# Strategie d'auto-validation spatiale

## Statut

`QA_FIRST_AUTO_VALIDATION_STRATEGY`

## Decision de gouvernance

Les arbitrages pilotes montrent que la plupart des conflits spatiaux sont des duplications organisationnelles : plusieurs couches, equipes ou campagnes de saisie representent le meme objet physique, ou des objets metier differents situes sur le meme site.

La cible n'est donc pas de supprimer des doublons, mais de passer au modele :

```text
SITE PHYSIQUE UNIQUE
  -> objet metier source 1
  -> objet metier source 2
  -> point de mesure
  -> rejet / STEP / station / inventaire / campagne
```

## Regles officielles appliquees

| Bucket | Decision | Mode |
|---|---|---|
| `EXACT_0M` | `ACCEPT_MATCH` | auto-validation logique |
| `VERY_CLOSE_2M` | `ACCEPT_MATCH` avec confiance haute | auto-validation logique |
| `DIFFERENT_OBJECT` | `SAME_SITE_DIFFERENT_OBJECT` | lien spatial, pas de fusion metier |
| `ORPHAN` | `WAIT_SOURCE_FIX` ou `REVIEW_MAPPING` | hors auto-validation |

## Pourquoi `EXACT_0M` est auto-validable

- Distance nulle : la geometrie source et le master candidat occupent exactement le meme point.
- Les lots pilotes confirment que ces cas correspondent majoritairement a des copies, renommages ou reorganisations de couches.
- La validation cree seulement un rattachement logique `source -> master_site_id`.
- Aucun objet source n'est supprime, archive ou remplace.

Mode cible :

- `mapping_type = SAME_PHYSICAL_SITE`
- `validation_status = VALIDATED`
- `validation_mode = AUTO_EXACT_0M`
- `confidence_level = CERTAIN`

## Pourquoi `VERY_CLOSE_2M` est auto-validable

- Distance strictement superieure a 0 et inferieure ou egale a 2 m.
- A l'echelle des couches sources observees, ce decalage est compatible avec une precision de saisie, projection ou numerisation.
- Les cas restent rattaches logiquement sans deplacer la geometrie officielle.
- La distance reelle est conservee pour audit.

Mode cible :

- `mapping_type = SAME_PHYSICAL_SITE`
- `validation_status = VALIDATED`
- `validation_mode = AUTO_VERY_CLOSE`
- `confidence_level = HIGH`

## Pourquoi `DIFFERENT_OBJECT` n'est pas un doublon destructif

Un meme site physique peut porter plusieurs roles metier :

- station ;
- point de prelevement ;
- rejet ;
- STEP ;
- source pollution ;
- point mesure ;
- objet d'inventaire.

Ces objets ne doivent pas etre fusionnes en un seul enregistrement metier. Ils doivent etre relies au meme site physique.

Mode cible :

- `mapping_type = SAME_SITE_DIFFERENT_OBJECT`
- pas de fusion future automatique des roles metier ;
- navigation future `site -> objets lies`.

## Pourquoi `ORPHAN` reste separe

Les orphelins correspondent a :

- absence de master candidat ;
- geometrie douteuse ;
- source incomplete ;
- coordonnees a verifier ;
- objet potentiellement nouveau.

Ils restent hors auto-validation et doivent etre classes `WAIT_SOURCE_FIX` ou `REVIEW_MAPPING`.

## Definitions operationnelles

| Terme | Definition |
|---|---|
| Doublon spatial | deux lignes ou couches sur le meme point, representant probablement le meme site physique |
| Objet metier distinct | role different sur le meme lieu : rejet, prelevement, station, STEP |
| Meme site physique | identite geographique commune, pivotable par `master_site_id` |
| Couche derivee | vue, copie, inventaire ou retraitement qui ne doit pas devenir source officielle seule |
| Copie organisationnelle | meme objet duplique par equipe, campagne, renommage ou restructuration |

## Volumes pilotes utilises

| Lot | Volume | Decision cible |
|---|---:|---|
| `EXACT_0M` | 8771 | auto-valider |
| `VERY_CLOSE_2M` | 126 | auto-valider haute confiance |
| `DIFFERENT_OBJECT` | 5438 | lier sans fusion metier |
| `ORPHAN` | 102 | attente correction/revue |

## Note source

Les fichiers demandes avec suffixes `*_accept_match_ok.csv` ne sont pas presents dans le depot. Les lots operationnels disponibles et utilises sont :

- `cartographic_review_workspace/review_exact_0m.csv`
- `cartographic_review_workspace/review_very_close_2m.csv`
- `cartographic_review_workspace/review_different_object.csv`
- `cartographic_review_workspace/review_orphans.csv`

Ils portent deja les buckets et suggestions systeme necessaires a la consolidation.
