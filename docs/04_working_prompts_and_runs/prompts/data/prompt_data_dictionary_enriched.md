Agis comme un expert senior en architecture de bases de données PostgreSQL/PostGIS/TimescaleDB, en data engineering, en gouvernance de données, en documentation de systèmes d’information, et en modélisation métier eau / hydrologie / environnement / qualité des eaux.

Je travaille sur une base de données de système d’aide à la décision (SAD) orientée :
- hydrologie,
- qualité des eaux,
- météo,
- barrages,
- stations,
- pollution,
- référentiels administratifs,
- objets géographiques SIG.

Les phases précédentes ont déjà été réalisées :
- Phase A : assainissement structurel,
- Phase B : migration contrôlée hors du schéma public,
- Phase C : audit qualité des données.

Je veux maintenant produire un **dictionnaire de données enrichi, professionnel, complet et exploitable**, qui servira à la fois :
- de documentation technique,
- de dictionnaire métier,
- de support d’onboarding,
- de base pour le backend/frontend,
- de référence de gouvernance data,
- de support pour l’IA / analytics / RAG.

## Objectif principal
Scanner toute la base et générer un dictionnaire de données enrichi :
- schéma par schéma,
- table par table,
- vue par vue,
- colonne par colonne,
- avec métadonnées techniques,
- interprétation métier,
- statistiques descriptives,
- indicateurs de qualité,
- dépendances,
- règles d’usage.

## Résultat attendu
Je ne veux pas une simple liste d’objets SQL.
Je veux un document riche, structuré, lisible et exploitable par :
- architecte data,
- développeur backend,
- développeur frontend,
- DBA,
- data engineer,
- analyste métier,
- expert eau / hydrologie / environnement.

---

# 1. Vue d’ensemble de la base

Commence par une synthèse globale :
- rôle de la base,
- finalité métier,
- domaines couverts,
- schémas existants,
- type de données dominantes (référentiel, spatial, séries temporelles, analytique, API),
- niveau de maturité,
- état global de qualité des données.

Je veux une lecture claire :
- ce que contient la base,
- à quoi elle sert,
- quels grands sous-domaines elle couvre.

---

# 2. Cartographie des schémas

Pour chaque schéma :
- nom,
- rôle,
- domaine métier,
- type d’objets contenus,
- niveau d’exposition,
- dépendances avec les autres schémas,
- importance dans l’architecture,
- usage par la plateforme web.

Je veux couvrir au minimum :
- public
- admin
- geo
- infra
- hydro
- meteo
- qualite
- api
- metadata
- staging
- backup
- autres schémas détectés

---

# 3. Dictionnaire détaillé schéma par schéma

Pour chaque schéma, produire :

## 3.1. Résumé du schéma
- rôle métier,
- rôle technique,
- volumétrie globale,
- principales tables,
- principales vues,
- principaux liens avec les autres schémas.

## 3.2. Liste structurée des objets
- tables
- vues
- vues matérialisées
- fonctions
- triggers
- séquences
- types personnalisés

---

# 4. Dictionnaire détaillé table par table

Pour chaque table :
- schéma
- nom de la table
- nom métier recommandé
- description technique
- description métier
- rôle dans le système
- entité métier associée
- niveau de criticité
- type de données contenues
- volumétrie actuelle
- évolution probable
- relations principales
- dépendances
- schéma source / héritage legacy si pertinent

Je veux aussi :
- PK
- FK
- index
- contraintes
- triggers
- colonnes techniques
- colonnes métier
- colonnes spatiales
- colonnes temporelles

---

# 5. Dictionnaire colonne par colonne

Pour chaque colonne de chaque table et vue, documente :

- schéma
- table / vue
- nom de colonne
- type PostgreSQL exact
- nullable ou non
- valeur par défaut
- clé primaire / étrangère ou non
- indexée ou non
- unité si applicable
- domaine métier
- signification métier
- exemple de valeur
- source probable
- niveau de qualité estimé
- sensibilité éventuelle
- commentaire technique
- commentaire métier
- remarques d’usage frontend/backend
- risques éventuels (ambiguïté, null fréquent, legacy, doublon logique)

Je veux un niveau de détail très élevé.

---

# 6. Documentation des vues et vues matérialisées

Pour chaque vue :
- schéma
- nom
- rôle fonctionnel
- finalité métier
- tables sources
- logique de jointure
- colonnes exposées
- usage backend/frontend
- intérêt pour dashboard / carte / API
- risques de performance
- fréquence d’usage probable

Pour chaque vue matérialisée :
- mode d’actualisation probable
- intérêt de performance
- fraîcheur attendue
- métriques exposées

---

# 7. Métadonnées techniques enrichies

Pour chaque entité, ajoute les métadonnées suivantes quand elles existent ou peuvent être inférées :
- commentaire SQL
- propriétaire
- date de création / modification si disponible
- taille disque estimée
- nombre d’index
- nombre de contraintes
- dépendances amont
- dépendances aval
- présence dans les vues API
- présence dans les pipelines ETL
- présence dans les logs de migration
- origine legacy ou non
- schéma cible d’urbanisation
- statut actuel (actif, legacy, proxy, transitoire, à décommissionner)

---

# 8. Statistiques descriptives par table

Pour chaque table, produire des statistiques utiles :
- nombre de lignes
- nombre de colonnes
- colonnes nullables
- taux de remplissage par colonne
- nombre de valeurs distinctes par colonne utile
- min / max pour les dates
- min / max / moyenne pour les colonnes numériques utiles
- top valeurs fréquentes pour les dimensions
- nombre de géométries nulles
- répartition par type si pertinente
- volumétrie par année / mois si table temporelle
- nombre de stations / barrages / paramètres distincts si pertinent

Je veux des statistiques réellement utiles pour la compréhension métier.

---

# 9. Statistiques par entités métier

Je veux une lecture orientée métier, pas seulement SQL.

Produis des synthèses statistiques par grandes entités métier, par exemple :

## Stations
- nombre total
- répartition par type
- couverture géographique
- stations actives / inactives
- disponibilité des coordonnées
- disponibilité des rattachements administratifs
- disponibilité des rattachements bassin / sous-bassin

## Barrages
- nombre total
- disponibilité géométrique
- type
- rattachement bassin / territoire
- disponibilité des mesures associées

## Réseau hydrographique
- nombre d’objets
- longueur totale si calculable
- couverture par bassin
- qualité géométrique

## Sous-bassins / bassins / nappes
- nombre total
- validité géométrique
- couverture spatiale
- cohérence topologique

## Mesures hydrologiques
- nombre total
- période couverte
- stations distinctes
- variables distinctes
- fréquence dominante
- qualité / complétude

## Mesures météo
- nombre total
- période couverte
- variables distinctes
- fréquence
- complétude

## Mesures qualité des eaux
- nombre total
- période couverte
- stations distinctes
- paramètres distincts
- unités distinctes
- taux de validité
- anomalies détectées
- valeurs douteuses / outliers

## Sources de pollution
- nombre total
- types
- géométrie disponible
- rattachement au territoire
- proximité réseau hydro si calculable

---

# 10. Intégration explicite des résultats d’audit qualité

Intègre les résultats connus de l’audit qualité Phase C dans le dictionnaire de données.

Je veux que le dictionnaire fasse apparaître explicitement :
- les points sains,
- les anomalies encore présentes,
- les tables ou colonnes sensibles,
- les objets à corriger en priorité,
- les champs à surveiller dans les dashboards.

Le document doit notamment faire remonter :
- le taux de mapping réussi stations ↔ qualité,
- les anomalies géospatiales détectées,
- les valeurs physico-chimiques douteuses,
- les entités encore fragiles d’un point de vue qualité.

---

# 11. Classification des objets par statut

Ajoute une classification claire des objets :
- référentiel maître
- table métier active
- table analytique
- table temporelle
- vue de consommation API
- objet legacy
- objet proxy de compatibilité
- objet de staging
- objet backup
- objet à décommissionner

Je veux que cette classification soit présente pour chaque table / vue.

---

# 12. Analyse des relations et lecture métier transversale

Pour chaque grande entité métier, explique :
- avec quelles autres entités elle est liée,
- par quelles clés,
- par quelles relations spatiales,
- par quelles relations temporelles,
- comment elle est utilisée dans le système.

Je veux une vraie lecture fonctionnelle :
- station ↔ mesures ↔ qualité
- barrage ↔ bassin ↔ mesures
- pollution ↔ réseau hydro ↔ qualité
- territoire ↔ objets métier

---

# 13. Utilisation par la plateforme web

Pour chaque table ou vue importante, indiquer :
- si elle doit être utilisée directement par le backend,
- si elle doit être exposée uniquement via une vue `api`,
- si elle sert à une carte,
- à un dashboard,
- à un filtre,
- à une fiche détail,
- à un export,
- à un calcul analytique.

Je veux que le dictionnaire aide aussi l’équipe frontend/backend.

---

# 14. Qualité, risques et recommandations

Pour chaque schéma, table ou entité métier, préciser :
- niveau de qualité estimé,
- risques d’usage,
- recommandations de fiabilisation,
- actions de maintenance,
- priorité de correction,
- champs à documenter davantage,
- champs à normaliser.

Distingue :
- ce qui est fiable,
- ce qui est utilisable avec prudence,
- ce qui reste à corriger.

---

# 15. Format de sortie attendu

Je veux le résultat sous une forme très structurée avec :

## Partie A — Résumé exécutif
## Partie B — Cartographie des schémas
## Partie C — Dictionnaire détaillé des tables
## Partie D — Dictionnaire détaillé des vues
## Partie E — Dictionnaire colonne par colonne
## Partie F — Statistiques par entité métier
## Partie G — Qualité, risques et recommandations
## Partie H — Annexes techniques SQL

---

# 16. Livrables techniques complémentaires

En plus du dictionnaire, génère aussi :

1. les requêtes SQL PostgreSQL permettant d’extraire automatiquement :
- schémas
- tables
- colonnes
- PK / FK
- index
- contraintes
- vues
- commentaires
- nombre de lignes
- stats descriptives
- colonnes géométriques
- périodes temporelles
- taux de null
- cardinalités

2. un modèle de sortie exportable :
- Markdown
- CSV
- JSON
- éventuellement Excel logique

3. une proposition de structuration documentaire du dictionnaire dans le projet, par exemple :
- docs/04_data/10_dictionnaire_bdd_executif.md
- docs/04_data/11_dictionnaire_bdd_detaille.md
- docs/04_data/12_catalogue_colonnes.csv
- docs/04_data/13_stats_entites_metier.md

---

# 17. Exigences fortes

- Ne te contente pas d’une documentation générique.
- Interprète le rôle métier probable.
- Utilise un ton professionnel.
- Distingue faits observés, hypothèses, recommandations.
- Signale explicitement les zones ambiguës.
- Donne des exemples concrets.
- Sois exhaustif.
- Quand tu proposes du SQL, commente-le.
- Le dictionnaire doit être utile à la fois aux développeurs et aux experts métier.
- Le résultat doit être réutilisable comme base de gouvernance data.

---

# 18. Contexte documentaire à exploiter

Base-toi explicitement sur :
- le rapport d’audit Phase C,
- la documentation Phase A,
- la documentation Phase B,
- la documentation d’industrialisation,
- l’architecture BDD PostGIS,
- les métadonnées SQL,
- l’export brut système,
- les vues API,
- les sources de données,
- le README projet.

Je veux un résultat final de niveau entreprise, prêt à être intégré dans la documentation officielle du projet.