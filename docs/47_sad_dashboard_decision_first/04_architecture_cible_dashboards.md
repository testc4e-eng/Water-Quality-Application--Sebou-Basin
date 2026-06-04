# Architecture cible dashboards

## Architecture cible

```text
Accueil SAD
  ├─ qualité globale bassin
  ├─ alertes
  ├─ priorités
  └─ recommandations

Qualité des Eaux
  ├─ état stations
  ├─ alertes qualité
  ├─ tendances
  └─ comparaison stations

Carte Métier
  ├─ vue bassin
  ├─ vue sous-bassin
  └─ vue station

Pollution
  ├─ pollutions déclarées
  ├─ propagation topologique
  ├─ simulation futur
  └─ recommandations futur

Analyses
  ├─ qualité
  ├─ pollution
  ├─ température eau
  ├─ hydrologie
  └─ tendances croisées

Expert
  ├─ qualité expert
  ├─ hydraulique expert
  └─ propagation expert

Administration
  ├─ ingestion
  ├─ monitoring
  ├─ QA
  └─ référentiels
```

## Dashboards à conserver

- `DashboardCartoMetier`
- `DashboardQualiteReglementaire`
- espaces admin existants

## Dashboards à fusionner

- `Dashboard2`
- `DashboardCartographique`
- `Observatoire V2`
- `DecisionDashboardTest`

## Dashboards à créer

- `Accueil SAD`
- `Pollution` refondu
- `Analyses`
- `Expert`
- `Administration` unifié en navigation métier

## Décision architecture

La cible n’est pas une refonte massive immédiate. La cible est une architecture par convergence :

1. conserver les briques P0 utiles ;
2. débrancher progressivement les écrans legacy de premier niveau ;
3. réorganiser la navigation selon la hiérarchie décisionnelle.
