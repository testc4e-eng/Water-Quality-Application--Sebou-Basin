# Synthèse de Migration : Schéma `public` vers Schémas Métiers

Ce document détaille l'état des lieux, la cartographie et la stratégie de migration des 44 tables legacy identifiées dans le schéma `public` de la base `abh_sad`.

---

## 📊 État des Lieux Global

| Domaine | Total Tables | Statut Migration | Cible |
| :--- | :---: | :--- | :--- |
| **Administratif** | 6 | 🟠 Partiel | `admin.*` |
| **SIG / Ressources** | 5 | 🟠 Partiel | `geo.*` |
| **Infrastructure / Pollution**| 13 | 🔴 À Faire | `infra.*` |
| **Hydrologie / Séries** | 6 | 🟢 Ok (Pivot) | `hydro.*` |
| **Météorologie** | 4 | 🟢 Ok (Pivot) | `meteo.*` |
| **Qualité des Eaux** | 5 | 🟢 Ok (Pivot) | `qualite.*` |
| **Technique/Système** | 5 | ⚪ Conserver | `public` / `security` |

---

## 🗺️ Matrice de Migration Détaillée

| Table Source (`public`) | Volumétrie | Schéma Cible | Objet Cible | Action / Statut |
| :--- | :--- | :--- | :--- | :--- |
| `stations_abhs` | 390 | **`infra`** | `station_mesure` | 🟢 Migré |
| `mesures_debit_jr` | 521 433 | **`hydro`** | `mesure_debit` | 🟢 Migré |
| `huileries_abhs` | 612 | **`infra`** | `huilerie` | 🔴 À Migrer |
| `decharges_abhs` | 233 | **`infra`** | `decharge` | 🔴 À Migrer |
| `rejets_ind_abhs` | 11 | **`infra`** | `source_pollution` | 🔴 À Migrer |
| `nappes_abhs` | 17 | **`geo`** | `nappe` | 🔴 À Migrer |
| `adm_communes_abhs` | 346 | **`admin`** | `commune` | 🟠 À Aligner |
| `bathymetries_barrages_abhs` | 62 359 | **`hydro`** | `barrage_bathymetrie` | 🔴 À Migrer |

---

## 🛠️ Stratégie de Structuration Professionnelle

### 1. Refactoring des Noms
- Suppression des suffixes `_abhs` pour les tables métier (ex: `huileries_abhs` -> `infra.huilerie`).
- Passage au singulier pour le stockage (Standard SQL moderne).

### 2. Exploitation dans la Plateforme
- **Backend** : Mise à jour des modèles SQLAlchemy pour pointer vers les schémas métier.
- **Vues API** : Création de couches d'abstraction dans le schéma `api` pour joindre les pollutions (`huileries`, `decharges`) aux territoires (`provinces`).
- **Compatibilité** : Maintien de vues "fantômes" dans `public` pendant 1 mois pour assurer la transition des anciens scripts.

### 3. Étapes de Mise en Œuvre
1. **Validation Technique** : Vérification des index spatiaux (`GIST`) sur les nouvelles tables migrées.
2. **Scripts SQL** : Exécution des commandes `ALTER TABLE ... SET SCHEMA ...`.
3. **Tests de Bout en Bout** : Validation de l'affichage des points de pollution sur la carte du dashboard.

---
*Document conçu pour servir de roadmap de migration technique et métier.*
