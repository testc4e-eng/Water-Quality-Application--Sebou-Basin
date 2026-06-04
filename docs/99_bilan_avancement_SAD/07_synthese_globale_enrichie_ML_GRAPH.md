# Synthèse globale enrichie — SAD, ML et Graph Analytics

## 1. Objectif du document

Ce document complète le bilan SAD avec l’avancement **ML expérimental** appliqué à la **prédiction hydrologique** et à la **prédiction pollution**, ainsi qu’avec la transition recommandée vers **Graph Snapshot** et **Graph Analytics**.

## 2. Position actuelle

### Faits vérifiés

- le socle SAD data/applicatif est avancé ;
- la préproduction métier reste conditionnée par des arbitrages et des validations ;
- le **ML expérimental** est désormais documenté dans `docs/105_ml_experiments/` ;
- la transition vers **Graph Snapshot** est justifiée par les limites observées du **ML tabulaire**.

### Décision documentaire

Le périmètre ML reste en statut `SANDBOX`, `RECHERCHE_APPLIQUEE`, `NON_PREPROD`.

### Prochaine étape

Engager E1.5 **Graph Snapshot** avant tout nouveau modèle avancé.

## 3. Ce qui est clôturé

### Faits vérifiés

- extraction dataset documentée ;
- benchmark **ML tabulaire** documenté ;
- analyse des limites des modèles documentée ;
- diagnostic scientifique documenté ;
- roadmap ML actualisée.

### Décision

Le **ML tabulaire** est conservé comme référence expérimentale et non comme capacité métier officielle.

## 4. Ce qui est partiellement acquis

### Faits vérifiés

- existence d’un signal prédictif ;
- préparation du feature store dans la documentation de gouvernance ;
- préparation de **Graph Analytics** dans la documentation de gouvernance ;
- documentation E1.5 préparée au niveau conceptuel.

### Hypothèse

L’ajout de **features spatiales** et de **relations amont/aval** devrait améliorer la robustesse du modèle, en particulier pour les événements de crue et de pollution.

### Prochaine étape

Produire **Graph Snapshot V0** et enrichir un dataset **spatio-temporel**.

## 5. Ce qui n’est pas encore acquis

- modèle prédictif opérationnel ;
- validation scientifique métier ;
- **Graph Snapshot** produit ;
- **modèle spatio-temporel** validé ;
- intégration officielle dans le dashboard décisionnel.

## 6. Pourquoi le Graph Snapshot devient nécessaire

Le réseau hydrographique n’est pas une série temporelle isolée.

La pollution dépend :

- de l’amont/aval ;
- des distances hydrauliques ;
- des rejets ;
- des barrages ;
- des stations ;
- des connexions réseau ;
- des temps de transfert.

### Fait vérifié

Les documents E1.3, E1.4 et `04_ml_lessons_learned.md` concluent que le **modèle temporel** local atteint ses limites sans **topologie hydrologique**.

### Décision

Le prochain chantier utile n’est pas un deep learning immédiat, mais la construction d’un **Graph Snapshot** réutilisable pour **Graph Analytics** et futurs modèles.

## 7. Nouvelle lecture de l’avancement

| Axe | Niveau d’avancement | Lecture |
|---|---:|---|
| Socle data/applicatif SAD | 80% | avancé |
| Préproduction métier | 55% | conditionnée par arbitrages |
| ML expérimental | 65% | documenté mais non opérationnel |
| Graph Snapshot | 35% | prochaine étape |
| Prédiction pollution opérationnelle | 25% | à construire après Graph Snapshot |

## 8. Décision recommandée

Engager E1.5 **Graph Snapshot** avant tout nouveau modèle avancé.

## 9. Message DG

La prédiction pollution est en phase de recherche appliquée. Les premiers tests ML ont montré l’intérêt de poursuivre, mais la fiabilité scientifique nécessite maintenant l’intégration de la topologie hydrologique via Graph Snapshot.

## 10. Prochaines étapes

1. valider phase E1.5 ;
2. produire **Graph Snapshot V0** ;
3. enrichir dataset avec **features topologiques** ;
4. tester **modèle spatio-temporel** ;
5. décider go/no-go **prédiction pollution**.
