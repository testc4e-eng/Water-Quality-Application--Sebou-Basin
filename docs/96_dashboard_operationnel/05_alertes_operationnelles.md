# Alertes opérationnelles

## Principe

Le centre d'alertes doit devenir un composant métier explicite du home.

## Types retenus

### `HYDRO`

Déclencheurs cibles :

- débit au-dessus d'un seuil ;
- débit au-dessous d'un seuil ;
- variation journalière anormale.

Source :

- `api.v_hydro_debit_journalier_qa`

Niveau :

- `INFO`
- `SURVEILLANCE`
- `CRITIQUE`

### `PLUVIO`

Déclencheurs cibles :

- pluie 24h intense ;
- cumul 7 jours anormalement élevé ;
- épisode sec prolongé.

Source :

- `api.v_meteo_precipitation_journalier_qa`
- plus tard `GPM` / `CHIRPS`

### `QUALITE`

Déclencheurs cibles :

- O2 dissous faible ;
- DBO5 élevée ;
- conductivité anormale ;
- station sans donnée récente.

Sources :

- `qualite.mesure_qualite_sebou`
- `qualite.mesure_qualite_riviere`
- moteur réglementaire existant

### `BARRAGE`

Déclencheurs cibles :

- baisse forte de niveau ;
- apport anormal ;
- lâcher exceptionnel ;
- absence de mise à jour.

Sources :

- `api.v_hydro_barrage_param_journalier`
- `api.v_barrage_dimension`

## Approche technique recommandée

### Option A — calcul à la volée

Avantages :

- simple ;
- pas de persistance ;
- rapide à lancer.

Limites :

- pas d'historique d'alerte ;
- pas de résolution manuelle ;
- pas de workflow.

### Option B — table persistée `analytics.alerts`

Structure proposée :

```sql
id
type
niveau
objet
message
date_creation
date_resolution
```

Avantages :

- historique ;
- résolution ;
- workflow.

Limites :

- nécessite un moteur de génération et de maintenance.

### Recommandation

Approche hybride :

1. Sprint court :
   - calcul d'alertes à la volée ;
2. Sprint suivant :
   - persistance dans `analytics.alerts` pour workflow et historisation.

## Affichage home

Le home doit montrer immédiatement :

- type ;
- niveau ;
- objet ;
- message ;
- action recommandée.
