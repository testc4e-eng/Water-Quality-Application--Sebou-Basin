# Rapport de cohérence CRS

Généré le `2026-05-18T09:28:33.428342+00:00`.

| Couche | Base géographique | CRS projeté ogrinfo | CRS manifeste | Statut |
|---|---|---|---|---|
| idp_src_pollution_globale | EPSG:4261 | EPSG:26191 | EPSG:26191 | OK |
| idp_src_pollution_marche_cadre | EPSG:4261 | EPSG:26191 | EPSG:26191 | OK |
| idp_mesures_qualité_marche_cadre_2024 | EPSG:4261 | EPSG:26191 | EPSG:26191 | OK |
| idp_mesures_qualité_globale_2024 | EPSG:4261 | EPSG:26191 | EPSG:26191 | OK |

Conclusion : les distances d'audit doivent utiliser le CRS projeté `EPSG:26191`. `EPSG:4261` reste seulement le référentiel géographique de base dans le WKT GDAL.
