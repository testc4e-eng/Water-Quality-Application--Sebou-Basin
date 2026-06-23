# Sprint 0 : Spécification et Architecture

Objectif : Verrouiller les fondations techniques avant toute implémentation UI, pour éviter une carte isolée, monolithique, inévolutive et impossible à filtrer intelligemment.

## Livrables obligatoires
1. **Modèle de série multi-support** : unification des données (qualité, climat, hydro) au format `AnalyticalSeries`.
2. **Contrats API cartographiques** : design précis des endpoints (`/availability`, `/features`, `/series`).
3. **Logique de filtre intelligent** : Support → Domaine → Paramètre → Objets disponibles (basée sur `/availability`).
4. **State Manager** : Choix de `Zustand` pour orchestrer les couches, les panneaux flottants et l'analyse sans prop-drilling lourd.
5. **Stratégie d'export** : Anticiper la capture PNG/PDF intégrant la carte et les panneaux visibles simultanément.
6. **Droits d'accès par bassin** : Filtrer au niveau API dès l'origine pour prévenir la dette sécuritaire et architecturale.
7. **Couche de référence** : Prévoir l'utilisation ultérieure des palettes de qualité réglementaires (marocaines).
