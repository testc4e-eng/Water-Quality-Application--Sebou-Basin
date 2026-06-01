# Plan de Reconstruction du Graphe NetworkX

Le moteur de routage doit évoluer pour supporter la phase de reconnexion et le mode QA avancé.

## Évolutions du GraphBuilder

### 1. Tagging des Composants
Chaque nœud et chaque arête recevront un `component_id`.
```python
G.graph['main_component'] = largest_cc_id
```

### 2. Métriques de Qualité
Ajout d'attributs sur les arêtes :
- `edge_quality` : Basé sur la source (REAL, SNAPPED, VIRTUAL).
- `reconnect_status` : Si l'arête a été créée/modifiée lors d'un PASS de snapping.

### 3. Détection de Cycles
Identification des cycles via `nx.simple_cycles(G)`. Si un cycle est détecté, il doit être marqué comme `qa_issue = 'POTENTIAL_CYCLE'`.

### 4. Support Multi-Composants
Le GraphBuilder ne doit plus filtrer le `largest_cc` mais charger l'intégralité du réseau en mémoire pour permettre au Frontend QA de tout visualiser. Le routage, lui, vérifiera si le `start_node` et `end_node` appartiennent au même composant.
