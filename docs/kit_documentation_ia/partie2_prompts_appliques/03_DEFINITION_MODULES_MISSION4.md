# Definition des Modules - SAD Sebou 2026

## 1. Synthese rapide
- Le decoupage modulaire doit suivre les usages reels mission 4: consultation SIG, lecture des series, visualisation des indicateurs, exploitation SWAT, administration des donnees.
- Le projet dispose deja implicitement de plusieurs modules; il faut les rendre explicites et limiter les chevauchements.
- La logique generale recommandee est un decoupage par domaines metier et techniques transverses.
- Niveau de complexite: Moyen.

## 2. Principes de decoupage
- Principes directeurs:
  - modules centres sur responsabilites claires
  - separation consultation / administration / integration
  - alignement avec les routes API et les parcours frontend
- Hypotheses structurantes:
  - le monolithe applicatif est conserve
  - le frontend consomme une API REST stable
- Logique:
  - modules metier visibles pour l'utilisateur
  - modules data/integration visibles pour l'equipe technique

## 3. Modules principaux
| Module | Type | Objectif | Responsabilites principales | Utilisateurs concernes |
|---|---|---|---|---|
| Authentification | Technique | Gerer acces et roles | login, register, droits | tous |
| Referentiel SIG | Metier / data | Exposer couches et nomenclatures | layers, names, entites spatiales | developpeurs SIG, analysts |
| Stations et Barrages | Metier | Consulter objets terrain | listes, details, liens spatiaux | analysts, ABHS |
| Dashboard Climat | Metier | Suivre indicateurs climat | stations, stats, series, KPI | analysts |
| Dashboard Hydro | Metier | Suivre indicateurs hydro | stations, stats, series, KPI | analysts |
| Dashboard Qualite | Metier | Suivre qualite des eaux | stations, table, chart, KPI | analysts, decideurs |
| Module SWAT | Metier / modele | Exploiter scenarios | resultats, comparaisons, analyse | analysts techniques |
| Data Viewer Raw | Administration | Explorer/editer donnees autorisees | tables, colonnes, CRUD | admin |
| Import / ETL | Integration | Alimenter et preparer les donnees | scripts, import, nettoyage | equipe technique |
| Reporting / Export | Restitution | Produire sorties attendues | export, tableaux, syntheses | ABHS, analysts |
| Tracabilite / Audit | Gouvernance | Suivre actions sensibles | journaux, historique, controle | admin, equipe technique |

## 4. Interfaces et dependances
| Module | Depend de | Fournit | Interfaces ou echanges | Commentaire |
|---|---|---|---|---|
| Authentification | DB users | token, contexte user | API auth | transverse |
| Referentiel SIG | couches DB | GeoJSON, listes | API layers/names/entities | coeur SIG |
| Stations et Barrages | referentiel SIG + DB | objets metier | API stations/barrages | base d'analyse |
| Dashboard Climat | vues `api.*` | KPI, series | API climate | depend de data qualifiees |
| Dashboard Hydro | vues `api.*` | KPI, series | API hydro | depend de data qualifiees |
| Dashboard Qualite | vues `api_quality_*` | KPI, table, chart | API quality | critique mission 4 |
| Module SWAT | tables/endpoints SWAT | resultats scenario | API swat | a mieux documenter |
| Data Viewer Raw | DB + auth | lecture/edition | API raw | a securiser |
| Import / ETL | fichiers/sources externes | donnees preparees | scripts/jobs | transverse |
| Reporting / Export | tous modules metier | livrables | exports, tableaux | a formaliser |
| Audit | auth + raw + imports | traces | logs/audit | aujourd'hui partiel |

## 5. Alignement avec le besoin
- Alignement avec les objectifs: bon, car le decoupage suit les usages mission 4.
- Alignement avec l'architecture: bon pour un monolithe modulaire.
- Alignement avec le design data: bon si les domaines sont stabilises.
- Arbitrages:
  - separer proprement raw, import et reporting
  - ne pas disperser les responsabilites dans trop de petits modules

## 6. Modules MVP
- Modules indispensables au MVP:
  - Authentification
  - Referentiel SIG
  - Stations et Barrages
  - Dashboard Climat
  - Dashboard Hydro
  - Dashboard Qualite
  - Module SWAT
- Modules utiles mais reportables:
  - Reporting / Export avance
  - Audit complet
- Modules de phase ulterieure:
  - gouvernance avancee, observabilite, workflows plus complexes d'import

## 7. Points forts
- Decoupage lisible.
- Bien adapte a une equipe mixte dev + SIG.
- Modules directement relies aux routes et ecrans existants.

## 8. Points faibles
- Risque de chevauchement entre referentiel SIG, stations/barrages et raw.
- SWAT encore partiellement opaque dans le repo.
- Reporting encore moins mature que les dashboards.

## 9. Bonnes pratiques
- Modularite:
  - une responsabilite principale par module
  - interfaces API stables
- Interfaces:
  - DTO clairs entre backend et frontend
  - noms coherents entre couches et routes
- SIG / hydrologie:
  - lier chaque module carte a une source de verite
  - aligner objets spatiaux et series temporelles
- Gouvernance technique:
  - journaliser les operations sensibles
  - documenter dependances et contrats

## 10. Propositions
- Proposition 1: decoupage MVP
  - perimetre: modules deja quasi presents
  - benefices: rapide a formaliser
  - limites: dette technique conservee
  - effort relatif: Faible
- Proposition 2: decoupage intermediaire
  - perimetre: modules stabilises + frontieres claires + reporting mieux defini
  - benefices: meilleure lisibilite equipe
  - limites: travail de rationalisation
  - effort relatif: Moyen
- Proposition 3: decoupage cible moyen terme
  - perimetre: modules complets + audit + imports formalises + reporting industrialise
  - benefices: meilleure gouvernance
  - limites: plus de charge
  - effort relatif: Eleve

## 11. Recommandations
- Recommandation principale: formaliser maintenant le decoupage intermediaire.
- Modules a prioriser:
  - referentiel SIG
  - dashboards metier
  - SWAT
  - raw/admin
- Points a valider avant planification:
  - perimetre reporting
  - role exact du module raw
  - frontieres entre import, consultation et administration
- Sous-etape suivante recommandee dans le workflow IA: decoupage en taches / roadmap technique.

## 12. Questions ouvertes
- Quel module porte officiellement le reporting mission 4 ?
- Quelle partie du back-office doit etre visible au client final ?
- Les imports doivent-ils etre manuels, scripts ou semi-automatises ?
