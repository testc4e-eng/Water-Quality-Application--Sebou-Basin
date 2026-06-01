# Audit Hydrologique du Réseau

## 1. Objectif
L'objectif de cet audit est de qualifier le réseau hydrographique existant pour préparer une démonstration visuelle réaliste de la propagation des polluants. 
**Note Importante** : Le tracé du réseau affiché sera issu de la base de données réelle (géométrie), mais les paramètres hydrodynamiques (temps de transfert, concentration, dilution) resteront purement fictifs (mockés) pour la Phase 1.

## 2. Données Inspectées
- **Table** : `geo.reseau_hydrographique`
- **Champ géométrique** : `geom`
- **SRID** : `26191` (Lambert Maroc)
- **Type Géométrique** : `MultiLineString`
- **Nombre de tronçons** : 697
- **Colonnes topologiques** (`source`, `target`) : Absentes.
- **Direction d'écoulement** : Aucun champ de direction explicite détecté.
- **Relations** : Présence du champ `sous_bassi`. La relation avec les stations et barrages n'est pas matérialisée par des clés étrangères, nécessitant des jointures spatiales (Snapping).

## 3. Qualité Géométrique
- **Géométries Invalides** : 0
- **Géométries Nulles** : 0
- **Type** : La présence de `MultiLineString` est problématique pour pgRouting qui exige des `LineString` simples. Un `ST_Dump` sera indispensable avant tout calcul de graphe.
- **Longueur des segments** :
  - Min : 65.46 m
  - Max : 27 286.15 m
  - Moyenne : 5 730.96 m
  *(Les très longs segments de 27km réduisent la précision du snapping des points d'impact).*

## 4. Cohérence d'Écoulement
- La direction de digitalisation (ordre des sommets de la ligne) n'a pas été confirmée comme représentant rigoureusement le sens amont -> aval.
- **Sens d'écoulement** : Inconnu à ce stade (Nécessite vérification sur MNT ou croisement avec les altitudes `Z_Min`, `Z_Max`).

## 5 à 7. Connectivité (Confluences, Segments isolés, Nœuds)
L'absence de topologie préalable empêche une détection SQL instantanée des graphes disjoints. Toutefois, des intersections (confluences) non scindées sont hautement probables sur un export SIG brut.

## 8. Hiérarchie Bassin / Sous-Bassin
La table contient le champ `sous_bassi` (ex: "beht"), permettant un premier niveau de ségrégation. Les relations avec les stations/barrages reposeront intégralement sur des requêtes de proximité spatiale (`ST_DWithin`).

## 9. Faisabilité Démonstration Frontend

| Élément | Statut | Impact démo |
|---|---|---|
| Tracé réseau | partiel | Les MultiLineStrings doivent être converties en LineStrings simples. |
| Direction aval | inconnue | Sans champ altimétrique fiable exploité, risque de remontée du courant si la numérisation est bidirectionnelle. |
| Stations liées au réseau | partiel | Résolu par requêtage de proximité (Snapping). |
| Barrages liés au réseau | partiel | Résolu par requêtage de proximité (Snapping). |
| Routage visuel | possible avec approximation | Nécessite un compromis algorithmique (Backend ou Frontend). |

## 10. Recommandation Phase 1
**Option Recommandée : Option D (Approximation contrôlée ou hybride)**. 
Étant donné :
1. Que le réseau est en `MultiLineString`
2. Que `pgRouting` est absent du serveur
3. Que le sens amont/aval n'est pas garanti
Il est recommandé, pour une démo rapide et crédible, de réaliser un backend qui renvoie un GeoJSON mocké (ou partiellement calculé sans pgRouting, via NetworkX ou requêtes ST_LineSubstring) avec l'étiquette stricte de "Démonstration Visuelle".
