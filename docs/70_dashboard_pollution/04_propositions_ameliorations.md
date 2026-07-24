# 04 — Propositions d'améliorations priorisées

> Liste des améliorations proposées pour le Dashboard Pollution — Campagnes de prélèvement.

---

## 1. Carte des points de prélèvement de campagne

| | |
|---|---|
| **Objectif** | Visualiser les 141 prélèvements sur le bassin |
| **Composant** | `CampagnePrelevementMap.tsx` (MapLibre, réutilisation du style PollutionIdpMap) |
| **Fonctionnalités** | Points colorés par date/campagne, popup avec point_prelevement, commune, nature, lien vers fiche |
| **Filtres** | Date de prélèvement, commune, entité_type lié, paramètre |
| **Complexité** | Moyenne |
| **Valeur métier** | Élevée |
| **MVP** | ✅ Oui |

---

## 2. Tableau des campagnes / dates de prélèvement

| | |
|---|---|
| **Objectif** | Naviguer dans les 141 prélèvements et identifier les phases de campagne |
| **Composant** | `CampagneList.tsx` |
| **Fonctionnalités** | Liste groupée par date ou campagne, nb de points, nb de communes, nb de mesures, indicateur d'alerte |
| **Filtres** | Année, mois, commune, entité_type lié |
| **Complexité** | Faible |
| **Valeur métier** | Élevée |
| **MVP** | ✅ Oui |

---

## 3. Fiche détail d'un prélèvement

| | |
|---|---|
| **Objectif** | Consulter les 51 mesures et les métadonnées d'un prélèvement |
| **Composant** | `PrelevementDetail.tsx` (Drawer ou Modal) |
| **Contenu** | Localisation, date, point_prelevement, nature, observation, débit, entité(s) liée(s), tableau des mesures, alertes seuils |
| **Complexité** | Moyenne |
| **Valeur métier** | Élevée |
| **MVP** | ✅ Oui |

---

## 4. Panneau d'alertes seuils

| | |
|---|---|
| **Objectif** | Détecter les dépassements réglementaires (métaux lourds et paramètres organiques) |
| **Composant** | `PollutionAlertPanel.tsx` |
| **Seuils candidats** | Depuis `thematiques.config.ts` : Cd≤2, Pb≤5, Hg≤0.05, CrT≤20 (unités à valider) ; DBO5≤3/10, MES≤20/100, NH4≤0.5/2 |
| **Fonctionnalités** | Badge rouge sur point dépassant, liste des dépassements, filtre par paramètre |
| **Complexité** | Moyenne |
| **Valeur métier** | Très élevée |
| **MVP** | ✅ Oui (première version avec seuils config, à valider métier) |

---

## 5. Tableau comparatif campagnes

| | |
|---|---|
| **Objectif** | Comparer les concentrations moyennes/max entre 2024 et 2025 |
| **Composant** | `CampagneComparisonTable.tsx` |
| **Colonnes** | Campagne, nb points, nb communes, Cd moy/max, Pb moy/max, DBO5 moy/max, MES moy/max, NH4 moy/max, % dépassements |
| **Complexité** | Moyenne |
| **Valeur métier** | Moyenne |
| **MVP** | ❌ Non (W2/W3 si priorisé) |

---

## 6. Export rapport PDF de campagne

| | |
|---|---|
| **Objectif** | Générer un rapport PDF pour DG / autorités |
| **Composant** | `ExportCampagnePDF.tsx` |
| **Technologie** | Backend ReportLab ou frontend jsPDF/html2canvas |
| **Contenu** | Carte, tableau des mesures, alertes, métadonnées |
| **Complexité** | Moyenne/Élevée |
| **Valeur métier** | Moyenne |
| **MVP** | ❌ Non (reporté) |

---

## 7. Lien vers les entités d'inventaire pollution

| | |
|---|---|
| **Objectif** | Afficher le contexte du prélèvement (rejet domestique, abattoir, step, huilerie) |
| **Composant** | `PrelevementEntityLink.tsx` |
| **Source** | `qualite.source_pollution_prelevement_lien` |
| **Complexité** | Faible |
| **Valeur métier** | Élevée |
| **MVP** | ✅ Oui (affichage simple dans la fiche) |

---

## Synthèse MVP vs non-MVP

| Amélioration | MVP |
|--------------|-----|
| Carte des points de prélèvement | ✅ |
| Tableau campagnes/dates | ✅ |
| Fiche prélèvement | ✅ |
| Alertes seuils | ✅ |
| Lien entités d'inventaire | ✅ |
| Tableau comparatif campagnes | ❌ |
| Export PDF | ❌ |
| Corrélation pollution-qualité | ✅ Déjà dans Carte Métier |
