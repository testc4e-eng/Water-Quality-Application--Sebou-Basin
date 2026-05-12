# Plan de nettoyage sécurisé

## Phase 0 — Sauvegarde

- créer un backup complet des 4 tables source
- enregistrer l’horodatage de sauvegarde
- enregistrer le nombre de lignes avant traitement :
  - qualité globale : `4 894`
  - qualité marché cadre : `3 614`
  - source pollution globale : `243`
  - source pollution marché cadre : `148`

## Phase 1 — Quarantaine

Créer des tables de quarantaine pour :

- doublons inter-tables globale / marché cadre
- paramètres non mappés
- paramètres ambigus
- sources non rattachées
- valeurs invalides

Les catégories de quarantaine prioritaires sont :

- `PARAM_UNMAPPED` : `4 755` lignes confirmées
- `VALUE_NON_NUMERIC` : `2 035` lignes confirmées
- `VALUE_NULL` : `11` lignes confirmées
- `GLOBAL_MARCHE_OVERLAP` : `45` lignes confirmées
- `SOURCE_UNMAPPED / SOURCE_AMBIGUOUS` : `240` points source distincts à rapprocher

## Phase 2 — Nettoyage contrôlé

Supprimer uniquement après validation explicite :

- doublons exacts s’il y en a après retraitement
- lignes techniquement corrompues confirmées
- lignes strictement vides

Ne pas supprimer à ce stade :

- paramètres ambigus
- paramètres non mappés
- sources non rattachées
- valeurs extrêmes
- recouvrements globale / marché cadre non arbitrés

## Phase 3 — Réintégration

Après validation métier :

- compléter les mappings paramètres
- compléter ou corriger les rattachements source
- réintégrer les lignes corrigées depuis la quarantaine
- rejouer un dry-run de fusion

## Phase 4 — Validation

- comparer les volumes avant / après
- vérifier la traçabilité des lignes déplacées
- vérifier qu’aucune suppression n’a dépassé le périmètre validé
- vérifier les vues et restitutions métier impactées

## Recommandation centrale

Le risque principal n’est pas un doublon brut. Le risque principal est une **suppression prématurée de données encore utiles mais ambiguës**.

Le bon ordre est donc :

1. backup
2. quarantaine
3. validation métier
4. nettoyage ciblé
5. réintégration contrôlée
