# Item #4 — Incohérence `lacher_m3s` (métrique legacy exposée)

**Fichier** : `backend/app/routers/observatory.py`
**Risque** : Moyen (logique métier — présentée avant commit)
**Date** : 2026-07-24

## Constat vérifié

Deux endpoints acceptaient `lacher_m3s` comme valeur `metric` via leur regex
de validation, alors même que la valeur était traitée comme **rejetée** :

- `GET /observatory/barrage/timeseries` (l.1524)
- `GET /observatory/barrage/latest` (l.1554)

Chaîne de traitement d'une requête `metric=lacher_m3s` :

1. La regex `Query(...)` **acceptait** `lacher_m3s` (validation OK, 200).
2. `_resolve_barrage_param("lacher_m3s")` renvoyait `None` car `lacher_m3s`
   figure dans `BARRAGE_LEGACY_REJECTED_METRICS` (et n'est pas dans
   `BARRAGE_METRIC_TO_PARAM`).
3. L'endpoint renvoyait alors `[]`.

Résultat : `lacher_m3s` était **annoncé comme métrique valide** (schéma OpenAPI,
enum acceptée) mais renvoyait silencieusement un tableau vide. C'est trompeur
et contraire à `MEMORY_CORE.md §7` (« `lacher_m3s` legacy technique, ne doit
plus être exposé comme flux métier barrage »).

## Vérifications de sûreté

- `grep -rn lacher_m3s frontend/src/` → **aucun usage frontend** (aucune page
  ne demande cette métrique).
- `_resolve_barrage_param` n'est appelé **que** dans ces deux endpoints, tous
  deux protégés par la regex.
- `lacher_m3s` n'apparaît dans aucun autre fichier `.py` du backend.

Retirer `lacher_m3s` de la regex est donc sans impact sur un client existant :
la seule différence est qu'une requête explicite `metric=lacher_m3s`
(inutilisée) reçoit désormais un **422** explicite au lieu d'un **200** vide.

## Correctif appliqué

- Suppression de `|lacher_m3s` dans les deux `pattern` de validation.
- Conservation du set `BARRAGE_LEGACY_REJECTED_METRICS` comme défense en
  profondeur, avec un commentaire clarifiant le double garde-fou.

## Contrôle de non-régression

- `ast.parse` → syntaxe valide.
- Métriques métier légitimes (`niveau_barrage`, `volume_barrage`,
  `lacher_barrage`, `apport`, `apports_hm3`, `transfert`, `cote_m`,
  `volume_mm3`) inchangées.

## Docs mises à jour

- `docs/03_ai_knowledge_base/MEMORY_CORE.md` §7 : ajout du statut « retiré des
  regex API au 2026-07-24 ».
- `docs/115_nettoyage_dette_technique/00_index.md` : item #4 marqué corrigé.
