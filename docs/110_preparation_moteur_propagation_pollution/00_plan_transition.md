# Plan de transition vers le moteur de propagation pollution

## Contexte

Le réseau hydrographique validé pour la suite des travaux est :

- `geo_work.reseau_hydro_edges_final_candidate_20260602`
- `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr`
- `geo_work.reseau_hydro_nodes_final_candidate_20260602`

Contrat fonctionnel validé :

- cible garde : `legacy_station_id = 52`
- nom : `brg de garde / sebou`
- graphe topologique exploitable pour propagation aval

## Comment utiliser le réseau validé

Le moteur de propagation pollution doit consommer :

1. la table d’arêtes validée ;
2. la table de sommets PGR associée ;
3. la notion de `source` / `target` déjà calculée ;
4. les longueurs `length_m` comme coût de base.

Stratégie recommandée :

- utiliser `geo_work.reseau_hydro_edges_final` après bascule runtime ;
- tant que la bascule n’est pas exécutée, utiliser explicitement `geo_work.reseau_hydro_edges_final_candidate_20260602` dans les travaux préparatoires ;
- conserver `geo_work.reseau_hydro_nodes_final_candidate_20260602` pour les diagnostics, contrôles de composantes, exutoires et sources.

## Comment calculer les chemins aval

Cas d’usage propagation pollution :

1. snapper un point source pollution sur l’arête ou le nœud le plus proche ;
2. convertir ce point en nœud de départ ;
3. calculer tous les chemins aval dirigés dans le graphe `source -> target` ;
4. agréger :
   - longueur aval ;
   - stations touchées ;
   - barrages touchés ;
   - exutoires touchés ;
   - temps de transfert estimés.

Approche technique recommandée :

- NetworkX ou pgRouting pour le routage explicite ;
- vues matérialisées ou tables de cache pour les résultats lourds ;
- séparation stricte entre :
  - routage topologique runtime
  - modélisation hydraulique scientifique

## Comment calculer les temps de transfert

Temps de transfert minimal :

- `temps = longueur_segment / vitesse_reference`

Approche progressive recommandée :

### Niveau 1 — Estimation topologique simple

- vitesse constante par défaut par type de tronçon ;
- agrégation le long des chemins aval ;
- utile pour alerting initial et visualisation.

### Niveau 2 — Estimation semi-physique

- vitesse dépendante :
  - pente locale
  - longueur
  - ordre de Strahler si disponible
  - débit ou classe hydraulique

### Niveau 3 — Couplage hydrologique/hydraulique

- injection de résultats de modèles externes ;
- recalage temporel par période hydrologique ;
- propagation dépendante du scénario et de la saison.

## Comment intégrer SWAT

Rôle de SWAT :

- fournir les contributions hydrologiques amont ;
- estimer débits, ruissellement, apports diffus et dynamiques de bassin ;
- alimenter la hiérarchisation des sources et la temporalité des transferts.

Mode d’intégration recommandé :

1. lier les sorties SWAT aux composantes ou sous-bassins ;
2. associer les tronçons réseau à des unités SWAT ;
3. convertir les sorties SWAT en paramètres de coût ou de vitesse ;
4. stocker les jointures dans des tables dédiées, séparées du runtime topologique.

## Comment intégrer WASP

Rôle de WASP :

- simuler le transport et la transformation de polluants ;
- calculer dilution, dégradation, accumulation et scénarios temporels.

Mode d’intégration recommandé :

1. utiliser le réseau validé comme squelette topologique de transfert ;
2. définir des points d’injection et de contrôle ;
3. projeter les segments du réseau dans les unités spatiales attendues par WASP ;
4. conserver la couche de prétraitement WASP hors du runtime applicatif principal.

## Préparation du moteur de propagation pollution

Étapes recommandées :

1. figer le runtime sur le réseau final validé après swap contrôlé ;
2. créer un service backend dédié `propagation_pollution_service` ;
3. exposer des endpoints :
   - source -> garde
   - source -> exutoires
   - source -> barrages / stations touchés
   - temps de transfert estimés
4. préparer une table de scénarios pollution ;
5. prévoir une couche d’enrichissement hydrologique SWAT/WASP non bloquante.

## Décision d’ouverture

Le chantier hydrologique étant clôturé au statut `VALIDE`, la phase suivante peut être ouverte officiellement :

- `Phase Moteur de propagation pollution`

Précondition restante :

- exécuter la bascule runtime uniquement après validation finale opératoire du script transactionnel dédié.
