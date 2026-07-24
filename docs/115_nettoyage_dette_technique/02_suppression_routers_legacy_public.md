# Item #2 — Suppression de `routers_legacy_public`

**Chemin supprimé** : `backend/app/routers_legacy_public/`
**Risque** : Faible (code mort, non monté)
**Date** : 2026-07-24

## Constat vérifié

Le dossier `backend/app/routers_legacy_public/` contenait 7 fichiers
(`api.py`, `catalog.py`, `geojson.py`, `measurements.py`, `objects.py`,
`stations.py`, `README.md`) ciblant des tables du schéma `public.*`
**absentes de la base `abh_sad`**.

- Aucun de ces routeurs n'est monté dans le runtime principal
  (`backend/app/api/api_v1.py`).
- Recherche `grep -r routers_legacy_public backend/` → **aucune référence**
  (aucun import, nulle part).

Il s'agissait donc de code strictement mort, conservé en quarantaine « pour
traçabilité » (voir ancien `README.md` du dossier).

## Décision

Suppression complète du dossier. La traçabilité est assurée par l'historique
Git : le code reste consultable jusqu'au commit **`eae74aa`** inclus
(dernier état où le dossier est présent). Pour le retrouver :

```bash
git show eae74aa:backend/app/routers_legacy_public/api.py
# ou restaurer temporairement :
git checkout eae74aa -- backend/app/routers_legacy_public/
```

Conserver un dossier de code mort dans l'arbre de travail n'apportait plus de
valeur (risque de réactivation par erreur, bruit à la lecture, confusion sur
la surface d'API réelle) alors que Git remplit déjà le rôle d'archive.

## Contrôle de non-régression

- Runtime principal (`api_v1.py`) : n'importait pas ces routeurs → aucun
  impact sur les routes exposées.
- Aucun test ne référence `routers_legacy_public`.

## Docs mises à jour

- `docs/115_nettoyage_dette_technique/00_index.md` : item #2 marqué corrigé.
