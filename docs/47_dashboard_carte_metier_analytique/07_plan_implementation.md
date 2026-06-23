# Plan d'Implémentation Séquentiel

L'implémentation est redécoupée pour sécuriser l'architecture avant la création UI.

## Sprint 0 : Spécification technique préventive
* Création du modèle de série multi-support (`AnalyticalSeries`).
* Contrats API cartographiques `/availability`, `/features`, `/series`, `/object`.
* Filtres intelligents et State manager (`Zustand`).
* Stratégie d'export & Droits d'accès.

## Sprint 1 : Socle UI plein écran
* Espace de travail cartographique (MapLibre, Panneaux flottants, Store global).

## Sprint 2A : Connexion stations ABH + filtre de base
* Stations (qualité, sentinelles, hydro, météo, barrages).
* `/availability` V1, `/features` V1, popups.

## Sprint 2B : Pollution + filtre intelligent complet
* Supports pollutions (Rejets, STEP, Huileries, etc.).
* Extension des API de disponibilité.

## Sprint 3 : Analyse multi-support / multi-domaine
* Constructeur d'analyse, graphes multi-axes, tableaux croisés.

## Sprint 4 : Cartes thématiques
* Représentations par valeur, disponibilité, tendances, et palette réglementaire.

## Sprint 5 : Exports et personnalisation
* Export (PNG/PDF/CSV) avec maintien d'état et filtres visuels.
