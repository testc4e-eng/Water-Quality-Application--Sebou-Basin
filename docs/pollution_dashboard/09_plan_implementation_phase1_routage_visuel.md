# Plan d'Implémentation : Routage Visuel (Phase 1)

## 1. Objectif
Remplacer le vecteur direct actuel par un tracé de trajectoire visuellement aligné sur le réseau hydrographique, renforçant la crédibilité du Dashboard lors des démonstrations.

## 2. Principe Fonctionnel
Quand l'utilisateur clique sur la carte :
1. Le frontend capture la longitude et la latitude `(lng, lat)`.
2. Appel à l'API `GET /api/v1/routing/downstream?lng=...&lat=...`.
3. Le backend trouve le tronçon hydrographique réel le plus proche.
4. Calcul d'une trajectoire aval approximative (selon la topologie disponible).
5. Retour d'une réponse typée (Mock assumé) contenant le GeoJSON du tracé et les alertes.
6. Le frontend affiche le tracé rouge (qui épouse la géométrie de l'oued) et met en évidence les stations/barrages correspondants.

## 3. Données Réelles vs Fictives

| Élément | Réel / Fictif | Commentaire |
|---|---|---|
| **Géométrie réseau** | Réel | Directement extrait de `geo.reseau_hydrographique` (PostGIS) |
| **Tracé aval** | Réel/Approximatif | Épouse le tracé géographique mais la direction/sélection de la branche peut être approximative. |
| **Stations impactées** | Approximatif | Sélectionnées par intersection spatiale (buffer) le long du tracé. |
| **ETA (Heure d'arrivée)** | Fictif | Valeurs mockées basées sur des ratios constants. |
| **Concentration** | Fictif | Mock statique. |
| **Recommandations** | Fictif | Suggestions textuelles mockées. |
| **Score de risque** | Fictif | Mock (ex: "Critique"). |

## 4. Options Techniques Comparées

### Option A — pgRouting
- **Avantage** : Algorithme pur, très performant et natif BD.
- **Limite** : Extension introuvable sur le serveur. Nécessite `LineString`. Sens d'écoulement inconnu.
- **Effort** : Élevé (Installation admin + nettoyage massif de données).
- **Risque** : Bloquant pour une démo à court terme.

### Option B — SQL Récursif PostGIS
- **Avantage** : N'utilise que PostGIS natif (pas d'extension additionnelle).
- **Limite** : Extrêmement lourd en calcul sur des intersections non indexées (697 `MultiLineString`).
- **Effort** : Très Élevé (Écriture de requêtes complexes `ST_Intersects`).
- **Risque** : Timeout de l'API.

### Option C — Backend Python NetworkX
- **Avantage** : Flexibilité logicielle absolue, se base sur le chargement des géométries en RAM.
- **Limite** : Temps de parsing initial au démarrage de l'API. La création du graphe sur des lignes non connectées est instable.
- **Effort** : Moyen.
- **Risque** : Trajet aval aberrant si l'ordre des nœuds est aléatoire.

### Option D — Approximation Contrôlée (RECOMMANDÉE)
- **Avantage** : Résultat immédiat. Fournit un `GeoJSON` composé de `LineString`s récupérés autour du point de clic pour simuler visuellement la nappe descendante sans calcul de graphe complexe.
- **Limite** : Pas de véritable arbre de dépendance réseau.
- **Effort** : Faible/Moyen.
- **Risque** : Quasi-nul. Assure la continuité de la démo sans casser le serveur.

## 5. Recommandation
**Utiliser l'Option D (Approximation Contrôlée) pour la démo rapide.** 
Le backend exposera un endpoint assumant un `mode: visual_demo`. La logique trouvera le tronçon d'impact, et sélectionnera les géométries en aval selon un critère géométrique simplifié (ex: sélection des tronçons voisins orientés vers l'océan), garantissant un rendu propre et "collé" à la rivière.

## 6. Backlog Opérationnel

### NOW (En Cours)
- [x] Audit du réseau (tables, SRID, connectivité).
- [x] Production des documents de stratégie.
- [ ] Préparer l'endpoint `/api/v1/routing/downstream` (mock-réseau / approximatif).
- [ ] Câbler le Frontend avec badge "Mode démonstration".

### NEXT
- Nettoyage QGIS des géométries (`MultiLineString` vers `LineString`).
- Installation de `pgRouting` (Ops).
- Routage aval topologique réel avec matrices de coût.

### LATER
- Modèles mathématiques : vitesse d'écoulement, débit, dilution.
- Couplage IA et recommandations automatisées.
