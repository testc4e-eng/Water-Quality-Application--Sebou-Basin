# Focus — dashboard Déclaration pollution

## Positionnement

Le futur besoin `Dashboard Déclaration pollution` doit être distingué de deux chantiers existants :

1. `Dashboard pollution` topologique et propagation ;
2. `Dashboard pollution campagnes` fondé sur les prélèvements et mesures.

La documentation montre déjà un socle utile pour un écran de déclaration, mais ce socle est dispersé.

## Ce qui existe déjà

### Côté pollution déclarée / inventaire

Sources documentaires utiles :

- `docs/70_dashboard_pollution/01_audit_existant.md`
- `docs/03_ai_knowledge_base/api_for_agents.md`
- `docs/dashboard_metier_p0/*`
- `docs/96_catalogue_metier_donnees_affichage/03_catalogue_supports.md`
- `docs/96_catalogue_metier_donnees_affichage/04_catalogue_sources_tables.md`

Constat :

- le projet dispose déjà d'un monde `IDP / sites pollution / inventaire / rejets / supports` ;
- il existe déjà des vues et endpoints cartographiques pour les sources de pollution déclarées ;
- la déclaration pollution n'est pas encore cadrée comme workflow métier complet.

### Côté campagnes pollution

Sources utiles :

- `docs/70_dashboard_pollution/02_analyse_donnees.md`
- `docs/70_dashboard_pollution/03_objectifs_metier.md`
- `docs/70_dashboard_pollution/04_propositions_ameliorations.md`
- `docs/70_dashboard_pollution/05_plan_implementation.md`
- `docs/70_dashboard_pollution/06_tests_et_validation.md`

Constat :

- les campagnes et prélèvements constituent un besoin distinct ;
- elles éclairent bien les dimensions `point`, `date`, `mesures`, `alertes`, `liens entités`.

### Côté sources / rejets / workflow

Sources utiles :

- `docs/36_nettoyage_idp_2024_securise/04_sources_pollution_idp_problematiques.md`
- `docs/96_catalogue_metier_donnees_affichage/02_catalogue_campagnes.md`
- `docs/96_catalogue_metier_donnees_affichage/06_regles_affichage_metier.md`
- `docs/114_data_admin_ingestion/03_data_class_registry.md`
- `docs/114_data_admin_ingestion/04_workflow_modification_controlee.md`
- `docs/114_data_admin_ingestion/05_workflow_ingestion_intelligente.md`

Constat :

- la brique workflow existe surtout côté ingestion/gouvernance ;
- le workflow métier propre à la déclaration pollution n'est pas encore figé dans un document maître dédié.

## Ce qui manque aujourd'hui

1. un document maître unique `dashboard_declaration_pollution`
2. un contrat fonctionnel séparant clairement :
   - déclaration source pollution ;
   - inventaire des rejets ;
   - campagnes de prélèvement ;
   - suivi topologique des impacts
3. une matrice métier structurée sur statuts, rôles, étapes et validations
4. un mapping clair entre champs métier et APIs/front
5. une stratégie d'export / rapport

## Plan de lecture de la future matrice métier

### 1. Colonnes métier

- identifiant déclaration
- source / rejet / site / support
- commune / bassin / sous-bassin
- type de pollution
- paramètres suivis
- date création / date campagne / date validation

### 2. Statuts

- brouillon
- soumis
- en contrôle
- validé
- rejeté
- archivé

### 3. Rôles utilisateurs

- saisie terrain
- expert métier
- valideur ABH
- data admin
- décideur consultation

### 4. Étapes du workflow

1. création
2. enrichissement
3. rattachement géographique
4. contrôle métier
5. validation
6. publication dashboard

### 5. Champs obligatoires

- site ou source
- type de rejet
- localisation
- date
- statut
- auteur / acteur
- pièces ou observations si exigées

### 6. Règles de validation

- cohérence géographique
- cohérence type de pollution / support
- complétude minimale
- statut compatible avec rôle
- absence de doublon logique

### 7. Affichage dashboard

- tuiles statut
- carte des déclarations
- tableau des dossiers
- fiche détail
- timeline de workflow
- alertes métier

### 8. Filtres

- période
- commune
- support
- type de pollution
- statut
- rôle / acteur
- présence d'anomalie ou d'alerte

### 9. Cartes

- sites déclarés
- rejets
- points de prélèvement liés
- couches métier associées
- impacts topologiques éventuels

### 10. Exports / rapports

- export liste des déclarations
- export détail déclaration
- export campagne liée
- rapport synthèse par commune / bassin / période

## Décision de préparation

Le futur dashboard Déclaration pollution doit être cadré comme une convergence entre :

- `70_dashboard_pollution` pour les campagnes ;
- `dashboard_metier_p0` et `map/*` pour la cartographie ;
- `114_data_admin_ingestion` pour les rôles, validations et workflows ;
- `96_catalogue_metier_donnees_affichage` pour la matrice supports/sources/campagnes.
