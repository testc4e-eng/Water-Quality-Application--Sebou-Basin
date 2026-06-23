# Tests — Filtres intelligents

**Date** : 2026-06-15  
**Branche** : `Dev_refonte`  
**Environnement** : backend `8010`, frontend `5174`

---

## 1. Tests backend

### 1.1 Endpoint `/availability` enrichi

```bash
curl -s "http://localhost:8010/api/v1/business-map/availability" | python -c "import sys,json; d=json.load(sys.stdin); print(d['available_options'])"
```

**Résultat attendu** :

```json
{
  "supports": ["BARRAGO", "POINT_PRELEVEMENT_POLLUTION", "SOURCE_POLLUTION", "STATION_HYDRO", "STATION_METEO", "STATION_QUALITE", "STATION_SENTINELLE"],
  "domains": ["CLIMATOLOGIE", "HYDROLOGIE", "POLLUTION", "QUALITE"],
  "parameters": [...138 codes...]
}
```

**Observation** :

```
supports: 7
domains: ['CLIMATOLOGIE', 'HYDROLOGIE', 'POLLUTION', 'QUALITE']
parameters: 138
total items: 159
```

✅ `available_options` est retourné et cohérent.

---

## 2. Tests frontend

### 2.1 Build

```bash
cd frontend
npm run build
```

**Résultat** : ✅ `built in 35.62s`

### 2.2 Mode Par Support — dropdown Supports

| Avant | Après |
|-------|-------|
| Liste potentiellement longue avec supports sans données | 7 supports actifs uniquement |

**Observation** : `BARRAGE, POINT_PRELEVEMENT_POLLUTION, SOURCE_POLLUTION, STATION_HYDRO, STATION_METEO, STATION_QUALITE, STATION_SENTINELLE`

✅ Filtrage support OK.

### 2.3 Mode Par Domaine — dropdown Paramètres QUALITE

| Avant | Après |
|-------|-------|
| ~100+ paramètres | 93 paramètres avec données |

**Observation** : `AG, Aluminium, Ammonium, ..., pH, ..., Zinc`. `Cd` absent car domaine POLLUTION. `PO43_` absent car domaine POLLUTION dans les données.

✅ Filtrage paramètres OK.

### 2.4 Mode Par Thématique — arbre filtré

| Niveau | Observation |
|--------|-------------|
| Thématiques | Qualité de l’eau, Hydrologie, Météo |
| Sous-thématiques (Qualité) | Physico-chimique, Nutriments, Métaux lourds, Bactériologique |
| Paramètres (Physico-chimique) | pH, DBO5, MES, Conductivité, O2 Dissous |

✅ Arbre thématique filtré OK.

### 2.5 État vide local

Quand un dropdown n’a aucune option, le message s’affiche :

> « Aucun support avec données. »  
> « Aucun domaine avec données. »  
> « Aucun paramètre avec données. »  
> « Aucune thématique avec données. »

✅ Messages d’état vide OK.

### 2.6 État vide global

Implémenté dans `BusinessSidebarV1.tsx` : si `hasAnyOption === false`, un bloc s’affiche avec le bouton **Réinitialiser les filtres**.

Non testé E2E car les données locales ne permettent pas de vider l’ensemble des options.

---

## 3. Régression

### 3.1 Dashboard DG / Qualité réglementaire

Aucun fichier de ces dashboards n’a été modifié.

```bash
git diff -- frontend/src/pages/DashboardQualiteReglementaire.tsx frontend/src/pages/DashboardDG.tsx
```

**Résultat** : aucune modification.

✅ Dashboards DG et Qualité intacts.

---

## 4. Synthèse

| Critère | Statut |
|---------|--------|
| Endpoint `/availability` enrichi | ✅ |
| Dropdowns filtrés (support / domaine / paramètre) | ✅ |
| Arbre thématique filtré | ✅ |
| États vides locaux et globaux | ✅ (global non testé E2E) |
| `npm run build` OK | ✅ |
| Dashboards DG / Qualité intacts | ✅ |
