# Risques et dépendances

## Dépendances API

- `/api/v1/map/*`
- `/api/v1/pollution/*`
- `/api/v1/propagation/*`
- `/api/v1/quality/*`
- `/api/v1/qualite/*`
- `/api/v1/hydro/*`
- `/api/v1/observatory/*`
- `api.v_meteo_temperature` si le chantier climat est activé

## Dépendances KPI

- `IQGB` : statut station consolidé
- `IFD` : fraîcheur par domaine
- `ICD` : complétude et cohérence inter-domaines
- `ICH` : snap + composante + statut moteur topologique
- `IPP` : pression pollution et atteignabilité aval
- `ISR` : agrégation géographique par sous-bassin

## Risques principaux

### Risques fonctionnels

- confusion entre information décisionnelle et information experte
- surcharge d'écrans avec trop de détails techniques
- confusion entre propagation MVP et hydraulique validée
- confusion entre `AIR_TEMPERATURE` et `WATER_TEMPERATURE`

### Risques techniques

- hétérogénéité entre routes legacy et routes P0/P1
- absence de certains agrégats backend KPI
- dette documentaire si les routes de convergence ne sont pas synchronisées

### Risques UX

- navigation trop lourde
- carte métier utilisée comme navigateur de couches
- pollution perçue comme simulation scientifique

## Mesures de réduction

- masquer systématiquement QA/debug au niveau DG
- imposer des libellés de prudence sur la propagation
- industrialiser progressivement les KPI côté backend
- séparer climat et qualité eau au niveau du design et des sources
