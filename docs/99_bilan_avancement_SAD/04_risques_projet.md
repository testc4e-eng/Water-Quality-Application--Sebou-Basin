# Risques projet - SAD Sebou

## 1. Risques majeurs

| Risque | Niveau | Probabilité | Impact | Mesure immédiate |
|---|---|---|---|---|
| Confusion entre DEV, P0, préprod et officiel | Critique | Élevée | décisions DG fondées sur un faux niveau de maturité | imposer un statut unique par module |
| Pollution IDP non arbitree | Critique | Élevée | preproduction pollution conditionnee et cartographie metier partiellement figée | arbitrage spatial DG/métier/SIG |
| Référentiel paramètres non totalement figé | Critique | Élevée | erreurs de classification, incohérences APIs/dashboards | gel du dictionnaire métier |
| SWAT/WASP utilisés trop tôt | Critique | Moyenne | erreur de décision métier/scientifique | maintenir le statut sandbox |
| Dette backend legacy `public.*` | Critique | Élevée | régressions, endpoints faux, incohérence doc/code/DB | plan de purge ciblé |
| Validation hydraulique incomplète | Majeur | Élevée | limitation du routage, IA et analyses réseau | terminer QA scientifique |
| ML expérimental présenté comme prédiction opérationnelle | Critique | Moyenne | faux signal DG/métier sur la maturité scientifique | maintenir le statut `SANDBOX` / `RECHERCHE_APPLIQUEE` / `NON_PREPROD` |
| Prédictions sans topologie hydrologique | Critique | Élevée | modèles myopes, non robustes en crue et pollution | engager Graph Snapshot avant tout modèle avancé |
| Deep learning lancé avant Graph Snapshot | Majeur | Moyenne | complexité accrue sans gain scientifique robuste | geler tout deep learning hors cadrage Graph |
| Confusion entre signal statistique et validité scientifique métier | Critique | Moyenne | décisions basées sur un benchmark incomplet | séparer benchmark, validation métier et usage officiel |
| Documentation contradictoire sur certains états | Majeur | Moyenne | pilotage brouillé et perte de confiance | mise à jour des statuts maîtres |
| Industrialisation ingestion non terminée | Majeur | Moyenne | difficulté de passage en exploitation répétable | fermer V1 ingestion avec QA et rollback |
| UX/dashboard non homogènes | Moyen | Moyenne | adoption métier limitée | rationaliser les parcours P0 |
| Couverture CPS surestimée | Majeur | Moyenne | perception DG trop optimiste | baser le suivi sur preuves exécutable/code/data |

## 2. Risques par domaine

### Données

- qualité résiduelle des mappings paramètres ;
- dépendance à des arbitrages humains ;
- IDP encore sensible aux doublons, orphelins et conflits.
- **ML expérimental** encore dépendant d'un futur **Graph Snapshot** pour intégrer les **features spatiales**.

### Backend

- coexistence prolongée entre routes legacy et spécialisées ;
- présence d'endpoints dépendant encore de tables `public.*` ;
- activation optionnelle de certains modules d'ingestion et SWAT analysis.

### Frontend

- coexistence d'écrans historiques et pilotes ;
- risque de confusion utilisateur sur les modules "officiels" ;
- couverture partielle de certains écrans métiers avancés.

### Gouvernance

- décisions attendues non datées ou non verrouillées ;
- documents de statut parfois plus optimistes que la réalité exécutable ;
- dispersion potentielle si le périmètre continue à bouger.

## 3. Risques de dépendance

### Dépendances SWAT

- validation Reda non obtenue ;
- scénarios et calibration non encore officialisés ;
- exposition technique disponible mais non qualifiée métier.

### Dépendances WASP

- validation Anas non obtenue ;
- statut legacy modeling to replace ;
- pas de base pour usage décisionnel officiel.

### Dépendances SIG / spatial

- arbitrage identité spatiale IDP ;
- validation hydraulique directionnelle ;
- cohérence réseau / MNT / restitution cartographique.

## 4. Risques de réunion DG

- présenter un module DEV comme "livré" ;
- confondre "présence d'un écran" avec "capacité métier officielle" ;
- sous-estimer le poids des arbitrages métier dans les 90 jours à venir.

## 5. Plan de maîtrise

### Mesures immédiates

1. Afficher un statut unique par module : `OFFICIEL`, `PREPROD`, `DEV`, `HOLD`, `SANDBOX`.
2. Geler le périmètre fonctionnel pendant 90 jours.
3. Ouvrir une task force courte sur IDP + référentiels + dette legacy.

### Mesures à 30 jours

1. Clore les arbitrages paramètres et réglementaires.
2. Purger les endpoints critiques basés sur `public.*`.
3. Qualifier navigateur/API des dashboards P0.

### Mesures à 60-90 jours

1. Passer les modules P0 choisis en préprod stable.
2. Décider clairement si SWAT/WASP restent hors périmètre du jalon.
3. Transformer l'avancement en matrice de go/no-go par module.

## 6. Conclusion

Le risque principal du projet n'est plus l'absence de code. C'est **l'ecart entre capacite technique demontree et validation metier/scientifique officielle**. Toute la gouvernance des trois prochains mois doit viser a reduire cet ecart sans attribuer aux equipes projet la responsabilite des incoherences source deja detectees et documentees.
