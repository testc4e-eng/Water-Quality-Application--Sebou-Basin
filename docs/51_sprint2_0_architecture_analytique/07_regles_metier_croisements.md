# 7. Règles Métier de Croisements

Le Backend ET le Frontend doivent empêcher (ou avertir) lors de croisements infructueux.

## Croisements Autorisés (Green)
- Précipitation (Météo) ↔ Débit (Hydro)
- Débit (Hydro) ↔ Lâcher (Barrage)
- Qualité (Concentration) ↔ Débit (Hydro)
- Qualité (Concentration) ↔ Pollution (Charges)
- Volume (Barrage) ↔ Lâcher (Barrage)

## Avertissements (Yellow - UI Warning)
Les avertissements sont stockés dans le tableau `warnings` du Workspace.
- **Unités différentes** : Avertissement UX "Assurez-vous de lire le bon axe Y".
- **Fréquences différentes** : Superposer une donnée brute avec du mensuel.
- **Micro-série** : Une des séries sélectionnées possède moins de 5 points.
- **Manque de chevauchement** : Période temporelle sans chevauchement ("Vous comparez 2018 avec 2025").

## Blocages (Red - Refus strict)
- Somme mathématique / Aggrégation automatique de paramètres hétérogènes (On superpose, on ne somme pas).
- Requête de corrélation (`/compare`) si les deux séries ont moins de 10 points communs alignés temporellement.
- Comparaison (au sens backend strict) sans aucune période temporelle commune.
