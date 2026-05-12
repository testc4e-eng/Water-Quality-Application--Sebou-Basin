# Décision finale — meteo.mesure_precipitation

## Stratégie recommandée

**NE_RIEN_FAIRE**

## Justification

- la cible est déjà un miroir exact de `raw_mesures_precipitations_jr_traitees`
- aucune ligne manquante
- aucun conflit de valeur
- aucun doublon métier
- le blocage `E1.1` était un faux blocage issu d’une fusion de sources non pertinente
- la valeur métier par défaut pour les usages dashboard / cartographie / analytics est `val_remplies`

## Risque

**Faible** pour la table cible actuelle.

## Réserve

La source `raw_mesures_precipitations_jr` doit faire l’objet d’un arbitrage séparé :

- soit elle reste brute / historique
- soit on crée une table dédiée
- soit on définit une règle métier explicite pour reconstruire une série “observée brute” parallèle

## Règle métier intégrée

- `DASHBOARD_VALUE = val_remplies`
- `val_observees` et `val_power_nasa` restent visibles en détail avancé / QA uniquement
- aucun complément de migration n'est requis pour `meteo.mesure_precipitation`

## Décision finale

**METEO_PRECIPITATION_READY**
