# Documents clôturés ou historiques

## Principe

Ces documents ne doivent plus piloter la phase actuelle. Ils restent utiles :

- comme preuve historique ;
- comme mémoire d'arbitrage ;
- comme base d'explication métier ;
- comme contexte de migration ou de dette.

Ils ne doivent plus être lus comme backlog actif principal.

## Dossiers à reclasser comme historiques

### Anomalies et arbitrages anciens

- `docs/33_annexes_anomalies_detaillees/`
- `docs/34_synthese_strategique_anomalies/`
- `docs/35_donnees_problematiques_par_bloc/`
- `docs/36_nettoyage_idp_2024_securise/`

Décision :

- conserver pour traçabilité ;
- référencer explicitement comme `historique clôturé` ;
- ne plus les présenter comme phase active.

## Dossiers de préfiguration devenus partiellement dépassés

### Transition API/frontend

- `docs/94_api_frontend_transition/`

Utilité restante :

- historique des contrats standard ;
- lecture des choix de coexistence legacy/P0 ;
- compréhension des premières APIs spécialisées.

Limite :

- plusieurs décisions sont déjà absorbées dans le code et dans `03_ai_knowledge_base`.

Décision :

- conserver ;
- référencer comme `fondation historique` ;
- mettre à jour uniquement les documents encore cités comme actifs.

### Dashboard décisionnel ABH

- `docs/95_dashboard_decisionnel_abh/`

Utilité restante :

- vision UX/métier ;
- personas ;
- règles de fraîcheur et chargement différé.

Limite :

- le projet a depuis convergé vers `Home V2`, `Carte Métier`, `Qualité`, `Pollution`.

Décision :

- référencer comme précurseur ;
- ne pas utiliser comme feuille de route principale.

### Topologie pollution anciennes phases

Sous-dossiers surtout historiques :

- `docs/pollution_dashboard/10_topologie_reseau_hydro/`
- `docs/pollution_dashboard/11_reconnexion_topologique/`
- `docs/pollution_dashboard/12_reconstruction_topologique_reelle/`
- `docs/pollution_dashboard/13_normalisation_post_nodification/`

Utilité restante :

- preuves de reconstruction réseau ;
- logique de QA topologique ;
- contexte technique du moteur propagation.

Limite :

- la phase active est maintenant la stabilisation runtime et l'usage dashboard, pas la reconstruction du réseau.

Décision :

- conserver ;
- référencer comme historique technique ;
- basculer la priorité vers `docs/110_*` et `docs/pollution_dashboard/14_runtime_stabilization/`.

## Documents déjà explicitement archivés

- `docs/33_annexes_anomalies_detaillees/A10_temperature_non_disponible.md`

Décision :

- ne pas réactiver ;
- garder comme archive résolue.

## Contradictions à corriger dans la documentation

1. Tout document qui laisse entendre que les anomalies sont encore le chantier principal.
2. Tout document qui traite `IDP` comme blocage central alors que `C1-B` est clôturé.
3. Tout document qui présente `dashboard pollution campagnes` comme non démarré alors que des fichiers front/back existent déjà.
4. Tout document qui décrit le Home comme simple cible de conception alors qu'il est implémenté, testé et en validation finale.

## Recommandation documentaire

- ajouter un bandeau `historique clôturé` dans les dossiers `33`, `34`, `35`, `36`
- ajouter un bandeau `préfiguration historique` dans `94`, `95`
- distinguer dans `pollution_dashboard` :
  - historique topologique ;
  - runtime stabilisé ;
  - consommation dashboard actuelle
