# Accueil SAD

## Rôle

Vue exécutive DG sur l’état global du bassin.

## À afficher

- `IQGB`
- stations critiques
- stations sous surveillance
- pollutions actives
- alertes ouvertes
- dernière campagne
- `IFD`
- `ICD`
- `ICH`

## À ne pas afficher

- codes paramètres
- IDs stations
- payloads API
- détails QA internes

## Blocs recommandés

1. État global du bassin
2. Points critiques à traiter
3. Alertes et signaux faibles
4. Pollution prioritaire
5. Confiance des données
6. Recommandations immédiates

## Source fonctionnelle

- qualité réglementaire P0 existante
- carte métier P0
- backend propagation MVP V1
- analytics/hydro/observatory existants

## Proposition UX

- haut de page : 6 KPI max
- centre : carte synthèse bassin
- colonne droite : alertes et recommandations
- bas : tendances 30 jours / dernière campagne
