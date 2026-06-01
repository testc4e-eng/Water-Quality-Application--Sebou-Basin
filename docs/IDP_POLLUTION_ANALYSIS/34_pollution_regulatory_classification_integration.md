# Integration classification reglementaire dans Pollution IDP DEV

Date : 2026-05-19  
Statut : DEV integre, lecture seule, sans modification SHP, sans ecriture base.

## 1. Objectif

Brancher le referentiel reglementaire Tableau n°1 dans la couche cartographique Pollution IDP DEV afin d'afficher, pour les derniers resultats P0, la classe qualite reglementaire et les motifs de non-classement.

## 2. Backend

Endpoint concerne :

- `GET /api/v1/pollution/sites.geojson`

Enrichissement ajoute dans `properties.latest_results[]` :

- `regulatory_status`
- `class_code`
- `class_label`
- `color`
- `severity_order`
- `threshold`
- `non_classifiable_reason`

Implementation :

- service Python lecture seule `app.services.regulatory_quality`;
- chargement du contexte reglementaire actif une seule fois par requete;
- classification en memoire des resultats P0 agreges;
- aucun appel HTTP interne;
- aucune ecriture base.

Performance observee via `TestClient` :

| Test | Resultat |
|---|---:|
| `GET /api/v1/pollution/sites.geojson?limit=5000` | `200 OK` |
| Entites retournees | `1951` |
| Temps observe | `1.05 s` |

## 3. Frontend

Route DEV :

- `/pollution-idp-dev`

Evolutions :

- ajout d'une symbologie `Statut reglementaire`;
- conservation de la symbologie `Statut validation`;
- ajout d'une legende qualite reglementaire;
- badge classe qualite dans la popup;
- affichage du motif `non_classifiable_reason` pour les resultats non classifiables.

Palette SAD :

| Classe | Couleur |
|---|---|
| excellente | bleu |
| bonne | vert |
| moyenne | jaune/orange |
| mauvaise | rouge |
| tres_mauvaise | violet |

## 4. Tests executes

| Controle | Resultat |
|---|---|
| `GET /api/v1/pollution/sites.geojson?parameter_code=DBO5&limit=10` | `200 OK`, DBO5 classifie |
| `GET /api/v1/pollution/sites.geojson?parameter_code=NH4&limit=10` | `200 OK`, NH4 classifie |
| `GET /api/v1/pollution/sites.geojson?parameter_code=NO3&limit=10` | `200 OK`, NO3 resolu vers `NO3-` et classifie |
| `python -m compileall backend/app/api/v1/pollution.py backend/app/services/regulatory_quality.py` | OK |
| `npm run build` | OK |
| Ouverture `/pollution-idp-dev` | OK apres ajout de la route dans le routeur actif `App.tsx` |
| Legende reglementaire frontend | OK via verification navigateur avec reponse GeoJSON mockee |

## 5. Limites DEV restantes

- Les donnees restent en validation : `GO DEV / demonstration`, pas pre-production.
- La verification navigateur complete avec backend HTTP reel n'a pas ete finalisee car `uvicorn` n'est pas installe dans l'environnement Python courant; les endpoints backend ont ete testes avec `FastAPI TestClient`.
- Les seuils et mappings restent dependants de la version reglementaire active en DEV.
- Les doublons spatiaux et arbitrages IDP ne sont pas resolus automatiquement.
- La symbologie reglementaire de la carte prend la classe la plus defavorable parmi les resultats P0 disponibles sur le site.

## 6. Decision

Statut recommande : `GO_DEV_DEMO`.

NOGO pre-production maintenu tant que :

- les arbitrages spatiaux prioritaires ne sont pas valides;
- les mappings parametres/unites ne sont pas figes metier;
- la verification navigateur doit etre rejouee avec un backend DEV lance par la commande officielle du projet.
