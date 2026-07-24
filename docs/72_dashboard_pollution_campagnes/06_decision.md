# 06 — Décision — Dashboard Pollution Campagnes

## Statut

**MVP backend + frontend implémenté** sur la branche `Dev_refonte`.

## Ce qui est livré

- API backend : 6 endpoints de lecture seule.
- Page frontend `/dashboard-pollution-campagnes` :
  - carte des 141 prélèvements
  - tableau des prélèvements
  - fiche détail avec 51 mesures + mise en évidence des paramètres prioritaires
  - alertes sur 21 paramètres prioritaires (seuils réglementaires dynamiques)
  - liens vers entités d'inventaire
- Documentation dans `docs/72_dashboard_pollution_campagnes/`.
- Aucune régression sur les dashboards existants.

## Ce qui reste à valider métier

1. Définition exacte des campagnes (actuellement déduite des dates).
2. Unités et seuils réglementaires des métaux lourds.
3. Traitement des valeurs `< LQ`.
4. Paramètres prioritaires à mettre en avant.

## Prochaine action

Présenter l'écran à l'ABH Sebou pour validation des seuils et des regroupements de campagnes.
