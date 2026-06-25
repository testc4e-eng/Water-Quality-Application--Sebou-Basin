# Roadmap stratégique SAD Sebou / WQDSS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | roadmap stratégique projet |
| Source de vérité | Oui |
| Dernière mise à jour | 2026-06-10 |
| Version | `ROADMAP_EXECUTIVE_READY_V1` |
| Auteur | Chef de projet + analyse technique |

---

## Contexte

Le projet SAD est sorti de sa phase de développement structurel. Il entre dans une phase de **connexion aux données métier réelles, validation opérationnelle, puis préparation à la préproduction**.

C'est cette étape qui donnera à la DG la perception d'un système réellement exploitable.

Le véritable goulot d'étranglement n'est plus le développement. Ce n'est pas encore un problème scientifique. C'est un problème de :

- qualité des données ;
- cohérence métier ;
- confiance utilisateur.

---

## Séquencement des phases

```
P1  Audit frontend                          ✅ CLÔTURÉE
 ↓
P2  Dashboards stabilisés                   ✅ CLÔTURÉE
 ↓
P3  Validation runtime                      ✅ CLÔTURÉE
 ↓
P4  Connexion données réelles               🔄 EN COURS
 ↓
P4.5  Validation fonctionnelle métier       ⏳ À VENIR
 ↓
P5  Stabilisation backend                   ⏳ À VENIR
 ↓
P6  Validation DG / Métier                  ⏳ À VENIR
 ↓
P7  Préproduction SAD                       ⏳ À VENIR
 ↓
P8A  Intégration SWAT / WASP               ⏳ À VENIR
 ↓
P8B  IA prédictive pollution                ⏳ À VENIR
 ↓
P9  Reporting décisionnel                   ⏳ À VENIR
```

---

## Phases terminées

### Phase 1 — Audit et restructuration du Frontend ✅

**Statut : CLÔTURÉ**

| Élément | Détail |
|---------|--------|
| Audit complet | Frontend ↔ Backend ↔ Vision cible |
| Classification modules | Opérationnels, Partiels, En construction, Futurs |
| Écrans trompeurs identifiés | SWAT, WASP, Pollution DEV, Legacy |
| Livrables | `docs/38_audit_frontend_vision_dashboards/` |

---

### Phase 2 — Industrialisation des dashboards stabilisés ✅

**Statut : CLÔTURÉ**

| Dashboard | Statut |
|-----------|--------|
| Accueil DG | Implémenté |
| Qualité réglementaire | Implémenté |
| Pollution | Implémenté |
| Données / QA | Implémenté |
| Administration / RBAC | Implémenté |

Actions réalisées :

- Badges de statut (OPERATIONNEL, EN_CONSTRUCTION, DEV, etc.)
- Gestion états loading / error / empty
- Navigation cible à 6 entrées
- Déclassification des modules non prêts

Livrables : `docs/39_implementation_dashboards_clotures/`

---

### Phase 3 — Validation Runtime API ✅

**Statut : TERMINÉE**

| Élément | Détail |
|---------|--------|
| Problème identifié | Mauvaise API (`agent-swat-api` sur port 8000) |
| Correction | Reconnexion à l'API SAD (port 8010) |
| RBAC | Validé (comptes test sysadmin + consultant) |
| Build | OK |
| Livrables | `docs/40_validation_runtime_dashboards/` |

---

## Phase actuelle

### Phase 4 — Connexion données réelles 🔄

**Statut : EN COURS — PRIORITÉ ABSOLUE**

Le frontend fonctionne. Le problème est maintenant : remplacer les données simulées par les données métier réelles.

#### 4.1 — Carte métier

Objectif : passer d'une carte démonstrative à une carte décisionnelle opérationnelle.

Popup stations — données à ajouter :

- Nom officiel, code station
- Bassin, sous-bassin
- Province, commune
- Coordonnées
- Statut, date dernière mesure
- Paramètres disponibles, dernière valeur
- Période couverte

#### 4.2 — Qualité des eaux

Objectif : supprimer les "Station sentinelle 01…06" fictives et les remplacer par les 6 vraies stations qualité issues de la BD.

Travaux :

- Identifier les stations ayant des séries temporelles réelles
- Calculer leur statut qualité
- Exposer une API dédiée (`GET /api/v1/quality/stations-with-timeseries`)

#### 4.3 — Tendances

Objectif : passer de données semi-mockées à 100 % données BD.

| Indicateur | Source réelle |
|------------|--------------|
| Pluie | `meteo.mesure_precipitation` |
| Débit | `hydro.mesure_debit` |
| Température | `meteo.mesure_temperature` |
| Qualité | `qualite.*` |

Livrable attendu : `docs/40_connexion_dashboard_carte_qualite_climat/`

---

### Phase 4.5 — Validation fonctionnelle des données réelles ⏳

**Statut : À VENIR (juste après Phase 4)**

Connecter les données réelles ne signifie pas qu'elles sont correctes. Cette phase vérifie la fiabilité et la cohérence de ce qui est affiché.

#### Questions critiques

**Carte métier :**

- Les stations affichées sont-elles les bonnes ?
- Les coordonnées sont-elles exactes ?
- Les métadonnées sont-elles cohérentes ?

**Qualité :**

- Les 6 stations choisies sont-elles pertinentes ?
- Les dates sont-elles cohérentes ?
- Les statuts Bon / Surveillance / Critique sont-ils validés ?

**Tendances :**

- Les séries pluie correspondent-elles aux stations attendues ?
- Les débits sont-ils cohérents ?
- Les températures sont-elles réalistes ?

#### Responsables de validation

| Domaine | Validation |
|---------|------------|
| Qualité | Équipe métier |
| Hydro | Reda |
| Pollution | Équipe métier |
| SIG / Cartes | Chef de projet |

---

## Phases à venir

### Phase 5 — Stabilisation Backend ⚙️

Objectif : sortir les logiques métier du frontend pour les déplacer côté backend.

| Aujourd'hui (frontend) | Demain (backend) |
|------------------------|------------------|
| Filtrer les 6 meilleures stations qualité | `GET /dashboard/home` → retourne `top_quality_stations` |
| Assembler les tendances depuis plusieurs endpoints | `GET /dashboard/home` → retourne `climate_trends` |
| Construire les alertes côté client | `GET /dashboard/home` → retourne `alerts` |

Le frontend devient affichage pur.

---

### Phase 6 — Validation DG / Métier 👥

Intervient après la connexion et la validation fonctionnelle des données réelles.

| Module | Points à valider |
|--------|-----------------|
| Qualité | Badge PREPROD, paramètres visibles, classes |
| Pollution | Wording, limites scientifiques, exposition DG |
| QA | KPI utiles pour la DG |
| Navigation | Validation de la structure à 6 modules |

---

### Phase 7 — Préproduction SAD 🚀

Passage DEV → PREPROD lorsque la DG valide.

Incluant :

- Tests utilisateurs réels
- Performance et temps de réponse
- Sécurité et durcissement
- RBAC en conditions réelles
- Démonstration officielle DG

---

### Phase 8A — Intégration scientifique SWAT / WASP 🧪

Uniquement après la mise en préproduction du socle décisionnel.

**SWAT :**

- Résultats validés (responsable : Reda)
- API exposées
- Dashboards intégrés

**WASP :**

- Validation Anas
- Scénarios disponibles
- Intégration SAD

Objectif : transformer SWAT/WASP de dépendances externes en services SAD.

---

### Phase 8B — Intelligence prédictive pollution 🤖

Phase distincte de 8A car elle dépend de la chaîne complète :

```
Qualité stabilisée
+ Pollution stabilisée
+ SWAT opérationnel
+ WASP opérationnel
= IA prédictive pollution possible
```

L'IA pollution ≠ même phase que SWAT/WASP.

---

### Phase 9 — Reporting décisionnel 📊

Objectif : rapports DG automatiques.

Exemples :

- État bassin
- Alertes actives
- Qualité des eaux
- Sources de pollution
- Données manquantes
- Export PDF

---

## Matrice de maturité

| Domaine | Maturité estimée | Tendance |
|---------|:----------------:|:--------:|
| Frontend décisionnel | 90 % | ↗️ |
| RBAC | 95 % | → |
| Gouvernance QA | 90 % | → |
| API SAD | 85 % | ↗️ |
| Qualité réglementaire | 85 % | → |
| Pollution | 70 % | → |
| **Données réelles Dashboard** | **60 %** | **🔄 Priorité** |
| SWAT | 40 % | ⏸️ |
| WASP | 35 % | ⏸️ |
| IA prédictive | 10 % | ⏸️ |

Le goulot d'étranglement est **la validation et l'exploitation des données réelles** (60 %).

---

## Ordre de priorité recommandé

| Priorité | Action | Phase |
|:--------:|--------|:-----:|
| 1️⃣ | Connecter popup carte + qualité réelle + tendances météo | P4 |
| 2️⃣ | Valider la cohérence fonctionnelle des données affichées | P4.5 |
| 3️⃣ | Déplacer logique métier vers backend | P5 |
| 4️⃣ | Validation DG / équipe métier | P6 |
| 5️⃣ | Passage en préproduction | P7 |
| 6️⃣ | Intégration SWAT / WASP | P8A |
| 7️⃣ | IA prédictive pollution | P8B |
| 8️⃣ | Reporting décisionnel | P9 |

---

## Estimation globale

Le socle décisionnel SAD est estimé à **75–80 % de complétion**. La difficulté restante n'est plus d'écrire du code, mais de transformer les données existantes en information crédible pour la DG et les experts métier.

---

## Critères de sortie des phases

### Phase 4 — Connexion données réelles

- [ ] Popup carte métier connecté aux données réelles
- [ ] 6 stations qualité réelles affichées (noms, dates, statuts)
- [ ] Tendances pluie connectées à `meteo.mesure_precipitation`
- [ ] Tendances débit connectées à `hydro.mesure_debit`
- [ ] Tendances température connectées à `meteo.mesure_temperature`
- [ ] Aucun mock critique restant sur l'accueil DG
- [ ] Build frontend validé (`npm run build` OK)

### Phase 4.5 — Validation fonctionnelle

- [ ] Équipe métier valide les stations qualité affichées
- [ ] Reda valide les séries hydrologiques
- [ ] Chef de projet valide la cohérence SIG (coordonnées, cartes)
- [ ] Les valeurs affichées correspondent à la BD
- [ ] Les statuts qualité (Bon / Surveillance / Critique) sont cohérents

### Phase 5 — Stabilisation Backend

- [ ] Le frontend ne filtre plus les 6 stations (logique backend)
- [ ] Les tendances sont calculées côté backend
- [ ] Les alertes sont fournies par API
- [ ] `GET /dashboard/home` devient agrégateur officiel
- [ ] Documentation API mise à jour

### Phase 6 — Validation DG / Métier

- [ ] Validation DG de l'accueil
- [ ] Validation métier qualité
- [ ] Validation métier pollution
- [ ] Validation KPI QA
- [ ] Validation navigation (structure à 6 modules)

### Phase 7 — Préproduction

- [ ] Tests utilisateurs réussis
- [ ] Performance acceptable
- [ ] RBAC validé en conditions réelles
- [ ] Démonstration DG réussie
- [ ] GO PREPROD prononcé

### Phase 8A — SWAT / WASP

**SWAT :**

- [ ] Validation Reda
- [ ] API disponibles
- [ ] Dashboard intégré au SAD

**WASP :**

- [ ] Validation Anas
- [ ] API disponibles
- [ ] Dashboard intégré au SAD

### Phase 8B — IA prédictive pollution

- [ ] Données qualité stabilisées
- [ ] Pollution stabilisée
- [ ] SWAT opérationnel
- [ ] WASP opérationnel
- [ ] Prototype IA validé

### Phase 9 — Reporting décisionnel

- [ ] Rapports DG générés automatiquement
- [ ] Export PDF opérationnel
- [ ] Alertes intégrées dans les rapports
- [ ] Validation DG obtenue

---

## Tableau de pilotage projet

| Phase | Statut | Avancement | Responsable | Critère GO |
|:-----:|--------|:----------:|-------------|------------|
| P4 | 🔄 EN COURS | 60 % | Chef de projet | Données réelles connectées |
| P4.5 | ⏳ À VENIR | 0 % | Métier / Reda | Validation fonctionnelle |
| P5 | ⏳ À VENIR | 0 % | Dev Backend | Backend agrégateur |
| P6 | ⏳ À VENIR | 0 % | DG / Métier | Validation officielle |
| P7 | ⏳ À VENIR | 0 % | Équipe projet | GO PREPROD |
| P8A | ⏳ À VENIR | 0 % | Reda / Anas | Validation scientifique |
| P8B | ⏳ À VENIR | 0 % | Data Science | IA validée |
| P9 | ⏳ À VENIR | 0 % | Équipe projet | Reporting DG |
