# Audit global identite spatiale pollution/qualite

Date : 2026-05-19  
Mode : audit lecture seule. Aucune modification SHP, aucune fusion, aucune ecriture base.

## Synthese

`geo.ref_site_pollution` est deja le pivot DEV de la couche IDP avec 1951 sites et des geometries valides. Le blocage PREPROD n'est pas technique sur le chargement, mais gouvernance : les familles `infra.*`, `qualite.source_pollution_prelevement` et les couches `staging.raw_idp_*` contiennent des objets proches ou redondants qui doivent etre rattaches a un `master_site_id` sans fusion destructive.

Points critiques observes :

- `geo.ref_site_pollution` : 1951 sites, 0 geometrie nulle, 0 geometrie invalide, mais 310 groupes de geometries exactes et 1358 paires a moins de 10 m.
- `api.v_pollution_sites` : exposition DEV de 1951 sites.
- `api.v_pollution_latest_results` : 1259 derniers resultats exposes.
- `staging.raw_idp_src_pollution_marche_cadre` et `staging.raw_idp_mesures_qualite_marche_cadre_2024` ont la meme volumetrie observee, 3614 lignes, et de nombreux doublons proches : a traiter comme source IDP brute/auditee, pas comme referentiel maitre.
- Les couches `infra.*_inventaire_pollution` sont souvent plus proches du contexte pollution que les tables infra generales, mais elles doivent rester sources de rattachement et non ecraser les couches officielles.

## Inventaire objets

| Couche | Role propose | Volumetrie | Geometrie | PK | Remarques |
|---|---|---:|---|---|---|
| `geo.ref_site_pollution` | maitre DEV actuel | 1951 | Point 26191 + 4326 | `site_id` | Pivot a stabiliser, pas a remplacer brutalement |
| `api.v_pollution_sites` | vue API derivee | 1951 | GeoJSON expose | - | Ne doit pas devenir source maitre |
| `api.v_pollution_latest_results` | vue API resultats | 1259 | GeoJSON expose | - | Lie resultats P0 aux sites |
| `qualite.source_pollution_prelevement` | observatoire qualite/pollution historique | 141 | Point 26191 | `id` | A rattacher au master, conserver lineage |
| `staging.raw_idp_src_pollution_globale` | staging IDP inventaire | 243 | Point 26191/4326 | `ogc_fid` | 36 geometries nulles |
| `staging.raw_idp_src_pollution_marche_cadre` | staging IDP inventaire/mesures a verifier | 3614 | Point 26191/4326 | `ogc_fid` | Volumetrie identique a mesures marche cadre, forte redondance |
| `staging.raw_idp_mesures_qualite_globale_2024` | staging IDP mesures | 4894 | Point 26191/4326 | `ogc_fid` | 275 geometries nulles |
| `staging.raw_idp_mesures_qualite_marche_cadre_2024` | staging IDP mesures | 3614 | Point 26191/4326 | `ogc_fid` | Forte redondance spatiale |
| `infra.step` | infrastructure officielle | 41 | Geometry SRID 0 | `id` | Source prioritaire apres validation SRID |
| `infra.step_industrielle` | infrastructure officielle detaillee | 15 | Geometry SRID 0 | `id` | Source prioritaire specialisee |
| `infra.step_inventaire_pollution` | inventaire pollution STEP | 49 | Point 26191 | `id` | Esclave de rattachement, 91 paires <10 m |
| `infra.stm` | infrastructure officielle | 18 | Geometry SRID 0 | `id` | Source prioritaire apres validation SRID |
| `infra.huilerie` | infrastructure officielle | 612 | Geometry SRID 0 | `id` | 13 geometries nulles |
| `infra.huilerie_inventaire_pollution` | inventaire pollution huileries | 606 | Point 26191 | `id` | Source rattachement, 129 paires <10 m |
| `infra.mine` | infrastructure officielle | 42 | Geometry SRID 0 | `id` | Source prioritaire apres validation SRID |
| `infra.mine_inventaire_pollution` | inventaire pollution mines | 39 | Point 26191 | `id` | Esclave/rattachement |
| `infra.decharge` | infrastructure officielle | 233 | Geometry SRID 0 | `id` | 86 geometries nulles |
| `infra.decharge_inventaire_pollution_general` | inventaire pollution decharges | 139 | Point 26191 | `id` | 11 groupes exacts, 108 paires <10 m |
| `infra.rejet_domestique` | infrastructure officielle | 362 | Geometry SRID 0 | `id` | 78 geometries nulles |
| `infra.rejet_industriel` | infrastructure officielle | 11 | Geometry SRID 0 | `id` | Source prioritaire |
| `infra.rejet_inventaire_pollution` | inventaire pollution rejets | 277 | Point 26191 | `id` | Esclave/rattachement |
| `infra.fosses_septiques_abhs` | source pollution ponctuelle | 20 | Point 26191 | `id` | Source metier ponctuelle |

## Qualite geometrique observee

| Objet | Nulles | Invalides | Groupes exacts | Paires <= 10 m |
|---|---:|---:|---:|---:|
| `geo.ref_site_pollution` | 0 | 0 | 310 | 1358 |
| `qualite.source_pollution_prelevement` | 0 | 0 | 13 | 37 |
| `infra.step_inventaire_pollution` | 0 | 0 | 1 | 91 |
| `infra.huilerie` | 13 | 0 | 4 | 9 |
| `infra.huilerie_inventaire_pollution` | 0 | 0 | 4 | 129 |
| `infra.decharge` | 86 | 0 | 11 | 108 |
| `infra.rejet_domestique` | 78 | 0 | 5 | 9 |
| `staging.raw_idp_mesures_qualite_globale_2024` | 275 | 0 | 177 | 66374 |

## Classification des couches

| Classe | Couches |
|---|---|
| Maitre cible | `geo.ref_site_pollution` |
| Exposition derivee | `api.v_pollution_sites`, `api.v_pollution_latest_results` |
| Sources officielles candidates | `infra.step`, `infra.stm`, `infra.huilerie`, `infra.mine`, `infra.decharge`, `infra.rejet_domestique`, `infra.rejet_industriel`, `infra.fosses_septiques_abhs` |
| Sources pollution detaillees | `infra.*_inventaire_pollution`, `qualite.source_pollution_prelevement` |
| Staging brut | `staging.raw_idp_*` |
| Analytique/dashboard | `api.*`, `analytics.*` |

## Collisions potentielles

Les collisions prioritaires a arbitrer sont :

1. doublons exacts dans `geo.ref_site_pollution`;
2. couples IDP mesure/inventaire a moins de 10 m;
3. objets `infra.*` et `infra.*_inventaire_pollution` proches mais avec nom/code divergent;
4. geometries nulles dans couches officielles generales;
5. objets qualite prelevement sans rattachement explicite a `geo.ref_site_pollution`.

## Conclusion

Le referentiel maitre doit conserver `geo.ref_site_pollution` comme table pivot, mais y ajouter lineage, priorite, statut d'arbitrage et historique de fusion. Les couches sources doivent etre rattachees par table de resolution et non fusionnees directement.

## Dry-run resolution identitaire

Commande executee en lecture seule :

```powershell
python scripts/idp_pollution/build_spatial_identity_resolution.py --dry-run --distance 25
```

Sorties :

| Fichier | Role |
|---|---|
| `docs/IDP_POLLUTION_ANALYSIS/spatial_identity_outputs/spatial_identity_summary.csv` | resume du run |
| `docs/IDP_POLLUTION_ANALYSIS/spatial_identity_outputs/spatial_identity_candidates.csv` | candidats source -> master |
| `docs/IDP_POLLUTION_ANALYSIS/spatial_identity_outputs/spatial_identity_conflicts.csv` | candidats necessitant revue |
| `docs/IDP_POLLUTION_ANALYSIS/spatial_identity_outputs/spatial_identity_orphans.csv` | objets sans candidat ou geometrie absente |

Resultat observe : 14970 sources auditees, 14380 candidats, 14380 conflits/revues, 590 orphelins ou geometries manquantes. Ce volume confirme que la phase suivante doit etre batchée par priorite métier et non appliquee globalement.
