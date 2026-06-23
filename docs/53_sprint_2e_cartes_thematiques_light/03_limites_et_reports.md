# Limites et Reports (Sprint 2E Light)

## 1. Interpolation Géostatistique (IDW/Kriging)
Comme convenu, ce Sprint 2E est une version "Light" utilisant uniquement des cercles (markers) vectoriels. Les cartes de contours lissées (isoplèthes), qui demandent des librairies lourdes (comme `turf.js` ou un backend géostatistique) ont été reportées au Sprint 3 (Recherche avancée).

## 2. Structure des données (`latest_values`)
Pour l'instant, les pastilles sont configurées pour puiser dans un objet `latest_values` via la structure `['to-number', ['get', '{parametre}', ['object', ['get', 'latest_values']]]]`. Si l'API retourne la donnée structurée différemment à l'avenir (ex: attribut aplati), les expressions MapLibre devront être mises à jour (`['get', 'nomDuParam']`).

## 3. Filtrage Côté Serveur (Backend)
En mode thématique, les filtres géospatiaux (par période `24h`, `7j`...) doivent à terme être passés dans la requête backend (`/business-map/features?date_min=XXX`) pour n'afficher que les objets ayant été mesurés dans cette fenêtre. Le Sprint 2E Light pose le socle UI en attendant la synchronisation stricte backend.
