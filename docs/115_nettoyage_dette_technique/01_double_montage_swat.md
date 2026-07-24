# Item #1 — Double montage du routeur SWAT

**Fichier** : `backend/app/api/api_v1.py`
**Risque** : Faible (correctif inerte sur le routage — supprime une
redondance sans changer les routes exposées)
**Date** : 2026-07-24

## Constat vérifié

Le routeur SWAT principal (`app/api/v1/swat.py`, défini avec
`APIRouter(prefix="/swat")`) était **importé deux fois** et **monté deux
fois** sur le même `api_router` :

```python
# Import 1 (ligne 6)
from app.api.v1.swat import router as swat_router
...
# Import 2, redondant (ligne 28)
from app.api.v1 import swat
...
# Montage 1 (ligne 158)
api_router.include_router(swat_router, tags=["swat"])
# Montage 2, redondant (ligne 159) — swat.router EST swat_router
api_router.include_router(swat.router)
```

`swat_router` et `swat.router` désignent **le même objet APIRouter**. Le
second montage enregistrait donc une deuxième fois les mêmes routes
`/api/v1/swat/*`, générant des opérations dupliquées dans le schéma OpenAPI
(bruit, ambiguïté de documentation, risque de confusion sur les tags).

## Vérification du faux problème « double préfixe »

`docs/01_project_reference/frontend/frontend_reference.md` §5.4 évoquait un
risque de préfixe **doublé** `/api/v1/api/v1/swat/analysis/*`. Vérification
terrain :

- `swat.py` → `prefix="/swat"`, monté sous `api_router` (`/api/v1`) →
  chemin réel `/api/v1/swat/*`. ✅
- `swat_analysis.py` → `prefix="/swat/analysis"`, monté via
  `_include_optional_swat_analysis()` **sans préfixe additionnel** →
  chemin réel `/api/v1/swat/analysis/*`. ✅

Il n'y a donc **aucun préfixe doublé** dans le code actuel. La crainte du
§5.4 était spéculative ; le défaut réel était le double *montage* décrit
ci-dessus.

## Correctif appliqué

Suppression de l'import redondant (ligne 28) et du second `include_router`
(ligne 159). Le routeur SWAT reste monté **une seule fois** :

```python
api_router.include_router(swat_router, tags=["swat"])
SWAT_ANALYSIS_AVAILABLE = _include_optional_swat_analysis(api_router)
```

## Contrôle de non-régression

- `python -c "import ast; ast.parse(...)"` → syntaxe valide.
- Références restantes à `swat` dans `api_v1.py` : uniquement `swat_router`
  (import ligne 6, montage unique) — l'alias module `swat` n'est plus
  utilisé. `swat_analysis` (import paresseux optionnel) est intact.
- Routes exposées inchangées : `/api/v1/swat/*` reste disponible (une seule
  fois au lieu de deux).

## Docs mises à jour

- `docs/01_project_reference/frontend/frontend_reference.md` §5.4 : la note
  spéculative sur le double préfixe est remplacée par le constat vérifié
  (préfixe unique confirmé, double montage corrigé).
- `docs/115_nettoyage_dette_technique/00_index.md` : item #1 marqué corrigé.
