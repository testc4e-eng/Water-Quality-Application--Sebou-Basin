# Mode 1 — Affichage par Support (Sprint 2C)

**Logique :** `Support → Objet → Popup → Workspace → Domaine → Paramètre → Visualisation`

## 1. Popup carte enrichi

Lors du clic sur une entité (ex: Station Qualité, Barrage, etc.), le popup affiche :
```
[ Ajouter au Workspace ]
Support : Station Qualité
Nom : Pont Kroumam
Code : XXX
Données disponibles : ✓ Qualité ✓ Hydrologie ✓ Climatologie
```

## 2. Workspace par objet

Chaque objet sélectionné et ajouté au Workspace devient une carte workspace configurable :
- **Domaine** (Qualité / Hydro / Météo / Pollution)
- **Paramètre**
- **Période**
- **Type d'affichage** : KPI / Série temporelle / Tableau / Carte thématique

## 3. Affichage intelligent

La restitution de la donnée s'adapte à sa nature :
- Si `timeseries = TRUE` → Affichage d'un **Graphique temporel**
- Si `timeseries = FALSE` → Affichage d'une **Carte KPI** (dernière valeur, classe, date)
