# Synthèse exécutive DG - Audit d'avancement SAD Sebou

## 1. Position projet au 2026-06-01

### Taux d'avancement global estimé

**68%**

Ce taux ne mesure pas uniquement la production documentaire. Il reflète l'état **réellement observable** dans :

- la base et les schémas métier décrits dans `docs/00_SOURCE_OF_TRUTH_MASTER.md` ;
- les statuts consolidés de `docs/04_etat_avancement/00_project_global_status.md` ;
- les modules backend de `backend/app/` ;
- les routes et pages actives du frontend dans `frontend/src/App.tsx` ;
- les pipelines SQL/Python présents dans `database/` et `scripts/`.

### Lecture DG en une phrase

Le projet **n'est pas en retard sur le socle technique** et **la mission de structuration, migration, controle et qualification est realisee sur le coeur SAD** ; la mise en production metier complete reste conditionnee par quatre familles d'arbitrages et validations : **referentiels metier**, **validation finale IDP**, **validation scientifique SWAT/WASP**, **stabilisation preproduction des dashboards/API hors legacy**.

## 2. Ce qui est réellement terminé

- Socle web full-stack en place : React/Vite + FastAPI + PostgreSQL/PostGIS/Timescale.
- Base métier centrale existante et peuplée sur hydro, météo, qualité, pollution, sécurité, analytics.
- Authentification, gestion utilisateurs, habilitations nominatives, logs d'activité et modules admin disponibles.
- Migration historique considérée comme clôturée avec backlog résiduel.
- APIs spécialisées P0 qualité disponibles : `GET /api/v1/qualite/metaux`, `chimie-minerale`, `physicochimie`, `pollution-organique`.
- Route cartographique métier DEV disponible : `/dashboard-carto-metier`.
- Route pollution IDP DEV disponible : `/pollution-idp-dev`.
- Référentiel réglementaire qualité chargé en DEV avec seuils et moteur de classification.
- Ingestion température exécutée et commitée, avec 437889 lignes en cible métier.

## 3. Ce qui est partiellement terminé

- Dashboards métier : présents, mais coexistence legacy/P0 et couverture fonctionnelle encore inégale.
- API cartographique métier : prête en DEV, mais séries temporelles encore en placeholder P1.
- Pollution IDP : pipeline DEV structure et operationnel, avec preproduction conditionnee par validation metier sur les cas spatiaux ambigus et les doublons.
- Référentiel paramètres : largement avancé, mais encore dépendant d'arbitrages sur alias, unités et paramètres ambigus.
- Ingestion SWAT/WASP : outillage de contrôle et d'upload présent, mais industrialisation et statut officiel non acquis.
- Validation hydraulique : chantier ouvert, runtime stabilisé en mode topologique, mais direction hydraulique non validée.

## 4. Ce qui n'est pas terminé

- Usage officiel décisionnel de SWAT/WASP.
- Industrialisation de l'ingestion V1 en production.
- Mise en cohérence complète backend/frontend avec suppression de la dette `public.*`.
- Préproduction métier du bloc pollution IDP.
- Couverture complète du CPS sur reporting personnalisé, mobile-responsive démontré, et qualification production.
- Généralisation de dashboards P0 homogènes sur tous les domaines.

## 5. Comparaison avec le CPS initial

### Exigences bien couvertes

- architecture full web ;
- base de données centralisée ;
- sécurité, rôles, droits et traçabilité ;
- tableaux de bord interactifs ;
- cartographie thématique ;
- intégration de nombreuses données hydro, météo, qualité et pollution.

### Exigences couvertes seulement partiellement

- module d'intégration des modèles : présence technique, mais validation scientifique absente ;
- aide à la décision : présente en DEV/P0, pas encore stabilisée en production métier ;
- reporting/extractions multi-formats : partiellement visible, pas encore démontré comme couverture homogène ;
- maintenance/exploitation : préparée, mais pas encore démontrée sur un périmètre final stabilisé ;
- usage mobile-responsive : plausible techniquement, mais preuve projet insuffisante.

### Exigences encore ouvertes

- officialisation métier des scénarios et modèles ;
- décision DG/ABH sur ce qui entre en préproduction officielle ;
- fermeture des chantiers IDP, référentiel et hydraulique.

## 6. Risques majeurs pour la DG

- **Risque de confusion entre "démo DEV" et "module officiellement exploitable"**.
- **Risque d'arbitrages métier non pris** sur IDP, paramètres et réglementation, ce qui bloque la bascule.
- **Risque scientifique** si SWAT/WASP sont montrés comme décisionnels avant validation Reda/Anas.
- **Risque de dette technique** si les routes legacy `public.*` restent actives trop longtemps.
- **Risque de dispersion** si l'équipe ouvre de nouveaux chantiers avant de fermer les quatre blocages structurants.

## 7. Décisions DG attendues

1. Confirmer que les 90 prochains jours servent d'abord à **stabiliser et qualifier** l'existant, pas à étendre le périmètre.
2. Désigner un circuit court DG/métier/SIG pour trancher l'IDP spatial et les paramètres ambigus.
3. Interdire tout usage "officiel" de SWAT/WASP tant que Reda et Anas n'ont pas validé.
4. Valider un jalon de préproduction basé sur critères objectifs : API, dashboards, référentiels, QA, tests navigateur.

## 8. Priorités des 3 prochains mois

### Priorité 1

Fermer les arbitrages metier requis : IDP, dictionnaire parametres, referentiel reglementaire.

### Priorité 2

Passer les dashboards et API P0 de **DEV_READY** à **PREPROD_READY**.

### Priorité 3

Purger la dette legacy critique et cadrer clairement le périmètre officiel vs sandbox.

## 9. Avancement ML / prédiction pollution

### Faits vérifiés

- la documentation ML expérimentale a été créée et structurée dans `docs/105_ml_experiments/` ;
- un dataset expérimental figé est documenté avec hash, périmètre et reproductibilité ;
- un benchmark de **ML tabulaire** a été documenté pour la **prédiction hydrologique** à J+1 et J+7 ;
- les limites du **modèle temporel** sont explicitement documentées ;
- le besoin de **topologie hydrologique**, de **relations amont/aval** et de **features spatiales** est confirmé par les enseignements E1.3 et E1.4 ;
- la transition vers **Graph Snapshot** puis **Graph Analytics** est justifiée dans `05_ml_to_graph_transition.md` et `06_ml_roadmap.md`.

### Hypothèse de travail

Le signal observé sur le **ML tabulaire** peut être amélioré si le dataset évolue vers un **modèle spatio-temporel** intégrant la topologie hydrologique et les dépendances réseau.

### Décision documentaire

Le **ML expérimental** reste en statut `SANDBOX`, `RECHERCHE_APPLIQUEE` et `NON_PREPROD`. Le **ML tabulaire** n'est pas abandonné ; il est mis en attente scientifique comme étape intermédiaire avant **Graph Snapshot**.

### Prochaine étape

Engager la phase E1.5 **Graph Snapshot** avant tout nouveau modèle avancé de **prédiction pollution**.

### Lecture DG

La prédiction pollution est en phase de recherche appliquée. Les premiers tests ML ont montré l’intérêt de poursuivre, mais la fiabilité scientifique nécessite maintenant l’intégration de la topologie hydrologique via Graph Snapshot.

## 10. Message de pilotage

Le projet a **depasse le stade du prototype** et dispose d'un socle SAD avance. Les 90 prochains jours portent d'abord sur la **qualification metier, la preproduction et les validations client/scientifiques**, plus que sur un developpement de socle supplementaire.
