# Classification finale

## Catégorie retenue

**E. MODELE_DE_DONNEES_INCORRECT**

## Pourquoi cette catégorie

Le problème principal n’est ni la clé métier, ni le mapping station, ni l’unité.

La table est bloquée parce que le modèle actuel de reprise n’est pas assez robuste pour `hydro.mesure_debit` :

1. la source préparée repose sur `ctid` ;
2. la cible `hydro.mesure_debit` ne stocke ni `source_row_id`, ni `source_system`, ni hash métier, ni audit de provenance ;
3. il existe `1 553` contradictions de valeur sur clé identique, ce qui interdit un `UPSERT` aveugle ;
4. il existe `136 468` clés en cible non couvertes par la source préparée actuelle, donc la cible n’est pas un simple sous-ensemble cohérent.

## Pourquoi les autres catégories ne conviennent pas

- `A. INSERT_ONLY_MISSING` :
  impossible sans provenance stable et sans résoudre les contradictions
- `B. UPSERT_METIER` :
  dangereux sans savoir quelle version fait foi sur les `1 553` conflits
- `C. RESET_AND_RELOAD` :
  prématuré tant que la logique de parsing/scaling des débits contradictoires n’est pas corrigée
- `D. REBUILD_MAPPING_REQUIRED` :
  non, le mapping station est complet et sans collision
