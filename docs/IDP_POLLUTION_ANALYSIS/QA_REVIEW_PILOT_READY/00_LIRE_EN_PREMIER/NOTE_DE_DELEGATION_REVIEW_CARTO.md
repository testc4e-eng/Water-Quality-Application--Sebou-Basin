# Note de delegation - revue cartographique QA

## Objectif

Valider un petit pilote cartographique sans analyser les tables techniques PostGIS.

## Perimetre du pilote

Traiter uniquement :

- 10 objets `EXACT_0M`
- 20 objets `VERY_CLOSE_2M`
- 10 objets `DIFFERENT_OBJECT`
- 10 objets `ORPHAN`

## Ce qu'il faut modifier

Dans QGIS ou dans le CSV, renseigner seulement :

- `business_decision`
- `comments`

## Decisions attendues

- `EXACT_0M` : `ACCEPT_MATCH` ou `SAME_SITE_DIFFERENT_OBJECT`
- `VERY_CLOSE_2M` : `ACCEPT_MATCH`, `KEEP_SEPARATE` ou `NEED_FIELD_VALIDATION`
- `DIFFERENT_OBJECT` : `SAME_SITE_DIFFERENT_OBJECT` ou `KEEP_SEPARATE`
- `ORPHAN` : `WAIT_SOURCE_FIX` ou `INVALID_GEOMETRY`

## A renvoyer

Renvoyer uniquement le CSV final complete.
