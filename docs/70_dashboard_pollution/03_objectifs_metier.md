# 03 — Objectifs métier du Dashboard Pollution — Campagnes

Les objectifs ci-dessous sont déduits de l'audit des données et de l'écart constaté avec l'écran existant.

---

## Objectifs identifiés

| # | Objectif | Justification | Priorité |
|---|----------|-------------|----------|
| 1 | **Visualiser les points de prélèvement de campagne sur une carte** | 141 prélèvements, 100 % géolocalisés, répartis sur 81 communes | 🔴 Critique |
| 2 | **Lister et filtrer les campagnes / dates de prélèvement** | Deux phases distinctes (sept. 2024 et oct.-déc. 2025) ; besoin de navigation temporelle | 🔴 Critique |
| 3 | **Afficher la fiche détail d'un prélèvement** | Chaque prélèvement contient 51 mesures + localisation + observations | 🔴 Critique |
| 4 | **Mettre en évidence les dépassements de seuils réglementaires** | Métaux lourds (Cd, Pb, Hg, Cr) + paramètres organiques (DBO5, DCO, MES, NH4) | 🔴 Critique |
| 5 | **Comparer les campagnes entre elles** | Identifier l'évolution des concentrations entre 2024 et 2025 | 🟡 Important |
| 6 | **Exporter un rapport de campagne** | Besoin DG / autorités : carte + tableau + alertes | 🟡 Important |
| 7 | **Relier les prélèvements aux entités d'inventaire pollution** | 82 % des prélèvements sont rattachés à un rejet, step, huilerie, etc. | 🟡 Important |
| 8 | **Corréler pollution et qualité des eaux** | Déjà couvert par la Carte Métier (Sprint 3) | ✅ Fait |

---

## Hypothèses à valider avec le métier

Avant de passer à l'implémentation, les points suivants doivent être confirmés :

1. **Définition d'une campagne** : une campagne = une date de prélèvement ? un regroupement de dates (sept. 2024 = IDP_GLOBALE_2024, oct.-déc. 2025 = IDP_MARCHE_CADRE_2024) ?
2. **Seuils réglementaires** : les seuils du fichier `thematiques.config.ts` sont-ils ceux applicables aux rejets de pollution ?
3. **Unités des métaux lourds** : les valeurs brutes sont en mg/L ; les seuils sont-ils en µg/L (nécessitant un facteur ×1000) ?
4. **Valeurs `< LQ`** : comment les afficher et les traiter dans les alertes (ignorer, remplacer par la LQ, marquer comme "non détecté") ?
5. **Paramètres à mettre en avant** : faut-il afficher les 51 paramètres ou se concentrer sur un sous-ensemble métier ?

---

## Priorisation finale

**MVP (à implémenter en 4 semaines) :**

1. Carte des points de prélèvement de campagne
2. Tableau des campagnes / dates
3. Fiche prélèvement avec alertes seuils

**Non-MVP (reporté) :**

- Export PDF (peut réutiliser le mécanisme de la Carte Métier)
- Corrélation pollution-qualité (déjà dans Carte Métier)
- Modélisation / prédiction
