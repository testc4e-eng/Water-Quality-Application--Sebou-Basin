# Modèle de Séries Multi-Support

Afin d'éviter la prolifération de modèles distincts (climat, hydro, qualité, pollution), la carte métier doit se reposer sur une structure analytique agnostique.

## Modèle `AnalyticalSeries`

```ts
type AnalyticalSeries = {
  id: string;
  support_type: string;
  support_id: string;
  support_name: string;
  domain: string;
  subdomain?: string;
  parameter_code: string;
  parameter_label: string;
  unit?: string;
  date_from?: string;
  date_to?: string;
  aggregation: "raw" | "daily" | "monthly" | "annual";
  values: Array<{
    date: string;
    value: number | null;
    quality_flag?: string;
  }>;
};
```

Ce modèle devient le socle unique pour l'alimentation des graphes, des tableaux, des exports CSV et des analyses croisées multi-domaines (ex: comparaison débit, lâcher, qualité et pluviométrie).
