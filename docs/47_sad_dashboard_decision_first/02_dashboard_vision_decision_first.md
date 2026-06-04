# Vision dashboard decision first

## Principe

Le SAD doit répondre à des questions de pilotage :

- que se passe-t-il sur le bassin ;
- où sont les risques ;
- quelles stations nécessitent une action ;
- quels sous-bassins se dégradent ;
- où sont les pollutions prioritaires ;
- quels sont les indicateurs de confiance ;
- quelles décisions doivent être prises.

## Ce que le SAD n’est plus

- une vitrine SIG
- un navigateur de couches
- une collection d’APIs
- un écran de métriques techniques

## Ce que le SAD devient

- un système d’aide à la décision orienté action
- un cockpit de bassin
- un outil de priorisation métier et DG
- une plateforme de lecture progressive :
  - vue exécutive
  - vue métier
  - vue expert
  - vue administration

## Principes de conception

- `DECISION_FIRST`
  - afficher les décisions avant les détails
- `METIER_FIRST`
  - organiser les écrans par enjeux métier, pas par structures techniques
- `DG_FIRST`
  - rendre visible l’état du bassin en moins de 30 secondes
- `USER_EXPERIENCE_FIRST`
  - réduire la charge cognitive
  - masquer les détails techniques hors contexte expert

## Décision structurante

Le SAD doit être réorganisé autour de 7 espaces :

1. Accueil SAD
2. Qualité des Eaux
3. Carte Métier
4. Pollution
5. Analyses
6. Expert
7. Administration
