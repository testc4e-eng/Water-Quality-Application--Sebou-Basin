# Bilan final — Sprint 2

| Champ | Valeur |
|---|---|
| Date | 2026-06-15 |
| Statut | `CLOTURE` |
| Version | Sprint 2.Final |

---

## 1. Objectifs du Sprint 2

1. Stabiliser la Carte Métier Analytique (`/dashboard-carto-metier`).
2. Industrialiser le Workspace Analytique avec graphiques multi-séries.
3. Fiabiliser l'API batch et le routage des séries temporelles.
4. Séparer strictement les familles de données Qualité ABH et Pollution IDP.
5. Valider la classification `TIME_SERIES` vs `POINT_MEASURE`.

---

## 2. Livrables

| Livrable | Statut | Preuve |
|---|---|---|
| Architecture sprint 2 | ✅ | `docs/50_architecture_sprint_2/` |
| Carte métier V1 | ✅ | `frontend/src/pages/DashboardCartoMetier.tsx` |
| Workspace analytique | ✅ | `frontend/src/components/analysis-workspace/` |
| Hotfix clusters | ✅ | `docs/54_validation_sprint_2_final/01_hotfix_clusters.md` |
| Hotfix crash thématique | ✅ | `docs/54_validation_sprint_2_final/02_hotfix_crash_thematique.md` |
| Hotfix plein écran | ✅ | `docs/54_validation_sprint_2_final/03_hotfix_plein_ecran.md` |
| Hotfix liste stations | ✅ | `docs/54_validation_sprint_2_final/04_hotfix_liste_stations.md` |
| Tests post-hotfix | ✅ | `docs/54_validation_sprint_2_final/05_tests_post_hotfix.md` |
| Hotfix widgets vides | ✅ | `docs/54_validation_sprint_2_final/06_hotfix_widgets_vides.md` |
| Hotfix drag & drop | ✅ | `docs/54_validation_sprint_2_final/07_hotfix_drag_drop.md` |
| Tests post-hotfix 2 | ✅ | `docs/54_validation_sprint_2_final/08_tests_post_hotfix_2.md` |
| Hotfix process + React RND | ✅ | `docs/54_validation_sprint_2_final/09_hotfix_process_react_rnd.md` |
| Tests post-hotfix 3 | ✅ | `docs/54_validation_sprint_2_final/12_tests_post_hotfix_3.md` |
| Hotfix React Query parsing | ✅ | `docs/54_validation_sprint_2_final/16_hotfix_react_query_parsing.md` |
| Hotfix Zustand null | ✅ | `docs/54_validation_sprint_2_final/17_hotfix_zustand_null.md` |
| Hotfix toolbar width | ✅ | `docs/54_validation_sprint_2_final/18_hotfix_toolbar_width.md` |
| Tests post-hotfix 4 | ✅ | `docs/54_validation_sprint_2_final/19_tests_post_hotfix_4.md` |
| Hotfix Recharts + matching | ✅ | `docs/54_validation_sprint_2_final/20_hotfix_5_recharts.md` |
| Assainissement données carte métier | ✅ | `docs/55_assainissement_donnees_carte_metier/` |
| Validation métier | ✅ | `docs/55_assainissement_donnees_carte_metier/08_validation_metier.md` |
| Build frontend | ✅ | `npm run build` OK |
| Dashboards DG/Qualité | ✅ | Non régressés |

---

## 3. Métriques finales

### Données Carte Métier

| Famille | Mesures | Points | Paramètres | Période |
|---|---:|---:|---|---|
| QUALITE_ABH | 182 136 | 362 | 100 | 1988 → 2026 |
| POLLUTION_IDP | 7 191 | 141 | 51 | 2024 → 2025 |

### Classification temporelle

- **Qualité ABH** : majoritairement `TIME_SERIES` (rivière, sebou, garde hebdo), mixte (nappe, barrage)
- **Pollution IDP** : **100 % `POINT_MEASURE`**

### Paramètres

- Paramètres communs aux deux familles : **34**
- Paramètres uniques Qualité ABH : **66**
- Paramètres uniques Pollution IDP : **37**

---

## 4. Décisions validées

| ID | Décision | Statut |
|---|---|---|
| D-01 | Séparation `QUALITE_ABH` ≠ `POLLUTION_IDP` | ✅ Validée |
| D-02 | Classification `TIME_SERIES` / `POINT_MEASURE` | ✅ Validée |
| D-03 | Seuil `measure_count >= 10 AND date_count >= 5` | ✅ Validée |
| D-04 | Pollution IDP toujours ponctuelle par nature métier | ✅ Validée |
| D-05 | GO Sprint 3 | ✅ Validé |

---

## 5. Problèmes résolus

1. Mélange Qualité ABH / Pollution IDP dans la carte métier.
2. Graphiques vides pour les données ponctuelles IDP.
3. Crash thématique / clusters / plein écran.
4. Widgets vides et matching batch incorrect.
5. Drag & drop, React Query parsing, Zustand null.

---

## 6. Dettes et points de vigilance

1. Le support `SOURCE_POLLUTION` (sites) n'a pas encore de provider de séries dédié dans `business_map_service.py`.
2. Les paramètres communs (34) nécessitent toujours une lecture attentive de la source métier dans l'interface.
3. La performance des vues matérialisées doit être surveillée lors de l'augmentation des volumes IDP.

---

## 7. Transition vers le Sprint 3

```text
VALIDATION_METIER = OK
GO_SPRINT_3 = OUI
```

Les chantiers prioritaires du Sprint 3 sont :

1. Corrélations multi-domaines (qualité × hydrologie × météo).
2. Exports PDF et CSV depuis le workspace.
3. Multi-cartes et comparaison de scénarios.
4. Consolidation des indicateurs DG.

---

*Document de clôture du Sprint 2 — généré le 2026-06-15.*
