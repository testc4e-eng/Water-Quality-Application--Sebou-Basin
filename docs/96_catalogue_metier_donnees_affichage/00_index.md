# Catalogue métier données affichage

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | source de vérité métier et fonctionnelle |
| Périmètre | données affichées, dashboards, cartes, tableaux, graphiques, APIs, ingestion future, validation ABH |
| Source de vérité | Oui pour le catalogue métier d'affichage |
| Dernière mise à jour | 2026-05-14 |

## Objectif

Centraliser dans un seul référentiel documentaire :

- les paramètres métier ;
- leurs domaines et sous-domaines ;
- leurs supports spatiaux ;
- leurs campagnes ;
- leurs tables sources ;
- leurs vues SQL ;
- leurs endpoints API ;
- leurs règles d'affichage, UX et QA ;
- leurs priorités décisionnelles ;
- leur statut vis-à-vis du dashboard et de l'ingestion future.

## Périmètre

Le dossier couvre :

- météo ;
- hydrologie ;
- qualité de l'eau ;
- pollution / IDP ;
- bathymétrie / qualité barrage ;
- hydromorphologie / contexte station ;
- microbiologie ;
- organoleptique ;
- modélisation SWAT/WASP legacy ;
- dashboard décisionnel ABH test.

Le dossier ne couvre pas :

- les mutations BD ;
- la modification des routes API ;
- la modification du frontend ;
- la création ou la modification des vues SQL.

## Architecture documentaire

1. [01_catalogue_global_parametres](./01_catalogue_global_parametres.md)
2. [02_catalogue_campagnes](./02_catalogue_campagnes.md)
3. [03_catalogue_supports](./03_catalogue_supports.md)
4. [04_catalogue_sources_tables](./04_catalogue_sources_tables.md)
5. [05_catalogue_vues_api](./05_catalogue_vues_api.md)
6. [06_regles_affichage_metier](./06_regles_affichage_metier.md)
7. [07_priorisation_decisionnelle](./07_priorisation_decisionnelle.md)
8. [08_historique_vs_recent](./08_historique_vs_recent.md)
9. [09_checklist_validation_metier_finale](./09_checklist_validation_metier_finale.md)

## Logique métier centrale

- Les vues SQL spécialisées sont la couche d'exposition métier cible.
- Les vues dashboard globales restent des agrégateurs, pas des sources primaires.
- `MO` et `Mo` restent distincts.
- `FM` et `F_M_MES` restent hors restitution.
- `COULEUR`, `LARGEUR`, `PROFONDEUR` et plusieurs objets de contexte restent hors analytics ou consultation only.
- Les futures ingestions doivent s'aligner sur `metadata.referentiel_parametre_canonique.table_cible`, les alias validés et les statuts QA/GEO.

## Dépendances backend / frontend

### Backend

- Préfixe global observé : `/api/v1`
- Endpoints P0 réellement prêts : `/api/v1/qualite/metaux`, `/api/v1/qualite/chimie-minerale`, `/api/v1/qualite/physicochimie`, `/api/v1/qualite/pollution-organique`
- Les autres vues spécialisées sont documentées comme cibles mais pas toutes exposées en production observée

### Frontend

- Pilote actif : `/qualite/metaux`
- Observatoire V2 : chargement différé après clic `Afficher`
- Dashboard décisionnel test : `/decision-dashboard-test`
- Règle commune : aucun appel API initial pour les écrans spécialisés récents

## Roadmap future ingestion

1. ingestion qualité / référentiel / alias ;
2. ingestion pollution / IDP / GEO ;
3. ingestion météo / hydro incrémentale ;
4. ingestion SWAT / WASP versionnée ;
5. dashboards de contrôle ingestion et quarantaine.

## Statut global

- Readiness dashboard : `PARTIAL_READY`
- Readiness ingestion future : `GO_CONCEPTION`
- Référence métier centralisée : `READY_FOR_ABH_WORKSHOP`

## Garanties de ce chantier

- aucune modification BD ;
- aucune modification API ;
- aucune modification frontend ;
- aucune vue créée ;
- aucun update exécuté.
