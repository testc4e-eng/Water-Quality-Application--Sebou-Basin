# Structure des Filtres Intelligents

Afin d'éviter de proposer des choix vides à l'utilisateur, la carte métier repose sur une API de disponibilité (`/availability`).

## Logique de filtrage stricte (en cascade) :

1. Utilisateur choisit un **Support** (ex: STATION_QUALITE)
2. L'API retourne les **Domaines** disponibles pour ce support.
3. Utilisateur choisit un **Domaine** (ex: QUALITE).
4. L'API retourne les **Paramètres** disponibles.
5. Utilisateur choisit un **Paramètre** (ex: pH).
6. L'API retourne uniquement les **Objets géographiques (features)** disposant de données pour cette combinaison.

Cette approche garantit que la carte ne montre jamais une option analytique qui aboutirait sur une vue vide.
