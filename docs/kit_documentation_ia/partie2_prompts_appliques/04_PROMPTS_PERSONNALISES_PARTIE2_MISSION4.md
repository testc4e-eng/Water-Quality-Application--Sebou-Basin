# Prompts personnalises - Partie 2 Conception technique

## Contexte cible
- Projet: SAD Sebou 2026
- Focus: mission 4
- Profil principal: developpeur SIG / equipe SIG
- Etat reel: application deja en place avec React + FastAPI + PostgreSQL/PostGIS, couches SIG, dashboards climat/hydro/qualite, SWAT, raw data viewer

---

# 1. Prompt personnalise - Architecture applicative

```text
Tu agis comme un architecte logiciel senior specialise en hydrologie, SIG et applications web de decision.

Tu travailles sur le projet SAD Sebou 2026, mission 4.

Contexte reel :
- l'application existe deja en React + FastAPI + PostgreSQL/PostGIS
- des modules metier sont deja visibles : auth, stations, barrages, layers, names, climat, hydro, qualite, SWAT, raw
- l'objectif n'est pas de repartir de zero, mais de definir une architecture cible de consolidation, simple et maintenable

Ta mission :
Proposer l'architecture applicative cible la plus coherente avec l'etat reel du projet et les besoins de mission 4.

Tu dois distinguer :
- frontend
- backend/API
- base de donnees
- traitements/imports
- integrations externes

Tu dois aussi decrire les flux principaux et signaler les composants indispensables du MVP.

Regles :
- rester coherent avec l'existant
- ne pas proposer une architecture surdimensionnee
- rester precis, concis, synthétique
- ne pas detailler encore le schema complet ni tous les modules internes

Format de sortie :

# Architecture Applicative - SAD Sebou 2026 Mission 4

## Synthese rapide
- ...

## Architecture cible
- ...

## Composants principaux
- ...

## Flux applicatifs
- ...

## Points forts
- ...

## Points faibles
- ...

## Recommandation
- ...
```

---

# 2. Prompt personnalise - Design base de donnees

```text
Tu agis comme un expert senior en modelisation de donnees, PostgreSQL/PostGIS et donnees hydrologiques.

Tu travailles sur le projet SAD Sebou 2026, mission 4.

Contexte reel :
- la base metier existe deja partiellement
- plusieurs tables/vues sont deja consommees par l'application
- il faut proposer un design cible sans casser l'existant
- les objets critiques sont : bassin, sous-bassins, stations, barrages, vues climat/hydro, vues qualite, resultats SWAT, utilisateurs et traces

Ta mission :
Proposer un design de base de donnees logique et evolutif, aligne sur le projet reel.

Tu dois distinguer :
- entites metier
- entites de reference
- entites spatiales
- entites temporelles
- entites techniques / tracabilite

Regles :
- partir de l'existant
- ne pas inventer des jeux de donnees absents
- rester precis, concis, synthétique
- ne pas produire encore le SQL complet

Format de sortie :

# Design Base de Donnees - SAD Sebou 2026 Mission 4

## Synthese rapide
- ...

## Entites principales
| Entite | Type | Role | Cle principale |

## Relations principales
| Source | Relation | Cible | Cardinalite |

## Contraintes critiques
- ...

## Points forts
- ...

## Points faibles
- ...

## Recommandation
- ...
```

---

# 3. Prompt personnalise - Definition des modules

```text
Tu agis comme un architecte logiciel senior specialise en structuration modulaire d'applications hydrologie et SIG.

Tu travailles sur le projet SAD Sebou 2026, mission 4.

Contexte reel :
- le projet dispose deja de briques visibles : auth, referentiel SIG, stations, barrages, dashboards climat/hydro/qualite, SWAT, raw, administration partielle
- l'objectif est de transformer ces briques en modules explicites, avec responsabilites claires
- le decoupage doit rester simple et utile pour une equipe de developpeurs SIG

Ta mission :
Definir les modules fonctionnels et techniques de l'application, en separant clairement les responsabilites.

Tu dois distinguer :
- modules metier
- modules donnees
- modules visualisation/interface
- modules administration/gouvernance
- modules integration/traitement

Regles :
- ne pas inventer de modules non justifies
- rester coherent avec le projet reel
- rester precis, concis, synthétique
- ne pas produire encore le backlog detaille

Format de sortie :

# Definition des Modules - SAD Sebou 2026 Mission 4

## Synthese rapide
- ...

## Modules principaux
| Module | Type | Objectif | Utilisateurs |

## Dependances critiques
| Module | Depend de | Fournit |

## Modules MVP
- ...

## Points forts
- ...

## Points faibles
- ...

## Recommandation
- ...
```

---

# Recommandation d'usage

- Utiliser le prompt 1 pour fixer l'architecture cible de consolidation.
- Utiliser le prompt 2 pour structurer le modele logique de donnees.
- Utiliser le prompt 3 pour obtenir un decoupage modulaire exploitable avant planification.
- Toujours rappeler:
  - mission 4
  - application deja existante
  - priorite a la coherence SIG, dashboards, SWAT et gouvernance data
