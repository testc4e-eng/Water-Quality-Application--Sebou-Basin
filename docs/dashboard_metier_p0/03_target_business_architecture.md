# Architecture cible dashboard cartographique metier P0

## Objectif

Fournir une page metier unique pour explorer supports geographiques, entites, parametres, resultats, classification reglementaire et historiques, sans remplacer les dashboards existants.

## Hierarchie metier cible

```text
Support geographique
  -> categorie
    -> sous-categorie
      -> domaine
        -> sous-domaine
          -> parametre
            -> affichage
```

## Organisation métier des supports P0

| Groupe | Support | Source cible P0 | Statut |
|---|---|---|
| Stations | forage | `api.v_station_dimension` filtre `type_station=forage` | P0 |
| Stations | puits | `api.v_station_dimension` filtre `type_station=puits` | P0 |
| Stations | point_prelevement | `api.v_source_pollution_prelevement` | P0 |
| Stations | barrage | `api.v_barrage_dimension` | P0 |
| Stations | pluvio | `api.v_station_dimension` filtre `type_station=pluviometrique` | P0 |
| Stations | source | `api.v_station_dimension` filtre `type_station=source` | P0 |
| Stations | hydro | `api.v_station_dimension` filtre `type_station=hydrologique` | P0 |
| Inventaire sources pollution | point_mesures | `api.v_pollution_sites` filtre sources IDP inventaire | P0 |
| Inventaire mesures pollution | point_prelevement | `api.v_pollution_sites` filtre sources IDP mesures | P0 |
| Reseau hydro | `/api/v1/layers/reseau_hydro_abhs` | P0 contexte |
| Sous-bassins | `/api/v1/layers/sous_bassin_sebou` | P0 contexte |

Les anciens supports techniques `idp_pollution`, `barrages`, `stations_qualite`, `step`, `rejets_industriels`, `rejets_domestiques` restent disponibles en compatibilité temporaire avec `legacy_support=true`.

## Parametres P0

- `DBO5`
- `DCO`
- `NH4`
- `NO3` / `NO3-` selon source
- `O2_DISS`
- `pH`
- `Cond` / conductivite

Regle : conserver les codes exacts source/canonique, ne pas appliquer de normalisation globale destructive.

## Backend cible

Nouveaux objets :

- `backend/app/api/v1/map.py`
- `backend/app/services/map_business_service.py`

Endpoints P0 :

| Endpoint | Role |
|---|---|
| `GET /api/v1/map/catalog` | catalogue groupes/supports métier |
| `GET /api/v1/map/entities` | GeoJSON d'entites filtrees par `group_code` + `support_code` ou support legacy |
| `GET /api/v1/map/entities/{id}` | fiche entite |
| `GET /api/v1/map/entities/{id}/parameters` | parametres disponibles |
| `GET /api/v1/map/latest-values` | dernieres valeurs par support/parametre |
| `GET /api/v1/map/layers` | couches contexte MapLibre |

Endpoints P1 :

- `GET /api/v1/map/entities/{id}/timeseries`
- `GET /api/v1/map/classification`

## Structure reponse GeoJSON cible

Chaque feature doit exposer :

- `entity_id`
- `entity_type`
- `support_type`
- `label`
- `commune`
- `province`
- `source_view`
- `latest_values`
- `classification`
- `qa_status`
- `data_status`

## Frontend cible

Nouveaux objets :

- `frontend/src/pages/DashboardCartoMetier.tsx`
- `frontend/src/api/mapBusiness.ts`
- `frontend/src/hooks/useMapBusiness.ts`
- `frontend/src/components/DashboardMetier/BusinessMap.tsx`
- `frontend/src/components/DashboardMetier/BusinessSidebar.tsx`
- `frontend/src/components/DashboardMetier/BusinessPopup.tsx`
- `frontend/src/components/DashboardMetier/BusinessLegend.tsx`
- `frontend/src/components/DashboardMetier/EntityDetailsPanel.tsx`

## Navigation UX

1. Choisir support : stations, barrages, STEP, rejets, IDP.
2. Choisir domaine/sous-domaine.
3. Choisir parametre si valeurs disponibles.
4. Cliquer `Afficher`.
5. Carte MapLibre charge les entites.
6. Clic entite : popup courte + panneau lateral details.
7. Si historique disponible : basculer vers timeseries P1.

## Strategie cache

- Frontend React Query : `staleTime` 60 s pour catalogues et couches.
- Backend : cache court possible plus tard pour catalogues statiques.
- Pas de materialized view nouvelle en P0 sans besoin mesure.

## Separation fonctionnelle

| Concept | Description |
|---|---|
| Support geographique | objet spatial affichable : station, barrage, STEP, rejet |
| Entite metier | instance avec identite et metadonnees |
| Parametre | grandeur mesuree ou suivie |
| Serie temporelle | valeurs historiques par entite/parametre |
| Classification | resultat reglementaire calcule ou non classifiable |
| QA | qualite donnees/geometrie/arbitrage |

## GO/NOGO implementation

GO P0 :

- creer API `/api/v1/map/catalog`;
- creer API `/api/v1/map/entities` pour IDP pollution + supports `layers`;
- creer page `/dashboard-carto-metier` isolee;
- reutiliser palette reglementaire existante.

NOGO P0 :

- fusionner catalogues existants;
- modifier `Dashboard2`;
- toucher aux arbitrages spatiaux;
- creer SQL destructif;
- charger ou modifier des donnees.
