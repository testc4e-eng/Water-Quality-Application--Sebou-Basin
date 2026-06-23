# Limites V1 vs V2

La V1 pose les fondations du SIG et de l'analytique croisée. 

## V1 : Cartographie et Analyse Factuelle
* Représentation stricte des valeurs mesurées, sans interprétation réglementaire dynamique globale.
* Droits d'accès statiques par bassin (ex: restriction `SEBOU` hardcodée ou simple), tout en prévoyant l'architecture pour un filtrage dynamique.
* Intégration partielle des palettes réglementaires à titre visuel (statut des seuils).

## V2 : Interprétation et Automatisation
* Intégration complète de la classification réglementaire :
  * Pastilles de couleur "Classe globale" par station sur la carte.
  * Détection d'anomalies complexes.
  * Affichage de la tendance annuelle "réglementaire".
* Risque si la V1 ignore le Sprint 0 : Impossible de router efficacement les données complexes vers l'UX carte métier, ce qui obligerait à recréer des ponts coûteux en V2.
