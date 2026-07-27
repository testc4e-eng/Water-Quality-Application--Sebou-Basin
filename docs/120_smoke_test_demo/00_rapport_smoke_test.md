# 120 — Rapport de smoke test (qualification démo)

**Date** : 2026-07-27 · **Stack** : Docker (sad-db, sad-backend:8010,
sad-frontend:5174) + PostgreSQL natif hôte (127.0.0.1:5432, base `abh_sad`).
Preuves collectées via API (curl) et navigateur (in-app).

## Verdict : **DEMO_READY_AVEC_RESERVES**

Les deux bloqueurs runtime historiques (Carte Métier « Erreur catalogue »,
Dashboard Qualité « Network Error ») **ne se reproduisent plus**. Un bloqueur
d'infrastructure a été trouvé et corrigé (login 500). Les réserves restantes
sont des lenteurs à cache froid et des items de durcissement, non bloquants
pour une démonstration guidée.

## Bloqueur trouvé et corrigé pendant le test

**Login 500 — utilisateur DB en lecture seule.** La stack Docker se
connectait en `sad_app`, rôle qui n'a que `SELECT` sur toute la base (7455
grants SELECT, 0 écriture). Tout flux d'écriture échouait (login →
`UPDATE security.users`, déclarations, logs d'activité). Aucun rôle applicatif
(`sad_app`, `sad_admin`, `app_writer`…) n'a de droits d'écriture : l'app est
conçue pour se connecter en `postgres` (propriétaire, défaut du compose).
**Correctif** : `.env` racine (local, gitignoré) repointé `DB_USER=postgres`
+ `CLIMATE_DB_USER=postgres`, backend recréé. Login re-testé : **200, token,
23 permissions**.

## Résultats par contrôle

| Contrôle | Critère | Résultat |
|----------|---------|----------|
| Build frontend | succès sans warning | ✅ (vérifié en amont) |
| Démarrage backend | `/health` OK | ✅ `{"status":"OK","db":"OK"}` |
| Connexion | compte démo fonctionnel | ✅ admin@gmail.com → 200 |
| RBAC — sans token | 401 | ✅ `/raw/tables` → 401 |
| RBAC — viewer sur admin | 403 | ✅ `/raw/tables` → 403 |
| RBAC — admin | 200 | ✅ `/raw/tables`, `/data-admin/classes` → 200 |
| Sécurité register | force `viewer` | ✅ register `role_code=admin` → compte **viewer** |
| Accueil DG | aucun Network Error | ✅ données réelles (10 barrages, 6 stations qualité), 0 erreur |
| Carte Métier | catalogue + couches | ✅ thèmes/paramètres/timeline/KPI en 200, pas d'« Erreur catalogue » |
| Dashboard Qualité | données chargées | ✅ 78 stations, 119 089 mesures, 99 paramètres, 1988-2026 |
| Déclaration Pollution | parcours exécutable | ✅ cockpit, 500 sites, 250 résultats, propagation/recommandations en 200 |
| Console navigateur | aucune erreur | ✅ aucune erreur sur les 4 dashboards |
| Réseau — port 8011 | aucun appel | ✅ 0 appel 8011 (fallback supprimé) |
| Refresh URL directe | pages se rechargent | ✅ navigation directe OK sur toutes les routes testées |
| RBAC 403 cohérent | oui | ✅ |

## Réserves (non bloquantes)

1. **Perf à cache froid** (premier appel après redémarrage / expiration TTL) :
   `dashboard/home` 20,6 s · `stations` 15,2 s · `dashboard/trends?days=30`
   **19,5 s même à chaud (non caché)**. Home et stations sont couverts par le
   warm-up au démarrage + stale-while-revalidate ; **`/dashboard/trends` n'a
   aucun cache** et l'Accueil DG l'appelle → à chaque fenêtre de 2 min un
   utilisateur peut attendre ~19 s. Correctif recommandé avant mardi :
   appliquer le même cache TTL que `home` à `dashboard/trends`.
2. **404 mineurs** : `/api/v1/layers/configs` (Carte Métier, x2) et
   `/api/v1/security/logs` (chemin réel différent) — non bloquants, mais à
   corriger côté frontend (mauvais chemin) ou backend (route manquante).
3. **Sécurité différée post-démo** : DB en `postgres` (superuser) — la vraie
   moindre-privilège (grants d'écriture ciblés sur `sad_app`) reste à faire ;
   secrets encore dans l'historique git (rotation à planifier, voir doc 116) ;
   endpoints de données publics (auth globale à décider).
4. **Comptes de test** créés pendant le smoke (`smoke*@example.com`, rôle
   viewer) — à purger de `security.users` avant la démo si souhaité.

## Recommandations avant mardi (ordre)

1. Cacher `/dashboard/trends` (réserve 1) — petit correctif, gain visible.
2. Corriger le 404 `/layers/configs` si la couche est attendue à la démo.
3. Pousser la branche `Dev_refonte` (21 commits d'avance non poussés).
4. Purger les comptes `smoke*`.
5. (Post-démo) Rotation des secrets + moindre-privilège DB.
