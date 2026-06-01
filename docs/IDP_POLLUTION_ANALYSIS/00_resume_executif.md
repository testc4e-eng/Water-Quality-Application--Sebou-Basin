# Résumé exécutif - Audit IDP pollution

Audit exécuté en lecture seule le `2026-05-18T08:58:35.932314+00:00`.

## Périmètre

- Source SHP : `C:\dev\WQDSS\data\Qualité & pollution shp\processed`
- Nombre de couches : `4`
- Nombre total d'entités lues : `12365`
- Connexion PostgreSQL : non utilisée
- Import PostGIS : non réalisé
- Dédoublonnage automatique : non réalisé

## Synthèse des couches

| Couche | Rôle supposé | Entités | Géométrie | CRS | Encodage | Champs | Remarques |
| --- | --- | --- | --- | --- | --- | --- | --- |
| idp_src_pollution_globale | inventaire | 243 | Point | EPSG:26191 | UTF-8 | 43 | coordonnées/géométries nulles à contrôler; CRS projeté métrique EPSG:26191 |
| idp_src_pollution_marche_cadre | inventaire | 3614 | Point | EPSG:26191 | UTF-8 | 16 | CRS projeté métrique EPSG:26191 |
| idp_mesures_qualité_marche_cadre_2024 | mesures | 3614 | Point | EPSG:26191 | UTF-8 | 16 | CRS projeté métrique EPSG:26191 |
| idp_mesures_qualité_globale_2024 | mesures | 4894 | Point | EPSG:26191 | UTF-8 | 16 | coordonnées/géométries nulles à contrôler; CRS projeté métrique EPSG:26191 |

## Ce qui est certain

- Les quatre couches attendues sont présentes avec `.shp`, `.shx`, `.dbf`, `.prj`, `.cpg`.
- Les quatre couches sont des couches ponctuelles.
- Les quatre couches sont en `EPSG:26191` selon `ogrinfo`, donc les distances calculées sont métriques.
- Les couches `idp_src_pollution_marche_cadre` et `idp_mesures_qualité_marche_cadre_2024` ont la même volumétrie et la même géométrie source apparente.
- Les couches contiennent des champs de coordonnées (`X`, `Y`, `coord_x`, `coord_y`) et des attributs administratifs (`commune`, `code_commu`).

## Ce qui est probable

- Les couches de mesures utilisent un format large avec plusieurs paramètres qualité en colonnes.
- Les couches inventaire et mesures partagent des points physiques et doivent être rapprochées par géométrie et attributs.
- `globale` et `marche_cadre` représentent deux périmètres/campagnes ou deux extractions métier à arbitrer avant fusion.

## Hypothèses documentées

- `idp_src_pollution_*` est traité comme inventaire.
- `idp_mesures_qualité_*_2024` est traité comme mesures.
- Les distances de proximité 5/10/25 m sont pertinentes car le CRS est projeté métrique.

## Arbitrages métier requis

- Clé officielle d'identification des sites IDP.
- Fusion ou conservation séparée des couches `globale` et `marche_cadre`.
- Nomenclature validée des types de sources pollution.
- Référentiel final des paramètres et unités.

## Risques de migration

- Duplication spatiale et sémantique si les couches sont fusionnées sans table d'arbitrage.
- Perte de traçabilité si les champs bruts sont renommés avant `staging`.
- Mauvaise interprétation des paramètres en colonnes si le passage au format long n'est pas contrôlé.

## Meilleure structure recommandée

`staging.raw_*` pour le brut, `pollution.site_pollution` pour les sites consolidés, `qualite.point_mesure` et `qualite.resultat_mesure` pour les mesures, `metadata` pour les référentiels, `qa` pour les anomalies et arbitrages, `api/analytics` pour l'exposition.

## Actions prioritaires

1. Valider les candidats de matching inventaire ↔ mesures.
2. Valider la nomenclature des sources pollution.
3. Définir la règle de fusion `globale` / `marche_cadre`.
4. Transformer les mesures en format long seulement après validation du dictionnaire paramètres/unités.
