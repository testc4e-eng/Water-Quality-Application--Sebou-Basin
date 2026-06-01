# Audit : Confluences et Nœuds

Un réseau hydrographique est un graphe orienté arborescent (plusieurs affluents convergent vers un fleuve principal, rarement l'inverse).

| Type de Nœud | Description | Attente Topologique |
|---|---|---|
| **Source** (Amont) | Extrémité sans ligne entrante. | Normal. Origines des oueds. |
| **Confluence** | Plusieurs lignes entrantes, 1 ligne sortante. | Normal. Affluents rejoignant le cours principal. |
| **Bifurcation** | 1 ligne entrante, plusieurs sortantes. | Suspect. (Sauf delta, canaux d'irrigation, ou tressage de rivière). À vérifier manuellement. |
| **Puits** (Aval) | Extrémité sans ligne sortante. | Normal (1 seul puits idéalement : l'océan ou le barrage de garde terminal). Si trouvé au milieu du bassin, c'est un Gap (Rupture topologique). |

## Synthèse
L'extraction de ces nœuds nécessitera l'utilisation de `pgr_createTopology` qui générera la table `geo_work.reseau_hydro_nodes`. Les nœuds seront alors requêtés pour compter le nombre de liens in/out (`nb_edges_in`, `nb_edges_out`).
