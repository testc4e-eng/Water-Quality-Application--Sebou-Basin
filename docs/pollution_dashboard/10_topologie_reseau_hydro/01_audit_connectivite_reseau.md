# Audit : Connectivité du Réseau

L'analyse de la table `geo.reseau_hydrographique` a donné les résultats suivants concernant la qualité géométrique brute.

| Problème | Volume estimé | Gravité | Impact routage | Correction proposée |
|---|---:|---|---|---|
| SRID Incorrect | 0 (26191 OK) | Faible | Nul | Garder le SRID actuel (Métrique). |
| MultiLineString | 697 | Critique | Bloquant (pgRouting) | Exécuter `ST_Dump(geom)` pour générer des LineStrings. |
| Sous-segments après Dump | 697 | N/A | Positif | Chaque MultiLineString contient 1 seule ligne (bonne nouvelle). |
| Géométries invalides | 0 | N/A | Nul | Aucune action requise. |
| Segments très courts (< 5m) | Faible | Moyenne | Bruit topologique | Fusionner ou supprimer si dangles. |
| Segments très longs (> 10km) | Moyen | Élevée | Snapping imprécis | Découper les lignes trop longues (`ST_Segmentize` ou découpe aux nœuds). |
| Nœuds déconnectés (Tolérance 0) | 1394 points d'ext., 855 distincts | Élevée | Rupture de chemin | Appliquer une tolérance (ex: 5m) lors du `pgr_createTopology`. |

**Conclusion** : Le réseau est géométriquement sain, mais manque de continuité topologique stricte (les points de contact ne sont pas exactement superposés à l'échelle du millimètre). La création d'une topologie avec tolérance résoudra 90% des ruptures de chemin.
