# Contexte : Dashboard de Gestion des Pollutions

## 1. Origine du Besoin
Le projet SAD (Système d’Aide à la Décision) du bassin du Sebou inclut une exigence forte concernant la supervision environnementale et la gestion de crise liée aux pollutions accidentelles ou déclarées.
L'objectif est d'offrir aux décideurs (DG, équipes opérationnelles) une vision claire de la propagation d'un polluant dans le réseau hydrographique afin d'anticiper les impacts sur les stations de pompage, de traitement, et les barrages en aval.

## 2. Objectifs du MVP Actuel
Le MVP (Minimum Viable Product) développé avait pour but de fournir rapidement un démonstrateur visuel fonctionnel (Proof of Concept UI) permettant :
- D'afficher une carte interactive du réseau hydrographique.
- De visualiser les points d'intérêt critiques (Stations hydrologiques, Barrages).
- De simuler, via une interaction utilisateur (clic), la déclaration d'un incident de pollution.
- D'illustrer graphiquement et sous forme tabulaire les conséquences en aval.

## 3. Positionnement Stratégique
Le MVP a volontairement mis de côté la complexité des calculs scientifiques et topologiques (Dijkstra, pgRouting, moteurs SWAT/WASP) pour se concentrer sur l'UX (User Experience) et l'UI (User Interface). 
Ce choix assumé permet aujourd'hui d'avoir une maquette de haute fidélité qui sert de référentiel visuel et d'outil d'aide à la conception pour les futures phases industrielles.
