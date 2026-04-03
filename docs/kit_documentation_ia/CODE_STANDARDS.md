# Standards de Code - SAD Sebou 2026

## Backend
- Un endpoint = une responsabilite claire.
- Eviter de multiplier les styles d'acces DB dans un meme domaine.
- Parametrer toute requete SQL.
- Journaliser les erreurs metier et acces critiques.

## Frontend
- Centraliser les appels API dans `src/api/*`.
- Typage explicite des DTO.
- Eviter `any`.
- Isoler les transformations backend -> UI.

## SIG
- Retourner du GeoJSON valide.
- Uniformiser le SRID 4326 cote API.
- Nommer clairement couches, entites et filtres.

## Mission 4
- Chaque module doit etre rattache a un besoin CPS:
  - collecte
  - integration modeles
  - visualisation
  - reporting
  - deploiement
  - maintenance


