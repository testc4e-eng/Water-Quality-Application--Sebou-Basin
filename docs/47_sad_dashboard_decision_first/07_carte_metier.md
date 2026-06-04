# Carte Métier

## Rôle

Écran principal de navigation opérationnelle sur le bassin.

## Base existante à conserver

- `/dashboard-carto-metier`
- backend `/api/v1/map/*`

## Vues cibles

- vue bassin
- vue sous-bassin
- vue station

## À afficher

- stations
- barrages
- qualité
- alertes
- pollutions

## À masquer par défaut

- QA détaillée
- statuts techniques
- debug
- IDs techniques

## Évolutions proposées

- vue par priorité métier
- vue par zone critique
- sélecteur de décision :
  - qualité
  - pollution
  - hydrologie
- panneau contextuel orienté action

## Rôle dans l’architecture globale

La carte métier devient l’entrée opérationnelle terrain, pas un catalogue de couches.
