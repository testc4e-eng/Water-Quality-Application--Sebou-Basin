# Home V2 tooltips métier

## Périmètre

Tooltips métier disponibles sur :

- `IQGB`
- `IFD`
- `ICD`
- `ICH`
- `IPP`
- `ISR`
- `Barrages suivis`
- `Données pluie disponibles`
- `Stations hydro actives`
- `Stations sentinelles qualité`

## Ajout spécifique de cette passe

Complément sur la zone `Confiance données` :

- `IFD`
- `ICD`
- `ICH`

Chaque tooltip expose :

- définition ;
- calcul simplifié ;
- source ;
- interprétation ;
- seuils.

## Support technique

- composant : `frontend/src/components/home-v2/KpiTooltip.tsx`
- catalogue : `frontend/src/lib/kpi-definitions.ts`
- rendu via Radix Tooltip + Portal

## Exemples

### IFD

- définition : niveau d’actualité des données utilisées par le SAD
- calcul : basé sur l’âge des dernières mesures disponibles
- source : `kpi/overview + fraîcheur des familles opérationnelles`
- interprétation : un score faible signale des données trop anciennes

### ICD

- définition : fiabilité globale des données exploitées
- calcul : complétude + cohérence + contrôles qualité
- source : `kpi/overview + contrôles qualité backend`

### ICH

- définition : confiance accordée au réseau hydrographique
- calcul : réseau validé + topologie corrigée + arbitrages clôturés
- source : `kpi/overview + réseau hydro validé`

## Règle d’usage

Les tooltips améliorent la lecture métier sans élargir le dashboard ni ajouter de bruit visuel permanent.
