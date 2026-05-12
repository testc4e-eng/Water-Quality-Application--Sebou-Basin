# Recommandations post-migration

## Production-ready

- oui pour :
  - debit hydro
  - precipitation
  - SWAT/WASP
- non pour :
  - barrage
  - referentiel final

## Dashboard-ready

- exploitable :
  - hydro debit
  - climat
  - modeles
- a reprendre :
  - barrage
  - qualite avec mapping parametres incomplet

## IA / LLM-ready

- bon socle sur :
  - schemas hydro debit
  - modeles SWAT/WASP
  - documentation de reference
- insuffisant tant que :
  - le referentiel canonique n'est pas unique
  - les aliases qualite ne sont pas consolides

## Suite recommandee

1. valider le referentiel canonique
2. executer le remodelage barrage avec backup
3. publier les vues de compatibilite API
4. publier les unites dashboard verrouillees pour barrage
5. mettre a jour la documentation maitresse apres bascule
