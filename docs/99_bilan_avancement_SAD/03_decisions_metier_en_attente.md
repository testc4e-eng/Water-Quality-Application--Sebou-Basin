# Décisions métier en attente - SAD Sebou

## 1. Décisions structurantes

### D1. Arbitrage spatial IDP

**Décision attendue**

- valider les règles de rapprochement des sites ;
- traiter doublons, orphelins et cas ambigus ;
- confirmer la logique source -> site maître sans fusion destructive automatique.

**Pourquoi cette décision est requise**

- le pipeline pollution IDP est `GO_DEV__NOGO_PREPROD` ;
- la cartographie métier et les dernières valeurs pollution restent limitées tant que l'identité spatiale n'est pas stabilisée.

**Impact si non tranché**

- preproduction IDP conditionnee ;
- risque de doublons ou d'agrégation fausse ;
- impossibilité d'officialiser la restitution pollution.

### D2. Dictionnaire final des paramètres

**Décision attendue**

- arbitrer les alias métier ;
- figer unités et correspondances ;
- confirmer les paramètres ambigus.

**Points sensibles explicitement documentés**

- `MO` ne doit jamais être confondu avec `Mo` ;
- certains alias qualité restent encore à arbitrer.

**Impact si non tranché**

- classifications incomplètes ;
- qualité analytique partielle ;
- instabilité des écrans et APIs.

### D3. Référentiel qualité réglementaire officiel

**Décision attendue**

- confirmer la version réglementaire active ;
- valider la liste des seuils réellement opérationnels ;
- confirmer la doctrine sur les paramètres non classifiables et hors périmètre.

**Impact si non tranché**

- dashboard réglementaire non officialisable ;
- ambiguïté sur la restitution DG/métier ;
- risque d'interprétation erronée des statuts qualité.

### D4. Politique métier sur les données barrages/qualité résiduelles

**Décision attendue**

- valider les mises à jour encore en suspens ;
- accepter ou rejeter les cas encore hors mapping.

**Impact si non tranché**

- lot qualité barrage non totalement clos ;
- maintien de lignes hors analytique.

## 2. Décisions scientifiques

### D5. Validation SWAT

**Responsable attendu**

Reda

**Décision attendue**

- validation scénarios ;
- validation unités ;
- validation calibration ;
- validation mappings d'exploitation.

**Impact si non tranché**

- SWAT reste sandbox ;
- pas d'usage officiel en comité de décision.

### D6. Validation WASP

**Responsable attendu**

Anas

**Décision attendue**

- validation segments ;
- validation unités ;
- validation scénarios ;
- validation outputs exploitables.

**Impact si non tranché**

- WASP reste sandbox ;
- impossibilité d'intégrer officiellement les résultats modèles dans le SAD.

### D7. Validation hydraulique scientifique

**Décision attendue**

- arbitrer 139 segments suspectés inversés ;
- qualifier 81 segments plats/incertains ;
- valider quand le runtime peut changer de topologique visuel à hydrauliquement validé.

**Impact si non tranché**

- le routage pollution reste purement visuel ;
- blocage de plusieurs usages avancés IA/graph/model build.

## 3. Décisions de pilotage DG

### D8. Définir le périmètre de la prochaine préproduction

**Décision attendue**

Choisir ce qui entre officiellement dans le lot préprod des 90 jours :

- qualité réglementaire ;
- cartographie métier ;
- pollution IDP ;
- ingestion ;
- scénarios.

**Recommandation**

Ne retenir en préprod officielle que :

- qualité réglementaire ;
- cartographie métier ;
- socle data hydro/météo/qualité ;
- pollution IDP seulement si l'arbitrage spatial est clos.

### D9. Geler ou non l'ouverture de nouveaux chantiers

**Décision attendue**

Prioriser la fermeture des chantiers ouverts plutôt que l'ouverture de nouveaux modules.

**Recommandation**

Oui, geler tout nouveau développement non critique pendant 90 jours.

### D10. Engagement de la phase E1.5 Graph Snapshot

**Décision attendue**

- valider le passage du **ML tabulaire** vers **Graph Snapshot** ;
- confirmer les entités réseau à intégrer ;
- confirmer les stations, barrages, rejets et tronçons prioritaires ;
- valider le statut `SANDBOX` / `RECHERCHE_APPLIQUEE`.

**Pourquoi cette décision est requise**

- le **ML expérimental** a montré l'intérêt d'un signal prédictif mais aussi les limites du **modèle temporel** ;
- la **prédiction pollution** et la **prédiction hydrologique** ne peuvent pas progresser scientifiquement sans **topologie hydrologique**, **relations amont/aval** et **features spatiales**.

**Impact si non tranché**

- stagnation du benchmark **ML tabulaire** ;
- impossibilité d'engager un **modèle spatio-temporel** crédible ;
- risque de lancer des modèles avancés sans fondation réseau valide.

## 4. Tableau de synthèse

| ID | Décision | Niveau | Responsable principal | Échéance recommandée |
|---|---|---|---|---|
| D1 | Arbitrage spatial IDP | Critique | Métier + SIG | Semaine 1-3 |
| D2 | Dictionnaire final paramètres | Critique | Métier + Data | Semaine 1-4 |
| D3 | Référentiel réglementaire officiel | Critique | Métier + Data | Semaine 2-4 |
| D4 | Cas résiduels qualité barrage | Majeur | Métier + Data | Semaine 2-5 |
| D5 | Validation SWAT | Critique | Reda | Mois 2 |
| D6 | Validation WASP | Critique | Anas | Mois 2 |
| D7 | Validation hydraulique | Critique | SIG + Data | Mois 2 |
| D8 | Périmètre préprod officiel | Critique | DG + Projet | Semaine 2 |
| D9 | Gel de périmètre 90 jours | Majeur | DG + Projet | Semaine 1 |
| D10 | Engagement E1.5 Graph Snapshot | Majeur | SIG / Data + Métier + DG | Semaine 2-4 |

## 5. Conclusion

Le projet n'est pas freine par une absence de socle technique. Les developpements essentiels, les controles et la documentation d'arbitrage existent. Les suites ouvertes relevent principalement de **decisions metier et scientifiques structurantes** attendues du proprietaire de la donnee ou des validateurs scientifiques.
