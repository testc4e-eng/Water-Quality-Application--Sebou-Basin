# Vision métier cartographique décisionnelle

## Contexte

Le besoin ABH n'est pas d'afficher toutes les données simultanément. Le besoin est d'accéder vite à l'état courant, à la fraîcheur, aux points critiques et à l'historique sans surcharger la carte.

## Analyse

Le frontend existant dispose déjà :

- d'un catalogue local observatoire V2 ;
- d'endpoints qualité spécialisés P0 ;
- d'une règle de chargement différé validée ;
- d'un dashboard legacy à préserver.

La vision décisionnelle cible doit donc s'appuyer sur ces briques sans réouvrir le chantier global frontend.

## Solution

### A. Vue décisionnelle

- Public : DG, cadres ABH.
- Intention : voir rapidement l'état récent du bassin.
- Données par défaut : récentes uniquement.
- Restitution : carte synthétique, KPIs, liste courte de points critiques.
- Règle métier : pas de chargement à l'ouverture ; action explicite requise.

### B. Vue analyse métier

- Public : ingénieurs, analystes.
- Intention : naviguer domaine > sous-domaine > paramètre.
- Restitution : carte, tableau, graphique.
- Filtres : période, support spatial, paramètre, limite.
- Règle métier : permettre les comparaisons sans polluer la vue DG.

### C. Vue campagne / archive

- Public : équipe technique.
- Intention : consulter séparément l'historique, les campagnes d'inventaire, les analyses finales, la bathymétrie et les futures campagnes capteurs.
- Restitution : modules distincts, jamais mélangés à la décision courante.
- Règle métier : modules non prêts affichés comme `à venir`.

## Améliorations optionnelles

- Ajouter un score de criticité métier cross-domaines.
- Définir des seuils ABH validés par paramètre et par support.
- Raccorder plus tard les campagnes pollution et IDP aux vues spécialisées dédiées.
