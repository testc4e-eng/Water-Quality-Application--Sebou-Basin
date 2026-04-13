# Prompts personnalises - Partie 3 Planification Dev

## Contexte cible
- Projet: SAD Sebou 2026
- Focus: mission 4
- Profil principal: equipe dev SIG
- Etat reel: application deja developpee en React + FastAPI + PostgreSQL/PostGIS, avec modules climat, hydro, qualite, SWAT, couches SIG et administration partielle

---

# 1. Prompt personnalise - Decoupage en taches

```text
Tu agis comme un architecte logiciel senior et chef de projet technique.

Tu travailles sur le projet SAD Sebou 2026, en particulier sur la mission 4 de developpement du Systeme d'Aide a la Decision pour l'ABHS Sebou.

Contexte reel du projet :
- Frontend : React + Vite + TypeScript
- Backend : FastAPI
- Base de donnees : PostgreSQL avec couches SIG et vues metier
- Modules deja presents : auth, stations, barrages, couches SIG, dashboards climat/hydro/qualite, SWAT, raw data viewer
- Enjeu principal : consolider l'existant, fiabiliser les flux mission 4, et preparer une implementation maintenable
- Profil equipe : developpeurs SIG et developpeurs web

Objectif :
Transformer la conception technique actuelle du projet en taches de developpement concretes, courtes, utiles et directement exploitables par l'equipe.

Regles :
- rester strictement coherent avec le projet reel
- ne pas inventer de nouvelles fonctionnalites majeures
- produire des taches techniques synthetiques
- regrouper les taches par module
- mettre en avant les dependances si elles sont bloquantes
- se limiter aux taches principales du MVP mission 4 et de sa consolidation

Sortie attendue :

MODULE : [nom du module]
Taches :
- [Backend] ...
- [Frontend] ...
- [SIG] ...
- [Data] ...
- [Transversal] ...

Modules a couvrir en priorite :
- referentiel SIG
- API coeur
- dashboards climat/hydro/qualite
- integration SWAT
- administration/raw
- reporting
- qualite technique minimale

Le resultat doit etre precis, concis, synthetique, et directement exploitable par une equipe de developpement SIG.
```

---

# 2. Prompt personnalise - Roadmap technique

```text
Tu agis comme un responsable technique senior specialise en planification du developpement.

Tu travailles sur le projet SAD Sebou 2026, mission 4, deja partiellement implemente en React + FastAPI + PostgreSQL/PostGIS.

Contexte reel :
- l'application existe deja
- les modules coeur sont presents mais a consolider
- l'objectif n'est pas de repartir de zero, mais d'organiser la progression technique de la mission 4
- le coeur metier repose sur les couches SIG, les objets stations/barrages/sous-bassins, les dashboards climat/hydro/qualite et les resultats SWAT

Objectif :
Organiser les taches techniques en phases de developpement logiques, dans un ordre coherent avec les dependances techniques et les priorites du MVP mission 4.

Regles :
- produire entre 4 et 5 phases maximum
- mettre le socle SIG/data/API dans les premieres phases
- garder une logique realiste pour une equipe reduite
- ne pas estimer les charges
- ne pas produire un planning sprint
- rester precis, concis et synthetique

Format de sortie :

PHASE 1 : [nom]
Modules concernes :
- ...
Dependances majeures :
- ...
Taches :
- ...

PHASE 2 : ...

Le resultat doit refleter le contexte reel du SAD Sebou mission 4, pas une roadmap generique.
```

---

# 3. Prompt personnalise - Priorisation technique

```text
Tu agis comme un expert senior en priorisation technique et en pilotage de backlog.

Tu travailles sur le projet SAD Sebou 2026, mission 4, dans un contexte de consolidation d'une application existante de type React + FastAPI + PostgreSQL/PostGIS.

Contexte reel :
- les couches SIG et les donnees metier sont critiques
- les dashboards climat/hydro/qualite et SWAT portent la valeur metier visible
- le module raw et les fonctions admin doivent etre encadres
- l'equipe doit d'abord securiser le MVP mission 4 avant d'industrialiser

Objectif :
Definir l'ordre de priorite des modules et des taches techniques pour guider l'implementation de la mission 4.

Regles :
- respecter les dependances techniques majeures
- faire apparaitre d'abord les elements critiques du MVP
- rester coherent avec l'architecture et les modules reels
- ne pas produire de roadmap ni de sprint planning
- ne pas estimer les charges
- rester tres synthétique

Format de sortie :

PRIORITE 1 - Elements critiques
Modules concernes :
- ...
Justification :
...
Taches prioritaires :
- ...

PRIORITE 2 - Composants necessaires
...

PRIORITE 3 - Composants complementaires
...

PRIORITE 4 - Industrialisation
...

Le resultat doit etre precis, concis, synthétique, oriente mission 4 et utile pour une equipe de developpeurs SIG.
```

---

# Recommandation d'usage

- Utiliser le prompt 1 pour produire le backlog technique initial.
- Utiliser le prompt 2 pour ordonner ce backlog en phases.
- Utiliser le prompt 3 pour fixer l'ordre de developpement reel.
- Pour votre contexte, toujours rappeler:
  - mission 4
  - consolidation de l'existant
  - priorite aux couches SIG, objets metier, dashboards et SWAT
