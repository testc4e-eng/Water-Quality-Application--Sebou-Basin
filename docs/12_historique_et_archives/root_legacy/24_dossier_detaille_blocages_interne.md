# 📂 DOSSIER INTERNE DÉTAILLÉ : BLOCAGES & INCOHÉRENCES PROJET WQDSS

> **Version** : 1.0 (Interne)
> **Objet** : Consolidation exhaustive des anomalies pour brainstorming technique et décision stratégique.
> **Sources** : Registre des anomalies (`doc 15`), Audits A/B, Dry-runs Lots 1-4.

---

## 1. SYNTHÈSE EXÉCUTIVE

### Top 15 des Blocages Critiques
1.  **INFRA** : Station "Garde Sebou" introuvable en Prod (IDP/Qualité gelés).
2.  **QUAL** : Écart massif (Delta > 10) entre valeurs de Prod et Sandbox pour les Barrages.
3.  **IDP** : Carence de raccordement entre rejets ponctuels et référentiel `infra.rejet_*`.
4.  **QUAL** : 148 alias de paramètres non normalisés (3 751 lignes orphelines).
5.  **HYDRO** : Débits négatifs persistants (1 931 cas) impactant les futurs modèles SWAT/WASP.
6.  **METEO** : 10 308 tuples NULL dans les séries de précipitations/évaporation.
7.  **QUAL** : Concentrations "NULL" saisies par le labo (3 579 cas).
8.  **IDP** : Scission inexpliquée de l'année 2024 en 4 tables distinctes.
9.  **INFRA** : Doublons nominaux sur les stations (14 cas) et barrages (Bouhouda).
10. **INFRA** : Entités sans nom (ID 34 barrage, 11 stations).
11. **QUAL** : Conflit de structure (8k vs 15k lignes) sur les réservoirs de production.
12. **API** : Risque de crash des dashboards si les débits < 0 ne sont pas filtrés par le Backend.
13. **METADATA** : Unités de mesure stockées dans les libellés et non dans une colonne typée.
14. **DATA** : Mélange de types (Mois en texte vs entier) dans certains historiques.
15. **PROD** : Nettoyages manuels en Prod non documentés (Pattern détecté via deltas).

### Risques Projet
- **Risque de régression** : Écraser les données "propres" de la Prod par les données "sales" de la Sandbox historique.
- **Risque d'intégrité** : Création de milliers de lignes de qualité orphelines (FK Violations).
- **Risque de performance** : Ingestion de 15k+ lignes vides (NULL) surchargant les calculs d'agrégation.

---

## 2. BLOCAGES PAR DOMAINE

### 🏛️ INFRASTRUCTURE & RÉFÉRENTIELS
Le socle géographique est instable pour les nouveaux lots (Qualité/IDP). Plusieurs entités pivots manquent à l'appel ou sont en conflit.
- **Points clés** : Garde Sebou, Doublons Bouhouda, Stations anonymes.

### 💧 HYDROLOGIE & GÉNIE CIVIL
Les flux de débits sont techniquement "prêts" mais physiquement "discutables".
- **Points clés** : Débits négatifs, Anomalies de capteurs.

### ☀️ MÉTÉOROLOGIE
Le problème majeur réside dans la continuité des chroniques.
- **Points clés** : Trous massifs (10k+ dates vides).

### 🧪 QUALITÉ DES EAUX & LABORATOIRES
C'est le domaine le plus critique actuellement.
- **Points clés** : Alias polymorphes, Updates conflictuels, Concentrations NULL.

### 🏭 POLLUTION PONCTUELLE (IDP)
Domaine en cours de structuration, souffrant d'un manque de lien avec l'Infra.
- **Points clés** : Liaison usine-rejet, Fragmentation 2024.

---

## 3. FICHES DÉTAILLÉES PAR BLOCAGE

### [BLOQ-INFRA-001] : L'énigme "Garde Sebou"
- **ID Unique** : `BLOQ-INFRA-001` (ref `ANO-LOT4A-001`)
- **Source** : `abh_sad.infra.stations_mesure` | Script : `lot4a3_barrages_dry_run.py`
- **Volumétrie** : 7 094 lignes de qualité impactées.
- **Description** : La table `mesures_suivi_qualite_brg_garde_hebdo` est orpheline d'ID station mais appartient métierment au barrage de Garde Sebou. Ce dernier est absent nominalement de la Prod.
- **Options de traitement** :
    - **A (Safe)** : Création manuelle de la station par script de patch.
    - **B (Interne)** : Utilisation d'un ID virtuel `99999` (simulé en dry-run).
- **Décision** : Client (ABH) / Métier.
- **Urgence** : Critique.

### [BLOQ-QUAL-002] : Conflit de Valeurs Barrages (Deltas Critiques)
- **ID Unique** : `BLOQ-QUAL-002`
- **Source** : `mesures_qualite_barrages` (Src) vs `qualite.mesure_qualite_barrage` (Tgt)
- **Volumétrie** : 609 lignes conflictuelles.
- **Exemple concret** : Station ID `5533ab49...`, Param `ph`, Date `2024-11-13` : Source=17.1, Prod=8.5.
- **Impact** : L'IDP ou le Dashboard affichera des valeurs fausses si on écrase.
- **Analyse Technique** : Patterns de division par 2 observés sur certains pH, suggérant une correction d'unité appliquée en Prod jadis.
- **Décision** : Équipe Data (Politique d'Upsert sélectif).
- **Urgence** : Élevée.

---

## 4. TABLEAU DE PRIORISATION

| Priorité | Blocage | Cible Décision | Complexité Tech |
|---|---|---|---|
| 🚨 **CRITIQUE** | `BLOQ-INFRA-001` (Garde Sebou) | Client ABH | Faible |
| 🚨 **CRITIQUE** | `BLOQ-QUAL-002` (Deltas Barrages) | Interne | Modérée |
| ⬆️ **ÉLEVÉ** | `BLOQ-QUAL-001` (148 Alias) | Client (Chimiste) | Faible (Mapping) |
| ⬆️ **ÉLEVÉ** | `BLOQ-IDP-001` (Orphelins IDP) | Client ABH | Élevée |
| ⬇️ **FAIBLE** | `BLOQ-IDP-002` (Doublons 2024) | Métier | Faible |
