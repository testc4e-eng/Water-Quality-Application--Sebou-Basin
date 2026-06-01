# Ingénierie - Synthèse Interne (Lot 4 Qualité)

Ce document aligne notre équipe Data Engineering sur les conventions de gestion des anomalies au sein des processus d'ingestion (Lot 4A-2, 4A-3, 4A-4). Tant que l'ABH n'a pas signé le doc 16, voici la mécanique défensive déployée.

## 1. Topologie des Flags de Qualité (QA_FLAGS)
Les scripts Python de migration utiliseront intensivement la structuration du schéma cible `qualite` (`abh_sad`) pour logger en silence les dérives sans déclencher de crash d'exécution :
- **`qa_flag_param_unmapped`** : Placé à `TRUE` lorsque le dictionnaire renvoie que le `parametre_qualite` est ambigu (ex: `H_G`, `sat`) ou n'est virtuellement mappé à aucun code du référentiel validé (le Top 35). Un paramètre inconnu ingérera la ligne (sauf règle d'éviction stricte ultérieure) mais ne pèsera pas dans l'analytique WQDSS.
- **`qa_flag_negative`** : Protège les bilans massuels de la pollution des seuils de laboratoires transcrits en négatifs (LOQ = "-1"). Toute $concentration < 0$ sera flaguée. Le $valeur\_num$ réel cible restera `NULL` pour bloquer les calculs sommatifs, s'effaçant au profit du raw_value.
- **`qa_flag_station_infered`** : Implémenté plus tard pour les orphelins "Métier" (ex: Lot 4A-3 sur `suivi_brg_garde_hebdo`).

## 2. Rejet Mécanique
- **NULL Strict (`WOULD_SKIP`)** : Conformément à ANO-LOT4A-002, s'échiner à insérer une trace de 1989 à une station donnée si la concentration a été laissée vide charge le cluster I/O pour rien.
- **Orphelins Station (`WOULD_CONFLICT`)** : La donnée `mesures_qualite_rivieres`/`nappes` lève un Conflit si elle ne match pas un `id` existant de l'`infra_stations_abhs`.

## 3. Ambiguïtés Temporaires
*(Impact Actuel: 3 751 relèves exclues `qa_flag_param_unmapped` du réseau global sur le périmètre Lot 4A-2).*
Tant que l'Expert-Métier ABH n'aura pas statué sur `H_G` ou `sat` :
- Ils sont catégoriquement **A ARBITRER** dans notre logique hardcodée.
- Leur Unité bascule empiriquement sur `N/A`.
- Aucune canonisation automatique n'est lancée sur leurs chaines de caractères.
