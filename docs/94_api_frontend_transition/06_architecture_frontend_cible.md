# Architecture frontend cible

## Structure cible

```text
frontend/src/
  api/
    client.ts
    meteo.ts
    hydro.ts
    qualite.ts
    pollution.ts
    idp.ts
    exposureCatalog.ts
  services/
  hooks/
    useMeteoSeries.ts
    useQualiteFamily.ts
    usePollutionPoints.ts
  components/
    domain/
      Meteo/
      Hydro/
      Qualite/
      Pollution/
      IDP/
    shared/
      DataTable/
      TimeSeriesChart/
      MapPanel/
      FilterBar/
  pages/
  layouts/
  store/
  map/
  charts/
  filters/
  types/
  utils/
```

## Principes

- Un client API unique basé sur `/api/v1`.
- Un module API par domaine métier.
- Les composants n'appellent jamais Axios directement.
- Les dashboards consomment les endpoints spécialisés, pas les tables ni `raw`.
- Les vues globales sont composées côté frontend ou via MVs futures, pas utilisées comme source primaire.

## Gestion cache

Recommandation : introduire React Query pour :

- cache des listes de paramètres/supports ;
- invalidation par filtres ;
- états loading/error standardisés ;
- pagination serveur.

Zustand peut rester utile pour :

- état global filtres carte ;
- couches actives ;
- sélection entité ;
- préférences utilisateur.

## Cartographie

- MapLibre reste le moteur recommandé.
- Les couches géographiques continuent via `/layers/*`.
- Les mesures thématiques utilisent endpoints spécialisés latest/series.
- Les points IDP non résolus doivent avoir une couche dédiée avec `geo_status`.

## Graphiques

Composants réutilisables :

- `TimeSeriesChart`
- `ParameterComparisonChart`
- `DistributionBoxplot`
- `ThresholdBandChart`

Règles :

- `COULEUR` exclu des graphiques quantitatifs.
- `LARGEUR` et `PROFONDEUR` affichés en fiche/contexte.
- `FM` et `F_M_MES` invisibles hors admin/quarantaine.

## Filtres

Filtres partagés :

- période ;
- support ;
- paramètre ;
- famille ;
- QA ;
- GEO ;
- scénario futur.

## Migration technique

1. Créer les modules API spécialisés.
2. Créer les hooks lecture seule.
3. Migrer un écran pilote : qualité métaux ou météo précipitation.
4. Remplacer progressivement les usages legacy.
5. Garder un fallback legacy tant que les écrans ne sont pas validés.
