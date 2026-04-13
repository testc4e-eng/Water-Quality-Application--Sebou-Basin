# Expertise Architecture & Urbanisation : Base de Données `abh_sad` (SAD Sebou)

Ce document constitue la référence officielle pour l'urbanisation, la gestion et l'exploitation de la base de données du **Système d'Aide à la Décision (SAD)** pour la qualité des eaux de surface du bassin du Sebou.

---

## 🏗️ 1. Vue d’ensemble de l’architecture BD

### Rôle Global
La base de données `abh_sad` centralise l'intelligence environnementale du Sebou. Elle n'est pas seulement un espace de stockage, mais un moteur de calcul analytique utilisant **PostGIS** pour la composante spatiale et **TimescaleDB** pour les séries temporelles.

### Domaines Métier Couverts
- **Référentiel Territorial** : Provinces, Communes, Bassins Versants.
- **Hydrologie** : Stations de jaugeage, débits des Oueds (Sebou, Inaouen), barrage IDR.
- **Qualité des Eaux** : Paramètres physico-chimiques (DBO5, Nitrates, Phosphore).
- **Météorologie** : Réseau de pluviomètres et thermomètres.

### États Final de l'Urbanisation (Post-Migration)
La base `abh_sad` est désormais **entièrement urbanisée** et structurée selon les domaines métiers.
- Le schéma **`public`** ne contient plus de tables de données, mais uniquement des **Vues de Compatibilité** pour les anciens scripts.
- Les schémas **`admin`, `geo`, `infra`, `hydro`, `meteo`, `qualite`, `security`, `api`** constituent le cœur de données actif.


---

## 📂 2. Inventaire technique détaillé

| Schéma | Objet | Type | Rôle Supposé | Criticité | Recommandation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`public`** | `stations_abhs` | Table | Legacy Station Ref | Haute | Decommissionner |
| **`infra`** | `station_mesure` | Table | **Cible Pivot** | Critique | Source de vérité active |
| **`hydro`** | `mesure_debit` | Hypertable | Time Series Débit | Critique | Activer compression |
| **`api`** | `v_station_dimension` | Vue | Enrichment Layer | Haute | Utiliser pour Backend |
| **`api`** | `ca_hydro_debit_day` | MatView | Daily Aggregates | Moyenne | Refresh périodique |

---

## 🗺️ 3. Cartographie métier de la donnée

### Domaine Référentiel Administratif (`admin`)
- **Tables** : `region`, `province`, `commune`.
- **Valeur** : Permet de répondre à "Quelle est la qualité des eaux sur le territoire de la Province de Fès ?".

### Domaine Infrastructures (`infra`)
- **Tables** : `station_mesure`, `barrage`, `step` (Stations d'Épuration).
- **Valeur** : Croisement entre pollution ponctuelle (STEP) et impact sur la rivière (Station en aval).

---

## ⚠️ 4. Architecture du Schéma `public` (Couche de Compatibilité)

Le schéma `public` a été entièrement urbanisé. Toutes les tables `*_abhs` ont été migrées physiquement vers les schémas métiers. 
Pour garantir la continuité de service des anciens composants, des **Vues de Redirection** (Compatibility Views) ont été établies.

**Doctrine d'utilisation** : 
- Tout nouveau développement **DOIT** pointer vers les schémas métiers (ex: `infra.huilerie`).
- L'utilisation de `public.*` est dépréciée et réservée à la maintenance des composants legacy.


---

## 📖 5. Dictionnaire de données (Extrait Expert)

### `hydro.mesure_debit` (Série Temporelle)
- **PK** : `(temps, station_id)` (Composite pour TimescaleDB).
- **Champs** : `valeur` (m3/s), `est_valide` (Boolean).
- **Fréquence** : 15 min ou Journalier selon le capteur.

### `infra.station_mesure` (SIG Pivot)
- **PK** : `UUID`.
- **Géom** : `GEOMETRY(Point, 4326)`.
- **Champs** : `code_station` (Identifiant métier UNIQUE).

---

## 🔗 6. Analyse des relations et du modèle logique

Le modèle suit une structure en **constellation** :
- **Stations (Pivot)** : Reliées aux mesures (1:N).
- **Bassins (Conteneurs)** : Intersectent géographiquement les stations (Lien Spatial `ST_Intersects`).
- **Catalogues (Référence)** : Typent les paramètres métiers.

---

## 🛡️ 7. Analyse de la qualité d’architecture

- **Séparation** : ✅ Excellente (Schémas métier).
- **Nommage** : ⚖️ Mixte (Legacy `_abhs` vs Cible `singular`).
- **Maintenabilité** : ✅ Haute grâce à la couche `api`.
- **Sécurité** : ⚠️ À renforcer (Passage à RLS en production).

---

## 🚀 8. Stratégie de Migration (Finalisée ✅)

L'urbanisation est passée par trois phases critiques :
1. **Phase A : Alignement Backend** : Mise à jour du `.env` pour cibler les schémas métiers.
2. **Phase B : Migration Physique** : Déplacement de 44 tables du schéma `public` vers `admin`, `geo`, `infra`, `hydro`, `meteo`, `qualite`.
3. **Phase C : Couche de Compatibilité** : Création de vues dans `public` pointant vers les nouvelles structures métier.


---

## 📋 9. Matrice de Migration Complétée

| Objet Source (`public`) | Schéma Cible | Objet Final | Statut |
| :--- | :--- | :--- | :--- |
| `stations_abhs` | `infra` | `station_mesure` | 🟢 Terminé |
| `mesures_debit_jr` | `hydro` | `mesure_debit` | 🟢 Terminé |
| `huileries_abhs` | `infra` | `huilerie` | 🟢 Terminé |
| `decharges_abhs` | `infra` | `decharge` | 🟢 Terminé |
| `rejets_ind_abhs` | `infra` | `rejet_industriel` | 🟢 Terminé |


---

## 🛠️ 10. Plan d’adaptation backend

- **Endpoints** : Tous les GET /stations doivent appeler `api.v_station_dimension`.
- **SQLAlchemy** : Définir explicitement `__table_args__ = {"schema": "hydro"}` dans les modèles de séries temporelles.

---

## 🎨 11. Plan d’adaptation frontend

- **Web Map** : Charger les GeoJSON via `api.v_station_geojson` pour inclure les métadonnées calculées (nom de bassin, organisme, etc.) sans jointures JS coûteuses.

---

## 🔒 13. Sécurité, rôles et traçabilité

- **Log d'audit** : Système actif sur `infra` pour tracer les ajouts de stations.
- **Accès** : Rôle `lecteur` restreint au schéma `api` pour l'isolation des données brutes.

---

## 📈 14. Performance et volumétrie

- **Aggregates Continus** : Les vues `api.ca_*` permettent d'afficher des graphiques annuels instantanément sur des millions de points.
- **Compression** : Taux de compression estimé à 90% pour les données de plus de 3 mois.

---

## 🏁 15. Recommandations Finales Priorisées

1. **Urgent** : Supprimer les tables doublons de `public` pour éviter les erreurs de saisie.
2. **Prochainement** : Standardiser tous les PK techniques en `UUID`.
3. **Moyen Terme** : Automatiser le refresh des vues matérialisées via `timescaledb_information`.
