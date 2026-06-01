# Tests Post-Reconnexion

Une fois la Phase D.1 exécutée, les tests suivants doivent être validés.

## 1. Tests de Connectivité
- [ ] Le composant principal doit contenir > 600 nœuds (au lieu de 267).
- [ ] Le nombre de composants isolés doit descendre en dessous de 10.
- [ ] Le composant `ISOLATED_ACCEPTED` doit rester isolé.

## 2. Tests de Routage
- [ ] **Fès -> Barrage de Garde** : Chemin continu sans rupture topologique.
- [ ] **Oued Beht -> Barrage de Garde** : Vérifier que le snapping à la confluence Beht/Sebou est effectif.
- [ ] **Affluents Nord** : Vérifier la connexion des micro-réseaux du Rif.

## 3. Validation Hydraulique
- [ ] Aucun cycle ne doit être introduit.
- [ ] Le sens d'écoulement doit rester cohérent (Z_Max -> Z_Min).

## 4. QA Frontend
- [ ] Visualisation par `component_id` : Le réseau principal doit être d'une seule couleur unie.
- [ ] Les flèches de direction doivent être alignées.
