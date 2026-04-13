# Frontend Reference

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | frontend React, routes UI, dashboards et intégration API |
| Source de vérité | Oui |
| Documents liés | [backend_overview](../backend/backend_overview.md), [api_contracts](../backend/api_contracts.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Socle technique

Le frontend du projet repose sur :

- React 18 ;
- Vite ;
- TypeScript ;
- `@tanstack/react-query` pour l’orchestration des appels de données ;
- TailwindCSS et composants UI pour la couche de présentation ;
- bibliothèques graphiques et cartographiques spécialisées selon les écrans.

Ce frontend assure quatre fonctions principales :

- exposition des dashboards métier ;
- exploitation cartographique et analytique ;
- administration et gouvernance des données ;
- sécurisation des parcours utilisateurs via authentification et rôles.

## 2. Routes applicatives actives

Les routes déclarées dans `frontend/src/App.tsx` structurent les usages suivants :

| Route | Rôle |
|---|---|
| `/` | page d’accueil et point d’entrée institutionnel |
| `/dashboard` | dashboard historique de premier niveau |
| `/dashboard-cartographique` | dashboard cartographique principal |
| `/dashboard-analytique` | dashboard analytique principal |
| `/dashboard-scenarios` | restitution dédiée aux scénarios et résultats modèles |
| `/data` | explorateur et gestion des données brutes, réservé aux profils administrateurs |
| `/admin/data-scan` | diagnostic de disponibilité et de couverture des données |
| `/admin/users` | gestion des comptes utilisateurs |
| `/admin/password-resets` | gestion des demandes de réinitialisation |
| `/admin/audit` | consultation des journaux d’activité |
| `/admin/ingestion` | centre d’ingestion SWAT/WASP et contrôles QA |
| `/admin/popup-rules` | paramétrage métier des popups cartographiques |
| `/login`, `/register`, `/change-password` | parcours d’authentification et gestion de mot de passe |

## 3. Domaines fonctionnels couverts

### Dashboards métier

- climat et météo ;
- hydrologie ;
- qualité des eaux et pollution ;
- restitution comparative multi-séries ;
- lecture par scénario sur les volets de modélisation.

### Cartographie

- couches observatoire ;
- couches administratives et hydrauliques ;
- stations, barrages, points d’eau, nappes, sous-bassins et réseau hydrographique ;
- filtres dynamiques, popups et légendes.

### Administration

- data scan ;
- ingestion et validation ;
- journal d’audit ;
- gestion des utilisateurs ;
- règles d’affichage cartographique.

## 4. Structure de composants

À l’échelle du dépôt, la structure frontend suit la logique suivante :

- `src/pages/` pour les écrans complets ;
- `src/pages/admin/` pour les écrans d’administration ;
- `src/components/` pour la composition UI, la cartographie, les tableaux et les graphiques ;
- `src/api/` pour la communication avec le backend ;
- `src/lib/` pour les utilitaires transverses.

## 5. Intégration API côté frontend

Les pratiques à maintenir sont les suivantes :

- centraliser les appels vers le backend dans la couche `src/api/` ;
- privilégier `react-query` pour le cache, le refetch et la gestion d’erreurs ;
- conserver des filtres bornés pour éviter les requêtes trop volumineuses ;
- déléguer autant que possible les enrichissements métiers aux vues `api.*` et aux endpoints backend plutôt qu’à des jointures locales côté navigateur.

## 6. Patterns d’usage recommandés

### Gestion des filtres

- debounce sur les filtres texte ou multi-sélection ;
- remise à zéro de la pagination ou des curseurs lorsque le contexte change ;
- sélection par défaut des variables métier obligatoires dans les dashboards analytiques.

### Gestion des erreurs

- message utilisateur explicite en cas d’erreur de validation ;
- distinction entre erreur métier, erreur d’authentification et erreur serveur ;
- blocage des requêtes trop volumineuses en mode brut lorsque des agrégats sont disponibles.

### Restitution

- cartes : consommation de couches JSON/GeoJSON déjà enrichies ;
- graphiques : consommation de séries déjà structurées par l’API ;
- exports : déclenchement local à partir des jeux affichés ou des endpoints dédiés.

## 7. Points d’attention

- les parcours `/data`, `/admin/users`, `/admin/password-resets`, `/admin/audit`, `/admin/ingestion` et `/admin/popup-rules` sont conditionnés par un contrôle admin dans la couche UI ;
- le frontend reste dépendant de contrats d’API stables, en particulier sur les modules analytics, observatory, raw, ingestion et security ;
- les ajustements restants portent principalement sur l’ergonomie, l’organisation des menus et le raffinement de certaines restitutions.
