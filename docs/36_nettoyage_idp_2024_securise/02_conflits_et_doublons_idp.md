# Conflits et doublons IDP

## Doublons exacts

| Table | Nombre doublons | Exemple | Action recommandée |
|---|---:|---|---|
| `public.mesures_idp_2024_qualite_globale` | 0 | aucun | aucune suppression sans autre règle |
| `public.mesures_idp_2024_qualite_marche_cadre` | 0 | aucun | aucune suppression sans autre règle |
| `public.mesures_idp_2024_src_pollution_globale` | 0 | aucun | aucune suppression sans autre règle |
| `public.mesures_idp_2024_src_pollution_marche_cadre` | 0 | aucun | aucune suppression sans autre règle |

## Doublons métier probables

L’audit à l’intérieur de chaque table n’a pas trouvé de doublons métier probables sur les clés retenues :

- qualité : `pts_prelevement + date_jr_prelevement + parametre_qualite + val_qual`
- source pollution : `pts_prelevement + date_jr_prelevement + commune + nature`

| Table | Clé métier probable | Nombre cas | Exemple | Action |
|---|---|---:|---|---|
| `public.mesures_idp_2024_qualite_globale` | point + date + paramètre + valeur | 0 | aucun | rien à supprimer |
| `public.mesures_idp_2024_qualite_marche_cadre` | point + date + paramètre + valeur | 0 | aucun | rien à supprimer |
| `public.mesures_idp_2024_src_pollution_globale` | point + date + commune + nature | 0 | aucun | rien à supprimer |
| `public.mesures_idp_2024_src_pollution_marche_cadre` | point + date + commune + nature | 0 | aucun | rien à supprimer |

## Recouvrements globale / marché cadre

Le point critique ne porte donc pas sur les doublons internes, mais sur les recouvrements entre ensembles :

| Type recouvrement | Volume confirmé | Interprétation | Action recommandée |
|---|---:|---|---|
| qualité globale vs qualité marché cadre sur `point + date + paramètre + valeur` | 40 lignes | recouvrement confirmé entre les deux ensembles | quarantaine avant toute fusion |
| source pollution globale vs source pollution marché cadre sur `point + date + commune + nature` | 5 lignes | recouvrement confirmé | quarantaine avant toute fusion |

## Lignes candidates à suppression après validation

À ce stade, aucune ligne ne relève d’une suppression automatique sûre.

| Table | Type conflit | Volume | Raison | Condition SQL indicative |
|---|---|---:|---|---|
| toutes | `DUPLICATE_EXACT` | 0 | aucun doublon exact confirmé | non applicable |
| toutes | `DUPLICATE_BUSINESS` | 0 | aucun doublon métier confirmé à l’intérieur des tables | non applicable |
| `public.mesures_idp_2024_qualite_marche_cadre` | `VALUE_NULL` | 11 | valeurs vides dans `val_qual`, mais ligne pas strictement vide | `WHERE val_qual IS NULL OR trim(coalesce(val_qual,''))=''` |

## Recommandation de nettoyage

- suppression immédiate : aucune
- quarantaine prioritaire :
  - les `40` recouvrements qualité globale / marché cadre
  - les `5` recouvrements source pollution globale / marché cadre
  - les `11` lignes avec `val_qual` vide
- maintien avec validation métier :
  - tous les paramètres non mappés
  - tous les paramètres ambigus
  - tous les points sources non rattachés
