# 06 — Tests et validation — Dashboard Pollution Campagnes

---

## 1. Scénarios de tests E2E

### Test 1 — Accès à la nouvelle page

**Étapes :**
1. Naviguer vers `/dashboard-pollution-campagnes`.
2. Vérifier que la page charge sans erreur.

**Critère d'acceptation :** La page affiche la carte, le tableau et les filtres.

---

### Test 2 — Nombre de prélèvements affichés

**Étapes :**
1. Charger la page.
2. Vérifier le nombre de points sur la carte et dans le tableau.

**Critère d'acceptation :** 141 prélèvements affichés.

---

### Test 3 — Filtre par date

**Étapes :**
1. Sélectionner une date de prélèvement connue (ex. 2024-09-18).
2. Vérifier le nombre de points filtrés.

**Critère d'acceptation :** 11 prélèvements pour le 18/09/2024.

---

### Test 4 — Fiche détail d'un prélèvement

**Étapes :**
1. Cliquer sur un point de la carte ou une ligne du tableau.
2. Ouvrir la fiche détail.

**Critère d'acceptation :** La fiche affiche 51 mesures, la localisation, la date, les observations et les entités liées.

---

### Test 5 — Alertes seuils métaux lourds

**Étapes :**
1. Activer le panneau d'alertes.
2. Filtrer sur Cd, Pb, Hg, CrT.

**Critère d'acceptation :** Les alertes affichent les dépassements (après validation métier des unités).

---

### Test 6 — API backend

**Étapes :**
```bash
curl -s "http://localhost:8010/api/v1/pollution/campagnes" | jq '.count'
curl -s "http://localhost:8010/api/v1/pollution/prelevements" | jq '.count'
curl -s "http://localhost:8010/api/v1/pollution/alerts" | jq '.count'
```

**Critère d'acceptation :** Les endpoints retournent des données structurées et non des 404.

---

### Test 7 — Build et compilation

**Étapes :**
```bash
cd repo_git/frontend && npm run build
cd repo_git/backend && python -m py_compile app/api/v1/pollution_campagnes.py
```

**Critère d'acceptation :** Build frontend OK (warnings chunk size acceptés) ; compilation backend OK.

---

## 2. Checklist de validation

- [ ] Page `/dashboard-pollution-campagnes` accessible et stable
- [ ] 141 prélèvements affichés sur la carte
- [ ] Tableau des campagnes/dates fonctionnel avec tri/filtre
- [ ] Fiche prélèvement affichant 51 mesures
- [ ] Alertes seuils configurables et affichées
- [ ] Entités d'inventaire liées affichées dans la fiche
- [ ] API endpoints `/pollution/campagnes`, `/pollution/prelevements`, `/pollution/alerts` opérationnels
- [ ] Aucun impact sur Dashboard DG, Dashboard Qualité, Carte Métier, Dashboard Pollution IDP existant
- [ ] `npm run build` passe
- [ ] `python -m py_compile` passe sur les nouveaux modules backend
- [ ] Validation métier des seuils et unités réalisée

---

## 3. Décision finale

**Recommandation : GO pour implémentation du MVP** sous réserve des validations métier suivantes :

1. Confirmer la définition d'une campagne (date vs regroupement annuel).
2. Valider les seuils et unités des métaux lourds.
3. Décider du traitement des valeurs `< LQ`.

Si le métier n'est pas disponible immédiatement, l'implémentation peut démarrer avec des **seuils configurables en dur** et un bandeau indiquant "seuils provisoires à valider".
