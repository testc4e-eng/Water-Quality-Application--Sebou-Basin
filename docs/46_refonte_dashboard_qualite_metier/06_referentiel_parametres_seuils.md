# Référentiel des Paramètres et Seuils (Dashboard Qualité)

Ce document décrit l'architecture et les règles métier utilisées pour l'affichage de l'onglet **Paramètres** du Dashboard Qualité des eaux, dans le cadre de la refonte globale de l'interface.

## Objectif

L'onglet "Paramètres" a pour but de fournir un **référentiel unifié** croisant :
1. Les paramètres réellement **mesurés** sur le terrain (remontés via la vue matérialisée unifiée `api.v_qualite_dashboard_unifiee`).
2. Les **seuils réglementaires officiels** (définis dans le moteur réglementaire `api.v1.quality.thresholds`).

L'objectif est d'identifier clairement quels paramètres mesurés sont classifiables, lesquels ne le sont pas, et d'offrir une visibilité complète sur la réglementation en vigueur, y compris pour les paramètres réglementaires n'ayant pas encore de mesures.

## Endpoints Consommés

L'interface consolide 3 endpoints distincts, garantissant le découplage entre les données volumétriques brutes et le paramétrage réglementaire :

1. `/api/v1/quality/unified/parameters` :
   Retourne la volumétrie par paramètre qualitatif (nombre de mesures, nombre de stations, dates min/max).
2. `/api/v1/quality/thresholds` :
   Retourne les seuils de classes, leur ordre de sévérité, et leurs intervalles pour le type d'eau `surface_generale`.
3. `/api/v1/quality/regulatory-status` :
   Retourne les KPIs globaux (nombre de seuils actifs, compteurs totaux, version du référentiel).

## Stratégie de Fusion (Matching)

Le croisement s'effectue côté frontend selon des **règles strictes** (aucun fuzzy matching) pour garantir la fiabilité juridique du dashboard. Un paramètre de mesure correspond à un seuil réglementaire si l'identifiant remonté dans `parametre_qualite` correspond exactement à l'une de ces valeurs côté réglementaire (par ordre de priorité) :

1. `code_canonique` exact.
2. `code_reglementaire` exact.
3. `parametre_pdf` (souvent l'alias validé ou le libellé officiel).
4. `libelle_reglementaire`.

> [!WARNING]
> Si aucune correspondance exacte n'est trouvée, le paramètre mesuré est considéré comme `NON_MAPPÉ` et ne dispose donc d'aucun seuil réglementaire dans le dashboard, même s'il s'agit d'une légère variation orthographique.

## Badges et Statuts

La nomenclature visuelle des paramètres respecte ces états :

* **MESURÉ** : Des données existent dans la vue unifiée.
* **SANS_MESURE** : Paramètre existant dans le référentiel réglementaire officiel, mais sans aucune donnée terrain.
* **CLASSIFIABLE** : Un ou plusieurs seuils actifs ont été trouvés pour ce paramètre.
* **NON_CLASSIFIABLE** : Pas de seuils actifs ou paramètre de nature observationnelle.
* **OBSERVATIONNEL** : Strictement réservé aux 5 paramètres structurellement non classifiables :
  * `H_P_A_TOTAUX`
  * `HYDROCARBURES`
  * `OXYDABILITE_KMNO4`
  * `PESTICIDES_PAR_SUBST`
  * `PESTICIDES_TOTAUX`

## Performance (Stale Time)

La séparation des responsabilités s'illustre également dans la stratégie de mise en cache du navigateur (React Query) :
* Les **Mesures** (`unified/parameters`) ont une durée de vie (staleTime) de `30 secondes`.
* Le **Référentiel Réglementaire** (`thresholds` et `regulatory-status`) dispose d'un staleTime de `5 minutes`, limitant drastiquement les requêtes sur ces référentiels lourds et immuables au quotidien.

## Limites Actuelles

* Le système se base sur le type d'eau `surface_generale` de manière hardcodée pour afficher les seuils dans ce tableau consolidé. Les règles spécifiques à des contextes particuliers (ex: baignade) nécessiteraient une adaptation de la table ou un système d'onglets croisés.
* La structure d'accordéon affiche les seuils à titre informatif. Le calcul des "Classes Globales" de la station, qui s'appuie sur le principe du paramètre déclassant, relève d'une logique d'un autre panneau du dashboard.
