# Recommandation Finale

Suite à cet audit (Phase 1 / Read-Only), voici les décisions d'architecture recommandées pour la fusion des 4 sources Qualité de l'eau.

| Décision | Recommandation | Détail |
| -------- | -------------- | ------ |
| **Fusion physique immédiate** | **NON** | Les risques de doublonnage et de perte de données historiques sont trop élevés. La base contient de nombreux paramètres non mappés et des incohérences de noms de stations. |
| **Vue unifiée progressive** | **OUI** | Phase D du plan : créer une vue unifiée qui empile (UNION ALL) les données nettoyées, en priorisant `sebou` sur `riviere`. |
| **Suppression directe redondances** | **NON** | Les redondances métier fortes doivent transiter par le `staging` pour audit visuel par le métier avant toute purge physique. |
| **Staging/quarantine** | **OUI** | Obligatoire pour intercepter les anomalies (paramètres inconnus, stations orphelines, valeurs négatives). |
| **Maintien anciennes tables temporairement** | **OUI** | Maintenir les 4 tables sources pendant 3 mois après la mise en production de la table `qualite.mesure_qualite_unifiee` pour assurer le fallback. |
| **Bascule API progressive** | **OUI** | Modifier les routeurs (`backend/app/routers/quality.py`) un par un pour taper sur la vue unifiée et observer le rendu sur le Dashboard Qualité. |

## Décision complémentaire — mesure_qualite_sebou

Après audit de couverture stricte, `qualite.mesure_qualite_sebou` n’est pas un sous-ensemble de `qualite.mesure_qualite_riviere`.

Résultat :
- lignes `sebou` : 49 954
- lignes `riviere` : 59 535
- lignes `sebou` retrouvées strictement dans `riviere` : 0
- couverture stricte : 0 %

Décision :
- conserver `qualite.mesure_qualite_sebou`
- ne pas supprimer
- ne pas remplacer par `mesure_qualite_riviere`
- garder `sebou` comme source officielle des stations sentinelles
- garder `riviere` comme historique rivière distinct

## Nouvelle architecture recommandée

```text
Dashboard DG / sentinelles
→ qualite.mesure_qualite_sebou

Dashboard Qualité / historique rivière
→ qualite.mesure_qualite_riviere

Vue unifiée éventuelle
→ UNION logique avec support_type :
   - SENTINELLE
   - RIVIERE
   - BARRAGE
   - BARRAGE_GARDE
```

### Statut final

```text
FUSION_PHYSIQUE = NON
VUE_UNIFIEE = OUI
SUPPRESSION_SEBOU = INTERDITE
```
