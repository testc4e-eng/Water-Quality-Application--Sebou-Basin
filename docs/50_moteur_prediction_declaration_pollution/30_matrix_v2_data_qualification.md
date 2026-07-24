# 30 Matrix V2 - Qualification initiale des donnees

## 1. Statut

```text
MATRIX_V2_DATA_QUALIFICATION = BLOCKED_BY_BUSINESS_RULE_CONFLICT
```

Ce document enregistre l'audit initial exige avant toute modification du moteur.
Il ne valide pas encore l'utilisation scientifique des matrices. Il qualifie les
fichiers, les contrats existants et un conflit entre la regle barrage B et les
cas d'usage Matrix V2 attendus.

## 2. Sources inspectees

| Source | Role | Lignes utiles |
|---|---|---:|
| `output_wasp_matrix_1575_qr_30min_cmax_temps_arrivee_statut.xlsx` | Matrice segment 13 | 1 575 |
| `output_segment_26_cmax_temps_arrivee_statut.xlsx` | Matrice segment 26 | 1 575 |
| `output_segment_63_cmax_temps_arrivee_statut.xlsx` | Matrice segment 63 | 1 575 |
| `output_segment_130_cmax_temps_arrivee_statut.xlsx` | Matrice segment 130 | 1 575 |
| `output_segment_175_cmax_temps_arrivee_statut.xlsx` | Matrice segment 175 | 1 575 |
| `Coordonnes_Points_Rejets.xlsx` | Points WASP et controles | 5 sources, 5 controles |

Les cinq matrices partagent les 28 colonnes de sortie attendues : les cinq
variables d'entree, la masse NH4, les Cmax des segments 46/79/163/210/219 et
les colonnes `Temps_arrivee_*`. Ces temps sont normalises fonctionnellement
comme `time_to_cmax`, car ils representent le temps jusqu'au maximum de
concentration, et non la premiere arrivee du panache.

Le volume brut attendu est de 7 875 lignes avant exclusion des deux scenarios
incomplets confirmes du segment 130.

## 3. References spatiales Matrix V2

| Ordre | Segment source | Longitude | Latitude |
|---:|---:|---:|---:|
| 1 | 13 | -4.929117 | 34.211101 |
| 2 | 26 | -4.962473 | 34.286581 |
| 3 | 63 | -5.330729 | 34.261331 |
| 4 | 130 | -5.804300 | 34.462905 |
| 5 | 175 | -6.092606 | 34.609052 |

Les coordonnees source sont en WGS 84 (`EPSG:4326`). Les calculs de reseau
existants transforment deja les points en `EPSG:26191` dans
`propagation_pollution_service.py`.

Controles fonctionnels : 46/RP26, 79/Azib Soltane, 163/Belksiri,
210/P29 a Allal Tazi (`1355/8`) et 219/Amont Barrage de Garde (`3738/8`).

## 4. Briques existantes reutilisables

| Brique | Fichier | Reutilisation Matrix V2 |
|---|---|---|
| Workflow declaration | `backend/app/services/declaration_pollution_service.py` | Orchestration, snapshot, rapport, transitions |
| Matrice V1 | `backend/app/services/matrix_service.py` | Contrat exact match / voisin, domaine, recommandations a faire evoluer |
| Topologie | `backend/app/services/propagation/propagation_pollution_service.py` | Snap, parcours, distances, cibles stations et barrages |
| Adaptateur topologique | `backend/app/services/topology_adapter.py` | Contrat normalise de carte et declaration |
| Temps de transfert | `backend/app/services/travel_time_service.py` | A conserver comme proxy distinct de `time_to_cmax` |
| Cockpit unique | `frontend/src/pages/DashboardPollution.tsx` | Conteneur de la declaration, sans second dashboard |
| Workspace declaration | `frontend/src/components/Pollution/DeclarationWorkspace.tsx` | Orchestration UI et saisie existante |

## 5. Controle runtime des cinq sources

Les cinq points sources ont ete executes contre le moteur topologique local et
le referentiel `api.v_barrage_dimension`. Les distances indiquent le premier
barrage aval detecte sur le parcours.

| Segment source | Premier barrage aval detecte | Distance barrage km | Distance vers Garde km |
|---:|---|---:|---:|
| 13 | Sidi Chahed | 151.64 | 323.08 |
| 26 | Sidi Chahed | 128.11 | 299.54 |
| 63 | Sidi Chahed | 68.84 | 240.28 |
| 130 | Garde Sebou | 144.53 | 130.90 |
| 175 | Garde Sebou | 74.53 | 60.89 |

## 6. Conflit a resoudre avant implementation

La decision `DECISION_MATRIX_V2_BARRAGE_001` est actuellement formulee ainsi :

```text
Tout incident situe topologiquement en amont d'un barrage autre que le Barrage
de Garde est exclu de Matrix V2.
```

Appliquee strictement, cette regle classe les sources officielles 13, 26 et 63
en `NOT_APPLICABLE`, car leur parcours atteint Sidi Chahed avant Garde. Cela
contredit les cas d'usage Matrix V2 qui demandent explicitement :

```text
UC-01 : segment 13 selectionne
UC-02 : segment 63 selectionne
```

Le moteur ne doit pas choisir arbitrairement entre ces deux exigences. La
decision metier requise est l'une des suivantes :

1. Les cinq sources WASP 13/26/63/130/175 constituent une exception explicite
   a la regle barrage B, car leurs matrices integrent deja la configuration
   WASP de reference.
2. La regle B reste stricte : seules les matrices 130 et 175 seront exploitables
   dans le moteur runtime tant qu'une modelisation specifique de Sidi Chahed
   n'est pas disponible.
3. Le barrage Sidi Chahed est non bloquant pour ce corridor Matrix V2, avec une
   justification metier explicite a enregistrer dans le referentiel barrages.

## 7. Risques de regression

- Remplacer Matrix V1 sans feature flag casserait le preset de demonstration
  actuel et les contrats frontend existants.
- Confondre `time_to_cmax` et `travel_time_result` presenterait le pic comme
  une premiere arrivee de pollution.
- Utiliser les zeros et temps quasi nuls des controles amont comme sorties
  scientifiques fausserait les resultats et recommandations.
- Appliquer la regle barrage B avant la resolution de son exception sur les
  sources WASP rendrait trois des cinq matrices indisponibles.

## 8. Plan de modification conditionnel

Apres decision metier sur la section 6 :

```text
ressources Matrix V2 qualifiees
-> applicabilite barrage referencee
-> alignement topologique des cinq sources
-> moteur V2 derriere MATRIX_ENGINE_VERSION
-> integration declaration / snapshot / rapport
-> cockpit et recette de cas d'usage
```

