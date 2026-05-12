# Registre Centralisé des Anomalies Métier (WQDSS)

Ce registre liste officiellement les cas particuliers, conflits et anomalies identifiées lors de la comparaison structurelle et des phases de *Dry-Run* entre les sources (`abh_sebou_070426`) et la production (`abh_sad`).

Aucune donnée n'est altérée. Ce document sert au pilotage des décisions métier avant apurement final ou mise en exception formelle.

---

## 📋 Vue Globale

| ID Unique        | Lot Origine  | Type d'Anomalie           | Table Concernée                  | Criticité  | Statut       | Décideur        |
|------------------|--------------|---------------------------|----------------------------------|------------|--------------|-----------------|
| `ANO-LOT1-001`   | LOT 1        | Doublon Multi-cardinalité | `public.infra_barrages_abhs`     | Élevée     | 🔴 À traiter    | Équipe Métier   |
| `ANO-LOT1-002`   | LOT 1        | Identifiant / Valeur NULL | `public.infra_barrages_abhs`     | Majeure    | 🔴 À traiter    | Équipe Métier   |
| `ANO-LOT2-001`   | LOT 2        | Doublons Nominaux Internes| `public.infra_stations_abhs`     | Modérée    | 🔴 À traiter    | Équipe Métier   |
| `ANO-LOT2-002`   | LOT 2        | Stations Anonymes (NULL)  | `public.infra_stations_abhs`     | Majeure    | 🔴 À traiter    | Équipe Métier   |
| `ANO-LOT3A-001`  | LOT 3A       | Débits < 0 (Incohérence)  | `public.mesures_debit_*`         | Majeure    | 🔴 À traiter    | Équipe Métier   |
| `ANO-LOT3B-001`  | LOT 3B       | Trous Chroniques (NULL)   | `mesures_precipitations_*`       | Modérée    | 🔴 À traiter    | Data Engineer   |
| `ANO-LOT4A-001`  | LOT 4A       | CAS_METIER_IMPLICITE      | `mesures_qualite_*`              | Modérée    | 🟩 VALIDÉ       | Équipe Métier   |
| `ANO-LOT4A-002`  | LOT 4A       | Concentration Vide (NULL) | `mesures_qualite_*`              | Modérée    | 🔴 À traiter    | Data Engineer   |
| `ANO-LOT4A-003`  | LOT 4A       | Qualité Censure Laboratoire (< 0) | `mesures_qualite_*`        | Majeure    | 🔴 À traiter    | Équipe Métier   |
| `ANO-LOT4A-004`  | LOT 4A-1     | Fissure Sémantique (148 Alias) | `mesures_qualite_*`           | Majeure    | 🔴 À traiter    | Data Engineer   |

---

## 🔎 Détail des Anomalies

### [ANO-LOT1-001] Conflit de Cardinalité (Bouhouda)
- **ID unique** : `ANO-LOT1-001`
- **Type** : Doublon
- **Table concernée** : `public.infra_barrages_abhs` (`abh_sebou_070426`) vs `infra.barrages` (`abh_sad`)
- **Valeur / identifiant** : `nom_barrage`="bouhouda"
- **Description** : Au cours du Lot 1, la résolution de correspondance spatiale s'appuie sur le nom normalisé ("bouhouda"). Or, il existe au moins deux enregistrements portant ce nom nominal. Mathématiquement cela lève un flou relationnel N-N empêchant le système de savoir quel objet updater sans fausser l'autre.
- **Impact** : L'automate bloque toute synchronisation ou création concernant "bouhouda" et isole la ligne dans les `WOULD_CONFLICT`.
- **Origine de la détection** : Audit A/B + Lot 1 Dry-Run
- **Proposition technique** : Intégrer l'IRE en suffixe ou discriminer géographiquement par distance s'ils sont physiquement deux barrages distincts (ex: "bouhouda amont").
- **Niveau de criticité** : Élevée
- **Responsable décision** : Équipe métier
- **Statut** : 🔴 À traiter

---

### [ANO-LOT1-002] Entité Sans Nom (Barrage Orphelin / None)
- **ID unique** : `ANO-LOT1-002`
- **Type** : Identifiant ou Valeur NULL
- **Table concernée** : `public.infra_barrages_abhs` (`abh_sebou_070426`)
- **Valeur / identifiant** : `id`="34", `nom_barrage`=`None`
- **Description** : La table d'audit source contient une ligne d'infrastructure physique totalement dépourvue de nom (valeur NULL / None). Dès lors, le rapprochement nominatif avec les barrages de production s'effondre.
- **Impact** : Le barrage est classé techniquement comme inexploitable et est ignoré (`WOULD_SKIP`) par l'UPSERT robotisé pour préserver la qualité de la production.
- **Origine de la détection** : Audit A/B + Lot 1 Dry-Run
- **Proposition technique** : L'extraire de la Sandbox via un filtre d'Archivage technique permanent si la géométrie est nulle. Ou l'identifier manuellement sur PostGIS et lui redonner un nom textuel correctement formatté dans le referrentiel d'attente s'il a une valeur métier avérée.
- **Niveau de criticité** : Majeure
- **Responsable décision** : Équipe métier
- **Statut** : 🔴 À traiter

---

### [ANO-LOT2-001] Doublons Nominaux (Même Nom Station)
- **ID unique** : `ANO-LOT2-001`
- **Type** : Doublons_Source_Nom
- **Table concernée** : `public.infra_stations_abhs` (`abh_sebou_070426`) et `infra.stations_mesure` (`abh_sad`)
- **Valeur / identifiant** : 14 fois le même `nom_station`
- **Description** : L'audit du Lot 2 a identité que 14 fois dans la base, on retrouve plusieurs stations portant géographiquement et typographiquement EXACTEMENT le même nom (par exemple, des rives Gauches/Droites confondues avec le même nom générique).
- **Impact** : Casse l'intégrité de routage si on se base uniquement sur le nom pour l'UPSERT hydrologique.
- **Origine de la détection** : Audit A/B Lot 2
- **Proposition technique** : Utilisation en combinaison d'une clé composite **Nom + ire_station**. Seul un matching double sera autorisé.
- **Niveau de criticité** : Modérée
- **Responsable décision** : Data Engineer (Logique implémentable informatiquement)
- **Statut** : 🔴 À traiter

---

### [ANO-LOT2-002] Stations Anonymes (NOM NULL)
- **ID unique** : `ANO-LOT2-002`
- **Type** : NOM_NULL
- **Table concernée** : `public.infra_stations_abhs` (`abh_sebou_070426`)
- **Valeur / identifiant** : D'abord annoncée à 4 enregistrements lors de l'audit initial (égalité stricte `NULL`), la limite s'est étendue à **11 enregistrements lors du Dry-Run** car la règle s'est adossée à l'identification des chaînes de caractères invisibles (chaînes vides, `""` ou `'None'` textuel). 
- **Description** : 11 stations physiques sont stockées avec un `nom_station` virtuellement manquant. 
- **Impact** : Impossible de les labéliser sur l'interface Front-End WQDSS, et collision lors de la génération automatique d'upsert.
- **Origine de la détection** : Audit A/B Lot 2
- **Proposition technique** : Bloquer formellement leur modification via l'exception 'WOULD_SKIP'. Extraire sur tableur et demander à l'équipe métier leurs vrais noms, ou se baser sur leur `ire_precipitation` pour concevoir un nom ID-based temporaire ("Station Oued Inconnu X").
- **Niveau de criticité** : Majeure
- **Responsable décision** : Équipe métier
- **Statut** : 🔴 À traiter

---

### [ANO-LOT3A-001] Incohérence Hydrologique (Débits Négatifs)
- **ID unique** : `ANO-LOT3A-001`
- **Type** : Valeur Aberrante (Physiquement impossible)
- **Table concernée** : `public.mesures_debit_jr` et/ou `public.mesures_debit_m` (`abh_sebou_070426`)
- **Valeur / identifiant** : 1931 relevés `debit_jr` / `debit_m` < 0
- **Description** : L'audit du sous-lot 3A a sondé les quantités volumétriques brutes et a découvert 1931 entrées stipulant un débit strictement descendant en dessous de 0. Hydrologiquement, sur ces lits, c'est impossible hors erreur instrumentale.
- **Impact** : Peut corrompre gravement les modules Analytics de calcul de bilans (massuels et totaux) dans la Production.
- **Origine de la détection** : Audit A/B Lot 3A
- **Proposition technique** : Intégrer un flag QA spécifique dans la production (`qa_flag_negative=true`) et isoler ces points de la sommation, ou les remettre à `NULL` avant ingestion si validation métier.
- **Niveau de criticité** : Majeure
- **Responsable décision** : Équipe métier (Confirmer la règle d'épurement)
- **Statut** : 🔴 À traiter

---

### [ANO-LOT3B-001] Lacunes Météorologiques (Mesures Vides/NULL)
- **ID unique** : `ANO-LOT3B-001`
- **Type** : Continuité de la Donnée (Trous dans la chronique)
- **Table concernée** : `public.mesures_precipitations_jr_traitees` et `public.mesures_evaporation_jr` (`abh_sebou_070426`)
- **Valeur / identifiant** : 10,308 tuples `NULL` consolidés
- **Description** : L'audit du sous-lot 3B a localisé plus de 10k dates enregistrées où aucune information pluviométrique ou évaporatoire n'a été saisie (ni relevé sur site, ni lissage NASA, ni données remplies via corrélations).
- **Impact** : Lignes fantômes qui surchargent la BDD sans apporter la moindre plus-value aux simulateurs agro-hydrauliques, et qui peuvent crasher des calculs d'agrégation d'intensité.
- **Origine de la détection** : Audit A/B Lot 3B
- **Proposition technique** : Rejeter purement et simplement ces dates (`WOULD_SKIP`) ou les ingérer avec le tag `qa_flag_null_filled=FALSE` et `est_valide=FALSE`.
- **Niveau de criticité** : Mineure à Modérée (C'est un fait inhérent aux pannes de capteurs, mais un gaspillage I/O).
- **Responsable décision** : Data Engineer / Équipe métier (Filtrer à l'upsert)
- **Statut** : 🔴 À traiter

---

### [ANO-LOT4A-001] Mésalignement Qualité-Infrastructure -> [Barrage Garde Sebou]
- **ID unique** : `ANO-LOT4A-001`
- **Type** : CAS_METIER_IMPLICITE
- **Table concernée** : `public.mesures_suivi_qualite_brg_garde_hebdo` (`abh_sebou_070426`)
- **Valeur / identifiant** : 7,094 mesures rattachées à l'aveugle
- **Description** : Environ 3% des analyses chimiques historiques de la base (7k lignes) référençaient un `ire_station` complètement vide. Cependant, d'un point de vue strict métier, l'intégralité de la table `mesures_suivi_qualite_brg_garde_hebdo` correspond empiriquement à l'identifiant topologique unique du "Barrage Garde Sebou".
- **Impact** : Règle débloquée. Les 7094 lignes historiques sont récupérées !
- **Origine de la détection** : Audit A/B Lot 4A + Justification métier
- **Proposition technique** : Mapping FIXE OBLIGATOIRE forcé (`station_id = ID de la station "Barrage Garde Sebou"`). Lors du dry-run/upsert, les flags `qa_flag_station_infered = TRUE` et `source_mapping_rule = 'REGLE_FIXE_BARRAGE_GARDE_SEBOU'` seront formellement assignés à la volée. Mouvement `WOULD_INSERT` ou `WOULD_UPDATE`.
- **Niveau de criticité** : Modérée
- **Responsable décision** : Utilisateur validé (Expert Métier)
- **Statut** : 🟩 VALIDÉ

---

### [ANO-LOT4A-002] Valeur Concentration NULL
- **ID unique** : `ANO-LOT4A-002`
- **Type** : Donnée Labo Manquante
- **Table concernée** : Ensemble des sources `public.mesures_qualite_*` (`abh_sebou_070426`)
- **Valeur / identifiant** : 3,579 points
- **Description** : Saisie partielle par le laboratoire : la date et la station sont notées, le paramètre est choisi mais le chiffre de la concentration est laissé sciemment vide (`NULL`).
- **Impact** : Ghosting.
- **Origine de la détection** : Audit A/B Lot 4A
- **Proposition technique** : Rejeter mécaniquement (`WOULD_SKIP`).
- **Niveau de criticité** : Modérée
- **Responsable décision** : Data Engineer
- **Statut** : 🔴 À traiter

---

### [ANO-LOT4A-003] Censure ou Erreur Labo (< 0mg/l)
- **ID unique** : `ANO-LOT4A-003`
- **Type** : Incohérence Moléculaire
- **Table concernée** : `public.mesures_qualite_*` (`abh_sebou_070426`)
- **Valeur / identifiant** : 2 points aberrants
- **Description** : Un taux de pollution ou de minéralisation ne peut physiquement pas être négatif. Cette convention (-99, -1) cache souvent un code "Sous le seuil de détection du laboratoire" (LOQ).
- **Impact** : Détruit les bilans molaires absolus.
- **Origine de la détection** : Audit A/B Lot 4A
- **Proposition technique** : Flag QA.
- **Niveau de criticité** : Majeure
- **Responsable décision** : Équipe métier
- **Statut** : 🔴 À traiter

---

### [ANO-LOT4A-004] Fissure Sémantique Exceptionnelle (148 Alias)
- **ID unique** : `ANO-LOT4A-004`
- **Type** : Absence de Normalisation
- **Table concernée** : Ensemble des sources `public.mesures_qualite_*` (`abh_sebou_070426`)
- **Valeur / identifiant** : 148 alias laborantins textuels
- **Description** : L'ingestion directe est impossible. Les tableaux source désignent les éléments via une myriade d'alias corrompus, de mélanges de symboles (ex: `PO4 3-` vs `Phosphore total` vs `PT` vs `PTD`).
- **Impact** : Casse l'unification de l'analyse Qualité.
- **Origine de la détection** : Lot 4A-1 (Dictionnaire)
- **Proposition technique** : Résolution par implémentation stricte du tableau dicté `qualite.map_parametre_source`. Tout mot non résolu par ce dictionnaire sera rejeté (avec un Flag Missing). 
- **Niveau de criticité** : Majeure
- **Responsable décision** : Data Engineer / Chimiste
- **Statut** : 🔴 À traiter

### [ANO-LOT4A-005] Fissure Géospatiale Rejets/IDP
- **ID unique** : `ANO-LOT4A-005`
- **Type** : Carence Topographique / Entité Complexe
- **Table concernée** : IDP 2024 (`mesures_idp_*`) et Inventaires
- **Description** : Les métriques IDP pointent sur des rejets ponctuels qui n'existent pas mathématiquement dans la table mère de qualité Rivières (`infra.stations_mesure`). Les clés orphelines seront massives en l'état.
- **Proposition technique** : Re-routage strict de la validation spatiale vers les tables spécifiques `infra.rejet_industriel`, etc. ou tolérance d'insertion d'Infra.
- **Niveau de criticité** : Bloquante
- **Statut** : 🔴 À traiter

