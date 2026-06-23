# 1. Modèle AnalyticalSeries Final

Le socle de données doit permettre de superposer n'importe quelle série temporelle (Qualité, Hydro, Météo).
Le modèle `AnalyticalSeries` final à utiliser côté frontend et backend est défini comme suit :

```typescript
type AnalyticalSeries = {
  // Identifiant unique généré pour la série au sein du workspace
  id: string;
  
  // Méta-données de l'objet
  support_type: string;
  object_id: string;
  object_name: string;
  
  // Typologie de la donnée
  domain: string;
  subdomain?: string;
  parameter_code: string;
  parameter_label: string;
  unit?: string;
  
  // Paramètres temporels
  aggregation: "raw" | "daily" | "monthly" | "annual";
  date_from?: string;
  date_to?: string;
  
  // Les données de la série
  values: Array<{
    date: string;
    value: number | null;
    quality_flag?: string; // Optionnel : pour indiquer la fiabilité de la mesure
  }>;
  
  // Traçabilité et origine
  source?: {
    endpoint: string;
    table?: string;
    refreshed_at?: string;
  };
};
```
Ce modèle sera le contrat de retour principal du nouvel endpoint batch et le type manipulé par Zustand pour nourrir Recharts.
