# Rapport métier — anomalies et incohérences SAD Sebou

## 1. Objectif

Ce document sert à :
- clarifier les anomalies métier ;
- préparer les décisions à prendre ;
- aligner l'ABH, le chef de projet et les parties prenantes sur les points bloquants.

---

## 2. Synthèse globale

Le système contient déjà un volume important de données exploitables, mais plusieurs points empêchent une lecture métier totalement fiable. Les principaux risques portent sur la normalisation des paramètres, le référentiel des stations et rejets, et l'absence de certaines données attendues.

- nombre total d'anomalies métier : **8**
- nombre d'incohérences métier : **6**
- nombre de manques de données : **4**
- nombre de points nécessitant décision : **16**
- nombre de points en attente de données : **4**

| Type | Nombre | Priorité |
|------|--------|---------|
| Anomalies métier | 8 | Élevée |
| Incohérences | 6 | Élevée |
| Manques de données | 4 | Critique |
| Ambiguïtés | 4 | Élevée |

---

## 3. Liste des anomalies métier

### [A01] Paramètres qualité non standardisés

**Quoi (problème métier)**
Les mêmes paramètres de qualité de l'eau sont nommés de plusieurs façons selon les fichiers sources. La lecture métier n'est donc pas uniforme.

**Où (contexte)**
- module concerné : qualité des eaux
- type de données : paramètres physico-chimiques

**Exemple simple**
Un même indicateur peut apparaître comme `Conductivite`, `Conductivité` ou sous une autre forme voisine.

**Décision attendue**
- valider une liste officielle unique des paramètres et des libellés à utiliser

**Priorité**
- Critique

---

### [A02] Valeurs qualité eau incohérentes

**Quoi (problème métier)**
Certaines valeurs de qualité sont incompatibles avec une lecture métier normale.

**Où (contexte)**
- module concerné : qualité des eaux
- type de données : qualité rivière, nappe, barrage, Sebou

**Exemple simple**
Des mesures négatives apparaissent alors qu'une concentration négative n'a pas de sens métier.

**Décision attendue**
- décider si ces valeurs doivent être exclues, requalifiées ou interprétées comme codes laboratoire

**Priorité**
- Élevée

---

### [A03] Débits hydrologiques négatifs

**Quoi (problème métier)**
Des débits journaliers sont enregistrés avec des valeurs négatives.

**Où (contexte)**
- module concerné : données hydrologiques
- type de données : débits

**Exemple simple**
Un cours d'eau ne peut pas avoir un débit négatif dans une lecture métier standard.

**Décision attendue**
- fixer la règle métier : exclure, corriger ou classer ces lignes en valeurs non interprétables

**Priorité**
- Élevée

---

### [A04] Doublons de barrages

**Quoi (problème métier)**
Le référentiel barrage contient au moins un cas où un même nom renvoie à plusieurs réalités possibles.

**Où (contexte)**
- module concerné : barrages
- type de données : référentiel infrastructure

**Exemple simple**
Le nom `Bouhouda` apparaît comme un cas non suffisamment discriminé pour décider quel barrage est le bon.

**Décision attendue**
- confirmer s'il s'agit d'un seul barrage, de plusieurs variantes, ou d'un cas à renommer officiellement

**Priorité**
- Élevée

---

### [A05] Doublons de stations

**Quoi (problème métier)**
Plusieurs stations portent le même nom, ce qui crée un risque d'interprétation erronée.

**Où (contexte)**
- module concerné : stations
- type de données : référentiel station

**Exemple simple**
Deux stations peuvent avoir le même nom alors qu'elles ne représentent pas le même point de suivi.

**Décision attendue**
- définir la règle officielle pour distinguer les stations homonymes

**Priorité**
- Élevée

---

### [A06] Station ou barrage "Garde Sebou" non clarifié dans le référentiel

**Quoi (problème métier)**
Un jeu important de mesures est rattaché métierement à "Garde Sebou", mais cette référence n'est pas stabilisée dans le référentiel.

**Où (contexte)**
- module concerné : qualité des eaux / barrages
- type de données : suivi barrage

**Exemple simple**
Le suivi hebdomadaire existe bien, mais la référence officielle du barrage ou de la station reste à confirmer.

**Décision attendue**
- confirmer l'identité officielle de "Garde Sebou" dans le référentiel métier

**Priorité**
- Critique

---

### [A07] Mesures qualité sans valeur

**Quoi (problème métier)**
Certaines analyses comportent un paramètre et une date, mais pas de valeur exploitable.

**Où (contexte)**
- module concerné : qualité des eaux
- type de données : résultats laboratoire

**Exemple simple**
Le paramètre est renseigné, mais la concentration est vide.

**Décision attendue**
- décider si ces lignes doivent être ignorées ou conservées comme traces d'analyses incomplètes

**Priorité**
- Moyenne

---

### [A08] Prélèvements pollution non rattachés à une source métier

**Quoi (problème métier)**
Une partie des prélèvements pollution n'est pas reliée à une entité de rejet clairement reconnue.

**Où (contexte)**
- module concerné : pollution
- type de données : IDP / rejets

**Exemple simple**
Le prélèvement existe, mais on ne sait pas de manière fiable à quel rejet il doit être attaché.

**Décision attendue**
- décider si ces cas restent en attente, sont rattachés manuellement, ou sortent du périmètre d'analyse

**Priorité**
- Critique

---

## 4. Liste des incohérences métier

### [I01] Incohérence des noms de paramètres

**Quoi**
Le même paramètre est nommé différemment selon les sources.

**Entre quoi et quoi**
Entre fichiers laboratoire, historiques qualité et référentiel cible

**Exemple**
`Conductivite` et `Conductivité` désignent le même concept.

**Décision attendue**
- valider le libellé officiel à retenir

**Priorité**
- Élevée

---

### [I02] Incohérence des unités

**Quoi**
Les unités ne sont pas toujours explicites ou homogènes.

**Entre quoi et quoi**
Entre paramètres historiques et référentiel métier attendu

**Exemple**
Un paramètre peut être connu métierement, mais son unité cible n'est pas confirmée.

**Décision attendue**
- valider l'unité officielle par paramètre

**Priorité**
- Élevée

---

### [I03] Niveau de normalisation différent selon les familles qualité

**Quoi**
Toutes les familles de données qualité n'ont pas le même niveau de standardisation.

**Entre quoi et quoi**
Entre rivières, nappes, barrages, Sebou et suivi Garde Sebou

**Exemple**
Un paramètre est reconnu dans une famille de données mais reste non clarifié dans une autre.

**Décision attendue**
- confirmer si un référentiel unique doit s'appliquer à tous les périmètres qualité

**Priorité**
- Élevée

---

### [I04] Incohérence entre suivi barrage et référentiel infrastructure

**Quoi**
Les données de suivi existent, mais leur rattachement au référentiel n'est pas totalement stabilisé.

**Entre quoi et quoi**
Entre suivi qualité barrage et référentiel stations / barrages

**Exemple**
Le suivi "Garde Sebou" est connu métierement, mais sa référence officielle reste à figer.

**Décision attendue**
- valider une référence unique officielle

**Priorité**
- Critique

---

### [I05] Incohérence entre sources IDP 2024

**Quoi**
Les données pollution 2024 sont fragmentées en plusieurs ensembles qui peuvent se recouvrir.

**Entre quoi et quoi**
Entre lots "qualité globale" et "marché cadre"

**Exemple**
Le même rejet peut potentiellement apparaître dans deux ensembles différents.

**Décision attendue**
- confirmer s'il faut fusionner ces ensembles ou les garder séparés

**Priorité**
- Critique

---

### [I06] Incohérence entre données disponibles et attentes métier sur la météo

**Quoi**
Le besoin métier couvre la météo complète, mais certaines composantes restent absentes ou incomplètes.

**Entre quoi et quoi**
Entre périmètre métier attendu et données réellement disponibles

**Exemple**
La température est attendue dans l'analyse, mais elle n'est pas encore disponible en base.

**Décision attendue**
- confirmer quelles données météo sont obligatoires pour la première version métier

**Priorité**
- Critique

---

## 5. Manques de données

### Cas particulier : données non disponibles

Si une donnée n'est pas encore injectée dans la base, elle est traitée ici comme :

-> Donnée non disponible  
-> PAS comme anomalie

---

### Température

**Statut**
Donnée non encore injectée dans la base

**Impact métier**
Impossible d'analyser :
- évolution thermique
- impact sur qualité eau

**Décision attendue**
- confirmer la source de données
- planifier l'ingestion

**Priorité**
Critique

---

### Météo manquante ou incomplète

**Statut**
Certaines chroniques météo restent incomplètes, en particulier sur l'évaporation.

**Impact métier**
Impossible d'avoir une lecture météo complète et homogène sur toute la période.

**Décision attendue**
- confirmer si les périodes incomplètes peuvent être utilisées en réunion métier
- prioriser les compléments de données

**Priorité**
Élevée

---

### Pollution non fournie de manière complète

**Statut**
Les données pollution existent, mais la couverture reste partielle et certains prélèvements ne sont pas rattachés à un rejet reconnu.

**Impact métier**
Impossible d'avoir une vision consolidée et complète des rejets suivis.

**Décision attendue**
- confirmer la liste officielle des rejets à suivre
- compléter les données manquantes ou non rattachées

**Priorité**
Critique

---

### Stations non complètes

**Statut**
Certaines stations restent incomplètes dans le référentiel métier.

**Impact métier**
Risque de confusion dans les analyses, cartes et comparaisons historiques.

**Décision attendue**
- compléter les noms manquants
- confirmer le référentiel officiel des stations actives

**Priorité**
Élevée

---

## 6. Ambiguïtés métier

### [AMB01] Paramètre ambigu H_G

**Quoi**
Le paramètre n'a pas de définition métier officielle partagée.

**Exemple**
`H_G`

**Problème**
Plusieurs interprétations sont possibles : hydrocarbures globaux, huiles et graisses, ou autre sens.

**Décision attendue**
Définition officielle

---

### [AMB02] Paramètre ambigu sat

**Quoi**
Le paramètre n'est pas assez explicite pour être interprété sans risque.

**Exemple**
`sat`

**Problème**
Il peut être compris comme saturation en oxygène, mais cela doit être confirmé.

**Décision attendue**
Définition officielle

---

### [AMB03] Paramètres ambigus PTD / PTP

**Quoi**
La distinction métier n'est pas figée.

**Exemple**
`PTD`, `PTP`

**Problème**
On ne sait pas s'il faut les rattacher à des fractions du phosphore total ou à une autre lecture métier.

**Décision attendue**
Définition officielle

---

### [AMB04] Paramètres ambigus F_M_mes / FM / RS105

**Quoi**
Des codes historiques restent difficiles à interpréter de façon certaine.

**Exemple**
`F_M_mes`, `FM`, `RS105`

**Problème**
Le risque est d'affecter un mauvais sens à la donnée et d'en tirer une mauvaise conclusion métier.

**Décision attendue**
Définition officielle

---

## 7. Problèmes de structuration métier

### [S01] Fragmentation des données IDP 2024

**Quoi**
Les données pollution 2024 sont réparties dans plusieurs ensembles au lieu d'un cadre métier unique.

**Exemple**
Séparation entre "qualité globale" et "marché cadre".

**Décision attendue**
- confirmer s'il faut unifier ces données dans un seul périmètre métier

---

### [S02] Absence de référentiel unique des rejets

**Quoi**
Il n'existe pas encore de cadre métier totalement stabilisé pour identifier chaque rejet de façon unique.

**Exemple**
Un prélèvement peut exister sans être rattaché de manière sûre à une source officielle.

**Décision attendue**
- valider le référentiel unique des rejets à utiliser

---

### [S03] Plusieurs versions d'une même donnée qualité

**Quoi**
La même information métier peut apparaître sous plusieurs formes selon l'origine des données.

**Exemple**
Un même paramètre qualité change de nom, d'écriture ou de codification selon la source.

**Décision attendue**
- imposer une version métier de référence

---

### [S04] Référentiel stations / barrages non totalement unifié

**Quoi**
Le système mélange encore des cas homonymes, incomplets ou non stabilisés.

**Exemple**
Doublons de stations, barrage sans nom, cas Garde Sebou à figer.

**Décision attendue**
- valider un référentiel métier unique et gelé pour les analyses

---

## 8. Liste des décisions à prendre

| ID | Sujet | Question métier | Options | Recommandation |
|---|---|---|---|---|
| A01 | Paramètres non standardisés | Quelle liste officielle des paramètres doit être retenue ? | Garder l'historique / normaliser / exclure certains alias | Normaliser avec liste officielle ABH |
| A02 | Valeurs qualité incohérentes | Comment traiter les valeurs impossibles ? | Exclure / requalifier / conserver | Requalifier si sens métier connu, sinon exclure |
| A03 | Débits négatifs | Faut-il les analyser ou les écarter ? | Conserver / exclure / corriger | Exclure de l'analyse métier |
| A04 | Doublon barrage | Bouhouda désigne-t-il un seul barrage ou plusieurs ? | Fusionner / renommer / distinguer | Distinguer officiellement |
| A05 | Doublons stations | Comment différencier les stations homonymes ? | Garder tel quel / renommer / ajouter identifiant métier | Ajouter identifiant métier validé |
| A06 | Garde Sebou | Quelle référence officielle doit être utilisée ? | Station existante / barrage existant / nouvelle référence | Valider une référence unique officielle |
| A08 | Rejets non rattachés | Que faire des prélèvements sans source reconnue ? | Mettre en attente / rattacher manuellement / exclure | Mettre en attente jusqu'à validation |
| I02 | Unités | Quelles unités métier officielles retenir ? | Tolérance large / unité par défaut / validation paramètre par paramètre | Valider paramètre par paramètre |
| I05 | IDP 2024 | Faut-il fusionner "globale" et "marché cadre" ? | Fusionner / séparer / fusion partielle | Fusionner si pas de différence métier réelle |
| I06 | Données météo | Quel socle météo minimum est obligatoire ? | Pluie seule / pluie + évaporation / météo complète | Définir un socle minimum officiel |
| M01 | Température | Quelle source utiliser pour la température ? | Différer / nouvelle source / reprise historique | Confirmer la source et planifier l'injection |
| M03 | Pollution incomplète | Quelle liste officielle des rejets doit être suivie ? | Périmètre réduit / périmètre complet / phase progressive | Démarrer avec une liste validée et fermée |
| AMB01 | H_G | Que signifie H_G ? | Ignorer / mapper / supprimer | Mapper après validation ABH |
| AMB02 | sat | sat signifie-t-il saturation en oxygène ? | Oui / non / autre sens | Valider officiellement |
| AMB03 | PTD/PTP | Comment interpréter PTD et PTP ? | Fusionner / distinguer / exclure | Distinguer après validation |
| S04 | Référentiel unique | Quel référentiel fait foi pour stations et barrages ? | Historique / référentiel fusionné / référentiel gelé | Geler un référentiel unique |

---

## 9. Priorisation métier

### 🔴 Critique
- absence de température
- référentiel rejets non stabilisé
- cas Garde Sebou non figé
- fragmentation IDP 2024
- paramètres ambigus à fort volume comme `H_G`

### 🟠 Élevé
- doublons stations et barrages
- incohérences de noms et d'unités
- débits négatifs
- couverture météo incomplète

### 🟡 Moyen
- mesures qualité sans valeur
- quelques codes historiques peu fréquents à clarifier
- améliorations de lisibilité du référentiel

---

## 10. Conclusion

L'état global du système est **partiellement mature** sur le plan métier : plusieurs domaines sont déjà bien alimentés, mais la lecture consolidée reste fragile tant que les référentiels et les règles de normalisation ne sont pas officiellement figés.

Le niveau de maturité des données est **moyen** :
- bon sur les volumes hydrologiques, qualité et une partie météo ;
- insuffisant sur la température, certains rejets, et la standardisation des paramètres.

Le niveau de risque métier est **élevé** :
- risque d'erreur d'interprétation sur les paramètres ;
- risque de double lecture ou mauvaise affectation sur stations, barrages et rejets ;
- risque de discussion bloquée en réunion si les arbitrages clés ne sont pas préparés.

---

## Sortie finale

1. Nombre total d'anomalies métier : **8**
2. Nombre de manques de données : **4**
3. Nombre de décisions à prendre : **16**
4. Top 5 priorités métier :
- absence de données température
- référentiel unique des rejets non stabilisé
- ambiguïtés majeures sur `H_G`, `sat`, `PTD`, `PTP`
- cas Garde Sebou non figé
- doublons stations / barrages
5. Liste des points bloquants pour la réunion :
- valider la signification officielle des paramètres ambigus
- confirmer la référence officielle de Garde Sebou
- décider du traitement des rejets non rattachés
- décider si les ensembles IDP 2024 doivent être fusionnés
- confirmer la source et le calendrier d'injection de la température
