# 01 — Audit du Dashboard Pollution existant (IDP)

> Date : 2026-06-16 — Branche `Dev_refonte`

## Constat

L'écran existant `/dashboard-pollution` affiche les **sources IDP** (~500 sites, 5 paramètres P0).
Il ne restitue **pas** les **141 prélèvements de campagne** avec leurs **51 paramètres**.

## Écarts critiques

| Attendu | Existant |
|---|---|
| 141 prélèvements, 51 paramètres | ~500 sites IDP, 5 paramètres P0 |
| Carte des points de prélèvement | Carte des sites IDP |
| Fiche détail par prélèvement | Aucune |
| Alertes métaux lourds (Cd, Pb, Hg, Cr) | Aucune |
| Navigation par campagne/date | Aucune |

## Décision

Créer une nouvelle page **`/dashboard-pollution-campagnes`** en parallèle, sans toucher à l'écran IDP.
