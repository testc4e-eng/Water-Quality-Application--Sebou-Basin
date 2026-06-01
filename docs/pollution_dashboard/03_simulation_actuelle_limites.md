# Simulation Actuelle : Logique et Limites

> [!IMPORTANT]
> Il est crucial de faire la distinction entre la simulation **visuelle (Mock)** du MVP actuel et un calcul **scientifique (Réel)** de propagation hydrologique.

## 1. Fonctionnement Réel du MVP Actuel
La fonction `calculatePollutionPropagation` (située dans `pollutionSimulationData.ts`) agit comme un moteur de règles simplifié (mock) :
1. **Tri Naïf (Est-Ouest)** : L'algorithme suppose que l'eau s'écoule toujours d'Est en Ouest. Il sélectionne donc toutes les stations dont la `longitude` est inférieure à celle du point d'impact.
2. **Calcul de Distance Fictif** : La distance n'est pas calculée en suivant les méandres du fleuve, mais en multipliant grossièrement la différence de longitude par un facteur constant (~90km par degré).
3. **Temps d'Arrivée (ETA)** : Le temps d'arrivée est calculé en divisant cette pseudo-distance par une vitesse constante associée au type de polluant (ex: 4 km/h pour les hydrocarbures).

## 2. Comportement Visuel
- **Vectorisation Directe** : Pour éviter l'affichage de lignes en zig-zag (qui traversaient arbitrairement les affluents), la ligne rouge d'impact est dessinée comme un vecteur direct (une ligne droite en pointillés) depuis l'incident jusqu'à la station la plus en aval.
- **Alertes Visuelles** : Les stations identifiées comme étant "en aval" s'allument en rouge et pulsent sur la carte, offrant un excellent retour visuel.

## 3. Limites de l'Approche Actuelle
- **Aucune Topologie** : Le système ignore totalement si la station se trouve sur le même affluent que l'incident ou sur un réseau adjacent parallèle.
- **Topographie Ignorée** : Les altitudes, pentes et le sens d'écoulement réel ne sont pas pris en compte.
- **Hydraulique Absente** : Le volume d'eau, le débit en temps réel, et la dilution ne modifient pas la vitesse ou la concentration de la pollution.
