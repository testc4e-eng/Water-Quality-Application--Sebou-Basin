# Item #3 — Suppression du fallback runtime port 8011

**Fichier** : `frontend/src/api/client.ts`
**Risque** : Moyen (modification du comportement runtime — présentée avant commit)
**Date** : 2026-07-24

## Constat vérifié

`frontend/src/config/api.ts` fixe `API_BASE_URL` par défaut à
`http://127.0.0.1:8010/api/v1`. Un intercepteur de réponse Axios dans
`client.ts` contenait un fallback :

```js
if (
  !networkFallbackAttempted &&
  error.config &&
  (error.message === "Network Error" || error.code === "ECONNREFUSED") &&
  api.defaults.baseURL?.includes(":8010")
) {
  networkFallbackAttempted = true;
  api.defaults.baseURL = "http://127.0.0.1:8011/api/v1";
  error.config.baseURL = api.defaults.baseURL;
  return api.request(error.config);
}
```

La condition `.includes(":8010")` étant **vraie par défaut**, ce fallback
était **actif** : à la première erreur réseau, l'application retentait la
requête sur le port `8011`. Or `8011` est le **port abandonné** par la
décision de normalisation des ports. Conséquences :

- une requête HTTP supplémentaire vouée à l'échec à chaque panne réseau
  (latence ajoutée) ;
- un avertissement console trompeur (« bascule vers 8011 ») pouvant égarer
  le diagnostic des erreurs « Network Error » sur les dashboards ;
- une modification silencieuse de `api.defaults.baseURL` en cours de session
  vers un port mort.

## Correctif appliqué

Suppression du bloc de fallback et de la variable `networkFallbackAttempted`.
La gestion des erreurs **401** (affichage sans redirection bloquante vers
`/login` pendant les démonstrations) est **conservée** — c'est un besoin
distinct :

```js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Accès API non authentifié ou non autorisé. Affichage de l'erreur sans redirection.");
    }
    return Promise.reject(error);
  }
);
```

## Contrôle de non-régression

- `grep -rn 8011 frontend/src/` → **aucune référence restante**.
- Comportement 401 inchangé.
- En cas de backend injoignable, l'app rejette désormais l'erreur
  directement (comportement attendu) au lieu d'un détour par un port mort.

## Docs mises à jour

- `docs/01_project_reference/frontend/frontend_reference.md` §5.2 : dette de
  port `8011` marquée soldée + clarification des ports 8000 (natif) /
  8010 (Docker).
- `docs/115_nettoyage_dette_technique/00_index.md` : item #3 marqué corrigé.
