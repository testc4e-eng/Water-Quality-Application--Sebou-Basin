# Architecture cible

## Vue d'ensemble

Le moteur prediction cible s'insere dans la chaine suivante :

```text
Declaration Pollution
-> validation metier
-> historisation statut / acteurs / pieces
-> enrichissement spatial et contextuel
-> dataset prediction controle
-> moteur scoring / priorisation
-> restitution dashboard
-> decision humaine
-> eventuelle simulation propagation
```

## Entrees candidates

Les entrees minimales candidates sont :

- identifiant declaration ;
- date de declaration ;
- type de pollution ;
- support impacte ;
- source ou site associe ;
- localisation administrative et hydrographique ;
- gravite declaree ;
- statut courant ;
- historique de traitement ;
- existence de campagnes ou mesures liees ;
- proximités spatiales utiles ;
- contexte hydraulique ou topologique si qualifie.

## Sorties candidates

Les sorties minimales candidates sont :

- `risk_score` ;
- `priority_level` ;
- `impact_scope_hint` ;
- `recommended_next_action` ;
- `confidence_level` ;
- `explanation_summary`.

## Architecture logique

### 1. Couche metier

- capture de la declaration ;
- validation des champs ;
- pilotage du workflow ;
- tracabilite des decisions.

### 2. Couche data prep

- selection des declarations eligibles ;
- nettoyage des champs cibles ;
- jointures avec referentiels spatiaux ;
- construction de features temporelles, spatiales et metier ;
- exclusion des cas non qualifies.

### 3. Couche prediction

- baseline reglee par heuristiques ou scorecards ;
- modele tabulaire ulterieur si les donnees deviennent suffisantes ;
- execution en mode `assistive only`.

### 4. Couche restitution

- score visible dans la fiche declaration ;
- priorisation dans la liste des dossiers ;
- filtres par risque ;
- justification lisible pour l'utilisateur.

## Strategie MVP recommandee

Le MVP prediction doit commencer par une logique interpretable :

1. score de priorite base sur regles metier ponderee ;
2. enrichissement spatial simple ;
3. suggestion de recours a la propagation ;
4. aucune promesse de prediction physico-scientifique.

## Architecture a differer

Doivent rester hors MVP strict :

- modele ML officiel ;
- apprentissage continu automatise ;
- auto-decision sans validation humaine ;
- couplage fort SWAT/WASP ;
- predictions exposees comme certitude.

