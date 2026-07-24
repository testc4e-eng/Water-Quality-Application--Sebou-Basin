# 05 — Plan d'implémentation Dashboard Pollution — Campagnes

---

## 1. Architecture cible

```
frontend/src/pages/DashboardPollutionCampagnes.tsx   # nouvelle page /dashboard-pollution-campagnes
├── CampagneSidebar.tsx                              # filtres date, commune, entité_type, paramètre
├── CampagnePrelevementMap.tsx                       # MapLibre — 141 points de prélèvement
├── CampagneList.tsx                                 # tableau des dates/campagnes
├── PrelevementDetail.tsx                            # drawer/modal fiche prélèvement
├── PrelevementMeasuresTable.tsx                     # tableau des 51 mesures
├── PollutionAlertPanel.tsx                          # alertes seuils
└── PrelevementEntityLink.tsx                        # liens entités d'inventaire

frontend/src/api/pollutionCampagnes.ts               # nouveaux appels API
frontend/src/hooks/usePollutionCampagnes.ts          # hooks React Query
frontend/src/types/pollutionCampagnes.ts             # types TypeScript

backend/app/api/v1/pollution_campagnes.py            # nouveau router FastAPI
backend/app/services/pollution_campagnes_service.py  # logique métier / requêtes SQL
backend/app/models/pollution_campagnes_models.py     # modèles Pydantic
```

> L'écran existant `DashboardPollution.tsx` (IDP) est **conservé tel quel**. La nouvelle page est ajoutée en parallèle.

---

## 2. API Backend nécessaire

| Méthode | Endpoint | Description | Source SQL |
|---------|----------|-------------|------------|
| GET | `/api/v1/pollution/campagnes` | Liste synthétique des campagnes/dates | `qualite.source_pollution_prelevement` |
| GET | `/api/v1/pollution/campagnes/{id}` | Détail d'une campagne/date | `qualite.source_pollution_prelevement` |
| GET | `/api/v1/pollution/prelevements` | Liste des prélèvements (filtrable) | `api.v_source_pollution_prelevement` |
| GET | `/api/v1/pollution/prelevements/{id}` | Détail d'un prélèvement + mesures | `qualite.source_pollution_prelevement` + `mesure_param` |
| GET | `/api/v1/pollution/prelevements/{id}/mesures` | Mesures d'un prélèvement | `qualite.source_pollution_mesure_param` |
| GET | `/api/v1/pollution/prelevements/{id}/liens` | Entités d'inventaire liées | `qualite.source_pollution_prelevement_lien` |
| GET | `/api/v1/pollution/alerts` | Dépasssements de seuils | `qualite.source_pollution_mesure_param` + seuils config |

### Modèles Pydantic à créer

- `PollutionCampagneSummary`
- `PollutionCampagneDetail`
- `PollutionPrelevementListItem`
- `PollutionPrelevementDetail`
- `PollutionMesure`
- `PollutionPrelevementLien`
- `PollutionAlert`

---

## 3. Composants frontend détaillés

### 3.1 `CampagnePrelevementMap.tsx`

- Réutilise `react-map-gl/maplibre` et le style CartoDB positron.
- Affiche un cercle par prélèvement.
- Couleur par date ou par statut d'alerte.
- Popup : `point_prelevement`, `commune`, `date_prelevement`, nature, lien fiche.

### 3.2 `CampagneList.tsx`

- Tableau avec pagination.
- Colonnes : date, point_prelevement, commune, nature, nb mesures, entité liée, indicateur alerte.
- Tri par date décroissante.
- Clic → ouverture fiche.

### 3.3 `PrelevementDetail.tsx`

- Drawer Shadcn/ui.
- En-tête : point, date, commune, nature, coordonnées.
- Section entités liées.
- Section observations / débit.
- Tableau des 51 mesures avec colonne valeur, unité, statut seuil.

### 3.4 `PollutionAlertPanel.tsx`

- Alimenté par `/api/v1/pollution/alerts`.
- Liste des mesures dépassant les seuils.
- Filtre par paramètre et campagne.
- Badge couleur selon sévérité.

---

## 4. Planning indicatif (4 semaines)

| Semaine | Tâches | Livrables |
|---------|--------|-----------|
| **W1** | Backend API + modèles Pydantic + tests endpoints | `/pollution/campagnes`, `/pollution/prelevements`, `/pollution/alerts` opérationnels |
| **W2** | Carte + tableau campagnes | `CampagnePrelevementMap.tsx`, `CampagneList.tsx`, hooks API |
| **W3** | Fiche prélèvement + alertes | `PrelevementDetail.tsx`, `PollutionAlertPanel.tsx`, liens entités |
| **W4** | Tests E2E, documentation, build, review métier | Captures, rapport, `npm run build` OK, validation métier des seuils |

---

## 5. Dépendances et risques

### Dépendances

- **FastAPI / SQLAlchemy** existants — aucun nouvel outil nécessaire.
- **MapLibre** déjà utilisé dans PollutionIdpMap.
- **Shadcn/ui** déjà intégré.
- **Seuils** : `frontend/src/config/thematiques.config.ts` peut servir de base ; idéalement les migrer vers une table backend plus tard.

### Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Unités métaux lourds mal interprétées | Faux positifs/négatifs d'alertes | Valider avec le métier avant prod ; afficher l'unité et le seuil utilisé |
| Valeurs `< LQ` non converties | 48 % de mesures sans valeur_num | Afficher `valeur_raw` et ignorer dans les calculs de moyenne si non numérique |
| Pas de table `campagnes` | Ambiguïté sur le regroupement | Utiliser `date_prelevement` comme granule, option regroupement par mois/année |
| Chevauchement avec Dashboard Pollution IDP | Confusion utilisateur | Nouvelle route `/dashboard-pollution-campagnes` + lien explicite depuis l'existant |
| Performance avec 141 points × 51 mesures | Négligeable | Pagination côté serveur, lazy loading de la fiche |

---

## 6. Recommandation d'implémentation

1. Créer la page `DashboardPollutionCampagnes.tsx` et la route `/dashboard-pollution-campagnes`.
2. Créer le router backend `pollution_campagnes.py` en lecture seule.
3. Réutiliser au maximum `PollutionIdpMap.tsx` comme modèle pour la carte.
4. Ne pas modifier `DashboardPollution.tsx` ni les endpoints `/pollution/*` existants.
5. Après implémentation, lancer `npm run build` et `python -m py_compile` sur les modules backend modifiés.
