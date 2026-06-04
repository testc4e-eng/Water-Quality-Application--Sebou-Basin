# Catalogue KPI SAD

## KPI prioritaires

### IQGB — Indice Qualité Global Bassin

- formule :
  - agrégation pondérée des statuts stations conformes / surveillance / critiques
- données :
  - qualité réglementaire station
- limites :
  - dépend de la couverture récente
- fréquence :
  - quotidien ou à chaque refresh de campagne récente

### IQS — Indice Qualité Station

- formule :
  - score station basé sur le paramètre le plus pénalisant et sa tendance
- données :
  - résultats qualité station
- limites :
  - sensible aux trous de données
- fréquence :
  - quotidien

### IFD — Indice Fraîcheur Données

- formule :
  - score décroissant selon âge de la dernière donnée utile
- données :
  - dates de mesures / campagnes
- limites :
  - dépend du rythme attendu par domaine
- fréquence :
  - temps réel applicatif

### ICD — Indice Confiance Données

- formule :
  - score basé sur couverture, complétude, validité et cohérence des sources
- données :
  - QA, couverture, non classifiables, fraîcheur
- limites :
  - composite, nécessite gouvernance claire
- fréquence :
  - quotidien

### ICH — Indice Confiance Hydraulique

- formule :
  - score basé sur statut topologique, composante, confiance de snap et état du moteur
- données :
  - réseau validé, propagation MVP, diagnostics snap
- limites :
  - non hydraulique scientifique
- fréquence :
  - temps réel applicatif

### IPP — Indice Pression Pollution

- formule :
  - score mixte pollution déclarée + intensité + proximité + propagation topologique
- données :
  - sites pollution, derniers résultats, propagation MVP
- limites :
  - ne doit pas être présenté comme un modèle scientifique
- fréquence :
  - quotidien

## KPI supplémentaires recommandés

- `IAR` — Indice Alertes Réseau
  - nombre et gravité d’alertes ouvertes
- `ISR` — Indice Sous-Bassin à Risque
  - agrégation critique par sous-bassin
- `IPA` — Indice Priorité Action
  - synthèse DG pour ordonnancer les actions

## Alertes intelligentes

- station critique nouvelle
- dégradation rapide station
- pollution active proche d’un axe sensible
- confiance données trop faible sur une zone critique
- propagation à snap faible mais risque élevé
