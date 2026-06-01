# Schéma Directeur de Convergence (Master Plan) : abh_sebou_070426 ➔ abh_sad

## 1. Contexte & Enjeux
La plateforme applicative **WQDSS / SAD Sebou** s'appuie sur la base de production `abh_sad` (qui alimente FastAPI, Modèles de simulation SWAT/WASP et Dashboards React). En parallèle, la base d'audit `abh_sebou_070426` contient 45 tables récapitulant les exports massifs, parfois bruts, de l'ABHS. 
L'objectif est d'absorber, nettoyer et consolider toutes les données pertinentes vers `abh_sad` sans casser les API existantes ni créer d'anomalies de lignage (conservation stricte des brèches brutes via le système de flaggages QA).

## 2. Lignes Directrices (Principes d'Acquisition)
1. **ELT Structuré** : Aucune création / ingestion "spaghetti". Toute table "sandbox" suit un pattern Extraction -> Mapping (Ref/Param) -> Load (Target `abh_sad` avec préséance et Traçabilité).
2. **"Drop Nothing" & Flag Everything** : Les doublons stricts ne crashent pas le système mais sont conservés en mode inactif. Les doublons conflictuels lèvent un marqueur QA (`flag_is_doublon_candidat`).
3. **Isolations des Tables Brutes** : Les tables de type `_jr` ou `suivi_*` trop hétéroclites sont remappées dans des couches dimensionnelles `mesure_qualite_unifiee` ou `mesure_debit_unifiee` plutot que conservées en 1:1.
4. **Idempotence des Scripts** : Lancer un Lot 10 fois ne double jamais les données, grâce aux contraintes d'unicités souples ou aux vérifications logicielles en aval.

## 3. Topologie de l'Architecture Cible (abh_sad)
La convergence s'harmonise en Schémas (Layers) :
- `adm` : Limites territoriales, Villes, Douars.
- `geo` : Topologie physique (Bassins, RÉseau hydrographique, Aquifères).
- `infra` : Ouvrages (Barrages, Forages, Stations Actives infra_stations_abhs).
- `hydro` : Débits, Niveaux d'eau.
- `meteo` : Précipitations, Évaporation.
- `inv` : Sources de pollution, Rejets Industriels, Stations d'épurations.
- `qualite` : Pôle central Unifié des mesures Ph/Chim/Bacterio, prelevements et campagnes IDP.
- `api` : Vues matérialisées exposées pour les endpoints OpenAPI.

## 4. Gouvernance de la Migration par "Lots" et Source du Pilotage
La bascule s'effectuera par mini-lots sous un triple contrôle.
- **Source d'autorité** : Le registre `docs/12_historique_et_archives/root_legacy/11_catalogue_decision_tables.md` fait foi pour l'orientation première. Cependant, toute "Décision" (ex: MIGRER, NORMALISER) de ce catalogue est **heuristique** et ne constitue pas un mandat d'écriture.

Le Flux de Validation d'un Lot OBLIGATOIRE avant action sur `abh_sad` est désormais de 5 étapes :
1. **Confirmation du Lot** (`docs/12_historique_et_archives/root_legacy/12_plan_execution_par_lots.md`) : Rappel de décision et tables.
2. **Audit A/B Détaillé** (`docs/12_lotX_<nom>_audit_ab.md`) : Confrontation métrique formelle `abh_sebou_070426` vs `abh_sad` (Structure, clés, types, orphelins).
3. **Mappage Technique** (`docs/13_lotX_<nom>_mapping.md`) : Règles absolues d'update/skip, NULLs, et de conflits métier définies champ par champ.
4. **Dry-Run Script** (`scripts/lotX_<nom>_dry_run.py`) : Script de pure lecture mesurant : `would_insert`, `would_update`, `would_ignore`, `would_conflict`. 
5. **Validation Métier** : Exécution sur `abh_sad` strictement débloquée uniquement par l'accord final du Product Owner.
## 5. Priorisation Recommandée (Ordre Canonique)
La base `abh_sad` fonctionnant sur un principe référentiel (Tout prélèvement s'attache à une station), la migration est hiérarchique :
1. **LOT ADMIN / GEO** : Bases spatiales et administratives. *(Sans ça, on perd le géocodage)*.
2. **LOT INFRASTRUCTURE** : Validation des tables `infra_stations_abhs`, `infra_barrages_abhs`. *(Sans ça, on a des orphelins).*
3. **LOT HYDRO/METEO** : Volumes importants mais simples structurellement (Précipitations, Débits, Niveaux).
4. **LOT INVENTAIRES POLLUTION** (inv_.*) : Point critique des rejets. Modèles Spatiaux.
5. **LOT QUALITE MASSIF** : Rivières, Nappes, Barrages vers Qualité Unifiée.
6. **LOT QUALITE COMPLEXES** : Campagnes IDP ciblées nécessitant un dictionnaire mapping.
