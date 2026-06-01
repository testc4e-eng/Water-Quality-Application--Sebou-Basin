# Tests Post-Cleanup

## 1. Test d'intégrité
- [ ] Nombre d'arêtes à 0m == 0.
- [ ] Aucun segment dupliqué.
- [ ] La traversabilité entre Fès et le barrage est maintenue.

## 2. Test des Cycles
- [ ] `nx.cycle_basis(G)` doit renvoyer 0 (ou uniquement les cycles naturels validés).

## 3. Test de connectivité
- [ ] Le composant principal doit représenter > 85% du réseau total.
- [ ] Les barrages majeurs doivent être connectés au composant principal.
