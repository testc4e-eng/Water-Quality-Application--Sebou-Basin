# Strategie SAME_SITE_DIFFERENT_OBJECT

## Statut

`LINK_OBJECTS_NO_DESTRUCTIVE_MERGE`

## Principe

`DIFFERENT_OBJECT` ne signifie pas doublon a supprimer. Il signifie que plusieurs objets metier distincts partagent le meme site physique ou une geometrie superposee.

La bonne action est :

- garder chaque objet metier ;
- rattacher chaque objet au meme `master_site_id` ;
- exposer plus tard une navigation `site -> objets lies` ;
- ne jamais fusionner les roles metier.

## Cas typiques

| Cas | Interpretation | Action |
|---|---|---|
| STEP + point de mesure | infrastructure et mesure associee | lien spatial |
| rejet + point de prelevement | pression et observation | lien spatial |
| station + mesure qualite | support et observation | lien spatial |
| source pollution + inventaire | meme lieu, couches organisationnelles | lien spatial |
| IDP inventaire + IDP mesure | campagne issue de l'inventaire | lien spatial |

## Mapping cible

| Champ | Valeur |
|---|---|
| `mapping_type` | `SAME_SITE_DIFFERENT_OBJECT` |
| `validation_status` | `VALIDATED` ou `TO_REVIEW` selon lot |
| `validation_mode` | `AUTO_DIFFERENT_OBJECT` |
| `confidence_level` | `HIGH` si distance 0m et suggestion confirmee |
| `review_batch` | `DIFFERENT_OBJECT` |

## Impacts architecture

- `geo.ref_site_pollution` reste le site physique.
- Les tables metier pollution, qualite et infrastructure gardent leurs identifiants propres.
- Les APIs cartographiques futures peuvent afficher une popup enrichie :
  - site physique ;
  - objets lies ;
  - mesures ;
  - latest values ;
  - sources pollution ;
  - statut QA.

## Interdit

- ne pas supprimer une source ;
- ne pas remplacer un objet metier par un autre ;
- ne pas deduire qu'un rejet et un point de prelevement sont le meme objet metier ;
- ne pas ecraser la geometrie officielle sans arbitrage.

## Volume pilote

Le lot `review_different_object.csv` contient 5438 objets avec suggestion `SAME_SITE_DIFFERENT_OBJECT`.

Ces cas sortent du backlog de "doublons" et deviennent des liens multi-objets par site.
