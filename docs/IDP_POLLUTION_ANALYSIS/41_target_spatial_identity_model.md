# Modele cible identite spatiale maitre

## Principe

`geo.ref_site_pollution` devient la source unique d'identite geographique pour pollution, qualite, mesures, propagation, dashboards et analytics. Les couches sources restent intactes. Chaque objet source est rattache au site maitre via lineage et decisions d'arbitrage.

## Structure logique cible

| Champ | Role |
|---|---|
| `site_id uuid` | PK stable |
| `site_code text` | code canonique lisible et unique par version active |
| `site_name text` | libelle officiel |
| `external_ids jsonb` | identifiants sources, codes legacy, IDP, infra |
| `source_type_id uuid` | typologie source pollution |
| `pollution_category_id uuid` | categorie pollution |
| `commune`, `province`, `bassin` | localisation administrative |
| `source_origin text` | origine dominante du site maitre |
| `source_priority integer` | priorite de la geometrie retenue |
| `confidence_score numeric` | confiance globale 0-1 |
| `validation_status text` | `VALIDATED`, `TO_VALIDATE`, `CONFLICT`, `REJECTED`, `ARCHIVED` |
| `identity_status text` | statut resolution identitaire |
| `official_geometry_source text` | couche qui fournit la geometrie officielle |
| `geom geometry(Point,26191)` | geometrie officielle |
| `centroid geometry(Point,26191)` | centroid pour compatibilite future si source non ponctuelle |
| `geom_4326 geometry(Point,4326)` | exposition web |
| `qa_flags jsonb` | anomalies spatiales et identitaires |
| `lineage jsonb` | liste des sources rattachees |
| `created_at`, `updated_at` | audit |

## Tables associees

| Table | Role |
|---|---|
| `geo.ref_site_pollution` | site maitre actif |
| `geo.ref_site_pollution_source_link` | rattachement source -> master |
| `geo.ref_site_pollution_merge_history` | historique des fusions/arbitrages |
| `qa.spatial_identity_candidates` | candidats proposes par moteur |
| `qa.spatial_identity_conflicts` | conflits a arbitrer |
| `qa.spatial_identity_decisions` | decisions metier |
| `qa.spatial_identity_orphans` | objets sans rattachement |

## Etats identitaires

| Statut | Signification |
|---|---|
| `MASTER_CONFIRMED` | site maitre valide |
| `AUTO_MATCH_CANDIDATE` | rattachement propose automatiquement, a verifier selon seuil |
| `MANUAL_REVIEW_REQUIRED` | arbitrage obligatoire |
| `ORPHAN_SOURCE` | source sans site maitre candidat |
| `GEOMETRY_CONFLICT` | conflit geometrie/nom/type/commune |
| `MERGED_BY_DECISION` | fusion validee avec trace |
| `ARCHIVED_DUPLICATE` | doublon conserve en historique, non actif |

## Regle de gouvernance

Aucune fusion destructive n'est autorisee. Une fusion consiste a :

1. creer ou confirmer un `site_id` maitre;
2. rattacher les sources dans `geo.ref_site_pollution_source_link`;
3. historiser la decision dans `geo.ref_site_pollution_merge_history`;
4. conserver les objets sources dans leurs tables.
