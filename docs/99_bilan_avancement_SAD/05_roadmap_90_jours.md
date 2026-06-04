# Roadmap 90 jours - SAD Sebou

## Principe directeur

Les 90 prochains jours doivent servir à **fermer et qualifier** le projet, pas à étendre le périmètre.

## 1. Plan d'action 30 jours

### Objectif

Lever les blocages de gouvernance et sécuriser le périmètre préproduction.

### Actions prioritaires

1. Tenir un atelier d'arbitrage IDP avec métier, SIG, data et projet.
2. Figer le dictionnaire des paramètres et alias critiques.
3. Valider la version réglementaire active et la doctrine de classification.
4. Établir la liste officielle des modules entrant en préprod.
5. Lancer la purge des endpoints critiques encore dépendants de `public.*`.
6. Mettre à jour les statuts documentaires contradictoires.
7. Valider la transition **ML tabulaire** -> **Graph Snapshot**.
8. Figer les variables nécessaires au **Graph Snapshot**.
9. Identifier les tronçons, stations, barrages et rejets prioritaires.

### Livrables attendus

- arbitrages IDP signés ;
- dictionnaire paramètres gelé ;
- statut réglementaire validé ;
- liste des modules préprod ;
- backlog de purge legacy priorisé.
- cadrage E1.5 **Graph Snapshot** validé ;
- périmètre des **features spatiales** priorisé.

## 2. Plan d'action 60 jours

### Objectif

Transformer les modules P0 choisis en composants préproduction testables.

### Actions prioritaires

1. Finaliser le backend/API des écrans qualité réglementaire et cartographie métier.
2. Connecter proprement les dashboards aux contrats API stabilisés.
3. Fermer les warnings bloquants sur statuts réglementaires et compatibilité legacy.
4. Réaliser les tests navigateur avec backend HTTP réel.
5. Continuer la validation hydraulique scientifique sur les segments suspects.
6. Valider le comportement d'ingestion V1 sur un cycle contrôlé de bout en bout.
7. Produire **Graph Snapshot V0**.
8. Documenter les **features topologiques**.
9. Tester un premier dataset **spatio-temporel**.

### Livrables attendus

- dashboards P0 qualifiés en préprod ;
- endpoints legacy critiques retirés ou explicitement déclassés ;
- rapport de tests fonctionnels ;
- état d'avancement hydraulique consolidé ;
- rapport go/no-go ingestion V1.
- **Graph Snapshot V0** documenté ;
- premier dataset **spatio-temporel** qualifié en `SANDBOX`.

## 3. Plan d'action 90 jours

### Objectif

Obtenir un jalon DG de préproduction stabilisée sur le périmètre prioritaire.

### Actions prioritaires

1. Officialiser le périmètre réellement exploitable.
2. Produire la matrice de go/no-go par module.
3. Clore le chantier pollution IDP si arbitrages effectivement résolus.
4. Décider le statut officiel de SWAT/WASP pour la phase suivante.
5. Préparer le dossier de passage à exploitation ou de lot complémentaire.
6. Décider le go/no-go sur un **modèle prédictif spatio-temporel**.
7. Produire une synthèse **ML / Graph** pour DG.
8. Définir si la **prédiction pollution** entre dans un lot complémentaire.

### Livrables attendus

- matrice go/no-go ;
- dossier de préproduction ;
- statut DG sur SWAT/WASP ;
- backlog résiduel priorisé et chiffré.
- synthèse **ML expérimental / Graph Snapshot / Graph Analytics** pour DG.

## 4. Dépendances SWAT

- validation Reda sur scénarios, unités, calibration, mappings ;
- décision projet : inclus ou exclus du jalon 90 jours.

## 5. Dépendances WASP

- validation Anas sur segments, unités, sorties et scénarios ;
- décision projet : inclus ou exclus du jalon 90 jours.

## 6. Recommandation de priorisation

### A faire absolument

- IDP ;
- référentiel paramètres ;
- réglementaire qualité ;
- dette legacy critique ;
- qualification dashboards P0.

### A ne faire que si les arbitrages structurants sont levés

- industrialisation ingestion large ;
- extension dashboards secondaires ;
- travaux avancés ML/feature store ;
- communication élargie sur scénarios SWAT/WASP.

## 7. Indicateurs de succès

| Indicateur | Cible 90 jours |
|---|---|
| Arbitrages métier structurants ouverts | 0 ou planifiés et signés |
| Endpoints critiques `public.*` actifs | 0 sur périmètre officiel |
| Modules P0 qualifiés préprod | au moins 3 |
| Pollution IDP | go préprod ou no-go formel motivé |
| SWAT/WASP | statut explicite DG validé |
| Documentation de statut contradictoire | résorbée sur documents maîtres |
