# Clôture backend MVP V1

## Endpoints disponibles

- `GET /api/v1/propagation/source-to-garde`
- `GET /api/v1/propagation/snap-diagnostic`
- `GET /api/v1/propagation/source-to-stations`
- `GET /api/v1/propagation/source-to-barrages`
- `GET /api/v1/propagation/source-to-exutoires`

## Tests passés

- `backend/tests/test_propagation_mvp.py`
- statut observé : `17 passed`
- validations Docker manuelles réalisées sur tous les endpoints MVP

## Limites métier

- moteur strictement topologique
- aucun temps hydraulique scientifique
- aucune dépendance SWAT/WASP
- pas de priorisation métier avancée des cibles
- les distances dépendent fortement du snapping au réseau validé

## Risques de snapping

- le snap source reste le premier facteur de qualité
- les snaps cibles stations et barrages peuvent être éloignés du réseau
- un `snap_confidence=LOW` n’empêche pas la réponse mais doit déclencher une prudence métier

## Recommandations frontend

- afficher systématiquement le diagnostic de snap source
- afficher le diagnostic de snap cible pour stations et barrages
- distinguer clairement :
  - garde fonctionnelle station `52`
  - barrages géographiques
  - exutoires topologiques
- signaler visuellement les résultats `LOW`
- éviter toute formulation laissant croire à un calcul hydraulique scientifique

## Statut final

- `BACKEND_MVP_V1_READY`
