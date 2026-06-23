# Synthèse passation projet SAD/WQDSS avant congé chef de projet

## Situation au 2026-06-23

Le projet n'est plus dans une logique de développement de nouveaux modules. Le socle existe. La vraie phase est :

```text
PHASE_ACTUELLE = STABILISATION_PREPROD + ASSAINISSEMENT_DONNEES_METIER
PROCHAINE_PHASE = CORRECTION_RUNTIME_CARTE_METIER + CORRECTION_RUNTIME_DASHBOARD_QUALITE + SEPARATION_TIME_SERIES_POINT_MEASURE
PREPROD_READY = NON
DEMO_DG_READY = NON
VALIDATION_METIER_READY = NON
CONFIANCE_GLOBALE = MOYENNE_FORTE
```

## Ce qui est déjà fait

- socle plateforme backend/frontend/API en place ;
- dashboards DG, Qualité, Pollution, QA, Administration implémentés ;
- Carte Métier Sprint 0 a Sprint 2 documentée et développée ;
- Workspace analytique présent ;
- Data Admin présent ;
- moteur de propagation pollution MVP présent ;
- dépôt réorganisé et validé sans casse structurelle ;
- build frontend OK ;
- backend SAD réel actif sur `http://localhost:8010/api/v1`.

## Priorités pendant l'absence

### P1 immédiat

1. corriger ou qualifier l'erreur runtime Carte Métier ;
2. corriger ou qualifier l'erreur runtime Dashboard Qualité ;
3. réduire la latence de `GET /api/v1/dashboard/home`.

### P1 fonctionnel

4. verrouiller la séparation `QUALITE_ABH != POLLUTION_IDP` ;
5. verrouiller la séparation `TIME_SERIES != POINT_MEASURE` ;
6. vérifier que le workspace affiche :
   - graphique pour `TIME_SERIES`
   - table / fiche pour `POINT_MEASURE`
   - jamais de graphique vide

### P2

7. préparer les validations métier D1, D2, D3 après stabilisation runtime.

## Vérifications réelles faites avant passation

- `docker compose ps` : `sad-backend` et `sad-frontend` sont `Up`
- `GET /api/v1/dashboard/home` : `200`, mais `41.6 s`
- `GET /api/v1/quality/regulatory-status` : `200`, `0.055 s`
- `GET /api/v1/quality/unified/stations` : `200`, `3.489 s`
- `GET /api/v1/business-map/availability` : `200`, `0.033 s`
- `GET /api/v1/business-map/features?limit=5` : `200`, `0.142 s`
- `POST /api/v1/business-map/analysis/series/batch` : `200`, `3.945 s`
- `npm run build` : `OK`

BD en lecture seule :

- `STATION_QUALITE`, `STATION_SENTINELLE`, `POINT_PRELEVEMENT_POLLUTION`, `SOURCE_POLLUTION` existent dans `api.mv_business_map_availability`
- `data_family` et `data_temporality` existent déjà dans la vue
- la séparation métier est visible en base, mais doit rester validée côté frontend/workspace

## Ce qu'il faut faire sur 5 jours

### Jour 1

- diagnostic runtime Carte Métier + Dashboard Qualité

### Jour 2

- correction courte des erreurs reproduites

### Jour 3

- audit ciblé `QUALITE_ABH / POLLUTION_IDP`

### Jour 4

- audit ciblé `TIME_SERIES / POINT_MEASURE`

### Jour 5

- synthèse, retests, liste des décisions à remonter

## Ce qu'il ne faut pas faire

```text
ne pas lancer Sprint 3
ne pas lancer SWAT/WASP officiel
ne pas lancer IA
ne pas faire de migration destructive
ne pas modifier les tables sources qualité
ne pas supprimer mesure_qualite_sebou
ne pas présenter la pollution comme scientifiquement validée
ne pas remettre /admin/ingestion en avant
ne pas réactiver pollution-idp-dev dans la navigation DG
```

## Décisions attendues

- D1 : arbitrages pollution IDP
- D2 : validation paramètres / noms métier
- D3 : validation réglementaire C3
- validation des 6 stations sentinelles
- validation du wording DG
- confirmation des règles `TIME_SERIES / POINT_MEASURE`

## Intervenants / rôles

- Chef de projet : pilotage, arbitrage, validation de reprise
- Développeuse déléguée : stabilisation runtime, audit technique court, synthèse
- Équipe métier : validations D1, D2, D3
- Reda : sujets hydro / SWAT si sollicité
- Anas : sujets WASP si sollicité
- Client / DG : validation wording, navigation, niveau d'exposition

Si un nom précis manque dans la documentation disponible :

```text
INFORMATION_NON_TROUVEE
```

## Statut délégation

La délégation est faisable si le périmètre reste strictement borné à la stabilisation P1 et à la préparation de validation métier.

```text
PRET_DELEGATION = OUI
```
