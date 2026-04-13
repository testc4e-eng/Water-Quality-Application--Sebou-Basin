# Partie 1 - Analyse du besoin

## Perimetre applique
- Projet: SAD Sebou 2026
- Source: etat d'avancement du repo, note methodologique, CPS partiellement exploitable
- Focus: mission 4, angle developpeur SIG

---

# 1. Analyse du probleme

## Synthese rapide
Le projet doit transformer des donnees hydro-climatiques, qualitatives et geospatiales du bassin du Sebou en un SAD web exploitable par l'ABHS. Le besoin n'est plus conceptuel: une base applicative existe deja, mais elle reste heterogene, partiellement industrialisee et encore insuffisamment formalisee pour une mission 4 robuste. Le vrai probleme n'est pas de "creer une application", mais de consolider un systeme coherent, fiable et maintenable pour la decision.

## Problemes identifies
- Metier: besoin de centraliser la lecture de la qualite des eaux, de l'hydrologie et des resultats de modelisation.
- Operationnel: plusieurs flux et vues existent, mais la chaine complete collecte -> integration -> visualisation -> reporting n'est pas encore totalement stabilisee.
- Technique: coexistence de plusieurs styles backend (`api/v1` et `routers`), de plusieurs acces DB (SQLAlchemy et psycopg2), et d'un schema applicatif incomplet.
- Donnees: le patrimoine de donnees est riche, mais la gouvernance, la tracabilite et la formalisation du schema reel restent partielles.

## Causes probables
- Projet construit par couches successives selon les missions 1 a 4.
- Priorite donnee a la restitution fonctionnelle avant l'industrialisation.
- Dependance forte a des vues metier existantes et a la structure reelle de la base.
- Absence visible de socle complet de tests, monitoring et documentation contractuelle unifiee.

## Points forts
- Stack deja en place et exploitable.
- Donnees SIG et couches metier bien presentes.
- Modules climat, hydro, qualite, SWAT deja relies au frontend.
- Auth et exploration des donnees deja disponibles.

## Points faibles / risques
- Architecture backend non unifiee.
- Module `raw` puissant mais sensible en securite et gouvernance.
- Schema de donnees metier non versionne dans le repo.
- Reporting et maintenance encore peu formalises.

## Lecture mission 4 pour un developpeur SIG
Le coeur du besoin mission 4 cote SIG est de fiabiliser la chaine des couches spatiales, nomenclatures, stations, barrages, sous-bassins et leurs liens avec les indicateurs hydro-qualite. La priorite n'est pas de multiplier les cartes, mais de garantir coherence geographique, qualite GeoJSON, referentiels et lisibilite des flux.

## Recommandation
Sous-etape suivante validee: clarification des objectifs, en separant clairement MVP mission 4 et evolutions ulterieures.

---

# 2. Clarification des objectifs

## Synthese rapide
Les objectifs implicites du projet sont globalement clairs, mais trop larges si on ne distingue pas ce qui releve du noyau mission 4 et ce qui releve d'une phase d'industrialisation. Il faut reformuler les objectifs en resultats verifiables pour l'equipe SIG et pour l'ABHS.

## Objectifs clarifies

### Objectifs metier
- Fournir a l'ABHS Sebou une lecture centralisee et exploitable de la qualite des eaux de surface.
- Soutenir l'analyse croisee entre hydrologie, qualite et resultats de modelisation.
- Faciliter la consultation, la comparaison et la restitution des informations utiles a la decision.

### Objectifs operationnels
- Permettre la consultation des stations, barrages, sous-bassins et couches administratives.
- Afficher des tableaux de bord climat, hydro et qualite sur une meme application.
- Integrer les resultats SWAT dans les parcours utilisateurs.
- Permettre un acces admin aux donnees brutes pour verification et mise a jour.

### Objectifs techniques
- Stabiliser les endpoints utilises par le frontend.
- Garantir des sorties GeoJSON correctes et homogenes.
- Unifier progressivement les conventions backend et l'acces DB.
- Renforcer la securite et la tracabilite des operations sensibles.

### Objectifs donnees
- Identifier les sources critiques de mission 4.
- Verifier la coherence stations / bassins / sous-bassins / mesures / scenarios.
- Qualifier les vues metier et les tables SIG comme socle du SAD.

## Priorisation proposee
| Objectif | Priorite | Horizon |
|---|---|---|
| Stabiliser la consultation cartographique et les couches metier | Haute | Court terme |
| Fiabiliser les dashboards climat/hydro/qualite | Haute | Court terme |
| Consolider l'integration SWAT dans les parcours | Haute | Court terme |
| Encadrer le module raw et la gouvernance des donnees | Haute | Court terme |
| Formaliser schema, tests, CI/CD, maintenance | Moyenne | Moyen terme |
| Etendre reporting avance et analytics supplementaires | Moyenne | Plus tard |

## Points flous a eviter
- "Application complete" sans criteres de validation.
- "Reporting" sans livrables cibles.
- "Integration des modeles" sans perimetre fonctionnel exact.
- "Plateforme SAD" sans distinguer consultation, administration et exploitation.

## Lecture mission 4 pour un developpeur SIG
Pour vous, l'objectif prioritaire doit etre formule ainsi: "garantir une restitution geospatiale fiable et exploitable des entites et indicateurs de mission 4, relies aux donnees hydro-qualite et aux sorties de modeles". Cette formulation est plus actionnable qu'un objectif trop large de type "developper toute la plateforme SAD".

## Recommandation
Sous-etape suivante validee: identification des donnees, avec separation stricte entre donnees indispensables mission 4 et donnees futures.

---

# 3. Identification des donnees

## Synthese rapide
Le projet dispose deja d'un socle de donnees substantiel. Les donnees les plus critiques pour mission 4 sont les couches SIG de reference, les entites metier (stations, barrages, sous-bassins), les vues temporelles climat/hydro, les vues qualite et les resultats SWAT. Le besoin principal n'est pas de chercher plus de donnees, mais de qualifier, relier et securiser celles qui existent deja.

## Donnees necessaires

### Donnees metier
- stations
- barrages
- alertes
- utilisateurs / roles

### Donnees spatiales
- bassin Sebou
- sous-bassins
- reseau hydrographique
- barrages geolocalises
- stations geolocalisees
- limites administratives

### Donnees temporelles
- series `api.v_measurements_latest`
- series `api.v_measurements_daily`
- series `api.v_measurements_monthly`
- series `api.v_measurements_annual`
- mesures qualite par station

### Donnees derivees
- KPIs climat
- KPIs hydro
- KPIs qualite
- sorties SWAT par scenario, sous-bassin ou reach

### Metadonnees utiles
- identifiants stations et barrages
- systeme de projection / SRID
- granularite temporelle
- definition des indicateurs
- provenance des vues `api.*`

## Cartographie concise des sources
| Donnee | Source probable | Disponibilite | Criticite |
|---|---|---|---|
| Stations ABHS | `public.stations_abhs` | Disponible | Haute |
| Barrages ABHS | `public.barrages_abhs` | Disponible | Haute |
| Sous-bassins | `public.sous_bassin_sebou` | Disponible | Haute |
| Bassin Sebou | `public.bassin_sebou` | Disponible | Haute |
| Reseau hydro | `public.reseau_hydro_abhs` | Disponible | Moyenne |
| Admin boundaries | `public.adm_*` | Disponible | Moyenne |
| Stats stations | `api.v_stations_stats` | Disponible | Haute |
| Series climat/hydro | `api.v_measurements_*` | Disponible | Haute |
| Qualite eaux | `api.v_quality_*` | Disponible | Haute |
| Resultats SWAT | endpoints et tables associees | Partiellement visible | Haute |

## Risques donnees
- Incoherence possible entre tables physiques et vues `api.*`
- Qualite temporelle a verifier: continuite, trous, periodicite
- Qualite geospatiale a verifier: geom, SRID, alignement cartes
- Gouvernance partielle sur les mises a jour `raw`
- Documentation insuffisante des champs et unites

## Priorisation donnees mission 4

### Indispensables MVP
- couches `bassin`, `sous-bassins`, `stations`, `barrages`
- vues climat/hydro
- vues qualite
- resultats SWAT consommes par le frontend

### Importantes mais non bloquantes
- alertes enrichies
- metadonnees de qualite de donnees
- historisation fine des actions admin

### Plus tard
- catalogues data plus complets
- reporting automatise avance
- lineage complet des transformations

## Lecture mission 4 pour un developpeur SIG
Votre priorite data SIG est de verrouiller 4 choses: qualite des geometries, coherence des identifiants, stabilite des couches GeoJSON, et lien fiable entre objets spatiaux et series temporelles/indicateurs. C'est ce qui conditionne la credibilite du SAD cote carte et dashboards.

## Recommandation
Prochaine etape du workflow IA: conception technique, avec focus sur architecture applicative, design data cible et definition des modules mission 4 a partir de ce socle de donnees.

---

# Synthese globale partie 1

- Le projet n'est pas un prototype vide: c'est un SAD deja bien avance qu'il faut consolider.
- Le vrai sujet mission 4 est la fiabilisation et l'industrialisation du systeme existant.
- Pour un developpeur SIG, le noyau critique est la coherence couches SIG <-> entites metier <-> indicateurs hydro/qualite <-> resultats SWAT.
- La partie 1 du workflow IA est donc validee avec une maturite globale `moyenne a bonne`.
