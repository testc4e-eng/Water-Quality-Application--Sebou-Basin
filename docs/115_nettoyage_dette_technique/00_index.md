# 115 — Nettoyage de la dette technique (phase clôture / stabilisation)

**Contexte** : le projet est en phase de clôture et de stabilisation de la
plateforme (voir `docs/41_stabilisation_complete_dashboards/`,
`docs/session_resume_2026-07-15.md`). Ce dossier trace le nettoyage
**item par item** de la dette technique identifiée par l'audit documentaire,
chaque item étant vérifié sur le code réel avant modification, documenté ici,
et commité isolément.

**Branche** : `Dev_refonte` (branche de développement active en juillet 2026,
porteuse du MVP Déclaration Pollution). Un snapshot WIP juillet a été commité
avant ce nettoyage pour repartir sur un arbre propre (commits `20678c9` code +
`6155bfe` docs).

**Méthode par item** : vérification terrain → correctif minimal → contrôle de
non-régression → fiche de documentation → mise à jour des docs de référence
concernées → commit dédié.

## Registre des items

| # | Dette | Fichier(s) | Risque | Statut | Fiche |
|---|-------|-----------|--------|--------|-------|
| 1 | Double montage du routeur SWAT | `backend/app/api/api_v1.py` | Faible (inerte) | ✅ Corrigé | [01](01_double_montage_swat.md) |
| 2 | Quarantaine `routers_legacy_public` (code mort `public.*`) | `backend/app/routers_legacy_public/` | Faible | ✅ Supprimé | [02](02_suppression_routers_legacy_public.md) |
| 3 | Fallback runtime port `8011` obsolète | `frontend/src/api/client.ts` | Moyen (runtime) | ⏳ À traiter | — |
| 4 | Incohérence `lacher_m3s` (rejeté mais accepté par regex) | `backend/app/routers/observatory.py` | Moyen (logique métier) | ⏳ À traiter | — |
| 5 | Bundle Vite non découpé (avertissement > 500 kB, ~3,56 Mo) | `frontend/vite.config.ts` | Moyen (build) | ⏳ À traiter | — |

## Principe de prudence (phase stabilisation)

Conformément aux consignes de passation du 23/06/2026 :
- pas de migration destructive ;
- les items touchant le runtime ou le build (#3, #4, #5) sont présentés
  et validés avant commit ;
- les correctifs restent **minimaux et réversibles**.
