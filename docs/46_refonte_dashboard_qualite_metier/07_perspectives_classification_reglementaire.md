# Perspectives : Classification Réglementaire Qualité (V2)

## 1. Contexte

Le **Dashboard Qualité V1** est désormais abouti et connecté aux données réelles :
* Il consolide les mesures brutes de la vue unifiée `api.v_qualite_dashboard_unifiee`.
* Il expose le référentiel des paramètres avec les seuils actifs issus du moteur réglementaire (`api/v1/quality/thresholds`).

Cependant, la **classification réglementaire complète**, qui consiste à attribuer dynamiquement des "Classes" (Excellente, Bonne, Mauvaise...) aux données mesurées en appliquant ces seuils, reste une fonctionnalité complexe qui constitue l'objectif majeur de la future **Perspective V2**.

## 2. Perspectives V2 à documenter

Afin de parachever le suivi réglementaire, les chantiers suivants ont été identifiés pour la V2 :

* **Classification par paramètre**
  * **Source future :** `POST /api/v1/quality/classify`
  * **Objectif :** Transformer chaque valeur brute confrontée à son seuil respectif en une classe réglementaire standardisée, associée à une couleur (Bleu, Vert, Jaune, Orange, Rouge).

* **Classe globale par station**
  * **Source future :** `POST /api/v1/quality/global-index`
  * **Objectif :** Appliquer la règle stricte du **paramètre déclassant**. La classe globale d'une station est dictée par la plus mauvaise classe obtenue parmi tous ses paramètres classifiables.

* **Historique des classes**
  * **Objectif :** Suivre l'évolution temporelle (annuelle ou mensuelle) de la qualité de chaque station, permettant l'identification visuelle des cycles ou dégradations saisonnières.

* **Alertes réglementaires**
  * **Objectif :** Détecter automatiquement et signaler les dépassements critiques, les dégradations continues ou les basculements d'un paramètre vers une classe "Médiocre" ou "Mauvaise".

* **Synthèse DG Qualité**
  * **Objectif :** Produire une vue décisionnelle simple, agrégée et orientée "Direction Générale", affichant : le % de stations en "Bon état", le % de stations dégradées, ainsi qu'un top des stations critiques nécessitant une intervention.

## 3. Statut Actuel

```text
DASHBOARD_QUALITE_V1 = CONNECTE_DONNEES_REELLES
CLASSIFICATION_REGLEMENTAIRE = PERSPECTIVE_V2
DEVELOPPEMENT = REPORTE
VALIDATION_UTILISATEUR = A_PLANIFIER
```

## 4. Limites

Ces futures évolutions sont conditionnées à la résolution des limites techniques suivantes :
* **Moteur réglementaire appliqué aux mesures réelles** : Nécessite une optimisation pour traiter l'application des règles à la volée sur de larges jeux de données.
* **Agrégats backend** : Les index globaux exigent des vues pré-calculées ou des CTE matérialisées additionnelles pour garantir les temps de réponse du dashboard.
* **Validation métier des classes** : Confirmation formelle des comportements face aux valeurs manquantes et de l'exclusion de certains paramètres déclassants selon les contextes.
* **Stratégie cartographique qualité** : Définition des représentations SIG permettant d'afficher des marqueurs colorés (pastilles qualité) sans surcharger la carte métier principale.

## 5. Prochaine étape projet

Suite à la finalisation de ce jalon, le chantier projet suivant est :
**Dashboard Carte Métier**
