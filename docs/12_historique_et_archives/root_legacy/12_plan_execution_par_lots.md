# Plan d'Execution par Lots

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Perimetre | pilotage des lots de convergence documentaire et technique |
| Source de verite | Oui |
| Documents lies | [00_SOURCE_OF_TRUTH_MASTER](../../00_SOURCE_OF_TRUTH_MASTER.md), [30_audit_incoherences_global](./30_audit_incoherences_global.md), [31_plan_correction_documentaire](./31_plan_correction_documentaire.md) |
| Derniere mise a jour | 2026-04-17 |

## 1. Regle de lecture

Ce document ne doit plus etre lu comme un simple plan theorique de lancement. Il doit refleter l'etat reel observe des lots a partir :

- des audits deja produits dans `docs/12_*` ;
- des mappings et dry-runs deja produits dans `docs/13_*` et `docs/14_*` ;
- des verifications DB, backend et frontend realisees au 2026-04-17.

Aucune mutation destructive en base n'est autorisee sans validation explicite. Le present document suit uniquement l'etat de preparation, de verification et de cloture documentaire des lots.

## 2. Vue d'ensemble

Taxonomie de statut appliquee : `SYNCED`, `SYNCED_WITH_QA_FLAGS`, `BLOCKED_BY_BUSINESS`, `BLOCKED_BY_MAPPING`, `BLOCKED_BY_INFRA`, `LEGACY_COMPAT_REQUIRED`, `READY_FOR_INGESTION`, `DO_NOT_INGEST`, `ARCHIVED`.

| Lot | Perimetre | Statut normalise au 2026-04-17 | TYPE_DE_QA_FLAG | PRIORITE | ACTION_REQUISE | Justification technique courte | Dependances restantes | Condition pour passer au statut suivant |
|---|---|---|---|---|---|---|---|---|
| Lot 1 | Barrages / architecture fixe | `SYNCED` | `N/A` | `MINEURE` | `Data` : cloturer formellement le lot et archiver les exceptions | audits, mapping et dry-run alignes avec la cible `infra.barrages` | trace des exceptions et validation finale de cloture | passer a `ARCHIVED` apres cloture documentaire explicite |
| Lot 2 | Referentiels administratifs et hydriques de base | `SYNCED` | `N/A` | `MINEURE` | `Data` : valider la cloture documentaire et les dependances aval | referentiels consolides et corpus de convergence coherent | verification finale des dependances aval | passer a `ARCHIVED` apres cloture documentaire explicite |
| Lot 3A | Chroniques mensuelles / agregats mensuels | `SYNCED_WITH_QA_FLAGS` | `NEGATIVE_VALUE` (1931), `FORMAT_ERROR` (19316 avant correctif) | `MAJEURE` | `Data` : traiter les flags ; `Backend` : fiabiliser hydro/observatory sur le flux mensuel | convergence obtenue mais encore dependante du correctif mensuel et des controles QA associes | filtrage des valeurs anormales et regles QA mensuelles | passer a `SYNCED` apres validation des flags QA |
| Lot 3B | Chroniques journalieres et series massives | `SYNCED` | `N/A` | `MINEURE` | `Data` : maintenir les controles QA existants | chroniques synchronisees avec regles de controle deja documentees | maintien des regles sur vides et QA | passer a `ARCHIVED` apres cloture documentaire explicite |
| Lot 4A-1 | Pole qualite unifiee - socle | `BLOCKED_BY_MAPPING` | `N/A` | `MAJEURE` | `Metier` : arbitrer les alias ; `Data` : figer le mapping | blocage sur 9 groupes d'alias et de correspondances parametriques encore non figes | arbitrages sur 9 groupes d'alias ambigus, avec impact deja visible sur 3751 lignes gelees en aval | passer a `READY_FOR_INGESTION` lorsque le mapping est fige |
| Lot 4A-2 | Pole qualite unifiee - dry-run 2 | `SYNCED_WITH_QA_FLAGS` | `NEGATIVE_VALUE` (2), `PARAM_UNMAPPED` (3751) | `MAJEURE` | `Data` : traiter les 27 mutations ; `Metier` : resorber ou accepter les 3751 cas non mappes | dry-run concluant mais flags QA et mutations residuelles encore ouverts | 27 mutations restantes et `qa_flag_param_unmapped` | passer a `SYNCED` lorsque les flags QA sont traites |
| Lot 4A-3 | Pole qualite unifiee - dry-run 3 | `BLOCKED_BY_BUSINESS` | `PARAM_UNMAPPED` (251), `STATION_INFERRED` (3515) | `CRITIQUE` | `Metier` : trancher l'overwrite ; `Data` : preparer l'application des 609 updates ; `Backend` : maintenir la compatibilite analytique | blocage non technique sur la politique d'overwrite des mises a jour barrages | arbitrage metier sur les `609` updates | passer a `READY_FOR_INGESTION` lorsque la regle metier est validee |
| Lot 4A-4 | Pole qualite unifiee - audit avance | `BLOCKED_BY_INFRA` | `NULL_VALUE`, `MISSING_SOURCE`, `ORPHAN_INFRA_REJET_REFERENCE` | `CRITIQUE` | `Client` : decider la topographie ; `SIG` : definir le support geospatial ; `Data` : formaliser la cle de fusion ; `Backend` : preparer la chaine IDP | dry-run final non executable tant que 2 decisions d'infrastructure logique ne sont pas stabilisees | topographie des rejets, fusion 2024, conditions d'execution du dry-run sur 8508 mesures qualite et 391 lignes source pollution | passer a `READY_FOR_INGESTION` lorsque le dry-run final est executable |

## 3. Detail par lot

### Lot 1 - Barrages

- Objectif : valider le flux de convergence sur un perimetre statique a faible risque.
- Cible documentaire et technique : `infra.barrages`.
- Statut normalise : `SYNCED`.
- Justification technique courte : les audits, mappings et dry-runs existent deja dans le corpus documentaire et ne montrent pas d'ecart bloquant residuel.
- Dependances restantes : garder la trace des exceptions et obtenir la validation finale de cloture.
- Condition pour passer au statut suivant : passer a `ARCHIVED` apres cloture documentaire explicite.

### Lot 2 - Referentiels

- Objectif : consolider le pivot spatial et administratif.
- Statut normalise : `SYNCED`.
- Justification technique courte : la documentation de convergence est deja presente et le lot est globalement synchrone sur le pivot referentiel.
- Dependances restantes : verifier une derniere fois les dependances aval.
- Condition pour passer au statut suivant : passer a `ARCHIVED` apres cloture documentaire explicite.

### Lot 3A - Chroniques mensuelles

- Objectif : convergence des agregats mensuels et des chroniques derivees.
- Statut normalise : `SYNCED_WITH_QA_FLAGS`.
- TYPE_DE_QA_FLAG : `NEGATIVE_VALUE` sur 1931 lignes journalieres ; `FORMAT_ERROR` sur 19316 chroniques mensuelles avant correctif du parsing des mois francais.
- PRIORITE : `MAJEURE`.
- ACTION_REQUISE : `Data` doit qualifier et solder les flags ; `Backend` doit securiser les modules hydro et observatory consommateurs du mensuel.
- Justification technique courte : le lot est globalement synchrone mais reste soumis au correctif mensuel et aux controles QA associes.
- Dependances restantes : confirmer le correctif et formaliser le filtrage des valeurs anormales dans les couches de restitution.
- Condition pour passer au statut suivant : passer a `SYNCED` lorsque les QA flags mensuels sont traites et valides.

### Lot 3B - Chroniques journalieres

- Objectif : convergence des series journalieres massives.
- Statut normalise : `SYNCED`.
- Justification technique courte : le lot est documente et coherent au niveau du pilotage avec les regles de controle existantes.
- Dependances restantes : maintien des regles sur vides et QA.
- Condition pour passer au statut suivant : passer a `ARCHIVED` apres cloture documentaire explicite.

### Lot 4A-1 - Pole qualite unifiee - socle

- Objectif : convergence du domaine qualite, incluant rivieres, barrages, nappes et suivis associes.
- Statut normalise : `BLOCKED_BY_MAPPING`.
- PRIORITE : `MAJEURE`.
- ACTION_REQUISE : `Metier` doit arbitrer les alias ; `Data` doit figer le dictionnaire et deblayer l'impact aval sur 3751 lignes gelees.
- Justification technique courte : le socle dictionnaire reste bloque par 9 groupes d'alias non figes a arbitrer (`sat`, `H_G`, `PTD`, `PTP`, `RS105`, `RS185`, `F_M_mes/FM`, `Numerotation_GT`, `IP(mgO2/l)`).
- Dependances restantes : arbitrages sur 9 groupes d'alias ambigus et validation du mapping final ; impact deja visible sur 3751 lignes gelees `qa_flag_param_unmapped` en aval.
- Condition pour passer au statut suivant : passer a `READY_FOR_INGESTION` lorsque le mapping est fige.

### Lot 4A-2 - Pole qualite unifiee - dry-run 2

- Objectif : convergence du domaine qualite sur le perimetre rivieres / nappes.
- Statut normalise : `SYNCED_WITH_QA_FLAGS`.
- TYPE_DE_QA_FLAG : `NEGATIVE_VALUE` sur 2 lignes ; `PARAM_UNMAPPED` sur 3751 lignes (`1374` rivieres + `2377` nappes).
- PRIORITE : `MAJEURE`.
- ACTION_REQUISE : `Data` doit traiter les 27 mutations ; `Metier` doit valider ou corriger les `PARAM_UNMAPPED` avant liberation analytique complete.
- Justification technique courte : le dry-run est complet mais il reste des flags QA et des mutations residuelles a assumer ou corriger.
- Dependances restantes : traiter les 27 mutations restantes et `qa_flag_param_unmapped`.
- Condition pour passer au statut suivant : passer a `SYNCED` lorsque les flags QA sont leves ou explicitement acceptes.

### Lot 4A-3 - Pole qualite unifiee - dry-run 3

- Objectif : convergence du domaine qualite sur le perimetre barrages / garde.
- Statut normalise : `BLOCKED_BY_BUSINESS`.
- TYPE_DE_QA_FLAG : `PARAM_UNMAPPED` sur 251 lignes (`163` barrages + `88` garde) ; `STATION_INFERRED` sur 3515 lignes Garde Sebou.
- PRIORITE : `CRITIQUE`.
- ACTION_REQUISE : `Metier` doit trancher la politique d'overwrite ; `Data` doit preparer l'application ou l'abandon des 609 updates ; `Backend` doit conserver une exposition analytique compatible tant que la decision n'est pas prise.
- Justification technique courte : le blocage est lie a l'arbitrage metier sur la politique d'overwrite des `609` updates.
- Dependances restantes : arbitrer la politique d'overwrite des `609` updates et statuer sur le maintien analytique des 251 lignes `PARAM_UNMAPPED`.
- Condition pour passer au statut suivant : passer a `READY_FOR_INGESTION` lorsque la regle metier est approuvee.
- DECISION REQUISE : valider ou refuser l'application des `609` mutations `WOULD_UPDATE` ; valider la politique de maintien ou d'exclusion analytique des 251 lignes `PARAM_UNMAPPED`.
- IMPACT SI NON TRAITE : le lot reste bloque malgre une chaine technique prete ; les `609` mutations restent en suspens et `251` lignes demeurent hors analytique, tandis que `3515` lignes continuent de reposer sur une inference station fixe.

### Lot 4A-4 - Pole qualite unifiee - audit avance

- Objectif : finaliser le perimetre IDP avant ingestion.
- Statut normalise : `BLOCKED_BY_INFRA`.
- TYPE_DE_QA_FLAG : `NULL_VALUE`, `MISSING_SOURCE`, `ORPHAN_INFRA_REJET_REFERENCE`.
- PRIORITE : `CRITIQUE`.
- ACTION_REQUISE : `Client` doit decider la topographie cible ; `SIG` doit definir le support geospatial ; `Data` doit formaliser la cle de fusion ; `Backend` doit preparer la chaine d'ingestion et les modules d'exposition IDP.
- Justification technique courte : le dry-run final ne peut pas etre lance tant que 2 decisions d'infrastructure logique ne sont pas stabilisees sur `8508` mesures qualite IDP et `391` lignes source pollution.
- Dependances restantes : fixer la topographie des rejets, la logique de fusion 2024, et la cle de rattachement vers `434` rejets infra existants (`362` domestiques, `11` industriels, `61` abattoirs).
- Condition pour passer au statut suivant : passer a `READY_FOR_INGESTION` lorsque le dry-run final est executable.
- DECISION REQUISE : trancher si les points IDP doivent se rattacher a des rejets deja existants ou creer de nouveaux objets `infra.rejet_*` ; trancher si les 4 tables 2024 doivent etre fusionnees, dedoublonnees ou conservees distinctes.
- DETAIL CONFLITS IDP (`5618`) : `3067` conflits sur `mesures_idp_2024_qualite_globale`, `2297` sur `mesures_idp_2024_qualite_marche_cadre`, `139` sur `mesures_idp_2024_src_pollution_globale`, `115` sur `mesures_idp_2024_src_pollution_marche_cadre` ; il s'agit de conflits de doublons metier et de fragmentation semantique sur les cles de prelevement.
- IMPACT SI NON TRAITE : aucun dry-run final fiable n'est possible ; le flux reste expose a un `WOULD_CONFLICT` massif par orphelins topographiques et a une duplication semantique sur `5618` conflits metier detects dans l'audit IDP 2024.

## 4. Regle documentaire de pilotage

Lorsqu'un lot evolue :

1. mettre a jour le present document ;
2. verifier la coherence avec `00_SOURCE_OF_TRUTH_MASTER.md` ;
3. verifier la coherence avec les audits `12_*`, mappings `13_*` et dry-runs `14_*` ;
4. ne plus laisser de statut "a lancer" si des preuves d'execution existent deja dans le depot.
