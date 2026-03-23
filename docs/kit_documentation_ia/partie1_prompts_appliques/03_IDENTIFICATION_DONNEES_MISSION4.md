# Identification des Donnees - SAD Sebou 2026

## 1. Synthese rapide
- Le projet dispose deja d'un socle de donnees important pour la mission 4.
- Les donnees les plus critiques sont les couches SIG de reference, les entites stations/barrages/sous-bassins, les vues temporelles climat-hydro, les vues qualite et les resultats SWAT.
- Le niveau de maturite des donnees est globalement moyen: disponibilite bonne, formalisation et gouvernance partielles.
- Priorite: qualifier et securiser les donnees existantes plutot que multiplier les nouvelles sources.

## 2. Donnees necessaires

### Donnees metier
- stations
- barrages
- alertes
- utilisateurs et droits

### Donnees spatiales
- bassin Sebou
- sous-bassins
- reseau hydrographique
- stations geolocalisees
- barrages geolocalises
- couches administratives

### Donnees temporelles
- latest
- daily
- monthly
- annual
- mesures qualite par station

### Donnees derivees ou calculees
- KPIs climat
- KPIs hydro
- KPIs qualite
- resultats SWAT par scenario

### Metadonnees
- identifiants metier
- unites
- granularite temporelle
- referentiel spatial / SRID
- source des vues et tables

## 3. Cartographie des sources
| Donnee | Source | Format | Disponibilite | Usage principal | Criticite |
|---|---|---|---|---|---|
| Stations | `public.stations_abhs` | Table geospatiale | Disponible | Carte, listes, liens mesures | Haute |
| Barrages | `public.barrages_abhs` | Table geospatiale | Disponible | Carte, analyse barrage | Haute |
| Bassin | `public.bassin_sebou` | Table geospatiale | Disponible | Contexte territorial | Haute |
| Sous-bassins | `public.sous_bassin_sebou` | Table geospatiale | Disponible | Analyse spatiale | Haute |
| Reseau hydro | `public.reseau_hydro_abhs` | Table geospatiale | Disponible | Contexte hydrographique | Moyenne |
| Limites admin | `public.adm_*` | Tables geospatiales | Disponible | Filtres territoriaux | Moyenne |
| Stats stations | `api.v_stations_stats` | Vue | Disponible | Selection et lecture metier | Haute |
| Series climat/hydro | `api.v_measurements_*` | Vues | Disponible | Dashboards et KPIs | Haute |
| Qualite eaux | `api.v_quality_*` | Vues | Disponible | Dashboards qualite | Haute |
| SWAT | API/tables associees | Tables + endpoints | Partiellement visible | Analyse scenario | Haute |

## 4. Analyse de qualite
| Donnee | Qualite percue | Risque | Impact | Verification recommandee |
|---|---|---|---|---|
| Couches SIG de reference | Plutot bonne | Moyen | Carte et analyse spatiale | Verifier SRID, geometries nulles, noms |
| Stations | Bonne mais a confirmer | Moyen | Lien carte/mesures | Verifier ids et geom |
| Barrages | Bonne mais a confirmer | Moyen | Lien carte/analyse | Verifier geom et attributs |
| Vues climat/hydro | Utiles et structurees | Moyen | Dashboards critiques | Verifier continuite et unites |
| Vues qualite | Utiles | Moyen | Analyse qualite | Verifier couverture stations/periodes |
| SWAT | Critique mais peu visible dans le repo | Eleve | Valeur metier forte | Documenter source et mapping |

## 5. Points forts
- Donnees metier deja mobilisables.
- Couches SIG deja raccordees au frontend.
- Granularites temporelles deja exposees.
- Patrimoine de reference territorial deja visible.

## 6. Points faibles
- Manque de dictionnaire de donnees versionne.
- Tracabilite partielle des transformations et vues.
- Incertitude sur certains jeux SWAT et sur leur documentation.
- Gouvernance des modifications `raw` non totalement encadree.

## 7. Risques lies aux donnees
| Risque | Probabilite | Impact | Priorite | Mitigation |
|---|---|---|---|---|
| Incoherence objets SIG / series temporelles | Moyenne | Eleve | Haute | Verifier cles et relations |
| GeoJSON ou projections incoherentes | Moyenne | Eleve | Haute | Auditer SRID et payloads |
| Trous dans les series | Moyenne | Eleve | Haute | Controler continuite et couverture |
| Couplage fort aux vues `api.*` | Elevee | Moyen | Haute | Documenter et stabiliser les vues |
| Modifications `raw` non maitrisees | Moyenne | Eleve | Haute | Restreindre et journaliser |

## 8. Priorisation des donnees
- Donnees indispensables MVP:
  - stations, barrages, bassin, sous-bassins
  - vues climat/hydro
  - vues qualite
  - sorties SWAT utilises par l'interface
- Donnees importantes mais non bloquantes:
  - alertes enrichies
  - metadata qualite de donnees
  - historisation admin
- Donnees a traiter plus tard:
  - lineage complet
  - catalogue de donnees formalise
  - reporting data avance

## 9. Bonnes pratiques
- Collecte: identifier une source de verite par type de donnee.
- Qualite: controler completude, unites, dates et geometries.
- Structuration: stabiliser ids, noms, referentiels et vues.
- Documentation/gouvernance: decrire l'origine, la periodicite et le responsable de chaque source critique.

## 10. Propositions
- Proposition 1: valider en priorite les couches et entites SIG critiques.
  - donnee concernee: bassin, sous-bassins, stations, barrages
  - probleme actuel: risque de couplage implicite
  - action recommandee: audit rapide des champs/geom/ids
  - benefice attendu: base cartographique fiable
- Proposition 2: fiabiliser les vues temporelles.
  - donnee concernee: `api.v_measurements_*`, `api.v_quality_*`
  - probleme actuel: couverture et qualite non formalisees
  - action recommandee: verifier continuite, unites, plage temporelle
  - benefice attendu: dashboards credibles
- Proposition 3: documenter les donnees SWAT plus tard mais rapidement.
  - donnee concernee: sorties scenario
  - probleme actuel: visibilite partielle dans le repo
  - action recommandee: cartographier tables, variables et correspondances
  - benefice attendu: meilleure integration mission 4

## 11. Recommandations
- Recommandation principale: pour mission 4, securiser d'abord les donnees qui relient carte, indicateurs et modeles.
- Donnees a securiser en premier:
  - couches de reference SIG
  - stations/barrages
  - vues climat/hydro
  - vues qualite
  - donnees SWAT exposees
- Sous-etape suivante recommandee: Conception technique.

## 12. Questions ouvertes
- Quelle est la source officielle des resultats SWAT en base ?
- Quels champs sont obligatoires pour les couches de reference ?
- Quelles unites et nomenclatures sont imposees par le client ?
- Quel niveau de fraicheur des donnees est attendu pour l'exploitation ?
