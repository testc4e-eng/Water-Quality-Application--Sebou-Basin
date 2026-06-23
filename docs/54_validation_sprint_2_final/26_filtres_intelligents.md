# Filtres intelligents — masquer les options vides

**Date** : 2026-06-15  
**Branche** : `Dev_refonte`  
**Route** : `/dashboard-carto-metier`

---

## Objectif

Améliorer l’UX des filtres du Dashboard Carte Métier en ne proposant dans les dropdowns que les options réellement associées à des données. Les options vides sont masquées.

---

## Approche retenue : hybride backend + frontend

| Couche | Rôle |
|--------|------|
| **Backend** | L’endpoint `/availability` calcule et retourne les options avec données (`available_options`). |
| **Frontend** | Les dropdowns consomment `available_options` et l’arbre thématique hardcodé est filtré dynamiquement. |

---

## Fichiers modifiés

### Backend

- `backend/app/models/business_map_models.py`
  - Ajout du modèle `AvailableOptions`.
  - Enrichissement de `BusinessMapAvailabilityResponse` avec `available_options`.

- `backend/app/services/business_map_service.py`
  - `get_availability` retourne désormais un dictionnaire `{items, total, available_options}`.
  - `available_options` est calculé à partir des lignes de `api.mv_business_map_availability` ayant `measure_count > 0`.

- `backend/app/routers/business_map.py`
  - La route `/availability` retourne directement `BusinessMapAvailabilityResponse(**result)`.

### Frontend

- `frontend/src/api/businessMapV1.ts`
  - Ajout du type `AvailableOptions`.
  - Ajout de `available_options` dans `BusinessMapAvailabilityResponse`.

- `frontend/src/config/thematiques.config.ts`
  - Ajout de `getAllParameters()` : retourne tous les paramètres de l’arbre avec leurs labels.
  - Ajout de `filterThematiqueTree(availableParameters)` : masque récursivement les sous-thématiques et thématiques sans paramètres disponibles.

- `frontend/src/components/DashboardMetier/V1/BusinessSidebarV1.tsx`
  - Mode **Par Support** : affiche uniquement les supports retournés par `available_options.supports`.
  - Mode **Par Domaine** : affiche uniquement les domaines et paramètres ayant des données.
  - Mode **Par Thématique** : l’arbre est filtré ; seules les branches avec données apparaissent.
  - Ajout d’un état vide global avec bouton **Réinitialiser les filtres**.
  - Ajout de messages `Aucun ... avec données.` sous chaque dropdown vide.

---

## Détails d’implémentation

### Calcul backend

```python
available_options = {
    "supports": sorted({row["support_type"] for row in rows if row.get("measure_count", 0) > 0}),
    "domains": sorted({row["domain"] for row in rows if row.get("measure_count", 0) > 0}),
    "parameters": sorted({row["parameter_code"] for row in rows if row.get("measure_count", 0) > 0}),
}
```

### Filtrage de l’arbre thématique

```typescript
export function filterThematiqueTree(availableParameters: string[]): Thematique[] {
  return THEMATIQUES
    .map(t => ({
      ...t,
      subThematiques: t.subThematiques
        .map(st => ({
          ...st,
          parameters: st.parameters.filter(p => availableParameters.includes(p.code))
        }))
        .filter(st => st.parameters.length > 0)
    }))
    .filter(t => t.subThematiques.length > 0);
}
```

### Gestion de l’état vide

```tsx
{!hasAnyOption && (
  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mt-2">
    <p className="text-[11px] font-medium text-slate-600">Aucune donnée disponible</p>
    <p className="text-[10px] text-slate-400 mt-1">
      Aucune station ou point de mesure ne correspond aux critères sélectionnés pour la période actuelle.
    </p>
    <button className="mt-2 text-[10px] text-indigo-600 hover:underline font-medium" onClick={resetFilters}>
      Réinitialiser les filtres
    </button>
  </div>
)}
```

---

## Impact métier

- L’utilisateur ne voit plus une liste de 100 paramètres qualité dont la majorité n’a pas de données.
- Le nombre de paramètres QUALITE affichés passe de ~100 à ~93 (valeur observée en production locale).
- Le nombre de supports affichés est limité aux 7 supports réellement actifs.
- L’arbre thématique reste complet si toutes les branches ont des données, mais se masque automatiquement si un paramètre devient indisponible.

---

## Exclusions / limites

- La période (`selectedPeriod`) n’est pas encore envoyée au backend ; le filtrage reste global pour l’instant.
- Le dashboard DG et le dashboard Qualité réglementaire n’ont pas été modifiés.
