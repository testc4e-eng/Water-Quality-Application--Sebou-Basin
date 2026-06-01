# Audit des Gaps Réseau (Undershoots & Nœuds)

## Analyse des Déconnexions Physiques
L'audit du 14 Mai 2026 a révélé trois types de déconnexions majeures empêchant la traversabilité du réseau.

### 1. Undershoots (Dist < 1m)
**20 segments critiques** détectés où l'extrémité touche littéralement un autre tronçon sans être connectée topologiquement.
- Exemple : Edge 626 touche Edge 630 (dist 0.00m).
- Exemple : Edge 169 touche Edge 144 (dist 0.00m).

> [!CAUTION]
> Ces undershoots sont les premiers responsables de la fragmentation. Un simple snapping sur le segment le plus proche résoudrait ~80% de ces cas.

### 2. Gaps aux Nœuds (Micro-Gaps)
Des extrémités proches mais non confondues :
- Edge 43 -> 128 (0.00m)
- Edge 533 -> 606 (0.02m)
- Edge 571 -> 619 (0.10m)

### 3. Classification des Gaps (Stats)
| Classe | Nb Détectés | Action Recommandée |
| :--- | :--- | :--- |
| **GAP_MICRO** (< 5m) | ~150 | Snapping Automatique |
| **GAP_SMALL** (5-25m) | ~45 | Snapping Validé |
| **GAP_MEDIUM** (25-50m) | ~12 | Vérification Manuelle |
| **GAP_LARGE** (> 50m) | 5 | Investigation (Bassin ?) |

## Plan de Remédiation
Le script `08_sql_snapping_prepare_A_VALIDER.sql` devra traiter en priorité les undershoots de distance < 0.1m.
