# Backlog - Home

## Priorite

`Critique`

## Objectif

Retablir un `Dashboard Home` demonstrable sans lancer de refonte.

## Perimetre

1. verifier la disponibilite de `/api/v1/dashboard/home` ;
2. verifier le contrat JSON reel renvoye par le backend ;
3. comparer ce contrat avec l'attendu frontend ;
4. identifier les appels secondaires qui peuvent casser le rendu global ;
5. verifier la strategie de fallback ;
6. corriger uniquement la cause racine.

## Critere de sortie

- affichage sans erreur ;
- KPI visibles ;
- aucun message d'echec ;
- plateforme demonstrable.
