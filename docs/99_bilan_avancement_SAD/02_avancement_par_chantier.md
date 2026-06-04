# Avancement par chantier - SAD Sebou

## Méthode de lecture

Statuts utilisés :

- `TERMINE`
- `PARTIEL`
- `EN_ATTENTE`
- `NON_DEMARRE`

Le pourcentage reflète l'état réel observé dans la documentation maîtresse, le code, les scripts et les objets SQL visibles.

## 1. Avancement global par chantier

| Chantier | Avancement | Statut | État réel observé |
|---|---:|---|---|
| Gouvernance documentaire et source de vérité | 85% | `PARTIEL` | socle documentaire consolidé et pilotage structuré, mais quelques contradictions subsistent |
| Migration historique des données | 100% | `TERMINE` | migration, contrôles et qualification réalisés côté C4E ; cas résiduels transmis en arbitrage métier ou backlog tracé |
| Hydro métier | 85% | `PARTIEL` | base stable, API et dashboards actifs, mais QA et validation hydraulique incomplètes |
| Météo | 88% | `PARTIEL` | précipitation et évaporation stables, température désormais intégrée |
| Température | 95% | `TERMINE` | ingestion commitée et traçable, reste l'alignement documentaire et la consommation fonctionnelle |
| Qualité de l'eau - socle historique | 75% | `PARTIEL` | données présentes et exploitables, mais mapping et legacy encore visibles |
| Référentiel paramètres | 70% | `PARTIEL` | référentiel avancé, arbitrages alias/unités encore ouverts |
| Référentiel qualité réglementaire | 70% | `PARTIEL` | moteur et seuils chargés, préprod conditionnelle uniquement |
| Pollution IDP | 75% | `PARTIEL` | pipeline IDP opérationnel ; cas ambigus résiduels isolés dans des rapports d'arbitrage ; préproduction conditionnée par validation métier |
| API FastAPI | 78% | `PARTIEL` | surface riche et utile, mais coexistence legacy/P0 et dette `public.*` |
| Frontend dashboards | 75% | `PARTIEL` | plusieurs routes fonctionnelles, mais homogénéité et qualification encore incomplètes |
| Dashboard cartographique métier P0 | 72% | `PARTIEL` | route, API et composants prêts DEV, timeseries et préprod non finalisées |
| Dashboard qualité réglementaire | 70% | `PARTIEL` | écran existant et branché, mais statuts API/UI encore à compléter |
| Ingestion V1 industrialisée | 45% | `EN_ATTENTE` | outillage présent, activation et qualification production non acquises |
| SWAT | 35% | `EN_ATTENTE` | consultation sandbox, pas d'usage officiel validé |
| WASP | 35% | `EN_ATTENTE` | consultation sandbox, pas d'usage officiel validé |
| Validation hydraulique scientifique | 50% | `PARTIEL` | chantier lancé, validation des sens d'écoulement non terminée |
| ML expérimental / prédiction pollution | 65% | `PARTIEL` | benchmark tabulaire documenté, limites identifiées, transition Graph Snapshot justifiée |
| Graph Snapshot | 35% | `EN_ATTENTE` | besoin scientifiquement confirmé, phase E1.5 à engager |
| Graph Analytics | 30% | `EN_ATTENTE` | cadrage engagé, dépendant du Graph Snapshot |
| Modèle prédictif spatio-temporel | 25% | `EN_ATTENTE` | non démarré officiellement, dépendant des features topologiques |
| Reporting personnalisé | 40% | `EN_ATTENTE` | éléments présents mais couverture métier finale non démontrée |
| Mobile responsive démontré | 35% | `EN_ATTENTE` | stack compatible, pas de preuve de recette structurée |
| Feature store / model build | 40% | `EN_ATTENTE` | documentation de préparation, pas de base officielle industrialisée |

## 2. Chantiers clôturés

- Température : ingestion exécutée, lot techniquement clos côté data.
- Migration historique : clôturée côté C4E, avec contrôles réalisés, anomalies identifiées et rapports transmis.
- Socle sécurité/admin : authentification, users, resets, audit et logs disponibles.

## 3. Chantiers en cours

- Référentiel qualité réglementaire.
- Dashboard cartographique métier.
- Dashboard qualité réglementaire.
- Validation hydraulique scientifique.
- Stabilisation API/backend hors legacy.
- Pollution IDP DEV vers préprod.
- Industrialisation ingestion SWAT/WASP.

## 4. Chantiers non démarrés ou non officialisés

- Usage officiel décisionnel SWAT.
- Usage officiel décisionnel WASP.
- Feature store officiel.
- Parcours complet de reporting métier final.
- Qualification mobile/documentée de tous les écrans.

## 5. Lecture détaillée par domaine

### Données

- **Fortement avancé** : hydro, précipitation, évaporation, qualité historique, référentiels infra.
- **Récemment consolidé** : température.
- **Fragile** : pollution IDP et certains mappings qualité/réglementaires.

### APIs

- **Réellement opérationnelles** : auth, admin, observatory, analytics, hydro, map P0, pollution DEV, qualite spécialisée.
- **Partiellement fiables** : quality legacy, stations, measurements, entities à cause de dépendances legacy et contrats mixtes.

### Frontend

- **Réellement visible** : dashboards historiques, cartographie, analytique, scénarios, admin, qualité P0, pollution DEV, carto métier.
- **Partiel** : cohérence globale, qualification UX, séparation officiel vs expérimental.

### Modèles et IA

- **Faits vérifiés** : préparation SWAT/WASP, ingestion, ML readiness, benchmark **ML tabulaire** et diagnostic de transition vers **Graph Snapshot**.
- **Décision documentaire** : le **ML expérimental** reste `SANDBOX`, `RECHERCHE_APPLIQUEE`, `NON_PREPROD`.
- **Prochaine étape** : engager **Graph Snapshot** puis **Graph Analytics** avant tout **modèle spatio-temporel** officiel.

## 6. Conclusion de chantier

Le projet est **avance sur le socle fonctionnel et data**. Le vrai enjeu n'est plus de prouver qu'il existe des modules, mais de transformer des modules `DEV_READY` en composants officiellement exploitables via validation metier, preproduction et arbitrages client.
