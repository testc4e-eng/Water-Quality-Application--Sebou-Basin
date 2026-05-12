# Données problématiques — Bloc Paramètres

## 1. Résumé du bloc

Le bloc paramètres concentre le principal risque d'interprétation métier. Les données qualité sont nombreuses, mais plusieurs paramètres restent ambigus, non stabilisés ou non complètement rattachés au référentiel métier.

Les problèmes confirmés portent sur :

- des paramètres ambigus comme `H_G` et `sat` ;
- des variantes historiques comme `Conductivite`, `Conductivité`, `NO3-`, `T_eau` ;
- des paramètres non résolus dans les tables d'écarts ;
- des unités absentes dans le référentiel pour plusieurs paramètres déjà présents.

## 2. Méthode d'extraction

Documents utilisés :

- `docs/33_annexes_anomalies_detaillees/00_index.md`
- `A01_parametres_non_standardises.md`
- `A02_parametres_ambigus_HG_sat.md`
- `A11_incoherence_noms_unites.md`
- `A13_parametres_non_mappes.md`
- `docs/34_synthese_strategique_anomalies/01_bloc_parametres.md`
- `docs/34_synthese_strategique_anomalies/05_plan_decision_metier.md`

Tables inspectées :

- `qualite.mesure_qualite_riviere`
- `qualite.mesure_qualite_nappe`
- `qualite.mesure_qualite_barrage`
- `qualite.mesure_qualite_sebou`
- `qualite.suivi_qualite_barrage_garde_hebdo`
- `metadata.referentiel_parametre`
- `metadata.mapping_parametre_source`
- `metadata.mapping_parametre_unresolved_legacy_qualite_riviere`
- `metadata.mapping_parametre_unresolved_suivi_qualite_sebou`
- `staging.mesures_qualite_barrages`
- `staging.mesures_qualite_nappes`
- `staging.suivi_qualite_sebou`
- `staging.suivi_qualite_brg_garde_hebdo`

Requêtes utilisées :

- liste des paramètres distincts par table ;
- comptage des volumes par paramètre ;
- comptage des flags `qa_flag_param_missing` ;
- lecture du référentiel `metadata.referentiel_parametre` ;
- lecture des mappings et des tables d'écarts.

Limites :

- les tables qualité n'exposent pas d'unité de mesure au niveau de chaque ligne ;
- l'unité observée est donc souvent "absente" dans les données métier et doit être rapprochée du référentiel ;
- certaines variantes accentuées sont confirmées dans les tables d'écarts plus clairement que dans les tables de mapping.

## 3. Tableau global des paramètres problématiques

| Paramètre observé | Type problème | Variantes associées | Unité observée | Unité attendue | Volume BD | Exemple valeur | Tables concernées | Anomalie source | Décision attendue | Priorité |
|---|---|---|---|---|---:|---|---|---|---|---|
| H_G | ambigu ; non mappé ; à confirmer | HG | absente au niveau mesure | à confirmer ; le référentiel associe `HG` à `mg/L` | 4 108 | `2.396` | `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_sebou`, `metadata.mapping_parametre_unresolved_*` | A02, A13 | définir la signification officielle | Critique |
| sat | ambigu ; unité absente | SAT | absente au niveau mesure | absente dans le référentiel actuel | 1 220 | `15.68` | `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_barrage`, `metadata.mapping_parametre_source` | A02, A11 | confirmer le sens et l'unité | Critique |
| Conductivite | non standardisé ; unité absente | Conductivité | absente au niveau mesure | absente dans le référentiel actuel pour `CONDUCTIVITE` | 5 071 | `1795` | `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_barrage`, `metadata.mapping_parametre_source` | A01, A11 | valider le libellé officiel et l'unité | Élevée |
| Conductivité | non standardisé ; non mappé | Conductivite | absente au niveau mesure | à confirmer | 3 954 | `2200` | `qualite.mesure_qualite_sebou`, `metadata.mapping_parametre_unresolved_suivi_qualite_sebou` | A01, A11, A13 | fusionner avec la forme officielle | Élevée |
| NO3- | libellé historique ; unité absente | Nitrates | absente au niveau mesure | absente dans le référentiel actuel pour `NO3-` | 5 158 | `15300` | `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_barrage`, `metadata.mapping_parametre_source` | A01, A11 | confirmer le libellé officiel et l'unité | Élevée |
| T_eau | non standardisé ; unité absente | T_EAU | absente au niveau mesure | absente dans le référentiel actuel | 9 391 | `35.8` | toutes tables qualité sauf `mesure_qualite_riviere` et `metadata.mapping_parametre_source` | A01, A11 | fixer la forme officielle et l'unité | Élevée |
| PTD | ambigu ; unité absente | aucune confirmée en base active | absente au niveau mesure | absente dans le référentiel actuel | 136 | `88` | `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_barrage`, `metadata.mapping_parametre_source` | A02, A11 | confirmer la définition métier | Élevée |
| PTP | ambigu ; unité absente | aucune confirmée en base active | absente au niveau mesure | absente dans le référentiel actuel | 136 | `88` | `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_barrage`, `metadata.mapping_parametre_source` | A02, A11 | confirmer la définition métier | Élevée |
| F_M_mes | ambigu ; unité absente ; mauvais mapping possible | F_M_MES | absente au niveau mesure | absente dans le référentiel actuel | 11 | `301` | `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_barrage`, `metadata.mapping_parametre_source` | A02, A11 | confirmer le sens métier | Élevée |
| Phenol / Phénol | non standardisé ; non mappé partiel | Phénol | absente au niveau mesure | à confirmer | 3 954 + 682 cas non résolus | `0.029` | `qualite.mesure_qualite_sebou`, `metadata.mapping_parametre_unresolved_legacy_qualite_riviere` | A01, A13 | unifier l'écriture et confirmer le rattachement | Élevée |
| Nitrates | non standardisé ; non mappé | NO3- | absente au niveau mesure | à confirmer | 3 954 | `à confirmer` | `qualite.mesure_qualite_sebou`, `metadata.mapping_parametre_unresolved_suivi_qualite_sebou` | A01, A13 | fusionner avec `NO3-` ou nom officiel | Élevée |
| Ammonium | non standardisé ; non mappé | NH4 | absente au niveau mesure | à confirmer | 3 954 | `à confirmer` | `qualite.mesure_qualite_sebou`, `metadata.mapping_parametre_unresolved_suivi_qualite_sebou` | A01, A13 | fusionner avec le libellé officiel | Élevée |
| O2_dissous | non standardisé ; non mappé | O2_diss | absente au niveau mesure | à confirmer | 3 954 | `9.23` | `qualite.mesure_qualite_sebou`, `metadata.mapping_parametre_unresolved_suivi_qualite_sebou` | A01, A13 | unifier avec le libellé retenu | Élevée |
| Turbidité | non standardisé ; non mappé | Turbidite | absente au niveau mesure | à confirmer | 3 954 | `80.2` | `qualite.mesure_qualite_sebou`, `metadata.mapping_parametre_unresolved_suivi_qualite_sebou` | A01, A13 | unifier l'écriture | Élevée |
| NTK | non mappé partiel | Azote_tot_kjeldhal | absente au niveau mesure | à confirmer | 3 954 | `à confirmer` | `qualite.mesure_qualite_sebou`, `metadata.mapping_parametre_unresolved_suivi_qualite_sebou` | A13 | confirmer le rattachement officiel | Élevée |

## 4. Paramètres ambigus

### Paramètre : H_G

- Tables où il apparaît : `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_sebou`
- Volume : `4 108`
- Unités observées : aucune unité portée par les lignes ; le référentiel contient `HG|Mercure|mg/L`
- Exemples de valeurs : `0.377`, `2.396`
- Stations concernées : `bab merzouka`, `pt rp1 aval taza`, `dar el arsa`, `pont rp 26`, `amont barrage de garde`
- Dates extrêmes : `1991-03-27` à `2025-09-25`
- Interprétations possibles : hydrocarbures globaux ; huiles et graisses ; confusion avec mercure
- Risque métier : très élevé, car le sens du paramètre peut changer la lecture de pollution
- Décision attendue : définir officiellement la signification du code

### Paramètre : sat

- Tables où il apparaît : `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_barrage`
- Volume : `1 220`
- Unités observées : aucune unité portée par les lignes ; unité absente dans le référentiel actuel
- Exemples de valeurs : `0`, `15.68`, `941.2`
- Stations concernées : `khenichet`, `azib soltane`, `aval sidi slimane` et autres
- Dates extrêmes : `1988-09-20` à `2017-09-27`
- Interprétations possibles : saturation en oxygène ; autre notion historique de saturation
- Risque métier : élevé, car certaines valeurs très fortes suggèrent un besoin de validation stricte
- Décision attendue : confirmer le sens métier et l'unité officielle

### Paramètre : PTD

- Tables où il apparaît : `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_barrage`
- Volume : `136`
- Unités observées : aucune
- Exemples de valeurs : `0.08`, `88`
- Stations concernées : `82` stations distinctes sur l'ensemble
- Dates extrêmes : `1995-06-02` à `2009-11-10`
- Interprétations possibles : fraction dissoute du phosphore total ; autre découpage analytique
- Risque métier : moyen à élevé
- Décision attendue : définir le sens métier officiel

### Paramètre : PTP

- Tables où il apparaît : `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_barrage`
- Volume : `136`
- Unités observées : aucune
- Exemples de valeurs : `0.03`, `88`
- Stations concernées : `82` stations distinctes sur l'ensemble
- Dates extrêmes : `1995-06-02` à `2009-11-10`
- Interprétations possibles : fraction particulaire du phosphore total ; autre découpage analytique
- Risque métier : moyen à élevé
- Décision attendue : définir le sens métier officiel

### Paramètre : F_M_mes

- Tables où il apparaît : `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_barrage`
- Volume : `11`
- Unités observées : aucune
- Exemples de valeurs : `301`, `298.6`, `0.161`
- Stations concernées : `10` stations distinctes
- Dates extrêmes : `1994-07-06` à `2006-12-13`
- Interprétations possibles : fraction de MES ; code historique de filtration ; autre abréviation labo
- Risque métier : moyen
- Décision attendue : confirmer le sens exact et le maintien ou non dans le dictionnaire officiel

## 5. Paramètres avec unités incohérentes ou absentes

| Paramètre | Unités observées | Nombre de lignes | Exemple | Décision attendue |
|---|---|---:|---|---|
| H_G | absente au niveau mesure ; `mg/L` dans le référentiel `HG` | 4 108 | `2.396` | confirmer si `H_G` doit pointer vers `HG` |
| sat | absente dans les mesures et dans le référentiel actuel | 1 220 | `15.68` | définir l'unité officielle |
| Conductivite | absente dans les mesures ; absente dans le référentiel actuel | 5 071 | `1795` | définir l'unité et le libellé retenu |
| NO3- | absente dans les mesures ; absente dans le référentiel actuel | 5 158 | `15300` | définir l'unité officielle |
| T_eau | absente dans les mesures ; absente dans le référentiel actuel | 9 391 | `35.8` | fixer l'unité officielle |
| PTD | absente dans les mesures et dans le référentiel actuel | 136 | `88` | définir l'unité et le sens métier |
| PTP | absente dans les mesures et dans le référentiel actuel | 136 | `88` | définir l'unité et le sens métier |

## 6. Paramètres non mappés

| Paramètre source | Volume | Famille | Exemple station | Exemple date | Action recommandée |
|---|---:|---|---|---|---|
| H_G | 4 107 dans les tables d'écarts | organique / à confirmer | `dar el arsa` | `2025-09-25` | validation ABH urgente |
| Conductivité | 3 954 | physico-chimie | `dar el arsa` | `2025-09-25` | fusionner avec `Conductivite` ou libellé officiel |
| Nitrates | 3 954 | nutriments | `à confirmer` | `2025-09-25` | fusionner avec `NO3-` ou nom officiel |
| Ammonium | 3 954 | nutriments | `à confirmer` | `2025-09-25` | fusionner avec `NH4` ou libellé officiel |
| NTK | 3 954 | nutriments | `à confirmer` | `2025-09-25` | confirmer le rattachement officiel |
| O2_dissous | 3 954 | physico-chimie | `pont rp 26` | `2025-09-25` | harmoniser avec `O2_diss` |
| Turbidité | 3 954 | physico-chimie | `dar el arsa` | `2025-09-25` | harmoniser avec `Turbidite` |
| Phénol | 682 | organique | `bab merzouka` | `2024-11-25` | harmoniser avec `Phenol` |
| Pb | 436 | métaux | `à confirmer` | `1990-01-31` à `2024-11-15` | valider l'intégration |
| Se | 434 | métaux | `à confirmer` | `1990-01-31` à `2024-11-15` | valider l'intégration |
| CrT | 389 | métaux | `à confirmer` | `1990-01-31` à `2024-11-15` | valider l'intégration |
| Cd | 274 | métaux | `à confirmer` | `1990-02-07` à `2024-11-15` | valider l'intégration |
| Cu | 272 | métaux | `à confirmer` | `1990-01-31` à `2024-11-15` | valider l'intégration |
| Ni | 269 | métaux | `à confirmer` | `1990-08-01` à `2024-11-15` | valider l'intégration |
| As | 240 | métaux | `à confirmer` | `1993-03-09` à `2024-11-15` | valider l'intégration |
| Zn | 233 | métaux | `à confirmer` | `1990-01-31` à `2024-11-15` | valider l'intégration |
| Hg | 227 | métaux | `à confirmer` | `1990-01-31` à `2024-06-07` | clarifier la relation avec `H_G` |

## 7. Variantes et synonymes probables

| Variante 1 | Variante 2 | Libellé proposé | Justification | Statut |
|---|---|---|---|---|
| Conductivite | Conductivité | Conductivité officielle | même concept physico-chimique | à valider |
| NO3- | Nitrates | Nitrates / NO3 officiel | même famille nutriments | à valider |
| T_eau | T_EAU | Température eau | même variable de terrain | à valider |
| H_G | HG | à définir officiellement | forte proximité de code, sens encore non stabilisé | décision requise |
| O2_dissous | O2_diss | Oxygène dissous | même famille et même lecture probable | à valider |
| Phenol | Phénol | Phénol officiel | différence d'accent uniquement | à valider |
| Turbidite | Turbidité | Turbidité officielle | différence d'accent uniquement | à valider |

## 8. Questions métier

- `H_G` doit-il être interprété comme hydrocarbures globaux, huiles et graisses, ou autre chose ?
- `sat` correspond-il officiellement à une saturation en oxygène ?
- Quel nom officiel faut-il retenir pour `Conductivite` / `Conductivité` ?
- `NO3-` et `Nitrates` doivent-ils être fusionnés sous un même libellé métier ?
- Quels paramètres non mappés doivent être validés en priorité avant les prochains ateliers ABH ?

## 9. Points à vérifier manuellement

- confirmer l'unité officielle de `sat`, `PTD`, `PTP`, `T_eau`, `NO3-`
- vérifier si `H_G` doit ou non pointer vers le paramètre référentiel `HG`
- confirmer si les paramètres non mappés du Sebou (`Conductivité`, `Ammonium`, `Nitrates`, `O2_dissous`, `Turbidité`) doivent être intégrés au référentiel actif
- vérifier si des variantes accentuées sont présentes dans les fichiers Excel sources mais pas dans les tables de mapping
