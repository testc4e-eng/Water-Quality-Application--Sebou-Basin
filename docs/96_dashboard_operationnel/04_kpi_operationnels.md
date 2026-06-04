# KPI opérationnels

## Principe

Les KPI du home ne doivent pas être centrés sur les KPI techniques de confiance uniquement.

Ils doivent être centrés sur l'exploitation quotidienne.

## KPI Hero

### Barrages surveillés

- définition : nombre de barrages avec données journalières disponibles à la date la plus récente
- source : `api.v_hydro_barrage_param_journalier`
- statut actuel : calculable

### Stations Hydro

- définition : nombre de stations hydrologiques avec débit disponible sur la date la plus récente
- source : `api.v_hydro_debit_journalier_qa`
- statut actuel : calculable

### Stations Pluvio

- définition cible : nombre de stations pluie exploitables sur la date la plus récente
- source : `api.v_meteo_precipitation_journalier_qa`
- statut actuel : calculable mais typologie à consolider

### Stations Qualité

- définition : nombre de stations qualité journalières suivies
- source : `qualite.mesure_qualite_sebou`
- statut actuel : calculable = `6`

## KPI Situation du bassin

### Hydrologie

- débit moyen des stations actives
- nombre de stations en hausse
- nombre de stations en baisse

### Pluviométrie

- cumul moyen 24h
- cumul moyen 7 jours
- cumul moyen 30 jours

### Qualité

- stations bonne qualité
- stations sous surveillance
- stations critiques

## KPI secondaires utiles

- dernière mise à jour barrage
- dernière mise à jour hydro
- dernière mise à jour pluvio
- dernière mise à jour qualité

## KPI à reléguer hors hero

- `IQGB`
- `IFD`
- `ICD`
- `ICH`
- `IPP`
- `ISR`

Rôle recommandé :

- conserver ces KPI dans des blocs secondaires, DG ou qualité ;
- ne pas structurer le hero uniquement autour d'eux.

## Décision

Le home opérationnel doit être piloté d'abord par :

- volumes d'entités actives ;
- état quotidien ;
- alertes ;
- tendances courtes.

Les KPI techniques et transverses restent utiles, mais en **soutien**, pas en **centre**.
