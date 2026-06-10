# Plan de Fusion Sécurisé

Ce plan détaille la bascule de l'existant vers la table unifiée, sans risque de cassure pour la production.

### Phase A — Audit read-only (TERMINÉE)
- Inventaire et volumétrie.
- Redondances et dépendances identifiées.

### Phase B — Backup complet
- Backup physique via pg_dump des 4 tables cibles.
- Backup des définitions des vues de l'API.
- Sauvegarde des mappings (stations et paramètres).

### Phase C — Création staging
- Exécution du script DDL pour créer les tables `staging.qualite_*`.
- Copie des données candidates via des requêtes d'insertion massives.
- Génération systématique du `source_row_hash` (SHA256) pour traquer la provenance exacte.

### Phase D — Fusion dry-run
- Construction d'une vue temporaire unifiée (`api.v_qualite_unifiee_dryrun`) superposant les données nettoyées.
- Comparaison des APIs existantes : faire pointer un environnement de test sur cette vue.
- Vérifier la non-régression des Dashboards Qualité et Accueil DG.

### Phase E — Validation métier
- Export d'un échantillon des doublons probables, des paramètres divergents et des stations orphelines.
- Validation explicite par l'équipe métier des arbitrages réalisés (ex: "On garde toujours la valeur de Sebou si doublon avec Rivière").

### Phase F — Bascule progressive
- Création de la vue API finale (ex: `api.v_mesure_qualite_unifiee`).
- Conservation des 4 anciennes tables intactes.
- Bascule progressive des endpoints backend (`backend/app/routers/quality.py` et `dashboard/home_service.py`) vers la nouvelle vue unifiée, contrôlés par un Feature Flag si possible.
- Monitoring intensif.

### Phase G — Nettoyage contrôlé
- Aucune suppression (DROP) autorisée avant la réception des deux accords :
  1. Validation technique (Absence d'erreur 500 ou requêtes lentes).
  2. Validation métier (Cohérence des indicateurs affichés sur 2 mois minimum).
