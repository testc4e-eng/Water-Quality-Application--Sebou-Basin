# Changelog - Audit IDP pollution

## 2026-05-18 - Phase 2 arbitrage / pré-migration

### Correction CRS

- Correction des mentions `EPSG:4261` dans les tableaux de reporting vers `EPSG:26191`.
- Justification : les sorties `ogrinfo_*` décrivent un `BASEGEOGCRS` Merchich identifié `EPSG:4261`, mais la couche est un `PROJCRS["Merchich / Nord Maroc"]` dont l'identifiant final est `EPSG:26191`.
- Les coordonnées observées sont métriques Lambert Nord Maroc, par exemple X entre environ `377613` et `633742`, Y entre environ `283900` et `495449`.
- Impact : les analyses de distance 5 m, 10 m et 25 m restent cohérentes uniquement avec `EPSG:26191`.

### Fichiers corrigés

- `00_resume_executif.md`
- `01_inventaire_couches.md`
- `03_analyse_geometrique_doublons.md`
- `audit_manifest.json`

### Fichiers non corrigés volontairement

- `ogrinfo_*.txt` : conservés tels quels comme traces brutes de l'outil GDAL. Ils contiennent à la fois `EPSG:4261` pour le référentiel géographique de base et `EPSG:26191` pour le CRS projeté de la couche.
- `duplicate_exact.csv`, `duplicate_near.csv`, `inventory_measurement_matches.csv`, `value_dictionaries_full.json` : les occurrences `4261` y correspondent à des identifiants de lignes ou valeurs attributaires, pas à un CRS.
