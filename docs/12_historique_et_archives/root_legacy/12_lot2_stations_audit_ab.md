# LOT 2 : Audit A/B détaillé — Référentiel Stations

## 1. Résumé Global
- **Base Source Sandbox** : `abh_sebou_070426.public.infra_stations_abhs`
- **Base Cible Production** : `abh_sad.infra.stations_mesure`
- **Volumétrie Source** : 390 stations
- **Volumétrie Cible** : 390 stations

### Synthèse des Correspondances :
- 🟢 **Match Exact** : 390
- 🟡 **Match Approximatif** : 0
- 🔵 **Nouveau (À créer)** : 0
- 🔴 **Conflits spatiaux/nominaux** : 0
- ⚪ **Orphelins cible (existant dans prod mais pas dans source)** : 0

*(Total anomalies brutes techniques: 18)*

## 2. Analyse des Clés Métier (Stratégie de Liaison)
> **Choix de la clé de mapping identifiée** : La combinaison **NOM NORMALISÉ** + **CODE (ire_station)** s'impose comme clé heuristique, couplée obligatoirement à la **distance géographique** (`< 1000m`).
> - *Justification* : L'attribut 'code' n'est pas fiable seul (parfois nul ou sur `ire_precipitation`). Le nom lui-même peut avoir des doublons. Un matching solide validera Soit le Code Soit le Nom, TOUT en vérifiant la distance Haversine pour éviter les usurpations (classées dans Conflit).

## 3. Profil des Anomalies Détectées
Les anomalies précises ont été listées (voir Registre des Anomalies 15). Focus sur les grands types:
- **NOM_NULL** : 4 occurrences
- **DOUBLON_SOURCE_NOM** : 14 occurrences

## 4. Comparaison Structurelle
### Colonnes SOURCE (`infra_stations_abhs`)
`id_station`, `code_commune`, `ire_station`, `nom_station`, `type_station`, `code_ressource`, `etat`, `organisme_resp`, `ire_precipitation`, `types_mesures`, `observation`, `coord_x`, `coord_y`, `altitude_z`, `geom`

### Colonnes CIBLE (`infra.stations_mesure`)
`id`, `code_station`, `nom`, `type_station`, `date_mise_service`, `altitude_m`, `organisme_gestionnaire_id`, `commune_id`, `geom`, `actif`

