# Qualité des Eaux

## Objectif

Passer d’un écran de conformité technique à un écran d’aide à la décision qualité.

## À conserver

- dashboard qualité réglementaire P0
- endpoints `/api/v1/quality/*`
- vues spécialisées qualité

## À déplacer en mode expert

- nombre de seuils
- alias
- référentiels
- non-classifiables détaillés par code

## À afficher en premier

- stations conformes
- stations sous surveillance
- stations critiques
- évolution qualité
- anomalies
- centre d’alertes qualité

## Modules à construire

1. Vue synthèse qualité
2. Centre d’alertes qualité
3. Analyse temporelle
4. Comparaison stations

## Température

- `WATER_TEMPERATURE`
  - source : `T_EAU` dans les données qualité terrain si disponible
  - usage : corrélation qualité eau
- `AIR_TEMPERATURE`
  - source : météo stationnelle `meteo.mesure_temperature` / `api.v_meteo_temperature`
  - usage : contexte climat

Règle :

- ne jamais construire une corrélation qualité eau à partir d’une température de l’air
- ne jamais injecter une température eau dans un écran climat sans marquage explicite
