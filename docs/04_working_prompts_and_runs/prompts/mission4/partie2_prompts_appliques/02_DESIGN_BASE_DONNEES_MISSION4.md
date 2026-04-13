# Design Base de Donnees - SAD Sebou 2026

## 1. Synthese rapide
- Le design data a retenir doit partir de la base metier existante et non d'un schema theorique complet reconstruit from scratch.
- Le modele cible doit separer entites de reference, entites spatiales, series temporelles, resultats de modeles et traces techniques.
- La logique generale est hybride: conservation des tables/vues existantes utiles, puis formalisation progressive d'un schema cible versionne.
- Niveau de complexite: Moyen a eleve.

## 2. Principes de modelisation
- Principes directeurs:
  - s'appuyer sur la realite de la base actuelle
  - distinguer reference, spatial, temporel, derive, technique
  - conserver des identifiants stables
- Hypotheses structurantes:
  - PostgreSQL est la source principale
  - les couches geographiques sont deja stockees en base
  - les dashboards reposent sur des vues `api.*`
- Choix majeurs:
  - ne pas casser les vues existantes
  - documenter un modele logique cible par domaines

## 3. Entites principales
| Entite | Type | Role metier | Attributs cles | Identifiant principal |
|---|---|---|---|---|
| Bassin | Spatiale / reference | Unite territoriale principale | nom, geom | id |
| SousBassin | Spatiale / metier | Unite d'analyse fine | nom_sous_bassin, geom | id |
| Station | Spatiale / metier | Point de mesure | id_station, nom_station, geom | id_station |
| Barrage | Spatiale / metier | Ouvrage hydraulique | nom_barrage, geom, attributs | id |
| LimiteAdministrative | Reference spatiale | Contextualisation territoriale | code, nom, geom | code/id |
| SerieMesure | Temporelle | Support des observations | ts_id, datetime, value | ts_id + datetime |
| StationStats | Derivee / vue | Resume metier station | station_id, property_name | compose |
| QualiteMesure | Temporelle / qualite | Indicateurs N/O/P | station_code, date, n, o, p | compose |
| ScenarioSWAT | Metier / modele | Scenario de simulation | scenario_id, nom | scenario_id |
| ResultatSWAT | Temporelle / derivee | Sorties par sous-bassin/reach | scenario_id, subbasin/reach, date, variables | compose |
| Utilisateur | Technique | Authentification | email, hash, role | id/email |
| TraceAdmin | Technique / tracabilite | Journalisation des actions | user_id, action, cible, date | id |

## 4. Relations principales
| Entite source | Relation | Entite cible | Cardinalite | Commentaire |
|---|---|---|---|---|
| Bassin | contient | SousBassin | 1-N | structure territoriale |
| SousBassin | contient / rattache | Station | 1-N ou N-N | a clarifier selon source |
| SousBassin | contient / rattache | Barrage | 1-N ou N-N | a clarifier metier |
| Station | produit | SerieMesure | 1-N | observations hydrologiques/climat |
| Station | produit | QualiteMesure | 1-N | mesures qualite |
| ScenarioSWAT | produit | ResultatSWAT | 1-N | sorties modele |
| Utilisateur | genere | TraceAdmin | 1-N | securite et audit |

## 5. Contraintes metier et techniques
- Contraintes d'integrite:
  - ids metier stables
  - relations explicites entre stations, barrages, sous-bassins
- Contraintes spatiales:
  - geometries valides
  - SRID coherent
- Contraintes temporelles:
  - gestion de la granularite daily/monthly/annual/latest
  - absence de doublons sur cles composees
- Contraintes qualite/tracabilite:
  - source et unite documentees
  - journalisation minimale des modifications critiques

## 6. Alignement avec le besoin
- Alignement avec les objectifs: bon pour consultation, analyse, SIG et integration modeles.
- Alignement avec les donnees identifiees: bon, car basee sur les objets deja visibles.
- Alignement avec l'architecture: bon pour FastAPI + PostgreSQL.
- Arbitrages:
  - conserver vues `api.*` a court terme
  - formaliser progressivement le modele logique cible

## 7. Points forts
- Bonne couverture du besoin metier.
- Modele compatible avec spatial + temporel.
- Evolution possible sans casser l'existant.

## 8. Points faibles
- Certains liens reels restent implicites dans le repo.
- SWAT et certaines vues restent partiellement documentes.
- Risques de duplication si tables, vues et objets frontend divergent.

## 9. Bonnes pratiques
- Modelisation:
  - un dictionnaire de donnees par domaine
  - ids et nomenclatures stables
- PostGIS:
  - index spatiaux, geometries valides, SRID explicite
- Series temporelles:
  - conventions de granularite et d'unites
  - cles composees stables
- Gouvernance:
  - tracer origine, frequence et proprietaire des donnees

## 10. Propositions
- Proposition 1: modele MVP
  - perimetre: tables/vues existantes critiques + users
  - benefices: implementation rapide
  - limites: dependance a l'existant
  - effort relatif: Faible
- Proposition 2: modele intermediaire
  - perimetre: logique par domaines + traces admin + dictionnaire de donnees
  - benefices: meilleur controle mission 4
  - limites: demande cadrage data
  - effort relatif: Moyen
- Proposition 3: modele cible moyen terme
  - perimetre: schema versionne complet + historisation + gouvernance avancee
  - benefices: robustesse institutionnelle
  - limites: plus lourd
  - effort relatif: Eleve

## 11. Recommandations
- Recommandation principale: partir du modele intermediaire.
- Elements a valider avant implementation:
  - relations metier officielles stations/bassins/barrages
  - source officielle des resultats SWAT
  - regles de mise a jour admin
- Sous-etape suivante recommandee: Definition des modules.

## 12. Questions ouvertes
- Quelle part du schema actuel doit etre versionnee dans Alembic ?
- Faut-il garder les vues `api.*` comme contrat stable officiel ?
- Quelles traces techniques et metier sont obligatoires pour la production ?
