# Cadrage phase et positionnement

## Contexte

Le projet est en `PHASE 3 - FINALISATION MVP`.

Le chantier central reste `Declaration Pollution` :

1. analyse metier ;
2. workflow ;
3. conception `BD + API + Front` ;
4. implementation MVP ;
5. integration propagation ;
6. validation metier.

Le moteur prediction doit donc etre cadre comme une extension du workflow, pas comme un lot independant.

## Positionnement du moteur

Le moteur cible devra produire des sorties de type :

- score de risque sur une declaration ;
- priorisation des dossiers a traiter ;
- suggestion de zones d'impact probables ;
- orientation vers une simulation de propagation ;
- aide a la decision, jamais decision automatique.

## Ce que le moteur n'est pas a ce stade

Le moteur n'est pas encore :

- un modele scientifique valide ;
- une brique de preprod ;
- un module de decision automatique ;
- un remplacement du controle metier ;
- un substitut aux simulations SWAT/WASP ou au moteur de propagation.

## Decision de phase

Statut du chantier :

| Axe | Statut |
| --- | --- |
| Documentation de cadrage | A lancer maintenant |
| Conception fonctionnelle | A lancer maintenant |
| Conception technique | A lancer maintenant |
| Preparation dataset officiel | Bloque par prealables metier |
| Entrainement modele officiel | Hors phase active |
| Exposition frontend de prediction | Hors MVP strict |

## Principe de dependance

Le moteur prediction depend de quatre blocs amont :

1. declarations pollution structurees et historisees ;
2. referentiel spatial pollution fiable ;
3. workflow de validation metier stable ;
4. moteur propagation suffisamment interpretable pour servir de signal explicatif.

## Sortie attendue de ce dossier

La sortie de la phase 3 n'est pas un modele en production.

La sortie attendue est :

- un cadre metier clair ;
- une architecture cible defendable ;
- une feuille de route bornant ce qui est faisable en MVP et ce qui doit etre differe.

