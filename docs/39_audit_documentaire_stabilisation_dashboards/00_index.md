# Audit documentaire - Repositionnement projet SAD Sebou / WQDSS

## Finalite

Ce dossier repositionne le projet sur sa phase reelle : la `finalisation_du_mvp`.

Il ne faut plus piloter le projet comme si la priorite active etait une stabilisation globale de la plateforme.

La stabilisation complete reste necessaire, mais elle doit intervenir apres la completion du `MVP metier`, sauf pour les blocages critiques qui empechent la demonstration du produit.

## Phase projet corrigee

```text
PHASE 0  Conception                                Cloturee
PHASE 1  Migration et structuration des donnees    Cloturee
PHASE 2  Qualification et arbitrages metier        Cloturee
PHASE 3  Finalisation du MVP                       En cours
PHASE 4  Stabilisation plateforme                  A venir
PHASE 5  Validation metier finale / preprod        A venir
PHASE 6  Deploiement                               A venir
```

## Lecture de la phase active

Le bon niveau de pilotage est maintenant :

```text
FINALISATION_MVP

P0  Corriger le Dashboard Accueil
P1  Concevoir et implementer le Dashboard Declaration de Pollution
P2  Analyser et integrer la matrice metier
P3  Valider le workflow metier complet
P4  Connecter le moteur de propagation
P5  Demonstration MVP complete
```

## Livrables de ce dossier

1. `01_lecture_globale_phase_actuelle.md`
2. `02_analyse_fichier_par_fichier.md`
3. `03_documents_clotures_ou_historiques.md`
4. `04_documents_actifs_pour_stabilisation_dashboards.md`
5. `05_cartographie_dashboards_et_api.md`
6. `06_points_blocage_front_back.md`
7. `07_focus_dashboard_declaration_pollution.md`
8. `08_plan_action_dashboard_par_dashboard.md`
9. `09_mises_a_jour_documentaires_recommandees.md`
10. `10_cartographie_fonctionnelle_plateforme.md`

## Documents operationnels complementaires

Le dossier suivant complete cet audit pour le pilotage quotidien :

- `docs/40_registre_stabilisation/00_index.md`
- `docs/40_registre_stabilisation/01_registre_bugs.md`
- `docs/40_registre_stabilisation/02_matrice_dependances.md`
- `docs/40_registre_stabilisation/03_backlog_home.md`
- `docs/40_registre_stabilisation/04_backlog_carte.md`
- `docs/40_registre_stabilisation/05_backlog_qualite.md`
- `docs/40_registre_stabilisation/06_backlog_pollution.md`
- `docs/40_registre_stabilisation/07_backlog_administration.md`

## Point de pilotage

La priorite immediate reste :
1. retablir le `Dashboard Home` pour rendre la plateforme demonstrable ;
2. basculer ensuite sur le chantier central `Declaration Pollution` ;
3. repousser la stabilisation globale aux corrections strictement bloquantes jusqu'a completion du MVP.
