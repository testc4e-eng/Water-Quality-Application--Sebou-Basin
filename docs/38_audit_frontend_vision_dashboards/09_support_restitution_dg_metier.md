# Restitution — Frontend SAD Sebou

## 1. Objectif

Vérifier si le frontend actuel reflète correctement la vision finale du SAD et identifier ce qui est prêt, ce qui manque et ce qui doit encore être présenté comme `en construction`.

## 2. Ce qui est déjà réalisé

- un accueil opérationnel moderne existe ;
- un dashboard qualité réglementaire existe ;
- un dashboard pollution existe ;
- une carte métier existe ;
- un socle d'administration et de gouvernance des données existe ;
- des moteurs backend KPI, alertes et recommandations existent.

## 3. Ce qui est visible dans le frontend

- les modules principaux sont déjà accessibles ;
- plusieurs écrans legacy ou pilotes restent encore visibles ;
- certains modules donnent une impression de disponibilité plus forte que leur niveau réel.

## 4. Ce qui est finalisé mais pas encore bien valorisé

- qualité réglementaire ;
- qualité / gouvernance des données ;
- administration / RBAC ;
- une partie du pilotage pollution ;
- les données stables stations et barrages, encore peu visibles comme objets métier.

## 5. Ce qui est en construction

- SWAT ;
- WASP ;
- prédiction pollution ;
- recommandations comme module autonome.

## 6. Ce qui dépend encore de l’équipe métier

- validation finale du référentiel réglementaire actif ;
- arbitrages restants sur pollution IDP ;
- validation scientifique SWAT ;
- validation scientifique WASP ;
- dictionnaire final des paramètres et des alias.

## 7. Dashboards proposés

- dashboard Qualité réglementaire ;
- dashboard Pollution ;
- dashboard Données / QA ;
- dashboard Administration / RBAC ;
- accueil DG enrichi avec statut projet et décisions attendues.

## 8. Plan de mise en œuvre

1. sécuriser les routes et masquer les modules non prêts ;
2. finaliser les dashboards déjà suffisamment mûrs ;
3. créer des écrans `en construction` honnêtes ;
4. compléter l’accueil DG ;
5. tester et faire valider par le métier.

## 9. Décisions attendues

- confirmer quels modules peuvent être montrés comme opérationnels ;
- confirmer le niveau d’exposition acceptable du module pollution ;
- confirmer la stratégie de présentation SWAT/WASP ;
- confirmer si le legacy ingestion doit être masqué ;
- confirmer les priorités DG pour l’accueil exécutif.

## 10. Prochaine étape

Passer à une phase d’implémentation contrôlée en commençant par :

- la sécurisation de la navigation ;
- la finalisation des dashboards qualité, pollution, QA data et administration ;
- l’ajout d’un statut clair pour les modules en construction.
