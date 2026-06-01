# 📑 RAPPORT GLOBAL DES BLOCAGES ET INCOHÉRENCES (VERSION INTERNE DATA ENGINEERING)

> **Méta-Objectif** : Ce document a pour but de consolider l'ensemble des dérives structurelles, heuristiques et métier rencontrées lors des migrations de données (Lots 1 à 4) de la Sandbox `abh_sebou_070426` vers la Production WQDSS `abh_sad`. Il est destiné aux équipes techniques (Analystes, Data Engineers) pour la conception du workflow ETL/ELT.

---

## 1. SYNTHÈSE EXÉCUTIVE
La topographie du SI WQDSS en production révèle plusieurs failles béantes de conception qui interdisent catégoriquement la migration automatisée de certains pans analytiques (Qualité, IDP). Si l'**Hydrologie** et la **Météorologie** ont pu être normalisées grâce au système de flags (qa_flag_negative, WOULD_SKIP pour les nulls), le volet **Chimique / Environnemental** présente des risques majeurs :
- **Risque de corruption des Barrages** : Les données historiques de production sont "propres" mais diffèrent violemment des sources initiales Sandbox non corrigées.
- **Risque Fantôme Topographique** : Tant dans l'IDP que pour les lacs, des milliers de relevés de pollution n'ont aucun ancrage `infra` valide.

**Top des urgences techniques :**
1. Résoudre le point géospatial "Garde Sebou".
2. Figer une règle de `WOULD_SKIP_NO_OVERWRITE` pour les Updates corrompus de Barrages.
3. Créer une passerelle logique (mapping `qualite.ref_parametre`) pour les polluants ambigus.

---

## 2. TABLEAU GLOBAL DES VERROUS WQDSS

| ID Identifiant | Domaine | Type de Blocage | Statut Ingestion | Niveau Criticité | Responsable Clé |
|---|---|---|---|---|---|
| `BLOQ-INFRA-001` | Infra | Problème de Référentiel (Orphelin) | 🔴 Bloquant critique | Majeure | Client (ABH) |
| `BLOQ-QUAL-001` | Qualité | Ambiguïté Sémantique (Paramètres) | 🔴 Bloquant partiel | Élevée | Client / Dévs |
| `BLOQ-QUAL-002` | Qualité | Incohérence Métier / Delta Valeurs | 🔴 Bloquant critique | Critique | Data Engineers |
| `BLOQ-IDP-001` | IDP | Clé Infra manquante (Topographie) | 🔴 Bloquant critique | Élevée | Client (ABH) |
| `BLOQ-QUAL-003` | Qualité | Problème de Mapping Structurel | 🟡 Non bloquant | Modérée | Data Engineers |
| `BLOQ-IDP-002` | IDP | Doublons métiers (4 tables 2024) | 🟡 Non bloquant | Faible | Client (ABH) |
| `BLOQ-HYDRO-001`| Hydro | Anomalie Physique (Débits Négatifs)| 🟩 Résolu (QA Flag) | Faible | Développeurs Dashboards |

---

## 3. FICHES DÉTAILLÉES (ANALYSE TECHNIQUE GLOBALE)

### 3.1 DOMAINE INFRASTRUCTURE & GÉOSPATIAL
#### ⬛ `BLOQ-INFRA-001` : Le Fantôme Spatial "Garde Sebou"
- **Domaine** : Infra / Métadonnées Spatiales
- **Type de blocage** : Problème de référentiel (Station absente)
- **Source** : Cible `abh_sad` (schéma `infra.stations_mesure`) / Script d'audit `lot4a3_station_updates_resolver.py` / Doc `14_lot4a3_garde_sebou_station_resolution.md`.
- **Description** : L'historique des suivis Hebdomadaires (~7000 lignes) a été assigné à une entité implicite `Barrage Garde Sebou` par validation métier. Or, le catalogue de Production `infra.stations_mesure` ne possède aucun ID, Nom ou Code Station relié à ce terme. 
- **Impact** : L'Upsert IDP / Qualité plante avec `psycopg2.errors.ForeignKeyViolation`. Impossible de rattacher la qualité sans un `fk_station`.
- **Analyse Technique** : Au cours du Dry-run (Lot 4A-3), un ID virtuel `99999` a été utilisé avec succès, prouvant que le code fonctionne avec une identité. Mais le matricule réel marocain est absent de la Database.
- **Compréhension & Hypothèse** : L'infrastructure topographique est peut-être listée avec un ancien matricule hydro (ex: "BGS_01") indétectable par la requête SQL `ILIKE '%garde%'`.
- **Options de Traitement** :
  - *Option A (Safe)* : Exiger l'ID de prod du client.
  - *Option B (Optimisée)* : Créer un insert automatique `INSERT INTO infra.stations_mesure (code_station, nom) VALUES ('BARRAGE_GARDE_IMPLICIT', 'Garde Sebou')`.
- **Responsabilité** : Client (ABH)
- **Statut** : 🔴 Bloquant critique

---

### 3.2 DOMAINE QUALITÉ DES EAUX 
#### ⬛ `BLOQ-QUAL-001` : Fracture Sémantique Polymorphe (148 Alias Sandbox)
- **Domaine** : Qualité / Rivières, Nappes, Barrages
- **Type de blocage** : Ambiguïté Sémantique
- **Source** : `abh_sebou_070426` (`mesures_qualite_*`) / Script `lot4a1_dict_param_analyzer.py` / Doc `12_lot4a1b_dictionnaire_parametres_valide.md`.
- **Description** : L'origine empirique de la Sandbox renferme 148 alias laborantins désordonnés pour caractériser ~35 polluants officiels. Notamment, `H_G`, `sat`, `PTD`, `PTP`, etc. 
- **Impact** : Plus de 3 751 lignes historiques sur l'aquifère et les lacs ont été bloquées en simulé par notre `QA_FLAG_PARAM_UNMAPPED` (Rejet d'analyse). Ces données ne seront pas intégrées aux bilans WQDSS.
- **Analyse Technique** : L'unitarisation des symboles est réussie en Backend mais les "orphelins symboliques" demeurent un gouffre. Ex : `H_G` compte 4726 occurrences.
- **Compréhension & Hypothèse** : Nous suspectons que `H_G` soit "Huiles et Graisses" ou bien un typage défaillant du Mercure (`Hg`). Pareil pour `sat` (= Saturation O2 ?).
- **Options de Traitement** :
  - *Option A (Safe)* : Geler les paramètres ambigus (les laisser sur `qa_flag_param_unmapped`) perpétuellement.
  - *Option B (Optimisée)* : Créer la table `qualite.map_parametre_source` et intégrer le pont final validé par le client chimique.
- **Responsabilité** : Client (Chimiste)
- **Statut** : 🔴 Bloquant partiel

#### ⬛ `BLOQ-QUAL-002` : Différentiel Massif des Mutants de Production
- **Domaine** : Qualité / Barrages
- **Type de blocage** : Incohérence Métier / Delta Valeurs
- **Source** : Sandbox vs Prod (`mesures_qualite_barrages`) / Script `lot4a3_station_updates_resolver.py` / Doc `14_lot4a3_barrages_updates_detail.md`.
- **Description** : Sur 8714 lignes Barrages de la source, **609 cas** existent déjà en Prod mais avec une valeur numérique lourdement discordante (Deltas massifs de pH, Chla de 85 à 16, etc). 
- **Impact** : Un "Upsert" agressif de la Sandbox (Master) sur la Production (Target) écrasera la Production et y *réinstallera* de graves fausses valeurs de paramètres !
- **Analyse Technique** : Ces corrections massives de la décimale (delta moyen : 1.9) sont dues à un nettoyage ancien sur la Prod qui n'a jamais été retro-ingéré dans le Back-Office (Sandbox). L'histoire est corrompue.
- **Compréhension & Hypothèse** : Les ingénieurs du passé ont nettoyé les CSVs avant de les injecter de Prod, ou exécuté des queries curatives sur les "pH à 17".
- **Options de Traitement** :
  - *Option A (Recommandée)* : Suspendre formellement tous les `WOULD_UPDATE` sur la table Barrage (Ne faire que de l'Insert strict).
  - *Option B (Risquée)* : Écraser la Prod (Strict Ingestion).
- **Responsabilité** : Data Engineers
- **Statut** : 🔴 Bloquant critique

#### ⬛ `BLOQ-QUAL-003` : La Fusion des Réservoirs dans SAD
- **Domaine** : Qualité / Architecture SI
- **Type de blocage** : Problème de Mapping Structurel
- **Source** : Cible `abh_sad` (`qualite.mesure_qualite_barrage`) / Doc `13_lot4a3_barrages_mapping.md`.
- **Description** : La table BDD de Prod cible possède 15 808 lignes, tandis que notre table mère Sandbox 'mesures_qualite_barrages' n'en a que 8 714. Nous avons prouvé que 15808 = 8714 + 7094 (les lignes de Suivi Hebdo). L'ancienne logique concaténait les deux concepts analytiques (Garde vs Reste).
- **Impact** : Le SI de production devra être réorganisé si l'on scinde les concepts logiques de Suivi Hebdo.
- **Analyse Technique** : Techniquement facile à scinder via notre module Python.
- **Options de Traitement** : 
  - *Option A (Optimisée)* : Truncate the table de prod, et réinjecter les 2 Flux respectifs.
- **Responsabilité** : Data Engineers
- **Statut** : 🟡 Non bloquant

---

### 3.3 DOMAINE POLLUTION PONCTUELLE / IDP
#### ⬛ `BLOQ-IDP-001` : Clés Infra Orphelines (Rejets IDP)
- **Domaine** : IDP / Rejets
- **Type de blocage** : Problème de référentiel (Topologie spatiale). `ANO-LOT4A-005`
- **Source** : Sandbox (`mesures_idp_2024_*` / `inv_rejets_*_abhs`) vs Prod (`infra.rejet_*`) / Doc `12_lot4a4_idp_audit_ab.md`.
- **Description** : Les métriques de pollution IDP 2024 identifient des rejets urbains (Abattoirs, Décharges) et des usines, mais aucune connexion relationnelle n'est confirmée avec la matrice en étoile `infra` actuelle. 
- **Impact** : Le futur Dry-run échouera sur presque tous les enregistrements si on insiste sur le Forçage relationnel strict.
- **Analyse Technique** : Le script `lot4a4_idp_discovery.py` montre qu'il existe bien 9 tables d'inventaire en prod, mais la nomenclature des ID restera opaque à l'algorithme auto de Python sans référentiel clair.
- **Options de Traitement** :
  - *Option A (Safe)* : Utiliser un nouveau flag logiciel `qa_flag_missing_source` pour tolérer une injection aveugle des IDP (Orphelins "virtuels").
  - *Option B* : Créer la station infrastructurelle lors du Parse.
- **Responsabilité** : Client (ABH) / Conception WQDSS
- **Statut** : 🔴 Bloquant critique

#### ⬛ `BLOQ-IDP-002` : Doublons Structurels IDP 2024
- **Domaine** : IDP / Donnée
- **Type de blocage** : Ambiguïté Structurelle
- **Source** : Sandbox (`mesures_idp_2024_qualite_globale` VS `..._marche_cadre`).
- **Description** : 2024 héberge 4 tables séparées pour le même domaine temporel, provoquant un fractionnement analytique. S'agit-il d'un doublon ?
- **Impact** : Le pipeline sera artificiellement compliqué et risque de générer du doublon lors des UNION ALL en datawarehouse.
- **Responsabilité** : Métier (ABH)
- **Statut** : 🟡 Non bloquant

---

### 3.4 DOMAINE HYDROMÉTÉOROLOGIE
#### ⬛ `BLOQ-HYDRO-001` : La Gouvernance des Débits Négatifs
- **Domaine** : Hydro / Séries Connexes
- **Type de blocage** : Anomalie Physique
- **Source** : Historique Lot 3A (Débits) / Registre des règles validées.
- **Description** : L'Audit Lot3A a consigné des débits négatifs. Métier a acté : "Ne pas transformer en NULL, Flag QA = True, conserver la ligne". 
- **Impact** : Intégration Data = Parfaite. Mais pour l'intégration *Analytics* (Dashboards React, modèles HEC-HMS / WASP / SWAT), ces débits négatifs, bien que flaggués, vont crasher les routages hydrauliques.
- **Options de Traitement** : Câbler les APIs du backend (ex: `api.v_map_points_kpi`) pour exclure automatiquement WHERE `qa_flag_negative = FALSE`.
- **Responsabilité** : Développeurs Dashboard
- **Statut** : 🟩 Résolu (Au niveau ingénierie BDD).
